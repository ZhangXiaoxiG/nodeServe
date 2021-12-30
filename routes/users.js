const express = require('express');
const router = express.Router();
const db = require('../model/express');
const xiao = require('../model/xiao');
const md5 = require('md5-node')
const { body, validationResult } = require('express-validator');
// 获取用户列表
router.get('/getUserList', function (req, res, next) {
    try {
        let connection = db.connection();  // 数据库
        let sql = `select * from user_tbl`
        db.insert(connection, sql, (err, rows) => {
            if (err) new Error(err)
                res.jsonp(xiao.jsonP('', 1, rows))
        })
    } catch (err) {
        xiao.log('get:/getUserList',err)
        res.jsonp(xiao.jsonP('', 0, err))
    }
})
// 创建用户
router.post('/create',
    body('account').custom((value, { req }) => {
        const phone = /^[1][3,4,5,7,8,9][0-9]{9}$/;
        if (!phone.test(req.body.account)) {
            throw new Error('账号格式不正确！')
        }
        return true
    }),
    body('password').isLength({ min: 6, max: 20 }).withMessage('密码长度最小为6，最大为20。'),
    function (req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json(xiao.jsonP('参数错误', 0, {errors: errors.array()}));
            }
            // 获取前端传输数据
            const data = req.body
            // 连接数据库
            let connection = db.connection();  // 数据库
            let sql1 = `SELECT * from user_tbl where account=${data.account}`
            db.insert(connection, sql1, (err, rows) => {
                if (err) throw new Error(err)
                // 判断是否存在用户
                if (rows.length === 0) {
                    const creation_time = xiao.getTime()
                    const sql = `INSERT INTO user_tbl(
                        username,password,creation_time,ID,account
                        ) VALUES(
                        '${data.username}','${ md5(data.password)}','${creation_time}',
                        '${xiao.uuid.v4()}','${data.account}')`;
                    db.insert(connection, sql, (err) => {
                        if (err) throw new Error(err)
                        res.jsonp(xiao.jsonP('添加成功', 0, null))

                    })
                    db.close(connection);
                } else {
                    return res.jsonp(xiao.jsonP('用户已存在', 1, null))
                }

            })
        } catch (err) {
            xiao.log('psst:/user/create',err)
            res.jsonp(xiao.jsonP('添加失败', 0, err))
        }
    });

module.exports = router;
