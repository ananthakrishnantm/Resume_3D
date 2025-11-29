import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { registerInteractable } from "../interactables.js";
import * as THREE from "three";
import { playRocketLaunch, rocketIsPlaying } from "./Rocket.js";
import { gsap } from "gsap";

export async function createButton(scene) {
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync("assets/scene/assets/button.glb");
  const root = gltf.scene;

  // Find the cube (button)
  let buttonMesh = null;
  root.traverse((child) => {
    if (child.isMesh) buttonMesh = child;
  });

  if (!buttonMesh) {
    console.error("❌ No mesh found in GLB");
    return;
  }

  scene.add(root);

  // Save original Y
  buttonMesh.userData.originalY = buttonMesh.position.y;

  //   console.log(
  //     "BUTTON READY AT:",
  //     buttonMesh.getWorldPosition(new THREE.Vector3())
  //   );

  // Register THIS mesh
  registerInteractable(
    buttonMesh,
    () => {
      if (rocketIsPlaying) return; // 🚫 avoid spam & double clicks

      pressButton(buttonMesh); // button animation
      const duration = playRocketLaunch(); // 🚀 trigger rocket
      console.log("Rocket launched, animation duration:", duration);
    },
    { distance: 3 }
  );

  return buttonMesh;
}

function pressButton(mesh) {
  const originalY = mesh.userData.originalY;

  gsap.to(mesh.position, { y: originalY - 1, duration: 0.1 });
  gsap.to(mesh.position, { y: originalY, duration: 0.1, delay: 0.1 });

  //   console.log("Rocket launched, animation duration:", duration);

  //   console.log("BUTTON PRESS ANIMATION");
}
