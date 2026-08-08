import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

export const requestContext = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const incomingRequestId =
    req.header('x-request-id') ?? req.header('x-correlation-id');
  const requestId = incomingRequestId?.trim() || randomUUID();

  req.id = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
};
