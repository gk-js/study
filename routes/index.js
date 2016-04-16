var express = require('express');
var router = express.Router();
var db = require('../models/db');
// console.log(db);
/* GET home page. */
router.get('/', function(req, res, next) {
    db('SELECT * FROM products WHERE 1=1 LIMIT 5',function(rows){
        // console.log(rows);
        res.render('index', { 
            title: '商城首页',
            error: {},
            products: rows
        });
    });
});

module.exports = router;
