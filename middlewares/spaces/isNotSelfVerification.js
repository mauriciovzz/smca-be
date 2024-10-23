const CustomError = require('../../utils/CustomError');

const isNotSelfVerification = async (req, res, next) => {
  if (req.accountId === req.params.accountId)
    return next(new CustomError('Un administrador no puede editarse a si mismo.', 400));

  return next();
};

module.exports = isNotSelfVerification;
