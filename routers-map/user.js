const md5 = require('md5-node')
const async = require('async')
const db = require('../model/express');
const userSchema = require("../schema/user");
const tool = require("../model/tool");
// 创建用户
exports.createUser = ((req, res, next) => {
        console.log(req.user.id)
        async.waterfall([(callback) => {
            console.time('创建用户')
            // 字段校验
            const data = userSchema.validate(req.body);
            if (data.error) {
                return res.resMsg(data.error, null, -1, 400)
            } else {
                callback(null, data.value)
            }
        }, (row, callback) => {
            // 查询用户是否存在
            const sql = 'select count(*) from user_tbl where account =?'
            db.insert(sql, row.account).then(res => {
                Number(res[0]['count(*)']) === 0 ? callback(null, row) : callback('用户已存在!', null)
            }).catch(err => {
                callback('服务器错误，请稍候重试！', null)
            })
        }, (row, callback) => {
            // 创建用户
            const sql = 'insert into user_tbl set ?'
            const data = {
                username: row.username,
                password: md5(row.password),
                ID: tool.uuid.v4(),
                account: row.account,
                parent_id: req.user.id
            }
            db.insert(sql, data).then(res => {
                if (Number(res.affectedRows) === 1) {
                    callback(null)
                } else {
                    callback('创建失败！')
                }
            })
        }], (err, result) => {
            console.timeEnd('创建用户')
            if (err) {
                res.status(200).json({code: -1, message: err, data: null})
            } else {
                res.status(200).json({code: 1, message: '创建成功！', data: null})
            }
        })
    }
)
// 获取用户列表
exports.getUserList = ((req, res, next) => {
    let sql = 'SELECT * from user_tbl WHERE parent_id = ? ORDER BY ? LIMIT ?,?;'
    let pageIndex = req.query.pageIndex || 1
    let pageSize = req.query.pageSize || 100
    db.insert(sql, [req.user.id, 'creation_time', Number(pageIndex) - 1, Number(pageSize)]).then(data => {
        res.status(200).json({code: 1, message: '获取成功！', data: data})
    }).catch(err => {
        res.status(200).json({code: -1, message: '服务器错误，请稍候重试', data: null})
    })
})
