# Ambient NPC Model Provenance — docs/69_ASSET_PIPELINE.md §7 (Asset Licensing)

Decimated from characters the user supplied directly in
`prototype/workers and clients and police/` (20 distinct AI-generated character models,
each ~1.3–3M vertices in source form — not real-time-appropriate as delivered). Reduced
here via `gltf-transform optimize --simplify-ratio 0.02–0.05 --compress meshopt` (texture
recompression failed on this environment's sharp/libvips install — see
`../NOTICE.md` for the same issue on the player/agent character; textures here are
likewise still at original size).

| File | Source | Role | Rigged? |
|---|---|---|---|
| `police_officer.glb` | `police_officer_in_uniform.glb` | standing guard | No — static pose |
| `staff_woman.glb` | `businesswoman_in_a_grey_suit_with_tablet.glb` | ambient staff | No — static pose |
| `client_woman.glb` | `sophia_metzger_business-casual_attire.glb` | waiting customer | No — static pose |
| `client_man.glb` | `businessman_in_a_grey_suit.glb` | waiting customer | No — static pose |
| `client_elegant.glb` | `elegance_in_a_black_suit.glb` | waiting customer | No — static pose |
| `walking_customer.glb` | `office_worker.glb` | patrols the open floor | **Yes** — the only one of the 20 source files with a skeleton + baked animation (Mixamo) |

## Status: LICENSE UNVERIFIED, PLACEHOLDER

Same caveat as `../NOTICE.md` and `../HALL_NOTICE.md`: no license/attribution info was
supplied with these files, so their reuse terms are unknown — resolve before any
public/shared build. The 14 other source characters (portraits, floating poses, and a
few more standing figures) weren't used this pass to keep total page weight down; see
`world/AmbientNPCs.ts` if more are wanted later.

## Placement note

Static NPCs get a whole-body idle sway (no skeleton to animate per-limb — see
`StaticNpc.update()` in `world/AmbientNPCs.ts`) rather than a walk cycle. Positions were
found by raycasting the hall model for open, correctly-floored spots (same technique as
`world/ImportedBankHall.ts`'s `detectFloor()`), then spot-checked visually; not
exhaustively verified against every column/alcove in this ~90m-long building, so a given
NPC clipping slightly into a nearby wall edge is a plausible follow-up fix, not something
to assume is already ruled out.
