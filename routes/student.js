var express = require('express');
var router = express.Router();
var fs = require("fs");
var studentController = require('../Helpers/studentHelper/Student')
var adminAuth = require('../Helpers/adminHelper/adminAuth');


const verifyadmin = (req, res, next) => {
  if (req.session.loggedIn) {
    username = req.session.user.username,
      next()
  } else {
    res.redirect('/student/login')
  }
}

/* GET users listing. */
router.get('/', (req, res) => {
  res.render('student/home', { student: true })
});


router.get('/upl-assignment/', (req, res) => {
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

  router.get("/Assignment-status/", (req, res) => {
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

module.exports = router;
