import test from 'node:test';
import assert from 'node:assert';
import { LocalD1SqliteDatabase, D1MigrationRunner, RivueD1Repository } from '@rivue/db';
import { SerpSnapshot } from '@rivue/types';

test('Cloudflare D1 SQLite: in-memory engine executes SQL migrations cleanly', async () => {
  const db = new LocalD1SqliteDatabase(':memory:');
  const runner = new D1MigrationRunner(db);
  const applied = await runner.runMigrations();

  assert.ok(applied.length > 0, 'Should apply at least one migration');
  assert.ok(applied.includes('0001_d1_initial_schema'), 'Should apply initial schema');

  // Verify health check
  const health = await db.checkHealth();
  assert.strictEqual(health.status, 'healthy');
  assert.strictEqual(health.provider, 'cloudflare-d1-sqlite-local');
  assert.ok(health.tableCount >= 10, `Expected at least 10 tables, got ${health.tableCount}`);
});

test('Cloudflare D1 SQLite: prepared statements and transactions operate with full D1 semantics', async () => {
  const db = new LocalD1SqliteDatabase(':memory:');
  const runner = new D1MigrationRunner(db);
  await runner.runMigrations();

  // Test insert
  const insert = db.prepare('INSERT INTO organizations (id, name, slug, plan, created_at) VALUES (?, ?, ?, ?, ?);');
  const res = await insert.bind('org_test', 'Test Agency', 'test-agency', 'pro', new Date().toISOString()).run();
  assert.strictEqual(res.success, true);
  assert.strictEqual(res.meta.changes, 1);

  // Test first()
  const row = await db.prepare('SELECT name, plan FROM organizations WHERE id = ?;').bind('org_test').first<{ name: string; plan: string }>();
  assert.ok(row);
  assert.strictEqual(row?.name, 'Test Agency');
  assert.strictEqual(row?.plan, 'pro');

  // Test batch
  const batchRes = await db.batch([
    db.prepare('INSERT INTO keywords (id, keyword, volume, provenance_source, fetched_at, stale_after) VALUES (?, ?, ?, ?, ?, ?);').bind('kw_1', 'crm software', 48500, 'live', '2026-08-30T10:00:00Z', '2026-08-31T10:00:00Z'),
    db.prepare('INSERT INTO keywords (id, keyword, volume, provenance_source, fetched_at, stale_after) VALUES (?, ?, ?, ?, ?, ?);').bind('kw_2', 'seo tools', 32000, 'live', '2026-08-30T10:00:00Z', '2026-08-31T10:00:00Z'),
  ]);
  assert.strictEqual(batchRes.length, 2);

  const count = await db.prepare('SELECT count(*) as total FROM keywords;').first<{ total: number }>();
  assert.strictEqual(count?.total, 2);
});

test('RivueD1Repository: stores and retrieves SERP snapshots with data provenance', async () => {
  const db = new LocalD1SqliteDatabase(':memory:');
  const repo = new RivueD1Repository(db);
  await repo.init();

  const snapshot: SerpSnapshot = {
    id: 'snap_test_123',
    query: 'lead generation agency',
    geo: 'us',
    language: 'en',
    device: 'desktop',
    fetchedAt: new Date().toISOString(),
    organic: [
      { position: 1, title: 'Top Lead Agency', link: 'https://leadagency.com', domain: 'leadagency.com' },
      { position: 2, title: 'B2B Leads', link: 'https://b2bleads.com', domain: 'b2bleads.com' },
    ],
    provenance: {
      source: 'live',
      fetchedAt: new Date().toISOString(),
      staleAfter: new Date(Date.now() + 86400000).toISOString(),
      provider: 'Serper API',
    },
  };

  await repo.saveSerpSnapshot(snapshot);

  const retrieved = await repo.getSerpSnapshot('lead generation agency');
  assert.ok(retrieved);
  assert.strictEqual(retrieved?.query, 'lead generation agency');
  assert.strictEqual(retrieved?.organic.length, 2);
  assert.strictEqual(retrieved?.provenance?.source, 'cached');
});

test('RivueD1Repository: tracks provenance telemetry and computes accurate breakdown metrics', async () => {
  const db = new LocalD1SqliteDatabase(':memory:');
  const repo = new RivueD1Repository(db);
  await repo.init();

  const now = new Date().toISOString();
  await repo.recordProvenanceTelemetry({
    id: 'tel_1',
    endpoint: '/api/serper',
    metricKey: 'search:crm software',
    source: 'live',
    durationMs: 240,
    cacheHit: false,
    timestamp: now,
  });

  await repo.recordProvenanceTelemetry({
    id: 'tel_2',
    endpoint: '/api/serper',
    metricKey: 'search:crm software',
    source: 'cached',
    durationMs: 12,
    cacheHit: true,
    timestamp: now,
  });

  await repo.recordProvenanceTelemetry({
    id: 'tel_3',
    endpoint: '/api/audit/analyze',
    metricKey: 'audit:stripe.com',
    source: 'live',
    durationMs: 450,
    cacheHit: false,
    timestamp: now,
  });

  const breakdown = await repo.getProvenanceBreakdown();
  assert.strictEqual(breakdown.totalRequests, 3);
  assert.strictEqual(breakdown.liveCount, 2);
  assert.strictEqual(breakdown.cachedCount, 1);
  assert.strictEqual(breakdown.mockCount, 0);
  assert.strictEqual(breakdown.mockRatio, 0);
  assert.ok(breakdown.liveRatio > 60);
});

test('RivueD1Repository: credits ledger maintains transactional balance integrity', async () => {
  const db = new LocalD1SqliteDatabase(':memory:');
  const repo = new RivueD1Repository(db);
  await repo.init();

  const initial = await repo.getQuotaLedger();
  assert.strictEqual(initial.creditsRemaining, 50000);

  const balanceAfterAudit = await repo.deductCredits('site_audit', 100, 'Audit run for stripe.com');
  assert.strictEqual(balanceAfterAudit, 49900);

  const balanceAfterRefill = await repo.refillCredits(500, 'Admin top up');
  assert.strictEqual(balanceAfterRefill, 50400);

  const updatedLedger = await repo.getQuotaLedger();
  assert.strictEqual(updatedLedger.creditsRemaining, 50400);
  assert.ok(updatedLedger.recentTransactions.length >= 2);
});
