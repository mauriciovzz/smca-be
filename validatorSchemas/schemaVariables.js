const Joi = require('joi');

const email = Joi.string()
  .email()
  .required()
  .messages({
    'string.base': 'La entrada "correo electrónico" debe ser de tipo cadena.',
    'string.email': 'El formato de la entrada "correo electrónico" no es válido.',
    'string.empty': 'La entrada "correo electrónico" no puede estar vacía.',
    'any.required': 'Se requiere la entrada "Correo electrónico".',
  });

const password = Joi.string()
  .min(8)
  .required()
  .messages({
    'string.base': 'La entrada "Contraseña" debe ser de tipo cadena.',
    'string.empty': 'La entrada "Contraseña" no puede estar vacía.',
    'string.min': 'La entrada "Contraseña" debe contar con al menos 8 caracteres.',
    'any.required': 'Se requiere la entrada "Contraseña".',
  });

const firstName = Joi.string()
  .trim()
  .min(1)
  .max(35)
  .required()
  .messages({
    'string.base': 'La entrada "Nombre" debe ser de tipo cadena.',
    'string.empty': 'La entrada "Nombre" no puede estar vacía.',
    'string.min': 'La entrada "Nombre" debe contar con al menos 1 caracter.',
    'string.max': 'La entrada "Nombre" puede contar con máximo 35 caracteres.',
    'any.required': 'Se requiere la entrada "Nombre".',
  });

const lastName = Joi.string()
  .trim()
  .min(1)
  .max(35)
  .required()
  .messages({
    'string.base': 'La entrada "Apellido" debe ser de tipo cadena.',
    'string.empty': 'La entrada "Apellido" no puede estar vacía.',
    'string.min': 'La entrada "Apellido" debe contar con al menos 1 caracter.',
    'string.max': 'La entrada "Apellido" puede contar con máximo 35 caracteres.',
    'any.required': 'Se requiere la entrada "Apellido".',
  });

const verificationToken = Joi.string()
  .pattern(/^[0-9A-F]{64}$/)
  .required()
  .messages({
    'string.base': 'Link invalido.',
    'string.empty': 'link inválido.',
    'string.pattern.base': 'Link inválido.',
    'any.required': 'Link inválido.',
  });

const booleanType = (paramName) => Joi.boolean()
  .required()
  .messages({
    'boolean.base': `La entrada "${paramName}" debe ser de tipo booleano.`,
    'any.required': `Se requiere la entrada "${paramName}".`,
  });

const token = Joi.string()
  .pattern(/^[\w-]+\.[\w-]+\.[\w-]+$/)
  .required()
  .messages({
    'string.base': 'Token invalido.',
    'string.empty': 'Token inválido.',
    'string.pattern.base': 'Token inválido.',
    'any.required': 'Se requiere un Token valido.',
  });

const name = Joi.string()
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

const color = Joi.string()
  .trim()
  .pattern(/^#[0-9a-fA-F]{6}$/i)
  .required()
  .messages({
    'string.base': 'La entrada "Color" debe ser de tipo cadena.',
    'string.empty': 'La entrada "Color" no puede estar vacía.',
    'string.pattern.base': 'El formato de la entrada "Color" no es el correcto.',
    'any.required': 'Se requiere la entrada "Color".',
  });

const id = (idName) => Joi.number().integer()
  .greater(0)
  .required()
  .messages({
    'number.base': `El parámetro "${idName}" es invalido.`,
    'number.interger': `El parámetro "${idName}" es invalido.`,
    'number.greater': `El parámetro "${idName}" es invalido.`,
    'any.required': `Se requiere el parámetro "${idName}".`,
  });

const equal = (reference) => Joi.any()
  .valid(Joi.ref(reference))
  .required()
  .messages({
    'any.only': 'Los campos \'Nueva contraseña\' y \'Repetir nueva contraseña\' deben de coincidir.',
  });

const unit = Joi.string()
  .trim()
  .min(1)
  .max(10)
  .required()
  .messages({
    'string.base': 'La entrada "Unidad" debe ser de tipo cadena.',
    'string.empty': 'La entrada "Unidad" no puede estar vacía.',
    'string.min': 'La entrada "Unidad" debe contar con al menos 1 caracter.',
    'string.max': 'La entrada "Unidad" puede contar con máximo 10 caracteres.',
    'any.required': 'Se requiere la entrada "Unidad".',
  });

const datasheetLink = Joi.string().uri()
  .required()
  .messages({
    'string.base': 'La entrada "Datasheet link" debe ser de tipo cadena.',
    'string.uri': 'La entrada "Datasheet link" debe un link valido.',
    'string.empty': 'La entrada "Datasheet link" no puede estar vacía.',
    'any.required': 'Se requiere la entrada "Unidad".',
  });

const idsArray = (reference) => Joi.array()
  .items(Joi.number().integer().greater(0))
  .messages({
    'array.base': `La entrada "${reference}" debe ser de tipo arreglo.`,
    'array.includes': `Los datos de la entrada "${reference}" deben ser enteros.`,
  });

const nodeVariable = Joi.object({
  component_id: id('component id'),
  variable_id: id('variable id'),
});

const nodeVariablesArray = Joi.array()
  .items(nodeVariable)
  .min(1)
  .messages({
    'array.base': 'La entradas "Variables del componente" debe ser de tipo arreglo.',
    'array.min': 'El nodo debe contar con al menos una variable.',
    'array.includes': 'Los datos de la entrada "Variables del componente" deben ser enteros.',
  });

const location = Joi.string()
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

const coordinate = Joi.string()
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

const date = Joi.date()
  .messages({
    'date.base': 'Fecha inválida.',
  });

const accountIdParam = Joi.string()
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

const verificationTokenParam = Joi.string()
  .pattern(/^[\w-]+\.[\w-]+\.[\w-]+$/)
  .required()
  .messages({
    'string.base': 'Link inválido.',
    'string.empty': 'Link inválido.',
    'string.pattern.base': 'Link inválido.',
    'any.required': 'Link inválido.',
  });

module.exports = {
  email,
  password,
  firstName,
  lastName,
  verificationToken,
  booleanType,
  token,
  name,
  color,
  id,
  equal,
  unit,
  datasheetLink,
  idsArray,
  nodeVariablesArray,
  location,
  coordinate,
  date,
  accountIdParam,
  verificationTokenParam,
};
