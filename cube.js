import * as THREE from 'three';
import * as Config from './config.js';


export function calculateCubePosition(i, j, k) {
    const x = (j + Config.cubeOffset.x) * Config.spacing.neuron;
    const y = (i + Config.cubeOffset.y) * Config.spacing.layer;
    const z = (k + Config.cubeOffset.z) * Config.spacing.token;

    return new THREE.Vector3(x, y, z);
};