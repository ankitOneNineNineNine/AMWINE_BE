var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var authRouter = require('./routes/User/auth.route')
require('./db')
var cors = require('cors')
var app = express();

app.use(cors())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//auth route

app.use('/auth', authRouter)





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
