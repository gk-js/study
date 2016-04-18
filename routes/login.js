var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var db = require('../models/db');

router.get('/', function(req, res){
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
})