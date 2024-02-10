const Joi = require('joi');
const schemaVariables = require('./schemaVariables');

const register = Joi.object({
  email: schemaVariables.email,
  password: schemaVariables.password,
  firstName: schemaVariables.firstName,
  lastName: schemaVariables.lastName,
});

const login = Joi.object({
  email: schemaVariables.email,
  password: schemaVariables.password,
  rememberMe: schemaVariables.booleanType('rememberMe'),
});

const token = Joi.object({
  refreshToken: schemaVariables.token,
});

const verificationToken = Joi.object({
  verificationToken: schemaVariables.token,
});

const email = Joi.object({
  email: schemaVariables.email,
});

const resetPasswordParams = Joi.object({
  accountId: schemaVariables.accountIdParam,
  verificationToken: schemaVariables.verificationTokenParam,
});

const resetPassword = Joi.object({
  newPassword: schemaVariables.password,
});

const updateName = Joi.object({
  firstName: schemaVariables.firstName,
  lastName: schemaVariables.lastName,
});

const updateEmail = Joi.object({
  newEmail: schemaVariables.email,
  password: schemaVariables.password,
});

const updatePassword = Joi.object({
  currentPassword: schemaVariables.password,
  newPassword: schemaVariables.password,
  repeatNewPassword: schemaVariables.equal('newPassword'),
});

module.exports = {
  register,
  login,
  token,
  verificationToken,
  email,
  resetPasswordParams,
  resetPassword,
  updateName,
  updateEmail,
  updatePassword,
};
