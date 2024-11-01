const Joi = require('joi');
const schemaVariables = require('./schemaVariables');

const workspaceId = Joi.object({
  workspaceId: schemaVariables.id('workspace id'),
});

const create = Joi.object({
  name: schemaVariables.name,
  location: schemaVariables.location,
  lat: schemaVariables.coordinate,
  long: schemaVariables.coordinate,
  isVisible: schemaVariables.booleanType('isVisible'),
});

const idParams = Joi.object({
  workspaceId: schemaVariables.id('Workspace id'),
  locationId: schemaVariables.id('Location id'),
});

const update = Joi.object({
  name: schemaVariables.name,
  location: schemaVariables.location,
});

module.exports = {
  workspaceId,
  create,
  idParams,
  update,
};
