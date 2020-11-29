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
                    "INSERT INTO report(reg_id, subId, submittedOn, acadYear, pathName) VALUES (?, ?, ?, ?, ?)",
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

const getSubjectReports = (reg_id, callback) => {
    db.query(
        "SELECT * FROM report WHERE subId IN (SELECT subId FROM FACULTY WHERE reg_id=? AND role_id=2)",
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

const getTeacherReports = (reg_id, callback) => {
    db.query(
        "SELECT * FROM report WHERE reg_id=?",
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

module.exports = {
    addReport,
    deleteReport,
    getSubjectReports,
    getTeacherReports
}