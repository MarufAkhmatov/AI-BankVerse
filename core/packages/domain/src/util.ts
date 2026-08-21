import { randomUUID } from "node:crypto";

export function nowIso(): string {
  return new Date().toISOString();
}

/** docs/24_OBSERVABILITY_AND_ANALYTICS.md §7 — e.g. TRACE-8F91A2 */
export function generateTraceId(): string {
  return `TRACE-${randomUUID().slice(0, 8).toUpperCase()}`;
}

/** docs/21_MOCK_BANKING_BACKEND.md §7 — e.g. TXN-1700000000000-4821 */
export function generateTransactionId(): string {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `TXN-${Date.now()}-${random}`;
}

export function generateId(prefix: string): string {
  return `${prefix}_${randomUUID().replace(/-/g, "").slice(0, 12)}`;
}

/**
 * docs/26_DATABASE_SCHEMA.md §13 — mask all but the last 4 digits.
 * "860012******1234", never the raw account number, in logs or audit metadata.
 */
export function maskAccountNumber(accountNumber: string): string {
  const digits = accountNumber.replace(/\s+/g, "");
  if (digits.length <= 4) return "*".repeat(digits.length);
  const visibleStart = digits.slice(0, 6);
  const visibleEnd = digits.slice(-4);
  const maskedLength = Math.max(digits.length - visibleStart.length - visibleEnd.length, 0);
  return `${visibleStart}${"*".repeat(maskedLength)}${visibleEnd}`;
}

/** docs/21_MOCK_BANKING_BACKEND.md §5 — simulated latency 200-800ms. */
export function simulateLatency(minMs = 200, maxMs = 800): Promise<void> {
  const delay = Math.floor(minMs + Math.random() * (maxMs - minMs));
  return new Promise((resolve) => setTimeout(resolve, delay));
}
