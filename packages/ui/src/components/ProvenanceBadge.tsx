'use client';

import React from 'react';
import { ProvenanceSource } from '@rivue/types';
import { Database, Zap, AlertTriangle, Clock } from 'lucide-react';

export interface ProvenanceBadgeProps {
  source?: ProvenanceSource;
  fetchedAt?: string;
  staleAfter?: string;
  className?: string;
  compact?: boolean;
}

export const ProvenanceBadge: React.FC<ProvenanceBadgeProps> = ({
  source = 'live',
  fetchedAt,
  staleAfter,
  className = '',
  compact = false,
}) => {
  const getElapsedLabel = (isoDate?: string): string => {
    if (!isoDate) return '';
    try {
      const elapsedMs = Date.now() - new Date(isoDate).getTime();
      const elapsedMin = Math.floor(elapsedMs / (1000 * 60));
      if (elapsedMin < 1) return 'just now';
      if (elapsedMin < 60) return `${elapsedMin}m ago`;
      const elapsedHrs = Math.floor(elapsedMin / 60);
      if (elapsedHrs < 24) return `${elapsedHrs}h ago`;
      return `${Math.floor(elapsedHrs / 24)}d ago`;
    } catch {
      return '';
    }
  };

  const elapsed = getElapsedLabel(fetchedAt);

  if (source === 'live') {
    return (
      <span
        title={`Live Data: Fetched at ${fetchedAt || 'current session'}`}
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-emerald-950/70 text-emerald-400 border border-emerald-800/60 shadow-sm shadow-emerald-950/40 ${className}`}
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
        </span>
        <Zap className="w-2.5 h-2.5" />
        <span>LIVE</span>
      </span>
    );
  }

  if (source === 'cached') {
    return (
      <span
        title={`Cached Data: Stored in Cloudflare D1 SQLite. Fetched: ${fetchedAt || 'earlier'}. Stale after: ${staleAfter || '24h'}`}
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-amber-950/70 text-amber-300 border border-amber-800/60 shadow-sm shadow-amber-950/40 ${className}`}
      >
        <Database className="w-2.5 h-2.5 text-amber-400" />
        <span>D1 CACHED</span>
        {!compact && elapsed && <span className="text-[9px] text-amber-400/80 font-normal">({elapsed})</span>}
      </span>
    );
  }

  // Mock data (only allowed in offline local dev / tests)
  return (
    <span
      title="Mock Fixture: Displaying offline preview data. Prohibited in production."
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-rose-950/80 text-rose-300 border border-rose-700/80 shadow-sm shadow-rose-950/50 ${className}`}
    >
      <AlertTriangle className="w-2.5 h-2.5 text-rose-400 animate-pulse" />
      <span>MOCK (DEV)</span>
    </span>
  );
};
