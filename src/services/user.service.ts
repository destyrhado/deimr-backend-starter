import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/user.repository.js';
import type { IUser } from '../models/user.js';

interface ListOptions {
  page?: string;
  limit?: string;
  role?: string;
  sort?: string;
}

export class UserService {
  static async list(options: ListOptions) {
    const page = Math.max(Number(options.page ?? '1'), 1);
    const limit = Math.max(Number(options.limit ?? '20'), 1);
    const filter: Record<string, unknown> = {};

    if (options.role) {
      filter.role = options.role.toUpperCase();
    }

    const total = await UserRepository.count(filter);
    const users = await UserRepository.findAll(filter, {
      skip: (page - 1) * limit,
      limit,
      sort: options.sort ?? '-createdAt'
    });

    const sanitized = users.map((user) => ({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));

    return {
      data: sanitized,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  static async getById(id: string) {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw Object.assign(new Error('User not found'), { statusCode: 404 });
    }

    return {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  static async update(id: string, update: Partial<IUser>) {
    const payload: Partial<IUser> = {};
    if (update.email) {
      payload.email = update.email;
    }
    if (update.role) {
      payload.role = update.role;
    }
    if (update.password) {
      payload.password = await bcrypt.hash(update.password, 10);
    }

    const user = await UserRepository.updateById(id, payload);
    if (!user) {
      throw Object.assign(new Error('User not found'), { statusCode: 404 });
    }

    return {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  static async delete(id: string) {
    const user = await UserRepository.deleteById(id);
    if (!user) {
      throw Object.assign(new Error('User not found'), { statusCode: 404 });
    }

    return {
      id: user._id.toString(),
      email: user.email,
      role: user.role
    };
  }
}
