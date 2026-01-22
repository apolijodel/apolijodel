import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const canvas = document.getElementById("bg-canvas");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.z = 70;

const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);

function createCircleTexture() {
  const size = 64;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  const r = size / 2;
  ctx.beginPath();
  ctx.arc(r, r, r, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  return new THREE.CanvasTexture(c);
}

const POINT_COUNT = 140;
const MAX_DISTANCE = 28;

const positions = new Float32Array(POINT_COUNT * 3);

for (let i = 0; i < POINT_COUNT; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 160;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 160;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 160;
}

const pointsGeometry = new THREE.BufferGeometry();
pointsGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3),
);

const pointsMaterial = new THREE.PointsMaterial({
  color: 0x4fffe0,
  size: 2,
  map: createCircleTexture(),
  transparent: true,
  opacity: 0.6,
  alphaTest: 0.5,
  depthWrite: false,
});

const points = new THREE.Points(pointsGeometry, pointsMaterial);
scene.add(points);

const linePositions = [];

for (let i = 0; i < POINT_COUNT; i++) {
  for (let j = i + 1; j < POINT_COUNT; j++) {
    const dx = positions[i * 3] - positions[j * 3];
    const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
    const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (dist < MAX_DISTANCE) {
      linePositions.push(
        positions[i * 3],
        positions[i * 3 + 1],
        positions[i * 3 + 2],
        positions[j * 3],
        positions[j * 3 + 1],
        positions[j * 3 + 2],
      );
    }
  }
}

const linesGeometry = new THREE.BufferGeometry();
linesGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(linePositions, 3),
);

const linesMaterial = new THREE.LineBasicMaterial({
  color: 0x4fffe0,
  transparent: true,
  opacity: 0.25,
});

const lines = new THREE.LineSegments(linesGeometry, linesMaterial);
scene.add(lines);

let scrollProgress = 0;
let lastScroll = window.scrollY;
let scrollVelocity = 0;

window.addEventListener("scroll", () => {
  const st = window.scrollY;
  const dh = document.body.scrollHeight - window.innerHeight;
  scrollProgress = dh > 0 ? st / dh : 0;
  scrollVelocity = THREE.MathUtils.clamp(
    (st - lastScroll) * 0.002,
    -0.02,
    0.02,
  );
  lastScroll = st;
});

let t = 0;

function animate() {
  requestAnimationFrame(animate);
  t += 0.0015;

  const base = 0.00025;
  const dir = Math.sin(t) * 0.0004;
  const scrollDir = scrollVelocity * 0.6;

  points.rotation.y += base + dir;
  points.rotation.x += base * 0.6 - dir * 0.4;
  points.rotation.z += scrollDir * 0.3;

  lines.rotation.y += base + dir;
  lines.rotation.x += base * 0.6 - dir * 0.4;
  lines.rotation.z += scrollDir * 0.3;

  points.position.x = Math.sin(t * 0.7) * 4;
  points.position.y = Math.cos(t * 0.9) * 4;
  lines.position.x = points.position.x;
  lines.position.y = points.position.y;

  camera.position.z = 70 + scrollProgress * 20;

  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
