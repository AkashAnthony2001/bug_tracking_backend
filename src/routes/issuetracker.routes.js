const Router = require('express')

const { getBugs , createBugs , updateBugs , deleteBugs , assignedTo , reportedBy , generateBugId } = require('../controllers/issuetracker.controller')

const issueTrackerRouter = Router();


issueTrackerRouter.get('/', getBugs)
issueTrackerRouter.get('/assigned/:username', assignedTo)
issueTrackerRouter.get('/reported/:username', reportedBy)
issueTrackerRouter.post('/', createBugs)
issueTrackerRouter.put('/:id', updateBugs)
issueTrackerRouter.delete('/:id', deleteBugs)
issueTrackerRouter.post('/generateId/',generateBugId)

module.exports = issueTrackerRouter