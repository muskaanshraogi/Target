const express = require("express");
const router = express.Router();
const staffModel = require("./../models/staffModel");
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

router.post("/register", (req, res, next) => {
  staffModel.registerTeacher(req.body, (err, status, data) => {
    if (err) {
      delete err.sql;
      res.status(status).send({ err: err, data: null });
    } else {
      res.status(200).send({ err: null, data: data });
    }
  });
});

router.post("/login", (req, res, next) => {
  staffModel.loginTeacher(req.body, (err, status, data) => {
    if (err) {
      delete err.sql;
      res.status(status).send({ err: err, data: null });
    } else {
      res.status(200).send({ err: null, data: data });
    }
  });
});

router.post("/update/:reg_id", authenticate, (req, res, next) => {
  staffModel.updateTeacher(req.body, req.params.reg_id, (err, status, data) => {
    if (err) {
      delete err.sql;
      res.status(status).send({ err: err, data: null });
    } else {
      res.status(200).send({ err: null, data: data });
    }
  });
});

router.delete("/delete/:teacher", authenticateAdmin, (req, res, next) => {
  staffModel.deleteTeacher(req.params.teacher, (err, status, data) => {
    if (err) {
      delete err.sql;
      res.status(status).send({ err: err, data: null });
    } else {
      res.status(200).send({ err: null, data: data });
    }
  });
});

router.get("/all", authenticateAdmin, (req, res, next) => {
  staffModel.getAllTeachers((err, status, data) => {
    if (err) {
      delete err.sql;
      res.status(status).send({ err: err, data: null });
    } else {
      res.status(200).send({ err: null, data: data });
    }
  });
});

router.get("/download", authenticate, (req, res, next) => {
  const baseURL = "./files/spreadsheet.xlsx";
  res.download(baseURL);
});

router.get("/:reg_id", authenticate, (req, res, next) => {
  staffModel.getTeacherDetails(req.params.reg_id, (err, status, data) => {
    if (err) {
      delete err.sql;
      res.status(status).send({ err: err, data: null });
    } else {
      res.status(200).send({ err: null, data: data });
    }
  });
});

module.exports = router;
