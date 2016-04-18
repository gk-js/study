var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var template = require('art-template');
var crypto = require('crypto');
var user = require('./models/user');
var db = require('./models/db');

var routes = require('./routes/index');
var products = require('./routes/products');
var detail = require('./routes/detail');
var login = require('./routes/login');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
template.config('base','');
template.config('extname', '.html');
template.config('escape', false);
app.engine('.html', template.__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static('public'));

app.use('/', routes);
app.use('/products', products);
app.get('/login', function(req, res, next){
    res.render('login', {
      title : '商城登录'
    })
});
app.get('/register', function(req, res, next){
    res.render('register', {
      title : '商城注册'
    })
});
app.post('/register', function(req, res, next){
    var userName = req.body.user,
        password = req.body.password,
        re_password = req.body.re_password;
    if(password != re_password){
        return;
    }
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    var newUser = new user({
        userName: userName,
        password: password
    });
    newUser.save(function(rows){
        if(rows.affectedRows > 0){
            return res.redirect('/');
        }else{
          //注册失败
        }
    })
});

app.post('/login',  function(req, res){
    var userName = req.params.userName,
        password = req.params.password;
    db('SELECT * FROM USER WHERE userName='+ userName +'',function (rows){
        if(rows.length > 0){
            var password_Fource = md5.update(password).digest('hex');
            if(password_Fource === rows[0].password){
                //登录成功
            }
        }else{
            //用户不存在
            return;
        }
    })
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//
module.exports = app;
