const md5 = require('md5-node')
const async = require('async')
const jwt = require("jsonwebtoken");
const loginSchema = require('../schema/login.js')
const db = require('../model/express');
// 登录处理函数
exports.login = async (req, res, next) => {
    async.waterfall([(callback) => {
        console.time('login')
        // 参数校验
        const data = loginSchema.validate(req.body);
        if (data.error) {
            return res.resMsg(data.error, null, -1, 400)
        } else {
            callback(null, data.value)
        }
    }, (row, callback) => {
        const sql = 'SELECT user_tbl.id from user_tbl where account=? and password =?'
        db.insert(sql, [row.account, md5(row.password)]).then(res => {
            res.length === 1 ? callback(null, res[0]) : callback('登录失败，请检查账号密码是否正确', null)
        }).catch(err => {
            callback('服务器错误，请稍候重试！', null)
        })
    }, (row, callback) => {
        const token = jwt.sign({
            id: row.id
        }, 'ILOVE', {expiresIn: 3600 * 24})
        callback(null, token)
    }], (err, result) => {
        console.timeEnd('login')
        if (err) {
            res.resMsg(err, null, -1, 200)
        } else {
            res.resMsg('登录成功！', {token:result}, 1, 200)
        }
    })
}

