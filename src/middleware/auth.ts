import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { AuthPayload } from '../types/http.js';
import { createHttpError } from '../utils/httpError.js';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    next(createHttpError(401, 'Unauthorized'));
    return;
  }

  try {
    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, env.jwtAccessSecret) as AuthPayload;
    req.user = { id: payload.sub, email: payload.email, role: payload.role };
    next();
  } catch {
    next(createHttpError(401, 'Invalid or expired token'));
  }
};

export const authorize = (...roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    next(createHttpError(401, 'Unauthorized'));
    return;
  }

  if (!roles.includes(req.user.role)) {
    next(createHttpError(403, 'You do not have permission to access this resource.'));
    return;
  }

  next();
};
