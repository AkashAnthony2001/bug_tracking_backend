const Router = require('express')

const { createIssueStatus , getIssueStatus , updateIssueStatus , deleteIssueStatus , getByBugId} = require('../controllers/issuestatus.controller')
const issueStatusRouter = Router()

issueStatusRouter.get('/', getIssueStatus)
issueStatusRouter.post('/', createIssueStatus)
issueStatusRouter.put('/:id', updateIssueStatus)
issueStatusRouter.delete('/:id', deleteIssueStatus)
issueStatusRouter.get('/:id', getByBugId)

module.exports = issueStatusRouter