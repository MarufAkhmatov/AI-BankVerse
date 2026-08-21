// docs/38_AI_PROVIDER_ADAPTER.md — MockAIProvider implementation of IAIProvider.
// Fully offline, deterministic — no external API key required (docs/47 §7).

import type { AgentResponse, IAIProvider, IntentResult } from "@bankverse/domain";
import { buildIntentRegistry, detectLanguageHeuristic } from "./patterns.js";
import { type ResponseStage, type TemplateData, renderResponse } from "./templates.js";

export class MockAIProvider implements IAIProvider {
  private readonly registry = buildIntentRegistry();

  async classifyIntent(text: string): Promise<IntentResult> {
    const match = this.registry.match(text);
    if (!match) {
      return {
        intent: "UNKNOWN",
        confidence: 0,
        requiresConfirmation: false,
        language: detectLanguageHeuristic(text),
        slots: {},
      };
    }

    const slots: Record<string, string> = {};
    const amountMatch = text.replace(/[\s,]/g, "").match(/(\d{4,})/);
    if (amountMatch) slots.amount = amountMatch[1];

    return {
      intent: match.intent,
      service: match.service,
      confidence: match.confidence,
      requiresConfirmation: match.requiresConfirmation,
      language: match.language,
      slots,
    };
  }

  async generateResponse(intent: IntentResult, context: Record<string, unknown>): Promise<AgentResponse> {
    const stage = (context.stage as ResponseStage | undefined) ?? "acknowledge";
    const data = (context.data as TemplateData | undefined) ?? {};
    return renderResponse(intent.intent, stage, intent.language, data);
  }
}
