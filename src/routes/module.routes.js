const { Router } = require('express')

const { getAllModules , createModule , updateModule , deleteModule } = require('../controllers/module.controller')
const { verifyToken } = require('../utils/helpers')

const moduleRouter = Router()

moduleRouter.get('/', verifyToken,getAllModules)
moduleRouter.post('/', verifyToken,createModule)
moduleRouter.put('/:id', verifyToken,updateModule)
moduleRouter.delete('/:id', verifyToken,deleteModule)


module.exports = moduleRouter