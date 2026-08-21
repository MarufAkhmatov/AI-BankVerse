// docs/21_MOCK_BANKING_BACKEND.md — full mock implementation of IBankingProvider.
// The client must never be able to tell this apart from a production backend
// (docs/21 §9) beyond the value of AI_PROVIDER / BANKING_PROVIDER configuration.

import {
  type Account,
  type BankingError,
  type BankingErrorCode,
  type CalculateCreditInput,
  type CalculateCreditResult,
  type ConfirmPaymentInput,
  type ConfirmPaymentResult,
  type CreditProduct,
  type DepositProduct,
  type GetTransactionsOptions,
  type IAuditSink,
  type IBankingProvider,
  type PreparePaymentInput,
  type PreparePaymentResult,
  type Transaction,
  generateId,
  generateTraceId,
  generateTransactionId,
  maskAccountNumber,
  nowIso,
  simulateLatency,
} from "@bankverse/domain";

const DEMO_USER_ID = "user_demo";
const DEMO_ACCOUNT_ID = "acc_demo";
/** Matches the masking example in docs/26_DATABASE_SCHEMA.md §13 verbatim. */
const DEMO_ACCOUNT_NUMBER = "8600123456781234";
const DEMO_CUSTOMER_NAME = "Demo Customer";

/** Amount sentinel used by tests/demo to force a SERVICE_UNAVAILABLE — docs/21 §6. */
const SENTINEL_TIMEOUT_AMOUNT = 999_999_999;

interface PendingPayment {
  paymentId: string;
  provider: string;
  accountId: string;
  amount: number;
  currency: Account["currency"];
  createdAt: number;
}

export interface MockBankingProviderOptions {
  /** Override for tests — defaults to the 200-800ms simulated latency from docs/21 §5. */
  latency?: () => Promise<void>;
  auditSink?: IAuditSink;
}

export class MockBankingProvider implements IBankingProvider {
  private readonly accounts = new Map<string, Account>();
  private readonly transactions = new Map<string, Transaction[]>();
  private readonly pendingPayments = new Map<string, PendingPayment>();
  private readonly idempotencyCache = new Map<string, ConfirmPaymentResult | BankingError>();
  private readonly latency: () => Promise<void>;
  private readonly auditSink?: IAuditSink;

  constructor(options: MockBankingProviderOptions = {}) {
    this.latency = options.latency ?? (() => simulateLatency());
    this.auditSink = options.auditSink;

    this.accounts.set(DEMO_ACCOUNT_ID, {
      id: DEMO_ACCOUNT_ID,
      userId: DEMO_USER_ID,
      accountNumber: DEMO_ACCOUNT_NUMBER,
      currency: "UZS",
      balance: 25_000_000,
      status: "ACTIVE",
    });
    this.transactions.set(DEMO_ACCOUNT_ID, []);
  }

  private findAccountByNumber(accountNumber: string): Account | undefined {
    const normalized = accountNumber.replace(/\s+/g, "");
    return [...this.accounts.values()].find((a) => a.accountNumber === normalized);
  }

  private error(code: BankingErrorCode, message: string): BankingError {
    return { success: false, errorCode: code, message, traceId: generateTraceId() };
  }

  private async audit(eventType: string, metadata: Record<string, unknown>): Promise<void> {
    if (!this.auditSink) return;
    await this.auditSink.record({
      traceId: generateTraceId(),
      userId: DEMO_USER_ID,
      eventType,
      resultMetadata: metadata,
    });
  }

  async getBalance(accountId: string): Promise<Account | BankingError> {
    await this.latency();
    const account = this.accounts.get(accountId);
    if (!account) return this.error("INVALID_ACCOUNT", `Unknown account: ${accountId}`);
    return account;
  }

  async getTransactions(accountId: string, options: GetTransactionsOptions = {}): Promise<Transaction[] | BankingError> {
    await this.latency();
    if (!this.accounts.has(accountId)) {
      return this.error("INVALID_ACCOUNT", `Unknown account: ${accountId}`);
    }
    const list = this.transactions.get(accountId) ?? [];
    const limited = options.limit ? list.slice(-options.limit) : list;
    return [...limited].reverse();
  }

  async prepareUtilityPayment(input: PreparePaymentInput): Promise<PreparePaymentResult | BankingError> {
    await this.latency();

    if (input.provider === "unavailable") {
      return this.error("SERVICE_UNAVAILABLE", `Payment provider "${input.provider}" is temporarily unavailable.`);
    }
    if (input.amount === SENTINEL_TIMEOUT_AMOUNT) {
      return this.error("TIMEOUT", "The payment provider did not respond in time.");
    }

    const account = this.findAccountByNumber(input.accountNumber);
    if (!account) {
      return this.error("INVALID_ACCOUNT", `No account found for ${maskAccountNumber(input.accountNumber)}.`);
    }
    if (input.amount > account.balance) {
      return this.error(
        "INSUFFICIENT_FUNDS",
        `Requested ${input.amount} ${account.currency} exceeds available balance.`,
      );
    }

    const paymentId = generateId("pay");
    this.pendingPayments.set(paymentId, {
      paymentId,
      provider: input.provider,
      accountId: account.id,
      amount: input.amount,
      currency: account.currency,
      createdAt: Date.now(),
    });

    await this.audit("PAYMENT_PREPARED", {
      paymentId,
      provider: input.provider,
      accountNumber: maskAccountNumber(input.accountNumber),
      amount: input.amount,
    });

    return {
      success: true,
      paymentId,
      provider: input.provider,
      customerName: DEMO_CUSTOMER_NAME,
      amount: input.amount,
      currency: account.currency,
      requiresConfirmation: true,
    };
  }

  async confirmUtilityPayment(
    input: ConfirmPaymentInput,
    idempotencyKey: string,
  ): Promise<ConfirmPaymentResult | BankingError> {
    const cached = this.idempotencyCache.get(idempotencyKey);
    if (cached) return cached;

    await this.latency();

    if (!input.confirmed) {
      throw new Error("confirmUtilityPayment called with confirmed=false; do not call unless the user agreed.");
    }

    const pending = this.pendingPayments.get(input.paymentId);
    if (!pending) {
      const result = this.error("INVALID_ACCOUNT", `Unknown or already-resolved paymentId: ${input.paymentId}`);
      this.idempotencyCache.set(idempotencyKey, result);
      return result;
    }

    const account = this.accounts.get(pending.accountId)!;
    if (pending.amount > account.balance) {
      const result = this.error("INSUFFICIENT_FUNDS", "Balance changed since the payment was prepared.");
      this.idempotencyCache.set(idempotencyKey, result);
      return result;
    }

    account.balance -= pending.amount;
    this.pendingPayments.delete(input.paymentId);

    const transaction: Transaction = {
      id: generateTransactionId(),
      accountId: account.id,
      type: "utility_payment",
      amount: pending.amount,
      currency: pending.currency,
      provider: pending.provider,
      status: "SUCCESS",
      createdAt: nowIso(),
      completedAt: nowIso(),
      metadata: { paymentId: pending.paymentId },
    };
    this.transactions.get(account.id)!.push(transaction);

    const result: ConfirmPaymentResult = {
      success: true,
      transactionId: transaction.id,
      status: "SUCCESS",
      receiptId: generateId("receipt"),
    };
    this.idempotencyCache.set(idempotencyKey, result);

    await this.audit("PAYMENT_COMPLETED", {
      transactionId: transaction.id,
      paymentId: pending.paymentId,
      amount: pending.amount,
    });

    return result;
  }

  async getCreditProducts(): Promise<CreditProduct[]> {
    await this.latency();
    return [
      { id: "credit_consumer", name: "Consumer Credit", minAmount: 1_000_000, maxAmount: 100_000_000, annualRatePercent: 24, maxTermMonths: 36, currency: "UZS" },
      { id: "credit_auto", name: "Auto Credit", minAmount: 20_000_000, maxAmount: 500_000_000, annualRatePercent: 21, maxTermMonths: 60, currency: "UZS" },
      { id: "credit_mortgage", name: "Mortgage", minAmount: 100_000_000, maxAmount: 2_000_000_000, annualRatePercent: 18, maxTermMonths: 240, currency: "UZS" },
    ];
  }

  async calculateCredit(input: CalculateCreditInput): Promise<CalculateCreditResult> {
    await this.latency();
    const products = await this.getCreditProducts();
    const product = products.find((p) => p.id === input.productId);
    if (!product) throw new Error(`Unknown credit product: ${input.productId}`);

    const monthlyRate = product.annualRatePercent / 100 / 12;
    const n = input.termMonths;
    const monthlyPayment =
      monthlyRate === 0
        ? input.amount / n
        : (input.amount * monthlyRate * (1 + monthlyRate) ** n) / ((1 + monthlyRate) ** n - 1);

    const totalPayment = monthlyPayment * n;
    return {
      monthlyPayment: Math.round(monthlyPayment),
      totalPayment: Math.round(totalPayment),
      interest: Math.round(totalPayment - input.amount),
      currency: product.currency,
    };
  }

  async getDepositProducts(): Promise<DepositProduct[]> {
    await this.latency();
    return [
      { id: "deposit_flex", name: "Flexible Savings", currency: "UZS", termMonths: 3, annualRatePercent: 14, minAmount: 500_000 },
      { id: "deposit_standard", name: "Standard Term Deposit", currency: "UZS", termMonths: 12, annualRatePercent: 19, minAmount: 1_000_000 },
      { id: "deposit_premium", name: "Premium Term Deposit", currency: "UZS", termMonths: 24, annualRatePercent: 21, minAmount: 10_000_000 },
    ];
  }
}

export { DEMO_ACCOUNT_ID, DEMO_ACCOUNT_NUMBER, DEMO_USER_ID, DEMO_CUSTOMER_NAME };
