const mongoose = require('mongoose')

const moduleSchema = new mongoose.Schema({
    module_name:{
        type:String,
        required:true
    },
    module_description:{
        type:String,
        required:true
    }
})

const modules = mongoose.model('modules',moduleSchema)

module.exports = modules