const { Router } = require('express')

const { getAllProjects , createProject , updateProject , deleteProject } = require('../controllers/projects.controller')

const projectRouter = Router()

projectRouter.get('/', getAllProjects)
projectRouter.post('/', createProject)
projectRouter.put('/:id', updateProject)
projectRouter.delete('/:id', deleteProject)


module.exports = projectRouter