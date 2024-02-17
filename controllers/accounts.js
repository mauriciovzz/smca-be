const crypto = require('node:crypto');
const mailHelper = require('../utils/mailHelper');
const passwordProtection = require('../utils/passwordProtection');
const tokenHelper = require('../utils/tokenHelper');
const accountsService = require('../services/accounts');
const config = require('../utils/config');

const register = async (req, res) => {
  const {
    email, password, firstName, lastName,
  } = req.body;

  if (await accountsService.findAccount('email', email.toLowerCase())) {
    return res.status(409).json({ error: 'El correo electrónico ingresado ya se encuentra registrado.' });
  }

  const accountInfo = await accountsService.create(
    email.toLowerCase(),
    await passwordProtection.hashPassword(password),
    firstName,
    lastName,
  );

  const token = crypto.randomBytes(32).toString('hex').toUpperCase();
  const expiration = Date.now() / 1000 + parseInt(config.AV_EXPIRATION, 10);

  await accountsService.createVerificationToken(accountInfo.account_id, 'account', null, token, expiration);

  const path = `/verificar/cuenta/${token}`;
  await mailHelper.accountVerification(accountInfo, path);

  return res.status(200).send('Se ha enviado un enlace para la verificacion de su cuenta');
};

const resendVerificationLink = async (req, res) => {
  const { email } = req.body;

  const accountInfo = await accountsService.findAccount('email', email.toLowerCase());
  if (!accountInfo) {
    return res.status(409).json({ error: 'El correo electrónico ingresado no se encuentra registrado.' });
  }

  if (accountInfo.is_verified) {
    return res.status(200).send('Su cuenta ya se encuentra verificada.');
  }

  const token = crypto.randomBytes(32).toString('hex').toUpperCase();
  const expiration = Date.now() / 1000 + parseInt(config.AV_EXPIRATION, 10);

  await accountsService.createVerificationToken(accountInfo.account_id, 'account', token, expiration);

  const path = `/verificar/cuenta/${token}`;
  await mailHelper.accountVerification(accountInfo, path);

  return res.status(200).send('Se ha enviado un enlace para la verificacion de su cuenta');
};

const verifyAccount = async (req, res) => {
  const { verificationToken } = req.body;

  const tokenInfo = await accountsService.findVerificationToken('account', verificationToken);
  if (!tokenInfo) {
    return res.status(404).json({ error: 'Link inválido.' });
  }

  if ((Date.now() / 1000) > (Date.parse(tokenInfo.expiration) / 1000)) {
    return res.status(410).json({ error: 'EL link utilizado ha expirado.' });
  }

  await accountsService.verifyAccount(tokenInfo.account_id);
  await accountsService.deleteVerificationToken(verificationToken);

  return res.status(201).send('Su cuenta fue verificada exitosamente.');
};

const recoverPassword = async (req, res) => {
  const { email } = req.body;

  const account = await accountsService.findAccount('email', email.toLowerCase());
  if (!account) {
    return res.status(401).json({ error: 'El correo electrónico ingresado no se encuentra registrado.' });
  }

  if (!account.is_verified) {
    return res.status(401).json({ error: 'Su cuenta no se encuentra verificada.' });
  }

  const token = crypto.randomBytes(32).toString('hex').toUpperCase();
  const expiration = Date.now() / 1000 + parseInt(config.PR_EXPIRATION, 10);

  await accountsService.createVerificationToken(account.account_id, 'password', null, token, expiration);

  const path = `/restablecer-contraseña/${token}`;
  await mailHelper.passwordReset(account, path);

  return res.status(200).send('Se ha enviado un enlace para el restablecimiento de su contraseña');
};

const resetPassword = async (req, res) => {
  const { verificationToken, newPassword } = req.body;

  const tokenInfo = await accountsService.findVerificationToken('password', verificationToken);
  if (!tokenInfo) {
    return res.status(404).json({ error: 'Link inválido.' });
  }

  if ((Date.now() / 1000) > (Date.parse(tokenInfo.expiration) / 1000)) {
    await accountsService.deleteVerificationToken(verificationToken);
    return res.status(410).json({ error: 'El link utilizado ha expirado.' });
  }

  const newPasswordHash = await passwordProtection.hashPassword(newPassword);

  await accountsService.updatePassword(newPasswordHash, tokenInfo.account_id);
  await accountsService.deleteVerificationToken(verificationToken);

  return res.status(200).send('Contraseña restablecida exitosamente.');
};

const login = async (req, res) => {
  const { email, password, rememberMe } = req.body;

  const account = await accountsService.findAccount('email', email.toLowerCase());
  if (!account) {
    return res.status(401).json({ error: 'El correo electrónico ingresado no se encuentra registrado.' });
  }

  if (!account.is_verified) {
    return res.status(401).json({ error: 'Su cuenta no se encuentra verificada.' });
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

  const token = crypto.randomBytes(32).toString('hex').toUpperCase();
  const expiration = Date.now() / 1000 + parseInt(config.EV_EXPIRATION, 10);

  await accountsService.createVerificationToken(account.account_id, 'email', newEmail, token, expiration);

  const path = `/verificar/correo-electronico/${token}`;
  await mailHelper.emailVerification(account, newEmail, path);

  return res.status(201).send('Un enlace de verificacion fue enviado a su nueva cuenta de correo electrónico.');
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.body;

  const tokenInfo = await accountsService.findVerificationToken('email', verificationToken);
  if (!tokenInfo) {
    return res.status(404).json({ error: 'Link inválido.' });
  }

  if ((Date.now() / 1000) > (Date.parse(tokenInfo.expiration) / 1000)) {
    await accountsService.deleteVerificationToken(verificationToken);
    return res.status(410).json({ error: 'El link utilizado ha expirado.' });
  }

  if (await accountsService.findAccount('email', tokenInfo.email)) {
    return res.status(409).json({ error: 'El correo electrónico ingresado ya se encuentra registrado.' });
  }

  await accountsService.updateEmail(tokenInfo.email, tokenInfo.account_id);
  await accountsService.deleteVerificationToken(verificationToken);

  return res.status(200).send('Su correo electrónico fue actualizado exitosamente.');
};

const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const account = await accountsService.findAccount('account_id', tokenHelper.getAccountId(req.authToken));
  if (!await passwordProtection.checkPassword(currentPassword, account.password_hash)) {
    return res.status(401).json({ error: 'Contraseña incorrecta.' });
  }

  await accountsService.updatePassword(
    await passwordProtection.hashPassword(newPassword),
    tokenHelper.getAccountId(req.authToken),
  );

  return res.status(201).send('Contraseña actualizada exitosamente.');
};

module.exports = {
  register,
  resendVerificationLink,
  verifyAccount,
  recoverPassword,
  resetPassword,
  login,
  refreshAccessToken,
  updateName,
  updateEmail,
  verifyEmail,
  updatePassword,
};
