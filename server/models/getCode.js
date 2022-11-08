const mongoose = require('mongoose')
 
module.exports = mongoose.model('code',mongoose.Schema({
  _id:String,
  phone: String,
  code:String,
  sendTime:String
}))