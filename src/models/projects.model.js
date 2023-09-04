const mongoose = require("mongoose")

const projectSchema = mongoose.Schema({
    id:{
        type:Number,
        require:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    projectRoute:{
        type:String,
        required:true
    }
})

const projects = mongoose.model('projects',projectSchema)

module.exports = projects