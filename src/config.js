import * as THREE from 'three';

export const dimensions = {
    layer: 12,
    neuron: 16,
    token: 6
};

export const cubeSize = 0.64;

export const spacing = {
    layer: 2,
    neuron: 1,
    token: 1.2
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
    layer: new THREE.Vector3(-1.5*spacing.neuron, 0.25, -1.5*spacing.token),
    neuron: new THREE.Vector3(0, -0.5*spacing.layer, 0.5*spacing.token),
    token: new THREE.Vector3(-3*spacing.neuron, -0.5*spacing.layer, -0.25)
};