// Third-person player — docs/02_GAME_DESIGN_DOCUMENT.md §2 (over-the-shoulder, smooth
// follow, adjustable distance) and docs/41_MOTION_MATCHING_SETUP.md (start/stop/turn —
// approximated here with simple acceleration/deceleration, real Motion Matching is a UE-only
// concern per IMPLEMENTATION_PLAN.md Stage D).

import * as THREE from "three";
import { CharacterAnimator } from "../characters/CharacterAnimator.js";
import { buildCharacterRig } from "../characters/CharacterRig.js";
import { InputManager } from "./InputManager.js";
import type { HallBounds } from "../world/BankHall.js";

const WALK_SPEED = 3.2;
const RUN_SPEED = 6.2;
const ACCEL = 14;
const CAMERA_DISTANCE = 5.5;
const CAMERA_EYE_HEIGHT = 1.5;
// Positive pitch = camera raised above eye height, looking down at the player (the
// classic over-the-shoulder angle from docs/06 §6 / docs/33 §8) — see updateCamera().
const DEFAULT_PITCH = 0.28;
const PITCH_MIN = -0.3;
const PITCH_MAX = 0.65;

export class PlayerController {
  readonly body: THREE.Group;

  private readonly animator: CharacterAnimator;
  // yaw=0 keeps the forward-movement formula below aligned with world -Z ("deeper into
  // the hall") as the default "W" direction, and the camera (see updateCamera) then sits
  // on the +Z side — i.e. behind the player, between them and the entrance — for free.
  private yaw = 0;
  private pitch = DEFAULT_PITCH;
  private currentSpeed = 0;

  constructor(
    private readonly camera: THREE.PerspectiveCamera,
    private readonly input: InputManager,
    private readonly bounds: HallBounds,
    spawnPosition: THREE.Vector3,
  ) {
    const rig = buildCharacterRig({
      clothingColor: 0x1f2733,
      accentColor: 0xc9a55c,
      hairColor: 0x241a12,
    });
    this.body = rig.group;
    this.body.name = "PLACEHOLDER_Player";
    this.body.position.copy(spawnPosition);
    this.animator = new CharacterAnimator(rig.joints);
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
      // The rig's local +Z is its face direction (nose/badge) — see CharacterRig.ts —
      // so no extra offset here, unlike the old undirected capsule placeholder.
      this.body.rotation.y = Math.atan2(direction.x, direction.z);
    } else {
      this.currentSpeed = Math.max(0, this.currentSpeed - ACCEL * deltaSeconds);
    }

    this.animator.update(deltaSeconds, this.currentSpeed);
    this.updateCamera();
  }

  /**
   * Explicit spherical orbit — NOT `offset.applyEuler(new THREE.Euler(pitch, yaw, 0,
   * "YXZ"))`. That composed rotation collapses the vertical component for large yaw
   * values (it put the camera almost inside the character's head at yaw=Math.PI,
   * verified against a screenshot). This formula's per-axis math is checked by hand at
   * yaw=0: camera lands at (0, eyeY + distance*sin(pitch), eyeZ + distance*cos(pitch)) —
   * i.e. straightforwardly behind (+Z) and above the player, looking down at eyeTarget.
   */
  private updateCamera(): void {
    const horizontalDistance = CAMERA_DISTANCE * Math.cos(this.pitch);
    const verticalOffset = CAMERA_DISTANCE * Math.sin(this.pitch);

    const eyeTarget = this.body.position.clone().add(new THREE.Vector3(0, CAMERA_EYE_HEIGHT, 0));
    this.camera.position.set(
      eyeTarget.x + Math.sin(this.yaw) * horizontalDistance,
      eyeTarget.y + verticalOffset,
      eyeTarget.z + Math.cos(this.yaw) * horizontalDistance,
    );
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

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
