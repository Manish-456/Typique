const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    username : { type : String, required : true},
    email : { type : String, required : true, unique : true},
    password : { type : String, required : true},
    avatar : String,
    country : String,
    worksAt : String,
    bio : String,
    webLink : String,
    verificationCode: {type : String, required : true},
    isVerified: {type : Boolean, default : false},
    
})

module.exports = mongoose.model('User', userSchema)