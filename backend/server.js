const express = require('express')
const path = require('path')
const mysql = require('mysql')
const dotenv = require('dotenv')

dotenv.config()

let app = express()

let PASSWORD = process.env.PASSWORD || ''
const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.USER,
    password: PASSWORD,
})

connection.connect((error) => {
    if(error) {
        console.log(error)
    }
    else {
        console.log('Connected to MySQL...')
    }
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Server up on port ${PORT}`)
})