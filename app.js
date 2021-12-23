const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyparser = require('body-parser'); //解析post数据
const logger = require('morgan');
const expressJWT = require('express-jwt');
const indexRouter = require('./routes/index'); // 首页路由
const usersRouter = require('./routes/users'); // 用户路由
const upLoading = require('./routes/uploading'); // 上传
const login = require('./routes/login'); // 登录
const menuRouter = require('./routes/menu'); // 菜单管理
const billRouter = require('./routes/bill'); // 菜单管理
const app = express();
app.use('/public', express.static(__dirname + '/public')); // 设置静态资源托管
app.set('views', path.join(__dirname, 'views')); // 静态页设置
app.set('view engine', 'pug');
app.use(expressJWT({
    secret: 'ILOVE', // 签名的密钥
    algorithms: ['HS256']
}).unless({
    path: ['/api/login']  // 指定不需要token解析的路径
}))
app.use(logger('dev')); // 日志
app.use(bodyparser.urlencoded({extended: false}))
app.use(bodyparser.json())
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', login);
// 设置请求头
app.all('*', (req, res, next) => {
    const {origin, Origin, referer, Referer} = req.headers;
    const allowOrigin = origin || Origin || referer || Referer || '*';
    res.header("Access-Control-Allow-Origin", allowOrigin);
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true); //可以带cookies
    res.header("Access-Control-Expose-Headers", "Set-Cookie");
    res.header("X-Powered-By", 'Express');
    if (req.method == 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }

});
// 注册路由
app.use('/api', indexRouter);
app.use('/api/menu', menuRouter);
app.use('/api/user', usersRouter);
app.use('/api/uploading', upLoading)
app.use('/api/bill', billRouter)
// 捕获404并转发到错误处理程序
app.use(function (req, res, next) {
    next(createError(404));
});
// 错误处理
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
