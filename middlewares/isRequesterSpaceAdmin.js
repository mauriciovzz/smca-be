const spacesService = require('../services/spaces');
const CustomError = require('../utils/CustomError');

const isRequesterSpaceAdmin = async (req, res, next) => {
  const { spaceId, accountId } = req;

  if (!await spacesService.isMember(spaceId, accountId))
    return next(new CustomError('SpaceAccessDenied', 403));

  if (!await spacesService.isAdmin(spaceId, accountId))
    return next(new CustomError('NotSpaceAdmin', 403));

  return next();
};

module.exports = isRequesterSpaceAdmin;
