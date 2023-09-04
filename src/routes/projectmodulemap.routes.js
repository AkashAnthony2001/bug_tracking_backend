const { Router } = require('express')

const { getProjectsData , createProjectData , getProjectsDataByUsername } = require('../controllers/projectmodulemap.controller')

const moduleMapRouter = Router()

moduleMapRouter.get('/', getProjectsData)
moduleMapRouter.post('/', createProjectData)
moduleMapRouter.get('/:username', getProjectsDataByUsername)

module.exports = moduleMapRouter