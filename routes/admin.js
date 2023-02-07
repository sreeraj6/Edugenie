var express = require('express');
var router = express.Router();

//GET admin login form
//route admin/login
router.get('/login',(req,res) => {
    res.render('admin/login.hbs')
})


//POST admin login submint
//route admin/login

router.post('/login',(req,res) => {
    req.body.type = 1
    console.log(req.body);
})
module.exports = router;