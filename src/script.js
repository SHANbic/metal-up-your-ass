import "./style.css";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as lil from "lil-gui";
import gsap from "gsap";

const isMobile = window.innerWidth < 576;
const gui = new lil.GUI({ width: 200 });
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("/textures/matcaps/3.png");

/**
 * Fonts
 */
const fontLoader = new FontLoader();

fontLoader.load("fonts/metold.json", (font) => {
  const textGeometry = new TextGeometry("MetallicA", {
    font,
    size: 1,
    height: 0.2,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
  });

  textGeometry.center();

  const parameters = {
    color: 0xff0000,
  };

  const textMaterial = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture,
    color: parameters.color,
  });

  gui.addColor(parameters, "color").onChange(() => {
    textMaterial.color.set(parameters.color);
  });

  const text = new THREE.Mesh(textGeometry, textMaterial);
  scene.add(text);

  const tetraGeometry = new THREE.TetrahedronGeometry(0.25, 0);
  const tetraMaterial = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture,
  });

  for (let i = 0; i < 1000; i++) {
    const tetra = new THREE.Mesh(tetraGeometry, tetraMaterial);

    tetra.position.x = (Math.random() - 0.5) * 10;
    tetra.position.y = (Math.random() - 0.5) * 10;
    tetra.position.z = (Math.random() - 0.5) * 10;

    tetra.rotation.x = Math.random() * Math.PI;
    tetra.rotation.y = Math.random() * Math.PI;

    const scale = Math.random() / 10;

    tetra.scale.set(scale, scale, scale);

    scene.add(tetra);
  }
});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 1;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
gsap.to(camera.position, {
  duration: 3,
  x: isMobile ? 7 : 5,
  y: -1,
  z: isMobile ? 10 : 5,
});
const tick = () => {
  // Update controls
  controls.update();

  // looping though 1000 meshes inside the tick, not sure about the performances... 🤷‍♂️
  scene.children.slice(2).forEach((child) => {
    gsap.to(child.rotation, {
      duration: 1,
      y: child.rotation.y + 0.4,
    });
  });

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
