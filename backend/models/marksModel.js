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

const addMarks = (data, subId, acadYear, callback) => {
    db.query(
        "DELETE FROM marks WHERE subId=? AND (roll_no BETWEEN ? AND ?) AND acadYear=?",
        [subId, data.marks[0].roll_no, data.marks[0].roll_no+90, acadYear],
        (err, res) => {
            if(err) {
                return callback(err, 500, null)
            }
            else {
                db.query(
                    "INSERT INTO marks VALUES ?",
                    [
                        data.marks.map(entry => 
                            [entry.roll_no, entry.co1, entry.co2, entry.co3, entry.co4, entry.co5, entry.co6, entry.sppu, subId, acadYear]
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

const deleteMarks = (div, subId, acadYear, callback) => {
    let roll = generateRoll(div)

    db.query(
        "DELETE FROM marks WHERE subId=? AND (roll_no BETWEEN ? AND ?) AND acadYear=?",
        [subId, parseInt(roll), parseInt(roll)+90, acadYear],
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

const getMarks = (div, subId, acadYear, callback) => {
    let roll = generateRoll(div)

    db.query(
        "SELECT * FROM marks WHERE subId=? AND (roll_no BETWEEN ? AND ?) AND acadYear=?",
        [subId, parseInt(roll), parseInt(roll)+90, acadYear],
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

const submitMarks = (subId, division, acadYear, callback) => {
    console.log(subId, division, acadYear)
    db.query(
        "UPDATE faculty SET submitted=1 WHERE subId=? AND division=? AND acadYear=?",
        [subId, division, acadYear],
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


const checkSubmitted = (subId, division, acadYear, callback) => {
    db.query(
        "SELECT submitted FROM faculty WHERE subId=? AND division=? AND acadYear=?",
        [subId, division, acadYear],
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

const checkSubmittedSubject = (subId, acadYear, callback) => {
    db.query(
        "SELECT division, submitted FROM faculty WHERE subId=? AND acadYear=?",
        [subId, acadYear],
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
    getMarks,
    submitMarks,
    checkSubmitted,
    checkSubmittedSubject
}