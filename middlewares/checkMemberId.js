const spacesService = require('../services/spaces');
const CustomError = require('../utils/CustomError');

const checkMemberId = async (req, res, next) => {
  const { spaceId, accountId } = req.params;

  if (!await spacesService.isMember(spaceId, accountId))
    return next(new CustomError('AccountNotInSpace', 404));

  if (req.accountId === accountId)
    return next(new CustomError('CanNotUpdateSelf', 403));

  return next();
};

module.exports = checkMemberId;
