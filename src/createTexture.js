import * as THREE from 'three';
import vertexShader from './shaders/vertex';
import hologramFragmentShaderWithTexture from './shaders/HologramFragmentWithTexture'


const loader = new THREE.TextureLoader();

function loadTexture(url) {
    return new Promise((resolve, reject) => {
        loader.load(
            url,
            (texture) => resolve(texture),  // Успешная загрузка
            undefined,                // Прогресс (необязательно)
            (error) => reject(error)  // Ошибка загрузки
        );
    });
}
export async function createTextureImage(url, position, isAlbom = false, size, time) {
    let plane;
    let uniforms = {
        time
    };
    try {

        const texture = await loadTexture(url);
        const imageWidth = texture.image.width;
        const imageHeight = texture.image.height;
        const aspectRatio = imageWidth / imageHeight;

        let planeWidth; // Вы можете задать любую высоту
        let planeHeight;
        if (isAlbom) {
            planeWidth = size; // Вы можете задать любую высоту
            planeHeight = planeWidth * aspectRatio;
        } else {
            planeHeight = size; // Вы можете задать любую высоту
            planeWidth = planeHeight * aspectRatio;
        }
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
        plane = new THREE.Mesh(planeGeometry, material);
        plane.position.set(position.x, position.y, position.z)

    } catch (error) {
        console.error('Error: ', error);
    }
    return plane
}
