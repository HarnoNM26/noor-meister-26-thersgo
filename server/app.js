const mongoose = require('mongoose');
const DATABASE_PORT = 8081;

const Price = new mongoose.Schema({
    timestamp: String,
    location: String,
    price_eur_mwh: Number,
    source: String,
    created_at: String
});

const EnergyReading = mongoose.model('EnergyReading', Price);

mongoose.connect("mongodb://127.0.0.1:27017/EnergyReading");

////

const express = require('express');
const cors = require('cors');
const app = express();
const SERVER_PORT = 8080;

app.use(express.json());
app.use(cors());

app.get('/api/health', (req, res) => {
    res.send({
        status: "ok",
        db: "not connected"
    })
})

////

require("./energy_dump.json").filter(record => {
    return Date.parse(record.timestamp) && typeof record.price_eur_mwh == "number";
}).map(record => {
    EnergyReading.create({
        location: record.location || "EE",
        timestamp: (new Date(Date.parse(record.timestamp))).toISOString().slice(0, -5) + 'Z',
        price_eur_mwh: record.price_eur_mwh
    })
})

////

app.get('/api/readings', (req, res) => {
    let start  = req.query.start;
    let end    = req.query.end;
    let fields = req.query.fields;

    res.send(data.filter(record => {
        return (
               record.timestamp >= start
            && record.timestamp <= end
            && record.location === fields
        )
    }))
})

app.post('/api/sync/prices', (req, res) => {
    let start = req.query.start || new Date(Date.now()).toISOString().slice(0, -13) + "00:00:00Z";
    let end = req.query.end || new Date(Date.now()).toISOString().slice(0, -13) + "23:59:59Z";
    let fields = (req.query.fields || 'EE');
    
    fetch(
        `http://dashboard.elering.ee/api/nps/price?start=${start}&end=${end}`
    ).then(res => res.json())
    .then(prices => {
        console.log(prices.data[fields.toLowerCase()]);

        res.status(200).send("synced prices!\n");
    })
})



app.post('/api/import/json', (req, res) => {
    // TODO: import json from request body
})

app.listen(SERVER_PORT, () => {
  console.log(`Server is listening on port ${SERVER_PORT}.`)
})
