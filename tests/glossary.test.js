import test from 'node:test';
import assert from 'node:assert';

import { GLOSSARY_DICTIONARY } from '../packages/ui/src/glossary.js';

const REQUIRED_TERMS = [
  'kd_score',
  'search_volume',
  'cpc',
  'search_intent',
  'serp_features',
  'domain_rating',
  'referring_domains',
  'anchor_text',
  'dofollow_ratio',
  'spam_score',
  'site_health',
  'core_web_vitals',
  'canonical_tag',
  'hreflang',
  'nap_consistency',
  'sentiment_score',
  'engagement_rate',
  'content_gap',
  'serp_volatility',
  'organic_ctr',
  'link_velocity',
  'media_mentions',
];

test('Glossary dictionary contains 100% of required SEO and marketing terms', () => {
  for (const termKey of REQUIRED_TERMS) {
    const entry = GLOSSARY_DICTIONARY[termKey];
    assert.ok(entry !== undefined, `Missing glossary entry for ${termKey}`);
    assert.ok(entry.term && entry.term.length > 0, `Term label missing for ${termKey}`);
    assert.ok(entry.plainEnglishName && entry.plainEnglishName.length > 0, `Plain English name missing for ${termKey}`);
    assert.ok(entry.shortDefinition && entry.shortDefinition.length > 0, `Definition missing for ${termKey}`);
    assert.ok(entry.whyItMatters && entry.whyItMatters.length > 0, `Why it matters missing for ${termKey}`);
    assert.ok(entry.benchmarkGuide !== undefined, `Benchmark guide missing for ${termKey}`);
  }
});
