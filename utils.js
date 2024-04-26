import * as THREE from 'three';

export function easeInCubic(t) {
    return t * t * t;
}

export function easeOutCubic(t) {
    return (--t) * t * t + 1;
}

export function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}


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
