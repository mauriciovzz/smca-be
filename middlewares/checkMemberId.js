const spacesService = require('../services/spaces');
const CustomError = require('../utils/CustomError');

const checkMemberId = async (req, res, next) => {
  const { spaceId, accountId } = req.params;

  if (!await spacesService.isMember(spaceId, accountId))
    return next(new CustomError('La cuenta no forma parte del espacio.', 404));

  if (req.accountId === accountId)
    return next(new CustomError('Un administrador no puede editarse a si mismo.', 400));

  return next();
};

module.exports = checkMemberId;
