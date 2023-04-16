var express = require('express');
var router = express.Router();
var assignmentController = require('../Helpers/staffHelper/assignmentHelper')
var fs = require("fs");
var departmentController = require('../Helpers/adminHelper/aboutDept')
var adminAuth = require('../Helpers/adminHelper/adminAuth');
var syllabusController = require('../Helpers/staffHelper/fetchSyllabus');
var subjectController = require('../Helpers/adminHelper/subjectHelper');
var attendanceController = require('../Helpers/staffHelper/attendanceHelper');
const { response } = require('../app');
const attendanceHelper = require('../Helpers/staffHelper/attendanceHelper');
const { log, error } = require('console');
const openai = require('../Helpers/staffHelper/openai')
/* GET home page. */
const verifystaff = (req, res, next) => {
  if (req.session.loggedIn) {
      staffId = req.session.staff._id,
      username = req.session.staff.Name,
      deptId = req.session.staff.Dept_Id
    next()
  } else {
    res.redirect('/staff/login')
  }
}

router.get('/', verifystaff, async(req, res) => {
  var pendingdoubt = await assignmentController.getRaisedDoubts(deptId);
  var solved = await assignmentController.solvedDoubt(staffId);
  res.render('staff/home', { staff: true, dept_id: deptId, username, "doubt":pendingdoubt.length, 'solved':solved.length});
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

router.get("/add-Attendance/", verifystaff, async (req, res) => {
  var dept = await departmentController.getDepartment();
  res.render('staff/select-class', { dept, username })
}),

  //POST select departmnent subject
  router.post("/add-Attendance/", verifystaff, async (req, res) => {
    console.log(req.body);
    const date = new Date();
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var subject = req.body.subject.split(",");
    var todayDate = date.toISOString().slice(0, 10);
    var dept_Id = req.body.deptId;
    var hours = await attendanceController.getHours(dept_Id, subject[1], todayDate);
    attendanceHelper.getStudents(subject[1], dept_Id).
      then((students) => {
        res.render('staff/student-data', { students, day: weekday[date.getDay()], dept_Id, hours, 'semester': subject[1], 'subjectId': subject[0], 'subject': subject[2], staff: true, username });
      })
  })

//POST
router.post("/assign-attendance/:id", verifystaff, (req, res) => {
  attendanceController.recordeAttendance(req.body, req.params.id, staffId).then((response) => {
    res.redirect('/staff')
  })
})

//get subject from db
//GET /staff/select-sub
router.get("/select-sub/:id", verifystaff, (req, res) => {
  subjectController.getSubject(req.params.id).then((subject) => {
    res.render('staff/get-notes', { staff: true, subject, username });
  })
})

//POST /staff/select-sub
router.post("/select-sub/:id", verifystaff, (req, res) => {
  res.redirect("/assign-notes/" + req.body.subject_id + "," + req.body.module);
})

//assign 
//GET /staff/assign-note
router.get('/assign-notes/:id', verifystaff, (req, res) => {
  var params = req.params.id.split(",");
  syllabusController.getModule(params[0]).then((moduleInfo) => {
    var module;
    switch (params[1]) {
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
    res.render('staff/assign-notes', { staff: true, module, username, 'subId' : params[0] })
  })
})


//openai note generation
router.get('/assigned-notes/:id', (req, res) => {
  openai.runPrompt(req.params.id).then((response) => {
    res.json(response)
  })
})


//save generated notes to db
router.post('/save-note/:id', (req, res) => {
  req.body.sub_id = req.params.id;
  syllabusController.saveNotes(req.body).then((response) => {
    res.redirect('/staff')
  })
})


router.get('/get-note/:id', (req, res) => {
  subjectController.getSubject(req.params.id).then((subject) => {
    res.render('staff/get-notes', { staff: true, subject, username });
  })
})

router.post('/get-note/:id', (req,res) => {
  console.log(req.body);
  syllabusController.getModule(req.body.subject_id).then((moduleInfo) => {
    var module;
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
    // console.log(module);
    // res.send(module)
    res.render('staff/note-picker', { staff: true, module,  'subId' : req.body.subject_id })
  })
})

router.get('/get-note-topic/:id',(req,res) => {
  try{
    syllabusController.getNote(req.params.id).then((response)=>{
    if(!response){
      res.json('no note exist');
    }
    else{
      res.json(response.notes);
    }
    })
  }
  catch(err){
    res.json(err.message);
  }
})

router.get('/assign-assignment',(req, res) => {
  subjectController.getSubject(deptId).then((subject) => {
    res.render('staff/assign-assignment', { staff: true, subject, username });
  })
})

router.post('/assign-assignment', (req, res) => {
  assignmentController.giveAssignment(req.body).then((response) => {
    res.redirect('/')
  })

})


module.exports = router;
