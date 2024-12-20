const Joi = require('joi');

const idValidator = Joi.string()
  .trim()
  .min(1)
  .pattern(/^\d+$/)
  .required()
  .messages({
    'string.base': 'Link inválido.a',
    'string.empty': 'Link inválido.b',
    'string.min': 'Link inválido.c',
    'string.pattern.base': 'Link inválido.d',
    'any.required': 'Link inválido.e',
  });

const dateValidator = Joi.date()
  .messages({
    'date.base': 'Fecha inválida.',
  });

const nodeReadings = Joi.object({
  nodeId: idValidator,
  date: dateValidator,
});

module.exports = {
  nodeReadings,
};
