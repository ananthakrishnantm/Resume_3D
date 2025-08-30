import * as THREE from "three";
import * as CANNON from "cannon-es";
import { SceneManager } from "./SceneManager.js";
import { PhysicsWorld } from "./PhysicsWorld.js";
import { createCar } from "./Car.js"; // Updated import for functional approach
import { Controls } from "./Controls.js";

// Debugging GUI (delete later if not needed)
import { GUI } from "lil-gui";
const gui = new GUI();

// Sample cube (possibly for debugging)
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
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
  const car = await createCar(
    sceneManager.scene,
    sceneManager.cameraManager,
    physicsWorld,
    gui,
    sceneManager.renderer.domElement // canvas parameter
    // sceneManager.groundBody // pass groundBody for collision detection
  );

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    mixers.forEach((mixer) => {
      mixer.update(delta);
    });
    animatedPhysicsObjects.forEach(({ model, body }) => {
      body.position.copy(model.position);
      body.quaternion.copy(model.quaternion);
    });

    physicsWorld.update();
    car.update(controls.keys); // Call update from functional car instance
    sceneManager.render();
  }

  animate();
}
init();
