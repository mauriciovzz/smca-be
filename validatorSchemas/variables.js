const Joi = require('joi');
const schemaVariables = require('./schemaVariables');

const workspaceId = Joi.object({
  workspaceId: schemaVariables.id('workspace id'),
});

const create = Joi.object({
  name: schemaVariables.variableName,
  unit: schemaVariables.unit,
  variableType: schemaVariables.id('variableType'),
});

const idParams = Joi.object({
  workspaceId: schemaVariables.id('workspace id'),
  variableId: schemaVariables.id('variable id'),
});

const update = Joi.object({
  name: schemaVariables.variableName,
  unit: schemaVariables.unit,
});

module.exports = {
  workspaceId,
  create,
  idParams,
  update,
};
