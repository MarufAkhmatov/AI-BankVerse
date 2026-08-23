// Loads the user-supplied Sketchfab bank hall (prototype/the bank/the_bank_hall.glb,
// optimized via gltf-transform into public/models/bank_hall_opt.glb — see NOTICE.md there)
// in place of the procedural BankHall.ts geometry. Exposes the same shape so main.ts's
// agent/player placement code doesn't need to change: a group to add to the scene, movement
// bounds derived by raycasting the actual model (see detectFloor below — the naive
// "ground to bbox.min.y" approach put the floor ~5 units below where it actually is,
// because some disconnected low geometry — foundation/exterior — sits under the real
// floor and skews the bounding box), and station anchor points chosen after visually
// inspecting where the model's own furniture actually sits.

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import type { HallBounds, StationMarker } from "./BankHall.js";

const HALL_MODEL_URL = "/models/bank_hall_opt.glb";

export interface ImportedBankHall {
  group: THREE.Group;
  bounds: HallBounds;
  bankerStations: StationMarker[];
  receptionDeskPosition: THREE.Vector3;
}

/**
 * Finds the real walkable floor by raycasting straight down across a grid, rather than
 * trusting the model's raw bounding box. Verified against this specific model via a
 * temporary window.__debug console probe: Box3.setFromObject gave minY=-1.99 (some
 * foundation/exterior mesh below the real floor), while raycasting found the actual floor
 * sitting consistently around y=4.9–5.0 across most of the interior — a ~5 unit gap that
 * put every character standing under the building. Returns the floor height (the mode of
 * per-column lowest hits) and the XZ footprint where that floor was actually found.
 */
function detectFloor(group: THREE.Group, box: THREE.Box3): { floorY: number; minX: number; maxX: number; minZ: number; maxZ: number } {
  const raycaster = new THREE.Raycaster();
  const down = new THREE.Vector3(0, -1, 0);
  const rayHeight = box.max.y + 2;
  const rayLength = box.max.y - box.min.y + 4;

  const samples: { x: number; z: number; y: number }[] = [];
  const step = Math.max(1, Math.min((box.max.x - box.min.x) / 20, (box.max.z - box.min.z) / 20));
  for (let x = box.min.x + step / 2; x <= box.max.x; x += step) {
    for (let z = box.min.z + step / 2; z <= box.max.z; z += step) {
      raycaster.set(new THREE.Vector3(x, rayHeight, z), down);
      raycaster.far = rayLength;
      const hits = raycaster.intersectObject(group, true);
      if (hits.length === 0) continue;
      const lowestY = Math.min(...hits.map((h) => h.point.y));
      samples.push({ x, z, y: lowestY });
    }
  }

  if (samples.length === 0) {
    return { floorY: box.min.y, minX: box.min.x, maxX: box.max.x, minZ: box.min.z, maxZ: box.max.z };
  }

  // Mode of the lowest-hit heights (rounded to 0.5) — the real floor is whichever height
  // recurs across the most XZ columns; stray high hits (mezzanines, hitting only a wall)
  // are comparatively rare.
  const counts = new Map<number, number>();
  for (const s of samples) {
    const key = Math.round(s.y * 2) / 2;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  let floorY = samples[0].y;
  let bestCount = 0;
  for (const [key, count] of counts) {
    if (count > bestCount) {
      bestCount = count;
      floorY = key;
    }
  }

  // Footprint = the XZ extent of samples that actually landed on that floor height.
  const onFloor = samples.filter((s) => Math.abs(s.y - floorY) < 1);
  const minX = Math.min(...onFloor.map((s) => s.x));
  const maxX = Math.max(...onFloor.map((s) => s.x));
  const minZ = Math.min(...onFloor.map((s) => s.z));
  const maxZ = Math.max(...onFloor.map((s) => s.z));
  return { floorY, minX, maxX, minZ, maxZ };
}

export async function loadBankHall(): Promise<ImportedBankHall> {
  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);

  const gltf = await loader.loadAsync(HALL_MODEL_URL);
  const group = gltf.scene;
  group.traverse((node) => {
    const mesh = node as THREE.Mesh;
    if (mesh.isMesh) {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
  });

  const rawBox = new THREE.Box3().setFromObject(group);
  const floor = detectFloor(group, rawBox);
  group.position.y -= floor.floorY;

  const margin = 1.5;
  const bounds: HallBounds = {
    minX: floor.minX + margin,
    maxX: floor.maxX - margin,
    minZ: floor.minZ + margin,
    maxZ: floor.maxZ - margin,
    entranceZ: floor.maxZ - margin,
    rearZ: floor.minZ + margin,
  };

  console.debug("[hall] detected floor", floor, "-> bounds", bounds);

  // Anchor points — NOT derived from `bounds` percentages. This building's real teller
  // counter and open floor were located by raycasting a grid of candidate XZ points and
  // visually confirming the result (a temporary window.__debug console session), because
  // the model's overall bounding box spans corridors/alcoves/mezzanines the naive
  // percentage-of-bounds math kept landing the player and agents inside walls of. This
  // specific counter alcove sits around x=1, z=-17 with confirmed open, correctly-heighted
  // floor from z=-20 up to the entrance area around z=0.
  const receptionDeskPosition = new THREE.Vector3(1, 0, -17);

  const bankerStations: StationMarker[] = [
    { position: new THREE.Vector3(-8, 0, -10), facing: Math.PI * 0.75 },
    { position: new THREE.Vector3(-8, 0, -14), facing: Math.PI * 0.75 },
    { position: new THREE.Vector3(-3, 0, -10), facing: Math.PI * 0.85 },
    { position: new THREE.Vector3(3, 0, -10), facing: -Math.PI * 0.85 },
    { position: new THREE.Vector3(8, 0, -10), facing: -Math.PI * 0.75 },
    { position: new THREE.Vector3(8, 0, -14), facing: -Math.PI * 0.75 },
  ];

  return { group, bounds, bankerStations, receptionDeskPosition };
}
