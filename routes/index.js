var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("Hello Welcome to The inventory Mangement Service Be sure That You Signup or Login to use the service.")
});

module.exports = router;
