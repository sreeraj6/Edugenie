var express = require('express');
var router = express.Router();
var staffController = require('../Helpers/staffHelper/Staff')
var fs = require("fs");
var departmentController = require('../Helpers/adminHelper/aboutDept')
var adminAuth = require('../Helpers/adminHelper/adminAuth');
var syllabusController = require('../Helpers/staffHelper/fetchSyllabus');
var subjectController = require('../Helpers/adminHelper/subjectHelper');
var attendanceController = require('../Helpers/staffHelper/attendanceHelper');
const { response } = require('../app');
const attendanceHelper = require('../Helpers/staffHelper/attendanceHelper');

/* GET home page. */
const verifystaff = (req, res, next) => {
  if (req.session.loggedIn) {
    username = req.session.staff.Name,
      deptId = req.session.staff.Dept_Id
    next()
  } else {
    res.redirect('/staff/login')
  }
}

router.get('/', verifystaff, (req, res) => {
  res.render('staff/home', { staff: true, dept_id: deptId });
});

//GET staff login
//@DES /staff/login
router.get('/login', (req, res) => {
  res.render('admin/login');
})

//POST stafff login submint
//route staff/login
router.post('/login', (req, res) => {
  req.body.type = 2
  adminAuth.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true
      req.session.staff = response.user
      res.redirect('/staff')
    }
    else {
      req.session.loginError = true
      res.redirect('/staff/login')
    }
  })
})

router.get('/view-Assignment/', (req, res) => {
  staffController.ViewAssignment().then((AssignmentData) => {
    ;
    res.render("staff/view-assignment", { Assignmentdata: AssignmentData })
  })
})

router.get('/mark-Assignment/:id', async (req, res) => {
  let userid = req.params.id;
  let CheckAssignment = await staffController.getAssignmentDetails(userid)
  console.log("Check assignment name" + CheckAssignment.NameofAssignment);
  res.render('staff/mark-assignment', { CheckAssignment: CheckAssignment })
})

router.post('/mark-Assignment/:id', (req, res) => {
  let userid = req.params.id;
  console.log("checked file is", req.body.assignFile);
  var checkedState = req.body.checked
  if (checkedState == undefined) {
    console.log("not checked");
  } else {
    console.log("marked", checkedState);
  }
  staffController.markAssignments(req.body, userid).then((response) => {
    console.log(response);
    res.redirect('/staff')
  })

});


router.get("/add-Attendance/", async (req, res) => {
  var dept = await departmentController.getDepartment();
  res.render('staff/select-class', { dept })
}),

//POST select departmnent subject
router.post("/add-Attendance/", (req, res) => {
  const date = new Date();
  const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  var subject = req.body.subject.split(",");
  var todayDate = date.toISOString().slice(0, 10);
  var dept_Id = req.body.deptId;
  attendanceHelper.getStudents(subject[1],dept_Id).
  then((students)=>{
    res.render('staff/student-data',{students, day: weekday[date.getDay()], dept_Id});
  })
})

//POST
router.post("/assign-attendance/:id", (req, res) => {
  console.log(req.body);
})

//get subject from db
//GET /staff/select-sub
router.get("/select-sub/:id", (req, res) => {
  subjectController.getSubject(req.params.id).then((subject) => {
    console.log(subject);
    res.render('staff/get-notes', { subject });
  })
})

//POST /staff/select-sub
router.post("/select-sub/:id", (req, res) => {
  res.redirect("/assign-notes/" + req.body.subject_id);
})

//assign 
//GET /staff/assign-note
router.get('/assign-notes/:id', (req, res) => {
  syllabusController.getModule(req.params.id).then((moduleInfo) => {
    console.log(moduleInfo);
    res.render('staff/assign-notes', { module1: moduleInfo.module1, module2: moduleInfo.module2, module3: moduleInfo.module3, module4: moduleInfo.module4, module5: moduleInfo.module5 })
  })
})
module.exports = router;
