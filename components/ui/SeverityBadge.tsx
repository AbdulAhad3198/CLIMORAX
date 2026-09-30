'use client';

import React from 'react';

export type SeverityType = 
  | 'SAFE' 
  | 'WATCH' 
  | 'ELEVATED' 
  | 'SEVERE' 
  | 'EMERGENCY' 
  | 'WARNING' 
  | 'ADVISORY' 
  | 'LOW' 
  | 'MODERATE' 
  | 'HIGH';

interface SeverityBadgeProps {
  severity: SeverityType;
  label?: string;
  className?: string;
}

export function SeverityBadge({ severity, label, className = '' }: SeverityBadgeProps) {
  const getStyle = () => {
    switch (severity) {
      case 'EMERGENCY':
      case 'SEVERE':
        return 'bg-red-500 text-slate-950 font-black border-red-400 shadow-[0_0_10px_rgba(239,68,68,0.4)]';
      case 'HIGH':
      case 'WARNING':
      case 'ELEVATED':
        return 'bg-orange-500 text-slate-950 font-extrabold border-orange-400';
      case 'MODERATE':
      case 'ADVISORY':
      case 'WATCH':
        return 'bg-amber-400 text-slate-950 font-bold border-amber-300';
      case 'LOW':
      case 'SAFE':
      default:
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-800 font-semibold';
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase border ${getStyle()} ${className}`}>
      {label || severity}
    </span>
  );
}
