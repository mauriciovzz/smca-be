const express = require('express');
require('express-async-errors');

const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
// const path = require('path');

const accountsRouter = require('./routes/accounts');
const authRouter = require('./routes/auth');

const spacesRouter = require('./routes/spaces');

// const nodesRouter = require('./routes/nodes');
// const locationsRouter = require('./routes/locations');
// const componentsRouter = require('./routes/components');
// const variablesRouter = require('./routes/variables');
// const readingsRouter = require('./routes/readings');
// const photosRouter = require('./routes/photos');

const requestLogger = require('./middlewares/requestLogger');
const originVerification = require('./middlewares/originVerification');
const corsOptions = require('./config/corsOptions');
const unknownEndpointHandler = require('./middlewares/unknownEndpointHandler');
const errorHandler = require('./middlewares/errorHandler');

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);
app.use(originVerification);

app.use('/api/accounts', accountsRouter);
app.use('/api/auth/', authRouter);

app.use('/api/spaces', spacesRouter);

// app.use('/api/nodes', nodesRouter);
// app.use('/api/locations', locationsRouter);
// app.use('/api/components', componentsRouter);
// app.use('/api/variables', variablesRouter);
// app.use('/api/readings', readingsRouter);
// app.use('/api/photos', photosRouter);
// app.use('/api/images', express.static(path.join(__dirname, 'images')));

app.use(unknownEndpointHandler);
app.use(errorHandler);

module.exports = app;
