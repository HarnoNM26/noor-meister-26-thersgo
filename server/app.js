const express = require('express')
const cors = require('cors');
const app = express()
const PORT = 3000

app.use(express.json())

app.get('/api/health', (req, res) => {
    res.send({
        "status": "ok",
        "db": "ok"
    })
})

app.get('/api/readings', (req, res) => {
    let start = req.query.start;
    let end = req.query.end;
    let location = req.query.location;
})

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})

////

function isIsoDate(str) {
  return (/\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\dZ/.test(str));
}

var fs = require('fs');
let clean_data = (path = "./energy_dump.json") => {
    return JSON.parse(fs.readFileSync(path, 'utf8')).filter(record => {
        return (
            isIsoDate(record.timestamp)
            && typeof record.price_eur_mwh == "number" 
            && (typeof record.price == "number" || !record.price)
        );
    }).map(record => {
        if (!record.location) { record.location = "EE" };
        return record;
    });
}

console.log(clean_data());