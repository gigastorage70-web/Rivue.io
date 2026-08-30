'use client';

import React, { useState, useRef, useEffect } from 'react';
import { GLOSSARY_DICTIONARY } from '../glossary';
import { Info, X, ExternalLink, HelpCircle } from 'lucide-react';

export interface InfoTooltipProps {
  term: string;
  customLabel?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  term,
  customLabel,
  size = 'sm',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const entry = GLOSSARY_DICTIONARY[term] || {
    id: term,
    term: customLabel || term.replace(/_/g, ' ').toUpperCase(),
    plainEnglishName: customLabel || term.replace(/_/g, ' '),
    shortDefinition: 'Metric and analysis indicator used across the Rivue growth platform.',
    whyItMatters: 'Provides essential performance insights for search visibility and organic growth.',
    category: 'general',
  };

  // Close on outside click, Esc key, or scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      setIsOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen]);

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const tooltipId = `tooltip-${term}-${Math.random().toString(36).substr(2, 5)}`;

  return (
    <span className={`inline-flex items-center relative align-middle ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        onMouseEnter={() => setIsOpen(true)}
        aria-label={`Info about ${entry.term}`}
        aria-expanded={isOpen}
        aria-describedby={isOpen ? tooltipId : undefined}
        className="text-slate-400 hover:text-cyan-400 focus:text-cyan-300 transition-colors p-0.5 rounded focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer ml-1 inline-flex items-center"
      >
        <HelpCircle className={iconSizes[size]} />
      </button>

      {isOpen && (
        <div
          ref={popoverRef}
          id={tooltipId}
          role="tooltip"
          className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-72 sm:w-80 p-4 rounded-xl bg-slate-900 border border-cyan-500/30 shadow-2xl shadow-cyan-950/50 text-slate-200 text-xs backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
          style={{ minWidth: '280px' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-800 pb-2 mb-2.5">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">
                {entry.plainEnglishName}
              </span>
              <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
                {entry.term}
              </h4>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-0.5 rounded"
              aria-label="Close tooltip"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Definition */}
          <p className="text-slate-300 leading-relaxed mb-2.5">
            {entry.shortDefinition}
          </p>

          {/* Why it Matters */}
          <div className="bg-slate-800/80 rounded-lg p-2.5 mb-2.5 border border-slate-700/60">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 block mb-0.5">
              Why it matters
            </span>
            <p className="text-[11px] text-slate-300 leading-snug">
              {entry.whyItMatters}
            </p>
          </div>

          {/* Benchmark Guide */}
          {entry.benchmarkGuide && (
            <div className="space-y-1 text-[11px] border-t border-slate-800/80 pt-2 text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span><strong className="text-slate-200">Good:</strong> {entry.benchmarkGuide.good}</span>
              </div>
              {entry.benchmarkGuide.poor && (
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                  <span><strong className="text-slate-200">Watch out:</strong> {entry.benchmarkGuide.poor}</span>
                </div>
              )}
            </div>
          )}

          {/* Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px border-4 border-transparent border-t-slate-900"></div>
        </div>
      )}
    </span>
  );
};
