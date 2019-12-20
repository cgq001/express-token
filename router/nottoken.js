// 无Token 路由
const express = require('express');

const Routers = express.Router();
const moment = require('moment');
var path = require('path')
const fs = require('fs')
//获取图片等文件
var formidable = require('formidable');

//七牛云配置
const qiniu = require('qiniu')

const accessKey = '***************'
const secretKey = '***************'
const bucket = '********'


// 验证服务是否开启
Routers.get('/', (req,res) => {
    
    console.log(req.user);  //解析token，获取token携带的数据

    setTimeout(function(){
      res.json({
            code: 0,
            msg: '查询成功',
            data:{
                username: '这是首页呀'
            }
        })
    },500);
})



// 七牛云 Token
Routers.get('/uploadtoken', (req,res) => {
    
   let mac = new qiniu.auth.digest.Mac(accessKey,secretKey)
   let options = {
        scope: bucket,
        expires: 3600 * 24
   }

    let putPolicy = new qiniu.rs.PutPolicy(options)
    let uploadToken = putPolicy.uploadToken(mac)


    setTimeout(function(){
      res.json({
            code: 0,
            msg: '查询成功',
            data:{
                username: '这是首页呀',
                uploadToken: uploadToken
            }
        })
    },2000);
})

      
// 七牛云 上传
Routers.post('/upload', (req,res) => {
    let form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, filesa){
                console.log(filesa.file);
                let MathRoundNumber = Math.round(Math.random()*100000)
                 let MathRound = moment().format("YYYY_MM_DD_hh_mm_ss")
                let key = MathRound+MathRoundNumber+filesa.file.type 
                let  path= filesa.file.path


               let mac = new qiniu.auth.digest.Mac(accessKey,secretKey)
               let options = {
                    scope: bucket,
                    expires: 3600 * 24
               }

                let putPolicy = new qiniu.rs.PutPolicy(options)
                let uploadToken = putPolicy.uploadToken(mac)

                uploadFile(uploadToken, key, path).then(idea=>{
                    console.log('上传成功');
                    res.json({
                        code: 0,
                        msg: '上传成功',
                        data:{
                            url: "http://img.baidu.top/"+idea.key
                        }
                    })
                })
                .catch(err=>{
                    //其实这种情况 也上传了图片,为了严禁起见
                    if(err.key){
                        res.json({
                            code: 4,
                            msg: '上传失败',
                            data:{
                                 url: "http://img.baidu.top"+err.key
                            }
                        })
                    }else{
                        res.json({
                            code: 4,
                            msg: '上传失败',
                            data:{
                                 url: ''
                            }
                        })
                    }          
                    
                })
                

             
            //构造上传函数
              async  function uploadFile(uptoken, key, localFile) {
             
                     var config = new qiniu.conf.Config();
                        // 空间对应的机房
                        config.zone = qiniu.zone.Zone_z0;
                    var formUploader = new qiniu.form_up.FormUploader(config);
                    var putExtra = new qiniu.form_up.PutExtra();
                    return  new Promise((resolve,reject)=>{
                        // 文件上传
                            formUploader.putFile(uptoken, key, localFile, putExtra, function(respErr,
                              respBody, respInfo) {
                              if (respErr) {
                                throw respErr;
                              }
                              if (respInfo.statusCode == 200) {
                                resolve(respBody)
                              } else {
                                reject(respBody)   //其实这种情况 也上传了图片,为了严禁起见
                              }
                            })
                     })
                }  
        })
})

module.exports = Routers;