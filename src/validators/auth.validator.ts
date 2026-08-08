import type { Request, Response, NextFunction } from 'express';
import { createHttpError } from '../utils/httpError.js';
import type { ValidationError } from '../types/http.js';

const isEmail = (value: unknown) =>
  typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isString = (value: unknown) =>
  typeof value === 'string' && value.trim().length > 0;

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, email, password } = req.body;
  const errors: ValidationError[] = [];

  if (!isString(name)) {
    errors.push({ field: 'name', message: 'Name is required.' });
  }
  if (!isEmail(email)) {
    errors.push({
      field: 'email',
      message: 'A valid email address is required.',
    });
  }
  if (!isString(password) || password.length < 8) {
    errors.push({
      field: 'password',
      message: 'Password must be at least 8 characters.',
    });
  }

  if (errors.length > 0) {
    next(createHttpError(400, 'Invalid registration data', errors));
    return;
  }

  next();
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;
  const errors: ValidationError[] = [];

  if (!isEmail(email)) {
    errors.push({
      field: 'email',
      message: 'A valid email address is required.',
    });
  }
  if (!isString(password)) {
    errors.push({ field: 'password', message: 'Password is required.' });
  }

  if (errors.length > 0) {
    next(createHttpError(400, 'Invalid login data', errors));
    return;
  }

  next();
};

export const validateRefresh = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { refreshToken } = req.body;
  if (!isString(refreshToken)) {
    next(
      createHttpError(400, 'Refresh token is required', [
        { field: 'refreshToken', message: 'Refresh token is required.' },
      ]),
    );
    return;
  }

  next();
};
