import { IGenericErrorResponse } from './interfaces/IGenericErrorResponse';
import { IGenericErrorMessage } from './interfaces/IGenericErrorMessage';

const handleMongoServerError = (err: any): IGenericErrorResponse => {
  const duplicateKey = Object.keys(err.keyValue);
  const message = `${duplicateKey} is already taken !`;

  const errors: IGenericErrorMessage[] = [
    {
      path: 'Duplicate entry',
      message: `${duplicateKey.join(', ')} is already taken !`,
    },
  ];

  return {
    statusCode: 500,
    message: message,
    errorMessages: errors,
  };
};

export default handleMongoServerError;
