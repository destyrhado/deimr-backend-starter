import bcrypt from 'bcryptjs';
import mongoose, { type FilterQuery } from 'mongoose';
import { UserRepository } from '../repositories/user.repository.js';
import type { IUser } from '../models/user.js';
import { UserRole, UserStatus } from '../types/http.js';
import { createHttpError } from '../utils/httpError.js';

interface ListOptions {
  page?: unknown;
  limit?: unknown;
  search?: unknown;
  role?: unknown;
  status?: unknown;
  sort?: unknown;
}

type ProfileUpdatePayload = {
  name?: string;
  email?: string;
  password?: string;
};

type AdminUpdatePayload = ProfileUpdatePayload & {
  status?: UserStatus;
};

const MAX_PAGE_LIMIT = 100;
const SORTABLE_USER_FIELDS = [
  'name',
  'email',
  'role',
  'status',
  'createdAt',
  'updatedAt',
] as const;

const getSingleQueryValue = (value: unknown) =>
  Array.isArray(value) ? value[0] : value;

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const parsePositiveInteger = (
  value: unknown,
  field: string,
  fallback: number,
  max?: number,
) => {
  const raw = getSingleQueryValue(value);
  if (typeof raw === 'undefined') {
    return fallback;
  }

  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < 1 || (max && parsed > max)) {
    const range = max ? `between 1 and ${max}` : 'greater than or equal to 1';
    throw createHttpError(400, 'Invalid pagination parameters', [
      { field, message: `${field} must be an integer ${range}.` },
    ]);
  }

  return parsed;
};

const parseEnumFilter = <T extends string>(
  value: unknown,
  field: string,
  allowed: readonly T[],
) => {
  const raw = getSingleQueryValue(value);
  if (typeof raw === 'undefined' || String(raw).trim() === '') {
    return undefined;
  }

  const normalized = String(raw).toUpperCase();
  if (!allowed.includes(normalized as T)) {
    throw createHttpError(400, 'Invalid filter parameters', [
      { field, message: `${field} must be one of ${allowed.join(', ')}.` },
    ]);
  }

  return normalized as T;
};

const parseSort = (value: unknown) => {
  const raw =
    String(getSingleQueryValue(value) ?? '-createdAt').trim() || '-createdAt';
  const direction = raw.startsWith('-') ? -1 : 1;
  const field = raw.replace(/^-/, '');

  if (
    !SORTABLE_USER_FIELDS.includes(
      field as (typeof SORTABLE_USER_FIELDS)[number],
    )
  ) {
    throw createHttpError(400, 'Invalid sort parameter', [
      {
        field: 'sort',
        message: `Sort must be one of ${SORTABLE_USER_FIELDS.join(', ')} with an optional leading "-".`,
      },
    ]);
  }

  return { [field]: direction as 1 | -1 };
};

const sanitizeUser = (user: IUser) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const validateUserId = (id: string) => {
  if (!mongoose.isValidObjectId(id)) {
    throw createHttpError(400, 'Invalid user id', [
      { field: 'id', message: 'User id must be a valid MongoDB ObjectId.' },
    ]);
  }
};

export class UserService {
  static async list(options: ListOptions) {
    const page = parsePositiveInteger(options.page, 'page', 1);
    const limit = parsePositiveInteger(
      options.limit,
      'limit',
      20,
      MAX_PAGE_LIMIT,
    );
    const filter: FilterQuery<IUser> = {};
    const search = String(getSingleQueryValue(options.search) ?? '').trim();
    const role = parseEnumFilter(options.role, 'role', Object.values(UserRole));
    const status = parseEnumFilter(
      options.status,
      'status',
      Object.values(UserStatus),
    );
    const sort = parseSort(options.sort);

    if (search) {
      const pattern = new RegExp(escapeRegex(search), 'i');
      filter.$or = [{ name: pattern }, { email: pattern }];
    }
    if (role) {
      filter.role = role;
    }
    if (status) {
      filter.status = status;
    }

    const total = await UserRepository.count(filter);
    const users = await UserRepository.findAll(filter, {
      skip: (page - 1) * limit,
      limit,
      sort,
    });

    const pages = Math.ceil(total / limit);

    return {
      users: users.map(sanitizeUser),
      pagination: {
        page,
        limit,
        total,
        pages,
        hasNextPage: page < pages,
        hasPreviousPage: page > 1,
      },
    };
  }

  static async getById(id: string) {
    validateUserId(id);
    const user = await UserRepository.findById(id);
    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    return sanitizeUser(user);
  }

  static async getProfile(id: string) {
    return this.getById(id);
  }

  static async updateProfile(id: string, update: ProfileUpdatePayload) {
    validateUserId(id);
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
      throw createHttpError(404, 'User not found');
    }

    return sanitizeUser(user);
  }

  static async updateRole(id: string, role: UserRole, currentUserId: string) {
    validateUserId(id);
    if (id === currentUserId) {
      throw createHttpError(403, 'Cannot change your own role');
    }

    const user = await UserRepository.findById(id);
    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    if (user.role === UserRole.SUPER_ADMIN && role !== UserRole.SUPER_ADMIN) {
      throw createHttpError(
        403,
        'Cannot remove SUPER_ADMIN role from a SUPER_ADMIN',
      );
    }

    const updated = await UserRepository.updateById(id, { role });

    return sanitizeUser(updated ?? user);
  }

  static async update(id: string, update: AdminUpdatePayload) {
    validateUserId(id);
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
      throw createHttpError(404, 'User not found');
    }

    return sanitizeUser(user);
  }

  static async delete(id: string, currentUserId: string) {
    validateUserId(id);
    if (id === currentUserId) {
      throw createHttpError(403, 'Cannot delete your own account');
    }

    const user = await UserRepository.deleteById(id);
    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    return {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };
  }
}
