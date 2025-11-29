import * as THREE from "three";
import { EXRLoader } from "three/addons/loaders/EXRLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { modelManager } from "./ModelManager.js";
import { CameraManager } from "./CameraManager";

export function SceneManager(physicsWorld) {
  const scene = new THREE.Scene();

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Positioning the camera
  const cameraManager = new CameraManager(scene, renderer.domElement);

  // Add Ambient Light
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  // Load HDRI
  loadHDRI(scene);

  //loading the models
  const models = modelManager(scene, physicsWorld);

  // Create ground first
  const groundBody = models.createGround();

  //the

  // models.loadRocketloader();
  models.loadbuilding1();
  models.loadbuilding2();
  models.loadbuilding3();
  models.loadbuilding4();
  models.loadbuilding5();
  models.loadbuilding6();
  models.loadbuilding7();
  models.loadbuilding8();
  models.loadbuilding9();
  models.loadbuilding10();
  models.loadbuilding11();
  // models.rocketLaunchButton();
  models.uniModel1();
  models.uniModel2();
  models.cookiejar(); //these two togetehr creates teh collision fix that
  models.cookieModelAnim();
  models.hanger1();
  models.Mountain();
  models.Mountain1();
  models.Mountain2();
  models.Mountain3();
  models.Mountain4();
  models.floatingExperienceBallon();
  models.floatingEducationBallon();
  models.floatingBorderBallon();
  models.floatingSocialBallon();
  models.githubmodel();
  models.linkdinModel();

  models.crator1();
  models.crater2();
  models.meteorFragment();
  models.barrelSet1();
  models.barrel1();
  models.barrel2();
  models.machineBarrel1();
  models.bones1();
  models.teleporter1();
  models.satelite1();
  models.monorail1();
  models.train1();
  models.train2(); //these 4 together creates the collision fix that
  models.train3();
  models.train4();
  models.train5();
  models.train6();
  models.train7();
  models.shipLanded();
  // models.rocket_launch();
  // Load background model
  // loadModel(scene);

  // Make scene responsive
  window.addEventListener("resize", onWindowResize);

  function loadHDRI(scene) {
    const exrLoader = new EXRLoader();
    exrLoader.load(
      "/assets/HDRI/rosendal_plains_2_4k.exr",
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture;
        scene.background = new THREE.Color(0x444444);
      },
      undefined,
      (error) => console.error("Error loading HDRI:", error)
    );
  }

  function loadModel(scene) {
    const loader = new GLTFLoader();
    loader.load(
      "/assets/scene/scene.glb",
      (gltf) => {
        const model = gltf.scene;
        model.position.set(0, 0, 0);
        scene.add(model);
        console.log("Model loaded", model);
      },
      (xhr) =>
        console.log(
          `Model loading progress: ${(xhr.loaded / xhr.total) * 100}%`
        ),
      (error) => console.error("Error loading model:", error)
    );
  }

  function onWindowResize() {
    cameraManager.onWindowResize();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function render() {
    renderer.render(scene, cameraManager.getCamera());
  }

  return { scene, cameraManager, renderer, groundBody, render, models }; // add this inside later groundBody
}
