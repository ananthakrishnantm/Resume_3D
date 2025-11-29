import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

export let rocketIsPlaying = false;

let rocketMixer = null;
let rocketActions = [];

export async function loadRocket(scene) {
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync(
    "assets/scene/AnimatedAssets/rocket_launch.glb"
  );

  const rocket = gltf.scene;
  scene.add(rocket);

  // Animation mixer
  rocketMixer = new THREE.AnimationMixer(rocket);

  // Create an action for EACH animation clip
  rocketActions = gltf.animations.map((clip) => {
    const action = rocketMixer.clipAction(clip);
    action.clampWhenFinished = true;
    action.loop = THREE.LoopOnce;
    return action;
  });

  return { rocket, rocketMixer, rocketActions };
}

export function updateRocketAnimation(delta) {
  if (rocketMixer) rocketMixer.update(delta);
}

export function playRocketLaunch() {
  if (!rocketActions || rocketActions.length === 0) return 0;
  rocketIsPlaying = true;

  let longest = 0;

  // Play ALL animations
  rocketActions.forEach((action) => {
    action.reset();
    action.play();
    longest = Math.max(longest, action.getClip().duration);
  });

  // When ALL are done, re-enable
  rocketMixer.addEventListener("finished", () => {
    rocketIsPlaying = false; // ✅ enable interactions again
  });

  return longest;
}
