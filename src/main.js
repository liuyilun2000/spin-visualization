

import {onWindowResize} from './env.js';
import * as Animation from './animation.js';

window.addEventListener('resize', onWindowResize, false);


document.getElementById('startPooling').addEventListener('click', () => {
	Animation.startPoolingAnimation('max'); // Or 'avg' for average pooling
});



document.getElementById('startAnimation').addEventListener('click', function() {
    // Start any canvas animations you have
    Animation.startAnimation();

    // Fade out the intro text
    const introText = document.getElementById('intro');
    introText.style.opacity = '0';

    // Remove the intro text after it fades out
    setTimeout(() => introText.remove(), 1000);
});


Animation.animate();
