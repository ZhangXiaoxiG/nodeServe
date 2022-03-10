const express = require('express');
const router = express.Router();
const db = require('../model/express');
const xiao = require('../model/tool');
const {body, validationResult} = require('express-validator');
router.get('/getList', (req, res) => {
    try {
        const sql = `select ID,bill_type,income,expend,create_time,remark,income_explain,expend_explain,mode_of_payment from bill_tbl where user_id = '${req.user.id}'`
        const connection = db.connection();
        db.insert(connection, sql, ((err, row) => {
            if (err) throw new Error(err)
            res.jsonp(xiao.jsonP('', 1, row))
        }))
    } catch (err) {
        xiao.log('url:get:/api/bill/getList', err)
    }
})

/**
 * 添加账单参数
 * @param {string} bill_type 账单类型(y)
 * @param {number} income 收入(n)
 * @param {number} expend 支出(n)
 * @param {string} create_time 创建时间(y)
 * @param {string} remark 备注(n)
 * @param {string} income_explain 收入说明(n)
 * @param {string} expend_explain 支出说明(n)
 * @param {string} user_id 关联用户id(y)
 * @param {string} account 账号(y)
 * @param {string} mode_of_payment 支付方式
 * */
router.post('/create',
    (req, res) => {
        try {
            const data = req.body
            const connection = db.connection();
            const sql = `SELECT * FROM user_tbl WHERE ID='${req.user.id}'`
            db.insert(connection, sql, (err, rows) => {
                if (err) throw new Error(err)
                const createSql = `INSERT INTO bill_tbl(
                    ID,bill_type,income,expend,create_time,remark,income_explain,expend_explain,user_id,account
                    ) VALUES('${xiao.uuid.v4()}',
                    '${data.bill_type}','${data.income || 0}','${data.expend || 0}',
                    '${xiao.getTime()}','${data.remark}','${data.income_explain}',
                    '${data.expend_explain}','${req.user.id}','${rows[0].account}'
                    )`
                db.insert(connection, createSql, (err => {
                    if (err) throw new Error(err)
                    res.jsonp(xiao.jsonP('添加成功', 1, null))
                }))
            })
        } catch (err) {
            xiao.log('url:post:/api/bill/create', err)
            console.log(err)
        }
    })
// 删除菜单
router.delete('/delCreate', (req, res) => {
    if (req.query.id) {
        try {
            const connection = db.connection();  // 数据库
            const sql = `delete from bill_tbl where ID='${req.query.id}'`
            db.insert(connection, sql, (err) => {
                if (err) throw new Error(err)
                res.jsonp(xiao.jsonP('删除成功', 1, null))
            })
        } catch (err) {
            xiao.log('url:delete:/api/dill/delCreate', err)
            res.jsonp(xiao.jsonP('删除失败', 0, null))
            console.log(err)
        }
    } else {
        return res.status(400).json(xiao.jsonP('参数无效', 0, null));
    }
})
router.put('/editBill',
    body('id').isUUID('4').withMessage('id无效'),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(xiao.jsonP('参数错误', 0, {errors: errors.array()}));
        }
        try {
            let str = ''
            for (let key in req.body) {
                if (key !== 'id') {
                    str += '\`' + key + '\`' + ' = \'' + req.body[key] + '\','
                }
            }
            if (str.length > 0) str = str.substring(0, str.length - 1);
            let sql = `UPDATE \`baby\`.\`bill_tbl\` SET ${str} WHERE \`ID\`='${req.body.id}'`
            const connection = db.connection();
            db.insert(connection, sql, (err) => {
                if (err) throw new Error(err);
                res.jsonp(xiao.jsonP('修改成功', 1, null))
            })


        } catch (err) {
            xiao.log('url:get:/api/bill/getList', err)
            res.jsonp(xiao.jsonP('修改失败', 0, null))
        }
    })
module.exports = router;
