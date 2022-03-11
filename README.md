# 小逻辑
## 项目启动
* 将sql/database.sql文件导入数据库
* 安装依赖
```bash
npm install 
```
* 启动项目
```bash
npm run start
```

## 接口文档
### 登录

* 接口地址：<服务器>/api/login
* 请求类型：post
* 请求参数：

```json
{
  "account": "15344278953",
  "password": "123456"
}
```

| 字段名      | 类型     | 是否必填 | 描述   |
|----------|--------|------|------|
| account  | string | 是    | 账号   |
| password | string | 是    | 密码   |
* 返回值：

```json
{
  "code": 1,
  "message": "登录成功！",
  "data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImI0ODI2ZjZlLTZjZGYtNDFlNi1iMzVjLWIxYmNlMjhmNzFkZiIsInJvbGUiOlt7ImdvcnVwX25hbWUiOiLnrqHnkIblkZgiLCJnb3J1cF9pZCI6ImQ2YWI3M2UyLWFlNjAtNDZjNC1hYzRiLTUxYWYzZTkxMjYwMiJ9XSwiaWF0IjoxNjQ2OTY4NDk4LCJleHAiOjE2NDcwNTQ4OTh9.01-jJ0vaR00IwkImRKVkdSajQLYExlBBCpraYVMFaA0"
}
```

### 用户

#### 添加用户

* 接口地址：<服务器>/api/user/create
* 请求类型：post
* 请求参数：


```json
{
  "account": "15344278953",
  "password": "123456",
  "username": "zs"
}
```

| 字段名      | 类型     | 是否必填 | 描述   |
|----------|--------|------|------|
| account  | string | 是    | 账号   |
| password | string | 是    | 密码   |
| username | string | 否    | 用户名字 |


#### 获取用户列表

* 接口地址：<服务器>/api/user/getList?pageIndex=1&pageSize=20
* 请求类型：get
* 请求参数：
```json
{
  "pageIndex": 1,
  "pageSize": 20
}
```

| 字段名       | 类型     | 是否必填 | 描述     |
|-----------|--------|------|--------|
| pageIndex | number | 是    | 当前页    |
| pageSize  | number | 是    | 每页显示数量 |

* 返回值：
```json
{
  "code": 1,
  "message": "获取成功！",
  "data": [
    {
      "username": "张三", // 用户名
      "password": "e10adc3949ba59abbe56e057f20f883e", // 加密后密码
      "ID": "a056f9b0-3bf2-445b-8b6a-befaf5b0038d",
      "account": "18313273917", // 账号
      "create_time": "2022-03-11T07:37:53.000Z", // 创建时间
      "update_time": "2022-03-11T07:37:53.000Z", // 更新时间
      "parent_id": "b4826f6e-6cdf-41e6-b35c-b1bce28f71df"
    }
    ...
  ]
}
```
