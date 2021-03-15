const mysql = require('mysql')
const dotenv = require('dotenv')

dotenv.config()

let PASSWORD = process.env.PASSWORD || ''
const connection = mysql.createConnection({
    host: 'localhost',
    user: "root",
    password: "tanelon1234",
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