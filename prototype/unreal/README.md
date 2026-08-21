# AI BankVerse — Unreal Engine 5.8 Client (not started)

This directory is intentionally empty of project files. Unreal Engine 5.8 is not installed
on the machine this repository was bootstrapped on — see [AUDIT.md](../../AUDIT.md).

## Before starting this stage

1. Install Unreal Engine 5.8 via Epic Games Launcher (requires ~100+ GB free disk).
2. Confirm `core/packages/api` runs locally (`npm run dev:api --prefix core`) — the UE
   client is a thin presentation layer over that HTTP API, per
   [IMPLEMENTATION_PLAN.md](../../IMPLEMENTATION_PLAN.md) Stage D. No banking or AI domain
   logic is re-implemented in C++; it is consumed over HTTP exactly like
   `prototype/web-client` does.

## What to build, and in what order

Follow [docs/45_CLAUDE_CODE_EXECUTION_PLAN.md](../../docs/45_CLAUDE_CODE_EXECUTION_PLAN.md)
Stages 1–4 first (foundation, player, bank lobby, reception agent) before wiring voice or
banking. The module layout is already specified in
[docs/30_UNREAL_PROJECT_STRUCTURE.md](../../docs/30_UNREAL_PROJECT_STRUCTURE.md), the C++
class map in [docs/31](../../docs/31_CORE_CPP_CLASS_ARCHITECTURE.md) and
[docs/36](../../docs/36_UNREAL_IMPLEMENTATION_MAP.md), and the single-floor architectural
brief in [docs/61](../../docs/61_FLAGSHIP_BANK_ARCHITECTURE.md) /
[docs/62](../../docs/62_BANK_FLOOR_PLAN.md) — the same brief `prototype/web-client` already
implements as a greybox, so the UE hall can match it 1:1 in scale and composition.

## Interfaces to implement first

`IBVBankingProvider` and `IBVAIProvider` (docs/36 §11) should be thin HTTP clients against
`core/packages/api`'s `/api/v1/*` routes (docs/27_OPENAPI_SPECIFICATION.md) — mirroring
what `prototype/web-client/src/api/client.ts` already does in TypeScript.
