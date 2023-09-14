const { Router } = require('express')

const { getAllProjects , createProject , updateProject , deleteProject } = require('../controllers/projects.controller')
const { verifyToken } = require('../utils/helpers')

const projectRouter = Router()

projectRouter.get('/', verifyToken,getAllProjects)
projectRouter.post('/', verifyToken,createProject)
projectRouter.put('/:id', verifyToken,updateProject)
projectRouter.delete('/:id',verifyToken, deleteProject)


module.exports = projectRouter