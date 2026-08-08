import { createHmac } from 'node:crypto';
import { env } from '../config/env.js';
import { RefreshToken } from '../models/refreshToken.js';

type CreateRefreshTokenInput = {
  token: string;
  userId: string;
  tokenFamilyId: string;
  expiresAt: Date;
};

export const hashRefreshToken = (token: string) =>
  createHmac('sha256', env.jwtRefreshSecret).update(token).digest('hex');

export class RefreshTokenRepository {
  static async create(input: CreateRefreshTokenInput) {
    return RefreshToken.create({
      tokenHash: hashRefreshToken(input.token),
      userId: input.userId,
      tokenFamilyId: input.tokenFamilyId,
      expiresAt: input.expiresAt,
    });
  }

  static async findByToken(token: string) {
    return RefreshToken.findOne({ tokenHash: hashRefreshToken(token) });
  }

  static async revoke(token: string, replacementToken?: string) {
    const update: {
      revokedAt: Date;
      replacedByTokenHash?: string;
    } = { revokedAt: new Date() };

    if (replacementToken) {
      update.replacedByTokenHash = hashRefreshToken(replacementToken);
    }

    return RefreshToken.findOneAndUpdate(
      { tokenHash: hashRefreshToken(token) },
      update,
      { new: true },
    );
  }

  static async markFamilyReuseDetected(tokenFamilyId: string) {
    const now = new Date();

    return RefreshToken.updateMany(
      { tokenFamilyId },
      { revokedAt: now, reuseDetectedAt: now },
    );
  }
}
