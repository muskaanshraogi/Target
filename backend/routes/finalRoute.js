const express = require('express')
const router = express.Router()
const finalModel = require('../models/finalModel');
const { authenticate, authenticateAdmin } = require('../globals');

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT, OPTIONS, GET, POST, DELETE");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, X-Access-Token, X-Key, Authorization"
    );
    next();
});

router.get('/calculate/:subject/:acadYear', authenticate, (req, res, next) => {
  finalModel.calculateFinal(req.params.subject, req.params.acadYear, (err, status, data) => {
      if(err) {
          delete err.sql
          res.status(status).send({ err: err, data: null })
      }
      else {
          res.status(200).send({ err: null, data: data })
      }
  })
})

router.get('/attainment/:reg_id', authenticate, (req, res, next) => {
  finalModel.getAttainment(req.params.reg_id, (err, status, data) => {
      if(err) {
          delete err.sql
          res.status(status).send({ err: err, data: null })
      }
      else {
          res.status(200).send({ err: null, data: data })
      }
  })
})

module.exports = router