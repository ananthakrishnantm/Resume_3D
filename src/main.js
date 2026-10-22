import * as THREE from "three";
import * as CANNON from "cannon-es";
import { SceneManager } from "./SceneManager.js";
import { PhysicsWorld } from "./PhysicsWorld.js";
import { createCar } from "./Car.js"; // Updated import for functional approach
import { Controls } from "./Controls.js";
import { makeGroundText } from "./GroundText.js";
import { makeHologramWalls } from "./interactingObjects/HologramFrame.js";
import {
  loadRocket,
  updateRocketAnimation,
  playRocketLaunch,
} from "./interactingObjects/Rocket.js";

import {
  setPlayerPositionReference,
  setupInteractionInput,
} from "./interactionSystem.js";

import { createButton } from "./interactingObjects/Button.js";

// Debugging GUI (delete later if not needed)
import { GUI } from "lil-gui";
const gui = new GUI();

// Sample cube (possibly for debugging)
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshBasicMaterial({ color: 0xff0000 }),
);
//scale factor function

function scaleworld(factor) {
  sceneManager.scene.scale.set(factor, factor, factor);

  physicsWorld.world.bodies.forEach((body) => {
    body.position.scale(factor, body.position);

    body.shapes.forEach((shape, i) => {
      if (shape instanceof CANNON.Box) {
        const scaledHalfExtents = shape.halfExtents.scale(factor);
        body.shapes[i] = new CANNON.Box(scaledHalfExtents);
      } else if (shape instanceof CANNON.Sphere) {
        body.shapes[i] = new CANNON.Sphere(shape.radius * factor);
      }
    });
    body.updateMassProperties();
  });
}

//loadingscreen and initial screen stuff
const initialScreen = document.getElementById("initial-screen");
const loadingScreen = document.getElementById("loading-screen");
const startButton = document.getElementById("start-button");

startButton.addEventListener("click", () => {
  initialScreen.style.display = "none";
  loadingScreen.style.display = "block";

  setTimeout(() => {
    loadingScreen.style.display = "none";
    //here i have to statr the 3d scene render
    alert("scene started");
  }, 2000);
});

// Initialize managers
const physicsWorld = new PhysicsWorld();
const controls = new Controls();
const sceneManager = new SceneManager(physicsWorld);

// scaleworld(2);
sceneManager.cameraManager.setupGUI(gui);
const { mixers, animatedPhysicsObjects } = sceneManager.models;
const clock = new THREE.Clock();

// Create car instance using the functional approach
async function init() {
  const { carBody, update } = await createCar(
    sceneManager.scene,
    sceneManager.cameraManager,
    physicsWorld,
    gui,
    sceneManager.renderer.domElement, // canvas parameter
    // sceneManager.groundBody // pass groundBody for collision detection
  );

  //this here calls the text function

  //university Text 1
  const School1Text = makeGroundText(
    "Kaunas Technological University \nMasters in\nArtificial Intelligence \nin Computer Science \n2024-2026",
    100,
    100,
    { x: -92, y: 5, z: -15.5 }, //this is the location
    { x: -90, y: 0, z: 180 }, // flat + rotated around Y
  );
  sceneManager.scene.add(School1Text);

  //university Text 2
  const School2Text = makeGroundText(
    "Kerala Technological University \nBachelors in \nComputer Science \n2015-2019",
    100,
    100,
    { x: -40, y: 6, z: -14.5 }, //Location
    { x: -90, y: 0, z: 180 }, // Rotation
  );
  sceneManager.scene.add(School2Text);

  //for gui of text

  const f = gui.addFolder("School2Text");
  f.add(School2Text.rotation, "z", -Math.PI, Math.PI).name("rot z (rad)");
  f.add(School2Text.position, "x", -150, 50);
  f.add(School2Text.position, "z", -100, 100);

  const g = gui.addFolder("School1Text");
  g.add(School1Text.rotation, "z", -Math.PI, Math.PI).name("rot z (rad)");
  g.add(School1Text.position, "x", -150, 50);
  g.add(School1Text.position, "z", -100, 100);

  //Adding Hologram for Text for schoolText11
  const walls1 = makeHologramWalls(40, 16, 0.8);
  walls1.position.set(0, -1, 0.1);
  School1Text.add(walls1);

  //Adding Hologram for Text for schoolText2
  const walls2 = makeHologramWalls(42, 16, 0.8);
  walls2.position.set(0, -1, 0.1);
  School2Text.add(walls2);

  // Set how to get player position
  setPlayerPositionReference(() => {
    return new THREE.Vector3(
      carBody.position.x,
      carBody.position.y,
      carBody.position.z,
    );
  });

  // Setup input listeners
  setupInteractionInput();

  // Load objects
  await loadRocket(sceneManager.scene);
  await createButton(sceneManager.scene);

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    mixers.forEach((mixer) => {
      mixer.update(delta);
    });
    animatedPhysicsObjects.forEach(({ model, body }) => {
      const box = new THREE.Box3().setFromObject(model);
      const center = new THREE.Vector3();
      box.getCenter(center);

      body.position.copy(center);
      body.quaternion.copy(model.quaternion);
    });
    updateRocketAnimation(delta);

    physicsWorld.update(delta);
    update(controls.keys); // Call update from functional car instance
    sceneManager.render();

    //Hologram animation
    walls2.userData.uTime.value = clock.elapsedTime;
  }

  animate();
}
init();
