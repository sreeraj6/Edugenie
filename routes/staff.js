var express = require('express');
var router = express.Router();
var staffController=require('../Helpers/staffHelper/Staff')
var fs = require("fs");
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('staff/home', { admin:false});
});

router.get('/view-Assignment/',(req,res)=>{
   staffController.ViewAssignment().then((AssignmentData)=>{;
  res.render("staff/view-assignment",{ Assignmentdata:AssignmentData})
   })
})

router.get('/mark-Assignment/:id',async(req,res)=>{
  let userid=req.params.id;
  let CheckAssignment=await staffController.getAssignmentDetails(userid)
  console.log("Check assignment name"+CheckAssignment.NameofAssignment);
  res.render('staff/mark-assignment',{CheckAssignment:CheckAssignment})
})

router.post('/mark-Assignment/:id',(req,res)=>{
  let userid=req.params.id;
  console.log("checked file is",req.body.assignFile);
  var checkedState = req.body.checked
  if(checkedState==undefined){
    console.log("not checked");
  }else{
  console.log("marked" ,checkedState); 
  }
  staffController.markAssignments(req.body,userid).then((response)=>{
    console.log(response);
  res.redirect('/staff')
  })

});
router.get("/add-Attendance/",(req,res)=>{
  
  staffController.addAttendence().then((studentDetails)=>{
  let date=new Date()
  var dateObj = new Date();
var month = dateObj.getUTCMonth() + 1; 
var day = dateObj.getUTCDate();
var year = dateObj.getUTCFullYear();
newdate = year + "/" + month + "/" + day;
console.log("new date is"+newdate);
  console.log("get date is",date.getDate())
  res.render('staff/student-Attendance',{studentDetails:studentDetails,date:newdate})
})
})
module.exports = router;
