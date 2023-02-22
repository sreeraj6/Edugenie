const { response } = require('express');
var express = require('express');
var staffController = require('../Helpers/adminHelper/addStaff');
var departmentController=require('../Helpers/adminHelper/aboutDept')
var studentController=require('../Helpers/adminHelper/addStudent')
var subjectController = require('../Helpers/adminHelper/subjectHelper');
var router = express.Router();

//GET admin login form
//route admin/login
router.get('/', (req, res) => {
    res.render('admin/home.hbs',{admin:true})
})

//GET admin login form
//route admin/login
router.get('/login', (req, res) => {
    res.render('admin/login.hbs')
});

//POST admin login submint
//route admin/login
router.post('/login', (req, res) => {
    req.body.type = 1
    console.log(req.body);

    res.redirect('/admin')
})

//GET admin add staff form
//route admin/add-staff
router.get('/add-staff',async (req, res) => {
    var dept = await departmentController.getDepartment();
    res.render('admin/add-staff.hbs', { 'staffExist': req.session.staff ,admin:true, dept});
    req.session.staff = false;
});

//POST admin add staff form
//@DESC store staff data
router.post('/add-staff', (req, res) => {
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
router.get('/staff-data',(req,res)=>{
    
    staffController.getstaffData().then((staffData)=>{
        res.render('admin/staff-data',{staffdata:staffData,admin:true})
})
    });
    
//GET admin add student form
//route admin/add-student
router.get('/add-student',async (req, res) => {
    var dept = await departmentController.getDepartment();
    console.log(dept);
    res.render('admin/add-student.hbs',{admin:true,dept})
})


//POST store student details
//@route admin/add-student
router.post('/add-student', (req, res) => {
    
    studentController.addStudent(req.body).then((response) => {
        if (response.user) {
            req.session.student = true;
            res.redirect('/admin/add-student')
        }
        else{
            res.redirect('/admin');
        }
    })
     
})

//get student
router.get('/get-student', (req, res) => {
    studentController.getStudent().then((students)=>{
        res.render('admin/student-data',{students});
    })
})
//dept -> add-dept, add-syllab,
//GET admin add dept form and assign hod
//route admin/add-dept
router.get('/add-dept', (req,res) => { //required : name, capacity, semester, 
//for assigning hod take all the staff of the current dept and display in dropdown
res.render('admin/add-dept',{admin:true})
})

router.post('/add-dept', (req,res) => { 
 departmentController.addDept(req.body).then((response)=>{
    if (response.user) {
        
        res.redirect('/admin/add-dept')
    }
    else{
        res.redirect('/admin');
    }
 })
})

//show department and current hods
router.get('/get-dept', (req, res) => {
    departmentController.getDepartment().then((deptdata) => {
        res.render('admin/department-data',{deptdata});
    }) 
})


//update department
router.get('/update-dept/:id',async (req, res) => {
    var staff = await staffController.getDeptStaff(req.params.id);
    departmentController.getDepartmentId(req.params.id).then((deptInfo)=>{
        res.render('admin/edit-dept',{deptInfo,staff})
    })
})


//update department
router.post('/update-dept/:id',async (req, res) => {
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
router.get('/add-sub', (req, res) => {
    departmentController.getDepartment().then((dept) =>{
        res.render('admin/add-sub',{dept});
    })
   
})


//@POST /admin/add-sub
router.post('/add-sub', (req, res) => {
    subjectController.addSubject(req.body).then((response) => {
        if(response.status){
            res.redirect('/admin/add-sub');
        }
        else{
            console.log(response);
            res.render('error',{message:response.code});
        }
    })
})
//addsyllabus
router.get('/add-syllab',async(req, res) => {
    var dept = await departmentController.getDepartment();
    res.render('admin/add-syllab',{dept})
})


router.get('/get-sub/:id', async (req,res) => {
    var subect = await subjectController.getSubject(req.params.id);
    res.json(subect);
    // subjectController.getSubject(req.body.parent_value)
})
//exam hall allocation
//1.Add halls and capacity
//2.select dept,hall,mixwithK(no:of students in a bench) and allocate exam hall  
//2.1 check whether number of students occupy in selected hall  T-O(students)
//2.2 if occupy mixwithK
//2.3 insert the shuffled into hall and remove from the queue
//3.Generate excel or pdf from the allocation



module.exports = router;