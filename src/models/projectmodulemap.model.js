const mongoose = require('mongoose')
const { Schema} = require('mongoose')


const projectModuleMapSchema = new mongoose.Schema({
    projectId:{
        type: Schema.Types.ObjectId,
        ref:'projects',
        required: true
    },
    moduleId:{
        type: Schema.Types.ObjectId,
        ref:'modules',
        required:true
    },
    username:{
        type: Schema.Types.ObjectId,
        ref:'users',
        required:true
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref:'users',
        required:true
    }
},
{
    timestamps:true
})

const projectModuleMap = mongoose.model('projectModuleMap', projectModuleMapSchema)


module.exports = projectModuleMap