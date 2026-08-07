import type { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service.js';
import { sendError, sendSuccess } from '../utils/response.js';

export class UserController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await UserService.list(req.query as Record<string, string>);
      res.status(200).json(sendSuccess('Users loaded successfully', result));
    } catch (error) {
      next(error);
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await UserService.getById(req.params.id);
      res.status(200).json(sendSuccess('User loaded successfully', result));
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await UserService.update(req.params.id, req.body);
      res.status(200).json(sendSuccess('User updated successfully', result));
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await UserService.delete(req.params.id);
      res.status(200).json(sendSuccess('User deleted successfully', result));
    } catch (error) {
      next(error);
    }
  }
}
