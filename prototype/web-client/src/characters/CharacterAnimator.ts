// Procedural locomotion — the code-only stand-in for docs/41_MOTION_MATCHING_SETUP.md.
// Contralateral gait (left arm swings with right leg) driven by a phase accumulator whose
// frequency tracks actual movement speed, so faster walking never looks like sped-up film.
// docs/19_ANIMATION_SYSTEM.md §11 Anti-Robotic Rule: idle never fully freezes.

import type { CharacterJoints } from "./CharacterRig.js";

const ARM_SWING = 0.55;
const LEG_SWING = 0.5;
const KNEE_BEND = 0.9;
const ELBOW_BEND = 0.35;
const CYCLES_PER_METER = 0.9;

export class CharacterAnimator {
  private phase = 0;
  private blend = 0; // 0 = fully idle, 1 = fully walking
  private idleClock = Math.random() * 10;

  constructor(private readonly joints: CharacterJoints) {}

  /** @param speed current movement speed in meters/second (0 when stationary). */
  update(deltaSeconds: number, speed: number): void {
    this.idleClock += deltaSeconds;
    const targetBlend = Math.min(speed / 1.2, 1);
    this.blend += (targetBlend - this.blend) * Math.min(deltaSeconds * 8, 1);

    this.phase += deltaSeconds * speed * CYCLES_PER_METER * Math.PI * 2;
    const s = Math.sin(this.phase);
    const sOpp = Math.sin(this.phase + Math.PI);

    const walk = this.blend;
    const idle = 1 - this.blend;

    // Idle: gentle breathing + occasional weight shift, never perfectly static.
    const breathe = Math.sin(this.idleClock * 1.1) * 0.02;
    const sway = Math.sin(this.idleClock * 0.35) * 0.03;

    this.joints.spine.rotation.x = walk * s * 0.04 + idle * breathe;
    this.joints.spine.rotation.z = idle * sway * 0.4;
    this.joints.hips.position.y = 0.9 + walk * Math.abs(s) * 0.015 + idle * breathe * 0.3;
    this.joints.head.rotation.z = idle * sway * 0.3;

    this.joints.leftShoulder.rotation.x = walk * sOpp * ARM_SWING + idle * breathe * 0.5;
    this.joints.rightShoulder.rotation.x = walk * s * ARM_SWING + idle * breathe * 0.5;
    this.joints.leftElbow.rotation.x = walk * Math.max(0, sOpp) * ELBOW_BEND * -1 - idle * 0.15;
    this.joints.rightElbow.rotation.x = walk * Math.max(0, s) * ELBOW_BEND * -1 - idle * 0.15;

    this.joints.leftHip.rotation.x = walk * s * LEG_SWING;
    this.joints.rightHip.rotation.x = walk * sOpp * LEG_SWING;
    this.joints.leftKnee.rotation.x = walk * Math.max(0, -s) * KNEE_BEND;
    this.joints.rightKnee.rotation.x = walk * Math.max(0, -sOpp) * KNEE_BEND;
  }

  /** docs/07 §7 Agent Attention — head/torso turn toward a world-space point while idle-ish. */
  lookAt(localDirection: { x: number; z: number }, intensity = 1): void {
    const yaw = Math.atan2(localDirection.x, localDirection.z);
    this.joints.head.rotation.y = yaw * 0.6 * intensity;
    this.joints.spine.rotation.y = yaw * 0.25 * intensity;
  }
}
