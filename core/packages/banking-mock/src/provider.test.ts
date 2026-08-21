import { randomUUID } from "node:crypto";
import { InMemoryAuditSink } from "@bankverse/domain";
import { beforeEach, describe, expect, it } from "vitest";
import { DEMO_ACCOUNT_ID, DEMO_ACCOUNT_NUMBER, MockBankingProvider } from "./provider.js";

function newProvider() {
  return new MockBankingProvider({ latency: async () => {}, auditSink: new InMemoryAuditSink() });
}

describe("MockBankingProvider — electricity payment flow", () => {
  let provider: MockBankingProvider;

  beforeEach(() => {
    provider = newProvider();
  });

  it("prepares and confirms a valid payment, deducting the balance exactly once", async () => {
    const prepared = await provider.prepareUtilityPayment({
      provider: "electricity",
      accountNumber: DEMO_ACCOUNT_NUMBER,
      amount: 185_000,
    });
    expect(prepared.success).toBe(true);
    if (!prepared.success) return;

    const before = await provider.getBalance(DEMO_ACCOUNT_ID);
    expect("balance" in before && before.balance).toBe(25_000_000);

    const confirmed = await provider.confirmUtilityPayment(
      { paymentId: prepared.paymentId, confirmed: true, userId: "user_demo", sessionId: "s1" },
      randomUUID(),
    );
    expect(confirmed.success).toBe(true);
    if (!confirmed.success) return;
    expect(confirmed.status).toBe("SUCCESS");
    expect(confirmed.transactionId).toMatch(/^TXN-/);

    const after = await provider.getBalance(DEMO_ACCOUNT_ID);
    expect("balance" in after && after.balance).toBe(25_000_000 - 185_000);
  });

  it("rejects an unknown account number", async () => {
    const result = await provider.prepareUtilityPayment({
      provider: "electricity",
      accountNumber: "0000000000000000",
      amount: 10_000,
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errorCode).toBe("INVALID_ACCOUNT");
  });

  it("rejects a payment larger than the account balance", async () => {
    const result = await provider.prepareUtilityPayment({
      provider: "electricity",
      accountNumber: DEMO_ACCOUNT_NUMBER,
      amount: 1_000_000_000,
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errorCode).toBe("INSUFFICIENT_FUNDS");
  });

  it("reports SERVICE_UNAVAILABLE for the unavailable-provider sentinel", async () => {
    const result = await provider.prepareUtilityPayment({
      provider: "unavailable",
      accountNumber: DEMO_ACCOUNT_NUMBER,
      amount: 10_000,
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errorCode).toBe("SERVICE_UNAVAILABLE");
  });

  it("reports TIMEOUT for the timeout sentinel amount", async () => {
    const result = await provider.prepareUtilityPayment({
      provider: "electricity",
      accountNumber: DEMO_ACCOUNT_NUMBER,
      amount: 999_999_999,
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.errorCode).toBe("TIMEOUT");
  });

  it("never double-charges when the same confirmation is retried (idempotency)", async () => {
    const prepared = await provider.prepareUtilityPayment({
      provider: "electricity",
      accountNumber: DEMO_ACCOUNT_NUMBER,
      amount: 185_000,
    });
    if (!prepared.success) throw new Error("expected prepare to succeed");

    const key = randomUUID();
    const first = await provider.confirmUtilityPayment(
      { paymentId: prepared.paymentId, confirmed: true, userId: "user_demo", sessionId: "s1" },
      key,
    );
    const second = await provider.confirmUtilityPayment(
      { paymentId: prepared.paymentId, confirmed: true, userId: "user_demo", sessionId: "s1" },
      key,
    );

    expect(second).toEqual(first);

    const balance = await provider.getBalance(DEMO_ACCOUNT_ID);
    expect("balance" in balance && balance.balance).toBe(25_000_000 - 185_000);
  });

  it("calculates credit as a standard amortized monthly payment", async () => {
    const result = await provider.calculateCredit({ productId: "credit_consumer", amount: 10_000_000, termMonths: 12 });
    expect(result.monthlyPayment).toBeGreaterThan(0);
    expect(result.totalPayment).toBeGreaterThan(10_000_000);
    expect(result.interest).toBe(result.totalPayment - 10_000_000);
  });
});
