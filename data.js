import { dimensions } from './config.js';



const activation = Array.from({ length: dimensions.layer }, () =>
	Array.from({ length: dimensions.neuron }, () =>
		Array.from({ length: dimensions.token }, () => Math.random())
	)
);

const maxPoolingActivation = activation.map(layer =>
	layer.map(neuron => Math.max(...neuron))
);

let maxPoolingActivation_max = -Infinity;
let maxPoolingActivation_min = Infinity; 

maxPoolingActivation.forEach(neuronValues => {
    const localMax = Math.max(...neuronValues);
    const localMin = Math.min(...neuronValues);
    if (localMax > maxPoolingActivation_max) maxPoolingActivation_max = localMax;
    if (localMin < maxPoolingActivation_min) maxPoolingActivation_min = localMin;
});



export {
    activation, 
    maxPoolingActivation, 
    maxPoolingActivation_max,
    maxPoolingActivation_min
};