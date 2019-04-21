var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express', msg: 'on va tout niquer!' });
// });

// GET home page.
router.get('/', function(req, res, next) {
  res.redirect('/catalog');
});

module.exports = router;
