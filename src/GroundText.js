import * as THREE from "three";

export function makeGroundText(text, width = 5, height = 1.5) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "rgba(255,255,255,0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#111";
  ctx.font = "bold 64px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const tex = new THREE.CanvasTexture(canvas);
  const mat = new THREE.MeshBasicMaterial({
    map: tex,
    transparent: true,
    opacity: 0,
  });
  const geo = new THREE.PlaneGeometry(width, height);

  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0.05;
  return mesh;
}
