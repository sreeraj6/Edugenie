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




module.exports = router;