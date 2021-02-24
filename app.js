var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var authRouter = require('./routes/User/auth.route');
var adminAuth = require('./routes/Admin/admin.auth.route');
var userRoute = require('./routes/User/user.route')
require('./db')
var cors = require('cors');
const authenticate = require('./middlewares/authenticate');
var app = express();

app.use(cors())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/ProfilePictures", express.static(path.join(__dirname, 'ProfilePictures')));

//auth route

app.use('/auth', authRouter)
app.use('/adminAuth',adminAuth )

//userRoute
app.use('/user', authenticate, userRoute)



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 400).json({
    status: err.status || 400,
    msg: err.msg || err,
});
});

app.listen(8000, ()=>{
  console.log('Connected to 8000')
})
