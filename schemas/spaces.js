const Joi = require('joi');

const nameValidator = Joi.string()
  .trim()
  .min(1)
  .max(30)
  .required()
  .messages({
    'string.base': 'La entrada "Nombre" ser de tipo cadena.',
    'string.empty': 'La entrada "Nombre" no puede estar vacía.',
    'string.min': 'La entrada "Nombre" debe contar con al menos 1 caracter.',
    'string.max': 'La entrada "Nombre" puede contar con máximo 30 caracteres.',
    'any.required': 'Se requiere la entrada "Nombre".',
  });

const colorValidator = Joi.string()
  .trim()
  .pattern(/^#[0-9a-fA-F]{6}$/i)
  .required()
  .messages({
    'string.base': 'La entrada "Color" debe ser de tipo cadena.',
    'string.empty': 'La entrada "Color" no puede estar vacía.',
    'string.pattern.base': 'El formato de la entrada "Color" no es el correcto.',
    'any.required': 'Se requiere la entrada "Color".',
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

const emailValidator = Joi.string()
  .email()
  .required()
  .messages({
    'string.base': 'La entrada "correo electrónico" debe ser de tipo cadena.',
    'string.email': 'El formato de la entrada "correo electrónico" no es válido.',
    'string.empty': 'La entrada "correo electrónico" no puede estar vacía.',
    'any.required': 'Se requiere la entrada "Correo electrónico".',
  });

const booleanValidator = Joi.boolean()
  .required()
  .messages({
    'boolean.base': 'La entrada "wasAccepted" debe ser de tipo booleano.',
    'any.required': 'Se requiere la entrada "wasAccepted".',
  });

const create = Joi.object({
  name: nameValidator,
  color: colorValidator,
});

const spaceId = Joi.object({
  spaceId: idValidator,
});

const updateName = Joi.object({
  newName: nameValidator,
});

const updateColor = Joi.object({
  newColor: colorValidator,
});

const ids = Joi.object({
  spaceId: idValidator,
  accountId: idValidator,
});

const invite = Joi.object({
  email: emailValidator,
});

const accountId = Joi.object({
  accountId: idValidator,
});

const inviteResponse = Joi.object({
  wasAccepted: booleanValidator,
});

module.exports = {
  create,
  spaceId,
  updateName,
  updateColor,
  ids,
  invite,
  accountId,
  inviteResponse,
};
