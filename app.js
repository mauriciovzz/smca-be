const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const nodesRouter = require('./controllers/nodes')
const locationsRouter = require('./controllers/locations')
const valuesRouter = require('./controllers/values')
const variablesRouter = require('./controllers/variables')
const middleware = require('./utils/middleware')

const mqtt = require('mqtt')
const client = mqtt.connect()
var options = {
    host: config.MQTT_HOST,
    port: config.MQTT_PORT,
    protocol: config.MQTT_PROTOCOL,
    username: config.MQTT_USERNAME,
    password: config.MQTT_PASSWORD
}
client.subscribe('#')
client.on('message', (topic, message) => {
    console.log('Received message:', topic, message.toString());
});

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