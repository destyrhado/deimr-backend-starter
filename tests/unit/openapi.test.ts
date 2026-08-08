import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { openapi } from '../../src/docs/openapi.js';

const spec = openapi as any;

test('OpenAPI exposes only mounted API endpoints with reusable schemas', () => {
  assert.deepEqual(Object.keys(spec.paths).sort(), [
    '/',
    '/api/v1/auth/login',
    '/api/v1/auth/logout',
    '/api/v1/auth/refresh',
    '/api/v1/auth/register',
    '/api/v1/users',
    '/api/v1/users/me',
    '/api/v1/users/{id}',
    '/api/v1/users/{id}/role',
    '/health',
    '/metrics',
    '/ready',
  ]);

  for (const schema of [
    'User',
    'AuthResponse',
    'ErrorResponse',
    'PaginationResponse',
    'ReadinessResponse',
    'ValidationError',
    'RoleUpdateResponse',
    'RootResponse',
  ]) {
    assert.ok(spec.components.schemas[schema], `${schema} schema should exist`);
  }

  assert.equal(spec.components.securitySchemes.bearerAuth.type, 'http');
  assert.equal(spec.components.securitySchemes.bearerAuth.scheme, 'bearer');
  assert.equal(spec.servers[0].url, 'http://localhost:5001');
  assert.equal(
    spec.paths['/metrics'].get.responses['200'].content['text/plain'].schema
      .type,
    'string',
  );
  assert.ok(spec.paths['/ready'].get.responses['503']);
  assert.equal(
    JSON.stringify(spec).includes('deimr-backend-starter.onrender.com'),
    false,
  );
});

test('OpenAPI login examples are named by role and use non-production credentials', () => {
  const examples =
    spec.paths['/api/v1/auth/login'].post.requestBody.content[
      'application/json'
    ].examples;

  assert.deepEqual(Object.keys(examples), ['USER', 'ADMIN', 'SUPER_ADMIN']);
  assert.equal(examples.USER.value.email, 'user@example.test');
  assert.equal(examples.ADMIN.value.email, 'admin@example.test');
  assert.equal(examples.SUPER_ADMIN.value.email, 'superadmin@example.test');
  assert.equal(
    Object.values(examples).every(
      (example: any) => example.value.password === 'ExamplePassword123!',
    ),
    true,
  );
});

test('OpenAPI users list query parameters match runtime behavior', () => {
  const parameters = spec.paths['/api/v1/users'].get.parameters;
  const names = parameters.map((parameter: any) => parameter.name);

  assert.deepEqual(names, [
    'page',
    'limit',
    'search',
    'role',
    'status',
    'sort',
  ]);
  assert.equal(
    parameters.find((parameter: any) => parameter.name === 'limit').schema
      .maximum,
    100,
  );
  assert.deepEqual(
    parameters.find((parameter: any) => parameter.name === 'sort').schema.enum,
    [
      'name',
      '-name',
      'email',
      '-email',
      'role',
      '-role',
      'status',
      '-status',
      'createdAt',
      '-createdAt',
      'updatedAt',
      '-updatedAt',
    ],
  );

  const listDataProperties =
    spec.components.schemas.UserListResponse.properties.data.properties;
  assert.ok(listDataProperties.users);
  assert.ok(listDataProperties.pagination);
  assert.equal(listDataProperties.meta, undefined);
});

test('OpenAPI production server URL falls back to Render external URL', () => {
  const output = execFileSync(
    process.execPath,
    [
      '--import',
      'tsx',
      '--input-type=module',
      '--eval',
      "import { openapi } from './src/docs/openapi.ts'; console.log(JSON.stringify(openapi.servers[0]));",
    ],
    {
      cwd: process.cwd(),
      encoding: 'utf8',
      env: {
        ...process.env,
        NODE_ENV: 'production',
        APP_URL: '',
        MONGODB_URI: 'mongodb://127.0.0.1:27017/deimr_backend_test',
        JWT_ACCESS_SECRET: 'a'.repeat(32),
        JWT_REFRESH_SECRET: 'b'.repeat(32),
        CORS_ORIGIN: 'https://example.test',
        RENDER_EXTERNAL_URL: 'https://deimr-backend-starter.onrender.com',
      },
    },
  );

  assert.deepEqual(JSON.parse(output), {
    url: 'https://deimr-backend-starter.onrender.com',
    description: 'Production',
  });
});
