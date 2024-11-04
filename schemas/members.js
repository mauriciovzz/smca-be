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

const spaceId = Joi.object({
  spaceId: idValidator,
});

const ids = Joi.object({
  spaceId: idValidator,
  accountId: idValidator,
});

module.exports = {
  spaceId,
  ids,
};
