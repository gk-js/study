var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { 
        title: '商城首页',
        error: {},
        products: [
            {
                id: 1, 
                title: '创新（Creative）Aurvana',
                price: '599',
                imgsrc: 'http://img10.360buyimg.com/n1/s150x150_jfs/t2188/60/1333127469/94490/25025640/5652c71dNc704a46a.jpg'
            },
            {
                id: 1, 
                title: '创新（Creative）Aurvana',
                price: '599',
                imgsrc: 'http://img10.360buyimg.com/n1/s150x150_jfs/t2188/60/1333127469/94490/25025640/5652c71dNc704a46a.jpg'
            },
            {
                id: 1, 
                title: '创新（Creative）Aurvana',
                price: '599',
                imgsrc: 'http://img10.360buyimg.com/n1/s150x150_jfs/t2188/60/1333127469/94490/25025640/5652c71dNc704a46a.jpg'
            },
            {
                id: 1, 
                title: '创新（Creative）Aurvana',
                price: '599',
                imgsrc: 'http://img10.360buyimg.com/n1/s150x150_jfs/t2188/60/1333127469/94490/25025640/5652c71dNc704a46a.jpg'
            },
            {
                id: 1, 
                title: '创新（Creative）Aurvana',
                price: '599',
                imgsrc: 'http://img10.360buyimg.com/n1/s150x150_jfs/t2188/60/1333127469/94490/25025640/5652c71dNc704a46a.jpg'
            }
        ] 
    }
    );
});

module.exports = router;
