'use client';

import React from 'react';
import { InfoTooltip } from './InfoTooltip';

export interface CardProps {
  title?: string;
  termKey?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  termKey,
  subtitle,
  headerAction,
  children,
  className = '',
  noPadding = false,
}) => {
  return (
    <div
      className={`rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl shadow-xl shadow-slate-950/30 overflow-hidden ${className}`}
    >
      {(title || subtitle || headerAction) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80">
          <div>
            {title && (
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                {title}
                {termKey && <InfoTooltip term={termKey} />}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
            )}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-5'}>{children}</div>
    </div>
  );
};
