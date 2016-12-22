"use strict";

let PouchDB = require('pouchdb'),
    config = require('./config.js');

let pouch = new PouchDB(config.COUCHDB);

pouch.info().then(function (info) {
  console.log(info);
})

function addData(sensorId, data) {

    let timestamp = Math.floor(Date.now() / 1000);
    let sensorData = {
        sensor: sensorId,
        timestamp: timestamp,
        data: data
    };

    return pouch.post(sensorData)
}

let db = {
    addData: addData
}


module.exports = db