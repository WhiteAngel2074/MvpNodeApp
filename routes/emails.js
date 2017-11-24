var express = require('express');
var router = express.Router();

/* GET emails list listing. */
router.get('/', function(req, res, next) {
  res.send('all emails');
});

module.exports = router;
