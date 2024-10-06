const CustomError = require('../utils/CustomError');

const unknownEndpointHandler = (req, res, next) => {
  next(new CustomError('Página no encontrada.', 404));
};

module.exports = unknownEndpointHandler;
