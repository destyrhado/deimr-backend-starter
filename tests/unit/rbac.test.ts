import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { createServer } from 'node:http';
import { authenticate, authorize } from '../../src/middleware/auth.js';
import { errorHandler } from '../../src/middleware/errorHandler.js';
import { requestContext } from '../../src/middleware/requestContext.js';
import { AuthService } from '../../src/services/auth.service.js';
import { UserRole } from '../../src/types/http.js';

const tokenFor = (role: UserRole) =>
  AuthService.generateAccessToken({
    sub:
      role === UserRole.USER
        ? '66b7f1a2c0a4f7b5f0d9a111'
        : role === UserRole.ADMIN
          ? '66b7f1a2c0a4f7b5f0d9a222'
          : '66b7f1a2c0a4f7b5f0d9a333',
    email: `${role.toLowerCase()}@example.test`,
    role,
  });

test('RBAC enforces USER, ADMIN, and SUPER_ADMIN permissions', async () => {
  const app = express();
  app.use(requestContext);
  app.get(
    '/profile',
    authenticate,
    authorize('USER', 'ADMIN', 'SUPER_ADMIN'),
    (req, res) => {
      res.json({ ok: true, role: req.user?.role });
    },
  );
  app.get(
    '/admin',
    authenticate,
    authorize('ADMIN', 'SUPER_ADMIN'),
    (req, res) => {
      res.json({ ok: true, role: req.user?.role });
    },
  );
  app.get(
    '/super-admin',
    authenticate,
    authorize('SUPER_ADMIN'),
    (req, res) => {
      res.json({ ok: true, role: req.user?.role });
    },
  );
  app.use(errorHandler);

  const server = createServer(app);
  const address = await new Promise<{ port: number }>((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      if (addr && typeof addr !== 'string') {
        resolve({ port: addr.port });
      }
    });
  });

  const request = (path: string, token?: string) =>
    fetch(`http://127.0.0.1:${address.port}${path}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

  const userToken = tokenFor(UserRole.USER);
  const adminToken = tokenFor(UserRole.ADMIN);
  const superAdminToken = tokenFor(UserRole.SUPER_ADMIN);

  const missingAuth = await request('/admin');
  const missingAuthBody = await missingAuth.json();
  assert.equal(missingAuth.status, 401);
  assert.equal(missingAuthBody.success, false);
  assert.equal(missingAuthBody.message, 'Unauthorized');
  assert.equal(typeof missingAuthBody.requestId, 'string');

  const userProfile = await request('/profile', userToken);
  assert.equal(userProfile.status, 200);
  assert.equal((await userProfile.json()).role, UserRole.USER);

  const userAdmin = await request('/admin', userToken);
  const userAdminBody = await userAdmin.json();
  assert.equal(userAdmin.status, 403);
  assert.equal(userAdminBody.success, false);
  assert.equal(
    userAdminBody.message,
    'You do not have permission to access this resource.',
  );

  const adminList = await request('/admin', adminToken);
  assert.equal(adminList.status, 200);
  assert.equal((await adminList.json()).role, UserRole.ADMIN);

  const adminSuper = await request('/super-admin', adminToken);
  assert.equal(adminSuper.status, 403);

  const superAdminList = await request('/admin', superAdminToken);
  assert.equal(superAdminList.status, 200);
  assert.equal((await superAdminList.json()).role, UserRole.SUPER_ADMIN);

  const superAdminOnly = await request('/super-admin', superAdminToken);
  assert.equal(superAdminOnly.status, 200);
  assert.equal((await superAdminOnly.json()).role, UserRole.SUPER_ADMIN);

  server.close();
});
