// docs/39_STT_TTS_PIPELINE.md §4-5. The web client uses the browser's real Web Speech
// API behind the same IBVSTTProvider/IBVTTSProvider shape (see IMPLEMENTATION_PLAN.md
// Stage C5); these mocks exist so the orchestrator and API layer can be developed and
// tested fully offline, without a browser or microphone.

import type { ISTTProvider, ITTSProvider, Language } from "@bankverse/domain";

function detectLanguage(text: string): Language {
  if (/[а-яё]/i.test(text)) return "ru";
  if (/\b(bo'l|lar|ning|dan|ga|ni|qil)\b/i.test(text)) return "uz";
  return "en";
}

/** Treats its input as already-transcribed text — a stand-in for real speech-to-text. */
export class MockSTTProvider implements ISTTProvider {
  async transcribe(input: string): Promise<{ text: string; language: Language; confidence: number }> {
    return { text: input.trim(), language: detectLanguage(input), confidence: input.trim().length > 0 ? 0.92 : 0 };
  }
}

/**
 * No audio synthesis in the mock — `audioUrl` is always null, matching the text-input
 * fallback path in docs/17_VOICE_INTERACTION_SPECIFICATION.md §14.
 */
export class MockTTSProvider implements ITTSProvider {
  async synthesize(text: string, _language: Language): Promise<{ audioUrl: string | null; text: string }> {
    return { audioUrl: null, text };
  }
}
