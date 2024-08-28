import * as THREE from 'three';
import exampleTexture from './exampleTexture.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000);
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// renderer.domElement.style.border = '1px solid red'; // preview

camera.position.set(0, 500, 500);
camera.lookAt(0, 0, 0);

const clothWidth = 400;
const clothHeight = 400;
const clothSegmentsW = 200;
const clothSegmentsH = 200;
const clothGeometry = new THREE.PlaneGeometry(clothWidth, clothHeight, clothSegmentsW, clothSegmentsH);

clothGeometry.rotateX(-Math.PI / 2);

const pattern = exampleTexture(clothWidth, clothHeight, '#000');
// document.body.appendChild(pattern); // preview it

const texture = new THREE.CanvasTexture(pattern);
const clothMaterial = new THREE.MeshStandardMaterial({
  map: texture,         // Apply the texture
  metalness: 0.0,       // Controls how metallic the surface appears
  roughness: 0.5,       // Controls the roughness of the surface
  side: THREE.DoubleSide // Ensure both sides of the cloth are visible
});
const clothMesh = new THREE.Mesh(clothGeometry, clothMaterial);
clothMesh.receiveShadow = true; // Receive shadows
clothMesh.castShadow = true;
scene.add(clothMesh);

const pointLight = new THREE.PointLight(0xffffff, 5);
pointLight.position.set(0, 30, 0);
pointLight.castShadow = true;
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
directionalLight.position.set(10, 50, -30);
scene.add(directionalLight);

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

  let  t = currentTime / 10;

  // Update cloth vertices based on physics simulation
  for (let i = 0; i < positionAttribute.count; i++) {
    let { x, y, z } = particles[i];
    positionAttribute.setXYZ(i, x, y + (Math.cos((z + t) / 8) * 3), z  );
  }

  // clothGeometry.geometry.computeBoundingSphere()
  clothGeometry.computeBoundingBox();
  clothGeometry.computeBoundingSphere();
  clothGeometry.computeVertexNormals();
  positionAttribute.needsUpdate = true;

  const radius = 500;
  const angle = currentTime * 0.0001; // Adjust the multiplier to control speed
  // Update camera position to orbit around the Y-axis
  camera.position.x = radius * Math.cos(angle);
  camera.position.z = radius * Math.sin(angle);
  // Ensure the camera is always looking at the center (where the cloth is)
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
}
requestAnimationFrame(animate);
