const { response } = require('express');
var express = require('express');
var staffController = require('../Helpers/adminHelper/addStaff');
var router = express.Router();

//GET admin login form
//route admin/login
router.get('/', (req, res) => {
    res.render('admin/home.hbs')
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
router.get('/add-staff', (req, res) => {
    res.render('admin/add-staff.hbs', { 'staffExist': req.session.staff });
    req.session.staff = false;
});

//POST admin add staff form
//@DESC store staff data
router.post('/add-staff', (req, res) => {
    staffController.addStaff(req.body).then((response) => {
        if (response.user) {
            req.session.staff = true;
            res.redirect('/admin/addstaff')
        }
        else{
            res.redirect('/admin');
        }
    })
})
//GET admin add student form
//route admin/add-student
router.get('/add-student', (req, res) => {
    res.render('admin/add-student.hbs')
})


//POST store student details
//@route admin/add-student
router.post('/add-student', (req, res) => {
    
    console.log(req.body);
})


//dept -> add-dept, add-syllab,
//GET admin add dept form and assign hod
//route admin/add-dept
router.get('/add-dept', (req,res) => { //required : name, capacity, semester, 
//for assigning hod take all the staff of the current dept and display in dropdown
})

router.post('/add-dept', (req,res) => { 

})

//monitor student attendance



//monitor teaching



//delete dept



//addsyllabus


//exam hall allocation
//1.Add halls and capacity
//2.select dept,hall,mixwithK(no:of students in a bench) and allocate exam hall  
//2.1 check whether number of students occupy in selected hall  T-O(students)
//2.2 if occupy mixwithK
//2.3 insert the shuffled into hall and remove from the queue
//3.Generate excel or pdf from the allocation



module.exports = router;