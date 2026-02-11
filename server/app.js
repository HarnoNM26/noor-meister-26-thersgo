const express = require('express')
const app = express()
const port = 3000

app.use(express.json())

app.get('/api/health', (req, res) => {
    res.send({
        "status": "ok",
        "db": "ok"
    })
})

app.listen(port, () => {
  console.log(`App's listening on port ${port}`)
})
