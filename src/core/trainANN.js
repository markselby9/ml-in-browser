/**
 * Created by fengchaoyi on 2017/8/9.
 */
// import synaptic from 'synaptic';
const synaptic = require('synaptic');

let Neuron = synaptic.Neuron,
  Layer = synaptic.Layer,
  Network = synaptic.Network,
  Trainer = synaptic.Trainer,
  Architect = synaptic.Architect;

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


const myNet = new Architect.Perceptron(10, 7, 1);
const trainer = new Trainer(myNet);
trainer.train(trainingSet, trainingOptions);
console.log(trainer);
console.log(myNet.toJSON());

console.log(myNet.activate(trainingSet[0].input));
console.log(trainingSet[0].output);
