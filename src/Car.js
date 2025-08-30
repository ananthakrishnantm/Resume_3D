import * as THREE from "three";
import * as CANNON from "cannon-es";
import cannonDebugger from "cannon-es-debugger";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { ConvexHull, OrbitControls } from "three/examples/jsm/Addons.js";

export function createCar(scene, cameraManager, physicsWorld, gui, canvas) {
  return new Promise((resolve, reject) => {
    let car = null;
    let carMesh = null;
    let carBody = null;
    let speed = 0;
    const direction = new THREE.Vector3(0, 0, 1);
    const maxSpeed = 0.1;
    const acceleration = 0.002;
    const turnSpeed = 0.03;
    let wallBody = null;

    const orbitController = new OrbitControls(
      cameraManager.getCamera(),
      canvas
    );
    orbitController.enabled = false;

    const cameraSettings = { orbitMode: false };

    if (!physicsWorld.defaultMaterial) {
      physicsWorld.defaultMaterial = new CANNON.Material("defaultMaterial");
    }

    const debugRenderer = cannonDebugger(scene, physicsWorld.world);

    function update(keys) {
      if (!car || !carBody) return;

      if (keys.ArrowUp) {
        speed = Math.min(speed + acceleration, maxSpeed);
      } else if (keys.ArrowDown) {
        speed = Math.max(speed - acceleration, -maxSpeed / 2);
      } else {
        speed *= 0.98;
      }

      if (speed !== 0) {
        if (keys.ArrowLeft) car.rotation.y += turnSpeed * (speed / maxSpeed);
        if (keys.ArrowRight) car.rotation.y -= turnSpeed * (speed / maxSpeed);
      }

      direction.set(Math.sin(car.rotation.y), 0, Math.cos(car.rotation.y));
      direction.normalize();

      carBody.velocity.x = direction.x * speed * 100;
      carBody.velocity.z = direction.z * speed * 100;

      car.position.copy(carBody.position);
      car.quaternion.setFromEuler(0, car.rotation.y, 0);
      carMesh.position.copy(carBody.position);
      carMesh.quaternion.copy(car.quaternion);

      if (!cameraSettings.orbitMode && cameraManager) {
        const localOffset = new THREE.Vector3(0, 26, -8.5);
        const rotatedOffset = localOffset
          .clone()
          .applyQuaternion(car.quaternion);

        const carWorldPosition = new THREE.Vector3().copy(car.position);
        const cameraPosition = carWorldPosition.clone().add(rotatedOffset);

        const camera = cameraManager.getCamera();
        camera.position.lerp(cameraPosition, 0.1);
        camera.lookAt(car.position);
      } else {
        orbitController.update();
      }

      debugRenderer.update();
    }

    function saveFinalPosition() {
      if (!car) return;
      console.log("Final Position:", car.position.clone());
    }

    function checkIfCarIsConvex(model) {
      const vertices = [];
      model.traverse((child) => {
        if (child.isMesh) {
          const position = child.geometry.attributes.position.array;
          for (let i = 0; i < position.length; i += 3) {
            vertices.push(
              new THREE.Vector3(position[i], position[i + 1], position[i + 2])
            );
          }
        }
      });

      const convexHull = new ConvexHull().setFromPoints(vertices);
      return convexHull.vertices.length >= vertices.length;
    }

    function createCarCollisionBox() {
      const box = new THREE.Box3().setFromObject(car);
      const size = new THREE.Vector3();
      box.getSize(size);

      const halfExtents = new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2);
      const shape = new CANNON.Box(halfExtents);

      carBody = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(
          car.position.x,
          car.position.y,
          car.position.z
        ),
        material: new CANNON.Material("carMaterial"),
      });
      carBody.angularFactor.set(0, 1, 0);
      carBody.linearDamping = 0.4;
      carBody.angularDamping = 0.6;
      carBody.addShape(shape);

      physicsWorld.world.addBody(carBody);

      const carGeometry = new THREE.BoxGeometry(size.x, size.y, size.z);
      const wireMat = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true,
      });
      carMesh = new THREE.Mesh(carGeometry, wireMat);
      carMesh.position.copy(car.position);
      scene.add(carMesh);
    }

    function loadModel() {
      const loader = new GLTFLoader();
      loader.load(
        "/assets/toy-car/flying_plane.glb",
        (gltf) => {
          car = gltf.scene;
          car.position.set(12, 1.3, 0);
          scene.add(car);

          if (checkIfCarIsConvex(car)) {
            createCarCollisionBox();
          } else {
            console.warn("Car is concave, fallback collision not implemented.");
          }

          resolve({ update, saveFinalPosition, carBody, car });
        },
        undefined,
        (err) => reject(err)
      );
    }

    loadModel();
  });
}
