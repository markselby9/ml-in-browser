/**
 * Created by fengchaoyi on 2017/8/9.
 */
const synaptic = require('synaptic');

let Neuron = synaptic.Neuron,
  Layer = synaptic.Layer,
  Network = synaptic.Network,
  Trainer = synaptic.Trainer,
  Architect = synaptic.Architect;

const ANN = require('./ANN');

const { getNet } = ANN;

const trainingSet = [
  {
    input: [0, 0, 1, 0.12, 0, 0, 0, 0, 1, 1],
    output: [1],
  },
  {
    input: [0, 1, 0, 0.045, 0, 0, 1, 1, 0, 0],
    output: [0],
  },
  {
    input: [1, 0, 0, 0.42, 1, 1, 0, 0, 0, 0],
    output: [1],
  },
];

const trainingOptions = {
  rate: 0.1,
  iterations: 20000,
  error: 0.005,
};

const myNet = getNet({
  params: {
    inputs: 10,
    outputs: 1,
    layers: 7,
  },
});


const trainer = new Trainer(myNet);
trainer.train(trainingSet, trainingOptions);

console.log(myNet);

// propagate
var learningRate = .3;
myNet.activate(trainingSet[0].input);
myNet.propagate(learningRate, trainingSet[0].output);

console.log('===')
console.log(myNet);
