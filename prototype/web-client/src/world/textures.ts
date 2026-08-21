// Procedural (canvas-drawn) textures — no external image files, no generation cost.
// This is what turns flat-color "greybox" materials into something that reads as an
// actual material under light. See docs/33_DESIGN_SYSTEM.md §3 (Materials) and §9
// (Visual Quality Gate — PLACEHOLDER until real photographed/scanned textures replace it).

import * as THREE from "three";

function makeCanvas(size: number): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  return { canvas, ctx };
}

function toTexture(canvas: HTMLCanvasElement, repeatX = 1, repeatY = 1): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Cream/beige marble with soft grey-gold veining, for the hall floor and walls. */
export function createMarbleTexture(options: {
  base: string;
  vein: string;
  repeat?: number;
  seed?: number;
}): THREE.CanvasTexture {
  const size = 512;
  const { canvas, ctx } = makeCanvas(size);
  const rng = mulberry32(options.seed ?? 1);

  ctx.fillStyle = options.base;
  ctx.fillRect(0, 0, size, size);

  // Soft blotchy shading for depth.
  for (let i = 0; i < 40; i++) {
    const x = rng() * size;
    const y = rng() * size;
    const r = 30 + rng() * 90;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
    gradient.addColorStop(0, `rgba(255,255,255,${0.05 + rng() * 0.05})`);
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }

  // Vein strokes — a handful of long, wandering, tapering lines.
  ctx.strokeStyle = options.vein;
  ctx.lineCap = "round";
  for (let v = 0; v < 9; v++) {
    ctx.globalAlpha = 0.35 + rng() * 0.25;
    ctx.lineWidth = 0.8 + rng() * 1.6;
    ctx.beginPath();
    let x = rng() * size;
    let y = rng() * size;
    ctx.moveTo(x, y);
    const segments = 8 + Math.floor(rng() * 6);
    for (let s = 0; s < segments; s++) {
      x += (rng() - 0.5) * (size / 6);
      y += (rng() - 0.5) * (size / 6);
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  const repeat = options.repeat ?? 6;
  return toTexture(canvas, repeat, repeat);
}

/** Dark walnut wood grain, for desks and furniture. */
export function createWoodTexture(options: { base: string; grain: string; repeat?: number; seed?: number }): THREE.CanvasTexture {
  const size = 512;
  const { canvas, ctx } = makeCanvas(size);
  const rng = mulberry32(options.seed ?? 7);

  ctx.fillStyle = options.base;
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = options.grain;
  for (let i = 0; i < 60; i++) {
    ctx.globalAlpha = 0.08 + rng() * 0.18;
    ctx.lineWidth = 0.6 + rng() * 1.4;
    const y0 = (i / 60) * size + (rng() - 0.5) * 6;
    ctx.beginPath();
    ctx.moveTo(0, y0);
    for (let x = 0; x <= size; x += 32) {
      ctx.lineTo(x, y0 + Math.sin(x * 0.02 + i) * 4 + (rng() - 0.5) * 3);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  const repeat = options.repeat ?? 2;
  return toTexture(canvas, repeat, repeat);
}

/** Brushed-metal streaks for bronze/brass fixtures. */
export function createBrushedMetalTexture(options: { base: string; repeat?: number; seed?: number }): THREE.CanvasTexture {
  const size = 256;
  const { canvas, ctx } = makeCanvas(size);
  const rng = mulberry32(options.seed ?? 3);

  ctx.fillStyle = options.base;
  ctx.fillRect(0, 0, size, size);

  for (let y = 0; y < size; y++) {
    ctx.globalAlpha = 0.04 + rng() * 0.08;
    ctx.strokeStyle = rng() > 0.5 ? "#ffffff" : "#000000";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  const repeat = options.repeat ?? 1;
  return toTexture(canvas, repeat, repeat);
}

/** Dusk skyline gradient for window glass — read as "outside" instead of a flat panel. */
export function createSkylineTexture(seed = 11): THREE.CanvasTexture {
  const width = 256;
  const height = 512;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  const rng = mulberry32(seed);

  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, "#e8b978");
  sky.addColorStop(0.45, "#c98a63");
  sky.addColorStop(1, "#3c4a63");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "rgba(20, 18, 24, 0.85)";
  let x = 0;
  while (x < width) {
    const w = 14 + rng() * 26;
    const h = 60 + rng() * 220;
    ctx.fillRect(x, height - h, w, h);
    for (let wy = height - h + 10; wy < height - 6; wy += 14) {
      for (let wx = x + 4; wx < x + w - 4; wx += 10) {
        if (rng() > 0.6) {
          ctx.fillStyle = "rgba(255, 214, 140, 0.55)";
          ctx.fillRect(wx, wy, 4, 6);
          ctx.fillStyle = "rgba(20, 18, 24, 0.85)";
        }
      }
    }
    x += w + 4 + rng() * 6;
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Radial-gradient floor emblem — a stand-in bank crest, not a copied logo. */
export function createFloorEmblemTexture(accent = "#c9a55c"): THREE.CanvasTexture {
  const size = 512;
  const { canvas, ctx } = makeCanvas(size);
  const cx = size / 2;
  const cy = size / 2;

  ctx.fillStyle = "#2c2416";
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = accent;
  ctx.lineWidth = 6;
  for (const r of [220, 190]) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.fillStyle = accent;
  const points = 8;
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const x = cx + Math.cos(angle) * 150;
    const y = cy + Math.sin(angle) * 150;
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.beginPath();
  ctx.arc(cx, cy, 60, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
