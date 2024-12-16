import './styles/header.css';
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
import { createQuiz } from './quiz/createQuiz';
import { createGame } from './createRaceGame';



let episodes_meshes = {};
let episodes_text = {}
let ships = []

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 0, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(0.8)
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.AmbientLight(0xffffff);
scene.add(light);

const mainGroup = new THREE.Group()
const episodeGroup = new THREE.Group()
const quizGroup = new THREE.Group()
const postersGroup = new THREE.Group()

let currentGroup = mainGroup;
currentGroup.visible = true;
episodeGroup.visible = false
quizGroup.visible = false
postersGroup.visible = false
episodeGroup.position.set(0, 0, -20)
scene.add(mainGroup)
scene.add(episodeGroup)
scene.add(quizGroup)
scene.add(postersGroup)
createBackground(renderer, scene, camera)
const titles = createTitles(mainGroup)
let uniforms = {
  time: { value: 0.0 },
  color_1: { value: 0.3 },
  color_2: { value: 0.7 }
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

  link.addEventListener('click', () => {

    const episode = episodes_meshes[link.id]
    hideHeader()
    episode.images.forEach(i => {
      episodeGroup.add(i)
    })
    episodeGroup.add(plane);
    switchGroup(episodeGroup);
    document.getElementById('close_overlay').style.display = 'block'
    document
      .getElementById("episode-text").style.display = 'block'
    document
      .getElementById("episode-content").innerHTML += episodes_text[link.id].story
    document
      .getElementById("episode-title").textContent = episodes_text[link.id].title
    document.getElementById('header').style.display = 'none'
    document.getElementById("footer-image").style.display = 'none'
    document.getElementById("main-nav-links").classList.remove('animation-3');
    document.getElementById("header-image").classList.remove('animation-3');
    document.getElementById("logo-image").classList.remove('animation-3');
    document.getElementById("footer-image").classList.remove('animation-3');
    document.getElementById('header').style.pointerEvents = 'none'

  })
});


document.getElementById("quiz").addEventListener('click', () => {

  hideHeader()
  createQuiz(quizGroup)
  switchGroup(quizGroup);
  document.getElementById('close_overlay').style.display = 'block'
  document
    .getElementById("quiz-text").style.display = 'flex'
  document.getElementById("quiz-text").classList.add('animation-2')
  document.getElementById('header').style.display = 'none'
  document.getElementById("footer-image").style.display = 'none'
  document.getElementById("main-nav-links").classList.remove('animation-3');
  document.getElementById("header-image").classList.remove('animation-3');
  document.getElementById("logo-image").classList.remove('animation-3');
  document.getElementById("footer-image").classList.remove('animation-3');
  document.getElementById('header').style.pointerEvents = 'none'
})

document.getElementById("game").addEventListener('click', () => {

  hideHeader()
  createGame()
  document
    .getElementById("game-container").style.display = 'block'
  document
    .getElementById("close").style.display = 'block'
  document
    .getElementById("gameCanvas").style.display = 'flex'

  document.getElementById('header').style.display = 'none'
  document.getElementById("main-nav-links").classList.remove('animation-3');
  document.getElementById("header-image").classList.remove('animation-3');
  document.getElementById("logo-image").classList.remove('animation-3');
  document.getElementById("footer-image").classList.remove('animation-3');
  document.getElementById('header').style.pointerEvents = 'none'
})


document.getElementById('posters').addEventListener('click', () => {
  hideHeader()
  postersGroup.add(plane);
  switchGroup(postersGroup);
  document.getElementById('close_overlay').style.display = 'block'
  document.getElementById('poster-grid').style.display = 'grid'
  document.getElementById('header').style.display = 'none'
  document.getElementById("footer-image").style.display = 'none'
  document.getElementById("main-nav-links").classList.remove('animation-3');
  document.getElementById("header-image").classList.remove('animation-3');
  document.getElementById("logo-image").classList.remove('animation-3');
  document.getElementById("footer-image").classList.remove('animation-3');
  document.getElementById('header').style.pointerEvents = 'none'

})



document.getElementById('close_overlay').addEventListener('click', (e) => {
  episodeGroup.clear()
  episodeGroup.visible = false
  quizGroup.visible = false
  quizGroup.clear()
  mainGroup.visible = true
  postersGroup.visible = false
  currentGroup = mainGroup
  document.getElementById('header').style.display = 'flex'
  document.getElementById("footer-image").style.display = 'block'

  document.getElementById("header-image").style.transform = 'none'
  document.getElementById("header-image").classList.add('animation-ship-2');
  document.getElementById("logo-image").classList.add('animation-2');
  document.getElementById("footer-image").classList.add('animation-2');
  document.getElementById("main-nav-links").classList.add('animation-2')
  document.getElementById('close_overlay').style.display = 'none'
  document
    .getElementById("episode-text").style.display = 'none'
  document
    .getElementById("quiz-text").style.display = 'none'
  document
    .getElementById("episode-content").innerHTML = ""

  document.getElementById('header').style.pointerEvents = 'auto'
  document
    .getElementById("poster-grid").style.display = 'none'

})

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  3,
  0.4,
  0.85
);
composer.addPass(bloomPass);


const spaceship = new Spaceship(scene, {
  modelPath: '/models/model.glb',
  position: [0, -3, -20],
  colorLaser: '#00CC99',
  isVisible: false
});
const spaceship_2 = new Spaceship(scene, {
  modelPath: '/models/model.glb',
  position: [5, -3, -20],
  colorLaser: '#00CC99',
  isVisible: false
});
const spaceship_3 = new Spaceship(scene, {
  modelPath: '/models/model.glb',
  position: [-5, -3, -20],
  colorLaser: '#00CC99',
  isVisible: false
});

ships.push(spaceship, spaceship_2, spaceship_3)



function switchGroup(newGroup) {
  if (currentGroup === newGroup) return;
  newGroup.visible = true
  animateIn(newGroup);
  currentGroup = newGroup;
}

function animateIn(group) {
  group.position.set(0, 0, 5);
  group.scale.setScalar(0);
  const duration = 500;
  const startTime = performance.now();

  function animate(time) {
    const elapsedTime = time - startTime;
    const progress = Math.min(elapsedTime / duration, 1);

    group.position.z = 5 - 5 * progress;
    group.scale.setScalar(progress);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}

function hideHeader() {
  document.getElementById("main-nav-links").classList.remove('animation-links-1')
  document.getElementById("header-image").classList.remove('animation-start-ship-1');
  document.getElementById("logo-image").classList.remove('animation-links-1');
  document.getElementById("footer-image").classList.remove('animation-links-1');

  document.getElementById("main-nav-links").classList.add('animation-3');
  document.getElementById("header-image").classList.add('animation-3');
  document.getElementById("logo-image").classList.add('animation-3');
  document.getElementById("footer-image").classList.add('animation-3');

}

function animate() {
  titles.forEach(el => {
    el.animate()
  })

  requestAnimationFrame(animate);

  uniforms.time.value += 0.05;
  renderer.render(scene, camera);

  setInterval(() => {
    ships.forEach(spaceship => {
      spaceship.setVisible(true)
      spaceship.animate();

    })
  }, 30000)

}
animate();


