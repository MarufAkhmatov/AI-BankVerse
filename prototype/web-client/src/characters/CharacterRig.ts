// Articulated humanoid rig shared by the player and every AI/customer character —
// docs/07_CHARACTER_AND_ANIMATION.md, docs/18_CHARACTER_ASSET_PIPELINE.md §4
// ("every employee needs a unique face, hairstyle, clothing... avoid making every
// character look identical"). Built from primitives with real joints (shoulder, elbow,
// hip, knee) so it can actually walk, not slide — the honest ceiling for a code-only,
// no-external-asset Three.js prototype. A rigged MetaHuman replaces this 1:1 later
// (docs/15 PLACEHOLDERS) without touching the animation driver in CharacterAnimator.ts.

import * as THREE from "three";

export interface CharacterAppearance {
  skinTone: number;
  hairColor: number;
  clothingColor: number;
  accentColor: number;
  hasHair: boolean;
  height: number; // scale multiplier, ~0.92-1.08
}

const DEFAULT_APPEARANCE: CharacterAppearance = {
  skinTone: 0xd9b391,
  hairColor: 0x2b2018,
  clothingColor: 0x24344a,
  accentColor: 0xc9a55c,
  hasHair: true,
  height: 1,
};

export interface CharacterJoints {
  root: THREE.Group;
  hips: THREE.Group;
  spine: THREE.Group;
  head: THREE.Group;
  leftShoulder: THREE.Group;
  rightShoulder: THREE.Group;
  leftElbow: THREE.Group;
  rightElbow: THREE.Group;
  leftHip: THREE.Group;
  rightHip: THREE.Group;
  leftKnee: THREE.Group;
  rightKnee: THREE.Group;
}

export interface CharacterRig {
  group: THREE.Group;
  joints: CharacterJoints;
  badge: THREE.Mesh;
}

function limbMaterial(color: number, roughness = 0.6, metalness = 0.03): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

/**
 * Builds a proportioned humanoid: hips -> spine -> head, with shoulder/elbow and
 * hip/knee joints on both sides so CharacterAnimator can drive a real walk cycle.
 */
export function buildCharacterRig(appearance: Partial<CharacterAppearance> = {}): CharacterRig {
  const a = { ...DEFAULT_APPEARANCE, ...appearance };
  const skin = limbMaterial(a.skinTone, 0.55);
  const clothing = limbMaterial(a.clothingColor, 0.65);
  const hair = limbMaterial(a.hairColor, 0.4, 0.05);
  const accent = limbMaterial(a.accentColor, 0.35, 0.5);

  const root = new THREE.Group();
  root.scale.setScalar(a.height);

  // --- Hips (movement root for the legs) --------------------------------------------------
  // 0.79 puts the feet (hip -0.05, upper leg -0.36, lower leg -0.35, foot half-height -0.03)
  // flush with y=0 — see CharacterAnimator's caller, which assumes root.position.y is ground.
  const hips = new THREE.Group();
  hips.position.y = 0.79;
  root.add(hips);

  const pelvis = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.22, 0.2), clothing);
  pelvis.castShadow = true;
  hips.add(pelvis);

  // --- Spine / torso -------------------------------------------------------------------
  const spine = new THREE.Group();
  spine.position.y = 0.11;
  hips.add(spine);

  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.19, 0.42, 4, 10), clothing);
  torso.position.y = 0.32;
  torso.castShadow = true;
  spine.add(torso);

  // ID badge on the chest — docs/18 §4 "ID badge".
  const badge = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.13, 0.015), accent);
  badge.position.set(0.11, 0.42, 0.19);
  spine.add(badge);

  // --- Head ------------------------------------------------------------------------------
  const head = new THREE.Group();
  head.position.y = 0.66;
  spine.add(head);

  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.13, 20, 16), skin);
  skull.castShadow = true;
  head.add(skull);

  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.05, 8), skin);
  nose.rotation.x = Math.PI / 2;
  nose.position.set(0, -0.01, 0.125);
  head.add(nose);

  for (const side of [-1, 1] as const) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.014, 8, 8), new THREE.MeshStandardMaterial({ color: 0x1a1410 }));
    eye.position.set(0.045 * side, 0.01, 0.118);
    head.add(eye);
  }

  if (a.hasHair) {
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.135, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.55), hair);
    cap.position.y = 0.045;
    head.add(cap);
  }

  // --- Arms (shoulder -> elbow -> hand) -----------------------------------------------------
  const [leftShoulder, leftElbow] = buildArm(spine, -1, clothing, skin);
  const [rightShoulder, rightElbow] = buildArm(spine, 1, clothing, skin);

  // --- Legs (hip -> knee -> foot) ------------------------------------------------------------
  const [leftHip, leftKnee] = buildLeg(hips, -1, clothing, skin);
  const [rightHip, rightKnee] = buildLeg(hips, 1, clothing, skin);

  return {
    group: root,
    joints: { root, hips, spine, head, leftShoulder, rightShoulder, leftElbow, rightElbow, leftHip, rightHip, leftKnee, rightKnee },
    badge,
  };
}

function buildArm(
  parent: THREE.Group,
  side: -1 | 1,
  clothing: THREE.Material,
  skin: THREE.Material,
): [THREE.Group, THREE.Group] {
  const shoulder = new THREE.Group();
  shoulder.position.set(0.24 * side, 0.5, 0);
  parent.add(shoulder);

  const upperArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 0.24, 4, 8), clothing);
  upperArm.position.y = -0.14;
  upperArm.castShadow = true;
  shoulder.add(upperArm);

  const elbow = new THREE.Group();
  elbow.position.y = -0.28;
  shoulder.add(elbow);

  const forearm = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.22, 4, 8), skin);
  forearm.position.y = -0.13;
  forearm.castShadow = true;
  elbow.add(forearm);

  const hand = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), skin);
  hand.position.y = -0.25;
  elbow.add(hand);

  return [shoulder, elbow];
}

function buildLeg(
  parent: THREE.Group,
  side: -1 | 1,
  clothing: THREE.Material,
  skin: THREE.Material,
): [THREE.Group, THREE.Group] {
  const hip = new THREE.Group();
  hip.position.set(0.1 * side, -0.05, 0);
  parent.add(hip);

  const upperLeg = new THREE.Mesh(new THREE.CapsuleGeometry(0.075, 0.32, 4, 8), clothing);
  upperLeg.position.y = -0.18;
  upperLeg.castShadow = true;
  hip.add(upperLeg);

  const knee = new THREE.Group();
  knee.position.y = -0.36;
  hip.add(knee);

  const lowerLeg = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.3, 4, 8), clothing);
  lowerLeg.position.y = -0.17;
  lowerLeg.castShadow = true;
  knee.add(lowerLeg);

  const foot = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.06, 0.19), new THREE.MeshStandardMaterial({ color: 0x14100c, roughness: 0.6 }));
  foot.position.set(0, -0.35, 0.05);
  knee.add(foot);

  return [hip, knee];
}

/** A small palette of varied looks so agents/customers never look cloned — docs/18 §4. */
export const APPEARANCE_PRESETS: CharacterAppearance[] = [
  { skinTone: 0xd9b391, hairColor: 0x2b2018, clothingColor: 0x24344a, accentColor: 0xc9a55c, hasHair: true, height: 1.0 },
  { skinTone: 0xc48a5f, hairColor: 0x120d0a, clothingColor: 0x2f2a24, accentColor: 0xc9a55c, hasHair: true, height: 0.96 },
  { skinTone: 0xe8c39e, hairColor: 0x6b4a2a, clothingColor: 0x3a2230, accentColor: 0xc9a55c, hasHair: true, height: 1.04 },
  { skinTone: 0x8a5a3a, hairColor: 0x0c0a08, clothingColor: 0x1f2733, accentColor: 0xc9a55c, hasHair: true, height: 1.02 },
  { skinTone: 0xf0d0ac, hairColor: 0xb8862f, clothingColor: 0x2a3d33, accentColor: 0xc9a55c, hasHair: true, height: 0.94 },
];
