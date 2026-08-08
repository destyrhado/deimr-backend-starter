import dotenv from 'dotenv';

dotenv.config();

const parsePositiveInteger = (name: string, fallback: number) => {
  const raw = process.env[name];
  if (!raw) {
    return fallback;
  }

  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new Error(`${name} must be a positive integer.`);
  }

  return parsed;
};

const renderExternalUrl =
  process.env.RENDER_EXTERNAL_URL ||
  (process.env.RENDER_EXTERNAL_HOSTNAME
    ? `https://${process.env.RENDER_EXTERNAL_HOSTNAME}`
    : '');

const nodeEnv = process.env.NODE_ENV ?? 'development';
const isProduction = nodeEnv === 'production';
const appUrl = process.env.APP_URL || renderExternalUrl;
const jwtAccessSecret = process.env.JWT_ACCESS_SECRET ?? 'dev-access-secret';
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET ?? 'dev-refresh-secret';
const mongoUri = process.env.MONGODB_URI ?? '';
const rawCorsOrigin = process.env.CORS_ORIGIN;
const corsOrigin = rawCorsOrigin ?? 'http://localhost:3000';

const isUnsafeProductionSecret = (value: string) =>
  [
    'dev-access-secret',
    'dev-refresh-secret',
    'change_me_access',
    'change_me_refresh',
  ].includes(value) || value.length < 32;

const productionConfigErrors = [
  !mongoUri ? 'MONGODB_URI is required in production.' : '',
  !appUrl
    ? 'APP_URL or Render external URL is required in production for Swagger server metadata.'
    : '',
  isUnsafeProductionSecret(jwtAccessSecret)
    ? 'JWT_ACCESS_SECRET must be a strong production value of at least 32 characters.'
    : '',
  isUnsafeProductionSecret(jwtRefreshSecret)
    ? 'JWT_REFRESH_SECRET must be a strong production value of at least 32 characters.'
    : '',
  !rawCorsOrigin ? 'CORS_ORIGIN is required in production.' : '',
].filter(Boolean);

if (isProduction && productionConfigErrors.length > 0) {
  throw new Error(
    `Invalid production environment configuration:\n- ${productionConfigErrors.join('\n- ')}`,
  );
}

export const env = {
  port: parsePositiveInteger('PORT', 5001),
  nodeEnv,
  isProduction,
  mongoUri,
  jwtAccessSecret,
  jwtRefreshSecret,
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  appUrl,
  corsOrigin,
  rateLimitWindowMs: parsePositiveInteger(
    'RATE_LIMIT_WINDOW_MS',
    15 * 60 * 1000,
  ),
  rateLimitMax: parsePositiveInteger('RATE_LIMIT_MAX', 100),
};
