const tokenHelper = require('../utils/tokenHelper');
const workspacesService = require('../services/workspaces');
const accountsService = require('../services/accounts');

const create = async (req, res) => {
  const {
    name, color,
  } = req.body;

  await workspacesService.create(
    tokenHelper.getAccountId(req.authToken),
    name,
    color.toUpperCase(),
  );

  return res.status(201).send('Espacio de trabajo creado exitosamente.');
};

const getAll = async (req, res) => {
  const workspaces = await workspacesService.getAll(req.accountId);
  return res.status(200).send(workspaces);
};

const addAccount = async (req, res) => {
  const {
    workspaceId, email, isAdmin,
  } = req.body;

  if (!await workspacesService.getOne(workspaceId)) {
    return res.status(404).json({ error: 'El espacio de trabajo ingresado no se encuentra registrado.' });
  }

  const account = await accountsService.findAccount('email', email.toLowerCase());
  if (!account) {
    return res.status(404).json({ error: 'El correo electrónico ingresado no se encuentra registrado en el sistema.' });
  }

  if (!await workspacesService.isInWorkspace(workspaceId, req.accountId)
    || !await workspacesService.isWorkspaceAdmin(workspaceId, req.accountId)) {
    return res.status(401).json({ error: 'No tienes los permisos necesarios para realizar esta acción.' });
  }

  if (await workspacesService.isInWorkspace(workspaceId, account.account_id)) {
    return res.status(409).json({ error: 'La cuenta del correo electrónico ingresado ya forma parte del espacio de trabajo.' });
  }

  await workspacesService.addAccount(
    workspaceId,
    account.account_id,
    isAdmin,
  );

  return res.status(201).send('Cuenta agregada exitosamente al espacio de trabajo.');
};

const removeAccount = async (req, res) => {
  const {
    workspaceId, accountId,
  } = req.body;

  if (!await workspacesService.getOne(workspaceId)) {
    return res.status(404).json({ error: 'El espacio de trabajo ingresado no se encuentra registrado.' });
  }

  if (!await workspacesService.isInWorkspace(workspaceId, req.accountId)
    || !await workspacesService.isWorkspaceAdmin(workspaceId, req.accountId)) {
    return res.status(401).json({ error: 'No tienes los permisos necesarios para realizar esta acción.' });
  }

  if (accountId === req.accountId) {
    return res.status(400).json({ error: 'Un administrador no se puede eliminar a si mismo de un espacio de trabajo.' });
  }

  if (!await workspacesService.isInWorkspace(workspaceId, accountId)) {
    return res.status(404).json({ error: 'La cuenta ingresada no forma parte del espacio de trabajo.' });
  }

  await workspacesService.removeAccount(
    workspaceId,
    accountId,
  );

  return res.status(202).send('Cuenta removida exitosamente del espacio de trabajo.');
};

const leaveWorkspace = async (req, res) => {
  const {
    workspaceId,
  } = req.body;

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

  await workspacesService.removeAccount(
    workspaceId,
    req.accountId,
  );

  return res.status(202).send('Su cuenta abandonó el espacio de trabajo exitosamente.');
};

const updateAccountRole = async (req, res) => {
  const {
    workspaceId, accountId, isAdmin,
  } = req.body;

  if (!await workspacesService.getOne(workspaceId)) {
    return res.status(404).json({ error: 'El espacio de trabajo ingresado no se encuentra registrado.' });
  }

  if (!await workspacesService.isInWorkspace(workspaceId, req.accountId)
    || !await workspacesService.isWorkspaceAdmin(workspaceId, req.accountId)) {
    return res.status(401).json({ error: 'No tienes los permisos necesarios para realizar esta acción.' });
  }

  if (accountId === req.accountId) {
    return res.status(400).json({ error: 'Un administrador no puede cambiar su propio rol en un espacio de trabajo.' });
  }

  if (!await workspacesService.isInWorkspace(workspaceId, accountId)) {
    return res.status(404).json({ error: 'La cuenta ingresada no forma parte del espacio de trabajo.' });
  }

  await workspacesService.updateAccountRole(
    workspaceId,
    accountId,
    isAdmin,
  );

  return res.status(200).send('El rol de la cuenta seleccionada fue actualizado exitosamente.');
};

const update = async (req, res) => {
  const {
    workspaceId, name, color,
  } = req.body;

  if (!await workspacesService.getOne(workspaceId)) {
    return res.status(404).json({ error: 'El espacio de trabajo ingresado no se encuentra registrado.' });
  }

  if (!await workspacesService.isInWorkspace(workspaceId, req.accountId)
    || !await workspacesService.isWorkspaceAdmin(workspaceId, req.accountId)) {
    return res.status(401).json({ error: 'No tienes los permisos necesarios para realizar esta acción.' });
  }

  await workspacesService.update(
    workspaceId,
    name,
    color.toUpperCase(),
  );

  return res.status(201).send('Espacio de trabajo actualizado exitosamente.');
};

module.exports = {
  create,
  getAll,
  addAccount,
  removeAccount,
  leaveWorkspace,
  updateAccountRole,
  update,
};
