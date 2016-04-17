var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var user = require('../models/user');

router.get('/', function(req, res, next){
    var userName = req.body.userName,
        password = req.body.password,
        re_password = req.body.re_password;
    if(password != re_password){
        return;
    }
    var md5 = crypto.create('md5'),
        password = md5.update(req.body.password).digest('hex');
    var newUser = new User({
        name: userName,
        password: password
    });
    newUser.save(function(rows){
        if(rows){
            return res.direct('/');
        }
    })
})