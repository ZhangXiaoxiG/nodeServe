const db = require('../model/express');
const fs = require('fs');
const sd = require('silly-datetime');
const xiao = require("./tool");

class User {
    constructor() {
        // this.connection = db.connection()
    }
    /**
     * @function 登录
     * @description 查询用户账号密码是否正确，返回用户id
     * @param  sqlParameter{String[]} 参数数组
     * @return {Promise} 返回当前用户id
     * @version 1.0.0
     * @author brook 2022.3.10
     * */
    login(sqlParameter) {
        const sql = 'SELECT user_tbl.id from user_tbl where account=? and password =?'
        return db.insert(sql,sqlParameter)
    }

    /**
     * @function 查询用户权限
     * @description 查询用户权限，返回token
     * @param  sqlParameter{String[]} 参数数组
     * @return {Promise} 返回token
     * @version 1.0.0
     * @author brook 2022.3.10
     * */
    checkUserJurisdiction(sqlParameter) {
        const sql = 'select gorupmaster.gorup_name,gorupmaster.gorup_id from gorupmaster where user_id =?'
        return db.insert(sql,sqlParameter)
    }

    /**
     * @function 查询用户是否存在
     * @description 查询用户是否存在
     * @param  sqlParameter{String[]} 参数数组
     * @return {Promise} 返回 >0用户存在
     * @version 1.0.0
     * @author brook 2022.3.10
     * */
    checkUser(sqlParameter) {
        const sql = 'select count(*) from user_tbl where account =?'
        return db.insert(sql,sqlParameter)
    }

    /**
     * @function 创建用户
     * @description 创建一个用户
     * @param  sqlParameter{String[]} 参数数组
     * @return {Promise} 返回结果
     * @version 1.0.0
     * @author brook 2022.3.10
     * */
    createUser(sqlParameter) {
        const sql = 'INSERT INTO user_tbl(username,password,ID,account) VALUES(?,?,?,?)'
        return db.insert(sql,sqlParameter)
    }
}

const user = new User()
module.exports = user;
