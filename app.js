const express = require('express');
require('express-async-errors');

const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const accountsRouter = require('./routes/accounts');
const authRouter = require('./routes/auth');

const spacesRouter = require('./routes/spaces');
const invitationsRouter = require('./routes/invitations');
const membersRouter = require('./routes/members');
const locationsRouter = require('./routes/locations');
const variablesRouter = require('./routes/variables');
const componentsRouter = require('./routes/components');
const nodesRouter = require('./routes/nodes');

// const readingsRouter = require('./routes/readings');
// const photosRouter = require('./routes/photos');

const requestLogger = require('./middlewares/requestLogger');
const checkRequestOrigin = require('./middlewares/checkRequestOrigin');
const corsOptions = require('./config/corsOptions');
const unknownEndpointHandler = require('./middlewares/unknownEndpointHandler');
const errorHandler = require('./middlewares/errorHandler');

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);
app.use(checkRequestOrigin);
app.use(express.static(path.join(__dirname, 'images')));

app.use('/api/accounts', accountsRouter);
app.use('/api/auth/', authRouter);

app.use('/api/spaces', spacesRouter);
app.use('/api/invitations', invitationsRouter);

app.use('/api/spaces', membersRouter);
app.use('/api/spaces', locationsRouter);
app.use('/api/spaces', variablesRouter);
app.use('/api/spaces', componentsRouter);
app.use('/api/spaces', nodesRouter);

// app.use('/api/readings', readingsRouter);
// app.use('/api/photos', photosRouter);
// app.use('/api/images', express.static(path.join(__dirname, 'images')));

app.use(unknownEndpointHandler);
app.use(errorHandler);

module.exports = app;
