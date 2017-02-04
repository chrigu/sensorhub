"use strict";

import PouchDB from 'pouchdb';
import { config } from './config';

let measurements = new PouchDB(config.COUCHDB_MEASUREMENTS);
let sensors = new PouchDB(config.COUCHDB_SENSORS);

measurements.info().then(function (info) {
  console.log(info);
});

function addMeasurement(data) {

    let timestamp = Math.floor(Date.now() / 1000);

    let measurement = {
        ...data,
        timestamp: timestamp
    };

    return measurements.post(measurement)
}

function getAllMeasurements() {
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

function getAllSensors() {
    return getAllData(sensors);
}

function addSensor(sensor) {

    return sensors.post(sensor)
        .then(() => getAllSensors(sensors));

}

let db = {
    addMeasurement: addMeasurement,
    getAllMeasurements: getAllMeasurements,
    getAllSensors: getAllSensors,
    addSensor: addSensor
};


module.exports = db;