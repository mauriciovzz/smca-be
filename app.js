const express = require('express')
const app = express()
const cors = require('cors')
const nodesRouter = require('./controllers/nodes')
const locationsRouter = require('./controllers/locations')
const valuesRouter = require('./controllers/values')
const variablesRouter = require('./controllers/variables')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/nodes', nodesRouter)
app.use('/api/locations', locationsRouter)
app.use('/api/variables', variablesRouter)
app.use('/api/values', valuesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app