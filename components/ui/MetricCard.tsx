'use client';

import React from 'react';
import { Sparkline } from './Sparkline';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subValue?: string;
  icon?: LucideIcon;
  sparklineData?: number[];
  sparklineColor?: string;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    label: string;
  };
  accentColor?: string;
  className?: string;
  isDemoData?: boolean;
}

export function MetricCard({
  label,
  value,
  unit,
  subValue,
  icon: Icon,
  sparklineData,
  sparklineColor = '#06b6d4',
  trend,
  className = '',
  isDemoData = true,
}: MetricCardProps) {
  return (
    <div className={`bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-xl p-4 shadow-xl space-y-3 transition-all relative overflow-hidden group ${className}`}>
      {/* Header Line */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="font-semibold flex items-center gap-1.5 text-slate-300">
          {Icon && <Icon className="w-4 h-4 text-cyan-400 shrink-0" />}
          {label}
        </span>
        {isDemoData && (
          <span className="text-[9px] font-mono text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800/80">
            DEMO DATA
          </span>
        )}
      </div>

      {/* Primary Metric Value & Sparkline */}
      <div className="flex items-baseline justify-between gap-2">
        <div>
          <div className="flex items-baseline gap-1 font-mono tracking-tight text-slate-100 font-extrabold text-2xl sm:text-3xl">
            <span>{value}</span>
            {unit && <span className="text-sm font-normal text-slate-400">{unit}</span>}
          </div>
          {subValue && (
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">{subValue}</p>
          )}
        </div>

        {/* Sparkline Curve */}
        {sparklineData && sparklineData.length > 1 && (
          <div className="shrink-0 pt-1">
            <Sparkline data={sparklineData} color={sparklineColor} width={72} height={28} />
          </div>
        )}
      </div>

      {/* Footer Trend Indicator */}
      {trend && (
        <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
          <span className="text-slate-400 font-mono">{trend.label}</span>
          <span
            className={`font-mono font-bold ${
              trend.direction === 'up'
                ? 'text-emerald-400'
                : trend.direction === 'down'
                ? 'text-amber-400'
                : 'text-slate-400'
            }`}
          >
            {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'}
          </span>
        </div>
      )}
    </div>
  );
}
