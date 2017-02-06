/**
 * Created by christiancueni on 05/02/17.
 */
import express from 'express';
import {addMeasurement, getAllMeasurements} from './db';
import { config } from '../config';
import { getSensor } from '../sensors/db';
import request from 'request';

let measurements = express.Router();

measurements.get('/', function (req, res) {
    getAllMeasurements().then(function(data) {
        res.status(200).send(data.rows.map(row => row.doc));
    }).catch(function(error) {
        res.status(500, { error: e });
    });
});

measurements.post('/', function (req, res) {
    handleIncoming(req.body)
        .then((measurements) => {
            measurements.map((measurement) => {
                updateActions(measurement, config);
                addMeasurement(measurement);
            });
            return res.status(200).send("cheers");
        })
        .catch((error) => {
            console.log("error", error);
            return res.status(422);
        });
});


function handleIncoming(data) {
    // check if valid
    return getSensor(data['id'])
        .then((sensors) => {
            return sensors.map((sensor) => ({
                id: data['id'],
                data: data['data'] * sensor.doc.multiplier,
                unit: sensor.doc.unit,
                type: sensor.doc.type,
                raw: data['data']
            }));
        })
        .catch(error => error);
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

// function updateRemote(data, config) {
//     let uri = `${config.REMOTE_PROTOCOL}://${config.REMOTE_HOST}${config.REMOTE_PATH}?temp=${data.temperature}`
//     console.log(data, uri);
//     request.get(uri);
// }

function updateLametric(data, config) {

    let headers = {
        'Accept': 'application/json',
        'X-Access-Token': config.LAMETRIC_KEY,
        'Cache-Control': 'no-cache'
    };

    let bodyData = {
        frames: [
            {
                text: `${data.data} °C`,
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


export default measurements;