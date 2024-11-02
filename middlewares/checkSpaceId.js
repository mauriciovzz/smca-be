const spacesService = require('../services/spaces');
const CustomError = require('../utils/CustomError');

const checkSpaceId = async (req, res, next) => {
  const { spaceId } = req.params;

  const spaceData = await spacesService.find(spaceId);

  if (!spaceData)
    return next(new CustomError('El espacio indicado no se encuentra registrado.', 404));

  req.spaceId = spaceData.space_id;
  return next();
};

module.exports = checkSpaceId;
