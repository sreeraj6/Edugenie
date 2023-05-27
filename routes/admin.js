const { response } = require('express');
var express = require('express');
var staffController = require('../Helpers/adminHelper/addStaff');
var departmentController=require('../Helpers/adminHelper/aboutDept')
var studentController=require('../Helpers/adminHelper/addStudent')
var subjectController = require('../Helpers/adminHelper/subjectHelper');
var examHallController = require('../Helpers/adminHelper/ExamHallAllotHelper');
var fs = require("fs");
const adminAuth = require('../Helpers/adminHelper/adminAuth');
const { log } = require('console');
var router = express.Router();

const verifyLogin = (req, res, next) => {
    req.session.loginError = false
    if (req.session.loggedIn) {
      username = req.session.user.Name,
      next()
    } else {
      res.redirect('/admin/login')
    }
  }

//GET admin login form
//route admin/login
router.get('/',verifyLogin, (req, res) => {
    res.render('admin/home.hbs',{admin:true})
})

//GET admin login form
//route admin/login
router.get('/login', (req, res) => {
    res.render('admin/login')
});

//POST admin login submint
//route admin/login
router.post('/login', (req, res) => {
    req.body.type = 1;
    adminAuth.doLogin(req.body).then((response)=>{
        if (response.status) {
            req.session.loginError = false
            req.session.loggedIn = true
            req.session.user = response.user
            res.redirect('/admin')
          }
          else {
            req.session.loginError = true
            res.redirect('/admin/login')
          }
    })
   
})

//GET admin add staff form
//route admin/add-staff
router.get('/add-staff',async (req, res) => {
    var dept = await departmentController.getDepartment();
    res.render('admin/add-staff.hbs', { 'staffExist': req.session.staff ,admin:true, dept});
});

//POST admin add staff form
//@DESC store staff data
router.post('/add-staff',verifyLogin, (req, res) => {
    var dept = req.body.sfDept.split(",");
    req.body.deptId = dept[0];
    req.body.deptName = dept[1];
    staffController.addStaff(req.body).then((response) => {
        if (response.user) {
            req.session.staff = true;
            res.redirect('/admin/add-staff')
        }
        else{
            res.redirect('/admin');
        }
    })
})
router.get('/check',(req,res)=>{
    // console.log(Date.UTC());
    res.send(new Date)
})
router.get('/staff-data',verifyLogin, (req,res)=>{
    
    staffController.getstaffData().then((staffData)=>{
        res.render('admin/staff-data',{staffdata:staffData,admin:true})
})
    });
    
//GET admin add student form
//route admin/add-student
router.get('/add-student',verifyLogin, async (req, res) => {
    var dept = await departmentController.getDepartment();
    console.log(dept);
    res.render('admin/add-student.hbs',{admin:true,dept})
})


//POST store student details
//@route admin/add-student
router.post('/add-student',verifyLogin, (req, res) => {
    studentController.addStudent(req.body).then((response) => {
        if (response.user) {
            req.session.student = true;
            res.redirect('/admin/add-student', {admin:true})
        }
        else{
            res.redirect('/admin/add-student', {admin:true});
        }
    })
     
})

//get student
router.get('/get-student',verifyLogin, (req, res) => {
    studentController.getStudent().then((students)=>{
        res.render('admin/student-data',{admin:true, students});
    })
})
//dept -> add-dept, add-syllab,
//GET admin add dept form and assign hod
//route admin/add-dept
router.get('/add-dept',verifyLogin, (req,res) => { //required : name, capacity, semester, 
//for assigning hod take all the staff of the current dept and display in dropdown
res.render('admin/add-dept',{admin:true})
})

router.post('/add-dept',verifyLogin, (req,res) => { 
 departmentController.addDept(req.body).then((response)=>{
    if (response.user) {
        
        res.redirect('/admin/add-dept',{admin:true,})
    }
    else{
        res.redirect('/admin');
    }
 })
})

//show department and current hods
router.get('/get-dept',verifyLogin, (req, res) => {
    departmentController.getDepartment().then((deptdata) => {
        res.render('admin/department-data',{admin:true, deptdata});
    }) 
})


//update department
router.get('/update-dept/:id',verifyLogin, async (req, res) => {
    var staff = await staffController.getDeptStaff(req.params.id);
    departmentController.getDepartmentId(req.params.id).then((deptInfo)=>{
        res.render('admin/edit-dept',{admin:true, deptInfo,staff})
    })
})


//update department
router.post('/update-dept/:id',verifyLogin, async (req, res) => {
    var staff = req.body.hod.split(",");
    req.body.hodId = staff[0];
    req.body.hodName = staff[1];

    departmentController.updateDept(req.params.id,req.body).then((response) => {
        res.redirect('/admin/get-dept')
    })
    
})

//monitor student attendance



//monitor teaching



//delete dept

//@DESC get add subj form
//@GET add-subject
router.get('/add-sub',verifyLogin, (req, res) => {
    departmentController.getDepartment().then((dept) =>{
        res.render('admin/add-sub',{admin:true, dept});
    })
   
})


//@POST /admin/add-sub
router.post('/add-sub',verifyLogin, (req, res) => {
    subjectController.addSubject(req.body).then((response) => {
        if(response.status){
            res.redirect('/admin/add-sub');
        }
        else{
            console.log(response);
            res.render('error',{admin:true, message:response.code});
        }
    })
})


//addsyllabus

router.get('/add-syllab',verifyLogin, async(req, res) => {
    var dept = await departmentController.getDepartment();
    res.render('admin/add-syllab',{admin:true, dept})
})


router.post('/add-syllab',verifyLogin, (req, res) => {
    departmentController.addSyllabus(req.body).then((response)=>{
        res.redirect('/admin')
    })
})

router.get('/get-sub/:id',verifyLogin, async (req,res) => {
    console.log(req.params.id);
    var subect = await subjectController.getSubject(req.params.id);

    res.json(subect);
    // subjectController.getSubject(req.body.parent_value)
})
//exam hall allocation
//1.Add halls and capacity

//DESC add hall form
//GET /admin/add-hall
router.get('/add-hall',verifyLogin, (req, res) => {
    res.render('admin/add-hall', {admin:true,});
})


//DESC add hall form
//POST /admin/add-hall
router.post('/add-hall',verifyLogin, (req, res) => {
    examHallController.addHall(req.body).then((response)=>{
        res.redirect('/admin/add-hall',{admin:true,});
    })
})


//2.select dept,hall,mixwithK(no:of students in a bench) and allocate exam hall  
//DESC exam hall allocate form
//GET /admin/generate-allocation
router.get('/generate-allocation',verifyLogin, (req, res) => {
    res.render('admin/examHall',{admin:true,});
})


router.post('/generate-allocation',verifyLogin, (req,res) => {
    var arr = req.body.halls.split(",");
    examHallController.generateAllotment(req.body,arr).then((response)=>{
        console.log(res);
        if(response.status){
            res.send(response.code)
        }
        else{
            res.download('./output.pdf')
        }
    })
})
//2.1 check whether number of students occupy in selected hall  T-O(students)
//2.2 if occupy mixwithK
//2.3 insert the shuffled into hall and remove from the queue
//3.Generate excel or pdf from the allocation

//get hall
router.get('/get-hall', (req, res) => {
    examHallController.getHall().then((halls) => {
        res.render('admin/hall-details',{halls, admin:true})
    })
})

//logout
router.get('/logout', (req, res) => {
    req.session.destroy(()=>{
      res.redirect('/');
    })
  })
module.exports = router;
