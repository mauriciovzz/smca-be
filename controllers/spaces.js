/* eslint max-len: 0 */

const spacesService = require('../services/spaces');
const accountsService = require('../services/accounts');

const CustomError = require('../utils/CustomError');
// const config = require('../config/config');
// const tokenHelper = require('../utils/tokenHelper');

const create = async (req, res) => {
  const { accountId } = req;
  const { name, color } = req.body;

  const space = await spacesService.create(
    name,
    color.toUpperCase(),
  );

  await spacesService.addMember(
    space.space_id,
    accountId,
    true,
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
    spaceId.space_id,
    newColor,
  );

  return res.status(201).send('Color actualizado exitosamente.');
};

const leave = async (req, res, next) => {
  const { spaceId, accountId } = req;

  const admins = await spacesService.getAdminCount(spaceId);

  if (admins === 1)
    return next(new CustomError('No se puede abandonar un espacio si se es el unico administrador.', 404));

  await spacesService.removeMember(
    spaceId,
    accountId,
  );

  return res.status(202).send('Abandonó el espacio exitosamente.');
};

const remove = async (req, res) => {
  const { spaceId } = req;

  await spacesService.remove(
    spaceId,
  );

  return res.status(202).send('El espacio fue eliminado exitosamente.');
};

const invite = async (req, res, next) => {
  const { accountId, spaceId } = req;
  const { email } = req.body;

  const accountData = await accountsService.findByEmail(email.toLowerCase());

  if (!accountData)
    return next(new CustomError('El correo electrónico ingresado no se encuentra registrado en el sistema.', 404));

  if (!accountData.is_verified)
    return next(new CustomError('La cuenta ingresada no se encuentra verificada.', 409));

  if (await spacesService.isMember(spaceId, accountData.account_id))
    return next(new CustomError('La cuenta ya forma parte del espacio.', 409));

  if (await spacesService.findInvitation(spaceId, accountData.account_id))
    return next(new CustomError('Ya se le envio una invitación a la cuenta indicada.', 409));

  await spacesService.createInvitation(
    spaceId,
    accountData.account_id,
    accountId,
  );

  return res.status(201).send('Invitación enviada exitosamente.');
};

const getInvites = async (req, res) => {
  const { accountId } = req;

  const invitations = await spacesService.getInvitations(accountId);

  return res.status(200).send(invitations);
};

const inviteResponse = async (req, res) => {
  const { accountId, spaceId } = req;
  const { wasAccepted } = req.body;

  if (wasAccepted) {
    await spacesService.addMember(
      spaceId,
      accountId,
      false,
    );
  }

  await spacesService.removeInvitation(
    spaceId,
    accountId,
  );

  return res.status(201).send(wasAccepted ? 'Invitación aceptada.' : 'Invitación rechazada.');
};

const getMembers = async (req, res) => {
  const { spaceId } = req;

  const members = await spacesService.getMembers(
    spaceId,
  );

  return res.status(200).send(members);
};

const updateMemberRole = async (req, res) => {
  const { spaceId, accountId } = req.params;

  await spacesService.memberRoleUpdate(
    spaceId,
    accountId,
  );

  return res.status(200).send('El rol de la cuenta seleccionada fue actualizado exitosamente.');
};

const removeMember = async (req, res) => {
  const { spaceId, accountId } = req.params;

  await spacesService.removeMember(
    spaceId,
    accountId,
  );

  return res.status(202).send('Cuenta removida exitosamente del espacio de trabajo.');
};

module.exports = {
  create,
  getAll,
  updateName,
  updateColor,
  leave,
  remove,
  invite,
  getInvites,
  inviteResponse,
  getMembers,
  updateMemberRole,
  removeMember,
};
