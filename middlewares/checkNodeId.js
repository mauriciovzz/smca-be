const nodesService = require('../services/nodes');
const CustomError = require('../utils/CustomError');

const checkNodeId = async (req, res, next) => {
  const { spaceId } = req;
  const { nodeId } = req.params;

  const nodeData = await nodesService.find(nodeId, spaceId);

  if (!nodeData)
    return next(new CustomError('El nodo indicado no se encuentra registrado.', 404));

  req.nodeData = nodeData;
  return next();
};

module.exports = checkNodeId;
