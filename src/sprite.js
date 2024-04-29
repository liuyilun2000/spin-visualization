import * as THREE from 'three';
import { scene } from './env.js';
import * as Config from './config.js';
import { calculateCubePosition } from './cube.js';


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



function calculateSpritePosition(cubePosition, spriteOffset) {
    const x = cubePosition.x + spriteOffset.x;
    const y = cubePosition.y + spriteOffset.y;
    const z = cubePosition.z + spriteOffset.z;

    return new THREE.Vector3(x, y, z);
}


const tokenSprites = [];
const neuronSprites = [];
const layerSprites = [];

for (let i = 0; i < Config.dimensions.layer; i++) {
	let j = 0;
	let k = 0;
	const sprite = createTextSprite(Config.labels.layer[i]);
	sprite.position.copy(
        calculateSpritePosition(
            calculateCubePosition(i, j, k), 
            Config.spriteOffset.layer
        )
    );
	sprite.material.opacity = 0;
	scene.add(sprite);
	layerSprites.push(sprite);
}
for (let j = 0; j < Config.dimensions.neuron; j++) {
	let i = 0;
	let k = Config.dimensions.token - 1;
	const sprite = createTextSprite(Config.labels.neuron[j]);
	sprite.position.copy(
        calculateSpritePosition(
            calculateCubePosition(i, j, k), 
            Config.spriteOffset.neuron
        )
    );
	sprite.material.opacity = 0;
	scene.add(sprite);
	neuronSprites.push(sprite);
}
for (let k = 0; k < Config.dimensions.token; k++) {
	let i = 0;
	let j = 0;
	const sprite = createTextSprite(Config.labels.token[k]);
	sprite.position.copy(
        calculateSpritePosition(
            calculateCubePosition(i, j, k), 
            Config.spriteOffset.token
        )
    );
	sprite.material.opacity = 0;
	scene.add(sprite);
	tokenSprites.push(sprite);
}


export {tokenSprites, neuronSprites, layerSprites};


export function updateSpriteOpacity(sprites, fraction) {
    sprites.forEach(sprite => {
        sprite.material.opacity = fraction;
    });
}
