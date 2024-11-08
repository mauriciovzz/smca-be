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

const typeValidator = Joi.any()
  .required()
  .valid('board', 'sensor', 'rain_detector', 'camera', 'screen', 'other')
  .messages({
    'any.required': 'Se requiere la entrada "Tipo de Componente".',
    'any.only': 'La entrada "Tipo de Componente" es invalida.',
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

const datasheetLinkValidator = Joi.string().uri()
  .required()
  .messages({
    'string.base': 'La entrada "Datasheet" debe ser de tipo cadena.',
    'string.uri': 'La entrada "Datasheet" debe un link valido.',
    'string.empty': 'La entrada "Datasheet" no puede estar vacía.',
    'any.required': 'Se requiere la entrada "Datasheet".',
  });

const idsArrayValidator = Joi.array()
  .items(
    Joi.number()
      .integer()
      .greater(0)
      .messages({
        'number.base': 'Las entradas de "variableId" deben de ser de tipo entero.',
      }),
  )
  .required()
  .messages({
    'array.base': 'La entrada "Variables" debe ser de tipo arreglo.',
    'array.includes': 'Los datos de la entrada "Variable" deben ser enteros.',
    'any.required': 'Se requiere la entrada "Variables".',
  });

const idsUpdateArrayValidator = Joi.array()
  .items({
    variableId: Joi.number()
      .required()
      .integer()
      .greater(0)
      .messages({
        'any.required': 'Se requiere la entrada "VariableId", en variables.',
        'number.base': 'Las entradas de "variableId" deben de ser de tipo entero.',
      }),
    action: Joi.any()
      .required()
      .valid('add', 'remove')
      .messages({
        'any.required': 'Se requiere la entrada "Acción", en variables.',
        'any.only': 'La entrada "Acción", en variables, es invalida.',
      }),
  })
  .required()
  .messages({
    'array.base': 'La entrada "Variables" en invalida.',
    'array.includes': 'La entrada "Variables" en invalida.',
    'any.required': 'Se requiere la entrada "Variables".',
  });

const spaceId = Joi.object({
  spaceId: idValidator,
});

const ids = Joi.object({
  spaceId: idValidator,
  componentId: idValidator,
});

const create = Joi.object({
  type: typeValidator,
  name: nameValidator,
  datasheetLink: datasheetLinkValidator,
  variables: idsArrayValidator,
});

const update = Joi.object({
  name: nameValidator,
  datasheetLink: datasheetLinkValidator,
  variables: idsUpdateArrayValidator,
});

module.exports = {
  spaceId,
  create,
  ids,
  update,
};
