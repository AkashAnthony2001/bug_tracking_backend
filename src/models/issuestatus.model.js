const mongoose = require('mongoose')
const { Schema } = require('mongoose')


const issueStatusSchema = new mongoose.Schema({
    bug_id:{
        type: String,
        required:true
    },
    status:{
        type: String,
        required:true
    },
    createdby:{
        type: Schema.Types.ObjectId,
        ref:'users',
        required:true
    }
},
{
    timestamps:true
})

const issueStatus = mongoose.model('issuestatus',issueStatusSchema)

module.exports = issueStatus;