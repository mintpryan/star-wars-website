import * as THREE from 'three';
import vertexShader from '../shaders/vertex';
import fragmentShader from '../shaders/HologramFragment'
import { createTextureImage } from '../createTexture';
import { quiz } from './quiz'

let uniforms = {
    time: { value: 0.0 },
    color_1: { value: 0.4 },
    color_2: { value: 0.5 }
};
let index = 0
let score = 0
let current_q = quiz['quiz'][index]

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


    createTextureImage("/quiz/start_yoda.png", { x: -5, y: 2.5, z: 0 }, false, 3, uniforms.time)
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

    shape.moveTo(-w + radius, -h);

    shape.lineTo(w - radius, -h);
    shape.quadraticCurveTo(w, -h, w, -h + radius);

    shape.lineTo(w, h - radius);
    shape.quadraticCurveTo(w, h, w - radius, h);

    shape.lineTo(-w + radius, h);
    shape.quadraticCurveTo(-w, h, -w, h - radius);

    shape.lineTo(-w, -h + radius);
    shape.quadraticCurveTo(-w, -h, -w + radius, -h);

    const geometry = new THREE.ShapeGeometry(shape);

    return geometry;
}

document.getElementById('quiz-start').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('quiz-start').classList.add('animation-3')
    document.getElementById('quiz-game').style.display = 'flex'
    document.getElementById('question').textContent = current_q.question
    document.getElementById('answer_1').textContent = current_q.options[0]
    document.getElementById('answer_2').textContent = current_q.options[1]
    document.getElementById('answer_3').textContent = current_q.options[2]
    document.getElementById('answer_4').textContent = current_q.options[3]

})

document.getElementById('quiz-restart').addEventListener('click', (e) => {
    e.preventDefault();
    score = 0
    index = 0
    current_q = quiz['quiz'][index]
    document.getElementById('quiz-content-end').style.display = 'none'
    document.getElementById('quiz-game').style.display = 'flex'
    document.getElementById('question').textContent = current_q.question
    document.getElementById('answer_1').textContent = current_q.options[0]
    document.getElementById('answer_2').textContent = current_q.options[1]
    document.getElementById('answer_3').textContent = current_q.options[2]
    document.getElementById('answer_4').textContent = current_q.options[3]

})


async function chooseAnswer(e) {

    const player_answer = e.target.textContent
    document.querySelectorAll(".choose").forEach((b) => b.disabled = true)
    if (player_answer === current_q.answer) {
        score += 1
        await blinkButton(e.target, 'green')
    }
    else
        await blinkButton(e.target, 'red')



    index += 1

    if (index < quiz['quiz'].length) {
        current_q = quiz['quiz'][index]
        document.getElementById('question').textContent = current_q.question
        document.getElementById('answer_1').textContent = current_q.options[0]
        document.getElementById('answer_2').textContent = current_q.options[1]
        document.getElementById('answer_3').textContent = current_q.options[2]
        document.getElementById('answer_4').textContent = current_q.options[3]
    }
    else {
        document.getElementById('quiz-game').style.display = 'none'
        document.getElementById('quiz-content-end').style.display = 'flex'
        document.getElementById('score').textContent = `Your score: ${score}!`
    }
    document.querySelectorAll(".choose").forEach(b => b.disabled = false)

}
document.querySelectorAll(".choose").forEach((button) => {

    button.addEventListener('click', (e) => {
        e.preventDefault();
        chooseAnswer(e)

    })
})


function blinkButton(button, color, blinks = 5, interval = 300) {
    return new Promise((resolve) => {
        let count = 0;
        const originalBackground = button.style.backgroundColor;

        function blink() {
            if (count >= blinks) {
                button.style.backgroundColor = originalBackground;
                resolve();
                return;
            }

            button.style.backgroundColor = button.style.backgroundColor === color ? originalBackground : color;
            count++;
            setTimeout(blink, interval);
        }

        blink();
    });
}
