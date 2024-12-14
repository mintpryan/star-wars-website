import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
const loader = new FontLoader();

function loadFont(url) {
    return new Promise((resolve, reject) => {
        loader.load(
            url,
            (font) => resolve(font),      
            (error) => reject(error)
        );
    });
}

export function createTitles(scene) {
    let titles = [];
    loader.load('/fonts/star_wars.json', function (font) {
        const lines = ['STAR', 'WARS'];
        const lineHeight = 1;


        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 1 });



        lines.forEach((line, index) => {
            const textGeometry = new TextGeometry(line, {
                font: font,
                size: 1,
                depth: 0.2,
                curveSegments: 12,
                bevelEnabled: false,
            });

            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
            textMesh.position.set(-2, -index * lineHeight, 0);
            titles.push(textMesh)
            textMesh.animate = () => {
                textMesh.position.z -= 0.05;
                if (textMesh.position.z < -30)
                    textMesh.material.opacity = textMesh.material.opacity - 0.02

            }
            scene.add(textMesh);

        });

    });
    setTimeout(() => {
        loader.load('/fonts/test.json', function (font) {
            const lines = [
                "Greetings, Jedi. I've been waiting for you.", "Prepare your lightsaber, set your hyperdrive,", "and get ready for an adventure where", "the Force will guide you!", "", "May the Force be with you!"];
            const lineHeight = 1;

            const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0 });

            lines.forEach((line, index) => {
                const textGeometry = new TextGeometry(line, {
                    font: font,
                    size: 0.5,
                    depth: 0,
                    curveSegments: 12,
                    bevelEnabled: false,
                });

                const textMesh = new THREE.Mesh(textGeometry, textMaterial);
                textMesh.rotation.x = -Math.PI / 4;
                textMesh.position.set(-6, -index * lineHeight - 2, -2);
                textMesh.animate = () => {
                    if (textMesh.position.z > -4) {
                        textMesh.material.opacity = textMesh.material.opacity + 0.01

                    }
                    if (textMesh.position.z > -20) {
                        textMesh.position.z -= 0.02;
                    }
                    setTimeout(() => {
                        textMesh.material.opacity = textMesh.material.opacity - 0.02
                    }, 11000)


                }
                titles.push(textMesh)
                scene.add(textMesh);

            });

        });
    }, 3000)
    return titles
}


export async function createEpisodeTitle(text, font_path, position, color, size) {
    let textMesh;

    try {
        const font = await loadFont(font_path);
        const textMaterial = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 1 });

        const textGeometry = new TextGeometry(text, {
            font: font,
            size,
            depth: 0.0,
            curveSegments: 12,
            bevelEnabled: false,
        });
        textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(position.x, position.y, position.z);

    } catch (error) {
        console.error('Error: ', error);
    }
    return textMesh
}

export async function createEpisodeDescription(lines, font_path, position, color, size) {
    let textMeshes = [];

    try {
        const font = await loadFont(font_path);
        const lineHeight = 0.2;

        const textMaterial = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 1 });



        lines.forEach((line, index) => {
            const textGeometry = new TextGeometry(line, {
                font: font,
                size,
                depth: 0,
                curveSegments: 18,
                bevelEnabled: false,
            });

            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
            textMesh.position.set(position.x, position.y - index * lineHeight, position.z);

            textMeshes.push(textMesh)
        });

    } catch (error) {
        console.error('Error: ', error);
    }

    return textMeshes
} 