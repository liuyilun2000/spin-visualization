import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { FontLoader } from 'FontLoader';
import { TextGeometry } from 'TextGeometry';
import { EffectComposer } from 'EffectComposer';
import { RenderPass } from 'RenderPass';
import { UnrealBloomPass } from 'UnrealBloomPass';
import { BokehPass } from 'BokehPass';


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


// Define the parameters for the orthographic camera
const frustumSize = 36; // This value might need adjustment based on your scene's scale
const aspect = window.innerWidth / window.innerHeight;
const frustumHalfHeight = frustumSize / 2;
const frustumHalfWidth = frustumHalfHeight * aspect;


const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(
	-frustumHalfWidth,    // Left
	frustumHalfWidth,     // Right
	frustumHalfHeight,    // Top
	-frustumHalfHeight,   // Bottom
	0.5,                    // Near plane
	1500                  // Far plane
);

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);

const bloomPass = new UnrealBloomPass(
	new THREE.Vector2(window.innerWidth, window.innerHeight),
	0.5, 	//strength
	0.8, 	//radius
	0		//threshold
);

composer.addPass(renderPass);
composer.addPass(bloomPass);



/*
const bokehPass = new BokehPass(scene, camera, {
    focus: 1,
    aperture: 0.0005,
    maxblur: 0.8,
    width: window.innerWidth,
    height: window.innerHeight
});

composer.addPass(bokehPass);
*/




// OrbitControls for interactive manipulation
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.5;
controls.autoRotate = false;  
controls.autoRotateSpeed = 0.0; 




// Data dimensions and spacing
const layers = 12, neurons = 16, tokens = 6;
const cubeSize = 0.8;
const neuronSpacing = 1, tokenSpacing = 1.5, layerSpacing = 2;


const tokenLabels = Array.from({ length: tokens }, (_, index) => `token ${index}`);

const neuronLabels = Array.from({ length: neurons }, (_, index) => `N${index}`);

const layerLabels = Array.from({ length: layers }, (_, index) => `L${index}`);


function createTextSprite(message, parameters) {
	if (parameters === undefined) parameters = {};
	var fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Helvetica";
	var fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 16;
	var borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 0;
	var textColor = parameters.hasOwnProperty("textColor") ? parameters["textColor"] : { r: 255, g: 255, b: 255, a: 0.8 };

	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	context.font = "Bold " + fontsize + "px " + fontface;

	// Measure text width and height
	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	context.font = "Bold " + fontsize + "px " + fontface;

	context.fillStyle = "rgba(" + textColor.r + ", " + textColor.g + ", " + textColor.b + ", 1.0)";
	context.fillText(message, borderThickness, fontsize + borderThickness);

	var texture = new THREE.Texture(canvas)
	texture.needsUpdate = true;

	var spriteMaterial = new THREE.SpriteMaterial({ map: texture });
	var sprite = new THREE.Sprite(spriteMaterial);
	sprite.scale.set(0.5 * fontsize, 0.25 * fontsize, 0.75 * fontsize);
	sprite.center.set(0, 1);
	return sprite;
}

function activationColor(activation) {
	//let c1 = new THREE.Color('rgba(200,20,40,0.2)')
	//let c2 = new THREE.Color('rgba(20,200,40,1)') 
	let color = new THREE.Color().setHSL(activation * 0.4, 0.4, 0.4);
	//let color = new THREE.Color().lerpColors(c1, c2, activation);
	return color;
}

function activationOpacity(activation) {
	let opacity = 0.02 + activation ** 6
	return opacity
}

const activationData = Array.from({ length: layers }, () =>
	Array.from({ length: neurons }, () =>
		Array.from({ length: tokens }, () => Math.random())
	)
);

const maxPoolingData = activationData.map(layer =>
	layer.map(neuron => Math.max(...neuron))
);

let max_max = -Infinity;
let max_min = Infinity; 

maxPoolingData.forEach(neuronValues => {
    const localMax = Math.max(...neuronValues);
    const localMin = Math.min(...neuronValues);
    if (localMax > max_max) max_max = localMax;
    if (localMin < max_min) max_min = localMin;
});


/*
const avgPoolingData = activationData.map(layer =>
	layer.map(neuron => neuron.reduce((a, b) => a + b, 0) / neuron.length)
);
*/



const cubes = [];


const maxCubes = [];
const nonMaxCubes = [];

// Assuming cubes is a 3D array of THREE.Mesh objects, as per your setup
const cubePositions = [];
const cubeVelocities = [];


// Create blocks with random positions
for (let i = 0; i < layers; i++) {
	cubes[i] = [];
	cubePositions[i] = [];
	cubeVelocities[i] = [];
	for (let j = 0; j < neurons; j++) {
		cubes[i][j] = [];
		cubePositions[i][j] = [];
		cubeVelocities[i][j] = [];
		for (let k = 0; k < tokens; k++) {
			const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize); // Cube geometry
			const activation = activationData[i][j][k];
			const color = activationColor(activation);
			const material = new THREE.MeshBasicMaterial({
				color: color,
				transparent: true,
				opacity: activationOpacity(activation)
			});
			const cube = new THREE.Mesh(geometry, material);

			// Set initial random positions far from the center
			cubePositions[i][j][k] = new THREE.Vector3(
				(Math.random() + 5) * frustumSize * 2,
				(Math.random() - 5.5) * frustumSize * 2,
				(Math.random() - 6) * frustumSize * 2
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

            if (activation === maxPoolingData[i][j]) {
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
	for (let i = 0; i < layers; i++) {
		for (let j = 0; j < neurons; j++) {
			for (let k = 0; k < tokens; k++) {
				// Update positions based on velocities
				cubePositions[i][j][k].add(cubeVelocities[i][j][k]);
				cubes[i][j][k].position.copy(cubePositions[i][j][k]);
			}
		}
	}
}

// Set camera position
camera.position.set(-20, 20, 20);



let bloomCycle = 0;
let maxBloomStrength = 0.64;
let minBloomStrength = 0.56;
let bloomSpeed = 0.01;

function updateBloomEffect() {
    bloomCycle += bloomSpeed;
    const bloomStrength = minBloomStrength + (Math.sin(bloomCycle) + 1) / 2 * (maxBloomStrength - minBloomStrength);
    bloomPass.strength = bloomStrength;
}


// Animation function
function animate() {
	requestAnimationFrame(animate);
	// Drift cubes if drifting is true
	if (isDrifting) { 
		driftCubes();
	}
	updateBloomEffect();
	controls.update(); // Update controls
	//renderer.render(scene, camera);
	composer.render();
}

function easeInCubic(t) {
    return t * t * t;
}
function easeOutCubic(t) {
    return (--t) * t * t + 1;
}
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

const tokenSprites = [];
const neuronSprites = [];
const layerSprites = [];


let cubeOffset = new THREE.Vector3(
	neurons * -0.5, 
	layers * -0.4, 
	tokens * -0.5
);

function calculateCubePosition(i, j, k) {
    const x = (j + cubeOffset.x) * neuronSpacing;
    const y = (i + cubeOffset.y) * layerSpacing;
    const z = - (k + cubeOffset.z) * tokenSpacing;

    return new THREE.Vector3(x, y, z);
}

function calculateSpritePosition(cubePosition, spriteOffset) {
    const x = cubePosition.x + spriteOffset.x;
    const y = cubePosition.y + spriteOffset.y;
    const z = cubePosition.z + spriteOffset.z;

    return new THREE.Vector3(x, y, z);
}


let layerSpriteOffset = new THREE.Vector3(-1.5, 0.25, -2);
let neuronSpriteOffset = new THREE.Vector3(-0.25, -1, 1.5);
let tokenSpriteOffset = new THREE.Vector3(-2.25, -1, -0.25);


for (let i = 0; i < layers; i++) {
	let j = 0;
	let k = tokens - 1;
	const sprite = createTextSprite(layerLabels[i]);
	sprite.position.copy(calculateSpritePosition(calculateCubePosition(i, j, k), layerSpriteOffset));
	sprite.material.opacity = 0;
	scene.add(sprite);
	layerSprites.push(sprite);
}
for (let j = 0; j < neurons; j++) {
	let i = 0;
	let k = 0;
	const sprite = createTextSprite(neuronLabels[j]);
	sprite.position.copy(calculateSpritePosition(calculateCubePosition(i, j, k), neuronSpriteOffset));
	sprite.material.opacity = 0;
	scene.add(sprite);
	neuronSprites.push(sprite);
}
for (let k = 0; k < tokens; k++) {
	let i = 0;
	let j = 0;
	const sprite = createTextSprite(tokenLabels[k]);
	sprite.position.copy(calculateSpritePosition(calculateCubePosition(i, j, k), tokenSpriteOffset));
	sprite.material.opacity = 0;
	scene.add(sprite);
	tokenSprites.push(sprite);
}

// Helper function to update sprite opacity
function updateSpriteOpacity(sprites, fraction) {
    sprites.forEach(sprite => {
        sprite.material.opacity = fraction;
    });
}

function startRotating() {
    controls.autoRotate = true; 
    controls.autoRotateSpeed = 0; 
    const duration = 2000; 
    const maxRotateSpeed = 1; 
    const startTime = Date.now();

    function increaseRotationSpeed() {
        const elapsedTime = Date.now() - startTime;
        const fraction = Math.min(elapsedTime / duration, 1); 
        controls.autoRotateSpeed = maxRotateSpeed * easeInCubic(fraction); 

        if (fraction < 1) {
            requestAnimationFrame(increaseRotationSpeed);
        }
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
					fraction = easeInOutCubic(fraction);

					if (fraction < 1) {
						const currentPosition = startPosition.clone().lerp(endPosition, fraction);
						cube.position.copy(currentPosition);
						requestAnimationFrame(animatePosition);
                        updateSpriteOpacity(tokenSprites, fraction);
                        updateSpriteOpacity(neuronSprites, fraction);
                        updateSpriteOpacity(layerSprites, fraction);
					} else {
						cube.position.copy(endPosition);
                        updateSpriteOpacity(tokenSprites, 1);
                        updateSpriteOpacity(neuronSprites, 1);
                        updateSpriteOpacity(layerSprites, 1);
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
				const targetActivation = (initialActivation - max_min) / (max_max - max_min);
				const currentActivation = initialActivation + (targetActivation - initialActivation) * fraction;
				cube.material.color = activationColor(currentActivation);
				cube.material.opacity = activationOpacity(currentActivation);
			});

			nonMaxCubes.forEach(entry => {
				const cube = entry.cube;
				const initialActivation = entry.activation;
				const targetActivation = 0;
				const currentActivation = initialActivation + (targetActivation - initialActivation) * fraction;
				cube.material.color = activationColor(currentActivation);
				cube.material.opacity = activationOpacity(currentActivation);
				if (fraction === 1) {
					scene.remove(cube); 
				}
			});

			if (fraction === 1) {
                if (nonMaxCubes.length > 0) {
					nonMaxCubes.length = 0; // Clear nonMaxCubes list after they're removed
				}
				stage = 2; // Move to next stage
                moveStartTime = Date.now(); // Record start time for move animation
            }
        }

        if (stage === 2) {
            // Second stage: Move maxCubes to z=0
            const moveElapsedTime = Date.now() - moveStartTime;
            let moveFraction = Math.min(moveElapsedTime / moveDuration, 1);
            moveFraction = easeInOutCubic(moveFraction); // Apply ease-out effect

            maxCubes.forEach(entry => {
                const cube = entry.cube;
                const zTarget = 0;
                const zStart = cube.position.z;
                cube.position.z = zStart + (zTarget - zStart) * moveFraction;
            });
			
			//updateSpriteOpacity(tokenSprites, 1 - moveFraction);
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
		
			moveSprites(neuronSprites);
			moveSprites(layerSprites);
			moveSprites(tokenSprites, true);

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



window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
	const aspect = window.innerWidth / window.innerHeight;
	const frustumHalfHeight = frustumSize / 2;
	const frustumHalfWidth = frustumHalfHeight * aspect;

	camera.left = -frustumHalfWidth;
	camera.right = frustumHalfWidth;
	camera.top = frustumHalfHeight;
	camera.bottom = -frustumHalfHeight;
	
    camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}