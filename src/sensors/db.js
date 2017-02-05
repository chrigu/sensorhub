"use strict";

import PouchDB from 'pouchdb';
import { config } from '../config';

let sensors = new PouchDB(config.COUCHDB_SENSORS);


function getAllData(db) {
    return db.allDocs({
        include_docs: true,
        attachments: true
    }).then(function (result) {
        return result;
    }).catch(function (err) {
        console.log(err);
    });
}

export function getAllSensors() {
    return getAllData(sensors);
}

export function addSensor(sensor) {

    return sensors.post(sensor)
        .then(() => getAllSensors(sensors));

}
