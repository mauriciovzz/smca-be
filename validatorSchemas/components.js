const Joi = require('joi');
const schemaVariables = require('./schemaVariables');

const workspaceId = Joi.object({
  workspaceId: schemaVariables.id('workspace id'),
});

const create = Joi.object({
  name: schemaVariables.name,
  datasheetLink: schemaVariables.datasheetLink,
  componentType: schemaVariables.id('ComponentType'),
  variables: schemaVariables.variablesArray,
});

const idParams = Joi.object({
  workspaceId: schemaVariables.id('Workspace id'),
  componentId: schemaVariables.id('Component id'),
});

const update = Joi.object({
  name: schemaVariables.name,
  datasheetLink: schemaVariables.datasheetLink,
  variables: schemaVariables.variablesArray,
});

module.exports = {
  workspaceId,
  create,
  idParams,
  update,
};
