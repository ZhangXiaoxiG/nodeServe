const uuid = require('uuid'); // 引入uuid
const fs = require('fs')
// 获取当前时间
const getTime = () => {
    const time = new Date()
    const n = time.getFullYear()
    const y = (time.getMonth() + 1).toString().padStart(2,'0')
    const r = time.getDate().toString().padStart(2,'0')
    const s = time.getHours().toString().padStart(2,'0')
    const f = time.getMinutes().toString().padStart(2,'0')
    const m = time.getSeconds().toString().padStart(2,'0')
    return n + '-' + y + '-' + r + ' ' + s + ':' + f + ':' + m;
}
/**
 * 统一返回数据的格式
 * @method jsonP
 * @param {String} message 错误消息
 * @param {Number}  code 错误代码
 * @param {String} data 错误提示
 * @return {Object}
* */
const jsonP =   (message, code, data) =>  {
    const query = {
        message: message,
        code: code,
        data: data
    }
    return query
}
/**
* 错误日志
* @method log
* @param {String}  err 错误代码
 *  @param {String}  module 错误发生的地方
* */
const log = (module,err) => {
    fs.appendFile('log.txt',`\n url:${module}err:${err},time:${getTime()}`,'utf8',( err ) => {
        console.log(err)
    })
}
/**
 * @method toThree
 * @param {Array} arr 一维数组
 * @returns {Array} 树形数组
* */
const toThree =  (arr) => {
    for (let i = 0;i < arr.length;i++) {
        let parentID = arr[i].parent_id
        if (parentID) {
            for (let j = 0;j < arr.length;j++) {
                if (arr[j].ID === parentID) {
                    if (!arr[j].children) {
                        arr[j].children = []
                    }
                    arr[j].children.push(arr[i])
                }
            }
        }
    }
    arr = arr.filter(ele => !ele.parent_id);
    return arr
}
const xiao = {
    getTime,
    jsonP,
    uuid,
    toThree,
log
}
module.exports = xiao
