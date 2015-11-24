var express = require('express');
var router = express.Router();
var crypto = require('crypto'),
    User = require('../models/user.js'),
    Post = require('../models/post.js'),
    Comment = require('../models/comment.js');

///* GET home page. */
//router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Express' });
//});
//
//module.exports = router;
module.exports = function(app){
   app.get('/',function(req,res){
    var page = req.query.p ? parseInt(req.query.p) : 1;
    Post.getTen(null,  page, function(err, posts, total){
      if(err){
        posts = [];
        // console.log('error');
      }  
      console.log(posts.tags);
      res.render('index',{
        title: "Index Page",
        user:  req.session.user,
        posts: posts,
        page: page,
        isFirstPage: (page - 1) == 0,
        isLastPage : ((page - 1)*10 + posts.length) == total,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    })
   });
   app.get('/login',    checkNotLogin);
   app.get('/login',    function(req,res){
      res.render('login',{
        title:"登录",
        user:  req.session.user,
        success:  req.flash('success').toString(),
        error: req.flash('error').toString()
       })
  });
   app.post('/login',   checkNotLogin);
   app.post('/login',   function(req,res){
        // debugger;
        console.log(req.body.name,req.body.password);
        var md5 = crypto.createHash('md5'),
              password = md5.update(req.body.password).digest('hex');
        User.get(req.body.name, function(err, user){
          if(!user){
            req.flash('error', 'user not exsit!');
            return res.redirect('/login');//if user not exsit  turn to login page
          }
          //check password 
          if(user.password != password){
            req.flash('error', 'password is error !');
            return res.redirect('/login');//password errot turn to login page
          }
          //login right put userinfo into session
          req.session.user = user;
          req.flash('success', 'login success!');
          res.redirect('/');//login success turn page to index
        });
  });
  app.get('/reg', checkNotLogin);
  app.get('/reg',function(req,res){
    res.render('register',{
        title: "注册",
        user:  req.session.user,
        success:  req.flash('success').toString(),
        error: req.flash('error').toString()
    });
  });
  app.get('/new',   checkLogin);
  app.get('/new',   function(req,res){
    res.render('new',{title:"发表",
      user:  req.session.user,
      success:  req.flash('success').toString(),
      error: req.flash('error').toString()
     })
  });
  app.post('/new',  checkLogin);
  app.post('/new',function(req, res){
    var currentUser = req.session.user,
          tags = [req.body.tag1, req.body.tag2, req.body.tag3],
          post = new Post(currentUser.name, currentUser.head, req.body.title, tags, req.body.post);
          console.log(tags);
    post.save(function(err){
      if(err){
        req.flash('error', err);
        return res.redirect('/');
      }
      req.flash('success', 'article submit success!');
      res.redirect('/');
    })
  });
  app.get('/loginout', checkLogin);
  app.get('/loginout',function(req,res){
     req.session.user = null;
     req.flash('success', 'loginout success!');
     res.redirect('/');//login out success turn page to index
  });
  app.get('/upload', checkLogin);
  app.get('/upload', function(req, res){
    res.render('upload',{
      title : 'file upload',
      user : req.session.user,
      success : req.flash('success').toString(),
      error : req.flash('error').toString()
    })
  });
  app.post('/upload', checkLogin);
  app.post('/upload', function(req, res){
    req.flash('success', 'file upload success!');
    res.redirect('/upload');
  });
  app.get('/u/:name', function(req, res){
    //check user exsit
    User.get(req.params.name, function(err, user){
      if(!user){
        req.flash('error', 'User not exist!');
        return res.redirect('/');//user not exist turn to index
      }
      var page = req.query.p ? parseInt(req.query.p) : 1;
      //select and return result
      Post.getTen(user.name, page,function(err, posts, total){
        if(err){
          req.flash('error', err);
          return res.redirect('/');
        }
        res.render('user', {
          title : user.name,
          posts : posts,
          page: page,
          isFirstPage: (page - 1) == 0,
          isLastPage: ((page - 1) * 10 + posts.length) == total,
          user : req.session.user,
          success : req.flash('success').toString(),
          error : req.flash('error').toString()
        })
      })
    })
  });
  app.get('/u/:name/:day/:title', function(req, res){
    Post.getOne(req.params.name, req.params.day, req.params.title, function(err, post){
      if(err){
        req.flash('error', err);
        return res.redirect('/');
      }
      console.log(post);
      res.render('article',{
        title : req.params.title,
        post : post,
        user : req.session.user,
        success : req.flash('success').toString(),
        error : req.flash('error').toString()
      })
    })
  });
  app.post('/u/:name/:day/:title', function(req, res){
    var date = new Date(),
          time = date.getFullYear() + "-" + (date.getMonth() + 1)  + "-" + date.getDate() + "" + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
    var md5 = crypto.createHash('md5'),
          email_MD5 = md5.update(req.body.email.toLowerCase()).digest('hex'),
          head = "http://www.gravatar.com/avatar" + email_MD5 + "?s=48";
    var comment = {
          name : req.body.name,
          head : head,
          email : req.body.email,
          website : req.body.website,
          time : time,
          content : req.body.content
    };
    var newComment = new Comment(req.params.name, req.params.day, req.params.title, comment);
    newComment.save(function(err){
      if(err){
        req.flash('error', err);
        return res.direct('back');
      }
      req.flash('success', 'comment submit success!');
      res.redirect('back');
    })
  });
  app.get('/edit/:name/:day/:title',  checkLogin);
  app.get('/edit/:name/:day/:title',  function(req, res){
    var currentUser = req.session.user;
    Post.edit(currentUser.name, req.params.day, req.params.title,  function(err, post){
      if(err){
        req.flash('error', err);
        return res.redirect('back');
      }
      res.render('edit', {
        title : 'edit',
        post : post,
        user : req.session.user,
        success : req.flash('success').toString(),
        error : req.flash('error').toString()
      })
    })    
  });
  app.post('/edit/:name/:day/:title', checkLogin);
  app.post('/edit/:name/:day/:title',function(req, res){
    var currentUser = req.session.user;

    Post.update(currentUser.name, req.params.day, req.params.title,req.body.post,function(err){
      var url = encodeURI('/u/' + req.params.name + '/' + req.params.day + '/' + req.params.title);
      if(err){
        req.flash("error", err);
        return res.redirect(url);// error turn to index page
      }
      req.flash('success','update article success!');
      res.redirect(url);//success return article
    });
  });
  app.get('/remove/:name/:day/:title', checkLogin);
  app.get('/remove/:name/:day/:title',function(req, res){
    var currentUser = req.session.user;
    Post.remove(currentUser.name, req.params.day, req.params.title, function(err){
      if(err){
        req.flash('error', err);
        return res.redirect('back');
      }
      req.flash('success', 'remove success!');
      res.redirect('/');
    })
  })
  app.get('/archive', function(req, res){
    Post.getArchive(function(err, posts){
      if(err){
        req.flash('error',err);
        return res.redirect('/');
      }
      res.render('archive',{
        title : '存档',
        posts: posts,
        user : req.session.user,
        success : req.flash('success').toString(),
        error : req.flash('error').toString()
      })
    })
  })
  app.get('/tags',function(req,res){
    Post.getTags(function(err, posts){
      if(err){
        req.flash('error', err);
        return res.redirect('/');
      }
      res.render('tags', {
        title : 'tags',
        posts :posts,
        user: req.session.user,
        success :req.flash('success').toString(),
        error : req.flash('error').toString()
      });
    })
  });
  app.get('/tags/:tag',function(req,res){
    Post.getTag(req.params.tag, function(err, posts){
      if(err){
        req.flash('error', err);
        return res.redirect('/');
      }
      res.render('tag', {
        title : 'TAG:' + req.params.tag,
        posts :posts,
        user: req.session.user,
        success :req.flash('success').toString(),
        error : req.flash('error').toString()
      });
    })
  });
  app.get('/search', function(req, res){
    Post.search(req.query.keyword, function(err, posts){
      if(err){
        req.flash('error', err);
        return res.redirect('/');
      }
      res.render('search', {
        title : "SEARCH:" + req.query.keyword,
        posts : posts,
        user : req.session.user,
        success : req.flash('success').toString(),
        error : req.flash('error').toString()
      })
    })
  })
  app.get('/links', function(req, res){
    res.render('links', {
      title : "firend links",
      user : req.session.user,
      success : req.flash('success').toString(),
      error : req.flash('error').toString()
    })
  })
  app.post('/reg', checkNotLogin);
  app.post('/reg',function(req,res){
  var name = req.body.name,
      password = req.body.password,
      password_re = req.body['password-repeat'];
      console.log(name,password,password_re,req.body.email);
    if(password != password_re){
        req.flash('error',  '两次输入的密码不一致！');
        return res.redirect('/reg');//返回注册页面
    }
    //生成密码的md5值
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    var newUser = new User({
        name:  name,
        password:  password,
        email: req.body.email
    });
    User.get(newUser.name,function(err, user){
        if(err){
            req.flash('error','用户名已经存在！');
            return res.redirect('/');
        }
        if(user){
            req.flash('error','用户已存在！');
            return res.redirect('/reg');
        }
        //如果不存在则添加用户
        newUser.save(function(err,user){
            if(err){
                req.flash('error',err);
                return res.redirect('/reg');//注册失败返回注册页
            }
            req.session.user = user;//用户信息存入session
            req.flash('success','注册成功');
            res.redirect('/');//注册成功后返回主页
        });
    });
    });
   app.use(function(req, res){
    res.render('404')
  })
}
function checkLogin(req, res, next){
  if(!req.session.user){
    req.flash('error', 'not sign in!');
    res.redirect('/login');
  }
  next();
}
function checkNotLogin(req, res, next){
  if(req.session.user){
    req.flash('error', 'you are already login in!');
    res.redirect('back');
  }
  next();
}