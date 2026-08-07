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

  static async findAll(filter: Record<string, unknown>, options: { skip: number; limit: number; sort?: string }) {
    return User.find(filter).sort(options.sort ?? '').skip(options.skip).limit(options.limit);
  }

  static async count(filter: Record<string, unknown>) {
    return User.countDocuments(filter);
  }

  static async updateById(id: string, update: Partial<IUser>) {
    return User.findByIdAndUpdate(id, update, { new: true });
  }

  static async deleteById(id: string) {
    return User.findByIdAndDelete(id);
  }
}
