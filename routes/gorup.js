const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator');  // 字段校验
const db = require('../model/express');
const xiao = require('../model/tool');
const async = require('async')
/** router /api/gorup/getList
 *
 * */
router.get('/getList', (req, res) => {
    const connection = db.connection();
    async.series({
        fun1: function (done) {
            console.time('s1')
            for (let i = 0; i < req.user.role.length; i++) {
                select(req.user.role[i].gorup_id).then(res => {
                    if (res) done('', true);
                })
            }
        }
    }, function (error, result) {
        console.timeEnd('s1')
        if (result.fun1) {
            const sql = `select 
                        gorupmanager.gorup_name,gorupmanager.gorup_id,
                        gorupmanager.create_date,gorupmanager.create_date
                        from gorupmanager`;
            db.insert(connection, sql, (err, row) => {
                if (err) throw new Error(err);
                res.status(200).json(xiao.jsonP('获取成功', 1, row));
            })
        } else {
            res.status(401).json(xiao.jsonP('没有去权限访问该接口，如有需要请联系管理员开通', 0, null));
        }
    })

    /** @select 查询当前用户有没有权限访问该接口
     * @param{String} id
     * @return 返回是否有权限访问
     * */
    function select(id) {
        return new Promise((resolve, reject) => {
            const sql = `select jurisdiction_gorup.menu_name from jurisdiction_gorup where gorup_id = '${id}'`
            db.insert(connection, sql, (err, rows) => {
                if (err) reject(err);
                if (rows.length > 0) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            })
        })
    }
})
module.exports = router
