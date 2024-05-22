import * as THREE from 'three';
//import { MeshLine, MeshLineMaterial} from 'three.meshline';

import * as Utils from './utils.js';
import * as Data from './data.js';
import {scene, composer, controls, updateBloomEffect} from './env.js';
import * as Cube from './cube.js';
import * as Sprite from './sprite.js';
import * as Config from './config.js';

// Animation function
export function animate() {
	requestAnimationFrame(animate);
	// Drift cubes if drifting is true
	if (isDrifting) Cube.driftCubes();
	updateBloomEffect();
	controls.update();
	composer.render();
};





let isDrifting = true;

export function startRotating() {
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
};


export function startAnimation() {
	isDrifting = false; 
	startRotating();
	const startTime = Date.now();
	const duration = 2000; // Duration to move cubes to position

	Cube.cubes.forEach((layer, i) => {
		layer.forEach((neuron, j) => {
			neuron.forEach((cube, k) => {
				const endPosition = Cube.calculateCubePosition(i, j, k);
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
};


export function startPoolingAnimation() {
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
			Cube.maxCubes.forEach(entry => {
				const cube = entry.cube;
				const initialActivation = entry.activation;
				const targetActivation = (initialActivation - Data.maxPoolingActivation_min) / (Data.maxPoolingActivation_max - Data.maxPoolingActivation_min);
				const currentActivation = initialActivation + (targetActivation - initialActivation) * fraction;
				cube.material.color = Cube.activationColor(currentActivation);
				cube.material.opacity = Cube.activationOpacity(currentActivation);
			});

			Cube.nonMaxCubes.forEach(entry => {
				const cube = entry.cube;
				const initialActivation = entry.activation;
				const targetActivation = 0;
				const currentActivation = initialActivation + (targetActivation - initialActivation) * fraction;
				cube.material.color = Cube.activationColor(currentActivation);
				cube.material.opacity = Cube.activationOpacity(currentActivation);
				if (fraction === 1) {
					scene.remove(cube); 
				}
			});

			if (fraction === 1) {
                if (Cube.nonMaxCubes.length > 0) Cube.nonMaxCubes.length = 0; 
				stage = 2; // Move to next stage
                moveStartTime = Date.now(); // Record start time for move animation
            }
        }

        if (stage === 2) {
            // Second stage: Move maxCubes to z=0
            const moveElapsedTime = Date.now() - moveStartTime;
            let moveFraction = Math.min(moveElapsedTime / moveDuration, 1);
            moveFraction = Utils.easeInOutCubic(moveFraction); // Apply ease-out effect

            Cube.maxCubes.forEach(entry => {
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
};



function getSplinePoints(numPoints, p1, p2){
	const points = []
	for (let i = 0; i < numPoints; i++) {
		let fraction = i / (numPoints - 1.0);
		const x = p2.x * Utils.easeInOutCubic(fraction) + p1.x * (1 - Utils.easeInOutCubic(fraction));
		const y = p2.y * fraction + p1.y * (1 - fraction);
		const z = p2.z * fraction + p1.z * (1 - fraction);
		if (x!==x){ console.log("X error!")}
		else if (y!==y){ console.log("Y error!")}
		else if (z!==z){ console.log("Z error!")}
		else {
			const point = new THREE.Vector3(x,y,z);
			points[i] = point;
		}
	}
	return points;
}



export function startSPAnimation() {
	for (let i = 0; i < Config.dimensions.layer; i++) {
        setTimeout(() => {
			scene.add(Cube.SPCubes[i]);
            fadeInCube(Cube.SPCubes[i], 400, 0.64);
        }, i * 20 * Config.dimensions.neuron); 
	}
	Cube.maxCubes.forEach((maxCube, index) => {
		const cube = maxCube.cube;
		const startPosition = cube.position.clone().add(new THREE.Vector3(0, 0, Config.cubeSize/2.0));
		const spCube = Cube.SPCubes[maxCube.i];
		const endPosition = spCube.position.clone().add(new THREE.Vector3(0, 0, -Config.cubeSize/2.0));

		const arr = getSplinePoints(4, startPosition, endPosition);
		const curve = new THREE.CatmullRomCurve3(arr);
		const tubeGeometry = new THREE.TubeGeometry(curve, 16, 0.032, 4, false);
		const material = new THREE.MeshBasicMaterial({ 
			color: 0xffffff,
			transparent: true,
			opacity: 0
		});
		const tubeMesh = new THREE.Mesh(tubeGeometry, material);

        setTimeout(() => {
            scene.add(tubeMesh);
            fadeInMesh(tubeMesh, 200, Math.random()*0.5);
        }, index * 20); 
	});
};


function fadeInMesh(mesh, duration, opacity) {
    const startTime = Date.now();
    function update() {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;
        const fraction = Math.min(elapsedTime / duration, 1); 
        mesh.material.opacity = Utils.easeInOutCubic(fraction) * opacity;
        if (fraction < 1) {
            requestAnimationFrame(update);
        }
    }    
    update();
}

function fadeInCube(cube, duration, opacity) {
    const startTime = Date.now();
    function update() {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;
        const fraction = Math.min(elapsedTime / duration, 1); 
        cube.material.opacity = Utils.easeInOutCubic(fraction) * opacity;
        if (fraction < 1) {
            requestAnimationFrame(update);
        }
    }    
    update();
}


function fadeOutCube(cube, duration, fromOpacity) {
    const startTime = Date.now();
    function update() {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;
        const fraction = Math.min(elapsedTime / duration, 1); 
        cube.material.fromOpacity = (1 - Utils.easeInOutCubic(fraction)) * fromOpacity;
        if (fraction < 1) {
            requestAnimationFrame(update);
        }
    }    
    update();
}