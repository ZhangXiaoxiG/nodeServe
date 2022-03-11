# 接口说明

- [登录](#登录)
- 用户
  - [添加用户](#添加用户)



### 登录

* 接口地址：<服务器>/api/login
* 请求类型：post
* 请求参数：

```json
{
  "account": "15313278953", //账号
  "password": "123456" // 密码
}
```
* 返回值：
```json
{
    "code": 1,
    "message": "登录成功！",
    "data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImI0ODI2ZjZlLTZjZGYtNDFlNi1iMzVjLWIxYmNlMjhmNzFkZiIsInJvbGUiOlt7ImdvcnVwX25hbWUiOiLnrqHnkIblkZgiLCJnb3J1cF9pZCI6ImQ2YWI3M2UyLWFlNjAtNDZjNC1hYzRiLTUxYWYzZTkxMjYwMiJ9XSwiaWF0IjoxNjQ2OTY4NDk4LCJleHAiOjE2NDcwNTQ4OTh9.01-jJ0vaR00IwkImRKVkdSajQLYExlBBCpraYVMFaA0"
}
```
### 添加用户
