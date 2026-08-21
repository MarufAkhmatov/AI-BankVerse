// Single-floor flagship hall — docs/61_FLAGSHIP_BANK_ARCHITECTURE.md,
// docs/62_BANK_FLOOR_PLAN.md. Greybox-plus stage: correct scale and composition,
// simple PBR-ish materials, no external textures yet (docs/33 §9 Visual Quality Gate —
// this is explicitly a PLACEHOLDER pass, not final art).

import * as THREE from "three";
import { HALL } from "../constants.js";

const MATERIALS = {
  floor: new THREE.MeshStandardMaterial({ color: 0xcdbfa0, roughness: 0.35, metalness: 0.05 }),
  floorEmblem: new THREE.MeshStandardMaterial({ color: 0x8a6b2f, roughness: 0.3, metalness: 0.4 }),
  wall: new THREE.MeshStandardMaterial({ color: 0xe4d9c2, roughness: 0.6, metalness: 0.02 }),
  ceiling: new THREE.MeshStandardMaterial({ color: 0x3a3327, roughness: 0.8, metalness: 0.0 }),
  column: new THREE.MeshStandardMaterial({ color: 0xdcd0b5, roughness: 0.5, metalness: 0.05 }),
  bronze: new THREE.MeshStandardMaterial({ color: 0x8a6a3a, roughness: 0.35, metalness: 0.8 }),
  walnut: new THREE.MeshStandardMaterial({ color: 0x3d2a1c, roughness: 0.5, metalness: 0.1 }),
  window: new THREE.MeshStandardMaterial({
    color: 0xbcd7e8,
    roughness: 0.1,
    metalness: 0.1,
    emissive: 0x365065,
    emissiveIntensity: 0.4,
  }),
};

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
}

export interface BankHall {
  group: THREE.Group;
  bankerStations: StationMarker[];
  receptionDeskPosition: THREE.Vector3;
}

export function buildBankHall(): BankHall {
  const group = new THREE.Group();
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

  // --- Ceiling -------------------------------------------------------------------------
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(width, length), MATERIALS.ceiling);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = ceilingHeight;
  group.add(ceiling);

  // --- Long side walls with window strips ------------------------------------------------
  for (const side of [-1, 1] as const) {
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(length, ceilingHeight), MATERIALS.wall);
    wall.position.set((side * width) / 2, ceilingHeight / 2, 0);
    wall.rotation.y = side > 0 ? -Math.PI / 2 : Math.PI / 2;
    group.add(wall);

    const windowCount = 8;
    for (let i = 0; i < windowCount; i++) {
      const z = -length / 2 + (length / windowCount) * (i + 0.5);
      const window = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 8), MATERIALS.window);
      window.position.set((side * width) / 2 - side * 0.05, 9, z);
      window.rotation.y = side > 0 ? -Math.PI / 2 : Math.PI / 2;
      group.add(window);
    }
  }

  // --- Rear wall (north) — entrance stays open on the south end -------------------------
  const rearWall = new THREE.Mesh(new THREE.PlaneGeometry(width, ceilingHeight), MATERIALS.wall);
  rearWall.position.set(0, ceilingHeight / 2, -length / 2);
  group.add(rearWall);

  // --- Columns along both long walls — docs/61 §9 -----------------------------------------
  const columnSpacing = 8;
  const columnCount = Math.floor(length / columnSpacing);
  for (const side of [-1, 1] as const) {
    for (let i = 0; i <= columnCount; i++) {
      const z = -length / 2 + i * columnSpacing;
      const column = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.6, ceilingHeight * 0.92, 16), MATERIALS.column);
      column.position.set((side * width) / 2 + side * -1.6, (ceilingHeight * 0.92) / 2, z);
      group.add(column);
    }
  }

  // --- Chandeliers — docs/61 §7, 7-9 fixtures along the central axis -----------------------
  const chandelierCount = 7;
  for (let i = 0; i < chandelierCount; i++) {
    const z = -length / 2 + (length / (chandelierCount + 1)) * (i + 1);
    const fixture = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.08, 8, 24), MATERIALS.bronze);
    fixture.position.set(0, ceilingHeight - 2.5, z);
    fixture.rotation.x = Math.PI / 2;
    group.add(fixture);

    const light = new THREE.PointLight(0xffd9a0, 12, 18, 2);
    light.position.set(0, ceilingHeight - 2.6, z);
    group.add(light);
  }

  // --- Reception desk — docs/61 §14, just inside the entrance -----------------------------
  const receptionDeskPosition = new THREE.Vector3(0, 0, length / 2 - 6);
  const receptionDesk = new THREE.Mesh(new THREE.BoxGeometry(6, 1.1, 1.4), MATERIALS.walnut);
  receptionDesk.position.copy(receptionDeskPosition).setY(0.55);
  group.add(receptionDesk);

  // --- Banker stations flanking the central aisle — docs/61 §11, PLACEHOLDER desks --------
  const bankerStations: StationMarker[] = [];
  const stationRows = 3;
  for (let row = 0; row < stationRows; row++) {
    const z = length / 2 - 16 - row * 8;
    for (const side of [-1, 1] as const) {
      const x = side * 7;
      const desk = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1, 1.1), MATERIALS.walnut);
      desk.position.set(x, 0.5, z);
      group.add(desk);
      bankerStations.push({ position: new THREE.Vector3(x, 0, z - 1.4 * side * -1) });
    }
  }

  return { group, bankerStations, receptionDeskPosition };
}

export function buildHallLighting(scene: THREE.Scene): void {
  const hemi = new THREE.HemisphereLight(0xfdf3df, 0x2b2113, 0.55);
  scene.add(hemi);

  const daylight = new THREE.DirectionalLight(0xfff2d6, 0.9);
  daylight.position.set(12, 20, 10);
  daylight.castShadow = true;
  daylight.shadow.mapSize.set(1024, 1024);
  daylight.shadow.camera.left = -25;
  daylight.shadow.camera.right = 25;
  daylight.shadow.camera.top = 25;
  daylight.shadow.camera.bottom = -25;
  scene.add(daylight);

  scene.fog = new THREE.Fog(0x2a2115, 20, 65);
}
