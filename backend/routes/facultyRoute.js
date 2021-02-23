const express = require("express");
const router = express.Router();
const facultyModel = require("./../models/facultyModel");
const { authenticate, authenticateAdmin } = require("../globals");

router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, OPTIONS, GET, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, X-Access-Token, X-Key, Authorization"
  );
  next();
});

router.post("/add/:reg_id", authenticate, (req, res, next) => {
  facultyModel.addRelation(req.body, req.params.reg_id, (err, status, data) => {
    if (err) {
      delete err.sql;
      res.status(status).send({ err: err, data: null });
    } else {
      res.status(200).send({ err: null, data: data });
    }
  });
});

router.post("/add/multiple/:reg_id", authenticate, (req, res, next) => {
  facultyModel.addMultipleRelations(
    req.body,
    req.params.reg_id,
    (err, status, data) => {
      if (err) {
        console.log(err);
        delete err.sql;
        res.status(status).send({ err: err, data: null });
      } else {
        res.status(200).send({ err: null, data: data });
      }
    }
  );
});

router.post("/delete/:reg_id", authenticate, (req, res, next) => {
  facultyModel.deleteRelation(
    req.body,
    req.params.reg_id,
    (err, status, data) => {
      if (err) {
        delete err.sql;
        res.status(status).send({ err: err, data: null });
      } else {
        res.status(200).send({ err: null, data: data });
      }
    }
  );
});

router.get("/subject/teacher/:reg_id", authenticate, (req, res, next) => {
  facultyModel.getSubjectTeacherDetails(
    req.params.reg_id,
    (err, status, data) => {
      if (err) {
        delete err.sql;
        res.status(status).send({ err: err, data: null });
      } else {
        res.status(200).send({ err: null, data: data });
      }
    }
  );
});

router.post("/email/:teacher/:coordinator", authenticate, (req, res, next) => {
  facultyModel.sendMail(
    req.params.teacher,
    req.params.coordinator,
    (err, status, data) => {
      if (err) {
        delete err.sql;
        console.log(err);
        res.status(status).send({ err: err, data: null });
      } else {
        res.status(200).send({ err: null, data: data });
      }
    }
  );
});

module.exports = router;
