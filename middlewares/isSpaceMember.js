const CustomError = require('../utils/CustomError');

const spacesService = require('../services/spaces');

const isSpaceMember = async (req, res, next) => {
  const { spaceId, accountId } = req.params;

  if (!await spacesService.isMember(spaceId, accountId))
    return next(new CustomError('La cuenta no forma parte del espacio.', 404));

  return next();
};

module.exports = isSpaceMember;
