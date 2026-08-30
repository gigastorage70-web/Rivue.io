# RIVUE — Build Specification for Antigravity

> **Rivue** (pronounced "riv-yoo" — *rival* + *view*) is the codename for an all-in-one SEO, competitor intelligence, PR, and social growth platform delivered as a Chrome Extension + web dashboard. This document is the build brief for Antigravity to scaffold, architect, and implement the product end-to-end.

---

## 1. Product Vision

Rivue consolidates the paid capabilities of **Ahrefs**, **Semrush**, and **Mangools** into a single Chrome extension + companion web app, so a user never has to leave their browser to:

- Research keywords and SERPs
- Audit a site technically and on-page
- Track backlinks and build new ones
- Monitor and manage local listings/reviews
- Schedule and analyze social content
- Run a lightweight PR/outreach CRM
- Track competitors' traffic, rankings, and growth in real time

**Design principle:** every module should feel like a single pane of glass — one auth session, one credit/quota system, one data lake, many surfaces (popup, side panel, full dashboard).

---

## 2. Tech Stack (flexible + scalable by design)

| Layer | Choice | Why |
|---|---|---|
| Monorepo | **Turborepo** + **pnpm workspaces** | Shared types/UI across extension, web app, workers |
| Extension | **Manifest V3**, React 18 + TypeScript, Vite (`@crxjs/vite-plugin`) | Fast HMR, MV3-compliant, side panel + popup support |
| Web dashboard | **Next.js 15 (App Router)**, TypeScript, TailwindCSS, shadcn/ui | SSR for SEO reports, RSC for heavy data tables |
| API layer | **tRPC** (internal) + **REST/OpenAPI** (public/webhooks) | End-to-end type safety, still interoperable |
| Auth | **Clerk** or **Auth.js (NextAuth)** | Org/team accounts, SSO-ready |
| Primary DB | **PostgreSQL 16** (via **Supabase** or **Neon**) | Relational integrity for accounts, sites, campaigns |
| Time-series store | **TimescaleDB** (Postgres extension) | Rank tracking, traffic trends, social metrics over time |
| Search/analytics index | **Meilisearch** or **Elasticsearch** | Fast keyword/backlink/competitor search & filtering |
| Cache & queues | **Redis** + **BullMQ** | Rate-limited crawling jobs, scheduled social posts, digest emails |
| Crawler/renderer | **Playwright** (headless Chromium cluster) | Technical SEO audits, on-page scraping, screenshot diffing |
| SERP & web data | **Serper API** (primary), pluggable adapters for others | See §5 |
| Object storage | **Cloudflare R2** / S3 | Screenshots, exported PDFs/CSVs, media assets |
| Billing | **Stripe** (metered + tiered) | Credit-based usage (API calls, crawl pages, keywords tracked) |
| Email/outreach | **Resend** or **Postmark** + IMAP/OAuth (Gmail/Outlook) | Digital PR CRM sending & reply tracking |
| Social publishing | **Ayrshare API** or native OAuth per network (Meta, X, LinkedIn, TikTok) | Scheduling engine |
| Infra | **Docker** containers → **Kubernetes (EKS/GKE)** or **Railway/Fly.io** for MVP | Scales workers independently from web |
| Observability | **OpenTelemetry** + **Grafana/Loki**, **Sentry** | Job failures, API latency, crawl error tracking |
| CI/CD | **GitHub Actions** → Vercel (web) + Fly.io/K8s (workers) + Chrome Web Store publish action | |

**Scalability notes for Antigravity:**
- Treat every "analysis run" (site audit, competitor snapshot, keyword batch) as a **queued job**, never a synchronous request >2s.
- Partition TimescaleDB hypertables by `site_id` + time for rank/traffic history.
- Cache Serper responses (keyed by query+geo+device) in Redis for 12–24h to control API spend.
- Design the credit/quota system as its own microservice from day one — every module debits it.

---

## 3. Monorepo Structure

```
rivue/
├── apps/
│   ├── extension/          # MV3 extension (popup, side panel, content scripts)
│   ├── web/                 # Next.js dashboard
│   └── workers/             # BullMQ job processors (crawl, rank-check, social-post, email-sync)
├── packages/
│   ├── ui/                  # shared shadcn/ui component lib
│   ├── db/                  # Prisma/Drizzle schema + migrations
│   ├── serper-client/        # Typed Serper API SDK (see §5)
│   ├── scoring/              # SEO scoring, DA/PA-equivalent algorithms
│   └── types/                 # shared TS types/zod schemas
└── turbo.json
```

---

## 4. Core Feature Modules

Each module maps to a Semrush/Ahrefs/Mangools equivalent and should be built as an isolated package with its own DB tables, job types, and UI panel.

### 4.1 Keyword & SERP Intelligence *(≈ Semrush Keyword Magic, Ahrefs Keywords Explorer, Mangools KWFinder)*
- Seed keyword expansion, search volume, keyword difficulty (KD), CPC, SERP feature detection
- SERP snapshot per keyword: top 10/20 organic results, People Also Ask, related searches, ads, knowledge panel
- Powered primarily by **Serper API** `/search` endpoint (see §5)
- Fields to store per keyword: `volume`, `kd_score`, `cpc`, `competition`, `intent` (informational/commercial/transactional/navigational), `serp_features[]`, `trend[12mo]`

### 4.2 Technical Site Audit *(≈ Semrush Site Audit, Ahrefs Site Audit)*
- Playwright crawler: crawl depth config, robots.txt/sitemap parsing, JS rendering
- Checks: broken links (4xx/5xx), redirect chains, duplicate titles/meta, missing alt text, Core Web Vitals (via Lighthouse programmatic API), canonical issues, hreflang, structured data validation
- Output: health score (0–100), issue severity buckets (error/warning/notice), page-level drill-down

### 4.3 Backlink & Link Building Tool *(≈ Ahrefs Site Explorer, Semrush Backlink Analytics + Link Building Tool)*
- Backlink index: referring domains, anchor text distribution, dofollow/nofollow ratio, domain rating (custom DR-equivalent algorithm)
- Link building workflow: prospect discovery (via Serper search of niche + "write for us" / broken-link targets), outreach status kanban, link velocity chart
- Fields: `source_url`, `target_url`, `anchor_text`, `link_type`, `first_seen`, `last_seen`, `domain_rating`, `page_authority_equiv`, `spam_score`

### 4.4 Rank Tracking *(≈ all three tools)*
- Daily/weekly position checks per keyword × location × device via Serper
- Historical position graph, SERP volatility alerts, competitor position overlay

### 4.5 Competitor Analysis & Traffic Analytics *(≈ Semrush Domain Overview / Traffic Analytics, Ahrefs Competitive Analysis)*
- Domain overview: estimated organic traffic, top pages, top keywords, traffic trend
- Competitor gap analysis: keyword gap, backlink gap, content gap
- "Growth feed" — aggregates competitor's new content, new backlinks, ranking jumps, social posts into one activity timeline

### 4.6 Listing Management & Review Management *(≈ Semrush Listing Management & Review Management)*
- Sync business listings (Google Business Profile, Bing Places, Apple Maps, Yelp) via their respective APIs
- NAP (Name/Address/Phone) consistency checker
- Review aggregation dashboard with sentiment scoring, AI-drafted reply suggestions, response-time SLA tracking

### 4.7 Social Scheduling Engine *(≈ Semrush Social Media Toolkit)*
- Multi-network post composer + calendar (Instagram, X, LinkedIn, TikTok, Facebook)
- Competitor social tracking: posting frequency, engagement rate, follower growth trend
- Ad library snapshot (where APIs expose it, e.g. Meta Ad Library) for competitor ad monitoring

### 4.8 Digital PR CRM *(≈ Semrush Link Building Tool & Media Monitoring, PR-specific)*
- Journalist/blogger database: beat, outlet, past coverage, contact info, relevance score against a campaign's keywords/topics
- Integrated outreach inbox (OAuth Gmail/Outlook), templated sequences, open/reply tracking
- Media monitoring: brand mention alerts across web + news via Serper News search, sentiment tagging

### 4.9 Unified Dashboard
- Cross-module "Site Health Score", credit usage meter, weekly digest email, exportable PDF/white-label reports

---

## 5. Serper API Integration

Serper (`https://serper.dev`) is the primary data engine for anything requiring live SERP truth. Build a typed client package (`packages/serper-client`) wrapping these endpoints:

| Endpoint | Used by module | Key request params | Key response fields to persist |
|---|---|---|---|
| `POST /search` | Keyword Intelligence, Rank Tracking | `q`, `gl` (country), `hl` (language), `location`, `num`, `page` | `organic[].position`, `organic[].link`, `organic[].title`, `organic[].snippet`, `peopleAlsoAsk[]`, `relatedSearches[]`, `answerBox`, `knowledgeGraph`, `ads[]` |
| `POST /news` | Media Monitoring, PR CRM | `q`, `gl`, `tbs` (date range) | `news[].title`, `.link`, `.source`, `.date`, `.snippet` |
| `POST /images` | Content/PR asset discovery | `q` | `images[].imageUrl`, `.title`, `.source` |
| `POST /places` | Listing Management | `q`, `location` | `places[].title`, `.address`, `.rating`, `.reviewCount`, `.category`, `.phoneNumber` |
| `POST /autocomplete` | Keyword expansion | `q` | `suggestions[]` |
| `POST /webpage` (scrape) | Site Audit, Competitor content gap | `url` | `text`, `metadata`, `jsonld` |

**Derived attributes to compute from raw Serper data** (store alongside raw payload for auditability):
- `serp_feature_count` — count of PAA, featured snippet, image pack, etc. present
- `organic_ctr_estimate` — position-weighted CTR model
- `content_gap_score` — diff between competitor's ranking content structure (H1–H3, word count, entities) vs. tracked site
- `local_pack_presence` (bool) — whether Places results returned for a query
- `serp_volatility_index` — position variance across daily snapshots

**Implementation guidance for Antigravity:**
- Wrap every Serper call in a Redis-cached, BullMQ-queued job (`serper:search`, `serper:news`, etc.) — never call it inline from a UI request.
- Normalize all responses into a canonical `SerpSnapshot` Postgres table (`id`, `query`, `geo`, `device`, `raw_json` (jsonb), `fetched_at`) so the raw data is replayable if parsing logic changes.
- Respect Serper rate limits/credit costs by batching keyword checks and de-duplicating identical `(query, geo, device)` tuples within a 24h window.
- Environment variable: `SERPER_API_KEY`, injected only into worker processes, never the extension or client bundle.

---

## 6. Extension ↔ Backend Data Flow

1. User browses a page → content script extracts on-page signals (title, meta, headings, canonical, word count).
2. Extension popup/side panel calls the web app's tRPC API (authenticated via shared session token) requesting a Rivue Score for the current URL.
3. Backend checks cache → if stale, enqueues a Site Audit + Serper snapshot job → returns job ID.
4. Extension polls/streams (via WebSocket or SSE) for job completion → renders inline overlay with score, top issues, competitor rank comparison.
5. All events (audits run, keywords tracked, links found) are written to the activity feed consumed by the Unified Dashboard.

---

## 7. Data Model (core tables, high-level)

```
organizations, users, sites, credits_ledger
keywords, serp_snapshots, rank_history
backlinks, referring_domains, link_prospects
audit_runs, audit_issues, page_metrics
listings, reviews
social_accounts, social_posts, social_metrics
journalists, outreach_campaigns, outreach_messages
mentions (media monitoring)
```

Use **Prisma** or **Drizzle ORM** with the Postgres/Timescale split: transactional tables in Prisma-managed Postgres, high-volume time-series (`rank_history`, `social_metrics`, `page_metrics`) as Timescale hypertables queried via raw SQL/Drizzle for performance.

---

## 8. Suggested Build Phases

1. **Foundation** — monorepo, auth, billing/credits, Postgres schema, Serper client package
2. **MVP core** — Keyword Intelligence + Rank Tracking + basic Site Audit (highest perceived value, fastest to demo)
3. **Extension shell** — popup/side panel UI, on-page overlay, content script signal extraction
4. **Competitor & Backlinks** — domain overview, gap analysis, link prospecting
5. **Listings & Reviews** — GBP integration, review dashboard
6. **Social Scheduling** — composer, calendar, competitor tracking
7. **Digital PR CRM** — journalist DB, outreach inbox, media monitoring
8. **Polish** — white-label PDF reports, credit system tuning, Chrome Web Store submission, load testing workers at scale

---

## 9. Iterative Build → Test → Repeat Methodology

Antigravity must not treat any phase in §8 as "done" after a single pass. Every module follows a closed loop until it hits a defined quality bar — ship-and-forget is not acceptable for this build.

**The loop, per module/feature:**

1. **Build** — implement the smallest complete slice of the feature (e.g. "keyword volume + KD for a single query").
2. **Self-test** — run automated checks before it ever reaches a human:
   - Unit tests for scoring/parsing logic (`packages/scoring`, `packages/serper-client`)
   - Integration tests hitting a mocked Serper/Playwright response fixture
   - E2E test (Playwright) covering the actual extension popup/side-panel flow
   - Visual regression check on the UI component (Chromatic or Percy)
3. **Evaluate against acceptance criteria** — each feature in §4 should have a written "definition of solid" before build starts, e.g.:
   - Site Audit: crawl of a 500-page site completes in under N minutes with zero unhandled crawler errors
   - Keyword Intelligence: SERP data cache hit rate above X%, KD score within an acceptable variance of a benchmark set
   - Rank Tracking: zero missed daily checks across a sample of tracked keywords over a 7-day soak test
4. **Identify gaps/bugs/UX friction** — log every failure, ambiguous UI moment, or slow query as an issue, not a silent fix.
5. **Repeat** — re-implement/refine and re-run the full loop (steps 1–4) until acceptance criteria pass cleanly and no open issues remain for that slice.
6. **Only then** move to the next slice/module in the phase plan (§8).

**Rules for this loop:**
- Never mark a phase complete in project tracking until its modules have passed at least one full test → fix → retest cycle with zero known critical/major issues.
- Treat performance and data-accuracy regressions as blocking, on the same level as functional bugs — a wrong KD score or a broken rank chart is as serious as a crash.
- Keep a running "known issues" log per module (`/docs/status/<module>.md`) so each loop iteration has a clear starting point instead of re-discovering the same problems.
- Where a feature depends on live third-party data (Serper, social APIs, Places), test against both mocked fixtures (fast, deterministic) and a small set of live calls (to catch real-world response drift) before calling it stable.
- Favor several short loops over one long one — ship a thin vertical slice, harden it, then widen scope.

---

## 10. UI/UX Design Principles — Built for Non-Experts

Rivue's audience includes users who are not SEO/marketing specialists. The interface must make dense, technical data feel approachable at a glance, without dumbing down the depth available to power users.

**Core principles:**

- **Progressive disclosure** — show the plain-English headline first (e.g. "Your site's health: 82/100 — Good"), with drill-downs available on click/tap rather than dumping raw metrics upfront.
- **Consistent visual language** — a single color/severity system used everywhere (e.g. green = healthy, amber = needs attention, red = critical) across Site Audit, Rank Tracking, Backlinks, and Reviews so the user only has to learn it once.
- **Plain-language labels first, jargon second** — display "How easy this keyword is to rank for" as the primary label, with "Keyword Difficulty (KD)" as the secondary/technical tag beside it.
- **Empty and loading states that teach** — while a crawl/job is running, show what's happening in plain terms ("Checking your pages for broken links…") rather than a bare spinner.
- **Mobile-safe, dense-but-breathable layouts** in the side panel — the extension surface is small, so prioritize the 1–2 numbers that matter most per screen before offering "View full report" into the web dashboard.

### 10.1 Mandatory Info-Icon Pattern for Technical Terms

Every technical/industry term surfaced anywhere in the UI (extension popup, side panel, and web dashboard) must ship with an inline **info icon (ⓘ)** immediately next to it. This mirrors the pattern used by Ahrefs, Semrush, and Mangools, and is a **non-negotiable component-level requirement**, not an optional enhancement.

**Behavior spec:**
- Tapping/clicking or hovering (desktop) the ⓘ icon opens a small, non-blocking tooltip/popover — never a full modal — anchored next to the term.
- Popover content structure: **1)** a one-sentence plain-English definition, **2)** why it matters / how to read a good vs. bad value, **3)** optional "Learn more" link to a longer help doc for users who want depth.
- Dismisses on outside click/tap, on `Esc`, or automatically on scroll (mobile/side panel) — it must never block the user from continuing their analysis.
- Must be keyboard-accessible (focusable, `aria-describedby` linking the icon to its tooltip content) and screen-reader friendly.

**Implementation guidance for Antigravity:**
- Build one shared component in `packages/ui` — e.g. `<InfoTooltip term="kd_score" />` — that pulls its copy from a single centralized glossary source (`packages/ui/glossary.ts` or a CMS-backed table) rather than hardcoding text per instance. This keeps definitions consistent everywhere the term appears and lets copy be updated in one place.
- Seed the glossary with every term introduced in §4, at minimum: Keyword Difficulty (KD), Search Volume, CPC, Search Intent, SERP Feature, Domain Rating (DR-equivalent), Referring Domain, Anchor Text, Dofollow/Nofollow, Spam Score, Core Web Vitals, Canonical Tag, Hreflang, NAP Consistency, Sentiment Score, Engagement Rate, Domain Overview, Content Gap, SERP Volatility.
- Add new glossary entries as part of the "definition of solid" (§9) for any feature that introduces a new metric — a feature isn't complete until its jargon has an info icon and glossary entry.
- Track glossary coverage with a simple lint/test check that flags any new metric label rendered without a paired `<InfoTooltip>`.

---

## 11. Non-Functional Requirements

- **Scalability**: workers must scale horizontally and independently from the web app; all Serper/Playwright jobs are queue-driven.
- **Rate limiting**: per-org quota middleware in front of every credit-consuming endpoint.
- **Security**: encrypt OAuth tokens (Gmail/Outlook/social) at rest; strict MV3 CSP; least-privilege extension permissions (`activeTab`, not broad `<all_urls>` unless justified per feature).
- **Compliance**: GDPR-ready data export/delete for org data; respect target sites' `robots.txt` in the crawler.
- **Extensibility**: SERP data provider should be swappable behind an interface (`SerpProvider`) so Serper can be supplemented/replaced later without touching module logic.

---

*End of build brief. Antigravity should treat §5 (Serper integration) and §7 (data model) as the contracts to implement first, since nearly every module in §4 depends on them — and should treat §9 (iterative build-test-repeat loop) and §10 (UI/UX + info-icon pattern) as binding process requirements for every module, not optional polish.*
