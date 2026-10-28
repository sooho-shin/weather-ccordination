import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile, execFileSync } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { AI_LIMITS, createSession, handleAiRequest, reserveUsage } from '../../functions/lib/aiGuard';
import { onRequestPost as copyPhoto } from '../../functions/api/ai/photo';

const run = promisify(execFile);
const python = `import sqlite3,json,sys
db=sqlite3.connect(sys.argv[1],timeout=30)
db.row_factory=sqlite3.Row
cur=db.execute(sys.argv[2],json.loads(sys.argv[3]))
rows=[dict(row) for row in cur.fetchall()] if cur.description else []
db.commit()
print(json.dumps({'results':rows}))`;

function database(t: { after: (fn: () => void) => void }) {
  const dir = mkdtempSync(join(tmpdir(), 'dize-quota-test-'));
  const path = join(dir, 'quota.sqlite');
  execFileSync('python3', ['-c', 'import sqlite3,sys; sqlite3.connect(sys.argv[1]).executescript(sys.argv[2])', path, readFileSync('migrations/0001_ai_usage.sql', 'utf8')]);
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const query = async (sql: string, params: unknown[]) => JSON.parse((await run('python3', ['-c', python, path, sql, JSON.stringify(params)])).stdout);
  return {
    query,
    prepare: (sql: string) => ({ bind: (...params: unknown[]) => ({ all: () => query(sql, params), run: () => query(sql, params) }) }),
  };
}

const secret = 'only-for-quota-unit-tests';
const image = { input: { prompt: 'Full body model with leather tote bag', num_images: 1 } };
async function context(db: ReturnType<typeof database>, payload: unknown = image) {
  const session = await createSession(new Request('https://example.test/api/ai/session'), secret);
  const cookie = session.headers.get('Set-Cookie')!.split(';')[0];
  return {
    request: new Request('https://example.test/api/ai/flux', { method: 'POST', body: JSON.stringify(payload), headers: {
      Origin: 'https://example.test', 'Content-Type': 'application/json', Cookie: cookie, 'CF-Connecting-IP': '192.0.2.2',
    } }),
    env: { HIVE_SECRET_KEY: 'unit-server-key', AI_SESSION_SECRET: secret, AI_LIMITS: db },
  };
}

test('unsigned, forged and cross-origin requests cannot reserve paid calls', async (t) => {
  const db = database(t);
  const ctx = await context(db);
  for (const [headers, status] of [
    [{ Cookie: '' }, 401],
    [{ Cookie: '__Host-dize-ai=forged' }, 401],
    [{ Origin: 'https://evil.test' }, 403],
  ] as const) {
    const changed = new Headers(ctx.request.headers);
    for (const [key, value] of Object.entries(headers)) changed.set(key, value);
    const response = await reserveUsage({ ...ctx, request: new Request(ctx.request.url, { headers: changed }) }, 'flux');
    assert.equal(response?.status, status);
  }
  assert.equal((await db.query('SELECT COUNT(*) AS count FROM ai_usage', [])).results[0].count, 0);
});

test('concurrent requests across fresh sessions share an atomic IP minute cap', async (t) => {
  const db = database(t);
  const contexts = await Promise.all(Array.from({ length: 9 }, () => context(db)));
  const results = await Promise.all(contexts.map((ctx) => reserveUsage(ctx, 'flux')));
  assert.equal(results.filter((result) => result === null).length, AI_LIMITS.ipMinute);
  assert.equal(results.filter((result) => result?.status === 429).length, 9 - AI_LIMITS.ipMinute);
  const rows = (await db.query('SELECT ip_hash FROM ai_usage', [])).results;
  assert.ok(rows.every((row: any) => row.ip_hash.length === 64 && row.ip_hash !== '192.0.2.2'));
});

test('the global daily cap blocks a new session on a new IP', async (t) => {
  const db = database(t);
  await db.query(`WITH RECURSIVE n(x) AS (SELECT 1 UNION ALL SELECT x+1 FROM n WHERE x < ?)
    INSERT INTO ai_usage SELECT 'seed'||x, ?, 'other-session', 'other-ip', 'flux' FROM n`, [AI_LIMITS.fluxDaily, Date.now()]);
  assert.equal((await reserveUsage(await context(db), 'flux'))?.status, 429);
});

test('the session daily quota survives a new IP', async (t) => {
  const db = database(t);
  const ctx = await context(db);
  const id = ctx.request.headers.get('Cookie')!.split('=')[1].split('.')[0];
  await db.query(`WITH RECURSIVE n(x) AS (SELECT 1 UNION ALL SELECT x+1 FROM n WHERE x < ?)
    INSERT INTO ai_usage SELECT 'seed'||x, ?, ?, 'old-ip', 'flux' FROM n`, [AI_LIMITS.sessionDaily, Date.now(), id]);
  assert.equal((await reserveUsage(ctx, 'flux'))?.status, 429);
});

test('photo preservation cannot fetch arbitrary hosts, credentials or non-generated paths', async (t) => {
  const db = database(t);
  const previous = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => { calls++; throw new Error('Do not access untrusted URLs'); };
  try {
    for (const url of [
      'http://127.0.0.1/private',
      'https://hive-data-prod-cdn.thehive.ai.evil.test/image_generation/test',
      'https://hive-data-prod-cdn.thehive.ai/private',
      'https://user:password@hive-data-prod-cdn.thehive.ai/image_generation/test',
    ]) assert.equal((await copyPhoto(await context(db, { url }))).status, 400);
    assert.equal(calls, 0);
  } finally { globalThis.fetch = previous; }
});

test('photo bytes are copied without CORS or AI charges and large images are rejected', async (t) => {
  const db = database(t);
  const previous = globalThis.fetch;
  const url = 'https://hive-data-prod-cdn.thehive.ai/image_generation/test/photo.jpg';
  try {
    globalThis.fetch = async (_url, options) => {
      assert.equal(options?.redirect, 'manual');
      return new Response('photo', { headers: { 'Content-Type': 'image/jpeg' } });
    };
    const result = await copyPhoto(await context(db, { url }));
    assert.equal(result.status, 200);
    assert.equal(await result.text(), 'photo');
    assert.equal(result.headers.get('Cache-Control'), 'no-store');
    assert.equal((await db.query('SELECT COUNT(*) AS count FROM ai_usage', [])).results[0].count, 0);
    assert.equal((await db.query('SELECT COUNT(*) AS count FROM photo_usage', [])).results[0].count, 1);
    globalThis.fetch = async () => new Response(null, { status: 302, headers: { Location: 'http://127.0.0.1/private' } });
    assert.equal((await copyPhoto(await context(db, { url }))).status, 502);
    globalThis.fetch = async () => new Response(new Uint8Array(4 * 1024 * 1024 + 1), { headers: { 'Content-Type': 'image/png' } });
    assert.equal((await copyPhoto(await context(db, { url }))).status, 413);
  } finally { globalThis.fetch = previous; }
});

test('resetting the cookie cannot bypass the IP daily quota', async (t) => {
  const db = database(t);
  assert.equal(await reserveUsage(await context(db), 'flux'), null);
  const hash = (await db.query('SELECT ip_hash FROM ai_usage LIMIT 1', [])).results[0].ip_hash;
  await db.query(`WITH RECURSIVE n(x) AS (SELECT 1 UNION ALL SELECT x+1 FROM n WHERE x < ?)
    INSERT INTO ai_usage SELECT 'seed'||x, ?, 'old-session', ?, 'flux' FROM n`, [AI_LIMITS.ipDaily - 1, Date.now(), hash]);
  assert.equal((await reserveUsage(await context(db), 'flux'))?.status, 429);
});

test('invalid generation sizes, image counts, models and oversized JSON never reach Hive', async (t) => {
  const db = database(t);
  const previous = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => { calls++; throw new Error('Must not contact Hive'); };
  try {
    for (const [payload, kind, status] of [
      [{ input: { prompt: 'test', num_images: 6 } }, 'flux', 400],
      [{ input: { prompt: 'test', image_size: { width: 4096, height: 4096 } } }, 'flux', 400],
      [{ input: { prompt: 'x'.repeat(17000) } }, 'flux', 413],
      [{ model: 'unapproved-expensive-model', messages: [] }, 'deepseek', 400],
    ] as const) {
      const result = await handleAiRequest(await context(db, payload), kind);
      assert.equal(result.status, status);
    }
    assert.equal(calls, 0);
  } finally { globalThis.fetch = previous; }
});

test('server fixes paid settings regardless of client-supplied token and step options', async (t) => {
  const db = database(t);
  const previous = globalThis.fetch;
  let body: any;
  globalThis.fetch = async (_url, options) => { body = JSON.parse(String(options?.body)); return new Response('{"output":[]}'); };
  try {
    const result = await handleAiRequest(await context(db, { input: { prompt: 'test', num_inference_steps: 100, seed: 1 } }), 'flux');
    assert.equal(result.status, 200);
    assert.equal(body.input.num_images, 1);
    assert.equal(body.input.num_inference_steps, 4);
    const text = { model: 'deepseek-ai/deepseek-v4.1-flash-1017', max_completion_tokens: 100000, messages: [{ role: 'system', content: 'test' }, { role: 'user', content: 'test' }] };
    assert.equal((await handleAiRequest(await context(db, text), 'deepseek')).status, 200);
    assert.equal(body.max_completion_tokens, 2500);
    assert.equal(body.reasoning_effort, 'none');
  } finally { globalThis.fetch = previous; }
});
