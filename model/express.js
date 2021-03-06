let mysql = require('mysql');
const fs = require("fs");
const sd = require('silly-datetime');
const config = require('./config.json')
const db = {
    insert: function (sql, paras) {
        return new Promise((resolve,reject) => {
            const connection = this.connection()
            connection.query(sql, paras, (error, results, fields) => {
                this.close(connection)
                if (error) {
                    let err = `\n ${sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')}: error: ${error}`
                    fs.appendFile('sqlLog.txt', err, 'utf8', (err) => {
                        console.log(err)
                    })
                    reject(error)
                } else {
                    resolve(results)
                }
            });
        })

    },
    close: function (connection) {
        // 关闭连接
        connection.end(function (err) {
            if (err) {
                return;
            } else {
                console.log('关闭连接');
            }
        });
    },
    connection: function () {
        // 数据库配置
        let connection = mysql.createConnection({
            host: config.database.host,
            user:  config.database.user,
            password: config.database.password,
            database: config.database.database,
            port: config.database.port,
            multipleStatements: config.database.multipleStatements
        });
        // 数据库连接
        connection.connect(function (err) {
            if (err) {
                console.log(err);
                connection.connect()
                return;
            }
        });
        return connection;
    }
}
module.exports = db;
