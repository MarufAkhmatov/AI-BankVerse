// Ambient customer/staff/police NPCs — the high-poly, unrigged AI-generated character
// portraits the user supplied (prototype/workers and clients and police/, see
// public/models/npcs/NOTICE.md for the full list and what was decimated out of each).
// Only one of the twenty source files came with a skeleton + animation; the rest are
// static single-pose meshes, so they're placed as standing/waiting figures with a gentle
// whole-body idle sway (no skeleton to animate per-limb) rather than forced to "walk."
// docs/20_NPC_LIFE_SIMULATION.md — this is the lightweight slice of that: presence and
// idle life, not full queue/behavior-tree simulation.

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { AnimatedCharacterController } from "../characters/AnimatedCharacterController.js";
import { normalizeToGround } from "../characters/GLTFCharacterLoader.js";

const loader = new GLTFLoader();
loader.setMeshoptDecoder(MeshoptDecoder);

export interface StaticNpcSpec {
  url: string;
  position: THREE.Vector3;
  facing: number;
  heightMeters?: number;
}

export interface WalkingNpcSpec {
  url: string;
  waypoints: THREE.Vector3[];
  heightMeters?: number;
  speed?: number;
}

export class StaticNpc {
  private readonly idlePhase = Math.random() * Math.PI * 2;

  /** `group` must already be positioned AND ground-normalized — see loadStaticNpc. */
  constructor(
    readonly group: THREE.Group,
    private readonly baseY: number,
  ) {}

  update(elapsedSeconds: number): void {
    const t = elapsedSeconds + this.idlePhase;
    this.group.position.y = this.baseY + Math.sin(t * 0.9) * 0.01;
    this.group.rotation.z = Math.sin(t * 0.35) * 0.008;
  }
}

export async function loadStaticNpc(spec: StaticNpcSpec): Promise<StaticNpc> {
  const gltf = await loader.loadAsync(spec.url);
  const group = gltf.scene;
  group.traverse((node) => {
    const mesh = node as THREE.Mesh;
    if (mesh.isMesh) {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
  });

  // Position (with rotation) BEFORE normalizeToGround, not after: normalizeToGround's
  // ground correction is `position.y -= boundingBoxMin.y`, a *relative* adjustment on
  // top of whatever position.y already holds. Doing it in the other order — as an
  // earlier version of this file did — meant the position set here would overwrite that
  // correction outright, since group.position.copy(spec.position) always sets y back to
  // spec.position.y (usually 0). That silently only worked for Soldier.glb, whose bind
  // pose happens to already have its lowest point near local y=0; these AI-generated
  // portrait meshes have their origin near chest height, so the same bug here left
  // every character sunk roughly waist-deep into the floor — exactly what surfaced when
  // the user actually looked at it running.
  group.position.copy(spec.position);
  group.rotation.y = spec.facing;
  normalizeToGround(group, spec.heightMeters ?? 1.72);

  return new StaticNpc(group, group.position.y);
}

/** The one rigged source model — walks a simple back-and-forth patrol between waypoints. */
export class WalkingNpc {
  private readonly animator: AnimatedCharacterController;
  private waypointIndex = 1;

  /** `group` must already be positioned at waypoints[0] AND ground-normalized. */
  constructor(
    readonly group: THREE.Group,
    mixer: THREE.AnimationMixer,
    animations: THREE.AnimationClip[],
    private readonly waypoints: THREE.Vector3[],
    private readonly speed: number,
  ) {
    this.animator = new AnimatedCharacterController(mixer, animations);
  }

  update(deltaSeconds: number): void {
    const target = this.waypoints[this.waypointIndex];
    const toTarget = target.clone().sub(this.group.position);
    toTarget.y = 0; // horizontal-only steering — ground height was fixed once at load time
    const distance = toTarget.length();

    if (distance < 0.3) {
      this.waypointIndex = (this.waypointIndex + 1) % this.waypoints.length;
    } else {
      toTarget.normalize();
      this.group.position.addScaledVector(toTarget, this.speed * deltaSeconds);
      this.group.rotation.y = Math.atan2(toTarget.x, toTarget.z);
    }

    this.animator.update(deltaSeconds, distance < 0.3 ? 0 : this.speed);
  }
}

export async function loadWalkingNpc(spec: WalkingNpcSpec): Promise<WalkingNpc> {
  const gltf = await loader.loadAsync(spec.url);
  const group = gltf.scene;
  group.traverse((node) => {
    const mesh = node as THREE.Mesh;
    if (mesh.isMesh) {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
  });

  // Same position-then-normalize order as loadStaticNpc, and for the same reason.
  group.position.copy(spec.waypoints[0]);
  normalizeToGround(group, spec.heightMeters ?? 1.72);

  const mixer = new THREE.AnimationMixer(group);
  return new WalkingNpc(group, mixer, gltf.animations, spec.waypoints, spec.speed ?? 0.9);
}
