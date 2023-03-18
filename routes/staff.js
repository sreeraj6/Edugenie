var express = require('express');
var router = express.Router();
var staffController = require('../Helpers/staffHelper/Staff')
const db = require('../Config/connection');
var fs = require("fs");
var departmentController = require('../Helpers/adminHelper/aboutDept')
var adminAuth = require('../Helpers/adminHelper/adminAuth');
var syllabusController = require('../Helpers/staffHelper/fetchSyllabus');
var subjectController = require('../Helpers/adminHelper/subjectHelper');
const { response } = require('../app');
const { Configuration, OpenAIApi } = require("openai");
const { type } = require('os');
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


router.get("/add-Attendance/", (req, res) => {
  id = req.params.id
  staffController.addAttendence().then((studentDetails) => {
    console.log("total detail is" + studentDetails.subjectName)
    let date = new Date()


    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1;
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    newdate = year + "/" + month + "/" + day;
    console.log("new date is" + newdate);
    console.log("get date is", date.getDate())
    console.log("student id is", studentDetails._id);
    res.render('staff/student-Attendance', { studentDetails: studentDetails.student, subjectName: studentDetails.subjectName, teacherName: studentDetails.TeacherName })
  })

}),

  router.post("/add-Attendance/:id", (req, res) => {
    id = req.params.id
    staffController.AttendanceRecord(req.body, id).then((response) => {
      console.log(response);
      res.redirect("/staff/add-Attendance")
    })
  })


//get subject from db
//GET /staff/select-sub
router.get("/select-sub/:id", (req, res) => {
  subjectController.getSubject(req.params.id).then((subject) => {
    console.log(subject);
    res.render('staff/get-notes', {subject});
  })
})

//POST /staff/select-sub
router.post("/select-sub/:id", (req, res) => {
    res.redirect("/assign-notes/"+req.body.subject_id);
})

//assign 
//GET /staff/assign-note
router.get('/assign-notes/:id',(req, res) => {
  syllabusController.getModule(req.params.id).then((moduleInfo) => {
    console.log(moduleInfo);
    res.render('staff/assign-notes',{module1 : moduleInfo.module1, module2 : moduleInfo.module2, module3 : moduleInfo.module3, module4 : moduleInfo.module4, module5 : moduleInfo.module5})
  })
}),

router.post('/assign-notes',(req,res)=>{

  console.log("question is",req.body)
  const config = new Configuration({
    apiKey: "YOUR API_KEY"
  });
  const openai = new OpenAIApi(config);

const runPrompt = async (data,type) => {
 
	 
	
  

     

	const response = await openai.createCompletion({
		model: "text-davinci-003",
		prompt: data,
		max_tokens: 2048,
		temperature: 1,
		 
		 
	});
	console.log("response data",response.data.choices[0].text );

	
	const parsableJSONresponse = response.data.choices[0].text;
  const JsonString=JSON.stringify(parsableJSONresponse)
 var parsedResponse = JSON.parse(JsonString);
    

	console.log("Question: ",  parsedResponse);
	//console.log("Answer: ", parsedResponse.A);
  res.render("staff/assign-notes", {Answer:parsedResponse})
//  if(type==1){
//     res.render("staff/assign-notes", {Answer:parsedResponse})
//  }else if(type==2){
//   res.render("staff/assign-notes", {Answer1:parsedResponse})
//  }else if(type==3){
//   res.render("staff/assign-notes", {Answer2:parsedResponse})
//  }else if(type==4){
//   res.render("staff/assign-notes", {Answer3:parsedResponse})
//  }else if(type==5){
//   res.render("staff/assign-notes", {Answer4:parsedResponse})
//  }else{
//   alert("module not found")
//  }

};

var Question=req.body.Module_Data
console.log("Question is Here",Question);
    
  runPrompt(Question)

//   if(req.body.Module1){
//     var Question=req.body.Module1
//    var type=1
//     console.log("Question is Here",Question);
    
//     runPrompt(Question,type)
//   }else if(req.body.Module2){
//       Question=req.body.Module2
//       type=2
//       console.log("Question is Here",Question);
      
//       runPrompt(Question,type)
//   }
//   else if(req.body.Module3){
//     Question=req.body.Module3
//     type=3
//     console.log("Question is Here",Question);
//     runPrompt(Question,type);
  


// }
// else if(req.body.Module4){
//   Question=req.body.Module4
//   type=4
//   console.log("Question is Here",Question);
//   runPrompt(Question,type);
  
// }
// else if(req.body.Module5) {
//   Question=req.body.Module5
//   type=5
//   console.log("Question is Here",Question);
//   runPrompt(Question,type);
  
// }else{
//   console.log("error");
// }




}),

 
module.exports = router;