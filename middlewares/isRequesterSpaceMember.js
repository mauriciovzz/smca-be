const spacesService = require('../services/spaces');
const CustomError = require('../utils/CustomError');

const isRequesterSpaceMember = async (req, res, next) => {
  const { spaceId, accountId } = req;

  if (!await spacesService.isMember(spaceId, accountId))
    return next(new CustomError('SpaceAccessDenied', 403));

  return next();
};

module.exports = isRequesterSpaceMember;
