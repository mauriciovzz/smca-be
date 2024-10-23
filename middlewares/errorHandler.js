const logger = require('../utils/logger');
const CustomError = require('../utils/CustomError');

const devErrors = (res, error) => {
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
    stackTrace: error.stack,
    error,
  });
};

const prodErrors = (res, error) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Ha ocurrido un error. Intenta de nuevo más tarde.',
    });
  }
};

const jsonWebTokenErrorHandler = () => new CustomError('Acceso denegado.', 403);

const tokenExpiredErrorHandler = (error) => new CustomError(error.name, 403);

const validationErrorHandler = (error) => new CustomError(error.details[0].message, 422);

const errorHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (error.name === 'JsonWebTokenError') error = jsonWebTokenErrorHandler(error);
  if (error.name === 'TokenExpiredError') error = tokenExpiredErrorHandler(error);
  if (error.name === 'ValidationError') error = validationErrorHandler(error);

  logger.error(error);

  if (process.env.NODE_ENV === 'development') {
    devErrors(res, error);
  } else if (process.env.NODE_ENV === 'production') {
    prodErrors(res, error);
  }

  return next();
};

module.exports = errorHandler;