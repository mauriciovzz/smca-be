const variablesService = require('../services/variables');
const CustomError = require('../utils/CustomError');

const create = async (req, res, next) => {
  const { spaceId } = req;
  const {
    variableType, valueType, name, unit, color,
  } = req.body;

  if ((valueType === 'numerical') && !(unit))
    return next(new CustomError('El campo "Unidad" es necesario.', 400));

  if (await variablesService.isNameTaken(spaceId, null, name.toLowerCase()))
    return next(new CustomError('El nombre ingresado ya se encuentra registrado.', 409));

  await variablesService.create(
    spaceId,
    variableType,
    valueType,
    name.toLowerCase(),
    (valueType === 'numerical') ? unit.toLowerCase() : null,
    color.toUpperCase(),
  );

  return res.status(201).send('Variable creada exitosamente.');
};

const getAll = async (req, res) => {
  const { spaceId } = req.params;

  const response = await variablesService.getAll(
    spaceId,
  );

  return res.status(200).send(response);
};

const update = async (req, res, next) => {
  const { spaceId, variableData } = req;
  const { name, unit, color } = req.body;

  if ((variableData.value_type === 'numerical') && !(unit))
    return next(new CustomError('El campo "Unidad" es necesario.', 400));

  if (await variablesService.isNameTaken(spaceId, variableData.variable_id, name.toLowerCase()))
    return next(new CustomError('El nombre ingresado ya se encuentra registrado.', 409));

  await variablesService.update(
    variableData.variable_id,
    name.toLowerCase(),
    (variableData.value_type === 'numerical') ? unit.toLowerCase() : null,
    color.toUpperCase(),
  );

  return res.status(201).send('Variable actualizada exitosamente.');
};

// to check
const remove = async (req, res) => {
  const { variableData } = req;

  // if (await variablesService.isBeingUsed(variableId))
  //   return next(new CustomError('La variable se encuentra en uso.', 401));

  await variablesService.remove(
    variableData.variable_id,
  );

  return res.status(200).send('Variable eliminada exitosamente.');
};

module.exports = {
  create,
  getAll,
  update,
  remove,
};
