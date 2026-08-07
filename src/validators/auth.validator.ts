import type { Request, Response, NextFunction } from 'express';

const isEmail = (value: unknown) => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isString = (value: unknown) => typeof value === 'string' && value.trim().length > 0;

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  if (!isString(name) || !isEmail(email) || !isString(password) || password.length < 8) {
    res.status(400).json({ success: false, message: 'Invalid registration data', statusCode: 400 });
    return;
  }
  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!isEmail(email) || !isString(password)) {
    res.status(400).json({ success: false, message: 'Invalid login data', statusCode: 400 });
    return;
  }
  next();
};

export const validateRefresh = (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.body;
  if (!isString(refreshToken)) {
    res.status(400).json({ success: false, message: 'Refresh token is required', statusCode: 400 });
    return;
  }
  next();
};
