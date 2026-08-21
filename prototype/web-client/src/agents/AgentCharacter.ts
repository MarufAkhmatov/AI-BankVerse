// Placeholder AI employee — docs/18_CHARACTER_ASSET_PIPELINE.md, docs/15 PLACEHOLDERS rule
// ("structure the code so placeholders can later be replaced with MetaHuman"). This class is
// the AgentController seam: swap the mesh-building code for a skinned MetaHuman later without
// touching gaze/status/interaction logic.

import * as THREE from "three";

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
  bodyColor?: number;
}

/** Marked PLACEHOLDER per docs/33_DESIGN_SYSTEM.md §9 — not final character art. */
export class AgentCharacter {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly group: THREE.Group;
  status: AgentStatus = "AVAILABLE";

  private readonly statusDot: THREE.Mesh;
  private readonly head: THREE.Mesh;

  constructor(options: AgentCharacterOptions) {
    this.id = options.id;
    this.name = options.name;
    this.role = options.role;

    this.group = new THREE.Group();
    this.group.name = `PLACEHOLDER_Agent_${options.id}`;
    this.group.position.copy(options.position);

    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: options.bodyColor ?? 0x33475f,
      roughness: 0.6,
      metalness: 0.05,
    });
    const skinMaterial = new THREE.MeshStandardMaterial({ color: 0xd9b391, roughness: 0.7 });

    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.32, 0.9, 6, 12), bodyMaterial);
    body.position.y = 0.95;
    body.castShadow = true;
    this.group.add(body);

    this.head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), skinMaterial);
    this.head.position.y = 1.68;
    this.group.add(this.head);

    this.statusDot = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 8, 8),
      new THREE.MeshStandardMaterial({ color: STATUS_COLOR.AVAILABLE, emissive: STATUS_COLOR.AVAILABLE, emissiveIntensity: 0.8 }),
    );
    this.statusDot.position.set(0.3, 1.85, 0);
    this.group.add(this.statusDot);
  }

  setStatus(status: AgentStatus): void {
    this.status = status;
    const material = this.statusDot.material as THREE.MeshStandardMaterial;
    material.color.setHex(STATUS_COLOR[status]);
    material.emissive.setHex(STATUS_COLOR[status]);
  }

  /** docs/07_CHARACTER_AND_ANIMATION.md §7 Agent Attention — turn toward the player when near. */
  lookAtTarget(target: THREE.Vector3, maxDistance = 6): void {
    const distance = this.group.position.distanceTo(target);
    if (distance > maxDistance) return;
    const lookTarget = new THREE.Vector3(target.x, this.group.position.y, target.z);
    this.group.lookAt(lookTarget);
  }

  distanceTo(position: THREE.Vector3): number {
    return this.group.position.distanceTo(position);
  }
}
