/**
 * Created by christiancueni on 13/11/16.
 */
"use strict";

let express = require('express'), 
    morgan = require('morgan'), 
    jsonfile = require('jsonfile'),
    bodyParser = require('body-parser');


const FILE = './data.json';

let app = express();


app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(morgan('combined'));

app.get('/api', function (req, res) {
    // Todo: use file & jsonparser and pipes
    res.send(jsonfile.readFileSync(FILE));
});

app.post('/api', function (req, res) {
    let data = {};
    if ('temperature' in req.body) {
        data['temperature'] = req.body.temperature/100;
    }

    res.status(200).send("cheers");
    jsonfile.writeFile(FILE, data, function (err) {
        console.error(err)
    })
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})