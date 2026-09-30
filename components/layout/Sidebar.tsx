'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PipelineStatus } from '../ui/PipelineStatus';
import { 
  LayoutDashboard, 
  CloudSun, 
  Cpu, 
  SlidersHorizontal, 
  AlertTriangle, 
  GitMerge, 
  BarChart3, 
  Bot, 
  Settings,
  ShieldCheck,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Command Center', icon: LayoutDashboard },
  { href: '/forecast', label: 'Hybrid Forecast', icon: CloudSun },
  { href: '/models', label: 'Model Intelligence', icon: Cpu },
  { href: '/weights', label: 'Weight Maps', icon: SlidersHorizontal },
  { href: '/extremes', label: 'Extreme Weather', icon: AlertTriangle, alertBadge: true },
  { href: '/explainability', label: 'Explainability', icon: GitMerge },
  { href: '/verification', label: 'Verification', icon: BarChart3 },
  { href: '/assistant', label: 'AI Assistant', icon: Bot },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ className = '' }: { className?: string }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`bg-slate-950/95 border-r border-cyan-900/30 flex flex-col justify-between shrink-0 transition-all duration-300 relative ${
        collapsed ? 'w-16' : 'w-64'
      } ${className}`}
    >
      <div>
        {/* Brand Lockup & Collapse Toggle */}
        <div className="p-4 border-b border-cyan-900/30 flex items-center justify-between">
          {!collapsed ? (
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div className="truncate">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base tracking-wider text-slate-100 font-mono">CLIMORAX</span>
                  <span className="text-[9px] font-bold tracking-wider text-cyan-400 bg-cyan-950/80 border border-cyan-800/80 px-1 py-0.2 rounded">
                    v2.6
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium truncate">
                  Weather Intelligence Platform
                </p>
              </div>
            </div>
          ) : (
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center shadow-lg shadow-cyan-500/20 mx-auto">
              <Layers className="w-5 h-5 text-white" />
            </div>
          )}

          {/* Collapse/Expand Toggle Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-100 border border-slate-800 hidden md:block"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Global Pipeline Health Widget */}
        {!collapsed && (
          <div className="p-3">
            <PipelineStatus />
          </div>
        )}

        {/* Navigation Items */}
        <nav className="p-2 space-y-1 mt-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={`flex items-center ${
                  collapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2.5'
                } rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-950/50 text-cyan-300 border-l-2 border-cyan-400 font-bold shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>
                {!collapsed && item.alertBadge && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info / SIH Hacksphere Badge */}
      {!collapsed && (
        <div className="p-3.5 border-t border-cyan-900/30 bg-slate-950/50 space-y-1">
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>SIH 2026 PS-26081</span>
          </div>
          <div className="text-[9px] text-slate-500 leading-tight truncate">
            Team Hacksphere1 · Hybrid AI-NWP Blending Engine
          </div>
        </div>
      )}
    </aside>
  );
}
