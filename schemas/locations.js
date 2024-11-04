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

const coordinateValidator = Joi.string()
  .min(8)
  .max(10)
  .required()
  .messages({
    'string.base': 'Las coordenadas deben ser de tipo cadena.',
    'string.empty': 'Las coordenadas no pueden estar vacía.',
    'string.min': 'Coordenadas invalidas',
    'string.max': 'Coordenadas invalidas',
    'any.required': 'Se requiere la entrada "Coordenadas".',
  });

const nameValidator = Joi.string()
  .trim()
  .min(1)
  .max(30)
  .required()
  .messages({
    'string.base': 'La entrada "Nombre" debe ser de tipo cadena.',
    'string.empty': 'La entrada "Nombre" no puede estar vacía.',
    'string.max': 'La entrada "Nombre" puede contar con máximo 30 caracteres.',
    'any.required': 'Se requiere la entrada "Nombre".',
  });

const locationValidator = Joi.string()
  .trim()
  .min(1)
  .max(120)
  .required()
  .messages({
    'string.base': 'La entrada "Ubicacion" ser de tipo cadena.',
    'string.empty': 'La entrada "Ubicacion" no puede estar vacía.',
    'string.min': 'La entrada "Ubicacion" debe contar con al menos 1 caracter.',
    'string.max': 'La entrada "Ubicacion" puede contar con máximo 120 caracteres.',
    'any.required': 'Se requiere la entrada "Ubicacion".',
  });

const booleanValidator = Joi.boolean()
  .required()
  .messages({
    'boolean.base': 'La entrada "Visibilidad de la ubicacion" debe ser de tipo booleano.',
    'any.required': 'Se requiere la entrada "Visibilidad de la ubicacion".',
  });

const spaceId = Joi.object({
  spaceId: idValidator,
});

const ids = Joi.object({
  spaceId: idValidator,
  locationId: idValidator,
});

const create = Joi.object({
  lat: coordinateValidator,
  long: coordinateValidator,
  name: nameValidator,
  location: locationValidator,
});

const update = Joi.object({
  name: nameValidator,
  location: locationValidator,
  isVisible: booleanValidator,
});

module.exports = {
  spaceId,
  ids,
  create,
  update,
};
