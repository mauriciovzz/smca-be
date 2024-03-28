const variablesService = require('../services/variables');

const getTypes = async (req, res) => {
  const variableTypes = await variablesService.getTypes();
  return res.status(200).send(variableTypes);
};

const getValueTypes = async (req, res) => {
  const variableValueTypes = await variablesService.getValueTypes();
  return res.status(200).send(variableValueTypes);
};

const getAll = async (req, res) => {
  const { workspaceId } = req.params;

  const variables = await variablesService.getAll(workspaceId);
  return res.status(200).send(variables);
};

const create = async (req, res) => {
  const { workspaceId } = req.params;
  const {
    variableType, variableValueType, name, unit,
  } = req.body;

  if (await variablesService.checkName(workspaceId, name.toLowerCase())) {
    return res.status(409).json({ error: 'El nombre de variable ingresado ya se encuentra registrado.' });
  }

  const variableValueTypes = await variablesService.getValueTypes();
  const chosenVariable = variableValueTypes.find(
    (vvt) => vvt.variable_value_type_id === variableValueType,
  ).type;

  if ((chosenVariable === 'Numérico') && !(unit)) {
    return res.status(400).json({ error: 'El cambo "Unidad" es necesario.' });
  }

  await variablesService.create(
    workspaceId,
    variableType,
    variableValueType,
    name.toLowerCase(),
    unit,
  );

  return res.status(201).send('Variable creada exitosamente.');
};

const update = async (req, res) => {
  const { workspaceId, variableId } = req.params;
  const { name, unit } = req.body;

  const variable = await variablesService.getOne(workspaceId, variableId);
  if (!(variable.name === name.toLowerCase())) {
    if (await variablesService.checkName(workspaceId, name.toLowerCase())) {
      return res.status(409).json({ error: 'El nombre de variable ingresado ya se encuentra registrado.' });
    }
  }

  await variablesService.update(
    workspaceId,
    variableId,
    name.toLowerCase(),
    unit,
  );
  return res.status(201).send('Variable actualizada exitosamente.');
};

const remove = async (req, res) => {
  const { workspaceId, variableId } = req.params;

  if (await variablesService.isBeingUsed(variableId)) {
    return res.status(401).json({ error: 'La variable se encuentra en uso.' });
  }

  await variablesService.remove(workspaceId, variableId);
  return res.status(200).send('Variable eliminada exitosamente.');
};

module.exports = {
  getTypes,
  getValueTypes,
  getAll,
  create,
  update,
  remove,
};
