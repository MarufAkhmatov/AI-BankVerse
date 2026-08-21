// Thin fetch wrapper over core/packages/api — docs/27_OPENAPI_SPECIFICATION.md.
// The web client never talks to a banking or AI vendor directly; everything goes
// through this one HTTP boundary, matching the AI -> Tool -> Service -> Backend rule
// in docs/09_TECHNICAL_ARCHITECTURE.md §5.

export interface AgentResponseDto {
  text: string;
  emotion: string;
  animation: string;
  nextAction: string;
}

export interface PendingPaymentDto {
  paymentId: string;
  provider: string;
  amount: number;
  currency: string;
}

export interface ChatResponse {
  sessionId: string;
  agentId: string;
  state: string;
  response: AgentResponseDto;
  payment?: PendingPaymentDto;
}

export interface TransactionDto {
  id: string;
  accountId: string;
  type: string;
  amount: number;
  currency: string;
  provider?: string;
  status: string;
  createdAt: string;
  completedAt?: string;
}

const API_BASE = "/api/v1";

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new Error(payload?.error?.message ?? `Request to ${path} failed (${res.status})`);
  }
  return res.json();
}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new Error(payload?.error?.message ?? `Request to ${path} failed (${res.status})`);
  }
  return res.json();
}

export const bankverseApi = {
  chat(userId: string, text: string, sessionId?: string): Promise<ChatResponse> {
    return postJson<ChatResponse>("/ai/chat", { userId, text, sessionId });
  },
  getTransactions(accountId: string, limit = 1): Promise<{ transactions: TransactionDto[] }> {
    return getJson(`/accounts/${accountId}/transactions?limit=${limit}`);
  },
  getBalance(accountId: string): Promise<{ balance: number; currency: string }> {
    return getJson(`/accounts/${accountId}`);
  },
  listAgents(): Promise<{ agents: Array<{ id: string; name: string; status: string; department: string }> }> {
    return getJson("/agents");
  },
};
