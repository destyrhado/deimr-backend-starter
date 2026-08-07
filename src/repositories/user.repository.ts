import type { FilterQuery } from 'mongoose';
import { User, IUser } from '../models/user.js';

export class UserRepository {
  static async create(user: Partial<IUser>) {
    return User.create(user);
  }

  static async findByEmail(email: string) {
    return User.findOne({ email });
  }

  static async findById(id: string) {
    return User.findById(id);
  }

  static async findAll(filter: FilterQuery<IUser>, options: { skip: number; limit: number; sort?: Record<string, 1 | -1> }) {
    return User.find(filter).sort(options.sort ?? '').skip(options.skip).limit(options.limit);
  }

  static async count(filter: FilterQuery<IUser>) {
    return User.countDocuments(filter);
  }

  static async updateById(id: string, update: Partial<IUser>) {
    return User.findByIdAndUpdate(id, update, { new: true });
  }

  static async deleteById(id: string) {
    return User.findByIdAndDelete(id);
  }
}
