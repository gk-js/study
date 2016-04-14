var express = require('express');
var router = express.Router();

/* detail page */
router.get('/', function(req, res, next){
    var id = req.params.id;
    res.render('detail', {}); 
});

module.exports = router;