import type { ConversationMessage, ConversationState, Currency, Language } from "@bankverse/domain";
import { generateId } from "@bankverse/domain";

export interface PendingPayment {
  paymentId: string;
  provider: string;
  amount: number;
  currency: Currency;
}

export interface Session {
  id: string;
  userId: string;
  language: Language;
  state: ConversationState;
  history: ConversationMessage[];
  pendingPayment?: PendingPayment;
}

export function createSession(userId: string, language: Language = "uz"): Session {
  return {
    id: generateId("session"),
    userId,
    language,
    state: "IDLE",
    history: [],
  };
}

export class InMemorySessionStore {
  private readonly sessions = new Map<string, Session>();

  create(userId: string, language?: Language): Session {
    const session = createSession(userId, language);
    this.sessions.set(session.id, session);
    return session;
  }

  get(sessionId: string): Session | undefined {
    return this.sessions.get(sessionId);
  }

  save(session: Session): void {
    this.sessions.set(session.id, session);
  }
}
