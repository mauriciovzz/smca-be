const componentsService = require('../services/components');
const CustomError = require('../utils/CustomError');

const checkLocationId = async (req, res, next) => {
  const { spaceId } = req;
  const { componentId } = req.params;

  const componentData = await componentsService.find(componentId, spaceId);

  if (!componentData)
    return next(new CustomError('ComponentDoesNotExists', 404));

  req.componentData = componentData;
  return next();
};

module.exports = checkLocationId;
