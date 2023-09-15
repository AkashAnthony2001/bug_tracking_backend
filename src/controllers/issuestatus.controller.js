const issuestatus = require('../models/issuestatus.model')

const getIssueStatus = async (req, res) => {
    try {
        const issueStatusData = await issuestatus.find()

        if (!issueStatusData) {
            res.status(404).json({ message: "failed", error: true, status: 404, response: issueStatusData })
        }
        res.status(200).json({ message: "success", error: false, status: 200, response: issueStatusData })
    } catch (error) {
        res.send(error)
    }
}

const createIssueStatus = async (req, res) => {
    try {
        const { bugid, status, createdby } = req.body;
        const issueStatusData = new issuestatus({
            bugid: bugid,
            status: status,
            createdby: createdby
        })
        const result = await issueStatusData.save()
        res.send(result)
    } catch (error) {
        res.send(error)
    }
}

const getByBugId = async (req, res) => {
    const bugid = req.params.id
    try {
        const statusData = await issuestatus.find({ bug_id: bugid });
        if (statusData.length > 0) {
            res.status(200).send({ message: "Success", error: false, response: statusData, status: 200 })
            return;
        }
        res.status(404).send({ message: "No Data Found", error: true, response: statusData, status: 404 })
    }
    catch (error) {
        res.status(500).send({ error: "Error while fetching Data" })
    }
}

const updateIssueStatus = async (req, res) => {
    const id = req.params.id;
    try {
        const { bugid, status, createdby, comment } = req.body
        const dataToUpdate = {
            bugid: bugid,
            status: status,
            createdby: createdby,
            comments:comment
        }
        console.log(dataToUpdate);
        const updatedData = await issuestatus.findByIdAndUpdate(id, dataToUpdate, { new: true })
        console.log(updatedData);
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

module.exports = { getIssueStatus, createIssueStatus, updateIssueStatus, deleteIssueStatus, getByBugId }