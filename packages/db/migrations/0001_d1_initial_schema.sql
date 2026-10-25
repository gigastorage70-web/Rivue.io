-- =============================================================================
-- RIVUE — Cloudflare D1 SQLite Schema Migration 0001
-- =============================================================================

-- 1. Organizations & Teams
CREATE TABLE IF NOT EXISTS organizations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  plan TEXT NOT NULL DEFAULT 'scale',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Owner',
  api_token TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (org_id) REFERENCES organizations(id)
);

CREATE TABLE IF NOT EXISTS sites (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  domain TEXT NOT NULL UNIQUE,
  title TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (org_id) REFERENCES organizations(id)
);

-- 2. SERP Snapshots & Raw Responses (Replayable Data Lake)
CREATE TABLE IF NOT EXISTS serp_snapshots (
  id TEXT PRIMARY KEY,
  query TEXT NOT NULL,
  geo TEXT NOT NULL DEFAULT 'us',
  device TEXT NOT NULL DEFAULT 'desktop',
  raw_json TEXT NOT NULL,
  provenance_source TEXT NOT NULL, -- 'live' | 'cached' | 'mock'
  fetched_at TEXT NOT NULL,
  stale_after TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_serp_lookup ON serp_snapshots(query, geo, device);

-- 3. Keywords & Intelligence
CREATE TABLE IF NOT EXISTS keywords (
  id TEXT PRIMARY KEY,
  site_id TEXT,
  keyword TEXT NOT NULL,
  volume INTEGER NOT NULL DEFAULT 0,
  kd_score INTEGER NOT NULL DEFAULT 0,
  cpc REAL NOT NULL DEFAULT 0.0,
  competition REAL NOT NULL DEFAULT 0.0,
  intent TEXT NOT NULL DEFAULT 'informational',
  serp_features_json TEXT,
  trend_json TEXT,
  provenance_source TEXT NOT NULL,
  fetched_at TEXT NOT NULL,
  stale_after TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_keywords_kw ON keywords(keyword);

-- 4. Technical Site Audits & Issues
CREATE TABLE IF NOT EXISTS audit_runs (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  target_url TEXT NOT NULL,
  health_score INTEGER NOT NULL,
  previous_score INTEGER,
  crawled_pages_count INTEGER NOT NULL DEFAULT 1,
  errors_count INTEGER NOT NULL DEFAULT 0,
  warnings_count INTEGER NOT NULL DEFAULT 0,
  notices_count INTEGER NOT NULL DEFAULT 0,
  passed_checks_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'completed',
  core_web_vitals_json TEXT NOT NULL,
  issues_json TEXT NOT NULL,
  raw_signals_json TEXT,
  provenance_source TEXT NOT NULL,
  started_at TEXT NOT NULL,
  completed_at TEXT NOT NULL,
  stale_after TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_target ON audit_runs(target_url, started_at);

CREATE TABLE IF NOT EXISTS audit_issues (
  id TEXT PRIMARY KEY,
  audit_run_id TEXT NOT NULL,
  code TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT NOT NULL,
  category TEXT NOT NULL,
  impact TEXT,
  how_to_fix TEXT,
  affected_urls_count INTEGER NOT NULL DEFAULT 1,
  sample_urls_json TEXT,
  FOREIGN KEY (audit_run_id) REFERENCES audit_runs(id) ON DELETE CASCADE
);

-- 5. Rank Tracking & Historical Performance
CREATE TABLE IF NOT EXISTS rank_history (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  keyword TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT 'United States',
  device TEXT NOT NULL DEFAULT 'desktop',
  position INTEGER NOT NULL,
  previous_position INTEGER,
  best_position INTEGER,
  search_volume INTEGER NOT NULL DEFAULT 0,
  ranking_url TEXT,
  competitor_positions_json TEXT,
  recorded_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_rank_kw ON rank_history(keyword, site_id);

-- 6. Backlinks & Referring Domains
CREATE TABLE IF NOT EXISTS backlinks (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  source_url TEXT NOT NULL,
  target_url TEXT NOT NULL,
  anchor_text TEXT NOT NULL,
  link_type TEXT NOT NULL DEFAULT 'dofollow',
  domain_rating INTEGER NOT NULL DEFAULT 0,
  page_authority INTEGER NOT NULL DEFAULT 0,
  spam_score INTEGER NOT NULL DEFAULT 0,
  first_seen TEXT NOT NULL,
  last_seen TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS referring_domains (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  domain TEXT NOT NULL,
  domain_rating INTEGER NOT NULL DEFAULT 0,
  backlinks_count INTEGER NOT NULL DEFAULT 0,
  dofollow_count INTEGER NOT NULL DEFAULT 0,
  nofollow_count INTEGER NOT NULL DEFAULT 0,
  ip_address TEXT
);

CREATE TABLE IF NOT EXISTS link_prospects (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  domain TEXT NOT NULL,
  target_url TEXT NOT NULL,
  opportunity_type TEXT NOT NULL,
  domain_rating INTEGER NOT NULL DEFAULT 0,
  relevance_score INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'uncontacted',
  contact_email TEXT
);

-- 7. Credits & Billing Ledger
CREATE TABLE IF NOT EXISTS credits_ledger (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  module TEXT NOT NULL,
  credits_deducted INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  description TEXT NOT NULL,
  user_id TEXT,
  timestamp TEXT NOT NULL
);

-- 8. Listings & Reviews
CREATE TABLE IF NOT EXISTS listings (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  platform TEXT NOT NULL,
  business_name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  website TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'synced',
  nap_match INTEGER NOT NULL DEFAULT 1,
  last_synced TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  listing_id TEXT NOT NULL,
  platform TEXT NOT NULL,
  author TEXT NOT NULL,
  rating REAL NOT NULL,
  text TEXT NOT NULL,
  sentiment TEXT NOT NULL DEFAULT 'positive',
  response_text TEXT,
  response_status TEXT NOT NULL DEFAULT 'none',
  published_at TEXT NOT NULL
);

-- 9. Social Scheduling & Ad Library
CREATE TABLE IF NOT EXISTS social_posts (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  content TEXT NOT NULL,
  platforms_json TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  scheduled_for TEXT,
  author TEXT NOT NULL,
  created_at TEXT NOT NULL
);

-- 10. Digital PR & Outreach CRM
CREATE TABLE IF NOT EXISTS journalists (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  outlet TEXT NOT NULL,
  beat TEXT NOT NULL,
  email TEXT NOT NULL,
  relevance_score INTEGER NOT NULL DEFAULT 70,
  pitch_status TEXT NOT NULL DEFAULT 'uncontacted',
  last_contacted_at TEXT
);

-- 11. Provenance Telemetry & Observability
CREATE TABLE IF NOT EXISTS provenance_telemetry (
  id TEXT PRIMARY KEY,
  endpoint TEXT NOT NULL,
  metric_key TEXT NOT NULL,
  source TEXT NOT NULL, -- 'live' | 'cached' | 'mock'
  duration_ms INTEGER NOT NULL,
  cache_hit INTEGER NOT NULL DEFAULT 0,
  timestamp TEXT NOT NULL,
  metadata_json TEXT
);

CREATE INDEX IF NOT EXISTS idx_telemetry_source ON provenance_telemetry(source, timestamp);
