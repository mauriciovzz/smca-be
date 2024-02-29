const logger = require('../logger');
const tokenHelper = require('../tokenHelper');
const workspacesService = require('../../services/workspaces');
const variablesService = require('../../services/variables');
const componentsService = require('../../services/components');

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
const accessTokenVerification = (request, response, next) => {
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

// eslint-disable-next-line consistent-return
const workspaceVerification = async (request, response, next) => {
  const { workspaceId } = request.params;

  if (!await workspacesService.getOne(workspaceId)) {
    return response.status(404).json({ error: 'El espacio de trabajo no se encuentra registrado.' });
  }
  next();
};

// eslint-disable-next-line consistent-return
const workspaceAdminVerification = async (request, response, next) => {
  const { workspaceId } = request.params;

  if (!await workspacesService.isWorkspaceAdmin(workspaceId, request.accountId)) {
    return response.status(401).json({ error: 'No tienes los permisos necesarios para realizar esta acción.' });
  }
  next();
};

// eslint-disable-next-line consistent-return
const workspaceMemberVerification = async (request, response, next) => {
  const { workspaceId } = request.params;

  if (!await workspacesService.isInWorkspace(workspaceId, request.accountId)) {
    return response.status(401).json({ error: 'No tienes los permisos necesarios para realizar esta acción.' });
  }
  next();
};

// eslint-disable-next-line consistent-return
const variableVerification = async (request, response, next) => {
  const { workspaceId, variableId } = request.params;

  if (!await variablesService.getOne(workspaceId, variableId)) {
    return response.status(404).json({ error: 'La variable no se encuentra registrada.' });
  }
  next();
};

// eslint-disable-next-line consistent-return
const componentVerification = async (request, response, next) => {
  const { workspaceId, componentId } = request.params;

  if (!await componentsService.getOne(workspaceId, componentId)) {
    return response.status(404).json({ error: 'El componente no se encuentra registrado.' });
  }
  next();
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
  accessTokenVerification,
  workspaceVerification,
  workspaceAdminVerification,
  workspaceMemberVerification,
  variableVerification,
  componentVerification,
  unknownEndpoint,
  errorHandler,
};
