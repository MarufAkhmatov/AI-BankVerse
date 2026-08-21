// The horizontal-growth mechanism: a new banking service, AI agent, or intent is a new
// registry entry plus one module — never a change to orchestrator/core logic.
// See IMPLEMENTATION_PLAN.md "Stage B" and docs/05_BANKING_SERVICES.md (Service Contract).

import type { AgentState, IntentCategory, Language } from "./models.js";

// --- ServiceRegistry -------------------------------------------------------

export interface ServiceDescriptor<TInput = unknown> {
  serviceId: string;
  name: string;
  category: "account" | "payment" | "credit" | "deposit" | "card" | "transfer" | "support";
  requiresConfirmation: boolean;
  /** Returns a list of validation error messages, or an empty array if valid. */
  validate: (input: TInput) => string[];
}

export class ServiceRegistry {
  private readonly services = new Map<string, ServiceDescriptor>();

  register(descriptor: ServiceDescriptor): void {
    if (this.services.has(descriptor.serviceId)) {
      throw new Error(`Service already registered: ${descriptor.serviceId}`);
    }
    this.services.set(descriptor.serviceId, descriptor);
  }

  get(serviceId: string): ServiceDescriptor | undefined {
    return this.services.get(serviceId);
  }

  list(): ServiceDescriptor[] {
    return [...this.services.values()];
  }
}

// --- AgentRegistry -----------------------------------------------------------

export interface AgentDescriptor {
  agentId: string;
  name: string;
  role: string;
  department: string;
  /** Which intents this agent is the router target for — docs/16 §5 Agent Router. */
  handledIntents: IntentCategory[];
}

export class AgentRegistry {
  private readonly agents = new Map<string, AgentDescriptor>();
  private readonly state = new Map<string, AgentState>();

  register(descriptor: AgentDescriptor): void {
    if (this.agents.has(descriptor.agentId)) {
      throw new Error(`Agent already registered: ${descriptor.agentId}`);
    }
    this.agents.set(descriptor.agentId, descriptor);
    this.state.set(descriptor.agentId, {
      id: descriptor.agentId,
      name: descriptor.name,
      role: descriptor.role,
      department: descriptor.department,
      status: "AVAILABLE",
      workload: 0,
    });
  }

  get(agentId: string): AgentDescriptor | undefined {
    return this.agents.get(agentId);
  }

  getState(agentId: string): AgentState | undefined {
    return this.state.get(agentId);
  }

  setState(agentId: string, patch: Partial<AgentState>): AgentState {
    const current = this.state.get(agentId);
    if (!current) throw new Error(`Unknown agent: ${agentId}`);
    const next = { ...current, ...patch };
    this.state.set(agentId, next);
    return next;
  }

  list(): AgentDescriptor[] {
    return [...this.agents.values()];
  }

  listState(): AgentState[] {
    return [...this.state.values()];
  }

  /** docs/16_AI_ORCHESTRATION_ARCHITECTURE.md §5 Agent Router — falls back to reception. */
  findByIntent(intent: IntentCategory): AgentDescriptor | undefined {
    const match = this.list().find((a) => a.handledIntents.includes(intent));
    return match ?? this.agents.get("reception");
  }
}

// --- IntentRegistry ------------------------------------------------------------

export interface IntentPattern {
  intent: IntentCategory;
  service?: string;
  language: Language;
  /** Case-insensitive substring/regex triggers — docs/17_VOICE_INTERACTION_SPECIFICATION.md §5. */
  patterns: RegExp[];
  requiresConfirmation: boolean;
}

export interface IntentMatch {
  intent: IntentCategory;
  service?: string;
  language: Language;
  confidence: number;
  requiresConfirmation: boolean;
}

export class IntentRegistry {
  private readonly patterns: IntentPattern[] = [];

  register(pattern: IntentPattern): void {
    this.patterns.push(pattern);
  }

  /**
   * Deterministic, offline classification — docs/48_RUNTIME_AI_PROVIDER_ARCHITECTURE.md §7.
   * User text is only ever matched against registered triggers; it is never treated as an
   * instruction — docs/50_PROMPT_INJECTION_DEFENSE.md §3.
   */
  match(text: string): IntentMatch | null {
    const normalized = text.toLowerCase().trim();
    for (const entry of this.patterns) {
      for (const pattern of entry.patterns) {
        if (pattern.test(normalized)) {
          return {
            intent: entry.intent,
            service: entry.service,
            language: entry.language,
            confidence: 0.95,
            requiresConfirmation: entry.requiresConfirmation,
          };
        }
      }
    }
    return null;
  }
}

// --- ProviderRegistry ------------------------------------------------------------

/**
 * Named provider switch — e.g. `AI_PROVIDER=mock` vs `openai`, `Mock` vs `Production`
 * banking. See docs/38_AI_PROVIDER_ADAPTER.md §5 and docs/47_CLAUDE_CLI_DEVELOPMENT_STRATEGY.md.
 */
export class ProviderRegistry<T> {
  private readonly providers = new Map<string, T>();

  register(name: string, provider: T): void {
    this.providers.set(name, provider);
  }

  select(name: string): T {
    const provider = this.providers.get(name);
    if (!provider) {
      throw new Error(`Unknown provider "${name}". Registered: ${[...this.providers.keys()].join(", ")}`);
    }
    return provider;
  }
}
