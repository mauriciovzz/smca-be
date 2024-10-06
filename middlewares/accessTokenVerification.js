const CustomError = require('../utils/CustomError');
const tokenHelper = require('../utils/tokenHelper');
const config = require('../config/config');

const accessTokenVerification = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return next(new CustomError('Acceso no autorizado.', 401));

  const accessToken = authHeader.replace('Bearer ', '');

  const tokenData = tokenHelper.verify(
    accessToken,
    config.ACCESS_TOKEN_SECRET,
  );

  req.accountId = tokenData.accountId.toString();
  return next();
};

module.exports = accessTokenVerification;
