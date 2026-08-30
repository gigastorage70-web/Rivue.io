'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Search,
  Activity,
  Link2,
  TrendingUp,
  Users,
  MapPin,
  Share2,
  Send,
  Sliders,
  Sparkles,
  Zap,
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Unified Overview', href: '/', icon: LayoutDashboard, badge: 'Live' },
  { name: 'Keyword & SERP', href: '/keywords', icon: Search },
  { name: 'Site Audit', href: '/audit', icon: Activity },
  { name: 'Backlinks & Outreach', href: '/backlinks', icon: Link2 },
  { name: 'Rank Tracking', href: '/rank-track', icon: TrendingUp },
  { name: 'Competitor Intelligence', href: '/competitor', icon: Users },
  { name: 'Listings & Reviews', href: '/listings', icon: MapPin },
  { name: 'Social Scheduling', href: '/social', icon: Share2 },
  { name: 'Digital PR CRM', href: '/pr-crm', icon: Send },
  { name: 'Credits & Settings', href: '/settings', icon: Sliders },
];

export const Navigation: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-950/70 backdrop-blur-xl flex flex-col justify-between shrink-0 h-screen sticky top-0">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white flex items-center gap-1">
                RIVUE
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  v1.0
                </span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                Growth Intelligence
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation links */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Core Modules
          </div>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/30 shadow-md shadow-cyan-950/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Quota & User Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 space-y-3">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-300 mb-1.5">
            <span className="flex items-center gap-1 text-cyan-400">
              <Zap className="w-3.5 h-3.5" /> API Credits
            </span>
            <span className="font-mono font-bold text-white">34,250 / 50k</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full"
              style={{ width: '68.5%' }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-1">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-white">
            RA
          </div>
          <div className="text-xs overflow-hidden">
            <p className="font-semibold text-slate-200 truncate">Rivue Pro Org</p>
            <p className="text-[10px] text-slate-400 truncate">active_workspace</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
