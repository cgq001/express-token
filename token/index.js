const expressJwt = require('express-jwt');
const { secretKey } = require('./constant');

const jwtAuth = expressJwt({secret: secretKey}).unless({path:['/index/load']})


//unless 为排除那些接口

module.exports = jwtAuth;