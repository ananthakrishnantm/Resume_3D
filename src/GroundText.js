import * as THREE from "three";

function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

export function makeGroundText(
  text,
  width = 150,
  height = 150,
  position = { x: 0, y: 0.05, z: 0 },
  rotation = { x: -90, y: 0, z: 0 },
) {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 2048;
  const ctx = canvas.getContext("2d");

  //transparent backrgound
  ctx.fillStyle = "rgba(255,255,255,0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  //draw text
  ctx.fillStyle = "white";
  ctx.font = "bold 40px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  //handle line breaks
  const lines = text.split("\n");
  const lineHeight = 35; //spacing between the lines
  const centerY = canvas.height / 2 - ((lines.length - 1) * lineHeight) / 2;

  lines.forEach((line, i) => {
    ctx.fillText(line, canvas.width / 2, centerY + i * lineHeight);
  });

  const tex = new THREE.CanvasTexture(canvas);
  const mat = new THREE.MeshBasicMaterial({
    map: tex,
    transparent: true,
    opacity: 1,
    side: THREE.DoubleSide,
    depthWrite: false,
    //these are extra im adding
    polygonOffset: true,
  });

  const geo = new THREE.PlaneGeometry(width, height);

  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.order = "XYZ";
  mesh.rotation.set(
    degToRad(rotation.x),
    degToRad(rotation.y),
    degToRad(rotation.z),
  );
  //new THREE.Euler(rotation.x, rotation.y, rotation.z);
  mesh.position.set(position.x, position.y + 0.05, position.z);

  // console.log("Normal array:", mesh.geometry.attributes.normal.array);

  return mesh;
}
