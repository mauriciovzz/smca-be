const crypto = require('node:crypto');
const nodesService = require('../services/nodes');
const locationsService = require('../services/locations');

const getTypes = async (req, res) => {
  const nodeTypes = await nodesService.getTypes();
  return res.status(200).send(nodeTypes);
};

const getStates = async (req, res) => {
  const nodeTypes = await nodesService.getStates();
  return res.status(200).send(nodeTypes);
};

const getAll = async (req, res) => {
  const { workspaceId } = req.params;

  const response = await nodesService.getAll(workspaceId);
  return res.status(200).send(response);
};

const getComponents = async (req, res) => {
  const { nodeId } = req.params;

  const nodeComponents = await nodesService.getComponents(nodeId);

  const componentsInfo = [];
  for (let j = 0; j < nodeComponents.length; j += 1) {
    // eslint-disable-next-line no-await-in-loop
    const variables = await nodesService.getVariables(nodeId, nodeComponents[j].component_id);

    componentsInfo.push({
      component_id: nodeComponents[j].component_id,
      name: nodeComponents[j].name,
      datasheet_link: nodeComponents[j].datasheet_link,
      component_type_id: nodeComponents[j].component_type_id,
      type: nodeComponents[j].type,
      variables,
    });
  }

  return res.status(200).send(componentsInfo);
};

const create = async (req, res) => {
  const { workspaceId } = req.params;
  const {
    nodeName, nodeType, nodeComponents, nodeVariables, nodeLocation, nodeVisibility,
  } = req.body;

  let nodeCode = crypto.randomBytes(4).toString('hex').toUpperCase();

  let flag = true;
  while (flag) {
    // eslint-disable-next-line no-await-in-loop
    const isCodeInUse = await nodesService.getOneWithNodeCode(nodeCode);

    if (isCodeInUse) {
      nodeCode = crypto.randomBytes(4).toString('hex').toUpperCase();
    } else {
      flag = false;
    }
  }

  const newNode = await nodesService.create(
    workspaceId,
    nodeName,
    nodeType,
    nodeLocation,
    nodeVisibility,
    nodeCode,
  );

  await locationsService.updateTakenField(
    workspaceId,
    nodeLocation,
    true,
  );

  for (let i = 0; i < nodeComponents.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await nodesService.addComponents(newNode.node_id, nodeComponents[i]);
  }

  for (let i = 0; i < nodeVariables.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await nodesService.addVariables(
      newNode.node_id,
      nodeVariables[i].component_id,
      nodeVariables[i].variable_id,
    );
  }

  return res.sendStatus(201);
};

const updateName = async (req, res) => {
  const { nodeId } = req.params;
  const { nodeName } = req.body;

  await nodesService.updateColumn(nodeId, 'name', nodeName);
  return res.status(200).send('Nombre actualizado exitosamente.');
};

const updateState = async (req, res) => {
  const { workspaceId, nodeId } = req.params;
  const { stateId } = req.body;

  const states = await nodesService.getStates();

  if (!states.map((s) => s.node_state_id).includes(stateId)) {
    return res.status(404).json({ error: 'El estado ingresado no se encuentra registrado.' });
  }

  const newState = states.find((s) => s.node_state_id === stateId).state;
  const node = await nodesService.getOne(nodeId);

  await nodesService.updateColumn(nodeId, 'node_state_id', stateId);

  if (newState === 'Activo' && !node.start_date) {
    const date = new Date();
    const localDate = new Date(date.toLocaleString('en-US', { timeZone: 'America/Caracas' }));
    const fullDate = `${localDate.getFullYear()}-${localDate.getMonth() + 1}-${localDate.getDate()}`;

    await nodesService.updateColumn(nodeId, 'start_date', fullDate);
  }

  if (newState === 'Terminado') {
    await nodesService.updateColumn(nodeId, 'start_date', null);
    await locationsService.updateTakenField(workspaceId, node.location_id, false);
    await nodesService.updateColumn(nodeId, 'location_id', null);
  }

  return res.status(200).send('Estado actualizado exitosamente.');
};

const updateType = async (req, res) => {
  const { nodeId } = req.params;
  const { nodeType } = req.body;

  await nodesService.updateColumn(nodeId, 'node_type_id', nodeType);
  return res.status(200).send('Tipo actualizado exitosamente.');
};

const updateVisibility = async (req, res) => {
  const { workspaceId, nodeId } = req.params;
  const { newVisibility } = req.body;

  if (newVisibility) {
    const node = nodesService.getOne(nodeId);
    const currentLocation = locationsService.getOne(workspaceId, node.location_id);

    if (!await nodesService.areCoordinatesAvailablePublicly(currentLocation)) {
      return res.status(409).json({ error: 'Ya existe un nodo visible en la posición de este nodo.' });
    }

    if (!await nodesService.isNameAvailablePublicly(node.name)) {
      return res.status(409).json({ error: 'Ya existe un nodo visible con el nombre de este nodo.' });
    }
  }

  await nodesService.updateColumn(nodeId, 'is_visible', newVisibility);
  return res.status(200).send('Visibilidad actualizada exitosamente.');
};

const updateLocation = async (req, res) => {
  const { workspaceId, nodeId } = req.params;
  const { locationId } = req.body;

  const node = await nodesService.getOne(nodeId);

  await locationsService.updateTakenField(workspaceId, node.location_id, false);
  await nodesService.updateColumn(nodeId, 'location_id', locationId);
  await nodesService.updateColumn(nodeId, 'start_date', null);
  await locationsService.updateTakenField(workspaceId, locationId, true);

  const states = await nodesService.getStates();
  await nodesService.updateColumn(
    nodeId,
    'node_state_id',
    states.find((s) => s.state === 'Inactivo').node_state_id,
  );

  return res.sendStatus(200);
};

const updateComponents = async (req, res) => {
  const { nodeId } = req.params;
  const { nodeComponents, nodeVariables } = req.body;

  await nodesService.removeAllNodeComponents(nodeId);
  await nodesService.removeAllNodeVariables(nodeId);

  for (let i = 0; i < nodeComponents.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await nodesService.addComponents(nodeId, nodeComponents[i]);
  }

  for (let i = 0; i < nodeVariables.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await nodesService.addVariables(
      nodeId,
      nodeVariables[i].component_id,
      nodeVariables[i].variable_id,
    );
  }

  const states = await nodesService.getStates();
  await nodesService.updateColumn(
    nodeId,
    'node_state_id',
    states.find((s) => s.state === 'Inactivo').node_state_id,
  );

  return res.sendStatus(200);
};

const remove = async (req, res) => {
  const { workspaceId, nodeId } = req.params;

  const node = await nodesService.getOne(nodeId);
  await locationsService.updateTakenField(workspaceId, node.location_id, false);

  await nodesService.remove(nodeId);
  return res.status(200).send('Nodo eliminado exitosamente.');
};

module.exports = {
  getTypes,
  getStates,
  getAll,
  getComponents,
  create,
  updateName,
  updateState,
  updateType,
  updateVisibility,
  updateLocation,
  updateComponents,
  remove,
};
