import ErrorHandler from '../utils/errorHandler.js';

const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  //Wrong Mongodb id Error
  if ((err.name = 'CastError')) {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  //mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  //JWT Token Error
  if (err.name === 'JsonWebTokenError') {
    const message = `Json web Token is Invalid, try agin`;
    err = new ErrorHandler(message, 400);
  }

  //JWT expire Error
  if (err.name === 'TokenExpiredError') {
    const message = `Json web Token is Expired, try agin`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default errorMiddleware;
