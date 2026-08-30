# Rivue — All-in-One Growth & Competitor Platform

> **Rivue** (*rival* + *view*) consolidates the paid capabilities of **Ahrefs**, **Semrush**, and **Mangools** into a single Chrome Extension + companion Next.js web dashboard.

---

## Features

- **Keyword & SERP Intelligence**: Seed keyword expansion, KD calculation, volume trends, and position-decay CTR modeling.
- **Technical Site Audit**: Proprietary 0–100 health scoring, Lighthouse Core Web Vitals, and step-by-step fix guides.
- **Backlinks & Outreach**: Domain Rating (DR), unique referring domains, natural anchor text distribution, and Kanban outreach CRM.
- **Rank Tracking**: Multi-device daily position tracking with a 0–10 SERP volatility turbulence index.
- **Competitor Intelligence**: Head-to-head domain comparison, Keyword Gap matrix, and real-time Growth Feed.
- **Listing & Review Management**: 4-platform NAP consistency auditor (GBP, Bing, Apple, Yelp), sentiment analysis, and 1-click AI reply drafter.
- **Social Scheduling Engine**: Multi-platform post composer (X, LinkedIn, Instagram, Facebook) and competitor ad creative tracking.
- **Digital PR CRM**: Curated tech journalist directory, outreach sequencer, and real-time brand mention monitoring via Serper News.
- **Manifest V3 Chrome Extension**: Action popup for 1-click health pulse and persistent Side Panel inspector for on-page SEO signals, heading hierarchy tree (`<h1>`–`<h6>`), and competitor comparisons.

---

## Monorepo Structure

```
rivue/
├── apps/
│   ├── web/                    # Next.js 15 Companion Web Dashboard (9 Core Modules)
│   ├── extension/              # Manifest V3 Chrome Extension (Popup, Side Panel, Content Script)
│   └── workers/                # Background Job Queue Engine
├── packages/
│   ├── types/                  # Shared TypeScript types & Zod validation schemas
│   ├── serper-client/          # Typed Serper.dev SDK + Mock Fallback Fixtures + Derived Metrics
│   ├── scoring/                # Site Health, KD, DR, Spam, Sentiment, NAP algorithms
│   ├── ui/                     # Shared UI components + Centralized Glossary + <InfoTooltip>
│   └── db/                     # Data models, seed data & repository singleton
├── docs/                       # Module status & QA Acceptance logs
└── tests/                      # Automated unit test suite
```

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Web Dashboard Locally
```bash
npm run dev:web
```
Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### 3. Build the Chrome Extension
```bash
npm run build:ext
```
The compiled extension will be in `apps/extension/dist`.

### 4. Load the Extension in Chrome
1. Go to `chrome://extensions` in Google Chrome.
2. Toggle **Developer mode** to **ON** (top-right).
3. Click **Load unpacked** and select `apps/extension/dist`.

### 5. Run Automated Tests
```bash
npx tsx --test tests/*.test.ts
```

---

## Deployment on Vercel

1. Push this repository to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. Vercel will automatically detect `vercel.json` and deploy `apps/web`.
