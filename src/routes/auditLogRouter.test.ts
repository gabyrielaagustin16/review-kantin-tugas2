import assert from 'node:assert/strict';
import { once } from 'node:events';
import express from 'express';
import test, { after, before } from 'node:test';
import { auditLogRouter } from './auditLogRouter.ts';
import { errorHandler } from '../middlewares/errorHandler.ts';
import { signToken } from '../services/tokenService.ts';

const app = express();
app.use('/api/audit-logs', auditLogRouter);
app.use(errorHandler);

let server: ReturnType<typeof app.listen>;
let baseUrl: string;
let ownerToken: string;
let customerToken: string;
let adminToken: string;

before(async () => {
  process.env.JWT_SECRET = 'audit-route-test-secret';
  server = app.listen(0);
  await once(server, 'listening');
  const address = server.address();
  assert(address && typeof address !== 'string');
  baseUrl = `http://127.0.0.1:${address.port}/api/audit-logs`;
  ownerToken = signToken({ id: 2, name: 'Owner', email: 'owner@test.invalid', role: 'owner' });
  customerToken = signToken({ id: 3, name: 'Customer', email: 'customer@test.invalid', role: 'customer' });
  adminToken = signToken({ id: 1, name: 'Admin', email: 'admin@test.invalid', role: 'admin' });
});

after(async () => {
  if (server) {
    server.close();
    await once(server, 'close');
  }
});

test('audit list and detail require authentication and admin role', async () => {
  for (const path of ['', '/1']) {
    const unauthenticated = await fetch(`${baseUrl}${path}`);
    assert.equal(unauthenticated.status, 401);

    const owner = await fetch(`${baseUrl}${path}`, {
      headers: { Authorization: `Bearer ${ownerToken}` },
    });
    assert.equal(owner.status, 403);

    const customer = await fetch(`${baseUrl}${path}`, {
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    assert.equal(customer.status, 403);
  }
});

test('admin validation errors use the Tugas 3 error response without querying the database', async () => {
  const invalidList = await fetch(`${baseUrl}?page=1.0`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert.equal(invalidList.status, 400);
  const listBody = await invalidList.json() as {
    status?: string;
    message?: string;
    errors?: Array<{ field: string; message: string }>;
  };
  assert.equal(listBody.status, 'fail');
  assert.equal(listBody.message, 'Validasi gagal');
  assert.ok(Array.isArray(listBody.errors));
  assert.ok(listBody.errors.length > 0);

  const invalidDetail = await fetch(`${baseUrl}/abc`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert.equal(invalidDetail.status, 400);
});
