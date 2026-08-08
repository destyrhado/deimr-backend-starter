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
