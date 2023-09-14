const projectModuleMap = require('../models/projectmodulemap.model')

const getProjectsData = async (req, res) => {
    try {
        const projectModuleMapData = await projectModuleMap.find().populate('username').populate('projectId').populate('moduleId').exec();
        res.json(projectModuleMapData)
    }
    catch (error) {
        res.send(error)
    }
}


const getProjectsDataByUsername = async (req, res) => {
    try {
        const username = req.params.username;
        const projectModuleMapData = await projectModuleMap.find().populate({path:'username',$match:{$in:username}}).populate('projectId').populate('moduleId').exec();

        if(projectModuleMapData.username.length === 0){
            res.json("No Records Found")
        }
        res.json(projectModuleMapData)
    }
    catch (error) {
        res.send(error)
    }
}


const createProjectData = async (req, res) => {
    try {
        const { username, projectId, moduleId, createdBy } = req.body
        const dataToCreate = new projectModuleMap({
            username: username,
            projectId: projectId,
            createdBy: createdBy,
            moduleId: moduleId
        })
        const result = await dataToCreate.save()
        res.send(result)
    } catch (error) {
        res.status(500).send(error)
    }
}

module.exports = { getProjectsData, createProjectData, getProjectsDataByUsername }