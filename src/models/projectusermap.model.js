const { Schema} = require('mongoose')
const mongoose = require('mongoose')

const projectUserMapSchema = new Schema({
    username:{
        type: Schema.Types.ObjectId,
        ref: 'users',
        required:true
    },
    projectId:{
        type: Schema.Types.ObjectId,
        ref: 'projects',
        required:true
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:'users',
        required:true
    }
},
{
    timestamps:true
})

const projectUserMap = mongoose.model('projectUserMap', projectUserMapSchema)


module.exports = projectUserMap