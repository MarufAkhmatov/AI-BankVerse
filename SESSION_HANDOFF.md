# Session Handoff

Read this before continuing any prior work. Do not repeat completed work.

## Date

2026-08-22

## Developer

Claude Code

---

## Completed

- Repository bootstrapped: `git init`, `origin` set to `https://github.com/MarufAkhmatov/AI-BankVerse.git`,
  three commits pushed to `main`.
- Root files: `.gitignore`, `.gitattributes`, `README.md`, `CLAUDE.md`, `AUDIT.md`,
  `SESSION_HANDOFF.md` (this file), `IMPLEMENTATION_PLAN.md`.
- `docs/` — full 70-document specification set, numbered `01`–`70`, indexed in `docs/README.md`
  (docs 26–36 and 61 are marked `RECONSTRUCTED` — their opening sections were reconstructed
  from surrounding spec context because the source text was truncated when pasted).
  `docs/06` and `docs/43` annotated as superseded by the single-floor decision in `docs/61/62/70`.
- **Etap B — `core/`** (TypeScript npm workspaces, fully offline, no API key):
  `domain` (contracts, models, `ServiceRegistry`/`AgentRegistry`/`IntentRegistry`/`ProviderRegistry`),
  `banking-mock` (`MockBankingProvider` — demo account `8600123456781234`, two-phase
  utility payment, idempotent confirmation, simulated latency/failure sentinels),
  `ai-provider-mock` (`MockAIProvider` — deterministic uz/ru/en intent classification +
  response templates), `voice-mock` (text-driven STT/TTS stand-ins), `ai-orchestrator`
  (the docs/16 pipeline + conversation state machine), `api` (Fastify HTTP server on
  `/api/v1/*`). **40/40 tests pass**, `tsc -b` typechecks clean.
- **Etap C — `prototype/web-client/`** (Vite + TypeScript + Three.js): single-floor hall
  (docs/61/62 scale), third-person player (desktop drag-look + WASD, mobile virtual
  joystick + touch-drag), placeholder Reception/Payment/Credit/Deposit agents with gaze
  and status, contextual UI (conversation/service-confirmation/receipt panels only, no
  permanent dashboard), Web Speech API voice with text fallback. Talks to `core/packages/api`
  over HTTP only. **Verified live in-browser** at desktop and mobile viewports: full
  electricity-payment vertical slice (greet → intent → confirm → execute → receipt),
  cancellation, and the unrecognized-request clarify path all work end-to-end with zero
  console errors.
- **Visual quality pass** (same session, in response to explicit user feedback that the
  first pass looked too plain): `characters/CharacterRig.ts` + `CharacterAnimator.ts` — a
  real articulated humanoid (joints, contralateral-gait walk cycle, idle breathing) shared
  by the player and every `AgentCharacter`, with a small varied-appearance palette so
  employees aren't clones (docs/18 §4). `world/textures.ts` — procedural canvas-drawn
  marble/wood/bronze/skyline textures, zero external assets or generation cost (user chose
  the free code-only option over paid AI image generation when asked). ACES tone mapping +
  a `RoomEnvironment` reflection map on the renderer. **Caught and fixed via screenshot** a
  camera-math bug (`Euler(pitch, yaw, 0, "YXZ").applyEuler` collapsed the vertical offset at
  yaw=Math.PI, putting the camera almost inside the character's head) and a movement-facing
  bug (stray `+Math.PI` that only became visible once the rig had a directional face). See
  commit `95184e2` for the exact math fix. **Ceiling communicated to the user**: true
  rigged/skinned photorealistic humans (MetaHuman-class) are a docs/07 + docs/18-documented
  Unreal-only capability — not achievable in a code-only Three.js prototype without an
  external rigged-asset pipeline (e.g. licensed Mixamo/Ready-Player-Me models), which was
  out of scope for this pass. Re-verified the full docs/46 flow, movement, and mobile
  viewport again after the fix — see "Tests" below.
- `prototype/unreal/README.md` — Stage D not started; left as a pointer, not scaffolded.
- `.claude/launch.json` — `bankverse-api` (port 4300) and `bankverse-web` (port 5173,
  autoPort) preview configs.
- **Real rigged character pass** (2026-08-22, user pushed back on the "ceiling" above and
  asked for real movement + realism regardless): researched Ready Player Me (confirmed via
  WebFetch DNS failure that the service has genuinely shut down, not just a restriction) and
  Mixamo (needs an interactive Adobe login this environment can't automate) as free rigged-
  human sources, then settled on `Soldier.glb` from three.js's own official example assets
  (MIT-licensed, `mrdoob/three.js`) — the only freely fetchable option with a complete
  Idle/Walk/Run clip set (`Michelle.glb`/`Xbot.glb` were fetched, compared, and discarded —
  see `public/models/NOTICE.md`). New `characters/GLTFCharacterLoader.ts` (load-once +
  `SkeletonUtils.clone()` per instance) and `characters/AnimatedCharacterController.ts`
  (speed-based clip crossfade) replace the old procedural rig for the player and every
  `AgentCharacter`. **Two bugs caught via screenshot and fixed**: (1) `normalizeToGround`'s
  `Box3.setFromObject` measured a degenerate near-zero box on a freshly-cloned SkinnedMesh
  (bone matrices not yet propagated) — every character was ~400x too small and invisible;
  fixed by forcing `updateMatrixWorld()` and unioning each mesh's own `geometry.boundingBox`.
  (2) a full color-multiply tint crushed the single-material character toward black; fixed
  with a low-alpha `Color.lerp()`. Known tradeoff, disclosed to the user: `Soldier.glb` reads
  as tactical/military (visor hidden, uniform recolored, but it's not business attire) —
  it was the best free option found, not a perfect fit.
- **AI-generated marble textures** (same session): user was asked and explicitly approved
  spending part of their credit balance (10 credits total, free plan) after being told the
  cost; generated 2 of 5 candidate surfaces (floor + wall/column marble, 4 credits, 6
  remaining) via `nano_banana_pro`, downloaded and committed through Git LFS (`*.png` already
  tracked). Furniture/bronze/glass remain the free procedural textures from `world/textures.ts`
  by the user's explicit choice not to spend the rest of the balance. See
  `public/textures/NOTICE.md`.

## Current Task

None in progress — Etap A, B, C of `IMPLEMENTATION_PLAN.md`, a visual-quality pass, a real
rigged-character swap, and a partial AI-texture pass are all complete. Awaiting direction —
see "Next Recommended Step".

## Files Changed

See `git log --stat` — five commits: docs (78 files), core (44 files), web-client (17 files),
web-client session-handoff touch-up, web-client visual pass (7 files: new `characters/`
module + texture/camera/facing fixes).

## Systems Implemented

Domain core, mock banking, mock AI/voice, orchestrator, HTTP API, Three.js vertical slice.
Not implemented: Unreal client, real MetaHuman/production assets, real STT/TTS vendor,
production AI provider, persistent (non-in-memory) storage, authentication.

## Build Status

PASS — `core`: `npm run typecheck` (tsc -b) clean. `prototype/web-client`: `npm run typecheck`
(tsc --noEmit) clean.

## Tests

PASS — `core`: `npm test` → 40/40 (vitest). `prototype/web-client` has no automated tests yet
(verified manually via the Browser tool instead — see docs/23_TESTING_STRATEGY.md gap below).

## Known Issues

- Unreal Engine 5.8 is not installed on this machine. UE client work (Stage D) cannot start
  until it is installed (~100+ GB; 138.8 GB free as of audit).
- No customer NPCs walking around the hall yet. The user was explicitly offered this as an
  option (alongside the character rig upgrade) and declined it for this pass — docs/20 (NPC
  Life Simulation) and docs/40 (NPC Behavior Architecture) describe the target behavior when
  it's picked up.
- Characters now use a real rigged/skinned/animated human mesh (`Soldier.glb`, see above),
  not the old procedural rig — but it reads as tactical/military (visor hidden, uniform
  recolored, still not business attire), because it was the only freely-fetchable option
  with a full Idle/Walk/Run set. Ready Player Me is confirmed dead (DNS no longer resolves —
  not just blocked); Mixamo needs an interactive Adobe login this environment can't automate.
  A better-fitting free rigged character, a paid one, or Unreal + MetaHuman are the remaining
  paths — see "Next Recommended Step".
- Docs 26–36 and 61 contain reconstructed sections — flagged inline, should be reviewed by
  the product owner against original intent.
- `detectLanguageHeuristic` (ai-provider-mock) is a light heuristic, not a real language
  detector — an unmatched Uzbek sentence without diacritics can be misclassified as English,
  so the clarify-prompt wording sometimes surfaces in the wrong language. Cosmetic only; the
  "never a dead end" behavior itself is unaffected. Same applies to the cancellation wording
  ("cancelled by user" is hardcoded English inside an Uzbek sentence in `ai-provider-mock`'s
  failure template) — worth a proper `cancelled` stage/template if this ships further.
- `prototype/web-client` has no automated test suite (no Vitest/Playwright yet) — coverage is
  currently the `core` test suite (which covers the orchestrator logic the UI calls) plus the
  manual Browser-tool walkthrough recorded in this session.
- Camera/player collision is bounds-clamping only, not true wall raycasting (noted as a
  simplification in `PlayerController.ts`).

## Architecture Decisions

- Domain-core-first: `core/` (TypeScript, engine-agnostic) and a Three.js web client built
  before Unreal. The UE client will consume the same `core/packages/api` HTTP contract later
  — see `prototype/unreal/README.md`.
- Single floor is authoritative for the bank hall (docs/61, /62, /70 supersede /06, /43).
- Registry pattern (`ServiceRegistry`, `AgentRegistry`, `IntentRegistry`, `ProviderRegistry`)
  is the mechanism for horizontal growth (new services/agents) without touching core logic.
- `POST /api/v1/ai/chat` returns structured `payment` data alongside the spoken response, so
  UI clients never parse amounts back out of prose.

## Next Recommended Step

Pick one:
1. Find/source a better-fitting rigged human (business attire, not tactical) with a full
   walk cycle — the search this session covered three.js's bundled examples, Ready Player Me
   (dead), and Mixamo (needs manual login); a paid character asset or a user-provided Mixamo
   export are the next things to try. `characters/GLTFCharacterLoader.ts` and
   `AnimatedCharacterController.ts` are already generic enough to swap the GLB URL.
2. Add customer NPCs wandering/queueing in the hall (docs/20, docs/40) — deferred by explicit
   user choice earlier this session; the old procedural `CharacterRig`/`CharacterAnimator`
   (unused now, still in the tree) is the lightweight option docs/18 §9 suggests for
   background/distant NPCs, vs. the heavier GLTF character for named agents.
3. Generate the remaining 3 candidate textures (walnut wood, bronze, window skyline) if the
   user wants to spend the rest of their credit balance (6 left as of this session).
4. Add a Vitest+Playwright (or similar) test suite for `prototype/web-client` so the UI flow
   is regression-tested, not just manually verified.
5. Install Unreal Engine 5.8 and start Stage D per `prototype/unreal/README.md` — the only
   path to true MetaHuman-grade photoreal, per the project's own docs/07 and docs/18.

## Git

Branch: `main`
Commit: `a3a7ef2` (AI textures), preceded by `da9689d` (rigged character), `95184e2`
(visual pass), `c2a737d`, `c2ae19c` (web-client), `f8c64b4` (core), `0f868d3` (docs)
Working tree: clean, everything pushed to `origin/main`

## Important Notes

Do not repeat completed work. Read this document before continuing.
