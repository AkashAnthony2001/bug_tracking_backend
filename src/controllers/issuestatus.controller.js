const issuestatus = require('../models/issuestatus.model')

const getIssueStatus = async (req, res) => {
    try {
        const issueStatusData = await issuestatus.find()
        .populate({path:'issuetracker',select:'bug_id'})
        .populate({path:'issuetracker',select:'status'})
        .populate({path:'issuetracker',select:'createdby'})
        .exec();
        res.send(issueStatusData)
    } catch (error) {
        res.send(error)
    }
}

const createIssueStatus = async (req, res) => {
    try {
        const { bugid , status , createdby } = req.body;
        const issueStatusData = new issuestatus({
            bugid:bugid,
            status:status,
            createdby:createdby
        })
        const result = await issueStatusData.save()
        res.send(result)
    } catch (error) {
        res.send(error)
    }
}

const updateIssueStatus = async (req, res) => {
    const id = req.params.id;
    try {
        const { bugid , status , createdby } = req.body
        const dataToUpdate = {
            bugid: bugid,
            status: status,
            createdby: createdby
        }
        const updatedData = await issuestatus.findByIdAndUpdate(id,dataToUpdate,{new:true})
        res.send(updatedData)
    } catch (error) {
        res.send(error)
    }
}

const deleteIssueStatus = async (req, res) => {
    const id = req.params.id;
    try {
        await issuestatus.findByIdAndDelete(id)
        req.status(204).end()
    } catch (error) {
        res.send(error)
    }
}

module.exports = { getIssueStatus , createIssueStatus , updateIssueStatus , deleteIssueStatus }