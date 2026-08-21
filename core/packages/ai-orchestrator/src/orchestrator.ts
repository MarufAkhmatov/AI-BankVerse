// docs/16_AI_ORCHESTRATION_ARCHITECTURE.md §2 — the request lifecycle:
// detectIntent -> resolveContext -> routeAgent -> selectTool -> authorize -> execute -> respond.
// This module depends only on @bankverse/domain interfaces (docs/36 §12 Design Rule) — the
// API layer is the composition root that injects concrete Mock or Production providers.

import {
  type AgentResponse,
  type AgentRegistry,
  type BankingError,
  type IAIProvider,
  type IBankingProvider,
  type IntentResult,
  generateId,
} from "@bankverse/domain";
import type { Session } from "./session.js";

/** docs/05_BANKING_SERVICES.md — for the vertical slice, the bill is looked up, not typed. */
const DEMO_OUTSTANDING_BILL = 185_000;
const DEFAULT_PROVIDER = "electricity";

export interface ProcessMessageResult {
  session: Session;
  response: AgentResponse;
  agentId: string;
}

export interface OrchestratorOptions {
  /** The single demo account this vertical slice operates against — docs/21 §2. */
  defaultAccountNumber: string;
}

export class Orchestrator {
  constructor(
    private readonly ai: IAIProvider,
    private readonly banking: IBankingProvider,
    private readonly agents: AgentRegistry,
    private readonly options: OrchestratorOptions,
  ) {}

  async processMessage(session: Session, text: string): Promise<ProcessMessageResult> {
    session.state = "LISTENING";
    this.pushMessage(session, "user", text);
    session.state = "THINKING";

    if (session.pendingPayment) {
      return this.resolvePendingConfirmation(session, text);
    }

    // --- detectIntent -----------------------------------------------------------------
    const intent = await this.ai.classifyIntent(text, session.history);
    session.language = intent.confidence > 0 ? intent.language : session.language;

    // --- resolveContext / routeAgent ---------------------------------------------------
    session.state = "ROUTING";
    const agent = this.agents.findByIntent(intent.intent);
    const agentId = agent?.agentId ?? "reception";

    if (intent.intent === "UNKNOWN" || intent.confidence === 0) {
      session.state = "IDLE";
      const response = await this.ai.generateResponse(intent, { stage: "clarify" });
      this.pushMessage(session, "agent", response.text, intent.intent);
      return { session, response, agentId };
    }

    if (intent.intent === "UTILITY_PAYMENT") {
      return this.startUtilityPayment(session, intent, agentId);
    }

    // --- generic informational intents (selectTool/authorize/execute are no-ops here) ---
    session.state = "COMPLETED";
    const response = await this.ai.generateResponse(intent, { stage: "acknowledge" });
    this.pushMessage(session, "agent", response.text, intent.intent);
    return { session, response, agentId };
  }

  private async startUtilityPayment(
    session: Session,
    intent: IntentResult,
    agentId: string,
  ): Promise<ProcessMessageResult> {
    session.state = "PROCESSING";
    const amount = intent.slots.amount ? Number(intent.slots.amount) : DEMO_OUTSTANDING_BILL;
    const provider = intent.service ?? DEFAULT_PROVIDER;

    // --- selectTool / authorize / execute (prepare) ------------------------------------
    const prepared = await this.banking.prepareUtilityPayment({
      provider,
      accountNumber: this.options.defaultAccountNumber,
      amount,
    });

    if (!prepared.success) {
      session.state = "FAILED";
      const response = await this.ai.generateResponse(intent, {
        stage: "failure",
        data: { errorMessage: describeBankingError(prepared) },
      });
      this.pushMessage(session, "agent", response.text, intent.intent);
      return { session, response, agentId };
    }

    session.pendingPayment = {
      paymentId: prepared.paymentId,
      provider: prepared.provider,
      amount: prepared.amount,
      currency: prepared.currency,
    };
    session.state = "WAITING_CONFIRMATION";

    // --- respond (ask for confirmation — docs/12 "USER CONFIRMATION" gate) --------------
    const response = await this.ai.generateResponse(intent, {
      stage: "confirm",
      data: { amount: prepared.amount, currency: prepared.currency },
    });
    this.pushMessage(session, "agent", response.text, intent.intent);
    return { session, response, agentId };
  }

  private async resolvePendingConfirmation(session: Session, text: string): Promise<ProcessMessageResult> {
    const pending = session.pendingPayment!;
    const agent = this.agents.findByIntent("UTILITY_PAYMENT");
    const agentId = agent?.agentId ?? "reception";
    const syntheticIntent: IntentResult = {
      intent: "UTILITY_PAYMENT",
      requiresConfirmation: true,
      confidence: 1,
      language: session.language,
      slots: {},
    };

    if (!isAffirmative(text)) {
      session.pendingPayment = undefined;
      session.state = "IDLE";
      const response = await this.ai.generateResponse(syntheticIntent, {
        stage: "failure",
        data: { errorMessage: "cancelled by user" },
      });
      this.pushMessage(session, "agent", response.text, "UTILITY_PAYMENT");
      return { session, response, agentId };
    }

    session.state = "EXECUTING";
    // --- execute (confirm) — the ONLY place a success message may be produced ----------
    const result = await this.banking.confirmUtilityPayment(
      { paymentId: pending.paymentId, confirmed: true, userId: session.userId, sessionId: session.id },
      pending.paymentId, // paymentId doubles as the idempotency key: one payment, one confirmation.
    );
    session.pendingPayment = undefined;

    if (!result.success) {
      session.state = "FAILED";
      const response = await this.ai.generateResponse(syntheticIntent, {
        stage: "failure",
        data: { errorMessage: describeBankingError(result) },
      });
      this.pushMessage(session, "agent", response.text, "UTILITY_PAYMENT");
      return { session, response, agentId };
    }

    // Success wording is only ever reached when the backend returned status === "SUCCESS".
    session.state = "COMPLETED";
    const response = await this.ai.generateResponse(syntheticIntent, {
      stage: "success",
      data: { transactionId: result.transactionId },
    });
    this.pushMessage(session, "agent", response.text, "UTILITY_PAYMENT");
    return { session, response, agentId };
  }

  private pushMessage(session: Session, role: "user" | "agent", text: string, intent?: IntentResult["intent"]) {
    session.history.push({
      id: generateId("msg"),
      conversationId: session.id,
      role,
      text,
      intent,
      createdAt: new Date().toISOString(),
    });
  }
}

function describeBankingError(error: BankingError): string {
  return `${error.errorCode}: ${error.message}`;
}

const AFFIRMATIVE = /\b(ha|xa|tasdiqlayman|tasdiqlash|да|yes|confirm|ok|okay)\b/i;
function isAffirmative(text: string): boolean {
  return AFFIRMATIVE.test(text.trim());
}
