import * as THREE from 'three';
import { createTitles } from './createTitels';
import { createBackground } from './createBackground';
import vertexShader from './shaders/vertex';
import fragmentShader from './shaders/HologramFragment'
import { episodes } from './stories/episodes';
import { createTextureImage } from './createTexture';
import { Spaceship } from './ships/createShip';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';


let episodes_meshes = {};
let episodes_text = {}
let ships = []

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 0, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
// renderer.setPixelRatio(0.8)
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.AmbientLight(0xffffff);
scene.add(light);

const mainGroup = new THREE.Group()
const episodeGroup = new THREE.Group()
episodeGroup.visible = false
scene.add(mainGroup)
scene.add(episodeGroup)
createBackground(renderer, scene, camera)
const titles = createTitles(mainGroup)
let uniforms = {
  time: { value: 0.0 }
};

const planeGeometryOverlayGeometry = new THREE.PlaneGeometry(100, 100);
const material = new THREE.ShaderMaterial({
  uniforms,
  vertexShader,
  fragmentShader: fragmentShader,
  transparent: true,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometryOverlayGeometry, material);



episodes.forEach((episode) => {
  const name = episode.name
  episodes_meshes[name] = { images: [] }

  episode.images.forEach((image) => {
    createTextureImage(image.url, image.position, image.isAlbom, image.height, uniforms.time)
      .then((plane) => {
        episodes_meshes[name].images.push(plane)
      })
      .catch((error) => {
        console.error('Error plane:', error);
      });
  })
  episodes_text[name] = { title: episode.title, story: episode.story }
})


window.addEventListener('resize', () => {

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

});

document.querySelectorAll(".story").forEach((link) => {
  link.addEventListener('click', (e) => {
    const episode = episodes_meshes[link.id]
    mainGroup.visible = false
    episodeGroup.visible = true
    // document.getElementById('header').hidden=true
    document
      .getElementById("episode-text").style.display = 'block'
    document
      .getElementById("episode-content").innerHTML += episodes_text[link.id].story
    document
      .getElementById("episode-title").textContent = episodes_text[link.id].title
    document.getElementById('header').style.display = 'none'
    document.getElementById("header-image").classList.remove('animation-ship-1');
    document.getElementById("main-nav-links").classList.remove('animation-links-1')

    document.getElementById('close_overlay').style.display = 'block'



    episode.images.forEach(i => {
      episodeGroup.add(i)
    })
    episodeGroup.add(plane);
  })
});

document.getElementById('close_overlay').addEventListener('click', (e) => {
  episodeGroup.clear()
  episodeGroup.visible = false
  mainGroup.visible = true
  document.getElementById('header').style.display = 'flex'
  document.getElementById("header-image").style.transform = 'none'
  document.getElementById("header-image").classList.add('animation-2');
  document.getElementById("main-nav-links").classList.add('animation-2')
  document.getElementById('close_overlay').style.display = 'none'
  document
    .getElementById("episode-text").style.display = 'none'
  document
    .getElementById("episode-content").innerHTML = ""

})

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

// Добавляем эффект свечения
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  3,
  0.4,
  0.85
);
composer.addPass(bloomPass);


const spaceship = new Spaceship(scene, {
  modelPath: '/models/model.glb',
  position: [0, 1, -20],
  colorLaser: '#00CC99',
  isVisible: false
});

const spaceship_2 = new Spaceship(scene, {
  modelPath: '/models/model.glb',
  position: [5, 1, -20],
  colorLaser: '#00CC99',
  isVisible: false
});
const spaceship_3 = new Spaceship(scene, {
  modelPath: '/models/model.glb',
  position: [-5, 1, -20],
  colorLaser: '#00CC99',
  isVisible: false
});

ships.push(spaceship, spaceship_2, spaceship_3)

function animate() {
  titles.forEach(el => {
    el.animate()
  })
  requestAnimationFrame(animate);
  uniforms.time.value += 0.05;
  renderer.render(scene, camera);
  setTimeout(() => {
    ships.forEach(spaceship => {
      spaceship.setVisible(true)
      spaceship.animate();
    })
  }, 60000)

}
animate();