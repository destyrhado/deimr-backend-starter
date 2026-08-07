import type { Request, Response, NextFunction } from 'express';
import { UserRole, UserStatus } from '../types/http.js';

const isEmail = (value: unknown) => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isString = (value: unknown) => typeof value === 'string' && value.trim().length > 0;

export const validateUserUpdate = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password, role, status, active } = req.body;

  if (name && !isString(name)) {
    res.status(400).json({ success: false, message: 'Invalid name', statusCode: 400 });
    return;
  }

  if (email && !isEmail(email)) {
    res.status(400).json({ success: false, message: 'Invalid email address', statusCode: 400 });
    return;
  }

  if (password && (!isString(password) || password.length < 8)) {
    res.status(400).json({ success: false, message: 'Password must be at least 8 characters', statusCode: 400 });
    return;
  }

  if (typeof role !== 'undefined') {
    res.status(400).json({ success: false, message: 'Role changes are not permitted on this endpoint', statusCode: 400 });
    return;
  }

  if (typeof active !== 'undefined') {
    res.status(400).json({ success: false, message: 'The active field is not supported. Use status instead.', statusCode: 400 });
    return;
  }

  if (typeof status !== 'undefined' && !Object.values(UserStatus).includes(String(status).toUpperCase() as UserStatus)) {
    res.status(400).json({ success: false, message: 'Invalid status', statusCode: 400 });
    return;
  }

  next();
};

export const validateRoleUpdate = (req: Request, res: Response, next: NextFunction) => {
  const { role } = req.body;
  if (!role || !Object.values(UserRole).includes(String(role).toUpperCase() as UserRole)) {
    res.status(400).json({ success: false, message: 'Invalid role', statusCode: 400 });
    return;
  }

  next();
};
