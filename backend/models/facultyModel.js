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

module.exports = {
    addRelation,
    addMultipleRelations
}