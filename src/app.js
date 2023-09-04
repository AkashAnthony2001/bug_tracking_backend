const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('express-async-errors')
const path = require('path')
const { connectDb } = require('../src/db')

const usersRouter = require('./routes/users.routes')
const loginRouter = require('./routes/login.routes')
// const { getAssignments, getSubmissions } = require('./controllers/tickets.controller')

const middleware = require('./utils/middleware')
const projectRouter = require('./routes/project.routes')
const moduleRouter = require('./routes/module.routes')
const projectUserMapRouter = require('./routes/projectusermap.routes')
const projectModuleMapRouter = require('./routes/projectmodulemap.routes')
const issueTrackerRouter = require('./routes/issuetracker.routes')
const issueStatusRouter = require('./routes/issuestatus.routes')
const statusRouter = require('./routes/status.routes')

connectDb();

const app = express()


app.use(express.static(path.join(__dirname, 'build')))

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// app.use('/api/issues/', projectRouter)
app.use('/api/users/', usersRouter)
app.use('/api/login/', loginRouter)
app.use('/api/projects/', projectRouter)
app.use('/api/modules/' ,moduleRouter)
app.use('/api/projectusermap/', projectUserMapRouter)
app.use('/api/projectmodulemap/', projectModuleMapRouter)
app.use('/api/issuetracker/', issueTrackerRouter)
app.use('/api/issuestatus/', issueStatusRouter)
app.use('/api/status/', statusRouter)

// app.get('/api/submitted_by/:user', getSubmissions)
// app.get('/api/assigned_to/:user', getAssignments)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app