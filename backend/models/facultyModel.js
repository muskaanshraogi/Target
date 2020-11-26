const db = require('./../dbConnection')

const addRelation = (relation, teacher, callback) => {
    db.query(
        "CALL teacher_subject(?, ?, ?, ?)",
        [teacher, relation.subject, relation.role, relation.division],
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

const addMultipleRelations = (data, teacher, callback) => {
    let count = 0
    data.relations.forEach((relation) => {
        db.query(
            "CALL teacher_subject(?, ?, ?, ?)",
            [teacher, relation.subject, relation.role, relation.division],
            (err, res) => {
                if(err) {
                    return callback(err, 500, null)
                }
                else {
                    count++
                    
                    if(count === data.relations.length) {
                        return callback(null, 201, res)
                    }
                }
            }
        )
    })
}

const deleteRelation = (relation, teacher, callback) => {
    db.query(
        "CALL relation_delete(?, ?, ?)",
        [teacher, relation.subject, relation.division],
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

const getSubjectTeacherDetails = (reg_id, callback) => {
    db.query(
        "SELECT subject.subName, subject.year, staff.firstName, staff.lastName, role.roleName, faculty.division FROM faculty JOIN staff JOIN role JOIN subject ON faculty.reg_id=staff.reg_id AND faculty.role_id=role.role_id AND faculty.subId=subject.subId WHERE faculty.subId IN (SELECT subId FROM faculty WHERE reg_id=? AND role_id=2)",
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
    addRelation,
    addMultipleRelations,
    deleteRelation,
    getSubjectTeacherDetails
}