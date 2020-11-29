const db = require('./../dbConnection')
const xlsxFile = require('read-excel-file/node');

const calculateFinal = (subId, callback) => {
    xlsxFile('1.xlsx')
    .then((rows) => {
        let count = [0, 0, 0, 0, 0, 0, 0]
        let lc = [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]]
        let i = 0, j = 0
        console.log(rows[5][0])
        for(let i = 3; i < rows.length; i++)
        {
            for(let j=1; j < 8; j++) 
            {
                if(!isNaN(rows[i][j]))
                {
                    count[j-1]++
                    if(rows[i][j] >= 4)
                        lc[0][j-1]++
                    if(rows[i][j] >= 6)
                        lc[1][j-1]++
                    if(rows[i][j] >= 6.6)
                        lc[2][j-1]++
                }
            }
        }
        console.table(lc)
    })
    .catch((error) => {
        console.log(error)
    })
}

module.exports = {
    calculateFinal
}