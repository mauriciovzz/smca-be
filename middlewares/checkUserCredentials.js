const tokenHelper = require('../utils/tokenHelper');
const config = require('../config/config');

const checkUserCredentials = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const accessToken = authHeader.replace('Bearer ', '');

  if (accessToken !== 'no AT') {
    const tokenData = tokenHelper.verify(
      accessToken,
      config.ACCESS_TOKEN_SECRET,
    );

    req.accountId = tokenData.accountId.toString();
  }

  return next();
};

module.exports = checkUserCredentials;
