# Repository Audit

Stage 0 of the build process (docs/45_CLAUDE_CODE_EXECUTION_PLAN.md). Snapshot taken before
any code existed in this repository.

## Date

2026-08-21

## Environment

| Item | Status |
|---|---|
| Local folder `C:\Users\ASUS\Desktop\AI BankVerse` | Empty, not a git repository |
| GitHub `MarufAkhmatov/AI-BankVerse.git` | Reachable, **zero refs** — completely empty |
| git | 2.52.0 |
| git-lfs | 3.7.1 |
| gh CLI | authenticated as MarufAkhmatov |
| Node.js | 24.15.0 |
| Python | 3.14 |
| dotnet | present |
| Visual Studio | present |
| **Unreal Engine 5.8 / Epic Games Launcher** | **Not installed** |
| Free disk space (C:) | 138.8 GB |

## Conclusion

There is nothing to synchronize — both the local folder and the remote repository start
from zero. Because Unreal Engine is not installed, no UE project can be created, compiled,
or tested in this environment yet.

## Decision

Build the engine-agnostic domain layer (`core/`) and a Three.js web client
(`prototype/web-client/`) first. Both are fully testable today, on desktop and mobile
browsers, without Unreal Engine. The Unreal client (`prototype/unreal/`) is added later,
as a thin client over the same `core/packages/api` HTTP contract — no domain logic will
need to be rewritten when that happens.

See [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) for the staged build plan.

## Missing systems (nothing exists yet — first-build order)

1. `docs/` — specification set (this session)
2. `core/packages/domain` — contracts, models, registries
3. `core/packages/banking-mock` — MockBankingProvider
4. `core/packages/ai-orchestrator` + `core/packages/ai-provider-mock`
5. `core/packages/voice-mock`
6. `core/packages/api` — HTTP layer
7. `prototype/web-client` — Three.js vertical slice (desktop + mobile)
8. `prototype/unreal` — placeholder + README only, until UE 5.8 is installed
