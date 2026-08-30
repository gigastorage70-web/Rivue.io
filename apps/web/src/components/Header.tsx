'use client';

import React, { useState } from 'react';
import {
  Globe,
  Bell,
  Sparkles,
  ExternalLink,
  ChevronDown,
  Plus,
  RefreshCw,
  Check,
} from 'lucide-react';
import Link from 'next/link';
import { useRivue } from '../lib/state';
import { Modal, Button, Badge } from '@rivue/ui';

export const Header: React.FC = () => {
  const {
    targetDomain,
    setTargetDomain,
    savedDomains,
    addSavedDomain,
    runLiveAudit,
    isAuditing,
  } = useRivue();

  const [isDomainModalOpen, setIsDomainModalOpen] = useState(false);
  const [newDomainInput, setNewDomainInput] = useState('');

  const handleSelectDomain = (domain: string) => {
    setTargetDomain(domain);
    setIsDomainModalOpen(false);
  };

  const handleAddNewDomain = () => {
    if (!newDomainInput.trim()) return;
    addSavedDomain(newDomainInput.trim());
    setTargetDomain(newDomainInput.trim());
    setNewDomainInput('');
    setIsDomainModalOpen(false);
  };

  const handleQuickAudit = async () => {
    await runLiveAudit(`https://${targetDomain}`);
  };

  return (
    <>
      <header className="h-16 border-b border-slate-800/80 bg-slate-950/40 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-30">
        {/* Active Domain Context Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDomainModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer group"
          >
            <Globe className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold text-slate-400">Target Site:</span>
            <span className="text-xs font-mono font-bold text-white group-hover:text-cyan-300">
              {targetDomain}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Serper API: <strong>Connected</strong></span>
          </div>

          <button
            onClick={handleQuickAudit}
            disabled={isAuditing}
            className="text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
            <span>{isAuditing ? 'Auditing Live...' : 'Run Quick Audit'}</span>
          </button>

          <button className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400" />
          </button>
        </div>
      </header>

      {/* Target Domain Switcher Modal */}
      <Modal
        isOpen={isDomainModalOpen}
        onClose={() => setIsDomainModalOpen(false)}
        title="Switch Target Website"
        subtitle="Select a saved website from your portfolio or enter a new target domain to analyze."
        footer={
          <Button variant="outline" onClick={() => setIsDomainModalOpen(false)}>
            Close
          </Button>
        }
      >
        <div className="space-y-5">
          {/* Add New Domain Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Analyze New Domain (e.g. thezensodigital.com, apple.com)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newDomainInput}
                onChange={(e) => setNewDomainInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddNewDomain()}
                placeholder="Enter domain or URL..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
              />
              <Button size="sm" onClick={handleAddNewDomain} leftIcon={<Plus className="w-3.5 h-3.5" />}>
                Add & Switch
              </Button>
            </div>
          </div>

          {/* Saved Websites List */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Active Portfolio
            </span>
            <div className="space-y-1.5 max-h-56 overflow-y-auto">
              {savedDomains.map((domain) => {
                const isActive = domain === targetDomain;
                return (
                  <div
                    key={domain}
                    onClick={() => handleSelectDomain(domain)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isActive
                        ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Globe className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                      <span className="text-xs font-mono font-bold">{domain}</span>
                    </div>
                    {isActive ? (
                      <Badge variant="cyan" size="sm">Active</Badge>
                    ) : (
                      <span className="text-[11px] text-slate-500">Switch &rarr;</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
