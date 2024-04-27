import * as THREE from 'three';

import * as Utils from './utils.js';
import {scene, composer, controls, updateBloomEffect, onWindowResize} from './env.js';
import * as Sprite from './sprite.js';
import * as Config from './config.js';
import * as Data from './data.js';

window.addEventListener('resize', onWindowResize, false);



const cubes = [];

const maxCubes = [];
const nonMaxCubes = [];

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
				color: Utils.activationColor(activation),
				transparent: true,
				opacity: Utils.activationOpacity(activation)
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



let isDrifting = true;

function driftCubes() {
	if (!isDrifting) return;
	for (let i = 0; i < Config.dimensions.layer; i++) {
		for (let j = 0; j < Config.dimensions.neuron; j++) {
			for (let k = 0; k < Config.dimensions.token; k++) {
				// Update positions based on velocities
				cubePositions[i][j][k].add(cubeVelocities[i][j][k]);
				cubes[i][j][k].position.copy(cubePositions[i][j][k]);
			}
		}
	}
}






// Animation function
function animate() {
	requestAnimationFrame(animate);
	// Drift cubes if drifting is true
	if (isDrifting) driftCubes();
	updateBloomEffect();
	controls.update();
	composer.render();
}



let cubeOffset = new THREE.Vector3(
	Config.dimensions.neuron * -0.5, 
	Config.dimensions.layer * -0.4, 
	Config.dimensions.token * -0.5
);

function calculateCubePosition(i, j, k) {
    const x = (j + cubeOffset.x) * Config.spacing.neuron;
    const y = (i + cubeOffset.y) * Config.spacing.layer;
    const z = (k + cubeOffset.z) * Config.spacing.token;

    return new THREE.Vector3(x, y, z);
}


function startRotating() {
    controls.autoRotate = true; 
    controls.autoRotateSpeed = 0; 
    const duration = 3000; 
    const maxRotateSpeed = 0.5; 
    const startTime = Date.now();

    function increaseRotationSpeed() {
        const elapsedTime = Date.now() - startTime;
        const fraction = Math.min(elapsedTime / duration, 1); 
        controls.autoRotateSpeed = maxRotateSpeed * Utils.easeInCubic(fraction); 

        if (fraction < 1) requestAnimationFrame(increaseRotationSpeed);
    }

    increaseRotationSpeed(); 
}


function startAnimation() {
	isDrifting = false; 
	startRotating();
	const startTime = Date.now();
	const duration = 2000; // Duration to move cubes to position

	cubes.forEach((layer, i) => {
		layer.forEach((neuron, j) => {
			neuron.forEach((cube, k) => {
				const endPosition = calculateCubePosition(i, j, k);
				const startPosition = cube.position.clone();
				
				// Animate the position
				const animatePosition = () => {
					const elapsedTime = Date.now() - startTime;
					let fraction = elapsedTime / duration;
					fraction = Utils.easeInOutCubic(fraction);

					if (fraction < 1) {
						const currentPosition = startPosition.clone().lerp(endPosition, fraction);
						cube.position.copy(currentPosition);
						requestAnimationFrame(animatePosition);
                        Sprite.updateSpriteOpacity(Sprite.tokenSprites, fraction);
                        Sprite.updateSpriteOpacity(Sprite.neuronSprites, fraction);
                        Sprite.updateSpriteOpacity(Sprite.layerSprites, fraction);
					} else {
						cube.position.copy(endPosition);
                        Sprite.updateSpriteOpacity(Sprite.tokenSprites, 1);
                        Sprite.updateSpriteOpacity(Sprite.neuronSprites, 1);
                        Sprite.updateSpriteOpacity(Sprite.layerSprites, 1);
					}
				};

				animatePosition();
			});
		});
	});
}


function startPoolingAnimation(animationType) {
	isDrifting = false; 
	const startTime = Date.now();
    const duration = 2000; // milliseconds for first transition (fade out)
    const moveDuration = 4000; // milliseconds for second transition (move to z=0)
    let stage = 1; // Track the animation stage
	let moveStartTime = 0;

	function update() {
		const elapsedTime = Date.now() - startTime;
		const fraction = Math.min(elapsedTime / duration, 1); // Clamp to 1

		if (stage === 1) {
			maxCubes.forEach(entry => {
				const cube = entry.cube;
				const initialActivation = entry.activation;
				const targetActivation = (initialActivation - Data.maxPoolingActivation_min) / (Data.maxPoolingActivation_max - Data.maxPoolingActivation_min);
				const currentActivation = initialActivation + (targetActivation - initialActivation) * fraction;
				cube.material.color = Utils.activationColor(currentActivation);
				cube.material.opacity = Utils.activationOpacity(currentActivation);
			});

			nonMaxCubes.forEach(entry => {
				const cube = entry.cube;
				const initialActivation = entry.activation;
				const targetActivation = 0;
				const currentActivation = initialActivation + (targetActivation - initialActivation) * fraction;
				cube.material.color = Utils.activationColor(currentActivation);
				cube.material.opacity = Utils.activationOpacity(currentActivation);
				if (fraction === 1) {
					scene.remove(cube); 
				}
			});

			if (fraction === 1) {
                if (nonMaxCubes.length > 0) nonMaxCubes.length = 0; 
				stage = 2; // Move to next stage
                moveStartTime = Date.now(); // Record start time for move animation
            }
        }

        if (stage === 2) {
            // Second stage: Move maxCubes to z=0
            const moveElapsedTime = Date.now() - moveStartTime;
            let moveFraction = Math.min(moveElapsedTime / moveDuration, 1);
            moveFraction = Utils.easeInOutCubic(moveFraction); // Apply ease-out effect

            maxCubes.forEach(entry => {
                const cube = entry.cube;
                const zTarget = 0;
                const zStart = cube.position.z;
                cube.position.z = zStart + (zTarget - zStart) * moveFraction;
            });
			
			//Sprite.updateSpriteOpacity(Sprite.tokenSprites, 1 - moveFraction);
			const moveSprites = (sprites, fadeOut = false) => {
				sprites.forEach(sprite => {
					const zTarget = 0;
					const zStart = sprite.position.z;
					sprite.position.z = zStart + (zTarget - zStart) * moveFraction;
					if (fadeOut) {
						const oTarget = 0;
						const oStart = sprite.material.opacity;
						sprite.material.opacity = oStart + (oTarget - oStart) * moveFraction; 
					}
				});
			};
		
			moveSprites(Sprite.neuronSprites);
			moveSprites(Sprite.layerSprites);
			moveSprites(Sprite.tokenSprites, true);

			if (moveFraction === 1) {
                stage = 3; // Animation complete, no further updates needed
            }
        }


		if (stage !== 3) {
			requestAnimationFrame(update);
		}
	}

	update();
}




// Event listener for the button
document.getElementById('startAnimation').addEventListener('click', startAnimation);

document.getElementById('startPooling').addEventListener('click', () => {
	startPoolingAnimation('max'); // Or 'avg' for average pooling
});


animate();
