// Single-floor flagship hall — docs/61_FLAGSHIP_BANK_ARCHITECTURE.md,
// docs/62_BANK_FLOOR_PLAN.md. Correct scale and composition, procedural PBR-ish
// materials (docs/33 §3), no external texture files (docs/33 §9 Visual Quality Gate —
// still PLACEHOLDER until real photographed/scanned textures replace it).

import * as THREE from "three";
import { HALL } from "../constants.js";
import {
  createBrushedMetalTexture,
  createFloorEmblemTexture,
  createMarbleTexture,
  createSkylineTexture,
  createWoodTexture,
} from "./textures.js";

function buildMaterials() {
  const floorTex = createMarbleTexture({ base: "#d8cba8", vein: "#8a7550", repeat: 8, seed: 1 });
  const wallTex = createMarbleTexture({ base: "#ece1c8", vein: "#c7b98f", repeat: 3, seed: 2 });
  const columnTex = createMarbleTexture({ base: "#e3d7b8", vein: "#b9a878", repeat: 1.4, seed: 4 });
  const walnutTex = createWoodTexture({ base: "#3a2617", grain: "#1c120a", repeat: 2, seed: 7 });
  const bronzeTex = createBrushedMetalTexture({ base: "#8a6a3a", repeat: 1, seed: 3 });
  const skylineTex = createSkylineTexture(11);

  return {
    floor: new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.32, metalness: 0.08 }),
    floorEmblem: new THREE.MeshStandardMaterial({ map: createFloorEmblemTexture("#c9a55c"), roughness: 0.4, metalness: 0.3 }),
    wall: new THREE.MeshStandardMaterial({ map: wallTex, roughness: 0.65, metalness: 0.03 }),
    ceiling: new THREE.MeshStandardMaterial({ color: 0x2c2619, roughness: 0.85, metalness: 0.0 }),
    column: new THREE.MeshStandardMaterial({ map: columnTex, roughness: 0.5, metalness: 0.05 }),
    columnCap: new THREE.MeshStandardMaterial({ map: bronzeTex, roughness: 0.3, metalness: 0.75 }),
    bronze: new THREE.MeshStandardMaterial({ map: bronzeTex, roughness: 0.3, metalness: 0.85 }),
    walnut: new THREE.MeshStandardMaterial({ map: walnutTex, roughness: 0.45, metalness: 0.08 }),
    leather: new THREE.MeshStandardMaterial({ color: 0x1f4a3a, roughness: 0.55, metalness: 0.05 }),
    carpet: new THREE.MeshStandardMaterial({ color: 0x5a1f26, roughness: 0.9, metalness: 0.0 }),
    glass: new THREE.MeshPhysicalMaterial({
      color: 0xdfeaf2,
      roughness: 0.05,
      metalness: 0,
      transmission: 0.85,
      transparent: true,
      opacity: 0.55,
      thickness: 0.05,
    }),
    skyline: new THREE.MeshBasicMaterial({ map: skylineTex, toneMapped: false }),
  };
}

export interface HallBounds {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  entranceZ: number;
  rearZ: number;
}

/** docs/62_BANK_FLOOR_PLAN.md §2 — Z runs entrance(+) to rear(-), X is width. */
export const HALL_BOUNDS: HallBounds = {
  minX: -HALL.width / 2 + 1.2,
  maxX: HALL.width / 2 - 1.2,
  minZ: -HALL.length / 2 + 1.2,
  maxZ: HALL.length / 2 - 1.2,
  entranceZ: HALL.length / 2,
  rearZ: -HALL.length / 2,
};

export interface StationMarker {
  position: THREE.Vector3;
  facing: number;
}

export interface BankHall {
  group: THREE.Group;
  bankerStations: StationMarker[];
  receptionDeskPosition: THREE.Vector3;
}

export function buildBankHall(): BankHall {
  const group = new THREE.Group();
  const MATERIALS = buildMaterials();
  const { width, length, ceilingHeight } = HALL;

  // --- Floor -------------------------------------------------------------------------
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(width, length), MATERIALS.floor);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  group.add(floor);

  const emblem = new THREE.Mesh(new THREE.CircleGeometry(3.2, 48), MATERIALS.floorEmblem);
  emblem.rotation.x = -Math.PI / 2;
  emblem.position.set(0, 0.01, 0);
  group.add(emblem);

  // Central carpet runner down the main aisle — docs/62 §4 Central Axis.
  const runner = new THREE.Mesh(new THREE.PlaneGeometry(3.2, length * 0.7), MATERIALS.carpet);
  runner.rotation.x = -Math.PI / 2;
  runner.position.set(0, 0.008, -length * 0.06);
  group.add(runner);

  // --- Ceiling -------------------------------------------------------------------------
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(width, length), MATERIALS.ceiling);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = ceilingHeight;
  group.add(ceiling);

  // --- Long side walls with glazed window bays -------------------------------------------
  for (const side of [-1, 1] as const) {
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(length, ceilingHeight), MATERIALS.wall);
    wall.position.set((side * width) / 2, ceilingHeight / 2, 0);
    wall.rotation.y = side > 0 ? -Math.PI / 2 : Math.PI / 2;
    group.add(wall);

    const windowCount = 8;
    for (let i = 0; i < windowCount; i++) {
      const z = -length / 2 + (length / windowCount) * (i + 0.5);

      const skyline = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 8.4), MATERIALS.skyline);
      skyline.position.set((side * width) / 2 - side * 0.12, 9, z);
      skyline.rotation.y = side > 0 ? -Math.PI / 2 : Math.PI / 2;
      group.add(skyline);

      const glass = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 8), MATERIALS.glass);
      glass.position.set((side * width) / 2 - side * 0.05, 9, z);
      glass.rotation.y = side > 0 ? -Math.PI / 2 : Math.PI / 2;
      group.add(glass);

      // Bronze mullion frame around each bay.
      const frameGeo = new THREE.EdgesGeometry(new THREE.PlaneGeometry(2.3, 8.1));
      const frameLines = new THREE.LineSegments(frameGeo, new THREE.LineBasicMaterial({ color: 0x8a6a3a }));
      frameLines.position.copy(glass.position);
      frameLines.rotation.copy(glass.rotation);
      group.add(frameLines);
    }
  }

  // --- Rear wall (north) — entrance stays open on the south end -------------------------
  const rearWall = new THREE.Mesh(new THREE.PlaneGeometry(width, ceilingHeight), MATERIALS.wall);
  rearWall.position.set(0, ceilingHeight / 2, -length / 2);
  group.add(rearWall);

  // --- Columns along both long walls — docs/61 §9, with bronze capital + base -------------
  const columnSpacing = 8;
  const columnCount = Math.floor(length / columnSpacing);
  const shaftHeight = ceilingHeight * 0.86;
  for (const side of [-1, 1] as const) {
    for (let i = 0; i <= columnCount; i++) {
      const z = -length / 2 + i * columnSpacing;
      const x = (side * width) / 2 + side * -1.6;

      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.56, shaftHeight, 20), MATERIALS.column);
      shaft.position.set(x, shaftHeight / 2, z);
      shaft.castShadow = true;
      group.add(shaft);

      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 0.3, 20), MATERIALS.columnCap);
      base.position.set(x, 0.15, z);
      group.add(base);

      const capital = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.5, 0.35, 20), MATERIALS.columnCap);
      capital.position.set(x, shaftHeight + 0.17, z);
      group.add(capital);
    }
  }

  // --- Chandeliers — docs/61 §7, 7-9 fixtures along the central axis -----------------------
  const chandelierCount = 7;
  for (let i = 0; i < chandelierCount; i++) {
    const z = -length / 2 + (length / (chandelierCount + 1)) * (i + 1);
    buildChandelier(group, MATERIALS.bronze, new THREE.Vector3(0, ceilingHeight - 1.4, z));
  }

  // --- Reception desk — docs/61 §14, just inside the entrance -----------------------------
  const receptionDeskPosition = new THREE.Vector3(0, 0, length / 2 - 6);
  buildDesk(group, MATERIALS, receptionDeskPosition, 6, Math.PI);

  // --- Banker stations flanking the central aisle — docs/61 §11 ---------------------------
  const bankerStations: StationMarker[] = [];
  const stationRows = 3;
  for (let row = 0; row < stationRows; row++) {
    const z = length / 2 - 16 - row * 8;
    for (const side of [-1, 1] as const) {
      const x = side * 7;
      const facing = side > 0 ? -Math.PI / 2 : Math.PI / 2;
      buildDesk(group, MATERIALS, new THREE.Vector3(x, 0, z), 2.2, facing);
      bankerStations.push({ position: new THREE.Vector3(x - side * 1.3, 0, z), facing });
    }
  }

  return { group, bankerStations, receptionDeskPosition };
}

function buildDesk(
  group: THREE.Group,
  materials: ReturnType<typeof buildMaterials>,
  position: THREE.Vector3,
  deskWidth: number,
  facing: number,
): void {
  const pivot = new THREE.Group();
  pivot.position.copy(position);
  pivot.rotation.y = facing;

  const desk = new THREE.Mesh(new THREE.BoxGeometry(deskWidth, 1.0, 1.1), materials.walnut);
  desk.position.y = 0.5;
  desk.castShadow = true;
  pivot.add(desk);

  const deskTop = new THREE.Mesh(new THREE.BoxGeometry(deskWidth + 0.1, 0.06, 1.2), materials.bronze);
  deskTop.position.y = 1.03;
  pivot.add(deskTop);

  const chair = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.9, 0.55), materials.leather);
  chair.position.set(0, 0.45, 0.95);
  pivot.add(chair);

  group.add(pivot);
}

function buildChandelier(group: THREE.Group, bronze: THREE.Material, position: THREE.Vector3): void {
  const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.1, 6), bronze);
  chain.position.copy(position).setY(position.y + 0.55);
  group.add(chain);

  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.07, 8, 24), bronze);
  ring.position.copy(position);
  ring.rotation.x = Math.PI / 2;
  group.add(ring);

  const innerRing = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.045, 8, 24), bronze);
  innerRing.position.copy(position).setY(position.y - 0.15);
  innerRing.rotation.x = Math.PI / 2;
  group.add(innerRing);

  const bulbCount = 8;
  for (let i = 0; i < bulbCount; i++) {
    const angle = (i / bulbCount) * Math.PI * 2;
    const bulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0xffdca0, emissive: 0xffb968, emissiveIntensity: 1.2 }),
    );
    bulb.position.set(position.x + Math.cos(angle) * 0.85, position.y, position.z + Math.sin(angle) * 0.85);
    group.add(bulb);
  }

  const light = new THREE.PointLight(0xffd9a0, 10, 18, 2);
  light.position.copy(position).setY(position.y - 0.1);
  group.add(light);
}

export function buildHallLighting(scene: THREE.Scene): void {
  const hemi = new THREE.HemisphereLight(0xfdf3df, 0x2b2113, 0.5);
  scene.add(hemi);

  const daylight = new THREE.DirectionalLight(0xfff2d6, 1.1);
  daylight.position.set(12, 20, 10);
  daylight.castShadow = true;
  daylight.shadow.mapSize.set(2048, 2048);
  daylight.shadow.camera.left = -25;
  daylight.shadow.camera.right = 25;
  daylight.shadow.camera.top = 25;
  daylight.shadow.camera.bottom = -25;
  daylight.shadow.bias = -0.0015;
  scene.add(daylight);

  scene.fog = new THREE.Fog(0x2a2115, 22, 68);
}
