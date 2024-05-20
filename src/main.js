

import {onWindowResize} from './env.js';
import * as Animation from './animation.js';

window.addEventListener('resize', onWindowResize, false);


const intro = document.getElementById('intro');
const phase0 = document.getElementById('phase0');
const phase1 = document.getElementById('phase1');
const startAnimationButton = document.getElementById('startAnimation');
const startPoolingButton = document.getElementById('startPooling');
const startSPButton = document.getElementById('startSP');


startAnimationButton.addEventListener('click', function() {
    Animation.startAnimation();

    intro.classList.add('fade-out');
    setTimeout(() => intro.remove(), 2000);

    phase0.classList.add('fade-in');
});


startPoolingButton.addEventListener('click', function() {
	Animation.startPoolingAnimation(); 

    //phase0.classList.add('fade-out');
    this.classList.add('fade-out');

    phase1.classList.add('fade-in');
});

startSPButton.addEventListener('click', function() {
	Animation.startSPAnimation(); 

    phase0.classList.remove('fade-in');
    phase1.classList.remove('fade-in');
    phase0.classList.add('fade-out');
    phase1.classList.add('fade-out');
    setTimeout(() => phase0.remove(), 2000);
    setTimeout(() => phase1.remove(), 2000);

    //phase1.classList.add('fade-in');
});


Animation.animate();
