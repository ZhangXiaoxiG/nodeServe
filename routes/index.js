const express = require('express');
const router = express.Router();
const db = require('../model/express');

router.get('/', function(req, res, next) {
  res.render('layout', { title: '胡子泰',content: '来啦老弟' });
});
module.exports = router;
