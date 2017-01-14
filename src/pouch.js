"use strict";

import PouchDB from 'pouchdb';
import { config } from './config';

let pouch = new PouchDB(config.COUCHDB);

pouch.info().then(function (info) {
  console.log(info);
})

function addData(data) {

    let sensorData = {
        ...data,
        timestamp: timestamp
    };

    return pouch.post(sensorData)
}

function getAllData() {
    return db.allDocs({
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