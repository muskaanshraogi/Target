const mysql = require('mysql')
const dotenv = require('dotenv')

dotenv.config()

let PASSWORD = process.env.PASSWORD || ''
const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.USER,
    password: PASSWORD,
    database: 'target'
})

connection.connect((error) => {
    if(error) {
        console.log(error)
    }
    else {
        console.log('Connected to MySQL...')
    }
})

module.exports = connection;