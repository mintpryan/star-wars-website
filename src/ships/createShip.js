import { GLTFLoader } from "three/examples/jsm/Addons.js";
import * as THREE from 'three';

export class Spaceship {
    constructor(scene, options = {}) {
        this.scene = scene;
        this.lasers = [];
        this.colorLaser = options.colorLaser
        this.shootInterval = 0;
        this.isVisible = options.isVisible
        this.loadModel(options.modelPath, options.position);
    }
    loadModel(modelPath, position = [0, 0, 0]) {
        const loader = new GLTFLoader();
        loader.load(
            modelPath,
            (gltf) => {
                this.ship = gltf.scene;
                this.ship.visible = this.isVisible
                this.ship.position.set(...position);
                this.scene.add(this.ship);
                this.ship.rotation.z = Math.PI / 2.5 + Math.PI / 2
                this.ship.scale.set(0.5, 0.5, 0.5);
            },
            undefined,
            (error) => {
                console.error('Ошибка загрузки корабля:', error);
            }
        );
    }

    shootLaser() {

        const laserGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2);
        const laserMaterial = new THREE.MeshBasicMaterial({
            color: this.colorLaser,
            transparent: true,
            opacity: 1,
        });
        const laser = new THREE.Mesh(laserGeometry, laserMaterial);

        laser.position.copy(this.ship.position);
        laser.rotation.copy(this.ship.rotation);

        const direction = new THREE.Vector3(1, 1, 1);
        direction.applyQuaternion(this.ship.quaternion);

        laser.rotation.x = Math.PI / 2;
        laser.rotation.y = Math.PI / 2;
        laser.rotation.z = Math.PI;
        laser.userData = { direction };

        setTimeout(() => {
            this.scene.add(laser);
            this.lasers.push(laser);
        }, Math.random() * (2000 - 1000) + 1000)

    }

    updateLasers() {
        this.lasers.forEach((laser, index) => {
            laser.position.addScaledVector(laser.userData.direction, 0.5);

            if (laser.position.length() > 100) {
                this.scene.remove(laser);
                this.lasers.splice(index, 1);
            }
        });
    }


    setVisible(isVisible) {
        this.ship.visible = isVisible;
    }

    animate() {
        if (!this.ship)
            return;

        this.ship.position.x -= 0.01;
        this.ship.position.y -= 0.001;
        this.ship.position.z += 0.02;
        if (this.ship.position.z > 2)
            this.scene.remove(this.ship);
        this.shootInterval++;
        if (this.shootInterval % 30 === 0) {

            this.shootLaser();
        }

        this.updateLasers();
    }
}
