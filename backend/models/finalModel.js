const db = require('./../dbConnection')
const xlsxFile = require('read-excel-file/node');
const marksModel = require('./marksModel');

const calculateFinal = (subId, callback) => {
    db.query(
        "SELECT tco1, tco2, tco3, tco4, tco5, tco6, tsppu, mt1, mt2, mt3, sppu1, sppu2, sppu3 FROM subject WHERE subId=?",
        [subId],
        (err, values) => {
            if(err) {
                return callback(err, 500, null)
            }
            else {
                db.query(
                    "SELECT * FROM marks WHERE subId=?",
                    [subId],
                    (err, res) => {
                        if(err) {
                            return callback(err, 500, null)
                        }
                        else {
                            let countCalc = 0
                            let students = [0, 0, 0, 0, 0, 0, res.length]
                            let maxMarks = [
                                values[0].tco1, 
                                values[0].tco2, 
                                values[0].tco3, 
                                values[0].tco4, 
                                values[0].tco5, 
                                values[0].tco6, 
                                values[0].tsppu
                            ]
                            let target = [
                                [values[0].mt1, values[0].mt2, values[0].mt3],
                                [values[0].sppu1, values[0].sppu2, values[0].sppu3],
                            ]
                            let lc = [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]]
                            let rows =  []

                            res.forEach((student) => {
                                let row = [student.co1, student.co2, student.co3, student.co4, student.co5, student.co6, student.sppu]
                                rows.push(row) 
                            })

                            for(let i=0; i<res.length; i++)
                            {
                                for(let j=0; j<7; j++)
                                {
                                    if(!isNaN(rows[i][j]))
                                    {
                                        students[j]++
                                        if(rows[i][j] >= 0.4*maxMarks[j])
                                            lc[0][j]++
                                        if(rows[i][j] >= 0.6*maxMarks[j])
                                            lc[1][j]++
                                        if(rows[i][j] >= 0.66*maxMarks[j])
                                            lc[2][j]++
                                    }
                                }
                            }

                            let k = 2
                            for(let i=0; i<3; i++)
                            {
                                for(let j=0; j<6; j++)
                                {
                                    lc[i][j] = ((lc[i][j]*100/students[j])/target[0][k]) * (i+1)
                                    lc[i][j] = lc[i][j] >= i+1 ? i+1 : lc[i][j]
                                }
                                lc[i][6] = ((lc[i][6]*100/students[6])/target[1][k]) * (i+1)
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
                                "INSERT INTO final VALUES(?, ?, ?)",
                                [subId, ut, ua],
                                (err, res) => {
                                    if(err) {
                                        return callback(err, 500, null)
                                    }
                                    else {
                                        return callback(null, 200, att)
                                    }
                                }
                            )
                        }
                    }
                )
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
                return callback(null, 200, res)
            }
        }
    )
}

const getAttainments = (callback) => {
    db.query(
        "SELECT s.subName, s.subId, f.ut, f.sppu, f.ut*0.3+f.sppu*0.7 AS total FROM final AS f JOIN subject AS s ON s.subId=f.subId",
        (err, res) => {
            if(err) {
                return callback(err, 500, null)
            }
            else {
                return callback(null, 200, res)
            }
        }
    )
}

const resetDB = (callback) => {
    db.query(
        "DELETE FROM staff",
        (err, res) => {
            if(err) {
                return callback(err, 500, null)
            }
            else {
                db.query(
                    "DELETE FROM subject",
                    (err, res) => {
                        if(err) {
                            return callback(err, 500, null)
                        }
                        else {
                            return callback(null, 200, true)
                        }
                    }
                )
            }
        }
    )
}

module.exports = {
    calculateFinal,
    getAttainment,
    getAttainments,
    resetDB
}