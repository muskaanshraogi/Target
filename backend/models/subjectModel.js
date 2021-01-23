const db = require('./../dbConnection')

const addSubject = (subject, callback) => {
    db.query(
        "INSERT INTO subject VALUES(?, ?, ?)",
        [subject.subId, subject.subName, subject.year],
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

const addMultipleSubjects = (data, callback) => {
    let count = 0
    data.subjects.forEach((subject) => {
        db.query(
            "INSERT INTO subject VALUES(?, ?, ?)",
            [subject.subId, subject.subName, subject.year],
            (err, res) => {
                if(err) {
                    return callback(err, 500, null)
                }
                else {
                    count++
                    if(count === data.subjects.length) {
                        return callback(null, 201, true)
                    }
                }
            }
        )
    })
}

const updateSubject = (subject, code, callback) => {
    db.query(
        "UPDATE subject SET subName=?, year=? WHERE subId=?",
        [subject.subName, subject.year, code],
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

const deleteSubject = (subject, callback) => {
    db.query(
        "DELETE FROM subject WHERE subId=?",
        [subject],
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

const getAllSubjects = (callback) => {
    db.query(
        "SELECT * FROM subject",
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

const getTeacherSubjects = (reg_id, callback) => {
    db.query(
        "SELECT subject.subId, subject.subName, faculty.division, subject.year, faculty.role_id FROM subject JOIN faculty ON subject.subId=faculty.subId WHERE subject.subId IN (SELECT subId FROM faculty WHERE reg_id=?) AND faculty.reg_id=?",
        [reg_id, reg_id],
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

const setTotalMarks = (subId, marks, callback) => {
    db.query(
        "UPDATE subject SET tco1=?, tco2=?, tco3=?, tco4=?, tco5=?, tco6=?, tsppu=? WHERE subId=?",
        [marks.tco1, marks.tco2, marks.tco3, marks.tco4, marks.tco5, marks.tco6, marks.sppu, subId],
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

const setTarget = (subId, target, callback) => {
    db.query(
        "UPDATE subject SET mt1=?, mt2=?, mt3=?, sppu1=?, sppu2=?, sppu3=? WHERE subId=?",
        [target.mt1, target.mt2, target.mt3, target.sppu1, target.sppu2, target.sppu3, subId],
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

const getTotalMarks = (subId, callback) => {
    db.query(
        "SELECT tco1, tco2, tco3, tco4, tco5, tco6, tsppu FROM subject WHERE subId=?",
        [subId],
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

const getTarget = (subId, callback) => {
    db.query(
        "SELECT mt1, mt2, mt3, sppu1, sppu2, sppu3 FROM subject WHERE subId=?",
        [subId],
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
    addSubject,
    addMultipleSubjects,
    updateSubject,
    deleteSubject,
    getAllSubjects,
    getTeacherSubjects,
    setTotalMarks,
    setTarget,
    getTarget,
    getTotalMarks
}