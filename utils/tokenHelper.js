const jwt = require('jsonwebtoken');
const config = require('./config');

const generateRefreshToken = (accountId, rememberMe) => jwt.sign(
  { accountId },
  config.SECRET,
  {
    expiresIn: rememberMe
      ? parseInt(config.RT_LONG_EXPIRATION, 10)
      : parseInt(config.RT_SHORT_EXPIRATION, 10),
  },
);

const generateAccessToken = (accountId) => jwt.sign(
  { accountId },
  config.SECRET,
  { expiresIn: parseInt(config.AT_EXPIRATION, 10) },
);

const generateVerificationToken = (data) => jwt.sign(
  data,
  config.SECRET,
  { expiresIn: parseInt(config.VT_EXPIRATION, 10) },
);

const verifyToken = (token) => jwt.verify(token, config.SECRET);

const getAccountId = (token) => {
  const decode = verifyToken(token);
  return decode.accountId;
};

module.exports = {
  generateRefreshToken,
  generateAccessToken,
  generateVerificationToken,
  verifyToken,
  getAccountId,
};
