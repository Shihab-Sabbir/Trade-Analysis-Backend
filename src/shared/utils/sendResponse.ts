import { Response } from 'express';

type IApiResponse<T> = {
  success: boolean;
  statusCode: number;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
  data?: T | null;
  message?: string | null;
};

const sendResponse = <T>(res: Response, result: IApiResponse<T>): void => {
  const {
    success,
    message = null,
    meta = null,
    data = null,
    statusCode,
  } = result;

  const response = {
    success,
    ...(message && { message }),
    ...(meta && { meta }),
    ...(data && { data }),
    statusCode,
  };

  res.status(statusCode).send(response);
};

export default sendResponse;
