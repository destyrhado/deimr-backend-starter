import type { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service.js';
import { sendSuccess } from '../utils/response.js';

export class UserController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await UserService.list(
        req.query as Record<string, string>,
      );
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

  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await UserService.getById(req.user?.id ?? '');
      res.status(200).json(sendSuccess('Profile loaded successfully', result));
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await UserService.updateProfile(
        req.user?.id ?? '',
        req.body,
      );
      res.status(200).json(sendSuccess('Profile updated successfully', result));
    } catch (error) {
      next(error);
    }
  }

  static async updateRole(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await UserService.updateRole(
        req.params.id,
        req.body.role,
        req.user?.id ?? '',
      );
      res.status(200).json(sendSuccess('Role updated successfully', result));
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
      const result = await UserService.delete(
        req.params.id,
        req.user?.id ?? '',
      );
      res.status(200).json(sendSuccess('User deleted successfully', result));
    } catch (error) {
      next(error);
    }
  }
}
