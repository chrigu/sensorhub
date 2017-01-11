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

function getAllData() {
    return     db.allDocs({
  include_docs: true,
  attachments: true
}).then(function (result) {
  res.send(result)
}).catch(function (err) {
  console.log(err);
});
}

let db = {
    addData: addData
}


module.exports = db