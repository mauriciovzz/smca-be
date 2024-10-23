const Joi = require('joi');

const firstNameValidator = Joi.string()
  .trim()
  .min(1)
  .max(35)
  .required()
  .messages({
    'string.base': 'La entrada "Nombre" debe ser de tipo cadena.',
    'string.empty': 'La entrada "Nombre" no puede estar vacía.',
    'string.max': 'La entrada "Nombre" puede contar con máximo 35 caracteres.',
    'any.required': 'Se requiere la entrada "Nombre".',
  });

const lastNameValidator = Joi.string()
  .trim()
  .min(1)
  .max(35)
  .required()
  .messages({
    'string.base': 'La entrada "Apellido" debe ser de tipo cadena.',
    'string.empty': 'La entrada "Apellido" no puede estar vacía.',
    'string.max': 'La entrada "Apellido" puede contar con máximo 35 caracteres.',
    'any.required': 'Se requiere la entrada "Apellido".',
  });

const emailValidator = Joi.string()
  .email()
  .required()
  .messages({
    'string.base': 'La entrada "correo electrónico" debe ser de tipo cadena.',
    'string.email': 'El formato de la entrada "correo electrónico" no es válido.',
    'string.empty': 'La entrada "correo electrónico" no puede estar vacía.',
    'any.required': 'Se requiere la entrada "Correo electrónico".',
  });

const passwordValidator = Joi.string()
  .min(8)
  .required()
  .messages({
    'string.base': 'La entrada "Contraseña" debe ser de tipo cadena.',
    'string.empty': 'La entrada "Contraseña" no puede estar vacía.',
    'string.min': 'La entrada "Contraseña" debe contar con al menos 8 caracteres.',
    'any.required': 'Se requiere la entrada "Contraseña".',
  });

const idValidator = Joi.string()
  .trim()
  .min(1)
  .pattern(/^\d+$/)
  .required()
  .messages({
    'string.base': 'Link inválido.',
    'string.empty': 'Link inválido.',
    'string.min': 'Link inválido.',
    'string.pattern.base': 'Link inválido.',
    'any.required': 'Link inválido.',
  });

const verificationTokenValidator = Joi.string()
  .pattern(/^[0-9A-F]{64}$/)
  .required()
  .messages({
    'string.base': 'Link invalido.',
    'string.empty': 'Link inválido.',
    'string.pattern.base': 'Link inválido.',
    'any.required': 'Link inválido.',
  });

const create = Joi.object({
  firstName: firstNameValidator,
  lastName: lastNameValidator,
  email: emailValidator,
  password: passwordValidator,
});

const verificationToken = Joi.object({
  accountId: idValidator,
  verificationToken: verificationTokenValidator,
});

const accountId = Joi.object({
  accountId: idValidator,
});

const email = Joi.object({
  email: emailValidator,
});

const updateName = Joi.object({
  firstName: firstNameValidator,
  lastName: lastNameValidator,
});

const updatePassword = Joi.object({
  currentPassword: passwordValidator,
  newPassword: passwordValidator,
  repeatNewPassword: passwordValidator,
});

const updateEmail = Joi.object({
  newEmail: emailValidator,
  password: passwordValidator,
});

const remove = Joi.object({
  email: emailValidator,
  password: passwordValidator,
});

const resetPassword = Joi.object({
  newPassword: passwordValidator,
  repeatNewPassword: passwordValidator,
});

module.exports = {
  create,
  verificationToken,
  accountId,
  email,
  updateName,
  updatePassword,
  updateEmail,
  remove,
  resetPassword,
};
