

import {onWindowResize} from './env.js';
import * as Animation from './animation.js';

window.addEventListener('resize', onWindowResize, false);


const intro = document.getElementById('intro');
const phase0 = document.getElementsByClassName('phase0');
const phase1 = document.getElementsByClassName('phase1');
const phase2 = document.getElementsByClassName('phase2');
const phase3 = document.getElementsByClassName('phase3');
const phase4 = document.getElementsByClassName('phase4');
const phase5 = document.getElementsByClassName('phase5');
const startPhase0Button = document.getElementById('startPhase0');
const startPhase1Button = document.getElementById('startPhase1');
const startPhase2Button = document.getElementById('startPhase2');
const startPhase3Button = document.getElementById('startPhase3');
const startPhase4Button = document.getElementById('startPhase4');
const startPhase5Button = document.getElementById('startPhase5');


function delayedRemove(element, delay) {
    setTimeout(() => {
        if (element && element.parentNode) {
            element.remove();
        }
    }, delay);
    return;
}

startPhase0Button.addEventListener('click', function() {
    Animation.startAnimation();

    intro.classList.add('fade-out');
    delayedRemove(intro, 2000);

    for (let i = 0; i < phase0.length; i++) {
        phase0[i].classList.add('fade-in');
    }
    setTimeout(() => startPhase1Button.classList.add('fade-in'), 2000);    
});


startPhase1Button.addEventListener('click', function() {
	Animation.startPoolingAnimation(); 

    this.classList.add('fade-out');

    for (let i = 0; i < phase1.length; i++) {
        phase1[i].classList.add('fade-in');
    }
    setTimeout(() => startPhase2Button.classList.add('fade-in'), 4000);    
});

startPhase2Button.addEventListener('click', function() {
	Animation.startProbeAnimation(); 

    for (let i = 0; i < phase0.length; i++) {
        phase0[i].classList.add('fade-out');
        delayedRemove(phase0[i], 8000);
    }
    for (let i = 0; i < phase1.length; i++) {
        phase1[i].classList.add('fade-out');
        delayedRemove(phase1[i], 8000);
    }
    this.classList.add('fade-out');
    delayedRemove(this, 4000);    
    delayedRemove(startPhase1Button, 4000);
    
    for (let i = 0; i < phase2.length; i++) {
        phase2[i].classList.add('fade-in');
    }
    setTimeout(() => startPhase3Button.classList.add('fade-in'), 4000);    
});


startPhase3Button.addEventListener('click', function() {
	Animation.startSparsifyAnimation(); 

    this.classList.add('fade-out');

    for (let i = 0; i < phase3.length; i++) {
        phase3[i].classList.add('fade-in');
    }
    setTimeout(() => startPhase4Button.classList.add('fade-in'), 4000);    
});


startPhase4Button.addEventListener('click', function() {
	Animation.startIntegrateAnimation(); 

    for (let i = 0; i < phase2.length; i++) {
        phase2[i].classList.add('fade-out');
        delayedRemove(phase2[i], 8000);
    }
    for (let i = 0; i < phase3.length; i++) {
        phase3[i].classList.add('fade-out');
        delayedRemove(phase3[i], 8000);
    }
    this.classList.add('fade-out');
    delayedRemove(this, 4000);    
    delayedRemove(startPhase3Button, 4000);
    
    for (let i = 0; i < phase4.length; i++) {
        phase4[i].classList.add('fade-in');
    }
    setTimeout(() => startPhase5Button.classList.add('fade-in'), 4000);    
});


startPhase5Button.addEventListener('click', function() {
	//Animation.startSparsifyAnimation(); 

    this.classList.add('fade-out');

    for (let i = 0; i < phase5.length; i++) {
        phase5[i].classList.add('fade-in');
    }
    //setTimeout(() => startPhase4Button.classList.add('fade-in'), 4000);    
});


Animation.animate();
