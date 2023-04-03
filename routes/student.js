var express = require('express');
var router = express.Router();
var fs = require("fs");
var studentController = require('../Helpers/studentHelper/Student')
var adminAuth = require('../Helpers/adminHelper/adminAuth');
var studentMonitor = require('../Helpers/studentHelper/monitorFunctions');
const { log } = require('console');
const { response } = require('../app');

const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    username = req.session.user.username,
    candidatecode = req.session.user.candidateCode
    next()
  } else {
    res.redirect('/student/login')
  }
}

/* GET users listing. */
router.get('/', verifyLogin, (req, res) => {
  console.log(candidatecode)
  res.render('student/home', { student: true ,candidatecode})
});


router.get('/upl-assignment/', verifyLogin, (req, res) => {
  res.render("student/add-assignments")
})
  ;
router.post("/upl-assignment/:id", (req, res) => {
  id = req.params.id
  console.log(req.body);

  studentController.uploadAssignment(req.body, id).then((response) => {
    console.log(response);
    res.redirect('/student/assignment-status')
  })
}),

  router.get("/Assignment-status/", verifyLogin, (req, res) => {
    userID = req.params.id
    studentController.assignmentStatus(userID).then((AssignmentData) => {
      ;
      res.render("student/assignment-status", { Assignmentdata: AssignmentData })
    })
  })

//GET admin login form
//route admin/login
router.get('/login', (req, res) => {
  res.render('admin/login.hbs')
});

//POST admin login submint
//route admin/login
router.post('/login', (req, res) => {
  req.body.type = 3
  adminAuth.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true
      req.session.user = response.user
      res.redirect('/student')
    }
    else {
      req.session.loginError = true
      res.redirect('/student/login')
    }
  })

})


//GET monitor attendance
router.get('/attendance/:id', (req, res) => {
  console.log(req.params.id);
  studentMonitor.monitorAttendance(req.params.id).then((attendanceRecord) => {
    console.log(attendanceRecord)
    var percent = attendanceRecord.no_present/attendanceRecord.total  * 100;
    var color;
    if(percent >= 75) color = "bg-success";
    else if (percent <75 && percent >= 65) color = "bg-warning";
    else color = "bg-danger";

    var percentdata = {
      percent : percent,
      color : color
    }
    
    res.render('student/attendance-monitor',{attendanceRecord, percentdata, student: true})
  })
})
module.exports = router;
