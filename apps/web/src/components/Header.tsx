'use client';

import React from 'react';
import { Globe, Bell, Sparkles, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export const Header: React.FC = () => {
  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/40 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Active Domain Context */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <Globe className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-200">Tracked Target:</span>
          <span className="text-xs font-mono font-bold text-white">rivue.io</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Serper API: <strong>Connected (Mock/Live Ready)</strong></span>
        </div>

        <Link
          href="/audit"
          className="text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span>Run Quick Audit</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <button className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400" />
        </button>
      </div>
    </header>
  );
};
