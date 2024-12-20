const checkNodeVisibility = async (req, res, next) => {
  const { nodeData } = req;

  if (nodeData.is_visible) {
    return next();
  }

  return next('route');
};

module.exports = checkNodeVisibility;
