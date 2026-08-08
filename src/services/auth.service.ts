import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/user.js';
import { RefreshTokenRepository } from '../repositories/refreshToken.repository.js';
import type { AuthPayload } from '../types/http.js';
import { createHttpError } from '../utils/httpError.js';

const getTokenExpiry = (token: string): Date => {
  const decoded = jwt.decode(token) as { exp?: number } | null;
  if (!decoded?.exp) {
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }
  return new Date(decoded.exp * 1000);
};

type RefreshPayload = AuthPayload & {
  tokenFamilyId: string;
  jti: string;
};

const assertRefreshPayload = (payload: AuthPayload): RefreshPayload => {
  const refreshPayload = payload as Partial<RefreshPayload>;

  if (!refreshPayload.tokenFamilyId || !refreshPayload.jti) {
    throw createHttpError(401, 'Refresh token is invalid or expired');
  }

  return refreshPayload as RefreshPayload;
};

export class AuthService {
  static async register(name: string, email: string, password: string) {
    const existing = await User.findOne({ email });
    if (existing) {
      throw createHttpError(409, 'User already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash, role: 'USER' });

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw createHttpError(401, 'Invalid credentials');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw createHttpError(401, 'Invalid credentials');
    }

    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };
    const accessToken = this.generateAccessToken(payload);
    const refresh = this.generateRefreshToken(payload);
    await RefreshTokenRepository.create({
      token: refresh.token,
      userId: user._id.toString(),
      tokenFamilyId: refresh.tokenFamilyId,
      expiresAt: getTokenExpiry(refresh.token),
    });

    return {
      accessToken,
      refreshToken: refresh.token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  static async refresh(token: string) {
    const storedToken = await RefreshTokenRepository.findByToken(token);
    if (!storedToken || storedToken.expiresAt <= new Date()) {
      throw createHttpError(401, 'Refresh token is invalid or expired');
    }
    if (storedToken.revokedAt) {
      await RefreshTokenRepository.markFamilyReuseDetected(
        storedToken.tokenFamilyId,
      );
      throw createHttpError(401, 'Refresh token reuse detected');
    }

    let payload: RefreshPayload;
    try {
      payload = assertRefreshPayload(
        jwt.verify(token, env.jwtRefreshSecret) as AuthPayload,
      );
    } catch {
      throw createHttpError(401, 'Refresh token is invalid or expired');
    }
    if (
      storedToken.userId !== payload.sub ||
      storedToken.tokenFamilyId !== payload.tokenFamilyId
    ) {
      throw createHttpError(401, 'Refresh token is invalid or expired');
    }

    const user = await User.findById(payload.sub);
    if (!user) {
      throw createHttpError(401, 'Refresh token is invalid or expired');
    }

    const accessToken = this.generateAccessToken({
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
    });
    const refresh = this.generateRefreshToken(
      {
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
      },
      payload.tokenFamilyId,
    );

    await RefreshTokenRepository.revoke(token, refresh.token);
    await RefreshTokenRepository.create({
      token: refresh.token,
      userId: payload.sub,
      tokenFamilyId: refresh.tokenFamilyId,
      expiresAt: getTokenExpiry(refresh.token),
    });

    return {
      accessToken,
      refreshToken: refresh.token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  static async logout(token: string) {
    const storedToken = await RefreshTokenRepository.findByToken(token);
    if (!storedToken || storedToken.expiresAt <= new Date()) {
      throw createHttpError(401, 'Refresh token is invalid or expired');
    }
    if (storedToken.revokedAt) {
      await RefreshTokenRepository.markFamilyReuseDetected(
        storedToken.tokenFamilyId,
      );
      throw createHttpError(401, 'Refresh token reuse detected');
    }

    await RefreshTokenRepository.revoke(token);
    return { revoked: true };
  }

  static generateAccessToken(payload: AuthPayload) {
    return jwt.sign(payload, env.jwtAccessSecret, {
      expiresIn: env.jwtAccessExpiresIn as SignOptions['expiresIn'],
    });
  }

  static generateRefreshToken(
    payload: AuthPayload,
    tokenFamilyId: string = randomUUID(),
  ) {
    const token = jwt.sign(
      { ...payload, tokenFamilyId, jti: randomUUID() },
      env.jwtRefreshSecret,
      {
        expiresIn: env.jwtRefreshExpiresIn as SignOptions['expiresIn'],
      },
    );

    return {
      token,
      tokenFamilyId,
    };
  }
}
