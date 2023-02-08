var express = require('express');
var router = express.Router();

//GET admin login form
//route admin/login

router.get('/',(req,res)=>{
    res.render('admin/home.hbs')
})
router.get('/login',(req,res) => {
    res.render('admin/login.hbs')
});

router.post('/login',(req,res) => {
    req.body.type = 1
    console.log(req.body);
    
    res.redirect('/admin')
})

router.get('/add-staff',(req,res)=>{
    res.render('admin/add-staff.hbs')
});
router.get('/add-student',(req,res)=>{
    res.render('admin/add-student.hbs')
})

//POST admin login submint
//route admin/login


module.exports = router;