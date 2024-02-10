const express = require('express');
require('express-async-errors');

const app = express();
const cors = require('cors');
const path = require('path');

const accountsRouter = require('./routes/accounts');
const workspacesRouter = require('./routes/workspaces');

// const nodesRouter = require('./routes/nodes');
// const locationsRouter = require('./routes/locations');
// const componentsRouter = require('./routes/components');
// const variablesRouter = require('./routes/variables');
// const nodeLocationsRouter = require('./routes/node_locations');
// const nodeComponentsRouter = require('./routes/node_components');
// const componentVariablesRouter = require('./routes/component_variables');
// const averageReadingsRouter = require('./routes/average_readings');
// const photosRouter = require('./routes/photos');

const middleware = require('./utils/middleware');

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

app.use('/api/accounts', accountsRouter);
app.use('/api/workspaces', workspacesRouter);

// app.use('/api/nodes', nodesRouter);
// app.use('/api/locations', locationsRouter);
// app.use('/api/components', componentsRouter);
// app.use('/api/variables', variablesRouter);
// app.use('/api/node_locations', nodeLocationsRouter);
// app.use('/api/component_variables', componentVariablesRouter);
// app.use('/api/node_components', nodeComponentsRouter);
// app.use('/api/average_readings', averageReadingsRouter);
// app.use('/api/photos', photosRouter);

app.use('/api/images', express.static(path.join(__dirname, 'images')));

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
