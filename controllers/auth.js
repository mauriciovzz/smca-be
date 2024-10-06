const ms = require('ms');
const CustomError = require('../utils/CustomError');
const config = require('../config/config');
const accountsService = require('../services/accounts');
const passwordProtector = require('../utils/passwordProtector');
const tokenHelper = require('../utils/tokenHelper');

const login = async (req, res) => {
  const { email, password, rememberMe } = req.body;

  const accountData = await accountsService.findByEmail(email.toLowerCase());

  if (!accountData)
    throw new CustomError('El correo electrónico ingresado no se encuentra registrado.', 409);

  if (!accountData.is_verified)
    throw new CustomError('Su cuenta no se encuentra verificada.', 401);

  if (!await passwordProtector.checkPassword(password, accountData.password_hash))
    throw new CustomError('Contraseña incorrecta.', 401);

  const accessToken = tokenHelper.createAccessToken(accountData.account_id);
  const refreshToken = tokenHelper.createRefreshToken(accountData.account_id, rememberMe);
  const cookieExpiry = rememberMe
    ? ms(config.REFRESH_TOKEN_LONG_EXPIRY)
    : ms(config.REFRESH_TOKEN_SHORT_EXPIRY);

  return res
    .cookie(
      'smcaRefreshToken',
      refreshToken,
      {
        httpOnly: true,
        path: '/api/auth/refresh-access-token',
        expires: new Date(Date.now() + cookieExpiry),
      },
    )
    .status(200).send({
      accessToken,
      accountId: accountData.account_id,
      firstName: accountData.first_name,
    });
};

const logout = async (req, res) => (
  res.clearCookie('connect.sid').redirect('/')
);

const refreshAccessToken = async (req, res) => {
  const { cookies } = req;

  if (!cookies?.smcaRefreshToken)
    throw new CustomError('La sesión ha expirado.', 403);

  try {
    const { accountId } = tokenHelper.verify(cookies.smcaRefreshToken, config.REFRESH_TOKEN_SECRET);

    return res.status(200).send({ accessToken: tokenHelper.createAccessToken(accountId) });
  } catch {
    throw new CustomError('La sesión ha expirado.', 403);
  }
};

module.exports = {
  login,
  logout,
  refreshAccessToken,
};
