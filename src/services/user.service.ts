import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/user.repository.js';
import type { IUser } from '../models/user.js';
import { UserRole, UserStatus } from '../types/http.js';

interface ListOptions {
  page?: string;
  limit?: string;
  role?: string;
  status?: string;
  sort?: string;
}

type ProfileUpdatePayload = {
  name?: string;
  email?: string;
  password?: string;
};

type AdminUpdatePayload = ProfileUpdatePayload & {
  status?: UserStatus;
};

export class UserService {
  static async list(options: ListOptions) {
    const page = Math.max(Number(options.page ?? '1'), 1);
    const limit = Math.max(Number(options.limit ?? '20'), 1);
    const filter: Record<string, unknown> = {};

    if (options.role) {
      filter.role = options.role.toUpperCase();
    }
    if (options.status) {
      filter.status = options.status.toUpperCase();
    }

    const total = await UserRepository.count(filter);
    const users = await UserRepository.findAll(filter, {
      skip: (page - 1) * limit,
      limit,
      sort: options.sort ?? '-createdAt'
    });

    const sanitized = users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
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
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  static async getProfile(id: string) {
    return this.getById(id);
  }

  static async updateProfile(id: string, update: ProfileUpdatePayload) {
    const payload: Partial<IUser> = {};

    if (update.name) {
      payload.name = update.name;
    }
    if (update.email) {
      payload.email = update.email;
    }
    if (update.password) {
      payload.passwordHash = await bcrypt.hash(update.password, 10);
    }

    const user = await UserRepository.updateById(id, payload);
    if (!user) {
      throw Object.assign(new Error('User not found'), { statusCode: 404 });
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  static async updateRole(id: string, role: UserRole, currentUserId: string) {
    if (id === currentUserId) {
      throw Object.assign(new Error('Cannot change your own role'), { statusCode: 403 });
    }

    const user = await UserRepository.findById(id);
    if (!user) {
      throw Object.assign(new Error('User not found'), { statusCode: 404 });
    }

    if (user.role === UserRole.SUPER_ADMIN && role !== UserRole.SUPER_ADMIN) {
      throw Object.assign(new Error('Cannot remove SUPER_ADMIN role from a SUPER_ADMIN'), { statusCode: 403 });
    }

    const updated = await UserRepository.updateById(id, { role });

    return {
      id: updated?._id.toString() ?? user._id.toString(),
      name: updated?.name ?? user.name,
      email: updated?.email ?? user.email,
      role: updated?.role ?? user.role,
      status: updated?.status ?? user.status,
      createdAt: updated?.createdAt ?? user.createdAt,
      updatedAt: updated?.updatedAt ?? user.updatedAt
    };
  }

  static async update(id: string, update: AdminUpdatePayload) {
    const payload: Partial<IUser> = {};
    if (update.name) {
      payload.name = update.name;
    }
    if (update.email) {
      payload.email = update.email;
    }
    if (update.password) {
      payload.passwordHash = await bcrypt.hash(update.password, 10);
    }
    if (update.status) {
      payload.status = update.status;
    }

    const user = await UserRepository.updateById(id, payload);
    if (!user) {
      throw Object.assign(new Error('User not found'), { statusCode: 404 });
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  static async delete(id: string, currentUserId: string) {
    if (id === currentUserId) {
      throw Object.assign(new Error('Cannot delete your own account'), { statusCode: 403 });
    }

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
