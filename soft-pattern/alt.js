import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';
import { exampleTexture, exampleDisplacement, exampleBump, exampleShine } from './exampleTexture.js';

const noise3D = createNoise3D();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 2000);
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// renderer.domElement.style.border = '1px solid red'; // preview

camera.position.set(0, 200, 0);
camera.lookAt(0, 0, 0);

const clothWidth = 400;
const clothHeight = 400;
const clothSegmentsW = 200;
const clothSegmentsH = 200;
const clothGeometry = new THREE.PlaneGeometry(clothWidth, clothHeight, clothSegmentsW, clothSegmentsH);

clothGeometry.rotateX(-Math.PI / 2);


const pattern = exampleTexture(clothWidth * 3, clothHeight * 3, '#000');
const shine = exampleShine(clothWidth * 3, clothHeight * 3, 40, 245);
const rough = exampleShine(clothWidth * 3, clothHeight * 3, 245, 40);
const bmp = exampleBump(clothWidth * 3, clothHeight * 3);

const texture = new THREE.CanvasTexture(pattern);
const shineMap = new THREE.CanvasTexture(shine);
const roughMap = new THREE.CanvasTexture(rough);
const bumpMap = new THREE.CanvasTexture(bmp);

const clothMaterial = new THREE.MeshStandardMaterial({
  map: texture,
  bumpMap: bumpMap,
  bumpScale: 1, 
  metalnessMap: shineMap,
  roughnessMap: roughMap,
  metalness: 1,       // Controls how metallic the surface appears
  roughness: 1,       // Controls the roughness of the surface
  side: THREE.DoubleSide // Ensure both sides of the cloth are visible
});
const clothMesh = new THREE.Mesh(clothGeometry, clothMaterial);
clothMesh.receiveShadow = true; // Receive shadows
clothMesh.castShadow = true;
scene.add(clothMesh);

// const pointLight = new THREE.PointLight(0xffffff, 5);
// pointLight.position.set(0, 30, 0);
// pointLight.castShadow = true;
// scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 50, -30);
scene.add(directionalLight);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2);
directionalLight2.position.set(10, 50, -30);
directionalLight2.rotateY(Math.PI / 2)
scene.add(directionalLight2);

// substitute canon here
const particles = [];
for (let i = 0; i <= clothSegmentsH; i++) {
    for (let j = 0; j <= clothSegmentsW; j++) {
        const particle = new THREE.Vector3(
            (j / clothSegmentsW - 0.5) * clothWidth,
            0,
            (i / clothSegmentsH - 0.5) * clothHeight
        );
        particles.push(particle);
    }
}

function animate(currentTime) {
  requestAnimationFrame(animate);

  let positionAttribute = clothGeometry.getAttribute('position');

  let  t = currentTime / 18;

  // Update cloth vertices based on physics simulation
  for (let i = 0; i < positionAttribute.count; i++) {
    let { x, y, z } = particles[i];
    // positionAttribute.setXYZ(i, x, y + (Math.cos((z + t) / 12) * 2) + (Math.cos((x + (t / 2)) / 16) * 1), z  );
    let ny = noise3D(x / 80, z / 80, t / 80) * 4;
    let sy = Math.cos((z + t) / 20) * 4;
    positionAttribute.setXYZ(i, x, y + ny + sy, z);
  }

  clothGeometry.computeBoundingBox();
  clothGeometry.computeBoundingSphere();
  clothGeometry.computeVertexNormals();
  positionAttribute.needsUpdate = true;

  const radius = 130;
  const angle = currentTime * 0.0004; // Adjust the multiplier to control speed
  // Update camera position to orbit around the Y-axis
  camera.position.x = radius * Math.cos(angle);
  camera.position.z = radius * Math.sin(angle);
  camera.position.y = radius;
  // Ensure the camera is always looking at the center (where the cloth is)
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
}
requestAnimationFrame(animate);
