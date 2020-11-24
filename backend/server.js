const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')

let app = express()

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/staff', require('./routes/staffRoute'))

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Server up on port ${PORT}`)
})
