const db = require('./../dbConnection')
const xlsxFile = require('read-excel-file/node');

const calculateFinal = (subId, acadYear, callback) => {
    db.query(
        "SELECT pathName FROM report WHERE subId=? AND acadYear=?",
        [subId, acadYear],
        (err, res) => {
            if(err) {
                return callback(err, 500, null)
            }
            else {
                let countCalc = 0
                let total = res.length
                res.forEach((report) => {
                    xlsxFile(report.pathName)
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

                        db.query(
                            "UPDATE report SET ut=?, sppu=? WHERE pathName=?",
                            [ut, ua, report.pathName],
                            (err, res) => {
                                if(err) {
                                    return callback(err, 500, null)
                                }
                                else {
                                    countCalc++
                                    if(countCalc === total) {
                                        db.query(
                                            "SELECT SUM(ut) AS ut, SUM(sppu) AS sppu, COUNT(ut) AS count FROM report WHERE acadYear=? AND subId=?",
                                            [acadYear, subId],
                                            (err, res) => {
                                                if(err) {
                                                    return callback(err, 500, null)
                                                }
                                                else {
                                                    let finalUt = res[0].ut/res[0].count
                                                    let finalSppu = res[0].sppu/res[0].count
                                                    db.query(
                                                        "INSERT INTO final VALUES(?, ?, ?, ?)",
                                                        [subId, acadYear, finalUt, finalSppu],
                                                        (err, res) => {
                                                            if(err) {
                                                                return callback(err, 500, null)
                                                            }
                                                            else {
                                                                return callback(null, 200, finalUt*0.3 + finalSppu*0.7)
                                                            }
                                                        }
                                                    )
                                                }
                                            }
                                        )
                                    }
                                }
                            }
                        )
                    })
                    .catch((error) => {
                        return callback(err, 500, null)
                    })
                })
            }
        }
    )
}

const getAttainment = (reg_id, callback) => {
    db.query(
        "SELECT ut, sppu, ut*0.3+sppu*0.7 AS total FROM final WHERE subId IN (SELECT subId FROM faculty WHERE reg_id=? AND role_id=2)",
        [reg_id],
        (err, res) => {
            if(err) {
                return callback(err, 500, null)
            }
            else {
                let final = res
                db.query(
                    "SELECT faculty.division, report.ut, report.sppu, report.ut*0.3+report.sppu*0.7 AS total FROM faculty JOIN report ON faculty.reg_id=report.reg_id AND faculty.subId=report.subId WHERE report.subId IN (SELECT subId FROM faculty WHERE reg_id=? AND role_id=2)",
                    [reg_id],
                    (err, res) => {
                        if(err) {
                            return callback(err, 500, null)
                        }
                        else {
                            return callback(null, 200, { final: final[0], details: res })
                        }
                    }
                )
            }
        }
    )
}

module.exports = {
    calculateFinal,
    getAttainment
}