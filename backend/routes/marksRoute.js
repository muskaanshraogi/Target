const express = require("express");
const router = express.Router();
const marksModel = require("./../models/marksModel");
const { authenticate, authenticateAdmin } = require("../globals");

router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Methods", "PUT, OPTIONS, GET, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, X-Access-Token, X-Key, Authorization"
  );
  next();
});

router.post("/add/:subId/:acadYear", authenticate, (req, res, next) => {
  marksModel.addMarks(
    req.body,
    req.params.subId,
    req.params.acadYear,
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

router.delete(
  "/delete/:div/:subId/:acadYear",
  authenticate,
  (req, res, next) => {
    marksModel.deleteMarks(
      req.params.div,
      req.params.subId,
      req.params.acadYear,
      (err, status, data) => {
        if (err) {
          delete err.sql;
          res.status(status).send({ err: err, data: null });
        } else {
          res.status(200).send({ err: null, data: data });
        }
      }
    );
  }
);

router.get("/get/:div/:subId/:acadYear", authenticate, (req, res, next) => {
  marksModel.getMarks(
    req.params.div,
    req.params.subId,
    req.params.acadYear,
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

router.post(
  "/submit/:subId/:division/:acadYear",
  authenticate,
  (req, res, next) => {
    marksModel.addMarks(
      req.body,
      req.params.subId,
      req.params.acadYear,
      (err, status, data) => {
        if (err) {
          delete err.sql;
          res.status(status).send({ err: err, data: null });
        } else {
          marksModel.submitMarks(
            req.params.subId,
            req.params.division,
            req.params.acadYear,
            (err, status, data) => {
              if (err) {
                delete err.sql;
                res.status(status).send({ err: err, data: null });
              } else {
                res.status(200).send({ err: null, data: data });
              }
            }
          );
        }
      }
    );
  }
);

router.get(
  "/submit/:subId/:division/:acadYear",
  authenticate,
  (req, res, next) => {
    marksModel.checkSubmitted(
      req.params.subId,
      req.params.division,
      req.params.acadYear,
      (err, status, data) => {
        if (err) {
          delete err.sql;
          res.status(status).send({ err: err, data: null });
        } else {
          res.status(200).send({ err: null, data: data });
        }
      }
    );
  }
);

router.get("/submit/:subId/:acadYear", authenticate, (req, res, next) => {
  marksModel.checkSubmittedSubject(
    req.params.subId,
    req.params.acadYear,
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

module.exports = router;
