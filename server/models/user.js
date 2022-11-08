const mongoose = require('mongoose')
 
module.exports = mongoose.model('user', mongoose.Schema({
    _id: String,
    phone: String,
    password:String,
}))