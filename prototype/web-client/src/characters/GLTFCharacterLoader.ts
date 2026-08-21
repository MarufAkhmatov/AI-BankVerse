// Loads a rigged/skinned character once and hands out independent clones — the standard
// three.js technique (SkeletonUtils.clone) for reusing one skinned mesh + skeleton across
// many on-screen instances without re-parsing the GLB per instance. See
// public/models/NOTICE.md for where these assets come from and their license.

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";

export interface LoadedCharacterBase {
  scene: THREE.Group;
  animations: THREE.AnimationClip[];
}

export interface CharacterInstance {
  group: THREE.Group;
  mixer: THREE.AnimationMixer;
  animations: THREE.AnimationClip[];
}

const loader = new GLTFLoader();
const cache = new Map<string, Promise<LoadedCharacterBase>>();

export function loadCharacterBase(url: string): Promise<LoadedCharacterBase> {
  let pending = cache.get(url);
  if (!pending) {
    pending = loader.loadAsync(url).then((gltf) => ({ scene: gltf.scene, animations: gltf.animations }));
    cache.set(url, pending);
  }
  return pending;
}

/** Normalizes an unknown source scale/pivot to: feet at y=0, total height ~= targetHeight. */
export function normalizeToGround(object: THREE.Object3D, targetHeight = 1.78): void {
  // A freshly-cloned SkinnedMesh's bone matrices aren't propagated yet, which makes
  // Box3.setFromObject measure a degenerate near-zero box — force matrix propagation first.
  object.updateMatrixWorld(true);

  const box = new THREE.Box3();
  let hasGeometry = false;
  object.traverse((node) => {
    const mesh = node as THREE.Mesh;
    if (!mesh.isMesh || !mesh.geometry) return;
    mesh.geometry.computeBoundingBox();
    const meshBox = mesh.geometry.boundingBox!.clone().applyMatrix4(mesh.matrixWorld);
    box.union(meshBox);
    hasGeometry = true;
  });
  if (!hasGeometry) return;

  const size = box.getSize(new THREE.Vector3());
  if (size.y > 0) {
    const scale = targetHeight / size.y;
    object.scale.setScalar(scale);
    object.updateMatrixWorld(true);
  }

  const rescaledBox = new THREE.Box3();
  object.traverse((node) => {
    const mesh = node as THREE.Mesh;
    if (!mesh.isMesh || !mesh.geometry?.boundingBox) return;
    rescaledBox.union(mesh.geometry.boundingBox.clone().applyMatrix4(mesh.matrixWorld));
  });
  object.position.y -= rescaledBox.min.y;
}

export function instantiateCharacter(base: LoadedCharacterBase): CharacterInstance {
  const group = cloneSkeleton(base.scene) as THREE.Group;
  group.traverse((node) => {
    if ((node as THREE.Mesh).isMesh) {
      node.castShadow = true;
      node.receiveShadow = true;
    }
  });
  const mixer = new THREE.AnimationMixer(group);
  return { group, mixer, animations: base.animations };
}

/** Finds a clip by fuzzy name match (source models use inconsistent naming conventions). */
export function findClip(animations: THREE.AnimationClip[], ...keywords: string[]): THREE.AnimationClip | undefined {
  for (const keyword of keywords) {
    const match = animations.find((clip) => clip.name.toLowerCase().includes(keyword.toLowerCase()));
    if (match) return match;
  }
  return undefined;
}
