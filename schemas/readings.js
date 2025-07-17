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

const dateValidator = Joi.string()
  .pattern(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{2}$/)
  .required()
  .messages({
    'string.base': 'Link inválido.',
    'string.empty': 'Link inválido.',
    'string.pattern.base': 'Link inválido.',
    'any.required': 'Link inválido.',
  });

const getDateReadings = Joi.object({
  spaceId: idValidator,
  nodeId: idValidator,
  locationId: idValidator,
  date: dateValidator,
});

const spaceId = Joi.object({
  spaceId: idValidator,
});

module.exports = {
  getDateReadings,
  spaceId,
};
