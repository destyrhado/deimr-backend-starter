import type { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { sendError } from '../utils/response.js';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next: NextFunction) => {
  const statusCode = err.statusCode ?? 500;
  const message = err.message ?? 'Internal Server Error';

  res.status(statusCode).json(sendError(message, statusCode));
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json(sendError(`Route ${req.originalUrl} not found`, 404));
};
