import * as THREE from 'three';
import { createEpisodeTitle, createTitles, createEpisodeDescription } from './createTitels';
import { createBackground } from './createBackground';
import hologramFragmentShaderWithTexture from './shaders/HologramFragmentWithTexture'
import vertexShader from './shaders/vertex';
import fragmentShader from './shaders/HologramFragment'
import { episodes } from './stories/episode1';



// Сцена
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 0, 10);

// Рендерер
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






function animate() {
  titles.forEach(el => {
    el.animate()
  })
  requestAnimationFrame(animate);
  uniforms.time.value += 0.05;
  renderer.render(scene, camera);

}
animate();


window.addEventListener('resize', () => {

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

});

document.querySelectorAll(".story").forEach((link) => {
  link.addEventListener('click', (e) => {
    const episode = episodes[link.id]
    mainGroup.visible = false
    episodeGroup.visible = true
    document.getElementById('header').style.display = 'none'
    document.getElementById('close_overlay').style.display = 'block'

    const loader = new THREE.TextureLoader();
    const texture = loader.load(episode.image_1, () => {
      console.log('Texture loaded');
      const imageWidth = texture.image.width;
      const imageHeight = texture.image.height;
      const aspectRatio = imageWidth / imageHeight;

      const planeHeight = 5; // Вы можете задать любую высоту
      const planeWidth = planeHeight * aspectRatio;

      uniforms.uTexture = { value: texture }
      const planeGeometry = new THREE.PlaneGeometry(planeHeight, planeWidth);
      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader: hologramFragmentShaderWithTexture,
        transparent: true,
        side: THREE.DoubleSide
      });
      material.map = texture;
      material.needsUpdate = true;
      const plane = new THREE.Mesh(planeGeometry, material);
      plane.position.set(-4, 1, 0)
      episodeGroup.add(plane);
    });

    const planeGeometryOverlayGeometry = new THREE.PlaneGeometry(100, 100);
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
    });

    const plane = new THREE.Mesh(planeGeometryOverlayGeometry, material);

    episodeGroup.add(plane);
    createEpisodeTitle(episode.title, '/fonts/star_wars.json', { x: -1, y: 3, z: 0 }, 0xffffff, 0.3, episodeGroup)

    createEpisodeDescription(episode.shortStory, '/fonts/test.json', { x: -2, y: 2, z: 0 }, 0xffffff, 0.15, episodeGroup)
  })
});