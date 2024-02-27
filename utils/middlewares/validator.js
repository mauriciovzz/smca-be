const validate = (schema) => (
  // eslint-disable-next-line consistent-return
  async (req, res, next) => {
    try {
      const validated = await schema.validateAsync(req.body);
      req.body = validated;
      next();
    } catch (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
  }
);

const validateParams = (schema) => (
  // eslint-disable-next-line consistent-return
  async (req, res, next) => {
    try {
      const validated = await schema.validateAsync(req.params);
      req.params = validated;
      next();
    } catch (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
  }
);

module.exports = {
  validate,
  validateParams,
};
