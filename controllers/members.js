const membersService = require('../services/members');
const spacesService = require('../services/spaces');
const CustomError = require('../utils/CustomError');

const getAll = async (req, res) => {
  const { spaceId } = req;

  const members = await membersService.getAll(
    spaceId,
  );

  return res.status(200).send(members);
};

const updateMemberRole = async (req, res) => {
  const { spaceId, accountId } = req.params;

  await membersService.updateMemberRole(
    spaceId,
    accountId,
  );

  return res.status(200).send('El rol de la cuenta seleccionada fue actualizado exitosamente.');
};

const leaveSpace = async (req, res, next) => {
  const { spaceId, accountId } = req;

  const isAdmin = await spacesService.isAdmin(spaceId, accountId);
  const admins = await spacesService.getAdminCount(spaceId);

  if (admins === 1 && isAdmin)
    return next(new CustomError('No se puede abandonar un espacio si se es el unico administrador.', 409));

  await membersService.removeMember(
    spaceId,
    accountId,
  );

  return res.status(202).send('Espacio abandonado exitosamente.');
};

const removeMember = async (req, res) => {
  const { spaceId, accountId } = req.params;

  await membersService.removeMember(
    spaceId,
    accountId,
  );

  return res.status(202).send('Cuenta removida exitosamente.');
};

module.exports = {
  getAll,
  updateMemberRole,
  leaveSpace,
  removeMember,
};
