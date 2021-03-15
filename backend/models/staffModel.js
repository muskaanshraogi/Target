const bcrypt = require('bcryptjs')
const db = require('./../dbConnection')
const { generateToken } = require('../globals')

const registerTeacher = (teacher, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(teacher.password, salt, (err, hash) => {
            if(err) {
                return callback(err, 500, null)
            }
            else {
                let password = hash
                db.query(
                    "INSERT INTO staff VALUES(?, ?, ?, ?, ?, ?)",
                    [teacher.firstName, teacher.lastName, teacher.reg_id, teacher.email, teacher.is_admin, password], 
                    (err, data) => {
                        if(err) {
                            return callback(err, 400, null)
                        }
                        else {
                            if(data) {
                                let count = 0
                                teacher.mobile.forEach((num) => {
                                    db.query(
                                        "INSERT INTO mobile VALUES(?, ?)",
                                        [teacher.reg_id, num]
                                    )
                                    if(err) {
                                        return callback(err, 500, null)
                                    }
                                    else {
                                        count++
                                        if(count === teacher.mobile.length) {
                                            db.query(
                                                "SELECT reg_id, firstName, lastName, email, is_admin FROM staff where reg_id=?",
                                                [teacher.reg_id],
                                                (err, user) => {
                                                    if(err) {
                                                        return callback(err, 500, null)
                                                    }
                                                    else {
                                                        return callback(null, 201, generateToken(user[0]))
                                                    }
                                                }
                                            )
                                        }
                                    }
                                })
                            }
                        }
                    })
            }
        })
    })
}

const loginTeacher = (teacher, callback) => {
    db.query(
        "SELECT * FROM staff WHERE email=?",
        [teacher.email],
        (err, user) => {
            if(err) {
                return callback(err, 500, null)
            }
            else {
                if(!user.length) {
                    return callback('User not found', 404, null)
                }
                else {
                    bcrypt.compare(teacher.password, user[0].password, (err, res) => {
                        if(err) {
                            return callback(err, 400, null)
                        }
                        else {
                            if(res) {
                                return callback(null, 200, generateToken(user[0]))
                            }
                            else {
                                return callback(err, 400, null)
                            }
                        }
                    })
                }
            }
        }
    )
}

const updateTeacher = (teacher, reg_id, callback) => {
    db.query(
        "UPDATE staff SET firstName=?, lastName=?, email=? WHERE reg_id=?",
        [teacher.firstName, teacher.lastName, teacher.email, reg_id],
        (err, user) => {
            if(err) {
                return callback(err, 500, null)
            }
            else {   
                return callback(null, 200, true)        
            }
        }
    )
}

const deleteTeacher = (teacher, callback) => {
    db.query(
        "DELETE FROM staff WHERE reg_id=?",
        [teacher],
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

const getAllTeachers = (callback) => {
    db.query(
        "SELECT firstName, lastName, email, reg_id, is_admin FROM staff",
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

const getTeacherDetails = (reg_id, callback) => {
    db.query(
        "SELECT staff.firstName, staff.lastName, staff.email, staff.is_admin, staff.reg_id, faculty.division, role.roleName, subject.subId, subject.acadYear, subject.subName, subject.year FROM staff LEFT OUTER JOIN faculty ON staff.reg_id=faculty.reg_id LEFT OUTER JOIN role  ON faculty.role_id=role.role_id LEFT OUTER JOIN subject ON faculty.subId=subject.subId AND faculty.acadYear=subject.acadYear WHERE staff.reg_id=?",
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

const adminStatus = (status, reg_id, callback) => {
    let admin = status === 'true' ? 1 : 0

    db.query(
        "UPDATE staff SET is_admin=? WHERE reg_id=?",
        [admin, reg_id],
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
    registerTeacher,
    loginTeacher,
    updateTeacher,
    deleteTeacher,
    getAllTeachers,
    getTeacherDetails,
    adminStatus
}
