const express = require('express');
const router = express.Router();
const db = require('../model/express');
const xiao = require('../model/xiao');
const jwt = require('jsonwebtoken');
const md5 = require('md5-node')
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
    const sql = `SELECT * from user_tbl where account=${data.account} and password = '${md5(data.password)}'`
    db.insert(connection, sql, (err, rows) => {
        try {
            if (err) new Error(err);
            if (rows.length !== 0) {
                const selectSql = `select gorupmaster.gorup_name,gorupmaster.gorup_id from gorupmaster where user_id = '${rows[0].ID}'`
                db.insert(connection,selectSql,(error,data) => {
                    if (error) throw new Error(err);
                    const payload = {
                        id: rows[0].ID,
                        role:data
                    }
                    const secret = 'ILOVE'
                    const token = jwt.sign(payload, secret, { expiresIn: 3600 * 24  })
                    const query = {
                        token: token
                    }
                    return res.jsonp(xiao.jsonP('登录成功', 1, query))
                })
            } else {
                return res.jsonp(xiao.jsonP('登录失败，请检查账号密码是否正确', 0, null))
            }
        }
        catch (err) {
            console.log(err)
            res.status(500)
        }

    })
})
module.exports = router;
