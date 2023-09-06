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
        const issueTrackerData = await issueTracker.findOne({ projectId: id })

        if (issueTrackerData) {
            res.status(405).json({ message: "Cannot update project assigned to a user", status: 405, error: true });
        } else {
            const dataUpdate = await projects.findByIdAndUpdate(id, dataToUpdate, { new: true });
            res.status(201).json({ message: "Success", status: 201, error: false, response: dataUpdate });
        }

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while updating the project", });
    }
}

const deleteProject = async (req, res) => {
    const id = req.params.id;

    try {
        const issueTrackerData = await issueTracker.findOne({ projectId: id });

        if (issueTrackerData) {
            res.status(405).json({ message: "Cannot delete project assigned to a user", status: 405, error: true });
        } else {
            await projects.findByIdAndDelete(id);
            res.status(200).json({ message: "Success", status: 200, error: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while deleting the project" });
    }
};



module.exports = { getAllProjects, createProject, updateProject, deleteProject }