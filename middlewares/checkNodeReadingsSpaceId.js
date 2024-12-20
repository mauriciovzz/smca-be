const nodesService = require('../services/nodes');
const spacesService = require('../services/spaces');
const CustomError = require('../utils/CustomError');

const checkNodeVisibility = async (req, res, next) => {
  const { nodeId } = req.params;

  const nodeData = await nodesService.find(nodeId);

  const spaceData = await spacesService.find(nodeData.space_id);

  if (!spaceData)
    return next(new CustomError('SpaceDoesNotExist', 404));

  req.params.nodeData = nodeData;
  req.spaceId = spaceData.space_id;
  return next();
};

module.exports = checkNodeVisibility;
