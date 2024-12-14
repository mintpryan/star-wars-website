import * as THREE from 'three';
import vertexShader from '../shaders/vertex';
import fragmentShader from '../shaders/HologramFragment'
import { createRoundedRectShape } from '../helper';
import { createTextureImage } from '../createTexture';
let uniforms = {
    time: { value: 0.0 },
    color_1: { value: 0.4 },
    color_2: { value: 0.5 }
};

export function createQuiz(scene) {
    const planeGeometryOverlayGeometry = new THREE.PlaneGeometry(100, 100);
    const planeGeometryOverlayGeometry_1 = createRoundedPlane(9, 10, 0.2)
    const planeGeometryOverlayGeometry_2 = createRoundedPlane(9, 3, 0.2)
    const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader: fragmentShader,
        transparent: true,
        side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(planeGeometryOverlayGeometry, material);
    const plane_1 = new THREE.Mesh(planeGeometryOverlayGeometry_1, material);
    const plane_2 = new THREE.Mesh(planeGeometryOverlayGeometry_2, material);
    plane_1.position.set(2, -4, 1)
    plane_2.position.set(2, 3.5, 1)
    plane_2.rotation.z = Math.PI
    scene.add(plane)
    scene.add(plane_1)

    scene.add(plane_2)


    createTextureImage("/quiz/start_yoda.png", {x:-5,y:2.5,z:0}, false, 3, uniforms.time)
        .then((plane) => {
            scene.add(plane)
        })
        .catch((error) => {
            console.error('Error plane:', error);
        });
}


function createRoundedPlane(width, height, radius) {
    const shape = new THREE.Shape();

    const w = width / 2;
    const h = height / 2;

    // Начало пути
    shape.moveTo(-w + radius, -h);

    // Линии с закруглёнными углами
    shape.lineTo(w - radius, -h);
    shape.quadraticCurveTo(w, -h, w, -h + radius);

    shape.lineTo(w, h - radius);
    shape.quadraticCurveTo(w, h, w - radius, h);

    shape.lineTo(-w + radius, h);
    shape.quadraticCurveTo(-w, h, -w, h - radius);

    shape.lineTo(-w, -h + radius);
    shape.quadraticCurveTo(-w, -h, -w + radius, -h);

    // Создаём геометрию из формы
    const geometry = new THREE.ShapeGeometry(shape);

    return geometry;
}

