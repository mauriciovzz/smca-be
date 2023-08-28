const express = require('express');

const app = express();
const cors = require('cors');
const schedule = require('node-schedule');

const nodesRouter = require('./controllers/nodes');
const locationsRouter = require('./controllers/locations');
const nodeLocationsRouter = require('./controllers/node_locations');
const variablesRouter = require('./controllers/variables');
const componentsRouter = require('./controllers/components');
const componentVariablesRouter = require('./controllers/component_variables');
const nodeComponentsRouter = require('./controllers/node_components');
const averageReadingsRouter = require('./controllers/average_readings');

const middleware = require('./utils/middleware');
const readingsHelper = require('./utils/readingQuerys');

schedule.scheduleJob('00 * * * *', (fireDate) => {
  readingsHelper.calculateAverageReadings(fireDate);
});

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/nodes', nodesRouter);
app.use('/api/locations', locationsRouter);
app.use('/api/node_locations', nodeLocationsRouter);
app.use('/api/variables', variablesRouter);
app.use('/api/components', componentsRouter);
app.use('/api/component_variables', componentVariablesRouter);
app.use('/api/node_components', nodeComponentsRouter);
app.use('/api/average_readings', averageReadingsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
