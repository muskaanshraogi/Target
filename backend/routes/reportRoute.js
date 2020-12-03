const express = require('express')
const multer = require('multer');
const router = express.Router()
const reportModel = require('./../models/reportModel');
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

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'reports')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname )
  }
})

let upload = multer({ storage: storage }).single('file')

router.post('/add/:subject/:reg_id', authenticate, (req, res, next) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            res.status(500).send({ err: err, data: null })
        } 
        else if (err) {
            console.log(err)
            res.status(500).send({ err: err, data: null })
        }
        else {
            reportModel.addReport(req.params.reg_id, req.params.subject, req.body,  (err, status, data) => {
                if(err) {
                    delete err.sql
                    res.status(status).send({ err: err, data: null })
                }
                else {
                    res.status(200).send({ err: null, data: data })
                }
            })
        }
    })
})

router.delete('/delete/:subject/:acadYear/:reg_id', authenticate, (req, res, next) => {
    reportModel.deleteReport(req.params.reg_id, req.params.subject, req.params.acadYear, (err, status, data) => {
        if(err) {
            delete err.sql
            res.status(status).send({ err: err, data: null })
        }
        else {
            res.status(200).send({ err: null, data: data })
        }
    })
})

router.get('/get/subject/:reg_id', authenticate, (req, res, next) => {
    reportModel.getSubjectReports(req.params.reg_id, (err, status, data) => {
        if(err) {
            delete err.sql
            res.status(status).send({ err: err, data: null })
        }
        else {
            res.status(200).send({ err: null, data: data })
        }
    })
})

router.get('/get/teacher/:reg_id', authenticate, (req, res, next) => {
    reportModel.getTeacherReports(req.params.reg_id, (err, status, data) => {
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