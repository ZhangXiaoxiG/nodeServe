const express = require('express');
const router = express.Router();
const fs = require('fs')
const bodyparser = require('body-parser');//解析post数据
const multer = require('multer');
const iconvLite = require('iconv-lite');
const xiao = require('../model/xiao');
const path = require('path');
// 设置文件上传默认路径
const uploader = multer({
    dest: path.join(path.dirname(__dirname), 'public', 'images')
})
express().use(uploader.any())
const db = require('../model/express');
// 图片上传
router.post('/img', uploader.any(), (req, res) => {
    console.log(req)
    const file = req.files[0]

    //获取后缀名
    const extname = file.filename +  path.extname(file.originalname)
    // 判断格式是否为png或者jpg
    // 获取上传成功之后的文件路径
    const filepath = file.path
    // 带后缀的文件路径 重命名后的文件名
    const fileNewPath = path.join(path.dirname(__dirname), 'public', 'images') + '/' + file.originalname
    // 文件名称
    const filename = '/public/images/' + file.originalname
    /*
          重命名，借用fs的rename重命名的方法，
          第一参数是源文件地址路径，
          第二个参数是将源文件改名后的地址
          */
    fs.rename(filepath, fileNewPath, async err => {
        try {
            if (err) {
                throw err;
            } else {
                res.jsonp(xiao.jsonP('上传成功', 1, null))
            }
        }
        catch (error) {
            res.jsonp(xiao.jsonP(error, 1, null))
        }
    })
})
router.delete('/img',(req,res) => {
// 获取url参数
    if (req.query.name) {
        let src = path.join(path.dirname(__dirname), 'public/images/', req.query.name)
        fs.unlink(src,function (err) {
            try {
                if (err) {
                    throw err;
                } else {
                    res.jsonp(xiao.jsonP('删除成功', 1, null))
                }
            }
            catch (error) {
                res.jsonp(xiao.jsonP(error, 1, null))
            }
        })
    } else {
        res.jsonp(xiao.jsonP('参数错误', 1, null))
    }
})
module.exports = router;
