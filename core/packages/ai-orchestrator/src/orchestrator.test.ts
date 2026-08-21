import { InMemoryAuditSink } from "@bankverse/domain";
import { MockAIProvider } from "@bankverse/ai-provider-mock";
import { DEMO_ACCOUNT_ID, DEMO_ACCOUNT_NUMBER, MockBankingProvider } from "@bankverse/banking-mock";
import { beforeEach, describe, expect, it } from "vitest";
import { buildDefaultAgentRegistry } from "./agents.js";
import { Orchestrator } from "./orchestrator.js";
import { createSession, type Session } from "./session.js";

function newOrchestrator() {
  const banking = new MockBankingProvider({ latency: async () => {}, auditSink: new InMemoryAuditSink() });
  const ai = new MockAIProvider();
  const agents = buildDefaultAgentRegistry();
  const orchestrator = new Orchestrator(ai, banking, agents, { defaultAccountNumber: DEMO_ACCOUNT_NUMBER });
  return { orchestrator, banking, agents };
}

describe("Orchestrator — full electricity payment vertical slice (docs/46 Scenarios 001-010)", () => {
  let orchestrator: Orchestrator;
  let banking: MockBankingProvider;
  let session: Session;

  beforeEach(() => {
    ({ orchestrator, banking } = newOrchestrator());
    session = createSession("user_demo");
  });

  it("routes UTILITY_PAYMENT to the payment agent and asks for confirmation without the user walking anywhere", async () => {
    const { response, session: updated, agentId } = await orchestrator.processMessage(
      session,
      "Elektr energiyasiga to'lov qilmoqchiman.",
    );

    expect(agentId).toBe("payment");
    expect(updated.state).toBe("WAITING_CONFIRMATION");
    expect(updated.pendingPayment).toBeDefined();
    expect(response.text).toBe("185,000 UZS to'lovni tasdiqlaysizmi?");
  });

  it("executes the payment only after explicit confirmation, and never before", async () => {
    const before = await banking.getBalance(DEMO_ACCOUNT_ID);
    const balanceBefore = "balance" in before ? before.balance : 0;

    await orchestrator.processMessage(session, "Elektr energiyasiga to'lov qilmoqchiman.");

    const midway = await banking.getBalance(DEMO_ACCOUNT_ID);
    expect("balance" in midway && midway.balance).toBe(balanceBefore); // untouched pre-confirmation

    const { response, session: updated } = await orchestrator.processMessage(session, "Ha, tasdiqlayman.");

    expect(updated.state).toBe("COMPLETED");
    expect(updated.pendingPayment).toBeUndefined();
    expect(response.text).toBe("To'lov muvaffaqiyatli amalga oshirildi.");

    const after = await banking.getBalance(DEMO_ACCOUNT_ID);
    expect("balance" in after && after.balance).toBe(balanceBefore - 185_000);
  });

  it("cancels cleanly when the user declines, without calling the banking backend", async () => {
    await orchestrator.processMessage(session, "Elektr energiyasiga to'lov qilmoqchiman.");
    const { response, session: updated } = await orchestrator.processMessage(session, "Yo'q, bekor qiling.");

    expect(updated.state).toBe("IDLE");
    expect(updated.pendingPayment).toBeUndefined();
    expect(response.text.toLowerCase()).not.toContain("muvaffaqiyatli");
  });

  it("never produces success wording when the backend cannot complete the payment (TIMEOUT sentinel)", async () => {
    const { response, session: updated } = await orchestrator.processMessage(
      session,
      "Elektr uchun 999999999 so'm to'lamoqchiman.",
    );

    expect(updated.state).toBe("FAILED");
    expect(response.text.toLowerCase()).not.toContain("muvaffaqiyatli");
    expect(response.text).toContain("TIMEOUT");
  });

  it("routes a credit request to the credit agent with the documented acknowledgement", async () => {
    const { response, agentId } = await orchestrator.processMessage(session, "Kredit olmoqchiman.");
    expect(agentId).toBe("credit");
    expect(response.text).toBe("Albatta. Siz uchun kredit variantlarini ochaman.");
  });

  it("never gets stuck on an unrecognized request — always offers a next step (docs/02 §11 No Dead Ends)", async () => {
    const { response, agentId, session: updated } = await orchestrator.processMessage(
      session,
      "Bugungi ob-havo qanday?",
    );
    expect(agentId).toBe("reception");
    expect(updated.state).toBe("IDLE");
    expect(response.text.length).toBeGreaterThan(0);
  });
});
