'use client';

import React, { useState } from 'react';
import {
  Send,
  Mail,
  Newspaper,
  UserCheck,
  TrendingUp,
  Sparkles,
  ExternalLink,
  Plus,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  MetricCard,
  Card,
  Badge,
  Button,
  Table,
  Tabs,
  Modal,
  InfoTooltip,
} from '@rivue/ui';
import { SEED_PR_OVERVIEW } from '@rivue/db';
import { Journalist, BrandMention } from '@rivue/types';

export default function DigitalPrCrmPage() {
  const [data, setData] = useState(SEED_PR_OVERVIEW);
  const [activeTab, setActiveTab] = useState<'journalists' | 'campaigns' | 'mentions'>('journalists');
  const [pitchModalOpen, setPitchModalOpen] = useState(false);
  const [selectedJournalist, setSelectedJournalist] = useState<Journalist | null>(null);

  const handleOpenPitch = (journalist: Journalist) => {
    setSelectedJournalist(journalist);
    setPitchModalOpen(true);
  };

  const handleSendPitch = () => {
    if (!selectedJournalist) return;
    setData({
      ...data,
      journalists: data.journalists.map((j) =>
        j.id === selectedJournalist.id
          ? { ...j, pitchStatus: 'pitched', lastContactedAt: 'Just now' }
          : j
      ),
    });
    setPitchModalOpen(false);
  };

  const journalistColumns = [
    {
      header: 'Journalist & Publication',
      cell: (row: Journalist) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white">{row.name}</span>
            <span className="text-xs text-slate-400">({row.outlet})</span>
            {row.twitterHandle && (
              <span className="text-[10px] font-mono text-cyan-400">{row.twitterHandle}</span>
            )}
          </div>
          <p className="text-[11px] text-slate-300 font-medium">
            Recent: <em>"{row.recentArticleTitle || 'Covering AI & Marketing tools'}"</em>
          </p>
        </div>
      ),
    },
    {
      header: 'Beat / Focus',
      cell: (row: Journalist) => (
        <div className="flex items-center gap-1 flex-wrap">
          {row.beat.map((b, i) => (
            <span
              key={i}
              className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300"
            >
              {b}
            </span>
          ))}
        </div>
      ),
      className: 'w-64',
    },
    {
      header: (
        <span className="flex items-center gap-1">
          Relevance <InfoTooltip term="media_mentions" />
        </span>
      ),
      cell: (row: Journalist) => (
        <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-lg">
          {row.relevanceScore}%
        </span>
      ),
      className: 'w-24 text-center',
    },
    {
      header: 'Status',
      cell: (row: Journalist) => (
        <Badge
          variant={
            row.pitchStatus === 'published'
              ? 'emerald'
              : row.pitchStatus === 'replied'
              ? 'cyan'
              : row.pitchStatus === 'pitched'
              ? 'amber'
              : 'slate'
          }
          size="sm"
        >
          {row.pitchStatus.toUpperCase()}
        </Badge>
      ),
      className: 'w-28',
    },
    {
      header: 'Action',
      cell: (row: Journalist) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleOpenPitch(row)}
          leftIcon={<Send className="w-3 h-3" />}
        >
          Pitch
        </Button>
      ),
      className: 'w-28 text-right',
    },
  ];

  const mentionColumns = [
    {
      header: (
        <span className="flex items-center gap-1">
          Brand Citation & Outlet <InfoTooltip term="media_mentions" />
        </span>
      ),
      cell: (row: BrandMention) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white">{row.source}</span>
            <Badge variant="cyan" size="sm">DR {row.domainRating}</Badge>
            {row.isLinked ? (
              <Badge variant="emerald" size="sm">Linked</Badge>
            ) : (
              <Badge variant="amber" size="sm">Unlinked Mention</Badge>
            )}
          </div>
          <a
            href={row.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-cyan-300 hover:underline flex items-center gap-1"
          >
            {row.title} <ExternalLink className="w-3 h-3" />
          </a>
          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
            "{row.snippet}"
          </p>
        </div>
      ),
    },
    {
      header: 'Sentiment',
      cell: (row: BrandMention) => (
        <Badge variant={row.sentiment === 'positive' ? 'emerald' : 'slate'} size="sm">
          {row.sentiment}
        </Badge>
      ),
      className: 'w-24',
    },
    {
      header: 'Est. Reach',
      cell: (row: BrandMention) => (
        <span className="font-mono text-xs text-slate-300">
          {(row.reachEstimate / 1000).toFixed(0)}k readers
        </span>
      ),
      className: 'w-28 text-right',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="violet" size="sm">Digital PR & Media Engine</Badge>
          <span className="text-xs text-slate-400">Journalist CRM & Serper News Brand Monitor</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Digital PR Outreach & Brand Mentions
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Curated tech journalists directory, sequence templating, and real-time alerts for unlinked brand citations.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Verified Journalists"
          termKey="media_mentions"
          value={data.totalJournalists}
          subtitle="Top tech & SaaS beats"
          badge={<Badge variant="violet" size="sm">Curated</Badge>}
          variant="violet"
        />
        <MetricCard
          title="Average Reply Rate"
          termKey="media_mentions"
          value={`${data.averageReplyRate}%`}
          subtitle="Industry benchmark: 12%"
          trend={{ value: 6.4, direction: 'up' }}
          variant="emerald"
        />
        <MetricCard
          title="Total Brand Mentions"
          termKey="media_mentions"
          value={data.totalBrandMentions}
          subtitle="Across tier-1 news outlets"
          icon={<Newspaper className="w-5 h-5 text-cyan-400" />}
          variant="cyan"
        />
        <MetricCard
          title="Unlinked Opportunities"
          termKey="referring_domains"
          value={data.unlinkedMentionsCount}
          subtitle="Prime outreach targets"
          badge={<Badge variant="amber" size="sm">High ROI</Badge>}
          variant="amber"
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <Tabs
          tabs={[
            { id: 'journalists', label: 'Journalist Directory & Pitch CRM', count: data.journalists.length },
            { id: 'campaigns', label: 'Active PR Campaigns', count: data.campaigns.length },
            { id: 'mentions', label: 'Live Media Mentions (Serper News)', count: data.mentions.length },
          ]}
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab as any)}
        />
      </div>

      {/* View 1: Journalist Directory Table */}
      {activeTab === 'journalists' && (
        <Card
          title="Curated Journalist Directory"
          termKey="media_mentions"
          subtitle="Targeted media professionals covering your niche"
          noPadding
        >
          <Table
            columns={journalistColumns}
            data={data.journalists}
            keyExtractor={(row) => row.id}
          />
        </Card>
      )}

      {/* View 2: PR Campaigns */}
      {activeTab === 'campaigns' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.campaigns.map((camp) => (
            <Card
              key={camp.id}
              title={camp.name}
              subtitle={`Topic: ${camp.targetTopic}`}
              headerAction={
                <Badge variant={camp.status === 'active' ? 'emerald' : 'slate'} size="sm">
                  {camp.status.toUpperCase()}
                </Badge>
              }
            >
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase">Pitched</span>
                    <p className="text-base font-bold font-mono text-white mt-0.5">{camp.sentCount}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase">Open Rate</span>
                    <p className="text-base font-bold font-mono text-cyan-400 mt-0.5">{camp.openRate}%</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase">Placements</span>
                    <p className="text-base font-bold font-mono text-emerald-400 mt-0.5">{camp.placementsCount}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-cyan-400">Subject Template:</span>
                  <p className="text-slate-200 font-semibold">{camp.emailSubjectTemplate}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* View 3: Live Media Mentions */}
      {activeTab === 'mentions' && (
        <Card
          title="Tracked Brand Citations in News"
          termKey="media_mentions"
          subtitle="Real-time web & news mentions scanned via Serper News API"
          noPadding
        >
          <Table
            columns={mentionColumns}
            data={data.mentions}
            keyExtractor={(row) => row.id}
          />
        </Card>
      )}

      {/* Pitch Modal */}
      <Modal
        isOpen={pitchModalOpen}
        onClose={() => setPitchModalOpen(false)}
        title={`Send Pitch to ${selectedJournalist?.name}`}
        subtitle={`Journalist at ${selectedJournalist?.outlet} • ${selectedJournalist?.email}`}
        footer={
          <>
            <Button variant="outline" onClick={() => setPitchModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendPitch} leftIcon={<Send className="w-4 h-4" />}>
              Send Outreach Pitch
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Subject Line
            </label>
            <input
              type="text"
              defaultValue={`Story Idea: Why next-gen SEO is moving directly into browser side panels`}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Personalized Pitch Message
            </label>
            <textarea
              rows={5}
              defaultValue={`Hi ${selectedJournalist?.name},\n\nI loved your recent piece on modern marketing tech. We just released new data showing how unified Chrome extensions eliminate multi-tab fatigue for search marketers...\n\nWould you be interested in early exclusive access to our report?`}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
