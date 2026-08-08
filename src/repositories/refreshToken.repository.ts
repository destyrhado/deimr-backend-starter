import { RefreshToken, type IRefreshToken } from '../models/refreshToken.js';

export class RefreshTokenRepository {
  static async create(token: Partial<IRefreshToken>) {
    return RefreshToken.create(token);
  }

  static async findByToken(token: string) {
    return RefreshToken.findOne({ token });
  }

  static async revoke(token: string) {
    return RefreshToken.findOneAndUpdate(
      { token },
      { revokedAt: new Date() },
      { new: true },
    );
  }
}
