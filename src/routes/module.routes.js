const { Router } = require('express')

const { getAllModules , createModule , updateModule , deleteModule } = require('../controllers/module.controller')

const moduleRouter = Router()

moduleRouter.get('/', getAllModules)
moduleRouter.post('/', createModule)
moduleRouter.put('/:id', updateModule)
moduleRouter.delete('/:id', deleteModule)


module.exports = moduleRouter