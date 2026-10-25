import test from 'node:test';
import assert from 'node:assert';
import { calculateSiteHealthScore, calculateKeywordDifficulty, calculateDomainRating } from '@rivue/scoring';
import { LocalD1SqliteDatabase, D1MigrationRunner, RivueD1Repository } from '@rivue/db';
import { SerperClient } from '@rivue/serper-client';

test('DIFFERENTIAL SMOKE TEST (§6): Keyword Intelligence Pipeline', async () => {
  const client = new SerperClient({ useMockData: true });

  // Input A: High-competition commercial keyword
  const keywordA = 'crm software';
  const snapshotA = await client.search({ q: keywordA });

  // Input B: Specific niche tool keyword
  const keywordB = 'digital pr crm';
  const snapshotB = await client.search({ q: keywordB });

  // ASSERT: Outputs are strictly not identical
  assert.notDeepStrictEqual(snapshotA, snapshotB, 'Snapshots for different queries must not be identical');
  assert.strictEqual(snapshotA.query, 'crm software');
  assert.strictEqual(snapshotB.query, 'digital pr crm');

  // Compute metrics with proper scoring interface
  const kdScoreA = calculateKeywordDifficulty({
    topDomainsAverageDr: 82,
    topPageBacklinkMedian: 120,
    serpFeaturesCount: snapshotA.derived?.serpFeatureCount || 4,
    commercialIntentWeight: 0.85,
    totalCompetitorsInTop10: 10,
  });

  const kdScoreB = calculateKeywordDifficulty({
    topDomainsAverageDr: 32,
    topPageBacklinkMedian: 4,
    serpFeaturesCount: snapshotB.derived?.serpFeatureCount || 1,
    commercialIntentWeight: 0.25,
    totalCompetitorsInTop10: 10,
  });

  // ASSERT: Direction of difference makes sense
  assert.ok(kdScoreA > kdScoreB, `Broad keyword difficulty (${kdScoreA}) must exceed niche difficulty (${kdScoreB})`);
  assert.ok(snapshotA.organic.length > 0);
  assert.ok(snapshotB.organic.length > 0);

  // Assert Provenance is attached
  assert.ok(snapshotA.provenance);
  assert.ok(snapshotB.provenance);
  assert.strictEqual(snapshotA.provenance?.source, 'mock');
});

test('DIFFERENTIAL SMOKE TEST (§6): Technical Site Audit Signal Parser & Health Score', async () => {
  // Input A: Fully Optimized HTML Document
  const htmlOptimized = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <title>Best Cloud CRM Software for Enterprise Sales Teams</title>
      <meta name="description" content="Discover modern cloud CRM software designed for high-velocity enterprise sales teams. Start your 14-day free trial with zero setup fees today.">
      <link rel="canonical" href="https://example-enterprise.com/">
      <script type="application/ld+json">{"@context":"https://schema.org","@type":"SoftwareApplication","name":"Enterprise CRM"}</script>
    </head>
    <body>
      <h1>Enterprise Sales CRM Platform</h1>
      <p>Streamline pipeline velocity and accelerate customer lifetime value with automated workflows.</p>
      <img src="/logo.png" alt="Company Logo" width="120" height="40">
      <img src="/dashboard.png" alt="Sales Pipeline Dashboard Screenshot" width="800" height="450">
    </body>
    </html>
  `;

  // Input B: Severely Defective / Broken HTML Document
  const htmlDefective = `
    <!DOCTYPE html>
    <html>
    <head>
      <!-- Missing <title> -->
      <!-- Missing meta description -->
    </head>
    <body>
      <h1>First H1 Tag</h1>
      <h1>Second Duplicate H1 Tag</h1>
      <h1>Third Duplicate H1 Tag</h1>
      <img src="/banner.png">
      <img src="/icon1.png">
      <img src="/icon2.png">
      <img src="/icon3.png">
    </body>
    </html>
  `;

  // Parser function replicating /api/audit/analyze signal detection
  const parseAuditSignals = (html: string) => {
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';

    const metaMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
    const metaDesc = metaMatch ? metaMatch[1].trim() : '';

    const h1Regex = /<h1[^>]*>([\s\S]*?)<\/h1>/gi;
    const h1Matches: string[] = [];
    let m;
    while ((m = h1Regex.exec(html)) !== null) h1Matches.push(m[1].trim());

    const allImgs = html.match(/<img[^>]+>/gi) || [];
    let missingAlt = 0;
    allImgs.forEach((img) => {
      if (!/alt=["'][^"']+["']/i.test(img)) missingAlt++;
    });

    const hasSchema = /application\/ld\+json/i.test(html);

    let errors = 0;
    let warnings = 0;
    let notices = 0;

    if (!title) errors++;
    if (!metaDesc) errors++;
    if (h1Matches.length === 0) errors++;
    if (h1Matches.length > 1) warnings++;
    if (missingAlt > 0) warnings++;
    if (!hasSchema) notices++;

    const healthScore = calculateSiteHealthScore({
      totalPages: 10,
      errorsCount: errors * 10,
      warningsCount: warnings * 5,
      noticesCount: notices * 2,
      coreWebVitalsPassRate: errors === 0 ? 0.98 : 0.65,
    });

    return { title, metaDesc, h1Count: h1Matches.length, missingAlt, hasSchema, errors, warnings, notices, healthScore };
  };

  const auditA = parseAuditSignals(htmlOptimized);
  const auditB = parseAuditSignals(htmlDefective);

  // ASSERT: Outputs are strictly not identical
  assert.notDeepStrictEqual(auditA, auditB);

  // ASSERT: Optimized site has zero errors and high health score
  assert.strictEqual(auditA.errors, 0, 'Optimized HTML should have 0 critical errors');
  assert.strictEqual(auditA.warnings, 0, 'Optimized HTML should have 0 warnings');
  assert.strictEqual(auditA.hasSchema, true);
  assert.ok(auditA.healthScore >= 90, `Optimized health score should be >= 90, got ${auditA.healthScore}`);

  // ASSERT: Defective site has critical errors and heavily penalized health score
  assert.ok(auditB.errors >= 2, `Defective HTML must have >= 2 errors, got ${auditB.errors}`);
  assert.ok(auditB.warnings >= 2, `Defective HTML must have >= 2 warnings, got ${auditB.warnings}`);
  assert.strictEqual(auditB.hasSchema, false);
  assert.ok(auditB.healthScore < 60, `Defective health score should be < 60, got ${auditB.healthScore}`);

  // ASSERT: Directional difference
  assert.ok(auditA.healthScore > auditB.healthScore, 'Health score of optimized site must strictly exceed defective site');
});

test('DIFFERENTIAL SMOKE TEST (§6): Backlinks & Domain Authority Logarithmic Decay', () => {
  // Input A: High-authority enterprise site (Stripe / HubSpot scale)
  const ratingA = calculateDomainRating({
    referringDomainsCount: 18500,
    totalBacklinksCount: 450000,
    dofollowRatio: 0.82,
    averageReferringDomainDr: 68,
  });

  // Input B: Brand new startup domain
  const ratingB = calculateDomainRating({
    referringDomainsCount: 4,
    totalBacklinksCount: 8,
    dofollowRatio: 0.5,
    averageReferringDomainDr: 20,
  });

  // ASSERT: Outputs not identical and directionally correct
  assert.notStrictEqual(ratingA, ratingB);
  assert.ok(ratingA > ratingB);
  assert.ok(ratingA >= 75, `Tier-1 enterprise domain rating should be >= 75, got ${ratingA}`);
  assert.ok(ratingB <= 25, `New domain rating should be <= 25, got ${ratingB}`);
});

test('DIFFERENTIAL SMOKE TEST (§6): Cloudflare D1 SQLite Isolation & Provenance Persistence', async () => {
  const db = new LocalD1SqliteDatabase(':memory:');
  const repo = new RivueD1Repository(db);
  await repo.init();

  // Store Record A
  await repo.saveSerpSnapshot({
    id: 'snap_stripe',
    query: 'payment processing',
    geo: 'us',
    language: 'en',
    device: 'desktop',
    fetchedAt: '2026-08-30T10:00:00Z',
    organic: [{ position: 1, title: 'Stripe: Financial Infrastructure', link: 'https://stripe.com' }],
    provenance: {
      source: 'live',
      fetchedAt: '2026-08-30T10:00:00Z',
      staleAfter: '2026-08-31T10:00:00Z',
      provider: 'Serper',
    },
  });

  // Store Record B
  await repo.saveSerpSnapshot({
    id: 'snap_placeholder',
    query: 'local pet grooming',
    geo: 'us',
    language: 'en',
    device: 'desktop',
    fetchedAt: '2026-08-30T10:05:00Z',
    organic: [{ position: 1, title: 'Downtown Pet Grooming', link: 'https://downtownpets.com' }],
    provenance: {
      source: 'live',
      fetchedAt: '2026-08-30T10:05:00Z',
      staleAfter: '2026-08-31T10:05:00Z',
      provider: 'Serper',
    },
  });

  // Query independently
  const resultA = await repo.getSerpSnapshot('payment processing');
  const resultB = await repo.getSerpSnapshot('local pet grooming');

  assert.ok(resultA);
  assert.ok(resultB);
  assert.notDeepStrictEqual(resultA, resultB);
  assert.strictEqual(resultA?.organic[0].link, 'https://stripe.com');
  assert.strictEqual(resultB?.organic[0].link, 'https://downtownpets.com');
  assert.strictEqual(resultA?.provenance?.source, 'cached');
  assert.strictEqual(resultB?.provenance?.source, 'cached');
});
