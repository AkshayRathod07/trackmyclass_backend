import { HttpError } from 'http-errors';
import { Request, Response, NextFunction } from 'express';
import { config } from '../db/config';

const globalErrorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.status || 500;

  return res.status(statusCode).json({
    message: err.message,
    errorStack: config.nodeEnv === 'dev' ? err.stack : '', // only for dev purpose
  });
};

export default globalErrorHandler;
