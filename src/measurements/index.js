/**
 * Created by christiancueni on 05/02/17.
 */
import express from 'express';
import {addMeasurement, getAllMeasurements} from './db';
import { config } from '../config';
import { sensorDefinitions } from '../sensor.config';
import _ from 'lodash';

let measurements = express.Router();

measurements.get('/', function (req, res) {
    getAllMeasurements().then(function(data) {
        res.status(200).send(data.rows.map(row => row.doc));
    }).catch(function(error) {
        res.status(500, { error: e });
    });
});

measurements.post('/', function (req, res) {
    let data = handleIncoming(req.body);
    if (data) {
        updateActions(data, config);
        addMeasurement(data);
        res.status(200).send("cheers");
    } else {
        res.status(422);
    }
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