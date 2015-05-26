var express = require('express');
var router = express.Router();

//Angular.js  route的测试
//router.get('/example', function(req, res, next) {
//    res.render('example/index', { title: 'Express' });
//});

router.get('/', function(req, res, next) {
    res.render('template/test/index', { title: 'Express' });
});

/* GET home page. */
//router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Express' });
//});

module.exports = router;
