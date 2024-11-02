const allowedOrigins = require('../config/allowedOrigins');

const checkRequestOrigin = (req, res, next) => {
  const { origin } = req.headers;

  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Credentials', true);
  }

  next();
};

module.exports = checkRequestOrigin;
