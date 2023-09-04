const Router = require('express')

const { createIssueStatus , getIssueStatus , updateIssueStatus , deleteIssueStatus } = require('../controllers/issuestatus.controller')
const issueStatusRouter = Router()

issueStatusRouter.get('/', getIssueStatus)
issueStatusRouter.post('/', createIssueStatus)
issueStatusRouter.put('/:id', updateIssueStatus)
issueStatusRouter.delete('/:id', deleteIssueStatus)

module.exports = issueStatusRouter