const express = require('express');
const router = express.Router();
const db = require('../model/express');
const tool = require('../model/tool');
const md5 = require('md5-node');
const async = require('async');
const login = require('../schema/login')
const user = require('../model/user.js');
router.get('/checkUserInfo', (req, res) => {
    const data = {
        role: req.user.role
    }
    res.jsonp(xiao.jsonP('', 1, data))
})
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
        xiao.log('get:/getUserList', err)
        res.jsonp(xiao.jsonP('', 0, err))
    }
})
// 创建用户
router.post('/create', function (req, res, next) {
        async.waterfall([(callback) => {
            const q =  login.validate(req.body)
            console.log(q)
            console.time('创建用户')
            const checkPhone = /^[1][3,4,5,7,8,9][0-9]{9}$/;
            let account = req.body.account
            let password = req.body.password
            let username = req.body.username
            if (!checkPhone.test(account)) {
                return res.status(400).json({code: -1, message: '账号格式不正确', data: null})
            }
            if (!password || password.length < 6 || password.length > 16) {
                return res.status(400).json({code: -1, message: '密码格式不正确', data: null})
            }
            const data = user.checkUser([account])
            data.then(res => {
                Number(res[0]['count(*)']) === 0 ? callback(null,[username,md5(password),tool.uuid.v4(),account]) : callback('用户已存在!', null)
            }).catch(err => {
                callback('服务器错误，请稍候重试！')
            })
        }, (row, callback) => {
            const data = user.createUser(row)
            data.then(res => {
                callback(null)
            }).catch(err => {
                callback('服务器错误，请稍候重试！')
            })
        }], (err, result) => {
            console.timeEnd('创建用户')
            if (err) {
                res.status(200).json({code: -1, message: err, data: null})
            } else {
                res.status(200).json({code: 1, message: '创建成功！', data: null})
            }
        })
    });

module.exports = router;
