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

