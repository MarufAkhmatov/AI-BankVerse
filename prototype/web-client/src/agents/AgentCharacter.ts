// AI employee — docs/18_CHARACTER_ASSET_PIPELINE.md, docs/15 PLACEHOLDERS rule
// ("structure the code so placeholders can later be replaced with MetaHuman"). Wraps the
// shared CharacterRig/CharacterAnimator so this is the seam where a skinned MetaHuman
// import will slot in later without touching gaze/status/interaction logic.

import * as THREE from "three";
import { CharacterAnimator } from "../characters/CharacterAnimator.js";
import { type CharacterAppearance, buildCharacterRig } from "../characters/CharacterRig.js";

export type AgentStatus = "AVAILABLE" | "BUSY" | "PROCESSING" | "OFFLINE";

const STATUS_COLOR: Record<AgentStatus, number> = {
  AVAILABLE: 0x4caf50,
  BUSY: 0xd9822b,
  PROCESSING: 0xd9822b,
  OFFLINE: 0x666666,
};

export interface AgentCharacterOptions {
  id: string;
  name: string;
  role: string;
  position: THREE.Vector3;
  facing?: number;
  appearance?: Partial<CharacterAppearance>;
}

export class AgentCharacter {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly group: THREE.Group;
  status: AgentStatus = "AVAILABLE";

  private readonly animator: CharacterAnimator;
  private readonly statusRing: THREE.Mesh;
  private readonly badge: THREE.Mesh;
  private idlePhase = Math.random() * Math.PI * 2;

  constructor(options: AgentCharacterOptions) {
    this.id = options.id;
    this.name = options.name;
    this.role = options.role;

    const rig = buildCharacterRig(options.appearance);
    this.group = rig.group;
    this.group.name = `PLACEHOLDER_Agent_${options.id}`;
    this.group.position.copy(options.position);
    this.group.rotation.y = options.facing ?? 0;
    this.animator = new CharacterAnimator(rig.joints);
    this.badge = rig.badge;

    this.statusRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.055, 0.012, 8, 16),
      new THREE.MeshStandardMaterial({ color: STATUS_COLOR.AVAILABLE, emissive: STATUS_COLOR.AVAILABLE, emissiveIntensity: 1.1 }),
    );
    this.statusRing.position.set(0, 1.76, 0);
    this.group.add(this.statusRing);

    this.setStatus("AVAILABLE");
  }

  setStatus(status: AgentStatus): void {
    this.status = status;
    const color = STATUS_COLOR[status];
    const ringMat = this.statusRing.material as THREE.MeshStandardMaterial;
    ringMat.color.setHex(color);
    ringMat.emissive.setHex(color);
    (this.badge.material as THREE.MeshStandardMaterial).emissive.setHex(status === "AVAILABLE" ? 0x000000 : color);
  }

  /** docs/19_ANIMATION_SYSTEM.md — idle work loop + attention toward a nearby player. */
  update(deltaSeconds: number, playerWorldPosition: THREE.Vector3): void {
    this.idlePhase += deltaSeconds;
    this.animator.update(deltaSeconds, 0); // agents stand at their station — idle-only cycle

    const distance = this.group.position.distanceTo(playerWorldPosition);
    if (distance < 6) {
      const local = playerWorldPosition.clone().sub(this.group.position);
      local.applyAxisAngle(new THREE.Vector3(0, 1, 0), -this.group.rotation.y);
      this.animator.lookAt({ x: local.x, z: local.z }, Math.max(0, 1 - distance / 6));
    } else {
      this.animator.lookAt({ x: 0, z: 1 }, 0);
    }
  }

  distanceTo(position: THREE.Vector3): number {
    return this.group.position.distanceTo(position);
  }
}
