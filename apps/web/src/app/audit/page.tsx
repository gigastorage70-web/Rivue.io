'use client';

import React, { useState } from 'react';
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  Info,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Zap,
  Globe,
  SlidersHorizontal,
} from 'lucide-react';
import { Card, Badge, Button, ProgressRing, Table, InfoTooltip, MetricCard } from '@rivue/ui';
import { useRivue } from '../../lib/state';

export default function SiteAuditPage() {
  const { audit, runLiveAudit, isAuditing, targetDomain, setTargetDomain } = useRivue();
  const [crawlUrlInput, setCrawlUrlInput] = useState(`https://${targetDomain}`);
  const [expandedIssue, setExpandedIssue] = useState<string | null>(audit.issues[0]?.id || null);
  const [activeSeverityTab, setActiveSeverityTab] = useState<'all' | 'error' | 'warning' | 'notice'>('all');

  const handleStartAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crawlUrlInput.trim()) return;
    const clean = crawlUrlInput.trim();
    const domain = clean.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
    setTargetDomain(domain);
    await runLiveAudit(clean);
  };

  const filteredIssues = audit.issues.filter((issue) => {
    if (activeSeverityTab === 'all') return true;
    return issue.severity === activeSeverityTab;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner / Crawler Trigger */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="emerald" size="sm">Site Audit Engine</Badge>
            <span className="text-xs text-slate-400 font-mono">Real-Time HTML & Vitals Analyzer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Technical Audit: <span className="font-mono text-cyan-400">{targetDomain}</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Live DOM crawling, 4xx/5xx defect detection, Core Web Vitals profiling, and on-page optimization.
          </p>
        </div>

        {/* Crawl URL Input Form */}
        <form onSubmit={handleStartAudit} className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            value={crawlUrlInput}
            onChange={(e) => setCrawlUrlInput(e.target.value)}
            placeholder="Enter website URL to audit..."
            className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono min-w-[260px]"
          />
          <Button type="submit" isLoading={isAuditing} leftIcon={<RefreshCw className="w-4 h-4" />}>
            {isAuditing ? 'Auditing...' : 'Start Audit'}
          </Button>
        </form>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Site Health Score"
          termKey="site_health"
          value={`${audit.healthScore}/100`}
          subtitle={audit.healthScore >= 80 ? 'Good standing' : 'Action required'}
          trend={{ value: 4, direction: 'up', label: 'vs last scan' }}
          icon={<Activity className="w-5 h-5 text-emerald-400" />}
          variant="emerald"
        />
        <MetricCard
          title="Critical Errors"
          termKey="site_health"
          value={audit.errorsCount}
          subtitle="4xx/5xx & missing meta tags"
          icon={<AlertOctagon className="w-5 h-5 text-rose-400" />}
          variant="rose"
        />
        <MetricCard
          title="Warnings"
          termKey="site_health"
          value={audit.warningsCount}
          subtitle="Missing alt tags & titles"
          icon={<AlertTriangle className="w-5 h-5 text-amber-400" />}
          variant="amber"
        />
        <MetricCard
          title="Passed Checks"
          termKey="site_health"
          value={audit.passedChecksCount}
          subtitle="Compliant technical signals"
          icon={<CheckCircle2 className="w-5 h-5 text-cyan-400" />}
          variant="cyan"
        />
      </div>

      {/* Core Web Vitals Meters */}
      <Card
        title="Core Web Vitals & Real-World User Experience"
        termKey="core_web_vitals"
        subtitle="Google ranking signals based on 2026 performance benchmarks"
      >
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-400 uppercase">
              <span>LCP (Largest Contentful)</span>
              <InfoTooltip term="core_web_vitals" />
            </div>
            <div className="text-xl font-black font-mono text-emerald-400 mt-2">
              {audit.coreWebVitals.lcp.value}s
            </div>
            <span className="text-[10px] uppercase font-bold text-emerald-400">Pass (&lt; 2.5s)</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-400 uppercase">
              <span>INP (Interaction to Next)</span>
              <InfoTooltip term="core_web_vitals" />
            </div>
            <div className="text-xl font-black font-mono text-emerald-400 mt-2">
              {audit.coreWebVitals.inp.value}ms
            </div>
            <span className="text-[10px] uppercase font-bold text-emerald-400">Pass (&lt; 200ms)</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-400 uppercase">
              <span>CLS (Layout Shift)</span>
              <InfoTooltip term="core_web_vitals" />
            </div>
            <div className="text-xl font-black font-mono text-emerald-400 mt-2">
              {audit.coreWebVitals.cls.value}
            </div>
            <span className="text-[10px] uppercase font-bold text-emerald-400">Pass (&lt; 0.1)</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-400 uppercase">
              <span>TTFB (Server Response)</span>
              <InfoTooltip term="core_web_vitals" />
            </div>
            <div className="text-xl font-black font-mono text-cyan-400 mt-2">
              {audit.coreWebVitals.ttfb.value}ms
            </div>
            <span className="text-[10px] uppercase font-bold text-cyan-400">Fast (&lt; 800ms)</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-400 uppercase">
              <span>FCP (First Contentful)</span>
              <InfoTooltip term="core_web_vitals" />
            </div>
            <div className="text-xl font-black font-mono text-emerald-400 mt-2">
              {audit.coreWebVitals.fcp.value}s
            </div>
            <span className="text-[10px] uppercase font-bold text-emerald-400">Pass (&lt; 1.8s)</span>
          </div>
        </div>
      </Card>

      {/* Issues Breakdown & Resolution Section */}
      <Card
        title="Detected Issues & Step-by-Step Fix Guides"
        termKey="site_health"
        subtitle="Ranked by defect severity and search engine impact"
        headerAction={
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(['all', 'error', 'warning', 'notice'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSeverityTab(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                  activeSeverityTab === tab
                    ? 'bg-cyan-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        }
      >
        <div className="space-y-3">
          {filteredIssues.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No issues detected for this severity category!
            </div>
          ) : (
            filteredIssues.map((issue) => {
              const isExpanded = expandedIssue === issue.id;
              const badgeVariant = issue.severity === 'error' ? 'rose' : issue.severity === 'warning' ? 'amber' : 'cyan';
              const Icon = issue.severity === 'error' ? AlertOctagon : issue.severity === 'warning' ? AlertTriangle : Info;

              return (
                <div
                  key={issue.id}
                  className="rounded-2xl border border-slate-800/80 bg-slate-950/60 overflow-hidden transition-all"
                >
                  <div
                    onClick={() => setExpandedIssue(isExpanded ? null : issue.id)}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-900/40 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`p-2 rounded-xl bg-slate-900 border ${issue.severity === 'error' ? 'border-rose-500/40 text-rose-400' : issue.severity === 'warning' ? 'border-amber-500/40 text-amber-400' : 'border-cyan-500/40 text-cyan-400'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs font-bold text-white">{issue.title}</h3>
                          <Badge variant={badgeVariant} size="sm">{issue.severity.toUpperCase()}</Badge>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{issue.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-slate-300">
                        {issue.affectedUrlsCount} {issue.affectedUrlsCount === 1 ? 'URL' : 'URLs'}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-4 border-t border-slate-800/80 bg-slate-900/30 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block mb-1">
                            Search Impact
                          </span>
                          <p className="text-xs text-slate-300">{issue.impact}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                            How to Fix
                          </span>
                          <p className="text-xs text-slate-300">{issue.howToFix}</p>
                        </div>
                      </div>

                      {issue.sampleUrls && issue.sampleUrls.length > 0 && (
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                            Affected Sample URLs
                          </span>
                          <div className="space-y-1">
                            {issue.sampleUrls.map((url, i) => (
                              <div
                                key={i}
                                className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800/80 font-mono text-[11px] text-cyan-300 flex items-center justify-between"
                              >
                                <span>{url}</span>
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-slate-500 hover:text-cyan-400 transition-colors"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
}
