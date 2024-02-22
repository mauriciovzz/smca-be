const Joi = require('joi');
const schemaVariables = require('./schemaVariables');

const create = Joi.object({
  name: schemaVariables.worskpaceName,
  color: schemaVariables.color,
});

const updateName = Joi.object({
  workspaceId: schemaVariables.id('workspaceId'),
  newName: schemaVariables.worskpaceName,
});

const updateColor = Joi.object({
  workspaceId: schemaVariables.id('workspaceId'),
  newColor: schemaVariables.color,
});

const workspaceId = Joi.object({
  workspaceId: schemaVariables.id('workspaceId'),
});

const invitationCreation = Joi.object({
  workspaceId: schemaVariables.id('workspaceId'),
  email: schemaVariables.email,
});

const invitationResponse = Joi.object({
  workspaceId: schemaVariables.id('workspaceId'),
  wasAccepted: schemaVariables.booleanType('wasAccepted'),
});

const memberRoleUpdate = Joi.object({
  workspaceId: schemaVariables.id('workspaceId'),
  accountId: schemaVariables.id('accountId'),
  isAdmin: schemaVariables.booleanType('isAdmin'),

});

const memberRemoval = Joi.object({
  workspaceId: schemaVariables.id('workspaceId'),
  accountId: schemaVariables.id('accountId'),
});

const leaveWorkspace = Joi.object({
  workspaceId: schemaVariables.id('workspaceId'),
});

module.exports = {
  create,
  updateName,
  updateColor,
  workspaceId,
  invitationCreation,
  invitationResponse,
  memberRoleUpdate,
  memberRemoval,
  leaveWorkspace,
};
