import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { EffectComposer } from 'EffectComposer';
import { RenderPass } from 'RenderPass';
import { UnrealBloomPass } from 'UnrealBloomPass';

const frustumSize = 32;

const scene = new THREE.Scene();
export {scene}

function createCamera(aspect) {
    const frustumHalfHeight = frustumSize / 2;
    const frustumHalfWidth = frustumHalfHeight * aspect;
    const camera = new THREE.OrthographicCamera(
        -frustumHalfWidth, frustumHalfWidth,
        frustumHalfHeight, -frustumHalfHeight,
        0.5,    //near plane   
        1500    //far plane
    );
    camera.position.set(-20, 20, 20);
    return camera;
}
const camera = createCamera(window.innerWidth / window.innerHeight);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

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

export {composer}



// OrbitControls for interactive manipulation
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.5;
controls.autoRotate = false;  
controls.autoRotateSpeed = 0.0; 

export {controls}




let bloomCycle = 0;
let maxBloomStrength = 0.64;
let minBloomStrength = 0.56;
let bloomSpeed = 0.01;

export function updateBloomEffect() {
    bloomCycle += bloomSpeed;
    const bloomStrength = minBloomStrength + (Math.sin(bloomCycle) + 1) / 2 * (maxBloomStrength - minBloomStrength);
    bloomPass.strength = bloomStrength;
}




export function onWindowResize() {
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
