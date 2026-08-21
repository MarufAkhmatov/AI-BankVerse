// Crossfades between an imported character's own baked animation clips (Idle/Walk/Run)
// based on movement speed — real Motion Matching is UE-only (docs/41), this is the
// honest equivalent for a Three.js prototype using off-the-shelf mocap clips.

import * as THREE from "three";
import { findClip } from "./GLTFCharacterLoader.js";

const WALK_THRESHOLD = 0.15;
const RUN_THRESHOLD = 4.2;
const FADE_SECONDS = 0.25;

export class AnimatedCharacterController {
  private readonly idleAction?: THREE.AnimationAction;
  private readonly walkAction?: THREE.AnimationAction;
  private readonly runAction?: THREE.AnimationAction;
  private current?: THREE.AnimationAction;

  constructor(
    private readonly mixer: THREE.AnimationMixer,
    animations: THREE.AnimationClip[],
  ) {
    const idleClip = findClip(animations, "idle", "tpose");
    const walkClip = findClip(animations, "walk");
    const runClip = findClip(animations, "run");

    this.idleAction = idleClip ? this.mixer.clipAction(idleClip) : undefined;
    this.walkAction = walkClip ? this.mixer.clipAction(walkClip) : undefined;
    this.runAction = runClip ? this.mixer.clipAction(runClip) : undefined;

    for (const action of [this.idleAction, this.walkAction, this.runAction]) {
      action?.play();
      if (action) action.enabled = false;
    }
    this.setAction(this.idleAction);
  }

  private setAction(next: THREE.AnimationAction | undefined): void {
    if (!next || this.current === next) return;
    const previous = this.current;
    next.enabled = true;
    next.setEffectiveTimeScale(1);
    next.setEffectiveWeight(1);
    if (previous) {
      next.time = 0;
      next.crossFadeFrom(previous, FADE_SECONDS, true);
    }
    this.current = next;
  }

  /** @param speed current movement speed in meters/second (0 when stationary). */
  update(deltaSeconds: number, speed: number): void {
    if (speed > RUN_THRESHOLD && this.runAction) this.setAction(this.runAction);
    else if (speed > WALK_THRESHOLD && (this.walkAction ?? this.runAction)) this.setAction(this.walkAction ?? this.runAction);
    else this.setAction(this.idleAction ?? this.walkAction);

    this.mixer.update(deltaSeconds);
  }
}
