const mongoose = require('mongoose')
 
//只有用户进入房间才会添加到这个数据库里面 如果用户结束通话 就把相对应移出本数据库
module.exports = mongoose.model('calls',mongoose.Schema({
  _id:String,
  phone: String,
  state:Number,//状态标识 1表示正在通话 0为等待通话
  other:String,
  roomId:String,
  peerId:String
}))