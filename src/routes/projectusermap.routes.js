const { Router } = require('express')

const { getProjectsData , createProjectData } = require("../controllers/projectusermap.controller")

const projectMapRouter = Router()

projectMapRouter.get('/', getProjectsData)
projectMapRouter.post('/', createProjectData)

module.exports = projectMapRouter