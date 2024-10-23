const CustomError = require('../../utils/CustomError');

const spacesService = require('../../services/spaces');

const isMemberVerification = (checkForRequester) => (
  async (req, res, next) => {
    const { spaceId, accountId } = checkForRequester ? req : req.params;

    if (!await spacesService.isMember(spaceId, accountId)) {
      const errorMessage = checkForRequester
        ? 'No tienes los permisos necesarios para realizar esta acción.'
        : 'La cuenta ingresada no forma parte del espacio de trabajo.';

      const errorCode = checkForRequester
        ? 401
        : 404;

      return next(new CustomError(errorMessage, errorCode));
    }

    return next();
  }
);

module.exports = isMemberVerification;
