const express = require('express')
const cors = require('cors');
const app = express();
const PORT = 8080;

app.use(express.json())
app.use(cors())

app.get('/api/health', (req, res) => {
    console.log("Server has been asked for status.");

    res.send({
        "status": "ok",
        "db": "ok"
    })
})

////

var fs = require('fs'); // TODO: fix database connection
let clean_data = (path = "./energy_dump.json") => {
    return JSON.parse(fs.readFileSync(path, 'utf8')).filter(record => {
        return Date.parse(record.timestamp) && typeof record.price_eur_mwh == "number";
    }).map(record => {
        return {
            "location": record.location || "EE",
            "timestamp": (new Date(Date.parse(record.timestamp))).toISOString().slice(0, -4) + 'Z',
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
    let start = new Date(req.query.start).setHours(0, 0, 0, 0);
    let end = new Date(req.query.end).setHours(23, 59, 59, 999);
    let location = req.query.location || 'EE';
    
    console.log(start, end, fields);
})


app.post('/api/import/json', (req, res) => {
    // TODO: import json from request body
})    

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}.`)
})
