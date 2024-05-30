const Joi = require('joi');
const schemaVariables = require('./schemaVariables');

const workspaceId = Joi.object({
  workspaceId: schemaVariables.id('workspace id'),
});

const create = Joi.object({
  variableType: schemaVariables.id('variableType'),
  variableValueType: schemaVariables.id('variableValueType'),
  name: schemaVariables.name,
  unit: schemaVariables.unit,
  color: schemaVariables.color,
});

const idParams = Joi.object({
  workspaceId: schemaVariables.id('workspace id'),
  variableId: schemaVariables.id('variable id'),
});

const update = Joi.object({
  name: schemaVariables.name,
  unit: schemaVariables.unit,
  color: schemaVariables.color,
});

module.exports = {
  workspaceId,
  create,
  idParams,
  update,
};
