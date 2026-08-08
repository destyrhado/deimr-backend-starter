import test from 'node:test';
import assert from 'node:assert/strict';
import { RefreshToken } from '../../src/models/refreshToken.js';

test('RefreshToken model stores token digests instead of raw refresh tokens', () => {
  assert.ok(RefreshToken.schema.path('tokenHash'));
  assert.ok(RefreshToken.schema.path('tokenFamilyId'));
  assert.ok(RefreshToken.schema.path('replacedByTokenHash'));
  assert.ok(RefreshToken.schema.path('reuseDetectedAt'));
  assert.equal(RefreshToken.schema.path('token'), undefined);
});

test('RefreshToken model declares token-family and TTL indexes', () => {
  const indexes = RefreshToken.schema.indexes();

  assert.ok(
    indexes.some(
      ([fields]) => fields.userId === 1 && fields.tokenFamilyId === 1,
    ),
  );
  assert.ok(
    indexes.some(
      ([fields, options]) =>
        fields.expiresAt === 1 && options?.expireAfterSeconds === 0,
    ),
  );
});
