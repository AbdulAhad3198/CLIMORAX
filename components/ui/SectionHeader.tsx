'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  badge?: string;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  icon: Icon,
  action,
  badge,
  className = ''
}: SectionHeaderProps) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 ${className}`}>
      <div>
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-cyan-400 shrink-0" />}
          <h2 className="text-sm font-bold text-slate-100">{title}</h2>
          {badge && (
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/80">
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
