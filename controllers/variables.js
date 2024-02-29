const variablesService = require('../services/variables');

const getTypes = async (req, res) => {
  const variableTypes = await variablesService.getTypes();
  return res.status(200).send(variableTypes);
};

const getAll = async (req, res) => {
  const { workspaceId } = req.params;

  const variables = await variablesService.getAll(workspaceId);
  return res.status(200).send(variables);
};

const create = async (req, res) => {
  const { workspaceId } = req.params;
  const { name, unit, variableType } = req.body;

  if (await variablesService.checkName(workspaceId, name.toLowerCase())) {
    return res.status(409).json({ error: 'El nombre de variable ingresado ya se encuentra registrado.' });
  }

  await variablesService.create(
    workspaceId,
    name.toLowerCase(),
    unit,
    variableType,
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
  getAll,
  create,
  update,
  remove,
};
