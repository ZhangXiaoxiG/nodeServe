const express = require('express');
const router = express.Router();
const user_handler = require('../routers-map/user.js')
router.get('/checkUserInfo', (req, res) => {
    const data = {
        role: req.user.role
    }
    res.jsonp(xiao.jsonP('', 1, data))
})
// 获取用户列表
router.get('/getList', user_handler.getUserList)
// 创建用户
router.post('/create', user_handler.createUser);

module.exports = router;
