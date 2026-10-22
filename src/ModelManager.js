import CannonDebugger from "cannon-es-debugger";
import * as THREE from "three";
import * as CANNON from "cannon-es";

import { GLTFLoader } from "three/examples/jsm/Addons.js";

export const modelManager = (scene, physicsWorld) => {
  const loader = new GLTFLoader();
  const mixer = [];
  const animatedPhysicsObjects = [];

  const createGround = () => {
    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.visible = false; //this makes the ground invisisble
    scene.add(ground);

    const groundShape = new CANNON.Plane();
    const groundBody = new CANNON.Body({
      mass: 0,
      shape: groundShape,
      position: new CANNON.Vec3(0, 0, 0),
    });
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    physicsWorld.world.addBody(groundBody);

    return groundBody; // Return the ground body for collision detection
  };

  const loadmodelwithAnimationPhysics = (
    path,
    materialName = "building1Material",
  ) => {
    //loads model
    loader.load(path, (gltf) => {
      const model = gltf.scene;
      model.traverse((obj) => {
        if (obj.rotation) obj.rotation.order = "XYZ";
      });
      scene.add(model);

      //animations
      const animMixer = new THREE.AnimationMixer(model);
      gltf.animations.forEach((clip) => animMixer.clipAction(clip).play());
      mixer.push(animMixer); //pushes to global mixer array

      // ✅ UPDATE: Let the animation run for one frame to get proper initial position
      animMixer.update(0);

      //physics
      model.updateMatrixWorld(true);

      // console.log("Model root position:", model.position);
      const box = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);

      // console.log("Bounding box center:", center);
      // console.log("Bounding box size:", size);

      const halfExtents = new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2);
      const shape = new CANNON.Box(halfExtents);
      const bodyphysics = new CANNON.Body({
        mass: 0,
        type: CANNON.Body.KINEMATIC,
        position: new CANNON.Vec3(
          model.position.x,
          model.position.y,
          model.position.z,
        ), // ✅ Use model.position instead of center
        material: new CANNON.Material(materialName),
      });
      bodyphysics.addShape(shape);
      physicsWorld.world.addBody(bodyphysics);

      animatedPhysicsObjects.push({ model, body: bodyphysics });
    });
  };

  const loadModelWithoutPhysics = (path) => {
    loader.load(path, (gltf) => {
      const model = gltf.scene;
      model.traverse((obj) => {
        if (obj.rotation) obj.rotation.order = "XYZ";
      });
      // console.log(
      //   "🔍 MODEL ROTATION ORDER:",
      //   model.rotation.order,
      //   "from",
      //   path
      // );
      scene.add(model);
      // console.log("Model loaded (no physics):", path, model);
    });
  };
  const loadmodelwithPhysics = (path, materialName = "building1Material") => {
    loader.load(path, (gltf) => {
      const model = gltf.scene;
      model.traverse((obj) => {
        if (obj.rotation) obj.rotation.order = "XYZ";
      });
      scene.add(model);
      // console.log("Model loaded", path, model);

      const box = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);

      const halfExtents = new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2);
      const shape = new CANNON.Box(halfExtents);

      const bodyphysics = new CANNON.Body({
        mass: 0,
        position: new CANNON.Vec3(center.x, center.y, center.z),
        material: new CANNON.Material(materialName),
      });

      bodyphysics.addShape(shape);
      physicsWorld.world.addBody(bodyphysics);
    });
  };

  const loadmodelwithPhysicsAndText = (
    path,
    materialName = "building1Material",
    onLoad,
  ) => {
    loader.load(path, (gltf) => {
      const model = gltf.scene;
      model.traverse((obj) => {
        if (obj.rotation) obj.rotation.order = "XYZ";
      });
      scene.add(model);
      // console.log(
      //   "🔍 MODEL ROTATION ORDER:",
      //   model.rotation.order,
      //   "from",
      //   path
      // );

      // --- Physics setup ---
      const box = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);

      const halfExtents = new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2);
      const shape = new CANNON.Box(halfExtents);

      const bodyphysics = new CANNON.Body({
        mass: 0,
        position: new CANNON.Vec3(center.x, center.y, center.z),
        material: new CANNON.Material(materialName),
      });

      bodyphysics.addShape(shape);
      physicsWorld.world.addBody(bodyphysics);

      // 🔑 If callback provided, run it
      if (onLoad) onLoad(model, bodyphysics);
    });
  };

  const loadground = () => {
    loadModelWithoutPhysics("assets/scene/roads/ground.glb");
  };

  const loadRocketloader = () => {
    loadModelWithoutPhysics("assets/scene/assets/rocketloader.glb");
  };

  const loadbuilding1 = () =>
    loadmodelwithPhysics(
      "assets/scene/buildings/building1.glb",
      "building1Material",
    );
  const loadbuilding2 = () =>
    loadmodelwithPhysics(
      "assets/scene/buildings/building2.glb",
      "building2Material",
    );
  const loadbuilding3 = () => {
    loadmodelwithPhysics(
      "assets/scene/buildings/building3.glb",
      "building3Material",
    );
  };

  //new ones
  const loadbuilding4 = () => {
    loadmodelwithPhysics(
      "assets/scene/buildings/building4.glb",
      "building4Material",
    );
  };
  const loadbuilding5 = () => {
    loadmodelwithPhysics(
      "assets/scene/buildings/building5.glb",
      "building5Material",
    );
  };
  const loadbuilding6 = () => {
    loadmodelwithPhysics(
      "assets/scene/buildings/building6.glb",
      "building6Material",
    );
  };
  const loadbuilding7 = () => {
    loadmodelwithPhysics(
      "assets/scene/buildings/building7.glb",
      "building7Material",
    );
  };

  const loadbuilding8 = () => {
    loadmodelwithPhysics(
      "assets/scene/buildings/building8.glb",
      "building8Material",
    );
  };

  const loadbuilding9 = () => {
    loadmodelwithPhysics(
      "assets/scene/buildings/building9.glb",
      "building9Material",
    );
  };

  const loadbuilding10 = () => {
    loadmodelwithPhysics(
      "assets/scene/buildings/building10.glb",
      "building10Material",
    );
  };

  const loadbuilding11 = () => {
    loadmodelwithPhysics(
      "assets/scene/buildings/building11.glb",
      "building11Material",
    );
  };

  const hanger1 = () => {
    loadmodelwithPhysics(
      "assets/scene/hangers/hanger1.glb",
      "building1Material",
    );
  };

  const Mountain = () => {
    loadmodelwithPhysics(
      "assets/scene/Mountains/Mountain.glb",
      "building1Material",
    );
  };

  const Mountain1 = () => {
    loadmodelwithPhysics(
      "assets/scene/Mountains/mountain1.glb",
      "building1Material",
    );
  };

  const Mountain2 = () => {
    loadmodelwithPhysics(
      "assets/scene/Mountains/mountain2.glb",
      "building1Material",
    );
  };

  const Mountain3 = () => {
    loadmodelwithPhysics(
      "assets/scene/Mountains/mountain3.glb",
      "building1Material",
    );
  };

  const Mountain4 = () => {
    loadmodelwithPhysics(
      "assets/scene/Mountains/mountain4.glb",
      "building1Material",
    );
  };

  const road1 = () => {
    loadmodelwithPhysics("assets/scene/roads/road1.glb", "building1Material");
  };

  const crator1 = () => {
    loadmodelwithPhysics("assets/scene/assets/crater.glb", "building1Material");
  };

  const crater2 = () => {
    loadmodelwithPhysics(
      "assets/scene/assets/craterL.glb",
      "building1Material",
    );
  };

  const meteorFragment = () => {
    loadmodelwithPhysics(
      "assets/scene/assets/meteorFragment.glb",
      "building1Material",
    );
  };
  const barrelSet1 = () => {
    loadmodelwithPhysics(
      "assets/scene/assets/barrelSet1.glb",
      "building1Material",
    );
  };

  const barrel1 = () => {
    loadmodelwithPhysics(
      "assets/scene/assets/barrel1.glb",
      "building1Material",
    );
  };
  const barrel2 = () => {
    loadmodelwithPhysics(
      "assets/scene/assets/barrel2.glb",
      "building1Material",
    );
  };

  const machineBarrel1 = () => {
    loadmodelwithPhysics(
      "assets/scene/assets/machineBarrel1.glb",
      "building1Material",
    );
  };
  const bones1 = () => {
    loadmodelwithPhysics("assets/scene/assets/bones1.glb", "building1Material");
  };

  const teleporter1 = () => {
    loadmodelwithPhysics(
      "assets/scene/assets/transporter.glb",
      "building1Material",
    );
  };

  const satelite1 = () => {
    loadmodelwithPhysics(
      "assets/scene/assets/satelite1.glb",
      "building1Material",
    );
  };

  const monorail1 = () => {
    loadModelWithoutPhysics("assets/scene/roads/monorail.glb");
  };

  //floating ballons
  const floatingExperienceBallon = () => {
    loadModelWithoutPhysics("assets/scene/assets/floatingBExperience.glb");
  };

  const floatingEducationBallon = () => {
    loadModelWithoutPhysics("assets/scene/assets/floatingBEducation.glb");
  };

  const floatingSocialBallon = () => {
    loadModelWithoutPhysics("assets/scene/assets/floatingBSocials.glb");
  };
  const floatingBorderBallon = () => {
    loadModelWithoutPhysics("assets/scene/assets/floatingBBorder.glb");
  };

  //social models
  const githubmodel = () => {
    loadmodelwithPhysics("assets/scene/Socials/git.glb", "building1Material");
  };

  const linkdinModel = () => {
    loadmodelwithPhysics(
      "assets/scene/Socials/linkdin.glb",
      "building1Material",
    );
  };

  // uni models
  const uniModel1 = () => {
    loadmodelwithPhysics(
      "assets/scene/buildings/3duni.glb",
      "building1Material",
    );
  };

  const uniModel2 = () => {
    loadmodelwithPhysics(
      "assets/scene/buildings/aiUni.glb",
      "building1Material",
    );
  };

  //work models
  const cookiejar = () => {
    loadmodelwithPhysics("assets/scene/assets/jar.glb", "building1Material");
  };

  // const rocketLaunchButton = () => {
  //   loadmodelwithPhysics("assets/scene/assets/button.glb", "building1Material");
  // };

  //assets with animation needs fix in physics

  const train1 = () => {
    loadmodelwithAnimationPhysics(
      "assets/scene/trainAnim/monorail1.glb",
      "building1Material",
    );
  };
  const train2 = () => {
    loadmodelwithAnimationPhysics(
      "assets/scene/trainAnim/monorail2.glb",
      "building1Material",
    );
  };

  const train3 = () => {
    loadmodelwithAnimationPhysics(
      "assets/scene/trainAnim/monorail3.glb",
      "building1Material",
    );
  };
  const train4 = () => {
    loadmodelwithAnimationPhysics(
      "assets/scene/trainAnim/monorail4.glb",
      "building1Material",
    );
  };

  const train5 = () => {
    loadmodelwithAnimationPhysics(
      "assets/scene/trainAnim/monorail5.glb",
      "building1Material",
    );
  };
  const train6 = () => {
    loadmodelwithAnimationPhysics(
      "assets/scene/trainAnim/monorail6.glb",
      "building1Material",
    );
  };

  const train7 = () => {
    loadmodelwithAnimationPhysics(
      "assets/scene/trainAnim/monorail7.glb",
      "building1Material",
    );
  };

  const shipLanded = () => {
    loadmodelwithAnimationPhysics(
      "assets/scene/AnimatedAssets/spaceshipLanded.glb",
      "building1Material",
    );
  };

  const cookieModelAnim = () => {
    loadmodelwithAnimationPhysics(
      "assets/scene/AnimatedAssets/cookie.glb",
      "building1Material",
    );
  };

  const rocket_launch = () => {
    loadmodelwithAnimationPhysics(
      "assets/scene/AnimatedAssets/rocket_launch.glb",
      "building1Material",
    );
  };

  return {
    machineBarrel1,
    barrel1,
    barrel2,
    loadRocketloader,
    loadground,
    createGround,
    loadbuilding1,
    loadbuilding2,
    loadbuilding3,
    loadbuilding4,
    loadbuilding5,
    loadbuilding6,
    loadbuilding7,
    loadbuilding8,
    loadbuilding9,
    loadbuilding10,
    loadbuilding11,
    linkdinModel,
    githubmodel,
    uniModel1,
    uniModel2,
    cookiejar,
    cookieModelAnim,
    hanger1,
    Mountain,
    Mountain1,
    Mountain2,
    Mountain3,
    Mountain4,
    // rocketLaunchButton,
    road1,
    crator1,
    crater2,
    meteorFragment,
    barrelSet1,
    bones1,
    floatingExperienceBallon,
    floatingEducationBallon,
    floatingSocialBallon,
    floatingBorderBallon,
    teleporter1,
    satelite1,
    monorail1,
    train1,
    train2,
    train3,
    train4,
    train5,
    train6,
    train7,
    shipLanded,
    rocket_launch,
    loadmodelwithPhysicsAndText,
    mixers: mixer,
    animatedPhysicsObjects,
  };
};
