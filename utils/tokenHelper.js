const crypto = require('node:crypto');
const ms = require('ms');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const createVerificationToken = (expiration) => (
  {
    verificationToken: crypto.randomBytes(32).toString('hex').toUpperCase(),
    verificationTokenExpiration: (Date.now() + ms(expiration)) / 1000,
  }
);

const createRefreshToken = (accountId, rememberMe) => jwt.sign(
  { accountId },
  config.REFRESH_TOKEN_SECRET,
  {
    expiresIn: rememberMe
      ? config.REFRESH_TOKEN_LONG_EXPIRY
      : config.REFRESH_TOKEN_SHORT_EXPIRY,
  },
);

const createAccessToken = (accountId) => jwt.sign(
  { accountId },
  config.ACCESS_TOKEN_SECRET,
  { expiresIn: config.ACCESS_TOKEN_EXPIRY },
);

const verify = (token, secret) => jwt.verify(token, secret);

module.exports = {
  createVerificationToken,
  createRefreshToken,
  createAccessToken,
  verify,
};
