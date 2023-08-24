const config    = require('./utils/config')
const express   = require('express')
const app       = express()
const cors      = require('cors')
const schedule  = require('node-schedule');

const nodesRouter               = require('./controllers/nodes')
const locationsRouter           = require('./controllers/locations')
const nodeLocationsRouter       = require('./controllers/node_locations')
const variablesRouter           = require('./controllers/variables')
const componentsRouter          = require('./controllers/components')
const componentVariablesRouter  = require('./controllers/component_variables')
const nodeComponentsRouter      = require('./controllers/node_components')
const averageReadingsRouter     = require('./controllers/average_readings')
const readingsRouter            = require('./controllers/readings')

const middleware = require('./utils/middleware')
const updater = require('./database/recurringQuerys')

const mqtt = require('mqtt')
var options = {
    host: config.MQTT_HOST,
    port: config.MQTT_PORT,
    protocol: config.MQTT_PROTOCOL,
    username: config.MQTT_USERNAME,
    password: config.MQTT_PASSWORD
}

var client = mqtt.connect(options);
client.subscribe('/reading')
client.on('message', (topic, message) => {
    //console.log('Received message:', topic, message.toString());
    updater.insertReading(JSON.parse(message));
});

//00 * * * *
const job = schedule.scheduleJob('0/5 * * * *',  function(fireDate){
    updater.createAverageReadings(fireDate);
});

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/nodes', nodesRouter)
app.use('/api/locations', locationsRouter)
app.use('/api/node_locations', nodeLocationsRouter)
app.use('/api/variables', variablesRouter)
app.use('/api/components', componentsRouter)
app.use('/api/component_variables', componentVariablesRouter)
app.use('/api/node_components', nodeComponentsRouter)
app.use('/api/average_readings', averageReadingsRouter)
app.use('/api/readings', readingsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app