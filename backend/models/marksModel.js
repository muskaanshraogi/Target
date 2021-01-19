const db = require('./../dbConnection')

const generateRoll = (div) => {
    let roll = ''

    if(div.slice(0, 2) === 'SE')
        roll = '2'
    else if(div.slice(0, 2) === 'TE')
        roll = '3'
    else if(div.slice(0, 2) === 'BE')
        roll = '4'

    roll += '3'

    if(div.slice(2,4) === '09')
        roll += '1'
    else if(div.slice(2,4) === '10')
        roll += '2'
    else if(div.slice(2,4) === '11')
        roll += '3'
    
    roll += '01'

    return roll
}

const addMarks = (marks, subId, callback) => {
    db.query(
        "DELETE FROM marks WHERE subId=?",
        [subId],
        (err, res) => {
            if(err) {
                return callback(err, 500, null)
            }
            else {
                db.query(
                    "INSERT INTO marks VALUES ?",
                    [
                        cols,
                        marks.map(entry => 
                            [entry.roll_no, entry.co1, entry.co2, entry.co3, entry.co4, entry.co5, entry.co6, entry.sppu, subId]
                        )
                    ],
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

const deleteMarks = (div, subId, callback) => {
    let roll = generateRoll(div)

    db.query(
        "DELETE FROM marks WHERE subId=? AND (roll_no BETWEEN ? AND ?)",
        [subId, parseInt(roll), parseInt(roll)+90],
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

const getMarks = (div, subId, callback) => {
    let roll = generateRoll(div)

    db.query(
        "SELECT * FROM marks WHERE subId=? AND (roll_no BETWEEN ? AND ?)",
        [subId, parseInt(roll), parseInt(roll)+90],
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

module.exports = {
    addMarks,
    deleteMarks,
    getMarks
}