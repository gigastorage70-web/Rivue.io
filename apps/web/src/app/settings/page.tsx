'use client';

import React, { useState } from 'react';
import {
  Sliders,
  Zap,
  User,
  Users,
  Globe,
  Key,
  Shield,
  CreditCard,
  Plus,
  Trash2,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Download,
  Building,
} from 'lucide-react';
import { Card, Badge, Button, Modal, Table, InfoTooltip, MetricCard } from '@rivue/ui';
import { useRivue } from '../../lib/state';

export default function AdminAndSettingsPage() {
  const {
    quota,
    refillCredits,
    profile,
    updateProfile,
    teamMembers,
    inviteTeamMember,
    removeTeamMember,
    savedDomains,
    addSavedDomain,
    removeSavedDomain,
    targetDomain,
    setTargetDomain,
  } = useRivue();

  const [activeTab, setActiveTab] = useState<'credits' | 'profile' | 'team' | 'portfolio' | 'apikeys'>('credits');

  // Modals state
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Admin' | 'Editor' | 'Viewer'>('Editor');

  const [isAddSiteModalOpen, setIsAddSiteModalOpen] = useState(false);
  const [newSiteInput, setNewSiteInput] = useState('');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    inviteTeamMember(inviteName.trim() || 'New Teammate', inviteEmail.trim(), inviteRole);
    setInviteName('');
    setInviteEmail('');
    setIsInviteModalOpen(false);
  };

  const handleAddSiteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSiteInput.trim()) return;
    addSavedDomain(newSiteInput.trim());
    setNewSiteInput('');
    setIsAddSiteModalOpen(false);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Headline */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="cyan" size="sm">Workspace Admin</Badge>
            <span className="text-xs text-slate-400 font-mono">Organization & Account Settings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Admin & Settings: <span className="text-cyan-400">{profile.organization}</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Manage your API credit quota, team member permissions, multi-site portfolio, and white-label branding.
          </p>
        </div>

        {/* Instant Credit Refill Button */}
        <div className="flex items-center gap-3">
          <Button
            onClick={() => refillCredits(5000)}
            leftIcon={<Zap className="w-4 h-4 text-cyan-300" />}
            size="sm"
          >
            Refill +5,000 Credits
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: 'credits', label: 'Credit Ledger & Quota', icon: Zap },
          { id: 'profile', label: 'User Profile', icon: User },
          { id: 'team', label: `Team Members (${teamMembers.length})`, icon: Users },
          { id: 'portfolio', label: `Tracked Sites (${savedDomains.length})`, icon: Globe },
          { id: 'apikeys', label: 'API Keys & Webhooks', icon: Key },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: CREDITS & QUOTA LEDGER */}
      {activeTab === 'credits' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <MetricCard
              title="Remaining Balance"
              termKey="api_credits"
              value={quota.creditsRemaining.toLocaleString()}
              subtitle={`of ${(quota.monthlyAllowance / 1000).toFixed(0)}k monthly allowance`}
              icon={<Zap className="w-5 h-5 text-cyan-400" />}
              variant="cyan"
            />
            <MetricCard
              title="Credits Used This Cycle"
              termKey="api_credits"
              value={quota.creditsUsedThisBillingCycle.toLocaleString()}
              subtitle="Resets on 1st of next month"
              icon={<CreditCard className="w-5 h-5 text-emerald-400" />}
              variant="emerald"
            />
            <MetricCard
              title="Active Subscription Tier"
              termKey="api_credits"
              value="Agency Pro"
              subtitle="50,000 credits/mo • Unlimited seats"
              icon={<Shield className="w-5 h-5 text-violet-400" />}
              variant="violet"
            />
          </div>

          <Card
            title="Module Usage Breakdown"
            termKey="api_credits"
            subtitle="Real-time credit consumption by feature area"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2">
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase">SERP & Keywords</span>
                <div className="text-lg font-black font-mono text-cyan-400 mt-1">
                  {quota.usageByModule.keyword_search.toLocaleString()} credits
                </div>
                <span className="text-[10px] text-slate-500">10 credits / search</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Site Audits</span>
                <div className="text-lg font-black font-mono text-emerald-400 mt-1">
                  {quota.usageByModule.site_audit.toLocaleString()} credits
                </div>
                <span className="text-[10px] text-slate-500">100 credits / crawl</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Rank Checks</span>
                <div className="text-lg font-black font-mono text-violet-400 mt-1">
                  {quota.usageByModule.rank_check.toLocaleString()} credits
                </div>
                <span className="text-[10px] text-slate-500">5 credits / check</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase">PR & Social</span>
                <div className="text-lg font-black font-mono text-amber-400 mt-1">
                  {(quota.usageByModule.pr_enrichment + quota.usageByModule.social_publish).toLocaleString()} credits
                </div>
                <span className="text-[10px] text-slate-500">10 credits / pitch</span>
              </div>
            </div>
          </Card>

          <Card
            title="Real-Time Audit Ledger & Transaction History"
            termKey="api_credits"
            subtitle="Immutable activity log with timestamped deductions"
          >
            <div className="space-y-2">
              {quota.recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>{tx.description}</span>
                      <Badge variant={tx.creditsDeducted > 0 ? 'cyan' : 'emerald'} size="sm">
                        {tx.module.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <span className="text-[10px] text-slate-500">{tx.timestamp} • User: {tx.userId}</span>
                  </div>

                  <div className="text-right">
                    <span className={`text-xs font-mono font-bold ${tx.creditsDeducted > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {tx.creditsDeducted > 0 ? `-${tx.creditsDeducted}` : `+${Math.abs(tx.creditsDeducted)}`} credits
                    </span>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Balance: {tx.balanceAfter.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: USER PROFILE */}
      {activeTab === 'profile' && (
        <Card title="User Profile & Preferences" subtitle="Your personal account settings">
          <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => updateProfile({ name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => updateProfile({ email: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Organization / Agency</label>
                <input
                  type="text"
                  value={profile.organization}
                  onChange={(e) => updateProfile({ organization: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Timezone</label>
                <input
                  type="text"
                  value={profile.timezone}
                  onChange={(e) => updateProfile({ timezone: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <Button type="submit">Save Profile Changes</Button>
              {savedSuccess && (
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Changes saved!
                </span>
              )}
            </div>
          </form>
        </Card>
      )}

      {/* TAB 3: TEAM MEMBERS */}
      {activeTab === 'team' && (
        <Card
          title="Team Workspace Members"
          subtitle="Collaborate across client SEO audits and link building campaigns"
          headerAction={
            <Button size="sm" onClick={() => setIsInviteModalOpen(true)} leftIcon={<Plus className="w-3.5 h-3.5" />}>
              Invite Member
            </Button>
          }
        >
          <div className="space-y-3">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-white">
                    {member.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>{member.name}</span>
                      <Badge variant={member.role === 'Admin' ? 'cyan' : 'slate'} size="sm">
                        {member.role}
                      </Badge>
                    </div>
                    <span className="text-[11px] text-slate-400">{member.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold uppercase ${member.status === 'Active' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {member.status}
                  </span>
                  {member.role !== 'Admin' && (
                    <button
                      onClick={() => removeTeamMember(member.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                      title="Remove member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* TAB 4: TRACKED PORTFOLIO SITES */}
      {activeTab === 'portfolio' && (
        <Card
          title="Multi-Site Portfolio"
          subtitle="All client and owned domains configured in this workspace"
          headerAction={
            <Button size="sm" onClick={() => setIsAddSiteModalOpen(true)} leftIcon={<Plus className="w-3.5 h-3.5" />}>
              Add Website
            </Button>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {savedDomains.map((domain) => {
              const isCurrent = domain === targetDomain;
              return (
                <div
                  key={domain}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'bg-cyan-500/10 border-cyan-500/40 shadow-lg shadow-cyan-950/50'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Globe className={`w-4 h-4 ${isCurrent ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <span className="text-xs font-mono font-bold text-white">{domain}</span>
                    </div>
                    {isCurrent ? (
                      <Badge variant="cyan" size="sm">Active Target</Badge>
                    ) : (
                      <button
                        onClick={() => setTargetDomain(domain)}
                        className="text-[11px] font-semibold text-cyan-400 hover:underline cursor-pointer"
                      >
                        Set Active
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs border-t border-slate-800/80 pt-3">
                    <span className="text-slate-400">Status: Monitored</span>
                    {savedDomains.length > 1 && (
                      <button
                        onClick={() => removeSavedDomain(domain)}
                        className="text-slate-500 hover:text-rose-400 text-xs"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* TAB 5: API KEYS & WEBHOOKS */}
      {activeTab === 'apikeys' && (
        <Card title="API Access Tokens & Serper Credentials" subtitle="Configure programmatic integrations">
          <div className="space-y-5 max-w-xl">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Live Serper.dev API Key</label>
              <input
                type="password"
                defaultValue="••••••••••••••••••••••••••••••••"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
              />
              <span className="text-[10px] text-slate-400">Used for live Google SERP parsing and real-time news monitoring.</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Rivue REST API Secret</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={profile.apiToken}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-cyan-300 font-mono"
                />
                <Button size="sm" variant="outline">Copy</Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* MODAL: INVITE MEMBER */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite Team Member"
        subtitle="Grant access to this workspace and its site audit portfolio."
      >
        <form onSubmit={handleInviteSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Full Name</label>
            <input
              type="text"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              placeholder="e.g. Sarah Connor"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <input
              type="email"
              required
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="sarah@agency.com"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Role</label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as any)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="Admin">Admin (Full Control)</option>
              <option value="Editor">Editor (Can run audits & edit campaigns)</option>
              <option value="Viewer">Viewer (Read-only reports)</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setIsInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Send Invitation</Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: ADD SITE */}
      <Modal
        isOpen={isAddSiteModalOpen}
        onClose={() => setIsAddSiteModalOpen(false)}
        title="Add Website to Portfolio"
        subtitle="Track rank positions, site health, and backlink growth."
      >
        <form onSubmit={handleAddSiteSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Domain or URL</label>
            <input
              type="text"
              required
              value={newSiteInput}
              onChange={(e) => setNewSiteInput(e.target.value)}
              placeholder="e.g. clientdomain.com"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setIsAddSiteModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Site</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
