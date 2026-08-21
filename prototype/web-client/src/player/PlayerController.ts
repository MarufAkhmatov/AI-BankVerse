// Third-person player — docs/02_GAME_DESIGN_DOCUMENT.md §2 (over-the-shoulder, smooth
// follow, adjustable distance) and docs/41_MOTION_MATCHING_SETUP.md (start/stop/turn —
// approximated here with simple acceleration/deceleration, real Motion Matching is a UE-only
// concern per IMPLEMENTATION_PLAN.md Stage D).

import * as THREE from "three";
import { InputManager } from "./InputManager.js";
import type { HallBounds } from "../world/BankHall.js";

const WALK_SPEED = 3.2;
const RUN_SPEED = 6.2;
const ACCEL = 14;
const CAMERA_DISTANCE = 5.5;
const CAMERA_EYE_HEIGHT = 1.6;
const PITCH_MIN = -0.55;
const PITCH_MAX = 0.45;

export class PlayerController {
  readonly body: THREE.Group;

  private yaw = Math.PI; // facing -Z (into the hall) from the entrance
  private pitch = -0.12;
  private currentSpeed = 0;

  constructor(
    private readonly camera: THREE.PerspectiveCamera,
    private readonly input: InputManager,
    private readonly bounds: HallBounds,
    spawnPosition: THREE.Vector3,
  ) {
    this.body = buildPlaceholderPlayerBody();
    this.body.position.copy(spawnPosition);
  }

  update(deltaSeconds: number): void {
    const look = this.input.consumeLook();
    this.yaw += look.yaw;
    this.pitch = clamp(this.pitch + look.pitch, PITCH_MIN, PITCH_MAX);

    const move = this.input.moveInput;
    const targetSpeed = (move.run ? RUN_SPEED : WALK_SPEED) * clamp(Math.hypot(move.forward, move.strafe), 0, 1);
    this.currentSpeed += clamp(targetSpeed - this.currentSpeed, -ACCEL * deltaSeconds, ACCEL * deltaSeconds);

    if (Math.hypot(move.forward, move.strafe) > 0.001) {
      const forwardVec = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);
      const rightVec = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);
      const direction = forwardVec.multiplyScalar(move.forward).add(rightVec.multiplyScalar(move.strafe));
      if (direction.lengthSq() > 0) direction.normalize();

      const step = direction.multiplyScalar(this.currentSpeed * deltaSeconds);
      const next = this.body.position.clone().add(step);
      next.x = clamp(next.x, this.bounds.minX, this.bounds.maxX);
      next.z = clamp(next.z, this.bounds.minZ, this.bounds.maxZ);
      this.body.position.copy(next);
      this.body.rotation.y = Math.atan2(direction.x, direction.z) + Math.PI;
    } else {
      this.currentSpeed = Math.max(0, this.currentSpeed - ACCEL * deltaSeconds);
    }

    this.updateCamera();
  }

  private updateCamera(): void {
    const offset = new THREE.Vector3(0, 0, CAMERA_DISTANCE);
    offset.applyEuler(new THREE.Euler(this.pitch, this.yaw, 0, "YXZ"));

    const eyeTarget = this.body.position.clone().add(new THREE.Vector3(0, CAMERA_EYE_HEIGHT, 0));
    this.camera.position.copy(eyeTarget).add(offset);
    this.camera.position.y = Math.max(this.camera.position.y, 0.6);
    this.camera.lookAt(eyeTarget);
  }

  get position(): THREE.Vector3 {
    return this.body.position;
  }

  get isRunning(): boolean {
    return this.currentSpeed > WALK_SPEED + 0.1;
  }

  get isMoving(): boolean {
    return this.currentSpeed > 0.05;
  }
}

function buildPlaceholderPlayerBody(): THREE.Group {
  const group = new THREE.Group();
  group.name = "PLACEHOLDER_Player";

  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x1f2733, roughness: 0.6 });
  const skinMaterial = new THREE.MeshStandardMaterial({ color: 0xd9b391, roughness: 0.7 });

  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.3, 0.85, 6, 12), bodyMaterial);
  torso.position.y = 0.92;
  torso.castShadow = true;
  group.add(torso);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.21, 16, 16), skinMaterial);
  head.position.y = 1.62;
  group.add(head);

  return group;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
