const db = require('./../dbConnection')

const addReport = (reg_id, subject, report, callback) => {
    db.query(
        "SELECT subId FROM subject WHERE subName=?",
        [subject],
        (err, res) => {
            if(err) {
                return callback(err, 500, null)
            }
            else {
                db.query(
                    "INSERT INTO report VALUES (?, ?, ?, ?, ?)",
                    [reg_id, res[0].subId, report.submittedOn, report.acadYear, report.path],
                    (err, res) => {
                        if(err) {
                            return callback(err, 500, null)
                        }
                        else {
                            return callback(null, 201, res)
                        }
                    }
                )
            }
        }
    )
}

const deleteReport = (reg_id, subject, acadYear, callback) => {
    db.query(
        "SELECT subId FROM subject WHERE subName=?",
        [subject],
        (err, res) => {
            if(err) {
                return callback(err, 500, null)
            }
            else {
                db.query(
                    "DELETE FROM report WHERE reg_id=? AND subId=? AND acadYear=?",
                    [reg_id, res[0].subId, acadYear],
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
        }
    )
    
}

module.exports = {
    addReport,
    deleteReport
}