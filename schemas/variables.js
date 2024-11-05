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

const variableTypeValidator = Joi.any()
  .required()
  .valid('enviromental', 'meteorological')
  .messages({
    'any.required': 'Se requiere la entrada "Tipo de Variable".',
    'any.only': 'La entrada "Tipo de Variable" es invalida.',
  });

const valueTypeValidator = Joi.any()
  .required()
  .valid('numerical', 'presential')
  .messages({
    'any.required': 'Se requiere la entrada "Tipo de Valor".',
    'any.only': 'La entrada "Tipo de Valor" es invalida.',
  });

const nameValidator = Joi.string()
  .trim()
  .min(1)
  .max(20)
  .required()
  .messages({
    'string.base': 'La entrada "Nombre" debe ser de tipo cadena.',
    'string.empty': 'La entrada "Nombre" no puede estar vacía.',
    'string.max': 'La entrada "Nombre" puede contar con máximo 20 caracteres.',
    'any.required': 'Se requiere la entrada "Nombre".',
  });

const unitValidator = Joi.string()
  .allow('', null)
  .max(10)
  .messages({
    'string.base': 'La entrada "Unidad" ser de tipo cadena.',
    'string.max': 'La entrada "Unidad" puede contar con máximo 10 caracteres.',
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

const spaceId = Joi.object({
  spaceId: idValidator,
});

const ids = Joi.object({
  spaceId: idValidator,
  variableId: idValidator,
});

const create = Joi.object({
  variableType: variableTypeValidator,
  valueType: valueTypeValidator,
  name: nameValidator,
  unit: unitValidator,
  color: colorValidator,
});

const update = Joi.object({
  name: nameValidator,
  unit: unitValidator,
  color: colorValidator,
});

module.exports = {
  spaceId,
  create,
  ids,
  update,
};
