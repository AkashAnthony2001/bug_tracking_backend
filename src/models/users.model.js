const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        required:true
    }
})

const users = mongoose.model('users',userSchema)

module.exports = users;