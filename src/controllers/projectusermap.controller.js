const projectUserMap = require('../models/projectusermap.model')
const users = require('../models/users.model')
const projects = require('../models/projects.model')

const getProjectsData = async(req,res) => {
    try {
        const projectUserMapData = await projectUserMap.find().populate('username').populate('projectId').exec();
        console.log(projectUserMapData);
        res.json(projectUserMapData)
    }
    catch (error) {
        res.send(error)
    }
}

const createProjectData = async(req,res) => {
    try {
        const { username , projectId ,  createdBy } = req.body
        const dataToCreate = new projectUserMap({
            username:username,
            projectId:projectId,
            createdBy:createdBy
        })
        const result = await dataToCreate.save()
        res.send(result)
    } catch (error) {
        res.status(500).send(error)
    }
}



module.exports = { getProjectsData , createProjectData }