const express = require('express');
require('express-async-errors');

const app = express();
const cors = require('cors');

const nodesRouter = require('./routes/nodes');
const locationsRouter = require('./routes/locations');
const nodeLocationsRouter = require('./routes/node_locations');
const componentsRouter = require('./routes/components');
const nodeComponentsRouter = require('./routes/node_components');
const variablesRouter = require('./routes/variables');
const componentVariablesRouter = require('./routes/component_variables');
const averageReadingsRouter = require('./routes/average_readings');
const userRolesRouter = require('./routes/user_roles');
const userAccountsRouter = require('./routes/user_accounts');

const middleware = require('./utils/middleware');

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
app.use('/api/user_roles', userRolesRouter);
app.use('/api/user_accounts', userAccountsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
