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
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

function saveJSONToFile(jsonObject, callback) {
    fs.writeFile(path.join(__dirname, 'files', 'network.json'), JSON.stringify(jsonObject), callback);
}

function readJSONFromFile(successCb, errorCb) {
    const dir = 'files';
    const filename = path.join(__dirname, dir, 'network.json');
    if (!fs.existsSync(path.join(__dirname, dir))){
        fs.mkdirSync(path.join(__dirname, dir));
    }
    fs.open(filename, 'r', function (err, fd) {
        if (err) {
            fs.writeFile(filename, '{}', function (err) {
                if (err) {
                    console.log(err);
                    errorCb(err);
                } else {
                    successCb({});  // return an empty json
                }
            });
        } else {
            // file exists, read JSON from this file
            fs.readFile(filename, 'utf8', (err, data) => {
                if (err) {
                    console.log(err);
                    errorCb(err);
                } else {
                    console.log(data);
                    successCb(JSON.parse(data));
                }
            });
        }
    });
}

app.get('/', (req, res) => {
    res.send('Hello World');
});

// app.post('/initializeNetwork', (req, res) => {
//     if (req.body) {
//         console.log(req.body);
//         const { params } = req.body;
//
//         const net = getNet(params);
//         const netToJson = net.toJSON();
//         res.send({
//             code: 200,
//             network: netToJson,
//         });
//     }
// });

app.post('/getNetwork', (req, res) => {
    if (req.body) {
        console.log(req.body);
        readJSONFromFile((network) => {
            res.send({
                code: 200,
                network,
            });
        }, (err) => {
            console.log(err.toString());
        });
    }
});

app.post('/setNetwork', (req, res) => {
    if (req.body && req.body.networkJSON) {
        console.log(req.body);
        const { networkJSON } = req.body;
        saveJSONToFile(networkJSON, (err) => {
            if (err) {
                res.send({
                    code: 500,
                    err
                });
            } else {
                res.send({
                    code: 200,
                });
            }
        });
    } else {
        res.send({
            code: 406,
        })
    }
});

app.listen(3000, () => {
    console.log('server started');
});
