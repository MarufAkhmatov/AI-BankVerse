# AI BankVerse

An immersive 3D AI-powered virtual bank. Instead of a menu-driven banking app, the user
walks into a living digital bank, talks to AI employees, and completes real banking
services — voice-first, with the 3D environment itself as the interface.

> "I am inside a bank." — not "I am looking at a banking application."

## Repository Layout

```
AI-BankVerse/
├── docs/                    Full product, design, and technical specification (70 documents)
├── core/                    Engine-agnostic domain layer: banking mock, AI orchestrator, HTTP API
├── prototype/
│   ├── web-client/          Three.js vertical slice — desktop + mobile browser
│   └── unreal/              Unreal Engine 5.8 client (future — see docs/30, docs/31, docs/36)
├── CLAUDE.md                 Entry point for AI-assisted development sessions
├── AUDIT.md                  Repository/environment audit snapshot
├── SESSION_HANDOFF.md        Cross-session continuity log
└── IMPLEMENTATION_PLAN.md    Staged build plan (A: docs, B: core, C: web client, D: UE client)
```

## Why a web client before Unreal?

The domain logic (banking services, AI orchestration, intent detection) is engine-agnostic
by design — see [docs/09_TECHNICAL_ARCHITECTURE.md](docs/09_TECHNICAL_ARCHITECTURE.md) and
[docs/48_RUNTIME_AI_PROVIDER_ARCHITECTURE.md](docs/48_RUNTIME_AI_PROVIDER_ARCHITECTURE.md).
A Three.js web client validates the full experience — 3D bank, AI agents, voice, contextual
UI, mock banking — on both desktop and mobile browsers today, without requiring Unreal Engine
to be installed. The Unreal client consumes the exact same `core/packages/api` HTTP contract
when it is added later; no domain logic is duplicated or rewritten.

## Getting Started

```bash
cd core && npm install && npm test
```

```bash
cd prototype/web-client && npm install && npm run dev
```

## Documentation

Start with [CLAUDE.md](CLAUDE.md), then [docs/01_PRODUCT_VISION.md](docs/01_PRODUCT_VISION.md).
The full document index is in [docs/README.md](docs/README.md).
