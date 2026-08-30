'use client';

import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  TrendingUp,
  HelpCircle,
  BarChart2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  MetricCard,
  Card,
  Badge,
  Button,
  Table,
  InfoTooltip,
} from '@rivue/ui';
import { SEED_KEYWORD_RESULT } from '@rivue/db';
import { SerperClient } from '@rivue/serper-client';

export default function KeywordIntelligencePage() {
  const [query, setQuery] = useState('crm software');
  const [data, setData] = useState(SEED_KEYWORD_RESULT);
  const [isLoading, setIsLoading] = useState(false);
  const [openPaa, setOpenPaa] = useState<number | null>(0);

  const serper = new SerperClient();

  const handleSearch = async (targetQuery?: string) => {
    const q = targetQuery || query;
    if (!q.trim()) return;
    setIsLoading(true);
    try {
      const serpSnapshot = await serper.search({ q });
      setData({
        seedKeyword: q,
        overview: {
          id: `kw_${q}`,
          keyword: q,
          volume: q.toLowerCase() === 'crm software' ? 165000 : 42000,
          kdScore: q.toLowerCase() === 'crm software' ? 78 : 45,
          cpc: q.toLowerCase() === 'crm software' ? 18.45 : 4.8,
          competition: 0.85,
          intent: 'commercial',
          serpFeatures: ['People Also Ask', 'Knowledge Graph', 'Sitelinks'],
          trend: [
            { month: 'Mar', volume: 38000 },
            { month: 'Apr', volume: 40000 },
            { month: 'May', volume: 44000 },
            { month: 'Jun', volume: 46000 },
            { month: 'Jul', volume: 42000 },
            { month: 'Aug', volume: 45000 },
          ],
          lastUpdated: 'Just now',
        },
        suggestions: [
          { keyword: `best ${q} for small business`, volume: 18400, kdScore: 36, cpc: 9.2, intent: 'commercial', trendType: 'rising' },
          { keyword: `free ${q} alternatives`, volume: 29100, kdScore: 48, cpc: 4.5, intent: 'transactional', trendType: 'stable' },
          { keyword: `${q} pricing comparison`, volume: 7200, kdScore: 24, cpc: 8.9, intent: 'commercial', trendType: 'rising' },
          { keyword: `cloud ${q} reviews`, volume: 5400, kdScore: 21, cpc: 6.2, intent: 'informational', trendType: 'rising' },
        ],
        questions: (serpSnapshot.peopleAlsoAsk || []).map((p) => ({
          keyword: p.question,
          volume: 8500,
          kdScore: 18,
          cpc: 2.1,
          intent: 'informational' as const,
        })),
        serpSnapshot,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const organicColumns = [
    {
      header: 'Pos',
      cell: (row: any) => (
        <span className="font-mono font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded-lg text-xs">
          #{row.position}
        </span>
      ),
      className: 'w-14',
    },
    {
      header: 'Ranking URL & Title',
      cell: (row: any) => (
        <div className="space-y-1">
          <a
            href={row.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-white hover:text-cyan-300 transition-colors flex items-center gap-1.5"
          >
            {row.title}
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>
          <p className="text-[11px] font-mono text-cyan-400/80 truncate max-w-lg">
            {row.link}
          </p>
          {row.snippet && (
            <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
              {row.snippet}
            </p>
          )}
        </div>
      ),
    },
    {
      header: (
        <span className="flex items-center gap-1">
          Est. CTR <InfoTooltip term="organic_ctr" />
        </span>
      ),
      cell: (row: any) => (
        <span className="font-mono text-xs font-bold text-emerald-400">
          {row.estimatedCtr || 12.5}%
        </span>
      ),
      className: 'w-24 text-right',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header & Search Bar */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="cyan" size="sm">Keyword & SERP Intelligence</Badge>
            <span className="text-xs text-slate-400">Powered by Serper API Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Keyword & SERP Explorer
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Seed expansion, search volume trends, keyword difficulty, and live SERP snapshot analysis.
          </p>
        </div>

        {/* Search input */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Enter seed keyword (e.g. crm software, seo tools, ai writing)..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 focus:border-cyan-500 focus:outline-none text-xs text-white placeholder-slate-500 shadow-inner"
            />
          </div>
          <Button
            onClick={() => handleSearch()}
            isLoading={isLoading}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Analyze Keyword
          </Button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-slate-500 font-medium">Quick Seeds:</span>
          {['crm software', 'seo tools', 'digital pr crm', 'saas growth'].map((seed) => (
            <button
              key={seed}
              onClick={() => {
                setQuery(seed);
                handleSearch(seed);
              }}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-cyan-950/60 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer font-medium"
            >
              {seed}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Search Volume"
          termKey="search_volume"
          value={data.overview.volume.toLocaleString()}
          subtitle="Monthly searches in US"
          trend={{ value: 8.4, direction: 'up', label: 'vs last mo' }}
          variant="cyan"
        />
        <MetricCard
          title="Keyword Difficulty"
          termKey="kd_score"
          value={`${data.overview.kdScore}/100`}
          subtitle={data.overview.kdScore > 65 ? 'Hard competition' : 'Moderate competition'}
          badge={
            <Badge variant={data.overview.kdScore > 70 ? 'rose' : 'amber'} size="sm">
              {data.overview.kdScore > 70 ? 'High' : 'Possible'}
            </Badge>
          }
          variant={data.overview.kdScore > 70 ? 'rose' : 'amber'}
        />
        <MetricCard
          title="Cost Per Click (CPC)"
          termKey="cpc"
          value={`$${data.overview.cpc.toFixed(2)}`}
          subtitle="Paid advertising value"
          variant="emerald"
        />
        <MetricCard
          title="Search Intent"
          termKey="search_intent"
          value={data.overview.intent.toUpperCase()}
          subtitle="Buyer research phase"
          badge={<Badge variant="violet" size="sm">{data.overview.intent}</Badge>}
          variant="violet"
        />
      </div>

      {/* Two Column: Live SERP Snapshot & Related Keyword Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: SERP Snapshot Table */}
        <div className="lg:col-span-7 space-y-6">
          <Card
            title={`Live SERP Snapshot: "${data.seedKeyword}"`}
            termKey="serp_features"
            subtitle="Top organic results and estimated click share"
            noPadding
          >
            <Table
              columns={organicColumns}
              data={
                data.serpSnapshot?.organic || [
                  { position: 1, title: 'HubSpot Free CRM for Small Businesses', link: 'https://hubspot.com/crm', snippet: 'Top-rated CRM suite with pipeline automation.', estimatedCtr: 28.5 },
                  { position: 2, title: 'Salesforce AI CRM Solutions', link: 'https://salesforce.com/crm', snippet: 'Enterprise customer relationship management.', estimatedCtr: 15.7 },
                  { position: 3, title: 'Zoho CRM Software | 250k+ Customers', link: 'https://zoho.com/crm', snippet: 'Affordable, customizable sales automation.', estimatedCtr: 11.0 },
                  { position: 4, title: 'Rivue Growth CRM & SEO Suite', link: 'https://rivue.io', snippet: 'Next-gen SEO and competitor tracking in one panel.', estimatedCtr: 8.0 },
                ]
              }
              keyExtractor={(row, idx) => idx}
            />
          </Card>

          {/* People Also Ask Accordion */}
          <Card
            title="People Also Ask & Frequently Searched Questions"
            termKey="serp_features"
            subtitle="Rich questions surfaced directly by Google searchers"
          >
            <div className="space-y-2.5">
              {data.questions.map((paa, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-slate-950/60 border border-slate-800 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenPaa(openPaa === idx ? null : idx)}
                    className="w-full px-4 py-3 text-left flex items-center justify-between text-xs font-semibold text-white hover:text-cyan-300 transition-colors"
                  >
                    <span>{paa.keyword}</span>
                    {openPaa === idx ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                  </button>
                  {openPaa === idx && (
                    <div className="px-4 pb-3 pt-1 text-xs text-slate-300 border-t border-slate-800/60 bg-slate-900/40 leading-relaxed">
                      Searchers looking for this query are seeking actionable comparisons and implementation advice. Target this as an H2 or FAQ block in your landing page content.
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Keyword Ideas & Suggestions */}
        <div className="lg:col-span-5 space-y-6">
          <Card
            title="Keyword Opportunities & Variations"
            termKey="content_gap"
            subtitle="High-volume, low-KD long-tail suggestions"
          >
            <div className="space-y-3">
              {data.suggestions.map((sug, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setQuery(sug.keyword);
                    handleSearch(sug.keyword);
                  }}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {sug.keyword}
                    </span>
                    <Badge variant={sug.kdScore < 30 ? 'emerald' : 'amber'} size="sm">
                      KD {sug.kdScore}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Vol: <strong className="text-slate-200">{sug.volume.toLocaleString()}</strong></span>
                    <span>CPC: <strong className="text-emerald-400">${sug.cpc.toFixed(2)}</strong></span>
                    <span className="uppercase text-[10px] text-cyan-400 font-mono">{sug.intent}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
