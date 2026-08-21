# Texture Provenance — docs/69_ASSET_PIPELINE.md §7 (Asset Licensing)

`floor_marble.png` and `wall_marble.png` are AI-generated (nano_banana_pro / "nano_banana_2"
model, via the user's own paid generation credits) on 2026-08-22, prompted for a seamless
tileable photorealistic marble material with no people, logos, or copyrighted content.
Generated images from this provider are usable in this project; there is no third-party
photographer or brand to attribute. 2048×2048, tiled at floor repeat=6 / wall+column
repeat=3/1.2 in `world/BankHall.ts`.

## Status: PLACEHOLDER

Same caveat as docs/33_DESIGN_SYSTEM.md §9: good enough to read as real marble at a glance,
but not a substitute for a licensed scanned material library. Only floor and wall/column
were generated (2 of the 5 candidate surfaces) — furniture, bronze fixtures, and window
glass remain the procedural canvas textures in `world/textures.ts`, by the user's explicit
choice to spend only part of their (very limited, 10-credit) balance on this pass.
