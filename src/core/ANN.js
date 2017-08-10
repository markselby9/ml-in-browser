/**
 * Created by fengchaoyi on 2017/8/10.
 */

// Class for Artificial NN

const synaptic = require('synaptic');

let Neuron = synaptic.Neuron,
  Layer = synaptic.Layer,
  Network = synaptic.Network,
  Trainer = synaptic.Trainer,
  Architect = synaptic.Architect;

// getNet, params: {inputs, outputs, layers}
const getNet = (params) => {
  if (!params) {
    throw { error: 'error' };
  }
  const { inputs = 3, outputs = 1, layers = 3 } = params;
  return new Architect.Perceptron(inputs, layers, outputs);
};


const getTrainer = (params) => {
  const network = getNet(params);
  if (!network) {
    throw { error: 'network is undefined!' };
  }
  return new Trainer(network);
};

const getNetworkFromJson = (jsonObject) => {
  return Network.fromJSON(jsonObject);
}

module.exports = {
  getNet,
  getNetworkFromJson,
};
