const tokenHelper = require('../utils/tokenHelper');
const workspacesService = require('../services/workspaces');
const accountsService = require('../services/accounts');

const create = async (req, res) => {
  const {
    name, color,
  } = req.body;

  const workspace = await workspacesService.create(
    tokenHelper.getAccountId(req.authToken),
    name,
    color.toUpperCase(),
  );

  await workspacesService.addMember(
    workspace.workspace_id,
    req.accountId,
    true,
  );

  return res.status(201).send('Espacio de trabajo creado exitosamente.');
};

const getAll = async (req, res) => {
  const workspaces = await workspacesService.getAll(req.accountId);
  return res.status(200).send(workspaces);
};

const updateName = async (req, res) => {
  const { workspaceId, newName } = req.body;

  if (!await workspacesService.getOne(workspaceId)) {
    return res.status(404).json({ error: 'El espacio de trabajo ingresado no se encuentra registrado.' });
  }

  if (!await workspacesService.isWorkspaceAdmin(workspaceId, req.accountId)) {
    return res.status(401).json({ error: 'No tienes los permisos necesarios para realizar esta acción.' });
  }

  await workspacesService.update('name', workspaceId, newName);
  return res.status(201).send('Nombre actualizado exitosamente.');
};

const updateColor = async (req, res) => {
  const { workspaceId, newColor } = req.body;

  if (!await workspacesService.getOne(workspaceId)) {
    return res.status(404).json({ error: 'El espacio de trabajo ingresado no se encuentra registrado.' });
  }

  if (!await workspacesService.isWorkspaceAdmin(workspaceId, req.accountId)) {
    return res.status(401).json({ error: 'No tienes los permisos necesarios para realizar esta acción.' });
  }

  await workspacesService.update('color', workspaceId, newColor);
  return res.status(201).send('Color actualizado exitosamente.');
};

const getMembers = async (req, res) => {
  const { workspaceId } = req.params;

  if (!await workspacesService.getOne(workspaceId)) {
    return res.status(404).json({ error: 'El espacio de trabajo ingresado no se encuentra registrado.' });
  }

  if (!await workspacesService.isInWorkspace(workspaceId, req.accountId)) {
    return res.status(401).json({ error: 'No tienes los permisos necesarios para realizar esta acción.' });
  }

  const members = await workspacesService.getMembers(workspaceId);
  return res.status(200).send(members);
};

const getInvitations = async (req, res) => {
  const invitations = await workspacesService.getInvitations(req.accountId);
  return res.status(200).send(invitations);
};

const invitationCreation = async (req, res) => {
  const { workspaceId, email } = req.body;

  if (!await workspacesService.getOne(workspaceId)) {
    return res.status(404).json({ error: 'El espacio de trabajo ingresado no se encuentra registrado.' });
  }

  if (!await workspacesService.isWorkspaceAdmin(workspaceId, req.accountId)) {
    return res.status(401).json({ error: 'No tienes los permisos necesarios para realizar esta acción.' });
  }

  const account = await accountsService.findAccount('email', email.toLowerCase());
  if (!account) {
    return res.status(404).json({ error: 'El correo electrónico ingresado no se encuentra registrado en el sistema.' });
  }

  if (!account.is_verified) {
    return res.status(409).json({ error: 'La cuenta ingresada no se encuentra verificada.' });
  }

  if (await workspacesService.isInWorkspace(workspaceId, account.account_id)) {
    return res.status(409).json({ error: 'La cuenta del correo electrónico ingresado ya forma parte del espacio de trabajo.' });
  }

  if (await workspacesService.findInvitation(workspaceId, account.account_id)) {
    return res.status(201).send('Ya se le fue enviada una invitación a la cuenta indicada.');
  }

  await workspacesService.invitationCreation(workspaceId, req.accountId, account.account_id);
  return res.status(201).send('Invitación enviada exitosamente.');
};

const invitationResponse = async (req, res) => {
  const { workspaceId, wasAccepted } = req.body;

  if (!await workspacesService.getOne(workspaceId)) {
    return res.status(404).json({ error: 'El espacio de trabajo ingresado no se encuentra registrado.' });
  }

  if (wasAccepted) {
    await workspacesService.addMember(workspaceId, req.accountId, false);
  }
  await workspacesService.invitationRemoval(workspaceId, req.accountId);

  return res.status(201).send(wasAccepted ? 'Invitación aceptada.' : 'Invitación rechazada.');
};

const memberRoleUpdate = async (req, res) => {
  const {
    workspaceId, accountId, isAdmin,
  } = req.body;

  if (!await workspacesService.getOne(workspaceId)) {
    return res.status(404).json({ error: 'El espacio de trabajo ingresado no se encuentra registrado.' });
  }

  if (!await workspacesService.isWorkspaceAdmin(workspaceId, req.accountId)) {
    return res.status(401).json({ error: 'No tienes los permisos necesarios para realizar esta acción.' });
  }

  if (accountId === req.accountId) {
    return res.status(400).json({ error: 'Un administrador no puede cambiar su propio rol en un espacio de trabajo.' });
  }

  if (!await workspacesService.isInWorkspace(workspaceId, accountId)) {
    return res.status(404).json({ error: 'La cuenta ingresada no forma parte del espacio de trabajo.' });
  }

  await workspacesService.memberRoleUpdate(
    workspaceId,
    accountId,
    isAdmin,
  );

  return res.status(200).send('El rol de la cuenta seleccionada fue actualizado exitosamente.');
};

const memberRemoval = async (req, res) => {
  const { workspaceId, accountId } = req.params;

  if (!await workspacesService.getOne(workspaceId)) {
    return res.status(404).json({ error: 'El espacio de trabajo ingresado no se encuentra registrado.' });
  }

  if (!await workspacesService.isWorkspaceAdmin(workspaceId, req.accountId)) {
    return res.status(401).json({ error: 'No tienes los permisos necesarios para realizar esta acción.' });
  }

  if (!await workspacesService.isInWorkspace(workspaceId, accountId)) {
    return res.status(404).json({ error: 'La cuenta ingresada no forma parte del espacio de trabajo.' });
  }

  if (accountId === req.accountId) {
    return res.status(400).json({ error: 'Un administrador no se puede eliminar a si mismo de un espacio de trabajo.' });
  }

  await workspacesService.memberRemoval(workspaceId, accountId);
  return res.status(202).send('Cuenta removida exitosamente del espacio de trabajo.');
};

// hey

const leaveWorkspace = async (req, res) => {
  const { workspaceId } = req.params;

  console.log(workspaceId, req.accountId)
  if (!await workspacesService.getOne(workspaceId)) {
    return res.status(404).json({ error: 'El espacio de trabajo ingresado no se encuentra registrado.' });
  }

  if (!await workspacesService.isInWorkspace(workspaceId, req.accountId)) {
    return res.status(404).json({ error: 'La cuenta ingresada no forma parte del espacio de trabajo.' });
  }

  if ((await workspacesService.getAdminCount(workspaceId) === 1)
    && (await workspacesService.isWorkspaceAdmin(workspaceId, req.accountId))) {
    return res.status(400).json({ error: 'No se puede abandonar un espacio de trabajo si se es el unico administrador.' });
  }

  await workspacesService.memberRemoval(workspaceId, req.accountId);
  return res.status(202).send('Su cuenta abandonó el espacio de trabajo exitosamente.');
};

module.exports = {
  create,
  getAll,
  updateName,
  updateColor,
  getMembers,
  getInvitations,
  invitationCreation,
  invitationResponse,
  memberRoleUpdate,
  memberRemoval,

  leaveWorkspace,
};
