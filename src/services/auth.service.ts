import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/user.js';
import type { AuthPayload } from '../types/http.js';

export class AuthService {
  static async register(email: string, password: string) {
    const existing = await User.findOne({ email });
    if (existing) {
      throw Object.assign(new Error('User already exists'), { statusCode: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: passwordHash, role: 'USER' });

    return {
      id: user._id.toString(),
      email: user.email,
      role: user.role
    };
  }

  static async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
    }

    const accessToken = this.generateAccessToken({ sub: user._id.toString(), role: user.role });
    const refreshToken = this.generateRefreshToken({ sub: user._id.toString(), role: user.role });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role
      }
    };
  }

  static async refresh(token: string) {
    const payload = jwt.verify(token, env.jwtRefreshSecret) as AuthPayload;
    const accessToken = this.generateAccessToken({ sub: payload.sub, role: payload.role });
    return { accessToken };
  }

  static generateAccessToken(payload: AuthPayload) {
    return jwt.sign(payload, env.jwtAccessSecret, { expiresIn: env.jwtAccessExpiresIn });
  }

  static generateRefreshToken(payload: AuthPayload) {
    return jwt.sign(payload, env.jwtRefreshSecret, { expiresIn: env.jwtRefreshExpiresIn });
  }
}
