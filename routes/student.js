var express = require('express');
var router = express.Router();
var fs = require("fs");
var studentController = require('../Helpers/studentHelper/studentStaffmiddleware')
var adminAuth = require('../Helpers/adminHelper/adminAuth');
var studentMonitor = require('../Helpers/studentHelper/monitorFunctions');
const { log } = require('console');
const { response } = require('../app');
var subjectController = require('../Helpers/adminHelper/subjectHelper');
var syllabusController = require('../Helpers/staffHelper/fetchSyllabus');
const { resolve } = require('path');

const verifyLogin = (req, res, next) => {
  req.session.loginError = false
  if (req.session.loggedIn) {
    username = req.session.user.Name,
    candidatecode = req.session.user.candidateCode,
    deptId = req.session.user.Dept_Id;
    next()
  } else {
    res.redirect('/student/login',{student: true})
  }
}

/* GET users listing. */
router.get('/', verifyLogin, async(req, res) => {
  var attendanceRecord = await studentMonitor.monitorAttendance(candidatecode);
  var assigment = await studentMonitor.getAssignment(deptId,req.session.user.Semester);
  var percent = attendanceRecord.no_present/attendanceRecord.total  * 100;
  percent = Number((percent).toFixed(1));
    var color;
    if(percent >= 75) color = "success";
    else if (percent <75 && percent >= 65) color = "warning";
    else color = "danger";
    
    var percentdata = {
      percent : percent,
      color : color
    }
  res.render('student/home', { student: true ,candidatecode , username, percentdata,attendanceRecord, 'assignment':assigment.length})
});


//GET admin login form
//route admin/login
router.get('/login', (req, res) => {
  res.render('admin/login',{'logerr':req.session.loginError,student: true})
});

//POST admin login submint
//route admin/login
router.post('/login', (req, res) => {
  req.body.type = 3
  adminAuth.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loginError = false
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
  studentMonitor.monitorAttendance(req.params.id).then((attendanceRecord) => {
    var percent = attendanceRecord.no_present/attendanceRecord.total  * 100;
    var color;
    if(percent >= 75) color = "bg-success";
    else if (percent <75 && percent >= 65) color = "bg-warning";
    else color = "bg-danger";

    var percentdata = {
      percent : percent,
      color : color
    }
    // res.send(attendanceRecord)
    res.render('student/attendance-monitor',{attendanceRecord, percentdata, student: true})
  })
})


router.get('/get-note', (req, res) => {
  subjectController.getSubject(deptId).then((subject) => {
    res.render('staff/get-notes', { student: true, subject, username });
  })
})

router.post('/get-note', (req, res) => {
  try{
    syllabusController.getModule(req.body.subject_id).then((moduleInfo) => {
      var module;
      if(moduleInfo){
        switch (req.body.module) {
          case "1":
            module = moduleInfo.module1;
            break;
          case "2":
            module = moduleInfo.module2;
            break;
          case "3":
            module = moduleInfo.module3;
            break;
          case "4":
            module = moduleInfo.module4;
            break;
          case "5":
            module = moduleInfo.module5;
            break;
          case "6":
            module = moduleInfo.module6;
            break;
          default:
            module = ["Something error OCcured"]
        }
      }
      
  
      res.render('staff/note-picker', { student: true, module,  'subId' : req.body.subject_id })
    })
  }
  catch(err) {
    res.send(err);
  }
})


router.get('/doubt', (req, res) => {
  subjectController.getSubject(deptId).then((subject) => {
    res.render('staff/get-notes', { student: true, subject, username });
  })
})


router.post('/doubt', (req, res) => {
  try{
    syllabusController.getModule(req.body.subject_id).then((moduleInfo) => {
      var module;
      if(moduleInfo) {
        switch (req.body.module) {
          case "1":
            module = moduleInfo.module1;
            break;
          case "2":
            module = moduleInfo.module2;
            break;
          case "3":
            module = moduleInfo.module3;
            break;
          case "4":
            module = moduleInfo.module4;
            break;
          case "5":
            module = moduleInfo.module5;
            break;
          case "6":
            module = moduleInfo.module6;
            break;
          default:
            module = ["Something error OCcured"]
        }
      }
      
      res.render('student/doubt-page', { student: true, module,  'subId' : req.body.subject_id })
    })
  }
  catch(err) {
    res.send(err);
  }
})


router.post('/doubt-raised', (req, res) => {
  req.body.deptId= deptId;
  studentController.insertDoubt(req.body,candidatecode).then((response) => {
    res.redirect('/student')
  })
})

router.get('/get-assigment', (req, res) => {
  studentMonitor.getAssignment(deptId,req.session.user.Semester).then((assigmentdata) => {
    res.render('student/assignment-status', {assigmentdata,student: true})
  })
})


//@GET /student/doubt-history/candidatecode
//@DESC get student previous doubt history and status
router.get('/doubt-history/:id',verifyLogin, async(req, res) => {
  studentController.getDoubtHistory(req.params.id)
  .then((history) => {
    res.render('student/doubt-history', {history, student: true})
  })
})


//@POST /studnet/rate-instructor/{{this._id}},0"
//@DESC /rate instructor based on doubt solved
router.get('/rate-instructor/:id', (req, res) => {
  var data = req.params.id.split(",");

  studentController.rateDoubt(data[0],data[1]).then((response) =>{
    res.redirect('/student');
  })
})


//@LOGOUT the user
//logout student
router.get('/logout', (req, res) => {
  req.session.destroy(()=>{
    res.redirect('/student/login')
  })
})
module.exports = router;
