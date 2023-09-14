const Router = require('express')

const { createIssueStatus , getIssueStatus , updateIssueStatus , deleteIssueStatus , getByBugId} = require('../controllers/issuestatus.controller')
const { verifyToken } = require('../utils/helpers')
const issueStatusRouter = Router()

issueStatusRouter.get('/', verifyToken,getIssueStatus)
issueStatusRouter.post('/', verifyToken,createIssueStatus)
issueStatusRouter.put('/:id', verifyToken,updateIssueStatus)
issueStatusRouter.delete('/:id', verifyToken,deleteIssueStatus)
issueStatusRouter.get('/:id', verifyToken,getByBugId)

module.exports = issueStatusRouter