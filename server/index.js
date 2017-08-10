/**
 * Created by fengchaoyi on 2017/8/10.
 */
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
var path = require('path');

const app = express();

const ANN = require('../src/core/ANN');

const { getNet, getNetworkFromJson } = ANN;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));


function saveJSONToFile(jsonObject, callback) {
  fs.writeFile(path.join(__dirname, 'files', 'network.json'), JSON.stringify(jsonObject), callback);
}

function readJSONFromFile(callback) {
  fs.readFile(path.join(__dirname, 'files', 'network.json'), 'utf8', (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
      callback(JSON.parse(data));
    }
  });
}

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/initializeNetwork', (req, res) => {
  if (req.body) {
    console.log(req.body);
    const { params } = req.body;

    const net = getNet(params);
    const netToJson = net.toJSON();
    res.send({
      code: 200,
      network: netToJson,
    });
  }
});

app.post('/getNetwork', (req, res) => {
  if (req.body) {
    console.log(req.body);
    readJSONFromFile((network) => {
      res.send({
        code: 200,
        network,
      });
    });
  }
});

app.post('/setNetwork', (req, res) => {
  if (req.body) {
    console.log(req.body);
    const { networkJSON } = req.body;
    saveJSONToFile(networkJSON, () => {
      res.send({
        code: 200,
      });
    });
  }
});

app.listen(3000);
