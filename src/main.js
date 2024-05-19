

import {onWindowResize} from './env.js';
import * as Animation from './animation.js';

window.addEventListener('resize', onWindowResize, false);


const intro = document.getElementById('intro');
const phase0 = document.getElementById('phase0');
const phase1 = document.getElementById('phase1');
const startAnimationButton = document.getElementById('startAnimation');
const startPoolingButton = document.getElementById('startPooling');

startAnimationButton.addEventListener('click', function() {
    // Start any canvas animations you have
    Animation.startAnimation();

    intro.classList.add('fade-out');
    setTimeout(() => intro.remove(), 2000);

    phase0.classList.add('fade-in');
});


startPoolingButton.addEventListener('click', function() {
    // Start any canvas animations you have
	Animation.startPoolingAnimation('max'); 

    //phase0.classList.add('fade-out');
    this.classList.add('fade-out');
    setTimeout(() => this.remove(), 2000);

    phase1.classList.add('fade-in');
});


Animation.animate();
