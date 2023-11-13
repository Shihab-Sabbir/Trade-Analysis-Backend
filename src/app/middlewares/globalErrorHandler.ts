import { ErrorRequestHandler } from 'express';
import { NODE_ENV } from '../../config';
import { IGenericErrorMessage } from '../../errors/interfaces/IGenericErrorMessage';
import handleMongooseValidationError from '../../errors/handleMongooseValidationError';
import ApiError from '../../errors/ApiError';
import { ZodError } from 'zod';
import handleZodValidationError from '../../errors/handleZodValidationError';
import handleCastError from '../../errors/handleCastError';
import handleMongoServerError from '../../errors/handleMongoServerError';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log('Global error handler ~~ ', err);

  let statusCode = 500;
  let message = 'Something went wrong';
  let errorMessages: IGenericErrorMessage[] = [];
  if (err?.name === 'ValidationError') {
    const simplifyError = handleMongooseValidationError(err);
    statusCode = simplifyError.statusCode;
    message = simplifyError.message;
    errorMessages = simplifyError.errorMessages;
  } else if (err?.name === 'CastError') {
    const simplifyError = handleCastError(err);
    statusCode = simplifyError.statusCode;
    message = simplifyError.message;
    errorMessages = simplifyError.errorMessages;
  } else if (err?.name === 'MongoServerError') {
    const simplifyError = handleMongoServerError(err);
    statusCode = simplifyError.statusCode;
    message = simplifyError.message;
    errorMessages = simplifyError.errorMessages;
  } else if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err?.message;
    errorMessages = err.message
      ? [
          {
            path: '',
            message: err?.message,
          },
        ]
      : [];
  } else if (err instanceof ZodError) {
    const simplifyError = handleZodValidationError(err);
    statusCode = simplifyError.statusCode;
    message = simplifyError.message;
    errorMessages = simplifyError.errorMessages;
  } else if (err instanceof Error) {
    message = err.message;
    errorMessages = err?.message
      ? [
          {
            path: '',
            message: err?.message,
          },
        ]
      : [];
  }
  // These if-else conditions and error modifications are being done only to maintain a specific error response pattern from different error types.
  res.status(statusCode).send({
    success: false,
    statusCode,
    message,
    errorMessages,
    stack: NODE_ENV !== 'production' ? err.stack : undefined,
  });
};

export default globalErrorHandler;
