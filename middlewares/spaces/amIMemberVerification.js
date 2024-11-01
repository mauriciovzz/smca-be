const CustomError = require('../../utils/CustomError');

const spacesService = require('../../services/spaces');

const amIMemberVerification = async (req, res, next) => {
  const { spaceId, accountId } = req;

  if (!await spacesService.isMember(spaceId, accountId))
    return next(new CustomError('Acceso no autorizado.', 401));

  return next();
};

module.exports = amIMemberVerification;
