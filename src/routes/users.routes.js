const { Router } = require('express')

const {
  createUser, getUser, getAllUsers, deleteUser, editUsers,
} = require('../controllers/users.controller')

const usersRouter = Router()

usersRouter.get('/',getAllUsers)
usersRouter.post('/', createUser)
usersRouter.get('/:username', getUser)
usersRouter.delete('/:id',deleteUser)
usersRouter.put('/:id',editUsers)

module.exports = usersRouter