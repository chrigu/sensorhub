/**
 * Created by christiancueni on 05/02/17.
 */
"use strict";
import express from 'express';
import {addSensor, getAllSensors} from './db';


let sensors = express.Router();

sensors.get('/', function (req, res) {
    getAllSensors().then(function(data) {
        res.status(200).send(data.rows.map(row => row.doc));
    }).catch(function(error) {
        res.status(500, { error: e });
    });
});

sensors.post('/', function (req, res) {
    if (req.body) {
        addSensor(req.body).then(function(data) {
            res.status(200).send(data.rows.map(row => row.doc));
        }).catch(function(error) {
            res.status(500, { error: e });
        });
    } else {
        res.status(422);
    }
});


export default sensors;