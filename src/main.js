

import {onWindowResize} from './env.js';
import * as Animation from './animation.js';

window.addEventListener('resize', onWindowResize, false);


const intro = document.getElementById('intro');
const phase0 = document.getElementsByClassName('phase0');
const phase1 = document.getElementsByClassName('phase1');
const startAnimationButton = document.getElementById('startAnimation');
const startPoolingButton = document.getElementById('startPooling');
const startSPButton = document.getElementById('startSP');


startAnimationButton.addEventListener('click', function() {
    Animation.startAnimation();

    intro.classList.add('fade-out');
    setTimeout(() => intro.remove(), 2000);

    for (let i = 0; i < phase0.length; i++) {
        phase0[i].classList.add('fade-in');
    }
    setTimeout(() => startPoolingButton.classList.add('fade-in'), 2000);    
});


startPoolingButton.addEventListener('click', function() {
	Animation.startPoolingAnimation(); 

    //phase0.classList.add('fade-out');
    this.classList.remove('fade-in');
    this.classList.add('fade-out');

    for (let i = 0; i < phase1.length; i++) {
        phase1[i].classList.add('fade-in');
    }
    setTimeout(() => startSPButton.classList.add('fade-in'), 4000);    
});

startSPButton.addEventListener('click', function() {
	Animation.startSPAnimation(); 

    for (let i = 0; i < phase0.length; i++) {
        phase0[i].classList.remove('fade-in');
        phase0[i].classList.add('fade-out');
        setTimeout(() => phase0[i].remove(), 4000);
    }
    for (let i = 0; i < phase1.length; i++) {
        phase1[i].classList.remove('fade-in');
        phase1[i].classList.add('fade-out');
        setTimeout(() => phase1[i].remove(), 4000);
    }
    this.classList.remove('fade-in');
    this.classList.add('fade-out');
    setTimeout(() => this.remove(), 4000);
    setTimeout(() => startPoolingButton.remove(), 4000);

    //phase1.classList.add('fade-in');
});


Animation.animate();
