import type { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { sendError, sendSuccess } from '../utils/response.js';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.register(email, password);
      res.status(201).json(sendSuccess('User registered successfully', result, 201));
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      res.status(200).json(sendSuccess('Login successful', result));
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        res.status(400).json(sendError('Refresh token is required', 400));
        return;
      }

      const result = await AuthService.refresh(refreshToken);
      res.status(200).json(sendSuccess('Token refreshed successfully', result));
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const result = await AuthService.logout(refreshToken);
      res.status(200).json(sendSuccess('Logout successful', result));
    } catch (error) {
      next(error);
    }
  }
}
