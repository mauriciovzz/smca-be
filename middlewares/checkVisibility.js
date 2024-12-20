const nodesService = require('../services/nodes');
const locationsService = require('../services/locations');
const CustomError = require('../utils/CustomError');

const checkVisibility = async (req, res, next) => {
  const { nodeId } = req.params;

  const nodeData = await nodesService.find(nodeId);

  if (!nodeData)
    return next(new CustomError('NodeDoesNotExist', 404));

  if (!nodeData.location_id)
    return next(new CustomError('NodeDoesNotHaveLocation', 404));

  const locationData = await locationsService.find(nodeData.location_id);

  req.params.nodeData = nodeData;

  if (locationData.is_visible) {
    return next();
  }

  return next('route');
};

module.exports = checkVisibility;
