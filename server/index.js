/**
 * Created by fengchaoyi on 2017/8/10.
 */
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

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

app.listen(3000, () => {
    console.log('server started');
});
