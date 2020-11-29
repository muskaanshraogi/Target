const db = require('./../dbConnection')
const xlsxFile = require('read-excel-file/node');

const calculateFinal = (subId, callback) => {
    xlsxFile('1.xlsx')
    .then((rows) => {
        let count = [0, 0, 0, 0, 0, 0, 0]
        let max = [0, 0, 0, 0, 0, 0, 100]
        let lc = [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]]
        
        for(let j=1; j<7; j++) 
        {
            max[j-1] = rows[1][j]
        }

        for(let i = 3; i < rows.length; i++)
        {
            for(let j=1; j < 8; j++) 
            {
                if(!isNaN(rows[i][j]))
                {
                    count[j-1]++
                    if(rows[i][j] >= 0.4*max[j-1])
                        lc[0][j-1]++
                    if(rows[i][j] >= 0.6*max[j-1])
                        lc[1][j-1]++
                    if(rows[i][j] >= 0.66*max[j-1])
                        lc[2][j-1]++
                }
            }
        }
        count[6] = rows.length - 3
        
        let k = 5
        for(let i=0; i<3; i++)
        {
            for(let j=0; j<6; j++)
            {
                lc[i][j] = ((lc[i][j]*100/count[j])/rows[k][9]) * (i+1)
                lc[i][j] = lc[i][j] >= i+1 ? i+1 : lc[i][j]
            }
            lc[i][6] = ((lc[i][6]*100/count[6])/rows[k][10]) * (i+1)
            lc[i][6] = lc[i][6] >= i+1 ? i+1 : lc[i][6]
            k--
        }

        let ut_co = []
        let ut = 0
        for(let i=0; i<6; i++)
        {
            ut_co[i] = (lc[0][i]+lc[1][i]+lc[2][i])/6 
            ut += ut_co[i]
        }
        ut /= 6
        let ua = (lc[0][6]+lc[1][6]+lc[2][6])/6 
        let att = 0.7*ua + 0.3*ut
        console.log(att)
    })
    .catch((error) => {
        console.log(error)
    })
}

module.exports = {
    calculateFinal
}