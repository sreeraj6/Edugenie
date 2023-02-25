var express = require('express');
var router = express.Router();
var fs = require("fs");
var studentController=require('../Helpers/studentHelper/Student')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('student/home',{student:true})
});


router.get('/upl-assignment/',(req,res)=>{
  res.render("student/add-assignments")
})
;
router.post("/upl-assignment/:id",(req,res)=>{
  id=req.params.id
  console.log(req.body);
  
   studentController.uploadAssignment(req.body,id).then((response)=>{
    console.log(response);
    res.redirect('/student/assignment-status')
   })
}),

router.get("/Assignment-status/",(req,res)=>{
  userID=req.params.id
  studentController.assignmentStatus(userID).then((AssignmentData)=>{;
    res.render("student/assignment-status",{ Assignmentdata:AssignmentData})
     })
})

module.exports = router;
