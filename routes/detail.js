var express = require('express');
var router = express.Router();
var db = require('../models/db');

/* detail page */
router.get('/:id', function(req, res, next){
    // console.log(req.params)
    var id = req.params.id;
    db('SELECT * FROM products WHERE id='+ id +'', function (rows) {
        res.render('detail', {
            title: rows[0].title,
            products: rows[0]
        }); 
    });
});

module.exports = router;