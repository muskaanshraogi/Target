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
        "SELECT subject.subId, subject.subName, subject.year, faculty.role_id FROM subject JOIN faculty WHERE subId IN (SELECT subId FROM faculty WHERE reg_id=?)",
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
    addSubject,
    addMultipleSubjects,
    updateSubject,
    deleteSubject,
    getAllSubjects,
    getTeacherSubjects
}