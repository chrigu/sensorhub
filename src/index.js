/**
 * Created by christiancueni on 13/11/16.
 */
"use strict";
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import request from 'request';
import config from './config';
import db from './pouch';
import { sensorDefinitions } from './sensor.config';
import _ from 'lodash';

let app = express();

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(morgan('combined'));

app.all('/api', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.get('/api', function (req, res) {
    db.getAllMeasurements().then(function(data) {
        res.status(200).send(data.rows.map(row => row.doc));
    }).catch(function(error) {
        res.status(500, { error: e });
    });
});

app.post('/api', function (req, res) {

    let data = handleIncoming(req.body);

    if (data) {
        updateActions(data, config);
        db.addMeasurement(data);
        res.status(200).send("cheers");
    } else {
        res.status(422);
    }
});

// sensors
app.all('/api/sensors', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.get('/api/sensors', function (req, res) {
    db.getAllSensors().then(function(data) {
        res.status(200).send(data.rows.map(row => row.doc));
    }).catch(function(error) {
        res.status(500, { error: e });
    });
});

app.post('/api/sensors', function (req, res) {


    if (req.body) {
        db.addSensor(req.body).then(function(data) {
            res.status(200).send(data.rows.map(row => row.doc));
        }).catch(function(error) {
            res.status(500, { error: e });
        });
    } else {
        res.status(422);
    }
});

app.listen(4200, function () {
    console.log('Example app listening on port 3000!')
});

function handleIncoming(data) {
    // check if valid
    if ('id' in data && 'data' in data) {
        let sensorDefinition =  _.find(sensorDefinitions, { id: data['id'] });
        return {
            id: data['id'],
            data: data['data'] * sensorDefinition['data']['multiplier'],
            unit: sensorDefinition['data']['unit'],
            type: sensorDefinition['data']['type']
        };
    } else {
        return null;
    }
}


// remove...

function updateActions(data, config) {

    // if (config.UPDATE_REMOTE) {
    //     updateRemote(data, config);
    // }

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
                text: `${data.temperature} °C`,
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
