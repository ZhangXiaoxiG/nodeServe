const express = require('express');
const router = express.Router();
const user = require('../model/user.js');
const md5 = require('md5-node')
const async = require('async')
const jwt = require("jsonwebtoken");
router.post('/login', (req, res, next) => {
    async.waterfall([(callback) => {
        console.time('登录')
        if (!req.body.account || req.body.account.length < 6) {
            return res.status(400).json({code: -1, message: '账号格式不正确', data: null})
        }
        if (!req.body.password || req.body.password.length < 6) {
            return res.status(400).json({code: -1, message: '密码最小为6位', data: null})
        }
        const data = user.login([req.body.account, md5(req.body.password)])
        data.then(res => {
            res.length > 0 ?  callback(null, res) : callback('登录失败，请检查账号密码是否正确', null)
        }).catch(err => {
            callback('服务器错误，请稍候重试！', null)
        })
    }, (row, callback) => {
        console.log(row)
        const data = user.checkUserJurisdiction(row.map(q => q.id))
        data.then(res => {
            const token = jwt.sign({
                id: row[0].id,
                role: res
            }, 'ILOVE', {expiresIn: 3600 * 24})
            callback(null, token)
        }).catch(err => {
            callback('服务器错误，请稍候重试！', null)
        })
    }], (err, result) => {
        console.timeEnd('登录')
        if (err) {
            res.status(200).json({code: -1, message: err, data: null})
        } else {
            res.status(200).json({code: 1, message: '登录成功！', data: result})
        }
    })
})
module.exports = router;
