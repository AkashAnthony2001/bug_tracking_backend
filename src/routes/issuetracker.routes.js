const Router = require('express')

const { getBugs , createBugs , updateBugs , deleteBugs , assignedTo , reportedBy , generateBugId , getBugsBySprint , getUsersSprintData , barAssignClosed } = require('../controllers/issuetracker.controller')

const issueTrackerRouter = Router();


issueTrackerRouter.get('/', getBugs)
issueTrackerRouter.get('/bySprint/', getBugsBySprint)
issueTrackerRouter.get('/assigned/:username', assignedTo)
issueTrackerRouter.get('/reported/:username', reportedBy)
issueTrackerRouter.post('/', createBugs)
issueTrackerRouter.put('/:id', updateBugs)
issueTrackerRouter.delete('/:id', deleteBugs)
issueTrackerRouter.post('/generateId/',generateBugId)
issueTrackerRouter.get('/userSprint',getUsersSprintData)
issueTrackerRouter.get('/status',barAssignClosed)

module.exports = issueTrackerRouter