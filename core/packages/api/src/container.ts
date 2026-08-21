// Composition root — the only place concrete Mock/Production providers are chosen and
// wired together. Everything downstream depends on @bankverse/domain interfaces only.
// See docs/38_AI_PROVIDER_ADAPTER.md §5 (AI_PROVIDER) and docs/47 (no API key required).

import { MockAIProvider } from "@bankverse/ai-provider-mock";
import { buildDefaultAgentRegistry, InMemorySessionStore, Orchestrator } from "@bankverse/ai-orchestrator";
import { DEMO_ACCOUNT_NUMBER, MockBankingProvider } from "@bankverse/banking-mock";
import type { AgentRegistry } from "@bankverse/domain";
import { InMemoryAuditSink } from "@bankverse/domain";
import { MockSTTProvider, MockTTSProvider } from "@bankverse/voice-mock";

export interface Container {
  auditSink: InMemoryAuditSink;
  bankingProvider: MockBankingProvider;
  aiProvider: MockAIProvider;
  sttProvider: MockSTTProvider;
  ttsProvider: MockTTSProvider;
  agents: AgentRegistry;
  orchestrator: Orchestrator;
  sessions: InMemorySessionStore;
  demoAccountNumber: string;
}

export function buildContainer(): Container {
  const auditSink = new InMemoryAuditSink();
  const bankingProvider = new MockBankingProvider({ auditSink });
  const aiProvider = new MockAIProvider();
  const agents = buildDefaultAgentRegistry();
  const orchestrator = new Orchestrator(aiProvider, bankingProvider, agents, {
    defaultAccountNumber: DEMO_ACCOUNT_NUMBER,
  });

  return {
    auditSink,
    bankingProvider,
    aiProvider,
    sttProvider: new MockSTTProvider(),
    ttsProvider: new MockTTSProvider(),
    agents,
    orchestrator,
    sessions: new InMemorySessionStore(),
    demoAccountNumber: DEMO_ACCOUNT_NUMBER,
  };
}
