const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator');  // 字段校验
const db = require('../model/express');
const xiao = require('../model/xiao');
// 获取菜单
router.get('/getMenuList', (req, res) => {
    const connection = db.connection();  // 数据库
    let sql1 = `select gorupmaster.gorup_id from gorupmaster where user_id = '${req.user.id}'`
    db.insert(connection,sql1,(err,rows) => {
        try {
            if (err) throw new Error(err);
            if (rows.length > 0) {
                const selectSql = `SELECT menu_tbl.ID,menu_tbl.Text,menu_tbl.Url,
                            menu_tbl.icon,menu_tbl.menu_order,menu_tbl.parent_id 
                            from  menu_tbl,jurisdiction_gorup WHERE 
                            menu_tbl.ID = jurisdiction_gorup.menu_id 
                            AND jurisdiction_gorup.gorup_id = '${rows[0].gorup_id}' 
                            ORDER BY menu_order LIMIT 0,1000`
                db.insert(connection,selectSql,(error,data) => {
                    if (error) throw new Error(error)
                    res.jsonp(xiao.jsonP('获取成功', 1, xiao.toThree(data)))
                })
            } else {
                res.jsonp(xiao.jsonP('当前用户未分配角色', 0, null))
            }
        }
        catch (err) {
            res.status(500)
            console.log(err)
        }
    })
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
        let str = ''
        for (let key in req.body) {
            if (key !== 'id') {
                str += '\`' + key + '\`' + ' = \'' + req.body[key] + '\','
            }
        }
        if (str.length > 0) str = str.substring(0,str.length - 1);
        const connection = db.connection();
        const sql = `UPDATE \`baby\`.\`menu_tbl\` SET ${str}  where \`ID\`='${id}'`
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
