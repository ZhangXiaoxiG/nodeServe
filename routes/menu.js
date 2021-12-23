const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator');  // 字段校验
const db = require('../model/express');
const xiao = require('../model/xiao');
// 获取菜单
router.get('/getMenuList', (req, res) => {
    console.log(req.user)
    const connection = db.connection();  // 数据库
    let sql = `SELECT * FROM \`baby\`.\`menu_tbl\` ORDER BY menu_order LIMIT 0,1000`
    try {
        db.insert(connection, sql, (err, rows) => {
            if (err) {
                throw err
            } else {
                res.jsonp(xiao.jsonP('获取成功', 1, xiao.toThree(rows)))
            }
        })
    } catch (err) {
        console.error(err)
        xiao.log('url:post:/getMenuList',err)
    }

})
// 添加菜单
router.post('/create', body('Url').isLength({min: 1, max: 20}), body('Text').isLength({
    min: 1,
    max: 10
}), body('menu_order').isLength({min: 1, max: 10}).isInt({min: 0, max: 1000}), body('icon').isLength({
    min: 1,
    max: 10
}), function (req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(xiao.jsonP('参数错误', 0, {errors: errors.array()}));
        }
        const connection = db.connection();  // 数据库
        const {icon, Text, Url, parent_id, menu_order} = req.body
        const sql = `insert into menu_tbl(
                        ID,icon,Text,Url,parent_id,menu_order) 
                        values(
                        '${xiao.uuid.v4}','${icon}','${Text}','${Url}','${parent_id || null}','${menu_order}'
                        )`
        db.insert(connection, sql, (err, rows) => {
            if (err) throw new Error(err)
            res.jsonp(xiao.jsonP('创建成功', 1, null))
        })
    } catch (err) {
        console.log(err)
        res.jsonp(xiao.jsonP('创建失败', 0, {err}))
    }
})
// 删除菜单
router.delete('/delMenuList', (req, res) => {
    if (req.query.id) {
        const connection = db.connection();  // 数据库
        let sql = `delete from menu_tbl where id='${req.query.id}'`
        try {
            db.insert(connection, sql, (err) => {
                if (err) {
                    res.jsonp(xiao.jsonP('删除失败', 0, null))
                    throw err
                } else {
                    res.jsonp(xiao.jsonP('删除成功', 1, null))
                }
            })
        } catch (err) {
            res.jsonp(xiao.jsonP('删除失败', 0, null))
        }
    } else {
        return res.status(400).json(xiao.jsonP('参数无效', 0, null));
    }
})
// 修改菜单
router.put('/putMenuList',
    body('id').isUUID().withMessage('id无效'),
    body('Url').isLength({min: 1, max: 20}).withMessage('url长度最低为1，最长20'),
    body('Text').isLength({
        min: 1,
        max: 10
    }).withMessage('菜单名称长度最低为1，最长为20'),
    body('menu_order').isLength({min: 1, max: 10}).withMessage('序号长度不对').isInt({min: 0, max: 1000}).withMessage('序号是int类型'),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(xiao.jsonP('参数错误', 0, {errors: errors.array()}));
        }
        const {id, menu_order, parent_id, Url, Text, icon} = req.body
        const connection = db.connection();
        const sql = `UPDATE \`baby\`.\`menu_tbl\` SET \`menu_order\` ='${menu_order}' , \`Url\` ='${Url}' ,\`parent_id\` = '${parent_id || null}', \`Text\` ='${Text}' , \`icon\` ='${icon}'  where \`ID\`='${id}'`
        try {
            db.insert(connection, sql, (err) => {
                if (err) {
                    res.jsonp(xiao.jsonP('修改失败', 0, null))
                    throw err
                } else {
                    res.jsonp(xiao.jsonP('修改成功', 1, null))
                }
            })
        } catch (err) {
            res.jsonp(xiao.jsonP('修改失败', 0, null))
        }
    })
module.exports = router;
