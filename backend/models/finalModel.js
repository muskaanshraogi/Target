const db = require('./../dbConnection')
const xlsxFile = require('read-excel-file/node');

const calculateFinal = (subId, callback) => {
    xlsxFile('1.xlsx')
    .then((rows) => {
        console.table(rows[0][0]);
        console.table(rows);
    })
    .catch((error) => {
        console.log(error)
    })
}

module.exports = {
    calculateFinal
}