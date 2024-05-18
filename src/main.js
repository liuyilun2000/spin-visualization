

import {onWindowResize} from './env.js';
import * as Animation from './animation.js';

window.addEventListener('resize', onWindowResize, false);




document.getElementById('startAnimation').addEventListener('click', function() {
    // Start any canvas animations you have
    Animation.startAnimation();

    // Fade out the intro text
    const intro = document.getElementById('intro');
    intro.classList.add('fade-out');

    // Create and insert the start pooling button
    const startPoolingButton = document.getElementById('startPooling');
    startPoolingButton.classList.add('fade-in');
    //startPoolingButton.classList.remove('hidden');

    const phase0 = document.getElementById('phase0');
    phase0.classList.add('fade-in');
    
    // Remove the intro text after it fades out
    setTimeout(() => intro.remove(), 1000);
});



document.getElementById('startPooling').addEventListener('click', () => {
	Animation.startPoolingAnimation('max'); // Or 'avg' for average pooling
});

Animation.animate();
