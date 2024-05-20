import * as THREE from 'three';

export const dimensions = {
    layer: 12,
    neuron: 16,
    token: 6
};

export const cubeSize = 0.8;

export const spacing = {
    layer: 2,
    neuron: 1,
    token: 1.5
};


export const cubeOffset = new THREE.Vector3(
	dimensions.neuron * -0.5, 
	dimensions.layer * -0.4, 
	dimensions.token * -0.5
);



export const labels = {
    layer: Array.from({ length: dimensions.layer }, (_, index) => `L${index}`),
    neuron: Array.from({ length: dimensions.neuron }, (_, index) => `N${index}`),
    token: ["This", "movie", "   is", " the", " best", "   !"]    
};


export const spriteOffset = {
    layer: new THREE.Vector3(-1.5, 0.25, -2),
    neuron: new THREE.Vector3(0, -1, 1.5),
    token: new THREE.Vector3(-2.25, -1, -0.5)
};