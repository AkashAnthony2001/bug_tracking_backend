const mongoose = require('mongoose')
const { Schema } = require('mongoose')
// const project = require('./projects.model')
// const { formatRoute } = require('../utils/helpers')

const issueTrackerSchema = new mongoose.Schema({
    bug_id:{
        type:String,
        required:true
    },
    bug_description: {
        type:String,
        required:true
    },
    projectId:{
        type: Schema.Types.ObjectId,
        ref:'projects',
        required:true
    },
    bug_type:{
        type:String,
        validate:{
            validator:function(value){
                return value === "Bug" || value === "CR" 
            }
        },
        required:true
    },
    moduleId:{
        type: Schema.Types.ObjectId,
        ref:'modules',
        required:true
    },
    status:{
        type: String,
        required:true
    },
    severity:{
        type:String,
        validate:{
            validator:function(value){
                return value === 'Minor' || value === 'Major' || value === 'Medium' || value === 'Blocker'
            }
        }
    },
    assignedTo:{
        type: Schema.Types.ObjectId,
        ref:'users',
        required:true
    },
    reportedBy:{
        type: Schema.Types.ObjectId,
        ref: 'users',
        required:true
    },
    sprint:{
        type:Number,
        required:true
    },
    customerfound:{
        type:Boolean,
        required:true
    },
    estimate_date:{
        type:Date,
        required:true
    },
    createdby:{
        type: String,
        required:true
    }
},
{
    timestamps:true
});

// issueTrackerSchema.pre('save', async function (next) {
//     if(!this.isNew){
//         return next();
//     }
//     try {
//         const projectTitle = await project.findOne({_id:this.projectId})

//         const latestBug = await this.constructor.findOne({}, {}, {sort:{ 'bug_id': -1 }});
         
//         let lastBug = 0;
//         if (latestBug) {
//             lastBug = parseInt(latestBug.bug_id.split('-')[2]);
//         }

//         const newBug_Id = (lastBug + 1).toString().padStart(5, '0');
//         this.bug_id = `${formatRoute(projectTitle.title)}-product-${newBug_Id}`;
//         next();
//     }
//     catch (error){
//         next(error);
//     }
// })


const issueTracker = mongoose.model('issuetracker', issueTrackerSchema)


module.exports = issueTracker