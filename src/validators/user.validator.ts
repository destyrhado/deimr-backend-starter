import type { Request, Response, NextFunction } from 'express';

const isEmail = (value: unknown) => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isString = (value: unknown) => typeof value === 'string' && value.trim().length > 0;

export const validateUserUpdate = (req: Request, res: Response, next: NextFunction) => {
  const { email, password, role } = req.body;

  if (email && !isEmail(email)) {
    res.status(400).json({ success: false, message: 'Invalid email address', statusCode: 400 });
    return;
  }

  if (password && (!isString(password) || password.length < 8)) {
    res.status(400).json({ success: false, message: 'Password must be at least 8 characters', statusCode: 400 });
    return;
  }

  if (role && !['USER', 'ADMIN', 'SUPER_ADMIN'].includes(String(role).toUpperCase())) {
    res.status(400).json({ success: false, message: 'Invalid role', statusCode: 400 });
    return;
  }

  next();
};
