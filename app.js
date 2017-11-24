var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

const async = require('async');
const morgan = require('morgan');
const request = require('request');

var index = require('./routes/index');
var users = require('./routes/users');
var emails = require('./routes/emails');

const expressHbs = require('express-handlebars');
//
//

var app = express();

// view engine setup
app.engine('.hbs', expressHbs({
  defaultLayout: 'layout',
  extname: '.hbs'
}));
app.set('view engine', 'hbs');

app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//morgan
app.use(morgan('dev'));

// View Engine
//app.engine()
app.route('/')
  .get((req, res, next) => {
    res.render('main/home');
  })
  .post((req, res, next) => {
    //capture users mail
    request({
      url:'https://us15.api.mailchimp.com/3.0/lists/60797ca10e/members',
      method:'POST',
      headers:{
        'Authorization':'randomUser 2896b6faa1eb43e3925016e192ee76a8-us15',
        'Content-Type':'application/json'
      },
      json:{
        'email_address':req.body.email,
        'status':'subscribed',
      }

    }, function(err,response,body) {
      if (err) {
        console.log(err);
      }else {
        console.log('Bien envoyé');
        res.redirect('/');
      }

    });
  });

app.use('/', index);
app.use('/users', users);
app.use('/emails', emails)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
