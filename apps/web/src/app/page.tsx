'use client';

import React from 'react';
import Link from 'next/link';
import {
  Activity,
  Search,
  Link2,
  TrendingUp,
  Users,
  MapPin,
  Share2,
  Send,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Sparkles,
} from 'lucide-react';
import { MetricCard, ProgressRing, Card, Badge, Button, InfoTooltip } from '@rivue/ui';
import { useRivue } from '../lib/state';

export default function UnifiedDashboardPage() {
  const { targetDomain, audit, isAuditing, runLiveAudit } = useRivue();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner / Headline */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-slate-800 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="cyan" size="sm">Executive Pulse</Badge>
              <span className="text-xs text-slate-400">Single Pane of Glass Overview</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Target Site: <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-mono">{targetDomain}</span>
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Consolidated SEO health, organic rank momentum, backlink acquisition velocity, and digital PR outreach.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/keywords">
              <Button leftIcon={<Search className="w-4 h-4" />}>Explore Keywords</Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => runLiveAudit(`https://${targetDomain}`)}
              isLoading={isAuditing}
              leftIcon={<Activity className="w-4 h-4" />}
            >
              Run Live Audit
            </Button>
          </div>
        </div>
      </div>

      {/* Core KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Site Health Score"
          termKey="site_health"
          value={`${audit.healthScore}/100`}
          subtitle={`${audit.errorsCount} critical errors, ${audit.warningsCount} warnings`}
          trend={{ value: 6, direction: 'up', label: 'vs previous' }}
          icon={<Activity className="w-5 h-5 text-emerald-400" />}
          variant="emerald"
        />
        <MetricCard
          title="Domain Rating (DR)"
          termKey="domain_rating"
          value={targetDomain.includes('zenso') ? '58' : targetDomain.includes('rivue') ? '64' : '72'}
          subtitle="Authority ranking in niche"
          trend={{ value: 3.4, direction: 'up', label: 'last 30d' }}
          icon={<ShieldCheck className="w-5 h-5 text-cyan-400" />}
          variant="cyan"
        />
        <MetricCard
          title="Tracked Keywords"
          termKey="serp_volatility"
          value="124"
          subtitle="64 ranking in Top 10"
          trend={{ value: 12, direction: 'up', label: 'improved' }}
          icon={<TrendingUp className="w-5 h-5 text-violet-400" />}
          variant="violet"
        />
        <MetricCard
          title="Referring Domains"
          termKey="referring_domains"
          value="1,420"
          subtitle="78% Dofollow ratio"
          trend={{ value: 18.5, direction: 'up', label: 'velocity' }}
          icon={<Link2 className="w-5 h-5 text-blue-400" />}
          variant="default"
        />
      </div>

      {/* Two Column: Health & Core Web Vitals + Competitor Growth Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Health & Vitals */}
        <div className="lg:col-span-5 space-y-6">
          <Card
            title={`Technical Health: ${targetDomain}`}
            termKey="core_web_vitals"
            subtitle="Real-time crawler and Core Web Vitals pulse"
          >
            <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-4">
              <div className="text-center">
                <ProgressRing
                  value={audit.healthScore}
                  size={130}
                  strokeWidth={11}
                  label="HEALTH"
                  sublabel={audit.healthScore >= 80 ? 'GRADE: GOOD' : 'GRADE: FAIR'}
                />
              </div>
              <div className="space-y-3 w-full sm:w-auto">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-300 font-semibold">LCP Speed</span>
                    <InfoTooltip term="core_web_vitals" />
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {audit.coreWebVitals.lcp.value}s (Good)
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-300 font-semibold">INP Interactivity</span>
                    <InfoTooltip term="core_web_vitals" />
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {audit.coreWebVitals.inp.value}ms (Good)
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-300 font-semibold">CLS Layout Shift</span>
                    <InfoTooltip term="core_web_vitals" />
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {audit.coreWebVitals.cls.value} (Good)
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-800/80 pt-4 mt-2 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {audit.crawledPagesCount} pages audited successfully
              </span>
              <Link href="/audit" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                View Full Audit <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card>

          {/* Quick Module Jump Cards */}
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/listings"
              className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <Badge variant="cyan" size="sm">94% NAP</Badge>
              </div>
              <div className="flex items-center gap-1">
                <h4 className="text-xs font-bold text-white group-hover:text-cyan-300">Local Listings</h4>
                <InfoTooltip term="nap_consistency" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">4 Directories Synced</p>
            </Link>

            <Link
              href="/pr-crm"
              className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-violet-500/40 transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <Send className="w-4 h-4 text-violet-400" />
                <Badge variant="violet" size="sm">14 Unlinked</Badge>
              </div>
              <div className="flex items-center gap-1">
                <h4 className="text-xs font-bold text-white group-hover:text-violet-300">Digital PR CRM</h4>
                <InfoTooltip term="media_mentions" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">3 Active Campaigns</p>
            </Link>
          </div>
        </div>

        {/* Right Column: Real-time Growth Feed & Competitor Activity */}
        <div className="lg:col-span-7">
          <Card
            title="Competitor Growth & Market Activity Feed"
            termKey="content_gap"
            subtitle="Live intelligence across Semrush, Ahrefs, and Mangools"
            headerAction={
              <Link href="/competitor" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                Deep Gap Analysis <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            }
          >
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-cyan-500/20 hover:border-cyan-500/40 transition-all">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Badge variant="cyan" size="sm">New Content</Badge>
                    <span className="text-xs font-bold text-white">semrush.com</span>
                  </div>
                  <span className="text-[10px] text-slate-500">2 hours ago</span>
                </div>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  Published a new 5,000-word guide targeting keyword <strong>"how to rank in google ai overviews"</strong> (Search Volume: 14.2k, KD: 32).
                </p>
                <div className="mt-2.5 flex items-center gap-2 text-[11px] text-cyan-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Opportunity: Add section on AI Overviews to our documentation.</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Badge variant="amber" size="sm">Ranking Shift</Badge>
                    <span className="text-xs font-bold text-white">ahrefs.com</span>
                  </div>
                  <span className="text-[10px] text-slate-500">6 hours ago</span>
                </div>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  Dropped from <strong>#2 to #5</strong> for high-volume commercial query <strong>"free keyword tool"</strong>. Rivue jumped to #3.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Badge variant="emerald" size="sm">Tier-1 Backlink</Badge>
                    <span className="text-xs font-bold text-white">mangools.com</span>
                  </div>
                  <span className="text-[10px] text-slate-500">1 day ago</span>
                </div>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  Acquired editorial dofollow backlink from <strong>Forbes (DR 94)</strong> in article <em>"Top Growth Tools for SMB Marketers"</em>.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
