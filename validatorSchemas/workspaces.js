const Joi = require('joi');
const schemaVariables = require('./schemaVariables');

const create = Joi.object({
  name: schemaVariables.worskpaceName,
  color: schemaVariables.color,
});

const account = Joi.object({
  workspaceId: schemaVariables.id('workspaceId'),
  email: schemaVariables.email,
  isAdmin: schemaVariables.booleanType('isAdmin'),
});

const removeAccount = Joi.object({
  workspaceId: schemaVariables.id('workspaceId'),
  accountId: schemaVariables.id('accountId'),
});

const leaveWorkspace = Joi.object({
  workspaceId: schemaVariables.id('workspaceId'),
});

const update = Joi.object({
  workspaceId: schemaVariables.id('workspaceId'),
  name: schemaVariables.worskpaceName,
  color: schemaVariables.color,
});

module.exports = {
  create,
  account,
  removeAccount,
  leaveWorkspace,
  update,
};
