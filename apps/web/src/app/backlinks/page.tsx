'use client';

import React, { useState } from 'react';
import {
  Link2,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  ExternalLink,
  Plus,
  Send,
  CheckCircle2,
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
import { SEED_BACKLINK_OVERVIEW } from '@rivue/db';
import { LinkProspectStatus } from '@rivue/types';

export default function BacklinksPage() {
  const [data, setData] = useState(SEED_BACKLINK_OVERVIEW);
  const [activeTab, setActiveTab] = useState<'backlinks' | 'prospects' | 'anchors'>('backlinks');

  const handleUpdateStatus = (prospectId: string, newStatus: LinkProspectStatus) => {
    setData({
      ...data,
      prospects: data.prospects.map((p) =>
        p.id === prospectId ? { ...p, status: newStatus } : p
      ),
    });
  };

  const backlinkColumns = [
    {
      header: (
        <span className="flex items-center gap-1">
          Source Page & Title <InfoTooltip term="referring_domains" />
        </span>
      ),
      cell: (row: any) => (
        <div className="space-y-1">
          <a
            href={row.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-white hover:text-cyan-300 transition-colors flex items-center gap-1.5"
          >
            {row.sourceTitle || row.sourceUrl}
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>
          <p className="text-[11px] font-mono text-cyan-400/80 truncate max-w-md">
            {row.sourceUrl}
          </p>
        </div>
      ),
    },
    {
      header: (
        <span className="flex items-center gap-1">
          DR <InfoTooltip term="domain_rating" />
        </span>
      ),
      cell: (row: any) => (
        <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded-lg">
          {row.domainRating}
        </span>
      ),
      className: 'w-16 text-center',
    },
    {
      header: (
        <span className="flex items-center gap-1">
          Anchor Text <InfoTooltip term="anchor_text" />
        </span>
      ),
      cell: (row: any) => (
        <div className="space-y-0.5">
          <span className="text-xs text-slate-200 font-semibold">{row.anchorText}</span>
          <p className="text-[10px] font-mono text-slate-500 truncate max-w-xs">{row.targetUrl}</p>
        </div>
      ),
    },
    {
      header: (
        <span className="flex items-center gap-1">
          Type <InfoTooltip term="dofollow_ratio" />
        </span>
      ),
      cell: (row: any) => (
        <Badge variant={row.linkType === 'dofollow' ? 'emerald' : 'slate'} size="sm">
          {row.linkType}
        </Badge>
      ),
      className: 'w-24',
    },
    {
      header: (
        <span className="flex items-center gap-1">
          Spam <InfoTooltip term="spam_score" />
        </span>
      ),
      cell: (row: any) => (
        <span className="text-xs font-mono font-bold text-slate-300">
          {row.spamScore}%
        </span>
      ),
      className: 'w-16 text-center',
    },
    {
      header: 'First Seen',
      cell: (row: any) => (
        <span className="text-[11px] text-slate-400">{row.firstSeen}</span>
      ),
      className: 'w-24',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="cyan" size="sm">Backlink & Link Building Engine</Badge>
          <span className="text-xs text-slate-400">Site Explorer & Outreach CRM</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Backlink Profile & Link Acquisition
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Monitor referring domain growth, anchor text distribution, toxic link risk, and manage guest post outreach.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Domain Rating"
          termKey="domain_rating"
          value="64"
          subtitle="Ahrefs/Moz equivalent"
          trend={{ value: 3.2, direction: 'up', label: 'last 30d' }}
          icon={<ShieldCheck className="w-5 h-5 text-cyan-400" />}
          variant="cyan"
        />
        <MetricCard
          title="Referring Domains"
          termKey="referring_domains"
          value={data.referringDomainsCount.toLocaleString()}
          subtitle="Unique root domains"
          trend={{ value: 18.5, direction: 'up', label: 'new domains' }}
          icon={<Link2 className="w-5 h-5 text-blue-400" />}
          variant="default"
        />
        <MetricCard
          title="Dofollow Ratio"
          termKey="dofollow_ratio"
          value={`${data.dofollowRatio}%`}
          subtitle="Authority passing links"
          badge={<Badge variant="emerald" size="sm">Healthy</Badge>}
          variant="emerald"
        />
        <MetricCard
          title="Spam Risk Score"
          termKey="spam_score"
          value={`${data.spamScoreAvg}%`}
          subtitle="Low toxic link profile"
          badge={<Badge variant="emerald" size="sm">Clean</Badge>}
          variant="default"
        />
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <Tabs
          tabs={[
            { id: 'backlinks', label: 'Live Backlinks Explorer', count: data.recentBacklinks.length },
            { id: 'prospects', label: 'Link Building Outreach CRM', count: data.prospects.length },
            { id: 'anchors', label: 'Anchor Text Cloud & Distribution', count: data.anchorDistributions.length },
          ]}
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab as any)}
        />
      </div>

      {/* View 1: Backlinks Explorer Table */}
      {activeTab === 'backlinks' && (
        <Card
          title="Indexed Backlinks"
          termKey="referring_domains"
          subtitle="Live crawl of referring pages and dofollow status"
          noPadding
        >
          <Table
            columns={backlinkColumns}
            data={data.recentBacklinks}
            keyExtractor={(row) => row.id}
          />
        </Card>
      )}

      {/* View 2: Link Prospecting Kanban */}
      {activeTab === 'prospects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Outreach Kanban Pipeline</h3>
            <Button size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
              Add Prospect Target
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Discovered Column */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-xs font-bold text-slate-300 uppercase">Discovered (1)</span>
                <Badge variant="slate" size="sm">To Pitch</Badge>
              </div>
              {data.prospects
                .filter((p) => p.status === 'discovered')
                .map((prosp) => (
                  <div key={prosp.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{prosp.domain}</span>
                      <Badge variant="cyan" size="sm">DR {prosp.domainRating}</Badge>
                    </div>
                    <p className="text-[11px] text-slate-400">{prosp.notes}</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-mono text-cyan-400">{prosp.type}</span>
                      <button
                        onClick={() => handleUpdateStatus(prosp.id, 'contacted')}
                        className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                      >
                        Send Pitch <Send className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            {/* In Progress Column */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-xs font-bold text-cyan-400 uppercase">In Discussion (1)</span>
                <Badge variant="cyan" size="sm">Active</Badge>
              </div>
              {data.prospects
                .filter((p) => p.status === 'in_progress' || p.status === 'contacted')
                .map((prosp) => (
                  <div key={prosp.id} className="p-3.5 rounded-xl bg-slate-900 border border-cyan-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{prosp.domain}</span>
                      <Badge variant="cyan" size="sm">DR {prosp.domainRating}</Badge>
                    </div>
                    <p className="text-[11px] text-slate-300 font-medium">{prosp.contactName}</p>
                    <p className="text-[11px] text-slate-400">{prosp.notes}</p>
                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => handleUpdateStatus(prosp.id, 'acquired')}
                        className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                      >
                        Mark Acquired <CheckCircle2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            {/* Acquired Column */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-xs font-bold text-emerald-400 uppercase">Acquired Links (1)</span>
                <Badge variant="emerald" size="sm">Won</Badge>
              </div>
              {data.prospects
                .filter((p) => p.status === 'acquired')
                .map((prosp) => (
                  <div key={prosp.id} className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-800/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{prosp.domain}</span>
                      <Badge variant="emerald" size="sm">DR {prosp.domainRating}</Badge>
                    </div>
                    <p className="text-[11px] text-slate-300">Live editorial link verified.</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* View 3: Anchor Text Cloud */}
      {activeTab === 'anchors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Anchor Text Distribution" termKey="anchor_text" subtitle="Percentage breakdown of incoming anchor phrases">
            <div className="space-y-3">
              {data.anchorDistributions.map((anchor, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">"{anchor.anchorText}"</span>
                    <span className="font-mono text-cyan-400">{anchor.percentage}% ({anchor.backlinksCount.toLocaleString()} links)</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full"
                      style={{ width: `${anchor.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Anchor Text Diversity Check" termKey="anchor_text" subtitle="Google algorithmic over-optimization safety">
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/50 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Natural Anchor Profile</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Brand anchors account for <strong>38.2%</strong> of your total links, which falls squarely within the recommended 35%–55% natural threshold. Exact commercial match anchors are under 15%.
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
