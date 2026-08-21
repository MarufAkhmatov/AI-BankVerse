# Implementation Plan

Staged build plan, approved 2026-08-21. See `SESSION_HANDOFF.md` for current progress.

## Stage A — Repository & Documentation (this session)

- Git skeleton, root docs (`README.md`, `CLAUDE.md`, `AUDIT.md`, `SESSION_HANDOFF.md`)
- `docs/01`–`docs/70` — full specification set, see `docs/README.md` for the index
- Resolve the single-floor vs. two-floor conflict (docs/61/62/70 win; docs/06/43 annotated superseded)
- Commit and push to `origin/main`

## Stage B — Engine-agnostic domain core (`core/`)

TypeScript npm workspaces monorepo, fully offline (no external API keys required):

```
core/packages/
├── domain/            Contracts (IBankingProvider, IAIProvider, ISTTProvider, ITTSProvider,
│                       IAuditSink), data models, and four registries (Service/Agent/Intent/Provider)
├── banking-mock/       MockBankingProvider — demo account, utility payment flow, simulated
│                       latency/failures, idempotency, audit events
├── ai-orchestrator/    detectIntent → resolveContext → routeAgent → selectTool → authorize
│                       → execute → respond pipeline; conversation state machine
├── ai-provider-mock/   MockAIProvider — deterministic uz/ru/en intent classification
├── voice-mock/         MockSTTProvider / MockTTSProvider
└── api/                Fastify HTTP server exposing /api/v1/*
```

Registries are the horizontal-growth mechanism: a new banking service or AI agent is a new
registry entry + one module, never a change to orchestrator/core logic. See
`docs/05_BANKING_SERVICES.md` (service contract), `docs/37_AI_TOOL_SCHEMA.md`,
`docs/16_AI_ORCHESTRATION_ARCHITECTURE.md`.

Security invariants enforced at this layer (docs/12, /46, /49, /50):
- Two-phase payment (`prepare` → `confirm`), confirmation bound to `{user, session, paymentId, amount, currency}`
- `Idempotency-Key` prevents duplicate transactions on retry
- Success is never claimed unless the backend returned `status === SUCCESS`
- User speech is treated as intent signal only, never as a policy/authorization instruction

Verification: `cd core && npm install && npm test` — intent classification (3 languages),
banking flows (valid/invalid/insufficient funds/duplicate/timeout), and the critical
"never fabricate success" test must all pass.

## Stage C — Web client (`prototype/web-client/`)

Vite + TypeScript + Three.js, one codebase for desktop and mobile browsers.

- Single-floor monumental hall (50m × 30m × 16m), per `docs/61`/`docs/62`
- Third-person player + camera (desktop: WASD/mouse, mobile: virtual joystick/touch-drag)
- Reception / Payment / Credit agent characters (placeholder meshes behind an
  `AgentController` interface, ready to swap for MetaHuman later)
- Contextual UI only (`ConversationPanel`, `ServicePanel`, `ConfirmationPanel`, `ReceiptPanel`) —
  no permanent dashboard
- Voice via Web Speech API behind `IVoiceProvider`, text-input fallback always available
- Full vertical slice: enter → reception greets → voice request → intent → payment agent →
  contextual UI → confirm → mock transaction → receipt → environment stays alive

Verification: `preview_start` + Browser tool, walk through the 10 acceptance scenarios in
`docs/46_MASTER_ACCEPTANCE_TEST.md`, then repeat at the `mobile` resize preset.

## Stage D — Unreal Engine 5.8 client (future — not started)

Blocked on Unreal Engine 5.8 being installed locally (audit: not present, ~100+ GB required,
138.8 GB free). When it starts, `prototype/unreal/` becomes a thin client consuming
`core/packages/api` — the domain logic in Stage B is not rewritten, only re-presented in C++.
The C++ class map for this stage already exists in `docs/30`, `docs/31`, `docs/36`.

## Rules carried through every stage

- No Anthropic API key anywhere in this repo, ever (`docs/47`, `docs/51`)
- Commit after each meaningful unit, not one giant commit (`docs/44`, `docs/58`)
- If the same error repeats three times, stop and change strategy (`docs/58`)
- Update `SESSION_HANDOFF.md` at the end of significant sessions
