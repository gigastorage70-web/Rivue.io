'use client';

import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  RefreshCw,
  Zap,
  Globe,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import {
  MetricCard,
  ProgressRing,
  Card,
  Badge,
  Button,
  Tabs,
  InfoTooltip,
} from '@rivue/ui';
import { SEED_SITE_AUDIT } from '@rivue/db';
import { calculateSiteHealthScore } from '@rivue/scoring';

export default function SiteAuditPage() {
  const [targetUrl, setTargetUrl] = useState('https://rivue.io');
  const [audit, setAudit] = useState(SEED_SITE_AUDIT);
  const [isCrawling, setIsCrawling] = useState(false);
  const [activeSeverityFilter, setActiveSeverityFilter] = useState('all');

  const handleStartAudit = async () => {
    setIsCrawling(true);
    setTimeout(() => {
      const newScore = calculateSiteHealthScore({
        totalPages: 148,
        errorsCount: 4,
        warningsCount: 16,
        noticesCount: 28,
        coreWebVitalsPassRate: 0.92,
      });
      setAudit({
        ...audit,
        id: `audit_${Date.now()}`,
        targetUrl,
        healthScore: newScore,
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      });
      setIsCrawling(false);
    }, 1200);
  };

  const filteredIssues = audit.issues.filter((issue) => {
    if (activeSeverityFilter === 'all') return true;
    return issue.severity === activeSeverityFilter;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header & Crawler Launcher */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="cyan" size="sm">Technical Site Audit</Badge>
              <span className="text-xs text-slate-400">Playwright Crawler + Lighthouse CWV Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Technical Audit & Core Web Vitals
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Comprehensive crawlability check, broken link detection, canonical validation, and speed benchmarks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Globe className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className="pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none w-56 font-mono"
              />
            </div>
            <Button
              onClick={handleStartAudit}
              isLoading={isCrawling}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              {isCrawling ? 'Crawling...' : 'Rerun Audit'}
            </Button>
          </div>
        </div>
      </div>

      {/* Top Health Overview Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/30 border border-slate-800 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Health Gauge */}
          <div className="md:col-span-4 flex items-center justify-center sm:justify-start gap-5 border-b md:border-b-0 md:border-r border-slate-800/80 pb-6 md:pb-0 md:pr-6">
            <ProgressRing
              value={audit.healthScore}
              size={135}
              strokeWidth={12}
              label="HEALTH SCORE"
              sublabel="GOOD STANDING"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white uppercase tracking-wide">
                  Site Health
                </span>
                <InfoTooltip term="site_health" />
              </div>
              <p className="text-xs text-slate-400 leading-snug">
                148 pages crawled. 284 checks passed cleanly.
              </p>
              <div className="pt-1">
                <Badge variant="emerald" size="sm">+7 pts vs last crawl</Badge>
              </div>
            </div>
          </div>

          {/* Severity Breakdown Buckets */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-800/50">
              <div className="flex items-center justify-between text-rose-400 mb-1">
                <span className="text-xs font-semibold uppercase">Errors</span>
                <XCircle className="w-4 h-4" />
              </div>
              <div className="text-2xl font-extrabold font-mono text-white">
                {audit.errorsCount}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Critical blockers</p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/50">
              <div className="flex items-center justify-between text-amber-400 mb-1">
                <span className="text-xs font-semibold uppercase">Warnings</span>
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="text-2xl font-extrabold font-mono text-white">
                {audit.warningsCount}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Needs attention</p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-800/50">
              <div className="flex items-center justify-between text-blue-400 mb-1">
                <span className="text-xs font-semibold uppercase">Notices</span>
                <Info className="w-4 h-4" />
              </div>
              <div className="text-2xl font-extrabold font-mono text-white">
                {audit.noticesCount}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Optimizations</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/50">
              <div className="flex items-center justify-between text-emerald-400 mb-1">
                <span className="text-xs font-semibold uppercase">Passed</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-2xl font-extrabold font-mono text-white">
                {audit.passedChecksCount}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">100% healthy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Web Vitals Suite */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white">Core Web Vitals & Speed Pulse</h2>
            <InfoTooltip term="core_web_vitals" />
          </div>
          <Badge variant="emerald" size="sm">All Vitals Passed</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-400">LCP (Loading)</span>
              <InfoTooltip term="core_web_vitals" />
            </div>
            <div className="text-xl font-bold font-mono text-emerald-400">
              {audit.coreWebVitals.lcp.value}s
            </div>
            <span className="text-[10px] text-slate-500">Benchmark: &lt; 2.5s</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-400">INP (Response)</span>
              <InfoTooltip term="core_web_vitals" />
            </div>
            <div className="text-xl font-bold font-mono text-emerald-400">
              {audit.coreWebVitals.inp.value}ms
            </div>
            <span className="text-[10px] text-slate-500">Benchmark: &lt; 200ms</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-400">CLS (Stability)</span>
              <InfoTooltip term="core_web_vitals" />
            </div>
            <div className="text-xl font-bold font-mono text-emerald-400">
              {audit.coreWebVitals.cls.value}
            </div>
            <span className="text-[10px] text-slate-500">Benchmark: &lt; 0.1</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-400">TTFB (Server)</span>
              <InfoTooltip term="core_web_vitals" />
            </div>
            <div className="text-xl font-bold font-mono text-emerald-400">
              {audit.coreWebVitals.ttfb.value}ms
            </div>
            <span className="text-[10px] text-slate-500">Benchmark: &lt; 800ms</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-400">FCP (Paint)</span>
              <InfoTooltip term="core_web_vitals" />
            </div>
            <div className="text-xl font-bold font-mono text-emerald-400">
              {audit.coreWebVitals.fcp.value}s
            </div>
            <span className="text-[10px] text-slate-500">Benchmark: &lt; 1.8s</span>
          </div>
        </div>
      </div>

      {/* Issues Drill-down Section */}
      <Card
        title="Detected Audit Issues & Fix Guidance"
        subtitle="Ranked by severity and crawlability impact"
        headerAction={
          <Tabs
            tabs={[
              { id: 'all', label: 'All Issues', count: audit.issues.length },
              { id: 'error', label: 'Errors', count: audit.errorsCount },
              { id: 'warning', label: 'Warnings', count: audit.warningsCount },
              { id: 'notice', label: 'Notices', count: audit.noticesCount },
            ]}
            activeTab={activeSeverityFilter}
            onChange={setActiveSeverityFilter}
          />
        }
      >
        <div className="space-y-4">
          {filteredIssues.map((issue) => (
            <div
              key={issue.id}
              className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <Badge
                    variant={
                      issue.severity === 'error'
                        ? 'rose'
                        : issue.severity === 'warning'
                        ? 'amber'
                        : 'slate'
                    }
                    size="sm"
                  >
                    {issue.severity.toUpperCase()}
                  </Badge>
                  <h3 className="text-sm font-bold text-white">{issue.title}</h3>
                </div>
                <span className="text-xs font-mono text-cyan-400">
                  {issue.affectedUrlsCount} URLs affected
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {issue.description}
              </p>

              {/* Fix Guidance Box */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                  <Zap className="w-3.5 h-3.5" />
                  <span>How to resolve:</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {issue.howToFix}
                </p>
                <div className="pt-1.5 flex items-center gap-2 flex-wrap text-[10px] text-slate-400 font-mono">
                  <span>Sample URL:</span>
                  {issue.sampleUrls.map((url, i) => (
                    <span key={i} className="bg-slate-800 px-2 py-0.5 rounded text-cyan-300">
                      {url}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
