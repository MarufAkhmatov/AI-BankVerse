# Bank Hall Model Provenance — docs/69_ASSET_PIPELINE.md §7 (Asset Licensing)

`bank_hall_opt.glb` is an optimized (gltf-transform: meshopt compression, mesh
simplification to ~35% vertex ratio) copy of a model the user supplied directly —
`prototype/the bank/the_bank_hall.glb` (166 MB, un-simplified original kept there, not
copied into the web client). The GLB's own `asset.generator` field reads
`Sketchfab-16.64.0`, meaning it was exported from Sketchfab; `prototype/the bank/the-bank-hall.zip`
additionally contains a `source/BankHall.7z` and a `textures/` folder consistent with a
Sketchfab "Download" package.

## Status: LICENSE UNVERIFIED

Nothing in the supplied files states which Sketchfab license (CC0, CC-BY, CC-BY-NC,
Editorial, or a paid/proprietary license) this model was distributed under, and no
attribution or source-page URL was provided alongside it. Per docs/69 §7's requirement
that every external asset have a documented license: **before this project (or any build
of it) is shared, distributed, or made public, confirm the original Sketchfab listing and
its license terms** — CC-BY requires attribution, CC-BY-NC forbids commercial use,
Editorial forbids any reuse outside its stated context, and a paid listing may require a
proof-of-purchase / seat license. This is safe to keep using for local prototyping in the
meantime, but is a compliance gap, not a resolved one.

## Technical notes

- Optimized from 165.96 MB to ~80 MB via `gltf-transform optimize --texture-compress
  false --simplify-ratio 0.35 --simplify-error 0.003 --compress meshopt` (texture
  recompression to WebP failed on one texture — `sharp`/libvips colourspace error — so
  textures remain at original resolution/format; only geometry was reduced).
- The model's own bounding box is not a reliable ground-floor reference — see
  `world/ImportedBankHall.ts`'s `detectFloor()` and its comment for why (some
  disconnected low geometry sits ~5–6 units below the real floor and skews
  `Box3.setFromObject`). Floor height and station anchor points there were found by
  raycasting the actual model, not by trusting its bounds.
