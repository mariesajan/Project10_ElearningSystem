var express = require('express');
var bodyParser = require('body-parser');
var redis = require('then-redis');
var assert = require('assert');
var async =require('async');
var session = require('express-session');
var url = require('url');
var path = require('path');

var app = express();

var arrClassName=[];

var db = redis.createClient({
    host: '127.0.0.1',
    port: 6379
});

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(session({
  secret:'secret key',
  resave: false,
  saveUninitialized : false
}));

app.use('/css',express.static(path.join(__dirname ,'public/css')));
app.use('/js',express.static(path.join(__dirname,'public/js')));
app.use('/util',express.static(path.join(__dirname,'public/util')));

app.listen(3000, function() {
    console.log('server is connected .....');
});

var new_url = __dirname+'/public';
//
// app.use(function(req, res, next){
//   if(req.accepts('html')){
//     console.log('html type is the accept header......');
//   }else{
//     console.log('json type is the accept header......');
//   }
//   if(req.session.user || req.path == '/'){
//     console.log('a user in middleware.......');
//     next();
//   }else{
//     console.log('nnot a user in middleware..........');
//
//     res.clearCookie('cookieUsername');
//     res.clearCookie('cookieAccType');
//     console.log('cookie cleared...');
//     next();
//     //res.redirect('/');
//     // res.redirect('/?data=not_login');
//   }
// });


app.get('/', function(req, res) {
  if(req.session.user){
    res.redirect('/home');
  }else{
    fn_clearCookie(res);
    res.sendFile(new_url + '/views/login.html');
  }
});

function fn_arr_alllessons(all_key,callback){
  db.keys(all_key).then(function(hashKeys){
    if(hashKeys.length > 0){
      callback(null,hashKeys);
    }else{
      return callback(new Error('No lessons found for this class'));
    }

  });
}

function fn_lesson_details(hashKeys,callback){
  var arr_lessondetails = [];
    for(var i = 0; i < hashKeys.length; i++){
      db.hgetall(hashKeys[i]).then(function(hash){
        arr_lessondetails.push(hash);
        if(arr_lessondetails.length  == hashKeys.length){
            callback(null,arr_lessondetails);
        }
      });
    }
}

app.get('/view_lessons_html', ensureAuthenticated, function(req,res){
  var queryObject = url.parse(req.url,true).query;
  if(Object.keys(queryObject).length == 0){
    res.redirect('home');
  }else{
    res.sendFile(new_url+'/views/lessons.html');
  }
});

app.get('/view_lessons', ensureAuthenticated, function(req,res){
  var queryObject = url.parse(req.url,true).query;
  if(Object.keys(queryObject).length == 0){
    res.redirect('home');
  }else{
    var redirect_url = '/view_lessons_html?class_name='+queryObject.classname;
    res.redirect(redirect_url);
  }
});

app.get('/view_lesson_details', ensureAuthenticated, function(req,res){
  var queryObject = url.parse(req.url,true).query;
  if(Object.keys(queryObject).length == 0){
    res.redirect('/home');
  }else{
      var all_key = "class:" + queryObject.classname + ":lesson:*";
      // waterfall allows us to pass callback arg from 1st async fn to next
      async.waterfall(
        [
          function(next){
              fn_arr_alllessons(all_key,next);
          },
          function(hashKey_lesson,next){
            // here hashKey_lesson is the callback arg from fn_arr_alllessons
            fn_lesson_details(hashKey_lesson,next);
          }
        ],
        function(err,callback){
          // this callback contains the final function callback value since its a waterfall
          if(err){
            console.log(err);
          }else{
            console.log('callback value is... ');
            console.log(callback);
          }
            res.send(callback);
      });
  }
});

app.get('/register',function(req,res){
  res.sendFile(new_url+'/views/register.html');
});


app.post('/admin/add_class', function(req, res, next) {
    var hashValue = "classes:" + req.body.class_name;
    db.hset(hashValue, 'class_description',
        req.body.class_description).then(function(hash){
          console.log('hash value is...',hash);
          if(hash == 1){
            data = 'new_data';
          }else{
            data = 'existing_data';
          }
          res.send(data);
        });
});

function ensureAccType(req, res, next){
  if(req.session.user){
    // if the account type is an instructor
      if(req.session.acc_type == 'instructor'){
          next();
      }else{
    // if account type is a student, then add_class feature is disabled.
        res.redirect('/home');
      }
  }else{
    fn_clearCookie(res);
    res.redirect('/?data=not_login');
  }
}

app.get('/add_class',ensureAccType, function(req,res){
  res.sendFile(new_url +  '/views/add_class.html');
});

app.get('/add_lesson_html', ensureAccType, function(req,res){
  var queryObject = url.parse(req.url,true).query;
  if(Object.keys(queryObject).length == 0){
    // Only the instructor should be allowed to go to Add Lesson link.
    // Otherwise redirect to the home page
    res.redirect('/home');
  }else{
    res.sendFile(new_url + '/views/add_lesson.html');
  }
});

app.get('/add_lesson', ensureAccType,  function(req, res, next) {
    var queryObject = url.parse(req.url,true).query;
    if(Object.keys(queryObject).length > 0){
      // if className exists in the request url
      var redirect_url = '/add_lesson_html?class_name='+queryObject.classname;
      res.redirect(redirect_url);
    }else{
      // if className doesnt exists in the request url
      res.redirect('/home');
    }

});

app.get('/home', ensureAuthenticated, function(req,res,next){
  res.sendFile(new_url +'/views/home.html');
});

app.get('/api/myclass', function(req,res,next){
  var username = '';
  if(req.session.user){
    username = req.session.user;
  }
  var hashValue= 'user:' + username + ':class';
  db.hgetall(hashValue).then(function(hash){
    res.send(hash);
  });
});

app.post('/add_lesson', function(req, res, next) {
    var hashKey =  "class:"+req.body.class_name+":lesson:"+req.body.lesson_no;
    db.hmset(hashKey,req.body);
    db.hgetall(hashKey).then(function(hash){
      res.send('success');
    });
});

function fn_clearCookie(res){
  res.clearCookie('cookieUsername');
  res.clearCookie('cookieAccType');
}

app.get('/logout', ensureAuthenticated, function(req,res,next){
  req.session.destroy(function(){
    res.redirect('/?data=logged_out');
  });
  fn_clearCookie(res);
});

function ensureAuthenticated(req,res,next){
  if(req.session.user){
    next();
  }else{
    fn_clearCookie(res);
    res.redirect('/?data=not_login');
  }
}

app.post('/login', function(req, res, next) {
    var hashValue = 'user:' + req.body.username;
    db.hget(hashValue, "password").then(function(db_password) {
        if (db_password == null) {
            res.json({
                error: 'Username doesnot match'
            });
        } else if (db_password != req.body.password) {
            res.json({
                error: 'Password doesnot match'
            });
        } else {
            req.session.user = req.body.username;
            db.hget(hashValue, "acc_type").then(
                function(db_acc_type) {
                  req.session.acc_type = db_acc_type;
                  res.cookie('cookieUsername',req.body.username,{
                    httpOnly : false,
                    secure : false
                  });
                  res.cookie('cookieAccType',db_acc_type,{
                    httpOnly : false,
                    secure : false
                  });

                  res.json({
                      success: db_acc_type,
                      username:req.body.username
                  });
                });
        }
    });
});


app.get('/all_classes', function(req, res, next) {
  res.sendFile(new_url +'/views/classes.html');
});


function  className(callback){
  db.keys('classes:*').then(function(hash){
    if(hash.length > 0){
      arrClassName = hash;
      callback(null,arrClassName);
    }else{
      return callback(new Error('No classes found'));
    }
  });
}

function classDesc(callback){
  var arrClassDesc=[];
  for(var i = 0; i < arrClassName.length; i++){
    db.hget(arrClassName[i],"class_description").then(function(hash){
      arrClassDesc.push(hash);
      if(arrClassName.length ==  arrClassDesc.length){
          callback(null,arrClassDesc);
      }
    });
  }
}

app.get('/api/allclasses', function(req,res,next) {
  async.series([className,classDesc],function(err,callback){
    if(err){
      res.send('error');
    }else{
      res.send(callback);   // contains both the classnames and class description in an array..
    }
  });
});

app.post('/user_registration', function(req, res, next) {
  var hashKey = "user:"+req.body.username;
  db.hmset(hashKey,req.body);
  db.hgetall(hashKey).then(function(hash){
    res.send('success');
  });
});

app.post('/register_class',function(req,res,next){
  var hashKey = "user:"+req.body.username+":class", data = '';
  db.hsetnx(hashKey,req.body.class_name,"true").then(function(hash){
    if(hash == 1){
      data = 'success';
    }else{
      data = 'error';
    }
    res.send(data);
  });
});
