const crypto = require('node:crypto');
const mailHelper = require('../utils/mailHelper');
const passwordProtection = require('../utils/passwordProtection');
const tokenHelper = require('../utils/tokenHelper');
const accountsService = require('../services/accounts');

const register = async (req, res) => {
  const {
    email, password, firstName, lastName,
  } = req.body;

  if (await accountsService.findAccount('email', email.toLowerCase())) {
    return res.status(409).json({ error: 'El correo electrónico ingresado ya se encuentra registrado.' });
  }

  await accountsService.create(
    email.toLowerCase(),
    password,
    firstName,
    lastName,
  );
  return res.sendStatus(201);
};

const confirmAccount = async (req, res) => {
  const {
    email, password, firstName, lastName,
  } = req.body;

  if (await accountsService.findAccount('email', email.toLowerCase())) {
    return res.status(409).json({ error: 'El correo electrónico ingresado ya se encuentra registrado.' });
  }

  await accountsService.create(
    email.toLowerCase(),
    password,
    firstName,
    lastName,
  );
  return res.sendStatus(201);
};

const login = async (req, res) => {
  const { email, password, rememberMe } = req.body;

  const account = await accountsService.findAccount('email', email.toLowerCase());
  if (!account) {
    return res.status(401).json({ error: 'El correo electrónico ingresado no se encuentra registrado.' });
  }

  if (!await passwordProtection.checkPassword(password, account.password_hash)) {
    return res.status(401).json({ error: 'Contraseña incorrecta.' });
  }

  return res.status(200).send({
    refreshToken: tokenHelper.generateRefreshToken(account.account_id, rememberMe),
    accessToken: tokenHelper.generateAccessToken(account.account_id),
    firstName: account.first_name,
    lastName: account.last_name,
    email: account.email,
  });
};

const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    tokenHelper.verifyToken(refreshToken);
  } catch (error) {
    return res.status(403).json({ error: 'La sesión ha expirado.' });
  }

  const accountId = tokenHelper.getAccountId(refreshToken);
  const account = await accountsService.findAccount('account_id', accountId);

  return res.status(200).send({
    refreshToken,
    accessToken: tokenHelper.generateAccessToken(account.account_id),
    firstName: account.first_name,
    lastName: account.last_name,
    email: account.email,
  });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const account = await accountsService.findAccount('email', email.toLowerCase());
  if (!account) {
    return res.status(401).json({ error: 'El correo electrónico ingresado no se encuentra registrado.' });
  }

  const verificationToken = crypto.randomBytes(32).toString('hex').toUpperCase();
  const verificationTokenExpiration = Date.now() + (600000);

  await accountsService.updateVerificationToken(
    email,
    verificationToken,
    verificationTokenExpiration,
  );

  const path = `/restablecer-contraseña/${account.account_id}/${verificationToken}`;
  await mailHelper.resetPassword(account, path);

  return res.status(200).send('Un enlace de restablecimiento de contraseña fue enviado a su cuenta de correo electrónico');
};

const resetPassword = async (req, res) => {
  const { accountId, verificationToken } = req.params;

  const account = await accountsService.findAccount('account_id', accountId);
  if (!(account) || (account.verification_token !== verificationToken)) {
    return res.status(400).json({ error: 'Link inválido.' });
  }

  if (Date.now() > Date.parse(account.verification_token_expiration)) {
    await accountsService.updateVerificationToken(
      account.email,
      undefined,
      undefined,
    );
    return res.status(401).json({ error: 'EL link ingresado ha expirado.' });
  }

  const { newPassword } = req.body;
  await accountsService.updatePassword(
    newPassword,
    account.account_id,
  );

  return res.status(200).send('Contraseña restablecida exitosamente.');
};

const updateName = async (req, res) => {
  const {
    firstName, lastName,
  } = req.body;

  await accountsService.updateName(
    firstName,
    lastName,
    tokenHelper.getAccountId(req.authToken),
  );
  return res.status(200).send('Nombre actualizado exitosamente.');
};

const updateEmail = async (req, res) => {
  const {
    newEmail, password,
  } = req.body;

  const account = await accountsService.findAccount('account_id', tokenHelper.getAccountId(req.authToken));
  if (!await passwordProtection.checkPassword(password, account.password_hash)) {
    return res.status(401).json({ error: 'Contraseña incorrecta.' });
  }

  if (await accountsService.findAccount('email', newEmail.toLowerCase())) {
    return res.status(409).json({ error: 'El correo electrónico ingresado ya se encuentra registrado.' });
  }

  const payload = {
    accountId: tokenHelper.getAccountId(req.authToken),
    newEmail: newEmail.toLowerCase(),
  };
  const verificationToken = tokenHelper.generateVerificationToken(payload);

  const path = `/verificacion/${verificationToken}`;
  await mailHelper.updateEmail(account, newEmail, path);

  return res.status(201).send('Un enlace de verificacion fue enviado a su nueva cuenta de correo electrónico.');
};

const confirmEmail = async (req, res) => {
  const {
    verificationToken,
  } = req.body;

  let accountInfo = {};

  try {
    accountInfo = tokenHelper.verifyToken(verificationToken);
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'El vinculo utilizado es invalido.' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(410).json({ error: 'El vinculo utilizado ha expirado.' });
    }
  }

  if (await accountsService.findAccount('email', accountInfo.newEmail)) {
    return res.status(409).json({ error: 'El correo electrónico ingresado ya se encuentra registrado.' });
  }

  await accountsService.updateEmail(
    accountInfo.newEmail,
    accountInfo.accountId,
  );

  return res.status(200).send('Su correo electrónico fue actualizado exitosamente.');
};

const updatePassword = async (req, res) => {
  const {
    currentPassword, newPassword,
  } = req.body;

  const account = await accountsService.findAccount('account_id', tokenHelper.getAccountId(req.authToken));
  if (!await passwordProtection.checkPassword(currentPassword, account.password_hash)) {
    return res.status(401).json({ error: 'Contraseña incorrecta.' });
  }

  await accountsService.updatePassword(
    newPassword,
    tokenHelper.getAccountId(req.authToken),
  );

  return res.status(201).send('Contraseña actualizada exitosamente.');
};

module.exports = {
  register,
  login,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  updateName,
  updateEmail,
  confirmEmail,
  updatePassword,
};
