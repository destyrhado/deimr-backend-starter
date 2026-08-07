import type { Request, Response, NextFunction } from 'express';
import { UserRole, UserStatus, type ValidationError } from '../types/http.js';
import { createHttpError } from '../utils/httpError.js';

const isEmail = (value: unknown) => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isString = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;

const validateCommonUserUpdate = (body: Record<string, unknown>, allowStatus: boolean) => {
  const { name, email, password, role, status, active } = body;
  const errors: ValidationError[] = [];

  if (name && !isString(name)) {
    errors.push({ field: 'name', message: 'Name must be a non-empty string.' });
  }

  if (email && !isEmail(email)) {
    errors.push({ field: 'email', message: 'Email must be a valid email address.' });
  }

  if (typeof password !== 'undefined' && (!isString(password) || password.length < 8)) {
    errors.push({ field: 'password', message: 'Password must be at least 8 characters.' });
  }

  if (typeof role !== 'undefined') {
    errors.push({ field: 'role', message: 'Role changes are only permitted on /api/v1/users/{id}/role.' });
  }

  if (typeof active !== 'undefined') {
    errors.push({ field: 'active', message: 'The active field is not supported. Use status instead.' });
  }

  if (typeof status !== 'undefined') {
    if (!allowStatus) {
      errors.push({ field: 'status', message: 'Status changes are only permitted for administrator user updates.' });
    } else if (!Object.values(UserStatus).includes(String(status).toUpperCase() as UserStatus)) {
      errors.push({ field: 'status', message: 'Status must be ACTIVE, INACTIVE, or SUSPENDED.' });
    } else {
      body.status = String(status).toUpperCase();
    }
  }

  return errors;
};

export const validateProfileUpdate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validateCommonUserUpdate(req.body, false);
  if (errors.length > 0) {
    next(createHttpError(400, 'Invalid profile update data', errors));
    return;
  }

  next();
};

export const validateUserUpdate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validateCommonUserUpdate(req.body, true);
  if (errors.length > 0) {
    next(createHttpError(400, 'Invalid user update data', errors));
    return;
  }

  next();
};

export const validateRoleUpdate = (req: Request, res: Response, next: NextFunction) => {
  const { role } = req.body;
  if (!role || !Object.values(UserRole).includes(String(role).toUpperCase() as UserRole)) {
    next(createHttpError(400, 'Invalid role', [{ field: 'role', message: 'Role must be USER, ADMIN, or SUPER_ADMIN.' }]));
    return;
  }

  req.body.role = String(role).toUpperCase();
  next();
};
