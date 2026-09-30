'use client';

import React from 'react';

export type StatusType = 'OPERATIONAL' | 'DEGRADED' | 'OFFLINE' | 'CALIBRATING' | 'ACTIVE';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className = '' }: StatusBadgeProps) {
  const getColors = () => {
    switch (status) {
      case 'OPERATIONAL':
      case 'ACTIVE':
        return {
          dot: 'bg-emerald-400 animate-pulse',
          bg: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80',
        };
      case 'DEGRADED':
      case 'CALIBRATING':
        return {
          dot: 'bg-amber-400 animate-pulse',
          bg: 'bg-amber-950/60 text-amber-300 border-amber-800/80',
        };
      case 'OFFLINE':
      default:
        return {
          dot: 'bg-red-400',
          bg: 'bg-red-950/60 text-red-300 border-red-800/80',
        };
    }
  };

  const { dot, bg } = getColors();

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-medium border ${bg} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      <span>{label || status}</span>
    </span>
  );
}
