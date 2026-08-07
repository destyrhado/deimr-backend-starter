import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
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
      updatedAt: user.updatedAt
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

    const payload = { sub: user._id.toString(), email: user.email, role: user.role };
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);
    await RefreshTokenRepository.create({
      token: refreshToken,
      userId: user._id.toString(),
      expiresAt: getTokenExpiry(refreshToken)
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    };
  }

  static async refresh(token: string) {
    const storedToken = await RefreshTokenRepository.findByToken(token);
    if (!storedToken || storedToken.revokedAt || storedToken.expiresAt <= new Date()) {
      throw createHttpError(401, 'Refresh token is invalid or expired');
    }

    let payload: AuthPayload;
    try {
      payload = jwt.verify(token, env.jwtRefreshSecret) as AuthPayload;
    } catch {
      throw createHttpError(401, 'Refresh token is invalid or expired');
    }

    const user = await User.findById(payload.sub);
    if (!user) {
      throw createHttpError(401, 'Refresh token is invalid or expired');
    }

    const accessToken = this.generateAccessToken({ sub: payload.sub, email: payload.email, role: payload.role });
    const refreshToken = this.generateRefreshToken({ sub: payload.sub, email: payload.email, role: payload.role });

    await RefreshTokenRepository.revoke(token);
    await RefreshTokenRepository.create({
      token: refreshToken,
      userId: payload.sub,
      expiresAt: getTokenExpiry(refreshToken)
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    };
  }

  static async logout(token: string) {
    const storedToken = await RefreshTokenRepository.findByToken(token);
    if (!storedToken || storedToken.revokedAt || storedToken.expiresAt <= new Date()) {
      throw createHttpError(401, 'Refresh token is invalid or expired');
    }

    await RefreshTokenRepository.revoke(token);
    return { revoked: true };
  }

  static generateAccessToken(payload: AuthPayload) {
    return jwt.sign(payload, env.jwtAccessSecret, { expiresIn: env.jwtAccessExpiresIn });
  }

  static generateRefreshToken(payload: AuthPayload) {
    return jwt.sign(payload, env.jwtRefreshSecret, { expiresIn: env.jwtRefreshExpiresIn });
  }
}
