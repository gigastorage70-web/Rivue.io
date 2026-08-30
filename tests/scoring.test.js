import test from 'node:test';
import assert from 'node:assert';

// Import compiled or raw scoring logic
import {
  calculateSiteHealthScore,
  getHealthScoreGrade,
} from '../packages/scoring/src/site-health.js';
import {
  calculateKeywordDifficulty,
  getKdDifficultyLabel,
} from '../packages/scoring/src/keyword-difficulty.js';
import { calculateDomainRating } from '../packages/scoring/src/domain-rating.js';
import { calculateSpamScore } from '../packages/scoring/src/spam-score.js';
import { analyzeSentiment } from '../packages/scoring/src/sentiment.js';
import { auditNapConsistency } from '../packages/scoring/src/nap-audit.js';

test('calculateSiteHealthScore returns 100 for zero defects', () => {
  const score = calculateSiteHealthScore({
    totalPages: 100,
    errorsCount: 0,
    warningsCount: 0,
    noticesCount: 0,
    coreWebVitalsPassRate: 1.0,
  });
  assert.strictEqual(score, 100);
});

test('calculateSiteHealthScore penalizes critical errors heavily', () => {
  const score = calculateSiteHealthScore({
    totalPages: 100,
    errorsCount: 5,
    warningsCount: 10,
    noticesCount: 20,
  });
  assert.ok(score < 90 && score > 60);
});

test('getHealthScoreGrade assigns correct color and rating', () => {
  assert.strictEqual(getHealthScoreGrade(92).grade, 'Good');
  assert.strictEqual(getHealthScoreGrade(75).grade, 'Fair');
  assert.strictEqual(getHealthScoreGrade(45).grade, 'Critical');
});

test('calculateKeywordDifficulty computes accurate 0-100 score', () => {
  const highKd = calculateKeywordDifficulty({
    topDomainsAverageDr: 85,
    topPageBacklinkMedian: 250,
    serpFeaturesCount: 4,
    commercialIntentWeight: 0.9,
    totalCompetitorsInTop10: 10,
  });
  assert.ok(highKd >= 70 && highKd <= 99);

  const lowKd = calculateKeywordDifficulty({
    topDomainsAverageDr: 20,
    topPageBacklinkMedian: 2,
    serpFeaturesCount: 1,
    commercialIntentWeight: 0.2,
    totalCompetitorsInTop10: 10,
  });
  assert.ok(lowKd <= 35);
});

test('calculateDomainRating uses logarithmic referring domain scale', () => {
  const drPowerhouse = calculateDomainRating({
    referringDomainsCount: 5000,
    totalBacklinksCount: 100000,
    dofollowRatio: 0.85,
    averageReferringDomainDr: 75,
  });
  assert.ok(drPowerhouse >= 80);

  const drNew = calculateDomainRating({
    referringDomainsCount: 5,
    totalBacklinksCount: 10,
    dofollowRatio: 0.8,
    averageReferringDomainDr: 30,
  });
  assert.ok(drNew < 25);
});

test('analyzeSentiment detects positive vs negative review words', () => {
  const pos = analyzeSentiment('Amazing support and great fast product!', 5);
  assert.strictEqual(pos.sentiment, 'positive');
  assert.ok(pos.sentimentScore >= 0.7);

  const neg = analyzeSentiment('Terrible experience, broken and slow response', 1);
  assert.strictEqual(neg.sentiment, 'negative');
  assert.ok(neg.sentimentScore <= 0.35);
});

test('auditNapConsistency flags address and phone mismatches', () => {
  const canonical = {
    name: 'Rivue Inc.',
    address: '100 Market St, SF, CA',
    phone: '555-0100',
    website: 'https://rivue.io',
  };
  const listings = [
    {
      platform: 'Google',
      name: 'Rivue Inc.',
      address: '100 Market St, SF, CA',
      phone: '555-0100',
      website: 'https://rivue.io',
    },
    {
      platform: 'Yelp',
      name: 'Rivue Inc.',
      address: '100 Market Street, SF, CA',
      phone: '555-9999', // discrepancy
      website: 'https://rivue.io',
    },
  ];

  const audit = auditNapConsistency(canonical, listings);
  assert.strictEqual(audit.syncedCount, 1);
  assert.strictEqual(audit.discrepancies.length, 1);
  assert.ok(audit.napScore < 100 && audit.napScore > 80);
});
