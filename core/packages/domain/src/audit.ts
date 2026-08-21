import type { IAuditSink } from "./contracts.js";
import type { AuditEvent } from "./models.js";
import { generateId, nowIso } from "./util.js";

/**
 * In-memory audit sink for the vertical slice. Swappable for a persistent sink later
 * without touching callers — see docs/12_SECURITY_AND_COMPLIANCE.md (Audit).
 */
export class InMemoryAuditSink implements IAuditSink {
  private events: AuditEvent[] = [];

  async record(event: Omit<AuditEvent, "id" | "createdAt">): Promise<AuditEvent> {
    const recorded: AuditEvent = {
      ...event,
      id: generateId("audit"),
      createdAt: nowIso(),
    };
    this.events.push(recorded);
    return recorded;
  }

  async list(filter?: { userId?: string; traceId?: string }): Promise<AuditEvent[]> {
    if (!filter) return [...this.events];
    return this.events.filter(
      (e) =>
        (filter.userId === undefined || e.userId === filter.userId) &&
        (filter.traceId === undefined || e.traceId === filter.traceId),
    );
  }
}
