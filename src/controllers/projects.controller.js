const issueTracker = require('../models/issuetracker.model')
const projects = require('../models/projects.model')
const { formatRoute } = require('../utils/helpers')
const { errorHandler } = require('../utils/middleware')


const getAllProjects = async (req, res) => {
    try {
        const allProjects = await projects.find()
        res.json(allProjects)
    }
    catch (error) {
        res.send(error)
    }
}

const createProject = async (req, res) => {
    const { title, description } = req.body;
    const projectRoute = formatRoute(title)
    try {
        const createData = new projects({
            title: title,
            description: description,
            projectRoute: projectRoute
        })
        const result = await createData.save()
        res.send(result)
    }
    catch (error) {
        res.send(error)
    }
}

const updateProject = async (req, res) => {
    const id = req.params.id;
    const { title, description } = req.body

    const dataToUpdate = {
        title: title,
        description: description
    }
    try {
        const issueTrackerData = await issueTracker.find().populate({
            path: 'projectId',
            select: '_id'
        })

        const projectData = issueTrackerData.filter(data => {
            return data.projectId._id == id
        })

        if (projectData.length > 0) {
            res.status(405).send({ message: "Cannot Update Project Assigned to a User" })
        } else {
            const dataToSet = await projects.findByIdAndUpdate(id, dataToUpdate, { new: true })
            res.json(dataToSet)
        }

    }
    catch (error) {
        res.send(errorHandler)
    }
}

const deleteProject = async (req, res) => {
    const id = req.params.id

    try {
        const issueTrackerData = await issueTracker.find().populate({
            path: 'projectId',
            select: '_id'
        })

        const projectData = issueTrackerData.filter(data => {
            return data.projectId._id == id
        })

        if (projectData.length > 0) {
            res.status(405).send({ message: "Cannot Delete Project Assigned to a User" })
        } else {
            await projects.findByIdAndDelete(id)
            res.status(204).end()
        }
    }
    catch (error) {
        res.send("Error")
    }

}


module.exports = { getAllProjects, createProject, updateProject, deleteProject }