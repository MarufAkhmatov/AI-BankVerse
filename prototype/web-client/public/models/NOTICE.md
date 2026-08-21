# Character Model Provenance — docs/69_ASSET_PIPELINE.md §7 (Asset Licensing)

All files in this directory are copied verbatim from the official three.js repository's
example assets (`examples/models/gltf/`), retrieved 2026-08-22 from
https://github.com/mrdoob/three.js (branch `dev`), which is MIT-licensed. Three.js has
shipped and permitted reuse of these bundled example models for over a decade; they
originate from Mixamo (Adobe) character exports.

| File | Source | Animation clips |
|---|---|---|
| `Soldier.glb` | `examples/models/gltf/Soldier.glb` | `Idle`, `Walk`, `Run`, `TPose` |

Two other candidates were evaluated and discarded (not committed, to keep the shipped
build lean): `Michelle.glb` only has `SambaDance`/`TPose` clips (no walk cycle); `Xbot.glb`
has `idle`/`run` but no dedicated walk and a plain grey-mannequin look. `Soldier.glb` was
the only one with a complete Idle/Walk/Run locomotion set — see
`prototype/web-client/src/characters/`.

## Status: PLACEHOLDER

Not final character art — see docs/33_DESIGN_SYSTEM.md §9 (Visual Quality Gate) and docs/15
(PLACEHOLDERS rule). `Soldier.glb`'s tactical/visor styling does not match the bank's
professional dress code (docs/18 §4 Banking Uniformity) — its single combined
body+clothing material (`vanguardbodymat`, base color `0xe7e7e7`, no separate skin
material) means recoloring is a gentle per-character hue lerp
(`main.ts:styleCharacter`), not a true reskin, and the visor mesh is hidden but the
underlying tactical outfit remains. Replace with a licensed business-attire rigged
character (or MetaHuman, once Stage D starts) when available — see
SESSION_HANDOFF.md for the tradeoffs already ruled out (Ready Player Me's service has
shut down; Mixamo requires an interactive Adobe account login this environment cannot
automate).
