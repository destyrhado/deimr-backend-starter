import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const importEnv = (overrides: NodeJS.ProcessEnv) =>
  spawnSync(
    process.execPath,
    [
      '--import',
      'tsx',
      '--input-type=module',
      '--eval',
      "import './src/config/env.ts';",
    ],
    {
      cwd: process.cwd(),
      encoding: 'utf8',
      env: {
        ...process.env,
        ...overrides,
      },
    },
  );

test('production config rejects missing and unsafe runtime values', () => {
  const result = importEnv({
    NODE_ENV: 'production',
    APP_URL: '',
    RENDER_EXTERNAL_URL: '',
    RENDER_EXTERNAL_HOSTNAME: '',
    MONGODB_URI: '',
    JWT_ACCESS_SECRET: 'dev-access-secret',
    JWT_REFRESH_SECRET: 'dev-refresh-secret',
    CORS_ORIGIN: '',
  });

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Invalid production environment configuration/);
  assert.match(result.stderr, /MONGODB_URI is required in production/);
  assert.match(
    result.stderr,
    /JWT_ACCESS_SECRET must be a strong production value/,
  );
  assert.match(result.stderr, /CORS_ORIGIN is required in production/);
});

test('production config accepts explicit production-safe values', () => {
  const result = importEnv({
    NODE_ENV: 'production',
    APP_URL: '',
    RENDER_EXTERNAL_URL: 'https://deimr-backend-starter.onrender.com',
    MONGODB_URI: 'mongodb://127.0.0.1:27017/deimr_backend_prod',
    JWT_ACCESS_SECRET: 'a'.repeat(32),
    JWT_REFRESH_SECRET: 'b'.repeat(32),
    CORS_ORIGIN: 'https://example.test',
  });

  assert.equal(result.status, 0);
});

test('production config accepts MONGO_URI as a MongoDB URI compatibility alias', () => {
  const result = importEnv({
    NODE_ENV: 'production',
    APP_URL: '',
    RENDER_EXTERNAL_URL: 'https://deimr-backend-starter.onrender.com',
    MONGODB_URI: '',
    MONGO_URI: 'mongodb://127.0.0.1:27017/deimr_backend_prod',
    JWT_ACCESS_SECRET: 'a'.repeat(32),
    JWT_REFRESH_SECRET: 'b'.repeat(32),
    CORS_ORIGIN: 'https://example.test',
  });

  assert.equal(result.status, 0);
});
