# The Live-Data Standard
### A reusable spec for building production-grade, deployment-ready dashboards that never silently run on fake data

> Use this file as a **drop-in instruction set** for any AI coding agent (Antigravity, Claude Code, Cursor, etc.) at the start of any dashboard/data-tool project — SEO tools, analytics platforms, admin panels, internal reporting tools, anything that shows numbers derived from an external source or a pipeline. It is tool-agnostic and stack-agnostic on purpose.

---

## 1. The Problem This Solves

The single most common failure in AI-built dashboards is this pattern:

1. Agent builds the UI first, using realistic-looking placeholder numbers "to visualize the design."
2. The real data pipeline (crawler, API call, analyzer, database query) is either never wired in, or is wired in loosely.
3. When the real pipeline fails, times out, hits a rate limit, or returns something unexpected, the code **silently falls back** to a default/sample value instead of surfacing an error.
4. The dashboard *looks* finished and functional. Every demo works. But the numbers never actually change based on real input — because they were never truly connected, or the fallback path is doing all the work.
5. This isn't caught because nothing in the build process **requires proof** that a number is live.

This document exists to make that failure structurally impossible, not just "less likely."

---

## 2. The Core Rule (read this first)

> **A metric is not "done" until it has been proven to change when its input changes.**
> If you cannot show two different inputs producing two different, correctly-different outputs, the feature is not built — it is a mockup wearing a UI.

Every rule below exists in service of this one sentence.

---

## 3. Mandatory Build Order

Agents must build in this order, and are not permitted to skip ahead:

1. **Data source proof-of-life** — a raw script/CLI call that hits the real source (API, crawler, DB, file) and prints raw output to a terminal/log. No UI. No formatting. Just: does real data come back?
2. **Pipeline/transform layer** — the code that turns raw data into the shape the UI needs (scoring, aggregation, normalization). Tested against the raw output from step 1, with assertions on shape and value ranges.
3. **API/data-access layer** — the internal endpoint or function the UI will call. Tested independently of the UI (via curl/Postman/unit test), confirming it returns different results for different inputs.
4. **UI components** — built last, and built to consume the real API/data-access layer from day one. **Never build UI against inline placeholder objects that later get "swapped" for real data** — wire it live from the first commit, even if it's rough.
5. **Polish and styling** — visual refinement happens only after the above four layers are proven live end-to-end.

**Why this order matters:** every step after step 1 has something real to check itself against. Building UI first removes that check and is exactly how static dashboards happen.

---

## 4. The Anti-Mock-Data Contract

These rules are non-negotiable defaults for every project unless the user explicitly asks for a UI-only mockup/prototype phase (and even then, that must be labeled and time-boxed).

- **No hardcoded numbers in components.** Any numeric literal in a UI component that isn't a formatting constant (e.g. `100` for a percentage denominator) is a defect.
- **No silent fallback to sample data.** If a live data source fails, the correct behaviors are, in order of preference:
  1. Retry with backoff (for transient errors)
  2. Surface a visible error/empty state in the UI ("Couldn't fetch data — retry")
  3. Throw and log the error server-side
  - Silently returning a default number so the UI "still looks good" is **never** an acceptable behavior in production code paths.
- **Mock data may only exist behind an explicit switch.** e.g. `USE_MOCK_DATA=true` in `.env.local`, used only for offline unit tests or Storybook/component previews — never as the default runtime behavior, and never able to leak into a deployed environment (fail the build if this flag is `true` in a production build).
- **No demo/seed data disguised as live data.** Seed data for local dev must be visually or textually distinguishable (e.g. domains like `example-demo.test`, obviously placeholder company names) so it can never be mistaken for a real result in a screenshot or review.
- **Caching must be invalidatable and inspectable.** Every cached value must carry a timestamp and TTL visible in logs/dev tools — "why hasn't this number changed in 3 days" must be answerable in one query, not a mystery.

---

## 5. Data Provenance: Tag Every Number

Every metric object flowing from backend to frontend should carry a provenance tag:

```json
{
  "metric": "organic_traffic_estimate",
  "value": 18400,
  "source": "live",       // "live" | "cached" | "mock"
  "fetched_at": "2026-09-04T10:15:00Z",
  "stale_after": "2026-09-05T10:15:00Z"
}
```

**Rules attached to this tag:**
- `source: "mock"` must never render in a production build. Add a lint/CI check that fails the build if any API response tagged `mock` reaches a non-dev environment.
- `source: "cached"` should be visually indicated in the UI when data is older than a sensible threshold (e.g. a small "as of 3 hours ago" label) so users are never misled into thinking a stale number is real-time.
- Log the provenance breakdown per dashboard load in your observability tool (e.g. "82% live, 18% cached, 0% mock") so a regression toward mock/stale data is visible on a monitoring dashboard, not just discovered by a user complaint.

---

## 6. The Differential Smoke Test (the single most important test you can write)

Before any module is marked complete, run this test and require it to pass:

> Feed the pipeline **two clearly different, real inputs** (e.g. two different real websites, two different real keywords, two different real accounts) and assert that the outputs are **not identical**, and that they differ in a way that makes sense given the known differences between the inputs.

```
Example (SEO dashboard):
  analyze("stripe.com")  → traffic: X, backlinks: Y, health_score: Z
  analyze("example.com") → traffic: A, backlinks: B, health_score: C
  ASSERT X != A, Y != B, Z != C
  ASSERT the direction of difference makes sense
         (stripe.com should show meaningfully higher traffic/backlinks
          than a near-empty placeholder domain)
```

If this test can pass while the underlying pipeline is stubbed or broken, the test itself is broken — tighten it until a stub genuinely cannot fake its way through.

Add this as a required, named CI test (`test:differential-smoke`) for every metric-producing module, run on every PR that touches that module.

---

## 7. Error Handling Standard

| Failure type | Required behavior |
|---|---|
| External API down/timeout | Retry (exponential backoff, max 3), then show explicit error state, log to monitoring |
| Rate limit hit | Queue/delay the job, show "processing" state, never fabricate a result |
| Crawler blocked (robots.txt, 403, CAPTCHA) | Mark that specific data point as "unavailable" with a reason shown to the user, don't zero-fill or default-fill |
| Malformed/unexpected API response shape | Fail the parse loudly in logs, do not coerce into a "reasonable-looking" default |
| Partial data (e.g. 8 of 10 keywords succeeded) | Show the 8 real results, clearly mark the 2 as failed/pending — never backfill the missing 2 with estimates presented as real data |

**Anti-pattern to explicitly forbid in agent instructions:**
```js
// FORBIDDEN
try {
  const data = await fetchLiveData(url);
  return data;
} catch (e) {
  return DEFAULT_SAMPLE_DATA; // <-- this line is the entire bug class
}
```
```js
// REQUIRED PATTERN
try {
  const data = await fetchLiveData(url);
  return { ...data, source: "live" };
} catch (e) {
  logger.error("live fetch failed", { url, error: e });
  throw new DataFetchError(url, e); // surfaced to UI as an error/empty state
}
```

---

## 8. Production-Grade Architecture Checklist (stack-agnostic)

Use this for any dashboard project, regardless of tech stack:

**Data layer**
- [ ] Real data source(s) identified and credentialed (API keys, crawler targets, DB connections) — no source is "TBD" by the time UI work starts
- [ ] Raw responses are logged/stored for at least a short retention window, for debugging and replayability
- [ ] Rate limits and quotas for every external API are documented and enforced in code (not just "hoped for")
- [ ] Every data-fetching function has a unit test asserting it fails loudly on error, not silently

**Processing layer**
- [ ] Transform/scoring logic is pure functions, unit-testable independent of network calls
- [ ] Jobs that take >2 seconds are queued (background worker), not run inline in a request handler
- [ ] Idempotency: re-running the same job with the same input doesn't corrupt or duplicate data

**API layer**
- [ ] Every endpoint has an integration test hitting a real (or realistically faked-at-the-network-boundary) dependency, not a stubbed service function
- [ ] Errors return structured error responses (status code + machine-readable error code + human message), not a `200` with fake data
- [ ] Auth/permissions checked server-side on every data-returning endpoint, never trusted from client state alone

**UI layer**
- [ ] Every component that displays a metric has a loading state, an error state, and an empty state — not just a "happy path" state
- [ ] No component imports a hardcoded sample object as its default prop value
- [ ] Provenance (§5) is visible somewhere in the UI for any estimated/modeled/cached number
- [ ] Responsive and accessible (keyboard nav, screen-reader labels, contrast) at production bar, not "looks fine on my monitor"

**Deployment readiness**
- [ ] Environment variables documented in a `.env.example`, with production secrets never committed
- [ ] `USE_MOCK_DATA` (or equivalent) hard-fails the production build if set to true
- [ ] Health-check endpoint exists and is wired to uptime monitoring
- [ ] Logging/observability (errors, latency, provenance breakdown) is live before first real user, not added after launch
- [ ] Load/soak test run against realistic data volume (not 3 sample rows) before calling it launch-ready
- [ ] Rollback plan exists (previous deploy can be restored in under N minutes)

---

## 9. The "Proof of Life" Demo Requirement

Before any agent (or human) reports a data-driven feature as complete, it must produce a **proof-of-life artifact** — not just say "it's done." Acceptable forms:

- A terminal recording/log snippet showing two different real inputs producing two different real outputs
- A short screen recording of the dashboard updating after a real underlying change (e.g. re-running an audit after fixing a broken link, and watching the health score change)
- Raw JSON dumps of at least 2 distinct live API/crawler responses, saved to `/docs/proof-of-life/<module>.json`

**Reviewer's one-question test:** *"If I changed the input right now, would this number change — and can you show me it changing?"* If the honest answer is "no" or "I'm not sure," the feature is not done, regardless of how polished the UI looks.

---

## 10. Reusable Agent Instruction Block

Paste this block into the system prompt / task brief of any future dashboard project to pre-empt this failure mode:

```
DATA INTEGRITY REQUIREMENTS (apply to this entire project):

1. Build data pipelines before UI. Prove each data source returns real,
   input-dependent output via a raw script/log BEFORE writing any UI
   component that displays it.

2. Never hardcode metric values in UI components. Never silently fall
   back to sample/default data when a live call fails — surface an
   explicit error or empty state instead.

3. Every metric object must carry a `source` field ("live" | "cached" |
   "mock"). Builds must fail if `source: "mock"` can reach production.

4. Before marking any metric-producing feature complete, run a
   differential smoke test: feed it two different real inputs and
   confirm the outputs are different and directionally correct.
   Do not report a feature as done without this test passing.

5. If you cannot get live data working (missing API key, blocked
   crawler, etc.), say so explicitly and stop — do not paper over
   the gap with plausible-looking static numbers.

6. Follow the build order: data source proof-of-life → transform
   layer → API layer → UI layer → polish. Do not build UI against
   placeholder objects "to be swapped later."
```

---

## 11. Definition of Done (attach to every dashboard feature)

A feature is complete only when **all** of the following are true:

- [ ] Differential smoke test passes (§6)
- [ ] No hardcoded numeric literals remain in the component tree
- [ ] Error/empty/loading states are implemented and manually verified
- [ ] Provenance tagging is present and correctly reflects live vs. cached vs. mock
- [ ] Proof-of-life artifact exists in `/docs/proof-of-life/`
- [ ] The reviewer's one-question test (§9) gets an honest "yes"

---

*This standard is intended to be copied, adapted, and reused across every dashboard/data-tool project — SEO tools, internal analytics, admin panels, or anything else where "is this number real" is a question that must always have a confident answer.*
