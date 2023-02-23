var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config()
var session = require('express-session');
var app = express();
 var hbs=require('express-handlebars')
var db = require('./Config/connection');
const fileUpload = require('express-fileupload');

app.use(session({
  secret:'key',
  resave:true,
  saveUninitialized:true,
  cookie:{maxAge: 6000000}
}))

// db.connect((err)=>{
//   if(err) console.log("Connection error"+err);
//   else console.log("Database is connected");
// })

var adminRouter = require('./routes/admin')
var indexRouter = require('./routes/staff');
var usersRouter = require('./routes/student');
const { Console } = require('console');
const { setEngine } = require('crypto');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',hbs.engine({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layout/',partialsDir:__dirname +'/views/partials/'}))
 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload( ));


app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/staff', indexRouter);
 
app.use('/student', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
