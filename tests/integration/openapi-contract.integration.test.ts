import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import app from '../../src/app.js';

test('documented endpoints are mounted and return documented error/health shapes without credentials', async () => {
  const server = createServer(app);
  const address = await new Promise<{ port: number }>((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      if (addr && typeof addr !== 'string') {
        resolve({ port: addr.port });
      }
    });
  });

  const baseUrl = `http://127.0.0.1:${address.port}`;
  const root = await fetch(`${baseUrl}/`);
  const rootBody = await root.json();
  assert.equal(root.status, 200);
  assert.deepEqual(rootBody, {
    success: true,
    message: 'Deimr Backend Starter API is running.',
  });

  const health = await fetch(`${baseUrl}/health`);
  const healthBody = await health.json();
  assert.equal(health.status, 200);
  assert.deepEqual(Object.keys(healthBody).sort(), [
    'environment',
    'service',
    'status',
    'uptime',
    'version',
  ]);

  const metrics = await fetch(`${baseUrl}/metrics`);
  const metricsBody = await metrics.text();
  assert.equal(metrics.status, 200);
  assert.equal(
    metrics.headers.get('content-type')?.includes('text/plain'),
    true,
  );
  assert.equal(metricsBody.includes('deimr_http_requests_total'), true);
  assert.equal(metricsBody.includes('deimr_http_responses_total'), true);

  const publicInvalidRequests = [
    ['/api/v1/auth/register', {}],
    ['/api/v1/auth/login', {}],
    ['/api/v1/auth/refresh', {}],
    ['/api/v1/auth/logout', {}],
  ] as const;

  for (const [path, body] of publicInvalidRequests) {
    const response = await fetch(`${baseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const responseBody = await response.json();
    assert.equal(response.status, 400, path);
    assert.equal(responseBody.success, false);
    assert.equal(responseBody.statusCode, 400);
    assert.equal(typeof responseBody.requestId, 'string');
    assert.equal(Array.isArray(responseBody.errors), true);
  }

  const protectedRequests = [
    ['GET', '/api/v1/users/me'],
    ['PATCH', '/api/v1/users/me'],
    ['GET', '/api/v1/users'],
    ['GET', '/api/v1/users/66b7f1a2c0a4f7b5f0d9a111'],
    ['PATCH', '/api/v1/users/66b7f1a2c0a4f7b5f0d9a111'],
    ['DELETE', '/api/v1/users/66b7f1a2c0a4f7b5f0d9a111'],
    ['PATCH', '/api/v1/users/66b7f1a2c0a4f7b5f0d9a111/role'],
  ] as const;

  for (const [method, path] of protectedRequests) {
    const response = await fetch(`${baseUrl}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: method === 'PATCH' ? JSON.stringify({}) : undefined,
    });
    const responseBody = await response.json();
    assert.equal(response.status, 401, `${method} ${path}`);
    assert.equal(responseBody.success, false);
    assert.equal(responseBody.message, 'Unauthorized');
    assert.equal(responseBody.statusCode, 401);
    assert.equal(typeof responseBody.requestId, 'string');
  }

  server.close();
});
