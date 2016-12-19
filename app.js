/**
 * Created by christiancueni on 13/11/16.
 */
"use strict";

const express = require('express'), 
    morgan = require('morgan'), 
    jsonfile = require('jsonfile'),
    bodyParser = require('body-parser'),
    request = require('request'),
    config = require('./config.js');

const FILE = './data.json';

let app = express();

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(morgan('combined'));

app.get('/api', function (req, res) {
    // Todo: use file & jsonparser and pipes
    res.send(jsonfile.readFileSync(FILE));
});

app.post('/api', function (req, res) {
    let data = {};
    if ('temperature' in req.body) {
        data['temperature'] = +req.body.temperature/100;
    }

    updateActions(data, config)

    res.status(200).send("cheers");
    jsonfile.writeFile(FILE, data, function (err) {
        console.error(err)
    })
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})

function updateActions(data, config) {

    if (config.UPDATE_REMOTE) {
        updateRemote(data, config);
    }

    if (config.UPDATE_LAMETRIC) {
        updateLametric(data, config);
    }
}

function updateRemote(data, config) {
    let uri = `${config.REMOTE_PROTOCOL}://${config.REMOTE_HOST}${config.REMOTE_PATH}?temp=${data.temperature}`
    console.log(data, uri);
    request.get(uri);
}

function updateLametric(data, config) {

    let headers = {
        'Accept': 'application/json',
        'X-Access-Token': config.LAMETRIC_KEY,
        'Cache-Control': 'no-cache'
    };

    let bodyData = {
        frames: [
            {
                text: `Temp: ${data.temperature}`,
                icon: 'i3253',
                index: 0
            }
        ]
    };

    request({
            headers: headers,
            uri: config.LAMETRIC_URL,
            json: bodyData,
            method: 'POST'
        }, (err, res, body) => {
        console.error(err)
    });
}