const express = require("express");
const router = express.Router();
const subjectModel = require("./../models/subjectModel");
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

router.post("/add", authenticateAdmin, (req, res, next) => {
  subjectModel.addSubject(req.body, (err, status, data) => {
    if (err) {
      console.log(err);
      delete err.sql;
      res.status(status).send({ err: err, data: null });
    } else {
      res.status(200).send({ err: null, data: data });
    }
  });
});

router.post("/add/multiple", authenticateAdmin, (req, res, next) => {
  subjectModel.addMultipleSubjects(req.body, (err, status, data) => {
    if (err) {
      delete err.sql;
      res.status(status).send({ err: err, data: null });
    } else {
      res.status(200).send({ err: null, data: data });
    }
  });
});

router.post("/update/:subId/:acadYear", authenticateAdmin, (req, res, next) => {
  subjectModel.updateSubject(
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
  "/delete/:subId/:acadYear",
  authenticateAdmin,
  (req, res, next) => {
    subjectModel.deleteSubject(
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

router.get("/all", authenticate, (req, res, next) => {
  subjectModel.getAllSubjects((err, status, data) => {
    if (err) {
      delete err.sql;
      res.status(status).send({ err: err, data: null });
    } else {
      res.status(200).send({ err: null, data: data });
    }
  });
});

router.get("/teacher/:reg_id", authenticate, (req, res, next) => {
  subjectModel.getTeacherSubjects(req.params.reg_id, (err, status, data) => {
    if (err) {
      delete err.sql;
      res.status(status).send({ err: err, data: null });
    } else {
      res.status(200).send({ err: null, data: data });
    }
  });
});

router.post("/set/total/:subject/:acadYear", authenticate, (req, res, next) => {
  subjectModel.setTotalMarks(
    req.params.subject,
    req.params.acadYear,
    req.body,
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
  "/set/target/:subject/:acadYear",
  authenticate,
  (req, res, next) => {
    subjectModel.setTarget(
      req.params.subject,
      req.params.acadYear,
      req.body,
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

router.get("/get/total/:subject/:acadYear", authenticate, (req, res, next) => {
  subjectModel.getTotalMarks(
    req.params.subject,
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

router.get("/get/target/:subject/:acadYear", authenticate, (req, res, next) => {
  subjectModel.getTarget(
    req.params.subject,
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
