"use strict";

import PouchDB from 'pouchdb';
import { config } from '../config';

let sensors = new PouchDB(config.COUCHDB_SENSORS);

// document that tells PouchDB/CouchDB
// to build up an index on doc.name
var ddoc = {
    _id: '_design/name_index',
    views: {
        by_name: {
            map: function (doc) { emit(doc.name); }.toString()
        }
    }
};

// add name index

sensors.put(ddoc).then(function () {
    console.log("Sensors: added name index");
}).catch(function (err) {
    // some error (maybe a 409, because it already exists?)
    console.log("Sensors name index: error" + err);
});


export function getAllSensors() {
    return getAllData(sensors);
}

export function addSensor(sensor) {
    return sensors.post(sensor)
        .then(() => getAllSensors(sensors));
}

export function getSensor(sensorName) {
    return sensors.query('name_index/by_name', {
        key: sensorName,
        include_docs : true,
        limit: 1,
    }).then(function (res) {
        // got the query results
        return res.rows;
    }).catch(function (err) {
        // some error
        return err;
    });
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
