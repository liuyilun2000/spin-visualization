import * as THREE from 'three';

import * as Config from './config.js';
import * as Data from './data.js';
import {scene} from './env.js';


export function activationColor(activation) {
	//let c1 = new THREE.Color('rgba(200,20,40,0.2)')
	//let c2 = new THREE.Color('rgba(20,200,40,1)') 
	//let color = new THREE.Color().lerpColors(c1, c2, activation);
	let color = new THREE.Color().setHSL(activation * 0.4, 0.4, 0.4);
	return color;
}

export function activationOpacity(activation) {
	let opacity = 0.02 + activation ** 6
	return opacity
}


export function calculateCubePosition(i, j, k) {
    const x = (j + Config.cubeOffset.x) * Config.spacing.neuron;
    const y = (i + Config.cubeOffset.y) * Config.spacing.layer;
    const z = (k + Config.cubeOffset.z) * Config.spacing.token;

    return new THREE.Vector3(x, y, z);
};



const cubes = [];

const maxCubes = [];
const nonMaxCubes = [];


// for drifting animation at the beginning
const cubePositions = [];
const cubeVelocities = [];

// Create blocks with random positions
for (let i = 0; i < Config.dimensions.layer; i++) {
	cubes[i] = [];
	cubePositions[i] = [];
	cubeVelocities[i] = [];
	for (let j = 0; j < Config.dimensions.neuron; j++) {
		cubes[i][j] = [];
		cubePositions[i][j] = [];
		cubeVelocities[i][j] = [];
		for (let k = 0; k < Config.dimensions.token; k++) {
			const geometry = new THREE.BoxGeometry(Config.cubeSize, Config.cubeSize, Config.cubeSize); // Cube geometry
			const activation = Data.activation[i][j][k];
			const material = new THREE.MeshBasicMaterial({
				color: activationColor(activation),
				transparent: true,
				opacity: activationOpacity(activation)
			});
			const cube = new THREE.Mesh(geometry, material);

			// Set initial random positions far from the center
			cubePositions[i][j][k] = new THREE.Vector3(
				(Math.random() + 5) * 50,
				(Math.random() - 5.5) * 50,
				(Math.random() - 6) * 50
			);

			// Set initial random velocities
			cubeVelocities[i][j][k] = new THREE.Vector3(
				(Math.random() - 0.5) * 0.02,
				(Math.random() - 0.5) * 0.02,
				(Math.random() - 0.5) * 0.02
			);

			cube.position.copy(cubePositions[i][j][k]);

			scene.add(cube);
			cubes[i][j][k] = cube;

            if (activation === Data.maxPoolingActivation[i][j]) {
                maxCubes.push({ 
					cube: cube, 
					activation: activation,
					i: i, j: j, k: k
				 });
            } else {
                nonMaxCubes.push({ 
					cube: cube, 
					activation: activation,
					i: i, j: j, k: k
				});
            }
		}
	}
}

export {
    cubes,
    maxCubes,
    nonMaxCubes
};


export function driftCubes() {
	for (let i = 0; i < Config.dimensions.layer; i++) {
		for (let j = 0; j < Config.dimensions.neuron; j++) {
			for (let k = 0; k < Config.dimensions.token; k++) {
				// Update positions based on velocities
				cubePositions[i][j][k].add(cubeVelocities[i][j][k]);
				cubes[i][j][k].position.copy(cubePositions[i][j][k]);
			}
		}
	}
};
