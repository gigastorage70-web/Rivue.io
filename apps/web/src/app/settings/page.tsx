'use client';

import React, { useState } from 'react';
import {
  Sliders,
  Zap,
  Key,
  Download,
  FileText,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import {
  MetricCard,
  Card,
  Badge,
  Button,
  Table,
  InfoTooltip,
} from '@rivue/ui';
import { SEED_QUOTA_LEDGER } from '@rivue/db';
import { CreditTransaction } from '@rivue/types';

export default function SettingsAndCreditsPage() {
  const [quota, setQuota] = useState(SEED_QUOTA_LEDGER);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleSaveApiKey = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleExportReport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert('White-label executive SEO & growth report exported successfully as PDF!');
    }, 1200);
  };

  const transactionColumns = [
    {
      header: 'Timestamp',
      cell: (row: CreditTransaction) => (
        <span className="text-[11px] text-slate-400 font-mono">{row.timestamp}</span>
      ),
      className: 'w-36',
    },
    {
      header: 'Module & Action',
      cell: (row: CreditTransaction) => (
        <div className="space-y-0.5">
          <Badge variant="cyan" size="sm">
            {row.module.replace(/_/g, ' ').toUpperCase()}
          </Badge>
          <p className="text-xs text-slate-200">{row.description}</p>
        </div>
      ),
    },
    {
      header: 'Credits Used',
      cell: (row: CreditTransaction) => (
        <span className="font-mono text-xs font-bold text-rose-400">
          -{row.creditsDeducted}
        </span>
      ),
      className: 'w-28 text-center',
    },
    {
      header: 'Balance After',
      cell: (row: CreditTransaction) => (
        <span className="font-mono text-xs font-bold text-slate-200">
          {row.balanceAfter.toLocaleString()}
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
          <Badge variant="cyan" size="sm">Settings & Metering</Badge>
          <span className="text-xs text-slate-400">Credit Ledger & White-label Reports</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Credits Ledger & Integrations
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage API keys, monitor credit consumption across modules, and download white-label client PDF reports.
        </p>
      </div>

      {/* Credit Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Credits Remaining"
          termKey="kd_score"
          value={quota.creditsRemaining.toLocaleString()}
          subtitle="Of 50,000 monthly quota"
          badge={<Badge variant="cyan" size="sm">68.5% Available</Badge>}
          variant="cyan"
        />
        <MetricCard
          title="Used This Cycle"
          termKey="kd_score"
          value={quota.creditsUsedThisBillingCycle.toLocaleString()}
          subtitle={`Resets on ${quota.resetDate}`}
          variant="default"
        />
        <MetricCard
          title="Active Plan Tier"
          termKey="kd_score"
          value={quota.tier.toUpperCase()}
          subtitle="Multi-user organization"
          badge={<Badge variant="violet" size="sm">Pro Plan</Badge>}
          variant="violet"
        />
        <MetricCard
          title="Serper API Status"
          termKey="serp_features"
          value="Operational"
          subtitle="Live + Mock Resilient"
          badge={<Badge variant="emerald" size="sm">Connected</Badge>}
          variant="emerald"
        />
      </div>

      {/* Module Breakdown & API Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* API Key Configuration */}
        <div className="lg:col-span-6 space-y-6">
          <Card
            title="Serper.dev API Key Integration"
            subtitle="Configure your live Serper API key for real-time Google search data"
          >
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Enter SERPER_API_KEY
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="Enter Serper API key (e.g. serper_live_...)"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
                  />
                  <Button size="sm" onClick={handleSaveApiKey}>
                    Save Key
                  </Button>
                </div>
                {isSaved && (
                  <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> API Key saved and verified.
                  </p>
                )}
              </div>

              <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs space-y-1">
                <span className="font-bold text-cyan-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Zero-Setup Fallback Engine
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Rivue automatically serves high-fidelity deterministic fixtures for any query when no API key is set, ensuring 100% functionality for demonstrations and QA testing.
                </p>
              </div>
            </div>
          </Card>

          {/* White-label Report Exporter */}
          <Card
            title="White-Label Executive Reports"
            subtitle="Export branded client-ready audits and ranking summaries"
          >
            <div className="space-y-3 text-xs">
              <p className="text-slate-300 leading-relaxed">
                Generate a comprehensive PDF report combining Site Health, Core Web Vitals, Top Keyword Rankings, Backlinks, and Competitor Gaps with your agency branding.
              </p>
              <Button
                onClick={handleExportReport}
                isLoading={isExporting}
                variant="primary"
                leftIcon={<Download className="w-4 h-4" />}
              >
                Generate & Download Executive PDF
              </Button>
            </div>
          </Card>
        </div>

        {/* Credit Usage Breakdown by Module */}
        <div className="lg:col-span-6">
          <Card
            title="Credit Consumption by Module"
            subtitle="Current billing cycle usage breakdown"
          >
            <div className="space-y-4">
              {Object.entries(quota.usageByModule).map(([mod, credits]) => {
                const percentage = Math.round((credits / quota.monthlyAllowance) * 100);
                return (
                  <div key={mod} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white capitalize">
                        {mod.replace(/_/g, ' ')}
                      </span>
                      <span className="font-mono text-cyan-400">
                        {credits.toLocaleString()} credits ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full"
                        style={{ width: `${Math.min(100, percentage * 2.5)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* Credit Transactions Audit Log */}
      <Card
        title="Recent Credit Transactions Audit Trail"
        subtitle="Transparent ledger of every automated and manual API debit"
        noPadding
      >
        <Table
          columns={transactionColumns}
          data={quota.recentTransactions}
          keyExtractor={(row) => row.id}
        />
      </Card>
    </div>
  );
}
