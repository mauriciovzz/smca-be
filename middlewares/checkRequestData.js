const checkReqParams = (schema) => (
  async (req, res, next) => {
    try {
      await schema.validateAsync(req.params);
      return next();
    } catch (error) {
      return next(error);
    }
  }
);

const checkReqBody = (schema) => (
  async (req, res, next) => {
    try {
      await schema.validateAsync(req.body);
      return next();
    } catch (error) {
      return next(error);
    }
  }
);

module.exports = {
  checkReqBody,
  checkReqParams,
};
