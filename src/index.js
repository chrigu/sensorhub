/**
 * Created by christiancueni on 13/11/16.
 */
"use strict";
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { config } from './config';
import sensors from './sensors';
import measurements from './measurements';

let app = express();

// middleware

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(morgan('combined'));

// remove later

app.all('/api/measurements', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.all('/api/sensors', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

//routes
app.use('/api/sensors', sensors);
app.use('/api/measurements', measurements);


app.listen(4200, config.BIND_ADDRESS, function () {
    console.log('Example app listening on port 4200!')
});

