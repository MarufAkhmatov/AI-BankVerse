// AI employee — docs/18_CHARACTER_ASSET_PIPELINE.md, docs/15 PLACEHOLDERS rule. Wraps an
// imported, rigged/skinned character (see characters/GLTFCharacterLoader.ts and
// public/models/NOTICE.md for provenance) — the seam where a licensed business-attire or
// MetaHuman import replaces this later without touching gaze/status/interaction logic.

import * as THREE from "three";
import { AnimatedCharacterController } from "../characters/AnimatedCharacterController.js";
import type { CharacterInstance } from "../characters/GLTFCharacterLoader.js";

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
  character: CharacterInstance;
  /** Approximate world-space height (meters) of the badge/status ring above the feet. */
  markerHeight?: number;
}

export class AgentCharacter {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly group: THREE.Group;
  status: AgentStatus = "AVAILABLE";

  private readonly animator: AnimatedCharacterController;
  private readonly statusRing: THREE.Mesh;

  constructor(options: AgentCharacterOptions) {
    this.id = options.id;
    this.name = options.name;
    this.role = options.role;

    this.group = options.character.group;
    this.group.name = `PLACEHOLDER_Agent_${options.id}`;
    this.group.position.copy(options.position);
    this.group.rotation.y = options.facing ?? 0;
    this.animator = new AnimatedCharacterController(options.character.mixer, options.character.animations);

    this.statusRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.06, 0.014, 8, 16),
      new THREE.MeshStandardMaterial({ color: STATUS_COLOR.AVAILABLE, emissive: STATUS_COLOR.AVAILABLE, emissiveIntensity: 1.1 }),
    );
    this.statusRing.position.set(0, options.markerHeight ?? 1.9, 0);
    this.group.add(this.statusRing);

    this.setStatus("AVAILABLE");
  }

  setStatus(status: AgentStatus): void {
    this.status = status;
    const color = STATUS_COLOR[status];
    const ringMat = this.statusRing.material as THREE.MeshStandardMaterial;
    ringMat.color.setHex(color);
    ringMat.emissive.setHex(color);
  }

  /** docs/19_ANIMATION_SYSTEM.md — idle work loop while stationary at their station. */
  update(deltaSeconds: number, _playerWorldPosition: THREE.Vector3): void {
    this.animator.update(deltaSeconds, 0); // agents stand at their station — idle-only cycle
  }

  distanceTo(position: THREE.Vector3): number {
    return this.group.position.distanceTo(position);
  }
}
