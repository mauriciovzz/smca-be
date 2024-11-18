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

const nameValidator = Joi.string()
  .trim()
  .min(1)
  .max(15)
  .required()
  .messages({
    'string.base': 'La entrada "Nombre" debe ser de tipo cadena.',
    'string.empty': 'La entrada "Nombre" no puede estar vacía.',
    'string.max': 'La entrada "Nombre" puede contar con máximo 15 caracteres.',
    'any.required': 'Se requiere la entrada "Nombre".',
  });

const readingIntervalValidator = Joi.any()
  .required()
  .valid(10, 15, 30, 60)
  .messages({
    'any.required': 'Se requiere la entrada "Intervalo de Lectura".',
    'any.only': 'La entrada "Intervalo de Lectura" es invalida.',
  });

const booleanValidator = (variableName) => Joi.boolean()
  .required()
  .messages({
    'boolean.base': `La entrada "${variableName}" debe ser de tipo booleano.`,
    'any.required': `Se requiere la entrada "${variableName}".`,
  });

const locationIdValidator = Joi.number().integer().greater(0).allow(null)
  .messages({
    'number.base': 'El parámetro "Ubicación" es invalido.',
    'number.interger': 'El parámetro "Ubicación" es invalido.',
    'number.greater': 'El parámetro "Ubicación" es invalido.',
    'any.required': 'Se requiere el parámetro "Ubicación".',
  });

const componentsArrayValidator = Joi.array()
  .items({
    componentId: Joi.number().required().integer().greater(0)
      .messages({
        'any.required': 'Se requiere la entrada "componentId", en componentes.',
        'number.base': 'Las entradas de "componentId", en componentes, deben de ser de tipo entero.',
      }),
    type: Joi.any().required().valid('board', 'sensor', 'rain_detector', 'camera', 'other')
      .messages({
        'any.required': 'Se requiere la entrada "Tipo de Componente", en componentes.',
        'any.only': 'La entrada "Tipo de Componente", en componentes, es invalida.',
      }),
    variables: Joi.array().items(Joi.number().integer().greater(0).messages({
      'number.base': 'Las entradas de "variables", en componentes, deben de ser de tipo entero.',
    }))
      .messages({
        'array.base': 'La entrada "Componentes" en invalida.',
        'array.includes': 'La entrada "Componentes" en invalida.',
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

const create = Joi.object({
  name: nameValidator,
  readingInterval: readingIntervalValidator,
  isIndoor: booleanValidator('Tipo de Nodo'),
  locationId: locationIdValidator,
  components: componentsArrayValidator,
});

const ids = Joi.object({
  spaceId: idValidator,
  nodeId: idValidator,
});

const updateInfo = Joi.object({
  name: nameValidator,
  isIndoor: booleanValidator('Tipo de Nodo'),
  readingInterval: readingIntervalValidator,
  isActive: booleanValidator('Estado del Nodo'),
});

const updateLocation = Joi.object({
  location: locationIdValidator,
});

const updateComponents = Joi.object({
  components: componentsArrayValidator,
});

module.exports = {
  spaceId,
  create,
  ids,
  updateInfo,
  updateLocation,
  updateComponents,
};
