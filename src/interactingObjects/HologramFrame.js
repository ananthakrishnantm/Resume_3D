import * as THREE from "three";

export function makeHologramWalls(
  width,
  depth,
  // wallHeight,
  thickness = 0.6,
  color = 0x00ffff,
) {
  const group = new THREE.Group();
  const uTime = { value: 0 }; // shared by all four walls

  function makeWall(length) {
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime,
        uLen: { value: length },
        // uHeight: { value: wallHeight },
        uColor: { value: new THREE.Color(color) },
      },
      vertexShader: `
        varying float vH;
        varying float vX;
        uniform float uLen;
        uniform float uHeight;
        void main() {
                vH = position.z / uHeight;      // 0 at the ground, 1 at the top
                vX = position.x / uLen + 0.5;   // 0..1 along the wall
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
      `,
      fragmentShader: `
        varying float vH;
        varying float vX;
        uniform float uTime;
        uniform float uLen;
        uniform float uHeight;
        uniform vec3 uColor;

        void main() {
          float h = clamp(vH, 0.0, 1.0);

          float fade   = pow(1.0 - h, 1.6) * 0.35;
          float base   = smoothstep(0.05, 0.0, h);
          float top    = smoothstep(0.02, 0.0, 1.0 - h) * 0.5;
          float cornerD = min(vX, 1.0 - vX) * uLen;
          float corner = smoothstep(0.35, 0.0, cornerD) * 0.7;

          float scan = step(0.5, fract(h * uHeight * 1.2 - uTime * 0.6)) * 0.12 * (1.0 - h);

          float flicker = 0.92 + 0.08 * sin(uTime * 25.0 + vX * 6.0);
          float alpha = clamp(fade + base + top + corner + scan, 0.0, 1.0) * flicker;

          gl_FragColor = vec4(uColor, alpha);
        }
      `,
    });

    // x = length, y = thickness, z = height
    const geo = new THREE.BoxGeometry(length, thickness);
    //wallHeight / 2
    const mesh = new THREE.Mesh(geo, mat);
    mesh.renderOrder = 1;
    return mesh;
  }

  const front = makeWall(width + thickness);
  front.position.y = -depth / 2;

  const back = makeWall(width + thickness);
  back.position.y = depth / 2;

  const left = makeWall(depth - thickness);
  left.rotation.z = Math.PI / 2;
  left.position.x = -width / 2;

  const right = makeWall(depth - thickness);
  right.rotation.z = Math.PI / 2;
  right.position.x = width / 2;

  group.add(front, back, left, right);
  group.userData.uTime = uTime;
  return group;
}
