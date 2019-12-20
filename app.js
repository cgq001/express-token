
const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')

// 配置静态目录
app.use(express.static(path.join(__dirname,'public')))

// 配置body-parser
app.use(bodyParser.json({limit: '10mb'}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))

// 配置跨域
app.use(cors());

// 引入index路由文件
const index = require('./router/index')
app.use('/index',index)

// 引入index路由文件
const nottoken = require('./router/nottoken')
app.use('/nottoken',nottoken)

const port = process.env.PORT || 5005

app.listen(port,()=>{
	console.log('开启服务器')
})
