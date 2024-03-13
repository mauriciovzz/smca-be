const Joi = require('joi');
const schemaVariables = require('./schemaVariables');

const workspaceId = Joi.object({
  workspaceId: schemaVariables.id('workspace id'),
});

const create = Joi.object({
  nodeName: schemaVariables.name,
  nodeType: schemaVariables.id('tipo de nodo (id)'),
  nodeComponents: schemaVariables.idsArray('componentes'),
  nodeVariables: schemaVariables.nodeVariablesArray,
  nodeLocation: schemaVariables.id('ubicación (id)'),
  nodeVisibility: schemaVariables.booleanType('visiblidad del nodo'),
});

const updateName = Joi.object({
  nodeName: schemaVariables.name,
});

const updateState = Joi.object({
  stateId: schemaVariables.id('estado de nodo (id)'),
});

const updateType = Joi.object({
  nodeType: schemaVariables.id('tipo de nodo (id)'),
});

const updateVisibility = Joi.object({
  newVisibility: schemaVariables.booleanType('visibilidad'),
});

const updateComponents = Joi.object({
  nodeComponents: schemaVariables.idsArray('componentes'),
  nodeVariables: schemaVariables.nodeVariablesArray,
});

const idParams = Joi.object({
  workspaceId: schemaVariables.id('espacio (id)'),
  nodeId: schemaVariables.id('node (id)'),
});

const updateLocation = Joi.object({
  locationId: schemaVariables.id('ubicación (id)'),
});

module.exports = {
  workspaceId,
  create,
  updateName,
  updateState,
  updateType,
  updateVisibility,
  updateLocation,
  updateComponents,
  idParams,
};
