const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')

let app = express()

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/staff', require('./routes/staffRoute'))
app.use('/api/subject', require('./routes/subjectRoute'))
app.use('/api/faculty', require('./routes/facultyRoute'))
app.use('/api/report', require('./routes/reportRoute'))
app.use('/api/final', require('./routes/finalRoute'))

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Server up on port ${PORT}`)
})
