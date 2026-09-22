import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';

const app = createApp({ logger: false });

test('GET /healthz returns ok', async () => {
  const res = await request(app).get('/healthz');
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, { status: 'ok' });
});

test('GET /api/experts lists all experts', async () => {
  const res = await request(app).get('/api/experts');
  assert.equal(res.status, 200);
  assert.equal(res.body.count, res.body.data.length);
  assert.ok(res.body.count > 0);
});

test('GET /api/experts filters by specialty', async () => {
  const res = await request(app).get('/api/experts?specialty=Plumbing');
  assert.equal(res.status, 200);
  assert.ok(res.body.data.every((e) => e.specialty === 'plumbing'));
});

test('GET /api/experts/:id returns 404 for unknown expert', async () => {
  const res = await request(app).get('/api/experts/9999');
  assert.equal(res.status, 404);
});
