const allowedOrigins = require('../config/allowedOrigins');

const originVerification = (req, res, next) => {
  const { origin } = req.headers;

  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Credentials', true);
  }

  next();
};

module.exports = originVerification;
