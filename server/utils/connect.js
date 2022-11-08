const mongoose = require('mongoose') //导入mongoose包
 
//链接MongoDB服务器
mongoose.connect('mongodb://localhost:27017/sand',{})  //sand为要链接的数据库名
 
const connect = mongoose.connection
connect.on('open',()=>console.log('数据库链接成功'))
connect.on('error',()=>console.log('数据库链接失败'))