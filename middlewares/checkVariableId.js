const variablesService = require('../services/variables');
const CustomError = require('../utils/CustomError');

const checkLocationId = async (req, res, next) => {
  const { spaceId } = req;
  const { variableId } = req.params;

  const variableData = await variablesService.find(variableId, spaceId);

  if (!variableData)
    return next(new CustomError('La variable indicada no se encuentra registrada.', 404));

  req.variableData = variableData;
  return next();
};

module.exports = checkLocationId;
