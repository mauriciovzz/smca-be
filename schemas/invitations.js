const Joi = require('joi');

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

const spaceId = Joi.object({
  spaceId: idValidator,
});

const invite = Joi.object({
  email: emailValidator,
});

const accountId = Joi.object({
  accountId: idValidator,
});

const ids = Joi.object({
  spaceId: idValidator,
  accountId: idValidator,
});

const invitationResponse = Joi.object({
  wasAccepted: booleanValidator,
});

module.exports = {
  spaceId,
  invite,
  accountId,
  ids,
  invitationResponse,
};
