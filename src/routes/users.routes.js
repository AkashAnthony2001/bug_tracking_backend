const { Router } = require('express')

const {
  createUser, getUser, getAllUsers,
} = require('../controllers/users.controller')

const usersRouter = Router()

usersRouter.get('/',getAllUsers)
usersRouter.post('/', createUser)
usersRouter.get('/:username', getUser)

module.exports = usersRouter