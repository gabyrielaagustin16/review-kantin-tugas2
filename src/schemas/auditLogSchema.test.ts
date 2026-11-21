import assert from 'node:assert/strict';
import test from 'node:test';
import {
  auditLogDetailSchema,
  auditLogListSchema,
} from './auditLogSchema.ts';

test('parses valid audit filters and defaults pagination', () => {
  const result = auditLogListSchema.safeParse({
    query: {
      userId: '4',
      targetId: '12',
      from: '2026-11-01',
      to: '2026-11-21',
    },
  });

  assert.equal(result.success, true);
  if (!result.success) return;
  assert.deepEqual(result.data.query, {
    page: 1,
    pageSize: 20,
    userId: 4,
    targetId: 12,
    from: '2026-11-01',
    to: '2026-11-21',
  });
});

test('rejects non-integer numeric representations and out-of-range pagination', () => {
  for (const page of ['1.5', '1.0', '1e1', '0', '-1', '']) {
    assert.equal(auditLogListSchema.safeParse({ query: { page } }).success, false, page);
  }
  assert.equal(auditLogListSchema.safeParse({ query: { pageSize: '101' } }).success, false);
  assert.equal(auditLogListSchema.safeParse({ query: { targetId: '2147483648' } }).success, false);
});

test('rejects invalid dates, reversed date ranges, and unknown query keys', () => {
  assert.equal(auditLogListSchema.safeParse({
    query: { from: '2026-02-30' },
  }).success, false);
  assert.equal(auditLogListSchema.safeParse({
    query: { from: '2026-12-01', to: '2026-01-01' },
  }).success, false);
  assert.equal(auditLogListSchema.safeParse({
    query: { unexpected: '1' },
  }).success, false);
});

test('requires a positive integer audit-log id', () => {
  assert.equal(auditLogDetailSchema.safeParse({ params: { id: '12' } }).success, true);
  assert.equal(auditLogDetailSchema.safeParse({ params: { id: 'abc' } }).success, false);
  assert.equal(auditLogDetailSchema.safeParse({ params: { id: '0' } }).success, false);
});
