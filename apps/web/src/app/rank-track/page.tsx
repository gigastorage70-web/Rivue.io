'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Sparkles,
  Zap,
  Globe,
  Smartphone,
  Laptop,
} from 'lucide-react';
import {
  MetricCard,
  Card,
  Badge,
  Button,
  Table,
  Modal,
  InfoTooltip,
} from '@rivue/ui';
import { SEED_RANK_TRACKING } from '@rivue/db';
import { TrackedKeyword } from '@rivue/types';

export default function RankTrackingPage() {
  const [data, setData] = useState(SEED_RANK_TRACKING);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newKeywordInput, setNewKeywordInput] = useState('');

  const handleAddKeyword = () => {
    if (!newKeywordInput.trim()) return;
    const newKw: TrackedKeyword = {
      id: `trk_${Date.now()}`,
      keyword: newKeywordInput.trim(),
      currentPosition: Math.floor(Math.random() * 12) + 1,
      previousPosition: Math.floor(Math.random() * 15) + 2,
      bestPosition: 1,
      searchVolume: 14200,
      location: 'United States',
      device: 'desktop',
      rankingUrl: `https://rivue.io/${newKeywordInput.toLowerCase().replace(/\s+/g, '-')}`,
      serpFeatures: ['People Also Ask', 'Featured Snippet'],
      history: [
        { date: '2026-08-28', position: 6 },
        { date: '2026-08-29', position: 4 },
        { date: '2026-08-30', position: 3 },
      ],
      competitorPositions: { 'semrush.com': 2, 'ahrefs.com': 4 },
      lastChecked: 'Just now',
    };

    setData({
      ...data,
      totalTracked: data.totalTracked + 1,
      keywords: [newKw, ...data.keywords],
    });
    setNewKeywordInput('');
    setIsAddModalOpen(false);
  };

  const rankColumns = [
    {
      header: 'Keyword & Target URL',
      cell: (row: TrackedKeyword) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white">{row.keyword}</span>
            {row.tags?.map((t, i) => (
              <Badge key={i} variant="cyan" size="sm">
                {t}
              </Badge>
            ))}
          </div>
          <p className="text-[11px] font-mono text-cyan-400/80 truncate max-w-md">
            {row.rankingUrl}
          </p>
        </div>
      ),
    },
    {
      header: (
        <span className="flex items-center gap-1">
          Position <InfoTooltip term="serp_volatility" />
        </span>
      ),
      cell: (row: TrackedKeyword) => {
        const delta = row.previousPosition - row.currentPosition;
        return (
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-extrabold text-white bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
              #{row.currentPosition}
            </span>
            {delta > 0 && (
              <span className="text-xs font-bold text-emerald-400 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> +{delta}
              </span>
            )}
            {delta < 0 && (
              <span className="text-xs font-bold text-rose-400 flex items-center">
                <ArrowDownRight className="w-3.5 h-3.5" /> {delta}
              </span>
            )}
            {delta === 0 && (
              <span className="text-xs text-slate-500 flex items-center">
                <Minus className="w-3.5 h-3.5" /> 0
              </span>
            )}
          </div>
        );
      },
      className: 'w-32',
    },
    {
      header: (
        <span className="flex items-center gap-1">
          Search Vol <InfoTooltip term="search_volume" />
        </span>
      ),
      cell: (row: TrackedKeyword) => (
        <span className="font-mono text-xs text-slate-300 font-semibold">
          {row.searchVolume.toLocaleString()}
        </span>
      ),
      className: 'w-28 text-right',
    },
    {
      header: 'Competitor Positions',
      cell: (row: TrackedKeyword) => (
        <div className="flex items-center gap-2 text-[11px] font-mono">
          {row.competitorPositions &&
            Object.entries(row.competitorPositions).map(([comp, pos]) => (
              <span
                key={comp}
                className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-400"
              >
                {comp.split('.')[0]}: <strong className="text-slate-200">#{pos}</strong>
              </span>
            ))}
        </div>
      ),
    },
    {
      header: 'Device / Location',
      cell: (row: TrackedKeyword) => (
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <Laptop className="w-3.5 h-3.5 text-cyan-400" />
          <span>{row.location}</span>
        </div>
      ),
      className: 'w-36',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="cyan" size="sm">Rank Tracking Engine</Badge>
            <span className="text-xs text-slate-400">Daily Multi-Device SERP Checks</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Keyword Rank Position Tracker
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Daily position monitoring across Google Search, SERP feature detection, and competitor overlays.
          </p>
        </div>

        <Button onClick={() => setIsAddModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
          Track New Keyword
        </Button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Top 3 Rankings"
          termKey="organic_ctr"
          value={data.top3Count}
          subtitle="Prime click capture zone"
          trend={{ value: 16.6, direction: 'up', label: 'vs last week' }}
          variant="emerald"
        />
        <MetricCard
          title="Top 10 Rankings"
          termKey="kd_score"
          value={data.top10Count}
          subtitle="Page 1 of Google results"
          trend={{ value: 8.2, direction: 'up' }}
          variant="cyan"
        />
        <MetricCard
          title="SERP Volatility"
          termKey="serp_volatility"
          value={`${data.serpVolatilityIndex}/10`}
          subtitle="Low algorithm turbulence"
          badge={<Badge variant="emerald" size="sm">Calm</Badge>}
          variant="default"
        />
        <MetricCard
          title="Average Position"
          termKey="organic_ctr"
          value={`#${data.averagePosition}`}
          subtitle="Across 124 tracked queries"
          trend={{ value: 1.4, direction: 'up', label: 'positions' }}
          variant="violet"
        />
      </div>

      {/* Rank Tracking Table */}
      <Card
        title="Tracked Keyword Portfolio"
        termKey="serp_volatility"
        subtitle="Automatic daily rank verification at 02:00 UTC"
        noPadding
      >
        <Table
          columns={rankColumns}
          data={data.keywords}
          keyExtractor={(row) => row.id}
        />
      </Card>

      {/* Add Keyword Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Track New Keyword"
        subtitle="Add a search term to begin daily position and competitor monitoring."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddKeyword} leftIcon={<Sparkles className="w-4 h-4" />}>
              Start Tracking
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Target Keyword or Phrase
            </label>
            <input
              type="text"
              value={newKeywordInput}
              onChange={(e) => setNewKeywordInput(e.target.value)}
              placeholder="e.g. competitor analysis chrome extension"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Target Country / Geographic Location
            </label>
            <select className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none">
              <option>United States (Google.com)</option>
              <option>United Kingdom (Google.co.uk)</option>
              <option>Canada (Google.ca)</option>
              <option>Germany (Google.de)</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
