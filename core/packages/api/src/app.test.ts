import { DEMO_ACCOUNT_ID } from "@bankverse/banking-mock";
import { beforeEach, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";
import { buildApp } from "./app.js";
import { buildContainer } from "./container.js";
import type { Container } from "./container.js";

describe("API — /api/v1", () => {
  let app: FastifyInstance;
  let container: Container;

  beforeEach(() => {
    container = buildContainer();
    app = buildApp(container);
  });

  it("returns the demo account balance", async () => {
    const res = await app.inject({ method: "GET", url: `/api/v1/accounts/${DEMO_ACCOUNT_ID}` });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toMatchObject({ balance: 25_000_000, currency: "UZS" });
  });

  it("404s with a structured error for an unknown account", async () => {
    const res = await app.inject({ method: "GET", url: "/api/v1/accounts/does-not-exist" });
    expect(res.statusCode).toBe(404);
    expect(res.json().error.code).toBe("INVALID_ACCOUNT");
  });

  it("lists credit products", async () => {
    const res = await app.inject({ method: "GET", url: "/api/v1/credits/products" });
    expect(res.statusCode).toBe(200);
    expect(res.json().products.length).toBeGreaterThan(0);
  });

  it("classifies intent over HTTP", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/v1/ai/intent",
      payload: { text: "Elektr energiyasiga to'lov qilmoqchiman." },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().intent).toBe("UTILITY_PAYMENT");
  });

  it("drives the full electricity payment vertical slice through /ai/chat (docs/46)", async () => {
    const first = await app.inject({
      method: "POST",
      url: "/api/v1/ai/chat",
      payload: { userId: "user_demo", text: "Elektr energiyasiga to'lov qilmoqchiman." },
    });
    expect(first.statusCode).toBe(200);
    const firstBody = first.json();
    expect(firstBody.agentId).toBe("payment");
    expect(firstBody.state).toBe("WAITING_CONFIRMATION");
    expect(firstBody.response.text).toBe("185,000 UZS to'lovni tasdiqlaysizmi?");

    const second = await app.inject({
      method: "POST",
      url: "/api/v1/ai/chat",
      payload: { sessionId: firstBody.sessionId, userId: "user_demo", text: "Ha." },
    });
    expect(second.statusCode).toBe(200);
    const secondBody = second.json();
    expect(secondBody.state).toBe("COMPLETED");
    expect(secondBody.response.text).toBe("To'lov muvaffaqiyatli amalga oshirildi.");

    const balance = await app.inject({ method: "GET", url: `/api/v1/accounts/${DEMO_ACCOUNT_ID}` });
    expect(balance.json().balance).toBe(25_000_000 - 185_000);
  });

  it("rejects a confirmation request that is missing the Idempotency-Key header", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/v1/payments/utility/confirm",
      payload: { paymentId: "pay_doesnotmatter", confirmed: true },
    });
    expect(res.statusCode).toBe(400);
  });

  it("lists the agent roster with live status", async () => {
    const res = await app.inject({ method: "GET", url: "/api/v1/agents" });
    expect(res.statusCode).toBe(200);
    const ids = res.json().agents.map((a: { id: string }) => a.id);
    expect(ids).toContain("reception");
    expect(ids).toContain("payment");
  });
});
