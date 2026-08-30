'use client';

import React from 'react';
import { InfoTooltip } from './InfoTooltip';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface MetricCardProps {
  title: string;
  termKey?: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  variant?: 'default' | 'cyan' | 'violet' | 'emerald' | 'amber' | 'rose';
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  termKey,
  value,
  subtitle,
  trend,
  icon,
  badge,
  variant = 'default',
  className = '',
}) => {
  const variantStyles = {
    default: 'border-slate-800/80 bg-slate-900/60 shadow-slate-950/40 hover:border-slate-700',
    cyan: 'border-cyan-500/20 bg-gradient-to-br from-cyan-950/30 to-slate-900/80 shadow-cyan-950/20 hover:border-cyan-500/40',
    violet: 'border-violet-500/20 bg-gradient-to-br from-violet-950/30 to-slate-900/80 shadow-violet-950/20 hover:border-violet-500/40',
    emerald: 'border-emerald-500/20 bg-gradient-to-br from-emerald-950/30 to-slate-900/80 shadow-emerald-950/20 hover:border-emerald-500/40',
    amber: 'border-amber-500/20 bg-gradient-to-br from-amber-950/30 to-slate-900/80 shadow-amber-950/20 hover:border-amber-500/40',
    rose: 'border-rose-500/20 bg-gradient-to-br from-rose-950/30 to-slate-900/80 shadow-rose-950/20 hover:border-rose-500/40',
  };

  return (
    <div
      className={`relative p-5 rounded-2xl border backdrop-blur-xl shadow-lg transition-all duration-200 group ${variantStyles[variant]} ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
            {title}
          </span>
          {termKey && <InfoTooltip term={termKey} />}
        </div>
        {icon && <div className="text-slate-400 group-hover:text-cyan-400 transition-colors">{icon}</div>}
        {badge}
      </div>

      {/* Main Value */}
      <div className="flex items-baseline gap-3 my-1">
        <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono">
          {value}
        </span>
        {trend && (
          <span
            className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
              trend.direction === 'up'
                ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/60'
                : trend.direction === 'down'
                ? 'text-rose-400 bg-rose-950/60 border border-rose-800/60'
                : 'text-slate-400 bg-slate-800/60'
            }`}
          >
            {trend.direction === 'up' && <TrendingUp className="w-3 h-3 mr-1" />}
            {trend.direction === 'down' && <TrendingDown className="w-3 h-3 mr-1" />}
            {trend.direction === 'neutral' && <Minus className="w-3 h-3 mr-1" />}
            {trend.value > 0 ? `+${trend.value}` : trend.value}%
            {trend.label && <span className="ml-1 text-[10px] opacity-75">{trend.label}</span>}
          </span>
        )}
      </div>

      {/* Subtitle / Context */}
      {subtitle && (
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
