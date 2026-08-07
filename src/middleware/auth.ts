import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { AuthPayload } from '../types/http.js';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Unauthorized', statusCode: 401 });
    return;
  }

  try {
    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, env.jwtAccessSecret) as AuthPayload;
    req.user = { id: payload.sub, email: payload.email, role: payload.role };
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired token', statusCode: 401 });
  }
};

export const authorize = (...roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized', statusCode: 401 });
    return;
  }

  if (!roles.includes(req.user.role)) {
    res.status(403).json({ success: false, message: 'You do not have permission to access this resource.', statusCode: 403 });
    return;
  }

  next();
};
