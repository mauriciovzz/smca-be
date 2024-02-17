const Joi = require('joi');
const schemaVariables = require('./schemaVariables');

const register = Joi.object({
  email: schemaVariables.email,
  password: schemaVariables.password,
  firstName: schemaVariables.firstName,
  lastName: schemaVariables.lastName,
});

const verificationToken = Joi.object({
  verificationToken: schemaVariables.verificationToken,
});

const email = Joi.object({
  email: schemaVariables.email,
});

const resetPassword = Joi.object({
  verificationToken: schemaVariables.verificationToken,
  newPassword: schemaVariables.password,
});

const login = Joi.object({
  email: schemaVariables.email,
  password: schemaVariables.password,
  rememberMe: schemaVariables.booleanType('rememberMe'),
});

const refreshToken = Joi.object({
  refreshToken: schemaVariables.token,
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
  email,
  verificationToken,
  resetPassword,
  login,
  refreshToken,
  updateName,
  updateEmail,
  updatePassword,
};
