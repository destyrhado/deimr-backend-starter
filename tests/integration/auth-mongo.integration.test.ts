import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import mongoose from 'mongoose';
import app from '../../src/app.js';
import { RefreshToken } from '../../src/models/refreshToken.js';

const mongoTestUri = process.env.MONGODB_TEST_URI;

const listen = async () => {
  const server = createServer(app);
  const address = await new Promise<{ port: number }>((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      if (addr && typeof addr !== 'string') {
        resolve({ port: addr.port });
      }
    });
  });

  return {
    server,
    baseUrl: `http://127.0.0.1:${address.port}`,
  };
};

const postJson = (baseUrl: string, path: string, body: unknown) =>
  fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

test(
  'auth flow persists users and refresh-token families in MongoDB',
  {
    skip: mongoTestUri
      ? false
      : 'Set MONGODB_TEST_URI to run MongoDB auth integration tests.',
  },
  async () => {
    assert.ok(mongoTestUri);
    assert.match(
      mongoTestUri,
      /test/i,
      'MONGODB_TEST_URI must point at a disposable test database.',
    );

    await mongoose.connect(mongoTestUri);
    await mongoose.connection.dropDatabase();
    const { server, baseUrl } = await listen();

    try {
      const credentials = {
        name: 'Mongo Auth User',
        email: 'mongo-auth@example.test',
        password: 'ExamplePassword123!',
      };

      const register = await postJson(
        baseUrl,
        '/api/v1/auth/register',
        credentials,
      );
      const registerBody = await register.json();

      assert.equal(register.status, 201);
      assert.equal(registerBody.success, true);
      assert.equal(registerBody.data.email, credentials.email);
      assert.equal(registerBody.data.role, 'USER');

      const duplicateRegister = await postJson(
        baseUrl,
        '/api/v1/auth/register',
        credentials,
      );
      const duplicateRegisterBody = await duplicateRegister.json();

      assert.equal(duplicateRegister.status, 409);
      assert.equal(duplicateRegisterBody.message, 'User already exists');

      const login = await postJson(baseUrl, '/api/v1/auth/login', {
        email: credentials.email,
        password: credentials.password,
      });
      const loginBody = await login.json();

      assert.equal(login.status, 200);
      assert.equal(typeof loginBody.data.accessToken, 'string');
      assert.equal(typeof loginBody.data.refreshToken, 'string');

      const storedAfterLogin = await RefreshToken.find();
      assert.equal(storedAfterLogin.length, 1);
      assert.equal(storedAfterLogin[0].tokenHash.includes('.'), false);
      assert.equal(storedAfterLogin[0].tokenFamilyId.length > 0, true);
      assert.equal((storedAfterLogin[0] as any).token, undefined);

      const profile = await fetch(`${baseUrl}/api/v1/users/me`, {
        headers: { Authorization: `Bearer ${loginBody.data.accessToken}` },
      });
      const profileBody = await profile.json();

      assert.equal(profile.status, 200);
      assert.equal(profileBody.data.email, credentials.email);

      const refresh = await postJson(baseUrl, '/api/v1/auth/refresh', {
        refreshToken: loginBody.data.refreshToken,
      });
      const refreshBody = await refresh.json();

      assert.equal(refresh.status, 200);
      assert.equal(typeof refreshBody.data.accessToken, 'string');
      assert.equal(typeof refreshBody.data.refreshToken, 'string');
      assert.notEqual(
        refreshBody.data.refreshToken,
        loginBody.data.refreshToken,
      );

      const storedAfterRefresh = await RefreshToken.find().sort({
        createdAt: 1,
      });
      assert.equal(storedAfterRefresh.length, 2);
      assert.ok(storedAfterRefresh[0].revokedAt);
      assert.equal(
        storedAfterRefresh[0].tokenFamilyId,
        storedAfterRefresh[1].tokenFamilyId,
      );

      const reusedOldToken = await postJson(baseUrl, '/api/v1/auth/refresh', {
        refreshToken: loginBody.data.refreshToken,
      });
      const reusedOldTokenBody = await reusedOldToken.json();

      assert.equal(reusedOldToken.status, 401);
      assert.equal(reusedOldTokenBody.message, 'Refresh token reuse detected');

      const familyAfterReuse = await RefreshToken.find();
      assert.equal(
        familyAfterReuse.every(
          (token) => token.revokedAt && token.reuseDetectedAt,
        ),
        true,
      );

      const revokedFamilyToken = await postJson(
        baseUrl,
        '/api/v1/auth/refresh',
        {
          refreshToken: refreshBody.data.refreshToken,
        },
      );
      const revokedFamilyTokenBody = await revokedFamilyToken.json();

      assert.equal(revokedFamilyToken.status, 401);
      assert.equal(
        revokedFamilyTokenBody.message,
        'Refresh token reuse detected',
      );

      const secondLogin = await postJson(baseUrl, '/api/v1/auth/login', {
        email: credentials.email,
        password: credentials.password,
      });
      const secondLoginBody = await secondLogin.json();
      const logout = await postJson(baseUrl, '/api/v1/auth/logout', {
        refreshToken: secondLoginBody.data.refreshToken,
      });
      const logoutBody = await logout.json();

      assert.equal(logout.status, 200);
      assert.equal(logoutBody.data.revoked, true);
    } finally {
      server.close();
      await mongoose.connection.dropDatabase();
      await mongoose.disconnect();
    }
  },
);
