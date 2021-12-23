const express = require('express');
const router = express.Router();
const db = require('../model/express');
const xiao = require('../model/xiao');
const jwt = require('jsonwebtoken');
const {body, validationResult} = require('express-validator');
router.post('/login',
    body('account').custom((value, {req}) => {
        const phone =/^[1][3,4,5,7,8,9][0-9]{9}$/;
        if (!phone.test(req.body.account)) {
            throw new Error('账号格式不正确！')
        }
        return true
    }),
    body('password').isLength({min: 6, max: 20}).withMessage('密码长度最小为6，最大为20。'),
    function (req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(401).json(xiao.jsonP('参数错误', 0, {errors: errors.array()}));
        }
    const data = req.body
    const connection = db.connection();  // 数据库
    let sql = `SELECT * from user_tbl where account=${data.account}`
    db.insert(connection, sql, (err, rows) => {
        err ? console.log(err) : null
        if (rows.length !== 0) {
            if (rows[0].password === data.password) {
                // Token 数据
                const payload = {
                    id: rows[0].ID
                }
// 密钥
                const secret = 'ILOVE'
// 签发 Token
                const token = jwt.sign(payload, secret, { expiresIn: '1day' })
                const data = {
                    token: token
                }
                return res.jsonp(xiao.jsonP('登录成功', 1, data))
            } else {
                return res.jsonp(xiao.jsonP('密码错误', 0, null))
            }
        } else {
            return res.jsonp(xiao.jsonP('用户不存在', 0, null))
        }
    })
})
module.exports = router;
