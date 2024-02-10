const logger = require('./logger');
const tokenHelper = require('./tokenHelper');

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method);
  logger.info('Path:  ', request.path);
  logger.info('Body:  ', request.body);
  logger.info('---');
  next();
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    request.authToken = authorization.replace('Bearer ', '');
  }

  next();
};

// eslint-disable-next-line consistent-return
const AccessTokenVerification = (request, response, next) => {
  try {
    request.accountId = tokenHelper.getAccountId(request.authToken);
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return response.status(403).json({ error: 'Acceso denegado.' });
    }
    if (error.name === 'TokenExpiredError') {
      return response.status(403).json({ error: error.name });
    }
  }
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
  if (error.name) logger.error(error.name);
  if (error.message) logger.error(error.message);
  if (error.code) logger.error(error.code);

  if (error.name === 'error') {
    return response.status(400).json({ error: error.message });
  }
  return next(error);
};

module.exports = {
  requestLogger,
  tokenExtractor,
  AccessTokenVerification,
  unknownEndpoint,
  errorHandler,
};
