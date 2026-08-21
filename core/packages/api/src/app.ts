// HTTP layer — docs/27_OPENAPI_SPECIFICATION.md. Every response carries a traceId
// (docs/24 §7); PII is masked before it reaches a log line (docs/26 §13).

import Fastify, { type FastifyInstance } from "fastify";
import {
  type BankingError,
  type CalculateCreditInput,
  type ConfirmPaymentInput,
  type PreparePaymentInput,
  generateTraceId,
} from "@bankverse/domain";
import { DEMO_USER_ID } from "@bankverse/banking-mock";
import type { Container } from "./container.js";

function isBankingError(value: unknown): value is BankingError {
  return typeof value === "object" && value !== null && (value as { success?: unknown }).success === false;
}

function errorBody(error: BankingError) {
  return { error: { code: error.errorCode, message: error.message, traceId: error.traceId } };
}

export function buildApp(container: Container): FastifyInstance {
  const app = Fastify({ logger: false });

  app.addHook("onRequest", async (request, reply) => {
    reply.header("X-Trace-Id", generateTraceId());
  });

  // --- Accounts ---------------------------------------------------------------------
  app.get<{ Params: { accountId: string } }>("/api/v1/accounts/:accountId", async (request, reply) => {
    const result = await container.bankingProvider.getBalance(request.params.accountId);
    if (isBankingError(result)) return reply.code(404).send(errorBody(result));
    return result;
  });

  app.get<{ Params: { accountId: string }; Querystring: { limit?: string } }>(
    "/api/v1/accounts/:accountId/transactions",
    async (request, reply) => {
      const limit = request.query.limit ? Number(request.query.limit) : undefined;
      const result = await container.bankingProvider.getTransactions(request.params.accountId, { limit });
      if (isBankingError(result)) return reply.code(404).send(errorBody(result));
      return { transactions: result };
    },
  );

  // --- Payments — utility ------------------------------------------------------------
  app.post<{ Body: PreparePaymentInput }>("/api/v1/payments/utility/prepare", async (request, reply) => {
    const { provider, accountNumber, amount } = request.body ?? ({} as PreparePaymentInput);
    if (!provider || !accountNumber || !(amount > 0)) {
      return reply.code(400).send({
        error: { code: "INVALID_REQUEST", message: "provider, accountNumber and amount > 0 are required.", traceId: generateTraceId() },
      });
    }

    const result = await container.bankingProvider.prepareUtilityPayment({ provider, accountNumber, amount });
    if (isBankingError(result)) return reply.code(422).send(errorBody(result));
    return result;
  });

  app.post<{ Body: Omit<ConfirmPaymentInput, "userId" | "sessionId"> & { userId?: string; sessionId?: string } }>(
    "/api/v1/payments/utility/confirm",
    async (request, reply) => {
      const idempotencyKey = request.headers["idempotency-key"];
      if (typeof idempotencyKey !== "string" || idempotencyKey.length === 0) {
        return reply.code(400).send({
          error: { code: "INVALID_REQUEST", message: "Idempotency-Key header is required.", traceId: generateTraceId() },
        });
      }

      const { paymentId, confirmed, userId, sessionId } = request.body;
      const result = await container.bankingProvider.confirmUtilityPayment(
        { paymentId, confirmed: confirmed ?? true, userId: userId ?? DEMO_USER_ID, sessionId: sessionId ?? "http" },
        idempotencyKey,
      );
      if (isBankingError(result)) return reply.code(422).send(errorBody(result));
      return result;
    },
  );

  // --- Credit ----------------------------------------------------------------------
  app.get("/api/v1/credits/products", async () => ({ products: await container.bankingProvider.getCreditProducts() }));

  app.post<{ Body: CalculateCreditInput }>("/api/v1/credits/calculate", async (request) => {
    return container.bankingProvider.calculateCredit(request.body);
  });

  // --- Deposits ----------------------------------------------------------------------
  app.get("/api/v1/deposits/products", async () => ({ products: await container.bankingProvider.getDepositProducts() }));

  // --- AI ------------------------------------------------------------------------------
  app.post<{ Body: { text: string } }>("/api/v1/ai/intent", async (request) => {
    return container.aiProvider.classifyIntent(request.body.text);
  });

  app.post<{ Body: { sessionId?: string; userId: string; text: string } }>("/api/v1/ai/chat", async (request, reply) => {
    const { sessionId, userId, text } = request.body;
    const session = (sessionId && container.sessions.get(sessionId)) || container.sessions.create(userId);

    const { response, agentId } = await container.orchestrator.processMessage(session, text);
    container.sessions.save(session);

    return {
      sessionId: session.id,
      agentId,
      state: session.state,
      response,
    };
  });

  // --- Voice (text-driven mock — docs/39 §4-5) ------------------------------------------
  app.post<{ Body: { text: string } }>("/api/v1/voice/transcribe", async (request) => {
    return container.sttProvider.transcribe(request.body.text);
  });

  app.post<{ Body: { text: string; language?: "uz" | "ru" | "en" } }>("/api/v1/voice/synthesize", async (request) => {
    return container.ttsProvider.synthesize(request.body.text, request.body.language ?? "uz");
  });

  // --- Agents ----------------------------------------------------------------------------
  app.get("/api/v1/agents", async () => ({ agents: container.agents.listState() }));

  app.get<{ Params: { id: string } }>("/api/v1/agents/:id/status", async (request, reply) => {
    const state = container.agents.getState(request.params.id);
    if (!state) return reply.code(404).send({ error: { code: "NOT_FOUND", message: "Unknown agent", traceId: generateTraceId() } });
    return state;
  });

  return app;
}
