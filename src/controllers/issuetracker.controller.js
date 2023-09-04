const issueStatus = require('../models/issuestatus.model')
const issuetracker = require('../models/issuetracker.model')
const users = require('../models/users.model')


const getBugs = async (req, res) => {
    try {
        const issuesData = await issuetracker.find().populate('projectId').populate('moduleId').populate('assignedTo').populate('reportedBy').populate('status').exec()
        res.send(issuesData)
    } catch (error) {
        res.send(error)
    }
}

const assignedTo = async (req, res) => {
    const username = req.params.username;
    try {
        const issuesData = await issuetracker
            .find()
            .populate('projectId')
            .populate('moduleId')
            .populate({
                path: 'assignedTo',
                select: 'username' 
            })
            .populate('reportedBy')
            .populate('status')
            .exec();
    
        console.log(issuesData);
        
        const userIssues = issuesData.filter(issue => issue.assignedTo.username === username);

        if (userIssues.length > 0) {
            res.send(userIssues);
        } else {
            res.send({ message: 'No Projects Assigned To You !' });
        }

    } catch (error) {
        res.send(error);
    }
}

const reportedBy = async (req, res) => {
    const username = req.params.username;
    try {
        const issuesData = await issuetracker
            .find()
            .populate('projectId')
            .populate('moduleId')
            .populate('assignedTo')
            .populate({
                path: 'reportedBy',
                select: 'username' 
            })
            .populate('status')
            .exec();
    
        
        const userIssues = issuesData.filter(issue => issue.reportedBy.username === username);

        if (userIssues.length > 0) {
            res.send(userIssues);
        } else {
            res.send({ message: 'No Projects Have Been Reported By You !' });
        }

    } catch (error) {
        res.send(error);
    }
}


const createBugs = async (req, res) => {
    try {
        const { bug_description, bug_id , projectId, bug_type, moduleId, status, assignedTo, reportedBy, severity, sprint, customerfound, estimate_date, createdby, createddate } = req.body
        const data = new issuetracker({
            bug_id:bug_id,
            bug_description: bug_description,
            bug_type:bug_type,
            severity:severity,
            projectId: projectId,
            moduleId: moduleId,
            status: status,
            assignedTo: assignedTo,
            reportedBy: reportedBy,
            sprint: sprint,
            customerfound: customerfound,
            estimate_date: estimate_date,
            createdby: createdby
        })
        const datas = await data.save()
        //issueStatusData
        const issueStatusData = new issueStatus({
            bug_id:bug_id,
            status:status,
            createdby:createdby
        })
        const issueData = await issueStatusData.save()
        res.send({datas,issueData})
    } catch (error) {
        res.send(error)
    }
}

const updateBugs = async (req, res) => {
    try {
        const id = req.body._id
        const { bug_description , projectId, moduleId, status, assignedTo, reportedBy, bug_type, severity, sprint, customerfound, estimate_date, createdby, createddate } = req.body
        const dataToUpdate = {
            bug_description: bug_description,
            projectId: projectId,
            moduleId: moduleId,
            status: status,
            bug_type:bug_type,
            severity:severity,
            assignedTo: assignedTo,
            reportedBy: reportedBy,
            sprint: sprint,
            customerfound: customerfound,
            estimate_date: estimate_date,
            createdby: createdby,
            createddate: createddate
        }

        console.log(req.body);
        const updatedData = await issuetracker.findByIdAndUpdate(id, dataToUpdate, { new: true })
        // console.log(updatedData);
        res.send(updatedData)
    } catch (error) {
        res.send(error)
    }
}

const deleteBugs = async (req, res) => {
    try {
        const id = req.params.id
        await issuetracker.findByIdAndDelete(id)
        res.status(204).end()
    } catch (error) {
        res.send(error)
    }
}

module.exports = { getBugs, createBugs, updateBugs, deleteBugs, assignedTo , reportedBy}