// Data models. Mirrors docs/11_DATA_AND_API_SPECIFICATION.md and docs/26_DATABASE_SCHEMA.md.

export type Currency = "UZS" | "USD" | "EUR";
export type Language = "uz" | "ru" | "en";

export interface User {
  id: string;
  displayName: string;
  preferredLanguage: Language;
  voiceEnabled: boolean;
}

export interface Account {
  id: string;
  userId: string;
  accountNumber: string;
  currency: Currency;
  balance: number;
  status: "ACTIVE" | "BLOCKED";
}

export type TransactionStatus = "PENDING" | "SUCCESS" | "FAILED";

export interface Transaction {
  id: string;
  accountId: string;
  type: string;
  amount: number;
  currency: Currency;
  provider?: string;
  status: TransactionStatus;
  createdAt: string;
  completedAt?: string;
  metadata?: Record<string, unknown>;
}

export type AgentStatus = "AVAILABLE" | "BUSY" | "PROCESSING" | "OFFLINE";

export interface AgentState {
  id: string;
  name: string;
  role: string;
  department: string;
  status: AgentStatus;
  currentTaskId?: string;
  /** 0-100, docs/53_BANK_MANAGER_GAMEPLAY.md workload bands */
  workload: number;
}

export type TaskPriority = "low" | "normal" | "high" | "urgent";
export type TaskStatus = "pending" | "in_progress" | "completed" | "failed";

export interface AgentTask {
  id: string;
  agentId: string;
  type: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
  completedAt?: string;
}

export type ConversationRole = "user" | "agent" | "system";

export interface ConversationMessage {
  id: string;
  conversationId: string;
  role: ConversationRole;
  text: string;
  intent?: IntentCategory;
  createdAt: string;
}

/** docs/16_AI_ORCHESTRATION_ARCHITECTURE.md §4 */
export type IntentCategory =
  | "ACCOUNT_BALANCE"
  | "TRANSACTION_HISTORY"
  | "UTILITY_PAYMENT"
  | "CARD_SERVICE"
  | "CARD_BLOCK"
  | "CARD_REPLACEMENT"
  | "CREDIT_INFORMATION"
  | "CREDIT_APPLICATION"
  | "DEPOSIT_INFORMATION"
  | "DEPOSIT_OPENING"
  | "TRANSFER"
  | "FX"
  | "CUSTOMER_SUPPORT"
  | "HUMAN_ESCALATION"
  | "UNKNOWN";

export interface IntentResult {
  intent: IntentCategory;
  service?: string;
  confidence: number;
  requiresConfirmation: boolean;
  language: Language;
  slots: Record<string, string>;
}

/** docs/16_AI_ORCHESTRATION_ARCHITECTURE.md §7 */
export type ConversationState =
  | "IDLE"
  | "LISTENING"
  | "THINKING"
  | "ROUTING"
  | "PROCESSING"
  | "WAITING_CONFIRMATION"
  | "EXECUTING"
  | "COMPLETED"
  | "FAILED"
  | "ESCALATED";

export interface AuditEvent {
  id: string;
  traceId: string;
  userId?: string;
  agentId?: string;
  eventType: string;
  service?: string;
  requestMetadata?: Record<string, unknown>;
  resultMetadata?: Record<string, unknown>;
  createdAt: string;
}

/** docs/21_MOCK_BANKING_BACKEND.md §6 */
export type BankingErrorCode =
  | "INSUFFICIENT_FUNDS"
  | "INVALID_ACCOUNT"
  | "SERVICE_UNAVAILABLE"
  | "TIMEOUT"
  | "UNKNOWN_ERROR";

export interface BankingError {
  success: false;
  errorCode: BankingErrorCode;
  message: string;
  traceId: string;
}

export interface PreparePaymentInput {
  provider: string;
  accountNumber: string;
  amount: number;
}

export interface PreparePaymentResult {
  success: true;
  paymentId: string;
  provider: string;
  customerName: string;
  amount: number;
  currency: Currency;
  requiresConfirmation: true;
}

export interface ConfirmPaymentInput {
  paymentId: string;
  confirmed: boolean;
  userId: string;
  sessionId: string;
}

export interface ConfirmPaymentResult {
  success: true;
  transactionId: string;
  status: "SUCCESS";
  receiptId: string;
}

export interface CreditProduct {
  id: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  annualRatePercent: number;
  maxTermMonths: number;
  currency: Currency;
}

export interface CalculateCreditInput {
  productId: string;
  amount: number;
  termMonths: number;
}

export interface CalculateCreditResult {
  monthlyPayment: number;
  totalPayment: number;
  interest: number;
  currency: Currency;
}

export interface DepositProduct {
  id: string;
  name: string;
  currency: Currency;
  termMonths: number;
  annualRatePercent: number;
  minAmount: number;
}

/** docs/16_AI_ORCHESTRATION_ARCHITECTURE.md §10 */
export interface AgentResponse {
  text: string;
  emotion: string;
  animation: string;
  nextAction: string;
}
