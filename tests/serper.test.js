import test from 'node:test';
import assert from 'node:assert';

import {
  computeEstimatedCtr,
  computeSerpFeatureCount,
  extractDomainFromUrl,
  computeSerpVolatility,
  computeContentGapScore,
} from '../packages/serper-client/src/derived.js';
import { SerperClient } from '../packages/serper-client/src/client.js';

test('computeEstimatedCtr follows position-weighted CTR decay', () => {
  const pos1Ctr = computeEstimatedCtr(1);
  const pos2Ctr = computeEstimatedCtr(2);
  const pos10Ctr = computeEstimatedCtr(10);

  assert.ok(pos1Ctr > pos2Ctr);
  assert.ok(pos2Ctr > pos10Ctr);
  assert.strictEqual(pos1Ctr, 28.5);
  assert.strictEqual(pos2Ctr, 15.7);
  assert.strictEqual(pos10Ctr, 2.0);
});

test('computeSerpFeatureCount correctly sums rich elements', () => {
  const count = computeSerpFeatureCount({
    knowledgeGraph: { title: 'CRM' },
    peopleAlsoAsk: [{ question: 'What is CRM?' }],
    places: [{ title: 'Agency' }],
  });
  assert.strictEqual(count, 3);
});

test('extractDomainFromUrl extracts clean hostname', () => {
  assert.strictEqual(extractDomainFromUrl('https://www.hubspot.com/crm/pricing'), 'hubspot.com');
  assert.strictEqual(extractDomainFromUrl('http://ahrefs.com/keywords'), 'ahrefs.com');
});

test('computeSerpVolatility returns index between 0.5 and 10.0', () => {
  const volCalm = computeSerpVolatility([1, 1, 2, 1, 1]);
  const volTurbulent = computeSerpVolatility([1, 8, 2, 9, 3]);

  assert.ok(volCalm < volTurbulent);
  assert.ok(volCalm >= 0.5);
  assert.ok(volTurbulent <= 10.0);
});

test('computeContentGapScore balances word count and heading overlap', () => {
  const scoreHigh = computeContentGapScore({
    yourWordCount: 2000,
    avgCompetitorWordCount: 2000,
    yourH2Headings: ['Pricing', 'Features', 'Integrations'],
    competitorH2Headings: ['Pricing', 'Features', 'Integrations'],
  });
  assert.strictEqual(scoreHigh, 100);

  const scoreLow = computeContentGapScore({
    yourWordCount: 300,
    avgCompetitorWordCount: 2500,
    yourH2Headings: ['Intro'],
    competitorH2Headings: ['Pricing', 'Features', 'API', 'Case Studies'],
  });
  assert.ok(scoreLow < 30);
});

test('SerperClient fetches high-fidelity mock fixture when offline', async () => {
  const client = new SerperClient();
  const result = await client.search({ q: 'crm software' });

  assert.strictEqual(result.query, 'crm software');
  assert.ok(result.organic.length > 0);
  assert.ok(result.derived !== undefined);
  assert.ok(result.derived.serpFeatureCount >= 1);
});
