const { Router } = require('express')

const {
  createUser, getUser, getAllUsers, deleteUser, editUsers,
} = require('../controllers/users.controller')
const { verifyToken } = require('../utils/helpers')

const usersRouter = Router()

usersRouter.get('/',verifyToken,getAllUsers)
usersRouter.post('/', createUser)
usersRouter.get('/:username', verifyToken,getUser)
usersRouter.delete('/:id',verifyToken,deleteUser)
usersRouter.put('/:id',verifyToken,editUsers)

module.exports = usersRouter