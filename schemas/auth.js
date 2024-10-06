const Joi = require('joi');

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

const booleanValidator = Joi.boolean()
  .required()
  .messages({
    'boolean.base': 'La entrada "Recuérdame" debe ser de tipo booleano.',
    'any.required': 'Se requiere la entrada "Recuérdame".',
  });

const login = Joi.object({
  email: emailValidator,
  password: passwordValidator,
  rememberMe: booleanValidator,
});

module.exports = {
  login,
};
