const { Router } = require('express')

const {
  createUser, getUser, getAllUsers, deleteUser,
} = require('../controllers/users.controller')

const usersRouter = Router()

usersRouter.get('/',getAllUsers)
usersRouter.post('/', createUser)
usersRouter.get('/:username', getUser)
usersRouter.delete('/',deleteUser)

module.exports = usersRouter