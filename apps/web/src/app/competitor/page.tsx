'use client';

import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  TrendingUp,
  ExternalLink,
  Plus,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
} from 'lucide-react';
import {
  MetricCard,
  Card,
  Badge,
  Button,
  Table,
  Tabs,
  InfoTooltip,
} from '@rivue/ui';
import { SEED_COMPETITOR_OVERVIEW } from '@rivue/db';
import { KeywordGapItem } from '@rivue/types';

export default function CompetitorIntelligencePage() {
  const [data, setData] = useState(SEED_COMPETITOR_OVERVIEW);
  const [activeGapFilter, setActiveGapFilter] = useState('all');

  const filteredGap = data.keywordGap.filter((item) => {
    if (activeGapFilter === 'all') return true;
    return item.gapType === activeGapFilter;
  });

  const gapColumns = [
    {
      header: 'Keyword Opportunity',
      cell: (row: KeywordGapItem) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white">{row.keyword}</span>
            <Badge
              variant={
                row.gapType === 'missing'
                  ? 'rose'
                  : row.gapType === 'weak'
                  ? 'amber'
                  : row.gapType === 'strong'
                  ? 'emerald'
                  : 'cyan'
              }
              size="sm"
            >
              {row.gapType.toUpperCase()}
            </Badge>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>Vol: <strong className="text-slate-200">{row.searchVolume.toLocaleString()}</strong></span>
            <span>KD: <strong className="text-cyan-400">{row.kdScore}</strong></span>
            <span>CPC: <strong className="text-emerald-400">${row.cpc.toFixed(2)}</strong></span>
          </div>
        </div>
      ),
    },
    {
      header: 'Your Position',
      cell: (row: KeywordGapItem) => (
        <span className="font-mono text-xs font-bold text-slate-200">
          {row.yourPosition ? `#${row.yourPosition}` : <span className="text-rose-400 font-normal">Not Ranking</span>}
        </span>
      ),
      className: 'w-28 text-center',
    },
    {
      header: 'Competitor Positions',
      cell: (row: KeywordGapItem) => (
        <div className="flex items-center gap-2 text-[11px] font-mono">
          {Object.entries(row.competitorPositions).map(([comp, pos]) => (
            <span
              key={comp}
              className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-300"
            >
              {comp.split('.')[0]}: <strong className="text-cyan-400">{pos ? `#${pos}` : '—'}</strong>
            </span>
          ))}
        </div>
      ),
    },
    {
      header: (
        <span className="flex items-center gap-1">
          Opportunity <InfoTooltip term="content_gap" />
        </span>
      ),
      cell: (row: KeywordGapItem) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-lg">
            {row.opportunityScore}/100
          </span>
        </div>
      ),
      className: 'w-28 text-center',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="cyan" size="sm">Competitor & Traffic Intelligence</Badge>
          <span className="text-xs text-slate-400">Head-to-Head Domain Comparison</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Competitor Domain Overview & Gap Analysis
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Directly benchmark keyword gaps, backlink disparities, and track real-time rival moves in one growth feed.
        </p>
      </div>

      {/* Competitor Domain Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {data.competitors.map((comp) => (
          <Card
            key={comp.domain}
            title={comp.name}
            subtitle={comp.domain}
            headerAction={
              <Badge variant="cyan" size="sm">
                DR {comp.domainRating}
              </Badge>
            }
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Est. Organic Traffic</span>
                <span className="font-mono font-bold text-white">
                  {(comp.estimatedMonthlyTraffic / 1000000).toFixed(1)}M/mo
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Ranked Keywords</span>
                <span className="font-mono font-bold text-cyan-400">
                  {(comp.organicKeywordsCount / 1000000).toFixed(1)}M
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Total Backlinks</span>
                <span className="font-mono font-bold text-slate-300">
                  {(comp.totalBacklinksCount / 1000000).toFixed(1)}M
                </span>
              </div>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">30-Day Growth</span>
                <span
                  className={`font-semibold flex items-center ${
                    comp.trafficTrendPercentage >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {comp.trafficTrendPercentage >= 0 ? (
                    <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                  )}
                  {comp.trafficTrendPercentage}%
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Keyword Gap Matrix Table */}
      <Card
        title="Keyword Gap Matrix: Opportunities Ready to Target"
        termKey="content_gap"
        subtitle="Keywords your rivals rank for that are missing or weak on your domain"
        headerAction={
          <Tabs
            tabs={[
              { id: 'all', label: 'All Opportunities', count: data.keywordGap.length },
              { id: 'missing', label: 'Missing (Page 1 Rival)' },
              { id: 'weak', label: 'Weak (Rival Outranks You)' },
              { id: 'strong', label: 'Strong (You Win)' },
            ]}
            activeTab={activeGapFilter}
            onChange={setActiveGapFilter}
          />
        }
        noPadding
      >
        <Table
          columns={gapColumns}
          data={filteredGap}
          keyExtractor={(row, idx) => idx}
        />
      </Card>
    </div>
  );
}
