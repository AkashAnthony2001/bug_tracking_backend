const Router = require('express')

const { getBugs , createBugs , updateBugs , deleteBugs , assignedToMe , reportedByMe , generateBugId , getBugsBySprint , getUsersSprintData , barAssignClosed , updateSprint, updateAllBugs} = require('../controllers/issuetracker.controller');
const { verifyToken } = require('../utils/helpers');

const issueTrackerRouter = Router();


issueTrackerRouter.get('/', verifyToken,getBugs)
issueTrackerRouter.get('/bySprint/', verifyToken,getBugsBySprint)
issueTrackerRouter.get('/assigned/:username', verifyToken,assignedToMe)
issueTrackerRouter.get('/reported/:username', verifyToken,reportedByMe)
issueTrackerRouter.post('/', verifyToken,createBugs)
issueTrackerRouter.put('/:id', verifyToken,updateBugs)
issueTrackerRouter.delete('/:id', verifyToken,deleteBugs)
issueTrackerRouter.post('/generateId/',verifyToken,generateBugId)
issueTrackerRouter.get('/userSprint',verifyToken,getUsersSprintData)
issueTrackerRouter.get('/status',verifyToken,barAssignClosed)
issueTrackerRouter.put('/sprint/:id',verifyToken,updateSprint)
issueTrackerRouter.put('/updateAll/:id',verifyToken,updateAllBugs)

module.exports = issueTrackerRouter