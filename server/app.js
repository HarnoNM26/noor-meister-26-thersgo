const express = require('express')
const cors = require('cors');
const app = express();
const PORT = 8080;

app.use(express.json())
app.use(cors())

app.get('/api/health', (req, res) => {
    res.send({
        "status": "ok",
        "db": "ok"
    })
})

////

function cutMs(date) {
    return date.toISOString().slice(0, -5) + 'Z'
}

var fs = require('fs'); // TODO: fix database connection
let clean_data = (path = "./energy_dump.json") => {
    return JSON.parse(fs.readFileSync(path, 'utf8')).filter(record => {
        return Date.parse(record.timestamp) && typeof record.price_eur_mwh == "number";
    }).map(record => {
        return {
            "location": record.location || "EE",
            "timestamp": cutMs((new Date(Date.parse(record.timestamp)))),
            "price_eur_mwh": record.price_eur_mwh
        }
    })
}

let data = clean_data();

////

app.get('/api/readings', (req, res) => {
    let start = req.query.start;
    let end = req.query.end;
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
    let start = req.query.start
    if (!start) { start = new Date(Date.now()).toISOString().slice(0, -13) + "00:00:00Z" }
    let end = req.query.end;
    if (!end) { end = new Date(Date.now()).toISOString().slice(0, -13) + "23:59:59Z" }

    let fields = (req.query.fields || 'EE').toLowerCase();
    
    fetch(
        `http://dashboard.elering.ee/api/nps/price?start=${start}&end=${end}`
    ).then(res => res.json())
    .then(prices => {
        console.log(prices.data[fields]);

        res.status(200).send("synced prices!\n");
    })
})


app.post('/api/import/json', (req, res) => {
    // TODO: import json from request body
})    

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}.`)
})
