const issueStatus = require('../models/issuestatus.model')
const issuetracker = require('../models/issuetracker.model')
const projects = require('../models/projects.model')
const modules = require('../models/module.model')
const { formatRoute } = require('../utils/helpers')


const getBugs = async (req, res) => {
    try {
        const issuesData = await issuetracker.find().populate('projectId').populate('moduleId').populate({ path: 'assignedTo', select: 'username' }).populate({ path: 'reportedBy', select: 'username' }).populate({ path: 'createdby', select: 'username' }).exec()
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
            .populate({ path: 'createdby', select: 'username' })
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
        const { bug_description, bug_id, projectId, bug_type, moduleId, status, assignedTo, reportedBy, severity, sprint, customerfound, estimate_date, createdby, createddate } = req.body
        const data = new issuetracker({
            bug_id: bug_id,
            bug_description: bug_description,
            bug_type: bug_type,
            severity: severity,
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
            bug_id: bug_id,
            status: status,
            createdby: createdby
        })
        const issueData = await issueStatusData.save()
        res.send({ datas, issueData })
    } catch (error) {
        res.send(error)
    }
}

const generateBugId = async (req, res) => {
    const { projectid , moduleid } = req.body;
    try {
        const countDoc = await issuetracker.countDocuments();
        const nextBugId = `${(countDoc + 1).toString().padStart(5, '0')}`;
        const projectData = await projects.findById(projectid);
        const moduleData = await modules.findById(moduleid);

        const bugId = `${formatRoute(projectData.title)}-${formatRoute(moduleData.module_name)}-${nextBugId}`;
        console.log(projectData);
        res.status(200).json({status:200, message:"Bug Id Created", response:bugId, error:false});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while generating the bug ID' });
    }
};
const updateBugs = async (req, res) => {
    try {
        const id = req.body._id
        const { status } = req.body
        const dataToUpdate = {
            status: status,
        }
        const updatedData = await issuetracker.findByIdAndUpdate(id, dataToUpdate, { new: true })
        const issueStatusData = new issueStatus({
            bug_id: updatedData.bug_id,
            status: updatedData.status,
            createdby: updatedData.createdby,
        })
        await issueStatusData.save()
        res.status(201).json({ status: "success", error: false, message: "Status Updated" })
    } catch (error) {
        res.send(error)
    }
}

const deleteBugs = async (req, res) => {
    try {
        const id = req.params.id
        const assigned = await issuetracker.findById(id).populate('assignedTo').exec()
        if(assigned.assignedTo.length > 0 && assigned.status === "Closed"){
            const deletingBugs = await issuetracker.findByIdAndDelete(id)
            res.status(200).json({status:200 , message:"Bug Deleted ", error: false})
        }
        else{
            res.status(405).json({status:405 , message:"Cannot delete bugs assigned to user", error: false})
        }
        res.send(assigned)
    } catch (error) {
        res.send(error)
    }
}



module.exports = { getBugs, createBugs, updateBugs, deleteBugs, assignedTo, reportedBy, generateBugId }
