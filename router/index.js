const express = require('express');
const jwt = require('jsonwebtoken')
const Routers = express.Router();

const { secretKey } =require('../token/constant')
// 全局验证Token是否合法
const tokens = require('../token/index')

Routers.use(tokens)



// 如果token过期或者 错误的处理
Routers.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {   
        //  这个需要根据自己的业务逻辑来处理（ 具体的err值 请看下面）
      res.status(401).send('非法token');
    }
  })


// 验证服务是否开启
Routers.get('/', (req,res) => {
    
    console.log(req.user);  //解析token，获取token携带的数据

    res.json({
        code: 0,
        msg: '查询成功',
        data:{
            username: '这是首页'
        }
    })
})

// 登陆并生成token
Routers.get('/load', (req,res) => {

    let tokenObj={   //携带参数
        id: 1,
        username: '小明'
    }
    let tokenKey = secretKey  //加密内容

    let token = jwt.sign(tokenObj,tokenKey,{
        expiresIn: 60*60*24   // token时长
    })

    res.json({
        code: 0,
        msg: '查询成功',
        token:token,
        data:{
            username: '12456'

        }
    })
})


module.exports = Routers;