var express = require('express');
var router = express.Router();
var staffController=require('../Helpers/staffHelper/Staff')

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
  staffController.markAssignments(req,body,userid).then((response)=>{
    console.log(response);
  res.redirect('/staff')
  })

})
module.exports = router;
