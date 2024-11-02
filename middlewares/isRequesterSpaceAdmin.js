const spacesService = require('../services/spaces');
const CustomError = require('../utils/CustomError');

const isRequesterSpaceAdmin = async (req, res, next) => {
  const { spaceId, accountId } = req;

  if (!await spacesService.isAdmin(spaceId, accountId))
    return next(new CustomError('No tienes los permisos necesarios para realizar esta acción.', 401));

  return next();
};

module.exports = isRequesterSpaceAdmin;
