import test from 'node:test';
import assert from 'node:assert/strict';
import { UserRepository } from '../../src/repositories/user.repository.js';
import { UserService } from '../../src/services/user.service.js';

const mockUser = {
  _id: { toString: () => '66b7f1a2c0a4f7b5f0d9a111' },
  name: 'Jane Doe',
  email: 'jane@example.test',
  role: 'ADMIN',
  status: 'ACTIVE',
  createdAt: new Date('2026-08-08T00:00:00.000Z'),
  updatedAt: new Date('2026-08-08T00:00:00.000Z')
};

test('UserService.list applies pagination, search, filtering, and sorting', async (t) => {
  const originalCount = UserRepository.count;
  const originalFindAll = UserRepository.findAll;
  let capturedFilter: any;
  let capturedOptions: any;

  UserRepository.count = async (filter: any) => {
    capturedFilter = filter;
    return 12;
  };
  UserRepository.findAll = async (filter: any, options: any) => {
    capturedFilter = filter;
    capturedOptions = options;
    return [mockUser as any];
  };

  t.after(() => {
    UserRepository.count = originalCount;
    UserRepository.findAll = originalFindAll;
  });

  const result = await UserService.list({
    page: '2',
    limit: '5',
    search: 'jane',
    role: 'admin',
    status: 'active',
    sort: 'email'
  });

  assert.equal(capturedFilter.role, 'ADMIN');
  assert.equal(capturedFilter.status, 'ACTIVE');
  assert.equal(capturedFilter.$or[0].name.test('Jane Example'), true);
  assert.equal(capturedFilter.$or[1].email.test('jane@example.test'), true);
  assert.deepEqual(capturedOptions, { skip: 5, limit: 5, sort: { email: 1 } });
  assert.equal(result.users[0].email, 'jane@example.test');
  assert.deepEqual(result.pagination, {
    page: 2,
    limit: 5,
    total: 12,
    pages: 3,
    hasNextPage: true,
    hasPreviousPage: true
  });
});

test('UserService.list rejects unsupported query values before querying MongoDB', async () => {
  await assert.rejects(
    () => UserService.list({ limit: '101' }),
    (error: any) => error.statusCode === 400 && error.message === 'Invalid pagination parameters'
  );

  await assert.rejects(
    () => UserService.list({ role: 'owner' }),
    (error: any) => error.statusCode === 400 && error.message === 'Invalid filter parameters'
  );

  await assert.rejects(
    () => UserService.list({ sort: 'passwordHash' }),
    (error: any) => error.statusCode === 400 && error.message === 'Invalid sort parameter'
  );
});
