import * as Three from "three";
import { GUI } from "lil-gui";

export function CameraManager(scene, canvas) {
  const camera = new Three.PerspectiveCamera(
    100,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000
  );

  const cameraHelper = new Three.CameraHelper(camera);
  scene.add(cameraHelper);
  cameraHelper.visible = false;

  // Initial camera position and rotation
  camera.position.set(25, 10, -2); // this is the position in the debugger
  camera.rotation.set(0, 0, 0);

  // GUI for debugging camera controls (optional)
  function setupGUI(gui) {
    const cameraFolder = gui.addFolder("Camera Controls");
    cameraFolder.add(camera.position, "x", -100, 100).name("Position X");
    cameraFolder.add(camera.position, "y", -100, 100).name("Position Y");
    cameraFolder.add(camera.position, "z", -100, 100).name("Position Z");

    const debugSettingss = { showHelper: false };
    cameraFolder
      .add(debugSettingss, "showHelper")
      .name("Show Helper")
      .onChange((enabled) => {
        cameraHelper.visible = enabled;
      });
    cameraFolder.open();
  }

  // Update camera's position
  function setPosition(x, y, z) {
    camera.position.set(x, y, z);
  }

  // Make the camera look at a specific target
  function lookAt(target) {
    camera.lookAt(target);
  }

  // Handle window resize
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }

  // Attach resize listener
  window.addEventListener("resize", onWindowResize);

  return {
    camera,
    setupGUI,
    setPosition,
    lookAt,
    onWindowResize,
    getCamera: () => camera,
  };
}
