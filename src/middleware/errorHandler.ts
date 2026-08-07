import type { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { logger } from '../config/logger.js';
import { sendError } from '../utils/response.js';

type RuntimeError = Error & {
  statusCode?: number;
  errors?: Array<{ field: string; message: string }>;
  code?: number;
};

export const errorHandler: ErrorRequestHandler = (err: RuntimeError, req, res, _next: NextFunction) => {
  const isDuplicateKey = err.code === 11000;
  const statusCode = isDuplicateKey ? 409 : err.statusCode ?? 500;
  const message = statusCode >= 500 ? 'Internal Server Error' : isDuplicateKey ? 'User already exists' : err.message;
  const requestId = req.id;

  if (statusCode >= 500) {
    logger.error(`${requestId ?? 'no-request-id'} ${err.message}`);
  }

  res.status(statusCode).json(sendError(message, statusCode, err.errors, requestId));
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json(sendError(`Route ${req.originalUrl} not found`, 404, undefined, req.id));
};
