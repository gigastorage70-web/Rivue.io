import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Activity,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Maximize2,
  Globe,
} from 'lucide-react';

export const PopupApp: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState('https://rivue.io');
  const [score, setScore] = useState(88);
  const [dr, setDr] = useState(64);

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.url) {
          setCurrentUrl(tabs[0].url);
        }
      });
    }
  }, []);

  const handleOpenSidePanel = () => {
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.sendMessage({ action: 'OPEN_SIDEPANEL' });
      window.close();
    }
  };

  const handleOpenDashboard = () => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.create({ url: 'http://localhost:3000' });
    } else {
      window.open('http://localhost:3000', '_blank');
    }
  };

  return (
    <div className="p-4 space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/30">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-white tracking-tight">
              RIVUE QUICK PULSE
            </h1>
            <p className="text-[10px] text-slate-400 font-mono truncate max-w-[200px]">
              {currentUrl}
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenSidePanel}
          title="Open Deep Side Panel"
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300 transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Instant Health & DR Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-cyan-950/40 border border-cyan-500/30 flex items-center justify-around shadow-xl">
        <div className="text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            RIVUE HEALTH
          </span>
          <span className="text-3xl font-extrabold font-mono text-emerald-400">
            {score}
          </span>
          <span className="text-[10px] text-emerald-400/80 font-bold block">
            GOOD
          </span>
        </div>

        <div className="h-10 w-px bg-slate-800" />

        <div className="text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            DOMAIN RATING
          </span>
          <span className="text-3xl font-extrabold font-mono text-cyan-400">
            {dr}
          </span>
          <span className="text-[10px] text-cyan-400/80 font-bold block">
            TOP 8%
          </span>
        </div>
      </div>

      {/* Top 3 Quick Findings */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
          Key On-Page Findings
        </span>

        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-slate-200">Title Tag: 54 chars</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400">Optimal</span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-slate-200">Canonical Tag Configured</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400">Valid</span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-amber-800/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-slate-200">2 Images Missing Alt Text</span>
          </div>
          <span className="text-[10px] font-mono text-amber-400">Warning</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2 border-t border-slate-800">
        <button
          onClick={handleOpenSidePanel}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 hover:from-cyan-400 hover:to-blue-500 transition-all cursor-pointer"
        >
          <span>Open Full Side Panel Inspector</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          onClick={handleOpenDashboard}
          className="w-full py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <span>Open Rivue Web Dashboard</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
