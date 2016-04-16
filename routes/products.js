var express = require('express');
var router = express.Router();
var db = require('../models/db');

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(req.originalUrl == '/products'){
    db('SELECT * FROM products', function(rows){
      res.render('list', {
        title: '商城列表',
        products: rows
      });
    });
  }else{
    next();
  }
});

router.get('/:id', function(req, res, next){
    // console.log(req.params)
    var id = req.params.id;
    db('SELECT * FROM products WHERE id='+ id +'', function (rows) {
        // console.log(rows[0]);
        res.render('detail', {
            product: rows[0]
        }); 
    });
});


module.exports = router;
