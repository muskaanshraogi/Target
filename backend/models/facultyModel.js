const db = require("./../dbConnection");
const { mailer } = require("./../mailer/mail");

const addRelation = (relation, teacher, callback) => {
  db.query(
    "CALL teacher_subject(?, ?, ?, ?, ?)",
    [
      teacher,
      relation.subject,
      relation.role,
      relation.division,
      relation.acadYear,
    ],
    (err, res) => {
      if (err) {
        return callback(err, 500, null);
      } else {
        return callback(null, 201, res);
      }
    }
  );
};

const addMultipleRelations = (data, teacher, callback) => {
  let count = 0;
  let err = false;
  let er
  data.relations.forEach((relation) => {
    db.query(
      "CALL teacher_subject(?, ?, ?, ?, ?)",
      [
        teacher,
        relation.subject,
        relation.role,
        relation.division,
        relation.acadYear,
      ],
      (err, res) => {
        count++
        if (err) {
          error = true
          er = err
        } 

        if (count === data.relations.length) {
          if(error) {
            return callback(er, 500, null);
          }
          else {
            return callback(null, 201, res);
          }
        }
      }
    );
  });
};

const deleteRelation = (relation, teacher, callback) => {
  db.query(
    "CALL relation_delete(?, ?, ?, ?)",
    [teacher, relation.subject, relation.division, relation.acadYear],
    (err, res) => {
      if (err) {
        return callback(err, 500, null);
      } else {
        return callback(null, 200, res);
      }
    }
  );
};

const getSubjectTeacherDetails = (subId, acadYear, callback) => {
  db.query(
    "SELECT subject.subId, subject.subName, subject.year, subject.acadYear, staff.firstName, staff.lastName, role.roleName, faculty.division, faculty.reg_id, faculty.submitted FROM faculty JOIN staff JOIN role JOIN subject ON faculty.reg_id=staff.reg_id AND faculty.role_id=role.role_id AND faculty.subId=subject.subId AND faculty.acadYear=subject.acadYear WHERE faculty.subId=? AND faculty.acadYear=?",
    [subId, acadYear],
    (err, res) => {
      if (err) {
        return callback(err, 500, null);
      } else {
        return callback(null, 200, res);
      }
    }
  );
};

const checkCoordinator = (reg_id, callback) => {
  db.query(
    "SELECT subject.subId, subject.subName, subject.acadYear, subject.year FROM faculty JOIN subject ON faculty.subId=subject.subId AND faculty.acadYear=subject.acadYear WHERE faculty.reg_id=? AND faculty.role_id=2",
    [reg_id],
    (err, res) => {
      if (err) {
        return callback(err, 500, null);
      } else {
        return callback(null, 200, res);
      }
    }
  );
};

const sendMail = (teacher, coordinator, callback) => {
  db.query(
    "SELECT subId FROM faculty WHERE reg_id=? AND role_id=2",
    [coordinator],
    (err, res) => {
      if (err) {
        return callback(err, 500, null);
      } else {
        let subId = res[0].subId;
        db.query(
          "SELECT subName FROM subject WHERE subId=?",
          [subId],
          (err, res) => {
            let subject = res[0].subName;

            db.query(
              "SELECT firstName, lastName, email FROM staff WHERE reg_id=?",
              [teacher],
              (err, res) => {
                if (err) {
                  return callback(err, 500, null);
                } else {
                  let staff = res[0];
                  db.query(
                    "SELECT division FROM faculty WHERE reg_id=? AND subId=?",
                    [teacher, subId],
                    (err, res) => {
                      if (err) {
                        return callback(err, 500, null);
                      } else {
                        mailer(
                          staff.email,
                          subject,
                          res[0].division,
                          staff.firstName + " " + staff.lastName
                        )
                          .then((res) => {
                            return callback(null, 200, true);
                          })
                          .catch((err) => {
                            return callback(err, 500, null);
                          });
                      }
                    }
                  );
                }
              }
            );
          }
        );
      }
    }
  );
};

module.exports = {
  addRelation,
  addMultipleRelations,
  deleteRelation,
  getSubjectTeacherDetails,
  sendMail,
  checkCoordinator
};
