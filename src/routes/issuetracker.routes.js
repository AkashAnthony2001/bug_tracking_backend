const Router = require('express')

const { getBugs , createBugs , updateBugs , deleteBugs , assignedTo , reportedBy , generateBugId , getBugsBySprint , getUsersSprintData , barAssignClosed } = require('../controllers/issuetracker.controller');
const { verifyToken } = require('../utils/helpers');

const issueTrackerRouter = Router();


issueTrackerRouter.get('/', verifyToken,getBugs)
issueTrackerRouter.get('/bySprint/', verifyToken,getBugsBySprint)
issueTrackerRouter.get('/assigned/:username', verifyToken,assignedTo)
issueTrackerRouter.get('/reported/:username', verifyToken,reportedBy)
issueTrackerRouter.post('/', verifyToken,createBugs)
issueTrackerRouter.put('/:id', verifyToken,updateBugs)
issueTrackerRouter.delete('/:id', verifyToken,deleteBugs)
issueTrackerRouter.post('/generateId/',verifyToken,generateBugId)
issueTrackerRouter.get('/userSprint',verifyToken,getUsersSprintData)
issueTrackerRouter.get('/status',verifyToken,barAssignClosed)

module.exports = issueTrackerRouter