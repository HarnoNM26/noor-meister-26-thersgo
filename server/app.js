//*

const mongoose = require('mongoose');

const Price = new mongoose.Schema({
  timestamp: String,
  location: String,
  price_eur_mwh: Number,
  source: String,
  created_at: String
});

const EnergyReading = mongoose.model('EnergyReading', Price);

mongoose.connect("mongodb://127.0.0.1:27017/EnergyReading");

// TODO: move this to `POST /api/import/json`
require("./energy_dump.json").filter(record => {
  return Date.parse(record.timestamp) && typeof record.price_eur_mwh == "number";
}).map(record => {
  EnergyReading.create({
    location: record.location || "EE",
    timestamp: (new Date(Date.parse(record.timestamp))).toISOString().slice(0, -5) + 'Z',
    price_eur_mwh: record.price_eur_mwh
  })
})

//*/

const express = require('express');
const cors = require('cors');
const app = express();
const SERVER_PORT = 8080;

app.use(express.json());
app.use(cors());

app.get('/api/health', (req, res) => {
  res.send({
    status: "ok",
    db: [
      "disconnected", "ok", "connecting", "disconnecting"
    ][mongoose.connection.readyState] || "unanitialized"
  })
})

//*/

app.get('/api/readings', (req, res) => {
  res.send(
    EnergyReading.find({
      timestamp: { $gte: req.query.start, $lte: req.query.end },
      location: req.query.fields
    }).exec()
  )
})

app.post('/api/sync/prices', (req, res) => {
  let start = req.query.start || new Date(Date.now()).toISOString().slice(0, -13) + "00:00:00Z";
  let end = req.query.end || new Date(Date.now()).toISOString().slice(0, -13) + "23:59:59Z";
  let fields = req.query.location || 'EE';

  fetch(
    `http://dashboard.elering.ee/api/nps/price?start=${start}&end=${end}`
  ).then(res => res.json())
   .then(prices => {
    prices.data[fields.toLowerCase()].map(record => {
      EnergyReading.create({
        timestamp: new Date(record.timestamp).toISOString().slice(0, -5) + 'Z',
        location: fields,
        price_eur_mwh: record.price,
        source: 'API',
        created_at: new Date(Date.now()).toISOString().slice(0, -5)+'Z'
      })
    })

    res.status(200);
  })
})



app.post('/api/import/json', (req, res) => {
  // TODO: import json from request body
})

app.listen(SERVER_PORT, () => {
  console.log(`Server is listening on port ${SERVER_PORT}.`)
})

//*/
