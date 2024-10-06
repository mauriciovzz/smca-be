const accountsService = require('../services/accounts');
const verificationTokensService = require('../services/verificationTokens');

const CustomError = require('../utils/CustomError');
const config = require('../config/config');
const passwordProtector = require('../utils/passwordProtector');
const mailSender = require('../utils/mailSender');
const tokenHelper = require('../utils/tokenHelper');

const create = async (req, res) => {
  const {
    firstName, lastName, email, password,
  } = req.body;

  if (await accountsService.findByEmail(email))
    throw new CustomError('El correo electrónico ingresado ya se encuentra registrado.', 409);

  const createdAccountData = await accountsService.create(
    firstName,
    lastName,
    email.toLowerCase(),
    await passwordProtector.hashPassword(password),
  );

  const {
    verificationToken, verificationTokenExpiration,
  } = tokenHelper.createVerificationToken(config.VERIFICATION_TOKEN_LONG_EXPIRY);

  await verificationTokensService.create(
    createdAccountData.account_id,
    'account',
    verificationToken,
    null,
    verificationTokenExpiration,
  );

  // const { origin } = req.headers;
  const origin = 'http://localhost:3001';
  const path = `/verificar-cuenta/${createdAccountData.account_id}/${verificationToken}`;

  try {
    await mailSender.accountVerification(createdAccountData, origin, path);

    return res.status(200).send('Se ha enviado un enlace para la verificación de su cuenta a su correo electrónico.');
  } catch {
    await accountsService.remove(createdAccountData.account_id);

    throw new CustomError('Ha ocurrido un error al momento de crear su cuenta. Intente de nuevo más tarde.', 500);
  }
};

const verify = async (req, res) => {
  const { tokenData } = req;

  await accountsService.verify(tokenData.account_id);
  await verificationTokensService.remove(tokenData.account_id, 'account');

  return res.status(201).send('Su cuenta fue verificada exitosamente.');
};

const resendVerificationToken = async (req, res) => {
  const { email } = req.body;

  const accountData = await accountsService.findByEmail(email.toLowerCase());

  if (!accountData)
    throw new CustomError('El correo electrónico ingresado no se encuentra registrado.', 409);

  if (accountData.is_verified)
    throw new CustomError('Su cuenta ya se encuentra verificada.', 410);

  const {
    verificationToken, verificationTokenExpiration,
  } = tokenHelper.createVerificationToken(config.VERIFICATION_TOKEN_LONG_EXPIRY);

  await verificationTokensService.create(
    accountData.account_id,
    'account',
    verificationToken,
    null,
    verificationTokenExpiration,
  );

  // const { origin } = req.headers;
  const origin = 'http://localhost:3001';
  const path = `/verificar-cuenta/${accountData.account_id}/${verificationToken}`;

  try {
    await mailSender.accountVerification(accountData, origin, path);

    return res.status(200).send('Se ha enviado un nuevo enlace para la verificación de su cuenta a su correo electrónico.');
  } catch {
    throw new CustomError('Ha ocurrido un error al momento de reenviar un nuevo enlace de verificacion a su cuenta. Intente de nuevo más tarde.', 500);
  }
};

const get = async (req, res) => {
  const { accountData } = req;

  return res.status(200).send({
    firstName: accountData.first_name,
    lastName: accountData.last_name,
    email: accountData.email,
  });
};

const updateName = async (req, res) => {
  const { accountId } = req.params;
  const { firstName, lastName } = req.body;

  await accountsService.updateName(
    accountId,
    firstName,
    lastName,
  );

  return res.status(200).send('Nombre actualizado exitosamente.');
};

const updatePassword = async (req, res) => {
  const { accountData } = req;
  const { currentPassword, newPassword, repeatNewPassword } = req.body;

  if (newPassword !== repeatNewPassword)
    throw new CustomError('Los campos \'Nueva contraseña\' y \'Repetir nueva contraseña\' deben de coincidir.', 400);

  if (!await passwordProtector.checkPassword(currentPassword, accountData.password_hash))
    throw new CustomError('Contraseña incorrecta.', 401);

  await accountsService.updatePassword(
    accountData.account_id,
    await passwordProtector.hashPassword(newPassword),
  );

  return res.status(201).send('Contraseña actualizada exitosamente.');
};

const updateEmail = async (req, res) => {
  const { accountData } = req;
  const { newEmail, password } = req.body;

  if (!await passwordProtector.checkPassword(password, accountData.password_hash))
    throw new CustomError('Contraseña incorrecta.', 401);

  if (await accountsService.findByEmail(newEmail.toLowerCase()))
    throw new CustomError('El correo electrónico ingresado ya se encuentra registrado.', 409);

  const {
    verificationToken, verificationTokenExpiration,
  } = tokenHelper.createVerificationToken(config.VERIFICATION_TOKEN_SHORT_EXPIRY);

  await verificationTokensService.create(
    accountData.account_id,
    'email',
    verificationToken,
    newEmail,
    verificationTokenExpiration,
  );

  // const { origin } = req.headers;
  const origin = 'http://localhost:3001';
  const path = `/verificar-correo-electronico/${accountData.account_id}/${verificationToken}`;

  try {
    await mailSender.newEmailVerification(accountData, newEmail, origin, path);

    return res.status(200).send('Se ha enviado un enlace al correo electrónico ingresado, para la verificacion del mismo.');
  } catch {
    throw new CustomError('Ha ocurrido un error al momento de enviar un enlace de verificacion a su nuevo correo electrónico. Intente de nuevo más tarde.', 500);
  }
};

const verifyEmail = async (req, res) => {
  const { tokenData } = req;

  if (await accountsService.findByEmail(tokenData.email))
    throw new CustomError('El correo electrónico ingresado ya se encuentra registrado.', 409);

  await accountsService.updateEmail(tokenData.account_id, tokenData.email);
  await verificationTokensService.remove(tokenData.account_id, 'email');

  return res.status(200).send('Su correo electrónico fue actualizado exitosamente.');
};

const remove = async (req, res) => {
  const { accountData } = req;
  const { password } = req.body;

  if (!await passwordProtector.checkPassword(password, accountData.password_hash))
    throw new CustomError('Contraseña incorrecta.', 401);

  // future checks ?

  await accountsService.remove(accountData.accountId);

  return res.status(200).send('Su cuenta fue eliminada exitosamente.');
};

const recoverPassword = async (req, res) => {
  const { email } = req.body;

  const accountData = await accountsService.findByEmail(email.toLowerCase());

  if (!accountData)
    throw new CustomError('El correo electrónico ingresado no se encuentra registrado.', 404);

  if (!accountData.is_verified)
    throw new CustomError('Su cuenta no se encuentra verificada. Inicie sesión para solicitar un nuevo enlace de verificación.', 401);

  const {
    verificationToken, verificationTokenExpiration,
  } = tokenHelper.createVerificationToken(config.VERIFICATION_TOKEN_SHORT_EXPIRY);

  await verificationTokensService.create(
    accountData.account_id,
    'password',
    verificationToken,
    null,
    verificationTokenExpiration,
  );

  // const { origin } = req.headers;
  const origin = 'http://localhost:3001';
  const path = `/restablecer-contrasena/${accountData.account_id}/${verificationToken}`;

  try {
    await mailSender.passwordReset(accountData, origin, path);

    return res.status(200).send('Se ha enviado un enlace para el restablecimiento de su contraseña a su correo electrónico.');
  } catch {
    throw new CustomError('Ha ocurrido un error al momento de enviar un enlace para el restablecimiento de su contraseña a su correo electrónico. Intente de nuevo más tarde.', 500);
  }
};

const resetPassword = async (req, res) => {
  const { tokenData } = req;
  const { newPassword, repeatNewPassword } = req.body;

  if (newPassword !== repeatNewPassword)
    throw new CustomError('Los campos \'Nueva contraseña\' y \'Repetir nueva contraseña\' deben de coincidir.', 400);

  const newPasswordHash = await passwordProtector.hashPassword(newPassword);

  await accountsService.updatePassword(tokenData.account_id, newPasswordHash);
  await verificationTokensService.remove(tokenData.account_id, 'password');

  return res.status(200).send('Contraseña restablecida exitosamente.');
};

module.exports = {
  create,
  verify,
  resendVerificationToken,
  get,
  updateName,
  updatePassword,
  updateEmail,
  verifyEmail,
  remove,
  recoverPassword,
  resetPassword,
};
