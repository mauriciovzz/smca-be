const logger = require('../logger');
const tokenHelper = require('../tokenHelper');
const workspacesService = require('../../services/workspaces');
const variablesService = require('../../services/variables');
const componentsService = require('../../services/components');
const locationsService = require('../../services/locations');
const nodesService = require('../../services/nodes');
const readingsService = require('../../services/readings');

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

// eslint-disable-next-line consistent-return
const locationVerification = async (request, response, next) => {
  const { workspaceId } = request.params;
  const locationId = !request.params.locationId
    ? request.body.locationId
    : request.params.locationId;

  if (!await locationsService.getOne(workspaceId, locationId)) {
    return response.status(404).json({ error: 'La ubicación no se encuentra registrada.' });
  }
  next();
};

// eslint-disable-next-line consistent-return
const nodeVerification = async (request, response, next) => {
  const { nodeId } = request.params;

  if (!await nodesService.getOne(nodeId)) {
    return response.status(404).json({ error: 'El nodo no se encuentra registrado.' });
  }
  next();
};

// eslint-disable-next-line consistent-return
const nodeStateVerification = async (request, response, next) => {
  const { nodeId } = request.params;

  const currentState = await nodesService.getState(nodeId);
  if (currentState === 'Terminado') {
    return response.status(409).json({ error: 'El nodo indicado ha sido terminado.' });
  }
  next();
};

// eslint-disable-next-line consistent-return
const nodeWorkspaceVerification = async (request, response, next) => {
  const { workspaceId, nodeId } = request.params;

  const node = await nodesService.getOne(nodeId);
  if (node.workspace_id !== workspaceId) {
    return response.status(401).json({ error: 'El nodo no se encuentra en dicho espacio de trabajo.' });
  }
  next();
};

// eslint-disable-next-line consistent-return
const nodeNameVerification = async (request, response, next) => {
  const { workspaceId, nodeId } = request.params;
  const { nodeName } = request.body;

  if (!await nodesService.isNameAvailableInWS(workspaceId, nodeName)) {
    return response.status(409).json({ error: 'Ya existe un nodo con el nombre ingresado.' });
  }

  let isVisible;

  if (nodeId) {
    const node = nodesService.getOne(nodeId);
    isVisible = node.is_visible;
  } else {
    const { nodeVisibility } = request.body;
    isVisible = nodeVisibility;
  }

  if ((isVisible) && (!await nodesService.isNameAvailablePublicly(nodeName))) {
    return response.status(409).json({ error: 'Ya existe un nodo publico con el nombre ingresado.' });
  }

  next();
};

// eslint-disable-next-line consistent-return
const nodeTypeVerification = async (request, response, next) => {
  const { nodeType } = request.body;

  const nodeTypes = await nodesService.getTypes();

  if (!nodeTypes.map((nt) => nt.node_type_id).includes(nodeType)) {
    return response.status(404).json({ error: 'El tipo ingresado no se encuentra registrado.' });
  }

  next();
};

// eslint-disable-next-line consistent-return
const nodeComponentsAndVariablesVerification = async (request, response, next) => {
  const { workspaceId } = request.params;
  const { nodeComponents, nodeVariables, rainSensor } = request.body;

  const workspaceComponents = await componentsService.getAll(workspaceId);
  const workspaceComponentsIds = workspaceComponents.map((wc) => wc.component_id);

  for (let i = 0; i < nodeComponents.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    if (!workspaceComponentsIds.includes(nodeComponents[i])) {
      return response.status(404).json({ error: 'Uno de los componentes no se encuentra registrado.' });
    }

    const currentComponent = workspaceComponents.find((c) => c.component_id === nodeComponents[i]);
    if (currentComponent.type === 'Sensor') {
      // eslint-disable-next-line no-await-in-loop
      const currentComponenVariables = await componentsService.getVariables(nodeComponents[i]);
      const currentComponenVariablesIds = currentComponenVariables.map((v) => v.variable_id);

      const nodeVariablesIds = nodeVariables
        .filter((nv) => nv.component_id === nodeComponents[i])
        .map((nv) => nv.variable_id);

      for (let j = 0; j < nodeVariablesIds.length; j += 1) {
        if (!currentComponenVariablesIds.includes(nodeVariablesIds[j])) {
          return response.status(404).json({ error: 'Una de las variables no se encuentra registrada.' });
        }
      }
    }
  }

  if (rainSensor) {
    if (!workspaceComponentsIds.includes(rainSensor.component_id)) {
      return response.status(404).json({ error: 'El sensor de lluvia ingresado no se encuentra registrado.' });
    }
  }

  next();
};

// eslint-disable-next-line consistent-return
const nodeQuantitiesVerification = async (request, response, next) => {
  const { workspaceId } = request.params;
  const { nodeComponents, nodeVariables, rainSensor } = request.body;

  const workspaceComponents = await componentsService.getAll(workspaceId);

  // at least one board
  const workspaceBoards = workspaceComponents
    .filter((wc) => wc.type === 'Placa')
    .map((wc) => wc.component_id);

  const nodeBoards = nodeComponents.filter((nc) => workspaceBoards.includes(nc));
  if (nodeBoards.length === 0) {
    return response.status(400).send('El nodo debe contener al menos una placa.');
  }

  // at least one sensor
  const workspaceSensors = workspaceComponents
    .filter((wc) => wc.type === 'Sensor')
    .map((wc) => wc.component_id);

  const nodeSensors = nodeComponents.filter((nc) => workspaceSensors.includes(nc));
  if (nodeSensors.length === 0 && rainSensor === undefined) {
    return response.status(400).send('El nodo debe contener al menos un sensor.');
  }

  if (!nodeVariables && !rainSensor) {
    return response.status(400).send('El nodo debe contener al menos una variable.');
  }

  next();
};

// eslint-disable-next-line consistent-return
const nodeLocationVerification = async (request, response, next) => {
  const { workspaceId } = request.params;
  const { nodeLocation } = request.body;

  const chosenLocation = locationsService.getOne(workspaceId, nodeLocation);
  if (!chosenLocation) {
    return response.status(404).json({ error: 'La ubicación no se encuentra registrada.' });
  }

  if (chosenLocation.is_taken) {
    return response.status(409).send('La ubicacion selecionada se encuentra en uso.');
  }
  next();
};

// eslint-disable-next-line consistent-return
const publicVerification = async (request, response, next) => {
  const { nodeId } = request.params;
  const node = await nodesService.getOne(nodeId);

  if (!node.is_visible) {
    return response.status(409).json({ error: 'El nodo seleccionado ya no es visible.' });
  }
  next();
};

// eslint-disable-next-line consistent-return
const nodeAccessVerification = async (request, response, next) => {
  const { nodeId } = request.params;
  const hasAccess = await readingsService.canAccountAccessReadings(request.accountId, nodeId);

  if (!hasAccess) {
    return response.status(403).json({ error: 'Acceso denegado.' });
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
  locationVerification,
  nodeVerification,
  nodeStateVerification,
  nodeWorkspaceVerification,
  nodeNameVerification,
  nodeTypeVerification,
  nodeComponentsAndVariablesVerification,
  nodeQuantitiesVerification,
  nodeLocationVerification,
  publicVerification,
  nodeAccessVerification,
  unknownEndpoint,
  errorHandler,
};
