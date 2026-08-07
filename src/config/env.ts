import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT ?? 5001),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  mongoUri: process.env.MONGODB_URI ?? '',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET ?? 'dev-access-secret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET ?? 'dev-refresh-secret',
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  appUrl: process.env.APP_URL ?? '',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 15 * 60 * 1000),
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX ?? 100)
};
