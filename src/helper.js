import * as THREE from 'three';

import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
export function createRoundedRectShape(width, height, radius) {
    const shape = new THREE.Shape();

    shape.moveTo(-width / 2 + radius, -height / 2);
    shape.lineTo(width / 2 - radius, -height / 2);
    shape.quadraticCurveTo(width / 2, -height / 2, width / 2, -height / 2 + radius);
    shape.lineTo(width / 2, height / 2 - radius);
    shape.quadraticCurveTo(width / 2, height / 2, width / 2 - radius, height / 2);
    shape.lineTo(-width / 2 + radius, height / 2);
    shape.quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 2 - radius);
    shape.lineTo(-width / 2, -height / 2 + radius);
    shape.quadraticCurveTo(-width / 2, -height / 2, -width / 2 + radius, -height / 2);

    return shape;
}

export function createTextMesh(lines, font_path, parent, size, position, color) {

    const loader = new FontLoader();
    loader.load(font_path, function (font) {
        const lineHeight = 0.3;

        const textMaterial = new THREE.MeshBasicMaterial({
            color: color, transparent: true, opacity: 1
        });


        lines.forEach((line, index) => {
            const textGeometry = new TextGeometry(line, {
                font: font,
                size: size,
                depth: 0,
                curveSegments: 32,
                bevelEnabled: false,
            });

            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
            textMesh.position.set(position.x, -index * lineHeight + position.y, position.z);
            parent.add(textMesh);

        });

    });

}


export function getObjectSizeInRem(object, camera) {

    const box = new THREE.Box3().setFromObject(object);
    const size = new THREE.Vector3();
    box.getSize(size);

    const vertices = [
        new THREE.Vector3(box.min.x, box.min.y, box.min.z),
        new THREE.Vector3(box.max.x, box.max.y, box.max.z)
    ];

    const screenCoords = vertices.map(vertex => {
        const projected = vertex.clone().project(camera);
        return {
            x: (projected.x * 0.5 + 0.5) * window.innerWidth,
            y: (-projected.y * 0.5 + 0.5) * window.innerHeight
        };
    });

    const widthInPixels = Math.abs(screenCoords[1].x - screenCoords[0].x);
    const heightInPixels = Math.abs(screenCoords[1].y - screenCoords[0].y);

    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);

    const widthInRem = (widthInPixels / rootFontSize).toFixed(2);
    const heightInRem = (heightInPixels / rootFontSize).toFixed(2);

    return { widthInRem, heightInRem };
}



export function getSceneSizeAtDepth(camera, depth) {
    const fov = camera.fov; // Угол обзора в градусах
    const aspect = camera.aspect; // Соотношение сторон (width / height)

    const height = 2 * depth * Math.tan((fov * Math.PI) / 360);
    const width = height * aspect;

    return { width, height };
}