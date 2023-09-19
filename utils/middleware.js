const jwt = require('jsonwebtoken');
const config = require('./config');
const logger = require('./logger');

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
    request.token = authorization.replace('Bearer ', '');
  }

  next();
};

const tokenVerification = (request, response, next) => {
  jwt.verify(request.token, config.SECRET);
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
  if (error.name) logger.error(error.name);
  if (error.message) logger.error(error.message);
  if (error.code) logger.error(error.code);

  if (error.code === '23505') {
    return response.status(409).json({ error: 'Id existente' });
  }
  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'Token invalido' });
  }
  if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'La sesión expiró' });
  }
  if (error.name === 'error') {
    return response.status(400).json({ error: error.message });
  }
  return next(error);
};

module.exports = {
  requestLogger,
  tokenExtractor,
  tokenVerification,
  unknownEndpoint,
  errorHandler,
};
