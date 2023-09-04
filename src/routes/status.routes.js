const Router = require('express');

const { getStatus } = require('../controllers/status.controller')

const statusRouter = Router()

statusRouter.get('/', getStatus)

module.exports = statusRouter