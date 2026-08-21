// Provider interfaces. Implementations must never be depended on directly by
// orchestration/gameplay code — see docs/09_TECHNICAL_ARCHITECTURE.md §5 and
// docs/36_UNREAL_IMPLEMENTATION_MAP.md §12 (Design Rule).

import type {
  Account,
  AgentResponse,
  AuditEvent,
  BankingError,
  CalculateCreditInput,
  CalculateCreditResult,
  ConfirmPaymentInput,
  ConfirmPaymentResult,
  ConversationMessage,
  CreditProduct,
  DepositProduct,
  IntentResult,
  Language,
  PreparePaymentInput,
  PreparePaymentResult,
  Transaction,
} from "./models.js";

export interface GetTransactionsOptions {
  fromDate?: string;
  toDate?: string;
  limit?: number;
}

/** docs/21_MOCK_BANKING_BACKEND.md, docs/37_AI_TOOL_SCHEMA.md */
export interface IBankingProvider {
  getBalance(accountId: string): Promise<Account | BankingError>;
  getTransactions(accountId: string, options?: GetTransactionsOptions): Promise<Transaction[] | BankingError>;
  prepareUtilityPayment(input: PreparePaymentInput): Promise<PreparePaymentResult | BankingError>;
  /** `idempotencyKey` must make retries of the same confirmation a no-op — docs/27 §13. */
  confirmUtilityPayment(
    input: ConfirmPaymentInput,
    idempotencyKey: string,
  ): Promise<ConfirmPaymentResult | BankingError>;
  getCreditProducts(): Promise<CreditProduct[]>;
  calculateCredit(input: CalculateCreditInput): Promise<CalculateCreditResult>;
  getDepositProducts(): Promise<DepositProduct[]>;
}

/** docs/16_AI_ORCHESTRATION_ARCHITECTURE.md §14, docs/38_AI_PROVIDER_ADAPTER.md */
export interface IAIProvider {
  classifyIntent(text: string, context?: ConversationMessage[]): Promise<IntentResult>;
  generateResponse(intent: IntentResult, context: Record<string, unknown>): Promise<AgentResponse>;
}

/** docs/39_STT_TTS_PIPELINE.md §4 */
export interface ISTTProvider {
  transcribe(input: string): Promise<{ text: string; language: Language; confidence: number }>;
}

/** docs/39_STT_TTS_PIPELINE.md §5 */
export interface ITTSProvider {
  synthesize(text: string, language: Language): Promise<{ audioUrl: string | null; text: string }>;
}

/** docs/12_SECURITY_AND_COMPLIANCE.md — every sensitive operation ends in an audit event. */
export interface IAuditSink {
  record(event: Omit<AuditEvent, "id" | "createdAt">): Promise<AuditEvent>;
  list(filter?: { userId?: string; traceId?: string }): Promise<AuditEvent[]>;
}
