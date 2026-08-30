'use client';

import React from 'react';

export interface ProgressRingProps {
  value: number; // 0 - 100
  size?: number; // pixel width/height
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  color?: string; // custom hex or automatic
  className?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  size = 120,
  strokeWidth = 10,
  label,
  sublabel,
  color,
  className = '',
}) => {
  const boundedValue = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (boundedValue / 100) * circumference;

  // Auto color if none specified
  const autoColor = color
    ? color
    : boundedValue >= 80
    ? '#10b981' // emerald
    : boundedValue >= 60
    ? '#06b6d4' // cyan
    : boundedValue >= 40
    ? '#f59e0b' // amber
    : '#ef4444'; // rose

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-800/80"
          fill="transparent"
        />
        {/* Progress stroke */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={autoColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
          {boundedValue}
        </span>
        {label && (
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-0.5">
            {label}
          </span>
        )}
        {sublabel && (
          <span className="text-[9px] text-slate-500 font-medium">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
};
