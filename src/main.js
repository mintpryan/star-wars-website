import * as THREE from 'three';
import { createEpisodeTitle, createTitles, createEpisodeDescription } from './createTitels';
import { createBackground } from './createBackground';
import vertexShader from './shaders/vertex';
import fragmentShader from './shaders/HologramFragment'
import { episodes } from './stories/episodes';
import { createTextureImage } from './createTexture';



let episodes_meshes = {};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 0, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
// renderer.setPixelRatio(0.8)
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);



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

function animate() {
  titles.forEach(el => {
    el.animate()
  })
  requestAnimationFrame(animate);
  uniforms.time.value += 0.05;
  renderer.render(scene, camera);

}
animate();

episodes.forEach((episode) => {
  const name = episode.name
  episodes_meshes[name] = { images: [] }

  episode.images.forEach((image) => {
    createTextureImage(image.url, image.position, image.isAlbom,image.height, uniforms.time)
      .then((plane) => {
        episodes_meshes[name].images.push(plane)
      })
      .catch((error) => {
        console.error('Error plane:', error);
      });
  })
  createEpisodeTitle(episode.title, '/fonts/star_wars.json', { x: -1, y: 3, z: 0 }, 0xffffff, 0.3)
    .then((textMesh) => {
      episodes_meshes[name].title = textMesh
    })
    .catch((error) => {
      console.error('Error textMesh:', error);
    });


  createEpisodeDescription(episode.shortStory, '/fonts/test.json', { x: -2, y: 2, z: 0 }, 0xffffff, 0.15).then((textMesh) => {
    episodes_meshes[name].desc = textMesh
  })
    .catch((error) => {
      console.error('Error textMesh:', error);
    });
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

    document.getElementById('header').style.display = 'none'
    document.getElementById("header-image").classList.remove('animation-ship-1');
    document.getElementById("main-nav-links").classList.remove('animation-links-1')

    document.getElementById('close_overlay').style.display = 'block'



    episode.images.forEach(i => {
      episodeGroup.add(i)
    })
    episodeGroup.add(episode.title)
    episode.desc.forEach(d => {
      episodeGroup.add(d)
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

})