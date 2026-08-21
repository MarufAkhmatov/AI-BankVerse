// Single-floor flagship hall — docs/61_FLAGSHIP_BANK_ARCHITECTURE.md,
// docs/62_BANK_FLOOR_PLAN.md. Correct scale and composition. Floor/wall/column marble is
// AI-generated photographic texture (public/textures/, see NOTICE.md there); furniture and
// fixtures stay on the procedural canvas textures from textures.ts — docs/33 §9 Visual
// Quality Gate still applies, all of this remains PLACEHOLDER until real scanned material
// libraries replace it.

import * as THREE from "three";
import { HALL } from "../constants.js";
import {
  createBrushedMetalTexture,
  createCurtainTexture,
  createFloorEmblemTexture,
  createSkylineTexture,
  createVaultTexture,
  createWoodTexture,
} from "./textures.js";

const textureLoader = new THREE.TextureLoader();

function loadPhotoTexture(url: string, repeat: number): THREE.Texture {
  const texture = textureLoader.load(url);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeat, repeat);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function buildMaterials() {
  const floorTex = loadPhotoTexture("/textures/floor_marble.png", 6);
  const wallTex = loadPhotoTexture("/textures/wall_marble.png", 3);
  const columnTex = loadPhotoTexture("/textures/wall_marble.png", 1.2);
  const walnutTex = createWoodTexture({ base: "#3a2617", grain: "#1c120a", repeat: 2, seed: 7 });
  const bronzeTex = createBrushedMetalTexture({ base: "#8a6a3a", repeat: 1, seed: 3 });
  const skylineTex = createSkylineTexture(11);
  const vaultTex = createVaultTexture({ repeatX: 14, repeatY: 2 });
  const curtainTex = createCurtainTexture("#a8552a", 1);

  return {
    floor: new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.28, metalness: 0.06 }),
    floorEmblem: new THREE.MeshStandardMaterial({ map: createFloorEmblemTexture("#c9a55c"), roughness: 0.4, metalness: 0.3 }),
    wall: new THREE.MeshStandardMaterial({ map: wallTex, roughness: 0.55, metalness: 0.02 }),
    // docs/63 — an original Guastavino-inspired quilted vault, not a traced copy.
    vault: new THREE.MeshStandardMaterial({ map: vaultTex, roughness: 0.9, metalness: 0.0, side: THREE.DoubleSide }),
    column: new THREE.MeshStandardMaterial({ map: columnTex, roughness: 0.4, metalness: 0.04 }),
    columnCap: new THREE.MeshStandardMaterial({ map: bronzeTex, roughness: 0.3, metalness: 0.75 }),
    bronze: new THREE.MeshStandardMaterial({ map: bronzeTex, roughness: 0.3, metalness: 0.85 }),
    walnut: new THREE.MeshStandardMaterial({ map: walnutTex, roughness: 0.45, metalness: 0.08 }),
    leather: new THREE.MeshStandardMaterial({ color: 0x1f4a3a, roughness: 0.55, metalness: 0.05 }),
    carpet: new THREE.MeshStandardMaterial({ color: 0x5a1f26, roughness: 0.9, metalness: 0.0 }),
    curtain: new THREE.MeshStandardMaterial({ map: curtainTex, roughness: 0.75, metalness: 0.0, side: THREE.DoubleSide }),
    glass: new THREE.MeshPhysicalMaterial({
      color: 0xdfeaf2,
      roughness: 0.05,
      metalness: 0,
      transmission: 0.85,
      transparent: true,
      opacity: 0.55,
      thickness: 0.05,
      side: THREE.DoubleSide,
    }),
    skyline: new THREE.MeshBasicMaterial({ map: skylineTex, toneMapped: false, side: THREE.DoubleSide }),
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

  // --- Vaulted ceiling — docs/61 §8, a shallow Guastavino-style barrel vault ---------------
  // Segmental (not full-semicircle) arch: a true half-circle spanning the full 30m width
  // would rise ~15m on its own, blowing past the 14-18m target. Solving a wide-radius,
  // shallow-angle segment for a fixed chord (=width) and target rise keeps the peak at
  // exactly `ceilingHeight` while deriving a believable wall/springline height under it.
  const vaultRadius = width * 0.87;
  const vaultHalfAngle = Math.asin(width / 2 / vaultRadius);
  const vaultRise = vaultRadius * (1 - Math.cos(vaultHalfAngle));
  const wallHeight = ceilingHeight - vaultRise;

  const vaultGeo = new THREE.CylinderGeometry(
    vaultRadius,
    vaultRadius,
    length,
    48,
    1,
    true,
    Math.PI / 2 - vaultHalfAngle,
    vaultHalfAngle * 2,
  );
  // CylinderGeometry's cross-section is (x = radius*sinTheta, z = radius*cosTheta), not
  // (cos, sin) as the usual textbook convention — confirmed by dumping actual vertex data
  // after a first attempt put the whole vault mesh underneath the floor. rotateY(90°) moves
  // the cos-component (the one that spans ±width/2 at the springline) onto X; the follow-up
  // rotateX(90°) then moves the sin-component (the "rise") onto Y and the old height axis
  // onto Z, without re-mixing X.
  vaultGeo.rotateY(Math.PI / 2);
  vaultGeo.rotateX(Math.PI / 2);
  const vault = new THREE.Mesh(vaultGeo, MATERIALS.vault);
  vault.position.set(0, wallHeight - vaultRadius * Math.cos(vaultHalfAngle), 0);
  group.add(vault);

  // --- Long side walls with arched, curtained window bays ---------------------------------
  const windowWidth = 2.6;
  const windowHeight = 7.4;
  const windowSill = 2.6;
  const archGeo = createArchGeometry(windowWidth, windowHeight);
  const archFrameGeo = new THREE.EdgesGeometry(archGeo);

  for (const side of [-1, 1] as const) {
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(length, wallHeight), MATERIALS.wall);
    wall.position.set((side * width) / 2, wallHeight / 2, 0);
    wall.rotation.y = side > 0 ? -Math.PI / 2 : Math.PI / 2;
    group.add(wall);

    const windowCount = 8;
    for (let i = 0; i < windowCount; i++) {
      const z = -length / 2 + (length / windowCount) * (i + 0.5);
      const rotY = side > 0 ? -Math.PI / 2 : Math.PI / 2;

      const skyline = new THREE.Mesh(archGeo, MATERIALS.skyline);
      skyline.position.set((side * width) / 2 - side * 0.12, windowSill, z);
      skyline.rotation.y = rotY;
      group.add(skyline);

      const glass = new THREE.Mesh(archGeo, MATERIALS.glass);
      glass.position.set((side * width) / 2 - side * 0.05, windowSill, z);
      glass.rotation.y = rotY;
      group.add(glass);

      const frameLines = new THREE.LineSegments(archFrameGeo, new THREE.LineBasicMaterial({ color: 0x8a6a3a }));
      frameLines.position.copy(glass.position);
      frameLines.rotation.copy(glass.rotation);
      group.add(frameLines);

      // Draped curtains flanking each bay — docs/63 reference photo's most recognizable detail.
      const curtainHeight = windowHeight + windowSill + 1.5;
      for (const curtainSide of [-1, 1] as const) {
        const curtain = new THREE.Mesh(new THREE.PlaneGeometry(0.85, curtainHeight), MATERIALS.curtain);
        curtain.position.set(
          (side * width) / 2 - side * 0.18,
          curtainHeight / 2,
          z + curtainSide * (windowWidth / 2 + 0.5),
        );
        curtain.rotation.y = rotY;
        group.add(curtain);
      }
    }
  }

  // --- Rear wall (north) — entrance stays open on the south end -------------------------
  const rearWall = new THREE.Mesh(new THREE.PlaneGeometry(width, wallHeight), MATERIALS.wall);
  rearWall.position.set(0, wallHeight / 2, -length / 2);
  group.add(rearWall);

  // --- Columns along both long walls — docs/61 §9, with bronze capital + base -------------
  const columnSpacing = 8;
  const columnCount = Math.floor(length / columnSpacing);
  const shaftHeight = wallHeight * 0.94;
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

  // --- Central teller counter — docs/63 reference photo's defining feature ----------------
  // A grand bronze-and-glass counter island down the central aisle, between reception and
  // the department stations, echoing the flagship-hall composition without literally
  // copying it — see the "financial cathedral" visual test in docs/61 §19.
  buildTellerCounter(group, MATERIALS, length / 2 - 20, 16);

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

/** Rectangle-with-semicircular-top window pane profile, in local X (width) / Y (height). */
function createArchGeometry(width: number, height: number): THREE.ShapeGeometry {
  const halfW = width / 2;
  const springLine = height - halfW;
  const shape = new THREE.Shape();
  shape.moveTo(-halfW, 0);
  shape.lineTo(-halfW, springLine);
  shape.absarc(0, springLine, halfW, Math.PI, 0, false);
  shape.lineTo(halfW, 0);
  shape.closePath();
  return new THREE.ShapeGeometry(shape, 24);
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

/** The grand central teller counter — see the docs/63 reference photo call-out above. */
function buildTellerCounter(
  group: THREE.Group,
  materials: ReturnType<typeof buildMaterials>,
  centerZ: number,
  counterLength: number,
): void {
  const width = 5.2;
  const baseHeight = 0.95;
  const glassHeight = 1.15;
  const pivot = new THREE.Group();
  pivot.position.set(0, 0, centerZ);

  const longBaseGeo = new THREE.BoxGeometry(0.25, baseHeight, counterLength);
  const railGeo = new THREE.BoxGeometry(0.16, 0.06, counterLength);
  for (const side of [-1, 1] as const) {
    const basePanel = new THREE.Mesh(longBaseGeo, materials.bronze);
    basePanel.position.set((side * width) / 2, baseHeight / 2, 0);
    basePanel.castShadow = true;
    pivot.add(basePanel);

    const glassPanel = new THREE.Mesh(new THREE.PlaneGeometry(counterLength, glassHeight), materials.glass);
    glassPanel.position.set((side * width) / 2 + side * 0.13, baseHeight + glassHeight / 2, 0);
    glassPanel.rotation.y = Math.PI / 2;
    pivot.add(glassPanel);

    const rail = new THREE.Mesh(railGeo, materials.bronze);
    rail.position.set((side * width) / 2, baseHeight + glassHeight + 0.03, 0);
    pivot.add(rail);
  }

  const shortBaseGeo = new THREE.BoxGeometry(width, baseHeight, 0.25);
  for (const end of [-1, 1] as const) {
    const endPanel = new THREE.Mesh(shortBaseGeo, materials.bronze);
    endPanel.position.set(0, baseHeight / 2, (end * counterLength) / 2);
    pivot.add(endPanel);
  }

  // Banker's lamps along the counter top — the warm little pools of light in the reference.
  const lampMaterial = new THREE.MeshStandardMaterial({ color: 0x2f5a3a, emissive: 0x173a20, emissiveIntensity: 0.5 });
  const lampCount = Math.max(2, Math.floor(counterLength / 3.2));
  for (let i = 0; i < lampCount; i++) {
    const z = -counterLength / 2 + (counterLength / lampCount) * (i + 0.5);
    const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 0.28, 8), materials.bronze);
    lampBase.position.set(0, baseHeight + 0.14, z);
    pivot.add(lampBase);

    const lampShade = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.6), lampMaterial);
    lampShade.position.set(0, baseHeight + 0.32, z);
    lampShade.rotation.x = Math.PI;
    pivot.add(lampShade);

    const lampLight = new THREE.PointLight(0xfff0c8, 3, 5, 2);
    lampLight.position.set(0, baseHeight + 0.28, z);
    pivot.add(lampLight);
  }

  // Small pennant flags at the corners — decorative bank colors, not a national flag.
  const flagMaterial = new THREE.MeshStandardMaterial({ color: 0xc9a55c, roughness: 0.6, side: THREE.DoubleSide });
  for (const cx of [-width / 2, width / 2]) {
    for (const cz of [-counterLength / 2 + 0.3, counterLength / 2 - 0.3]) {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.3, 6), materials.bronze);
      pole.position.set(cx, baseHeight + glassHeight + 0.65, cz);
      pivot.add(pole);

      const flag = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.3), flagMaterial);
      flag.position.set(cx + (cx >= 0 ? 0.24 : -0.24), baseHeight + glassHeight + 1.18, cz);
      pivot.add(flag);
    }
  }

  group.add(pivot);
}

/** A tiered, multi-ring fixture — docs/63 reference photo's row of ornate chandeliers. */
function buildChandelier(group: THREE.Group, bronze: THREE.Material, position: THREE.Vector3): void {
  const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.4, 6), bronze);
  chain.position.copy(position).setY(position.y + 0.7);
  group.add(chain);

  const outerRing = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.06, 8, 28), bronze);
  outerRing.position.copy(position).setY(position.y - 0.32);
  outerRing.rotation.x = Math.PI / 2;
  group.add(outerRing);

  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.07, 8, 24), bronze);
  ring.position.copy(position);
  ring.rotation.x = Math.PI / 2;
  group.add(ring);

  const innerRing = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.045, 8, 24), bronze);
  innerRing.position.copy(position).setY(position.y - 0.15);
  innerRing.rotation.x = Math.PI / 2;
  group.add(innerRing);

  // Radial struts tying the tiers together, for a less "two hoops floating" silhouette.
  const strutCount = 6;
  for (let i = 0; i < strutCount; i++) {
    const angle = (i / strutCount) * Math.PI * 2;
    const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.42, 6), bronze);
    strut.position.set(position.x + Math.cos(angle) * 0.95, position.y - 0.16, position.z + Math.sin(angle) * 0.95);
    strut.rotation.z = Math.PI / 2 + angle;
    strut.rotation.x = 0.5;
    group.add(strut);
  }

  const bulbMaterial = new THREE.MeshStandardMaterial({ color: 0xffdca0, emissive: 0xffb968, emissiveIntensity: 1.3 });
  const bulbCount = 10;
  for (let i = 0; i < bulbCount; i++) {
    const angle = (i / bulbCount) * Math.PI * 2;
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 8), bulbMaterial);
    bulb.position.set(position.x + Math.cos(angle) * 0.85, position.y, position.z + Math.sin(angle) * 0.85);
    group.add(bulb);

    if (i % 2 === 0) {
      const lowerBulb = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), bulbMaterial);
      lowerBulb.position.set(
        position.x + Math.cos(angle) * 1.05,
        position.y - 0.32,
        position.z + Math.sin(angle) * 1.05,
      );
      group.add(lowerBulb);
    }
  }

  const finial = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 10), bronze);
  finial.position.copy(position).setY(position.y - 0.5);
  group.add(finial);

  const light = new THREE.PointLight(0xffd9a0, 11, 19, 2);
  light.position.copy(position).setY(position.y - 0.1);
  group.add(light);
}

/** Warm, moody, chandelier-led lighting — docs/63 reference photo, not a bright showroom. */
export function buildHallLighting(scene: THREE.Scene): void {
  const hemi = new THREE.HemisphereLight(0xe8c896, 0x231a10, 0.32);
  scene.add(hemi);

  const daylight = new THREE.DirectionalLight(0xffdca8, 0.55);
  daylight.position.set(12, 20, 10);
  daylight.castShadow = true;
  daylight.shadow.mapSize.set(2048, 2048);
  daylight.shadow.camera.left = -25;
  daylight.shadow.camera.right = 25;
  daylight.shadow.camera.top = 25;
  daylight.shadow.camera.bottom = -25;
  daylight.shadow.bias = -0.0015;
  scene.add(daylight);

  scene.fog = new THREE.Fog(0x1f150c, 18, 62);
}
