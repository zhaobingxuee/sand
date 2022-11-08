const mongoose = require('mongoose')
 
module.exports = mongoose.model('rooms', mongoose.Schema({
    title: {type:String},
    id:{type:Number},
    sequence_value:{type:Number,default:0},
    name:{type:String}
}))