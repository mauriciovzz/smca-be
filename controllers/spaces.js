const spacesService = require('../services/spaces');
const membersService = require('../services/members');
const variablesService = require('../services/variables');

const create = async (req, res) => {
  const { accountId } = req;
  const { name, color } = req.body;

  const space = await spacesService.create(
    name,
    color.toUpperCase(),
  );

  await membersService.addMember(
    space.space_id,
    accountId,
    true,
  );

  await variablesService.create(
    space.space_id,
    'meteorological',
    'presential',
    'lluvia',
    null,
    '#869FD1',
  );

  return res.status(201).send('Espacio creado exitosamente.');
};

const getAll = async (req, res) => {
  const { accountId } = req;

  const spaces = await spacesService.getAll(
    accountId,
  );

  return res.status(200).send(spaces);
};

const getOne = async (req, res) => {
  const { spaceId, accountId } = req;

  const space = await spacesService.getOne(
    spaceId,
    accountId,
  );

  return res.status(200).send(space);
};

const updateName = async (req, res) => {
  const { spaceId } = req;
  const { newName } = req.body;

  await spacesService.updateName(
    spaceId,
    newName,
  );

  return res.status(201).send('Nombre actualizado exitosamente.');
};

const updateColor = async (req, res) => {
  const { spaceId } = req;
  const { newColor } = req.body;

  await spacesService.updateColor(
    spaceId,
    newColor,
  );

  return res.status(201).send('Color actualizado exitosamente.');
};

const remove = async (req, res) => {
  const { spaceId } = req;

  await spacesService.remove(
    spaceId,
  );

  return res.status(202).send('El espacio fue eliminado exitosamente.');
};

module.exports = {
  create,
  getAll,
  getOne,
  updateName,
  updateColor,
  remove,
};
