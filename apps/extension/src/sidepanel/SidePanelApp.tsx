import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Activity,
  Layers,
  Search,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  FileText,
} from 'lucide-react';
import { InfoTooltip } from '@rivue/ui';

export const SidePanelApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'onpage' | 'headings' | 'keywords' | 'competitors'>('onpage');
  const [pageUrl, setPageUrl] = useState('https://rivue.io');
  const [pageTitle, setPageTitle] = useState('Rivue — All-in-One SEO, PR and Competitor Platform');
  const [metaDescription, setMetaDescription] = useState('Consolidate Ahrefs, Semrush, and Mangools into a single Chrome extension and companion web app.');
  const [wordCount, setWordCount] = useState(1480);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          setPageUrl(tabs[0].url || 'https://rivue.io');
          chrome.tabs.sendMessage(tabs[0].id, { action: 'GET_PAGE_SIGNALS' }, (response) => {
            if (response) {
              if (response.title) setPageTitle(response.title);
              if (response.metaDescription) setMetaDescription(response.metaDescription);
              if (response.wordCount) setWordCount(response.wordCount);
            }
          });
        }
      });
    }
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="p-4 space-y-5 bg-slate-950 min-h-screen text-slate-100 select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/30">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-white tracking-tight flex items-center gap-1.5">
              RIVUE INSPECTOR
              <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                MV3
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 font-mono truncate max-w-[200px]">
              {pageUrl}
            </p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          className={`p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer ${
            isRefreshing ? 'animate-spin' : ''
          }`}
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] font-semibold text-center">
        <button
          onClick={() => setActiveTab('onpage')}
          className={`py-1.5 rounded-lg transition-all cursor-pointer ${
            activeTab === 'onpage'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          On-Page
        </button>
        <button
          onClick={() => setActiveTab('headings')}
          className={`py-1.5 rounded-lg transition-all cursor-pointer ${
            activeTab === 'headings'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Headings
        </button>
        <button
          onClick={() => setActiveTab('keywords')}
          className={`py-1.5 rounded-lg transition-all cursor-pointer ${
            activeTab === 'keywords'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Keywords
        </button>
        <button
          onClick={() => setActiveTab('competitors')}
          className={`py-1.5 rounded-lg transition-all cursor-pointer ${
            activeTab === 'competitors'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Compare
        </button>
      </div>

      {/* Tab 1: On-Page Signals */}
      {activeTab === 'onpage' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Title Tag ({pageTitle.length} chars)
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="text-xs font-semibold text-white leading-snug">
              {pageTitle}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Meta Description ({metaDescription.length} chars)
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="text-xs text-slate-300 leading-snug">
              {metaDescription}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Word Count</span>
              <p className="text-lg font-bold font-mono text-cyan-400 mt-0.5">{wordCount}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Schema JSON-LD</span>
              <p className="text-lg font-bold font-mono text-emerald-400 mt-0.5">SoftwareApp</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Headings Tree */}
      {activeTab === 'headings' && (
        <div className="space-y-2.5">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-bold">
              H1 Tag (1 found)
            </span>
            <p className="text-xs font-bold text-white pt-1">
              All-in-One SEO, Competitor & Growth Platform
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
              H2: Consolidate Your Growth Stack
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
              H2: Technical SEO Audits on Demand
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
              H2: Live Digital PR Outreach & Mentions
            </span>
          </div>
        </div>
      )}

      {/* Tab 3: Keywords for Current Page */}
      {activeTab === 'keywords' && (
        <div className="space-y-3">
          {[
            { kw: 'seo chrome extension', vol: 18100, kd: 35, pos: '#1' },
            { kw: 'competitor intelligence tool', vol: 12400, kd: 44, pos: '#2' },
            { kw: 'digital pr crm software', vol: 6400, kd: 28, pos: '#4' },
          ].map((item, i) => (
            <div
              key={i}
              className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-white block">{item.kw}</span>
                <span className="text-[10px] text-slate-400">Vol: {item.vol.toLocaleString()} • KD: {item.kd}</span>
              </div>
              <span className="font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/60">
                {item.pos}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Competitor Quick Compare */}
      {activeTab === 'competitors' && (
        <div className="space-y-3">
          {[
            { domain: 'semrush.com', dr: 91, traffic: '14.2M', gap: '42 missing keywords' },
            { domain: 'ahrefs.com', dr: 90, traffic: '11.8M', gap: '38 missing keywords' },
            { domain: 'mangools.com', dr: 77, traffic: '890k', gap: '12 missing keywords' },
          ].map((comp, i) => (
            <div
              key={i}
              className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">{comp.domain}</span>
                <span className="font-mono text-cyan-400 font-bold">DR {comp.dr}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Traffic: <strong className="text-slate-200">{comp.traffic}</strong></span>
                <span className="text-amber-400 font-medium">{comp.gap}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
