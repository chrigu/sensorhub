/**
 * Created by christiancueni on 05/02/17.
 */
"use strict";

import PouchDB from 'pouchdb';
import { config } from '../config';

let measurements = new PouchDB(config.COUCHDB_MEASUREMENTS);

measurements.info().then(function (info) {
    console.log(info);
});

export function addMeasurement(data) {

    let timestamp = Math.floor(Date.now() / 1000);

    let measurement = {
        ...data,
        timestamp: timestamp
    };

    return measurements.post(measurement)
}

export function getAllMeasurements() {
    return getAllData(measurements);
}

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
