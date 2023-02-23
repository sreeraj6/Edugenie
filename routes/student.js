var express = require('express');
var router = express.Router();
var fs = require("fs");
var studentController=require('../Helpers/studentHelper/Student')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('index',{student:true})
});


router.get('/upl-assignment/',(req,res)=>{
  res.render("student/add-assignments")
})

router.post("/upl-assignment/:id",(req,res)=>{
  id=req.params.id
   studentController.uploadAssignment(req.body,id).then((response)=>{
    console.log(response);
    res.redirect('/staff')
   })
})

module.exports = router;
