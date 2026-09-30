'use client';

import React from 'react';

export type ModelType = 'NWP' | 'AI' | 'ENSEMBLE' | 'HYBRID';

interface ModelBadgeProps {
  type: ModelType;
  name?: string;
  weight?: number; // 0 to 1 or 0 to 100
  className?: string;
}

export function ModelBadge({ type, name, weight, className = '' }: ModelBadgeProps) {
  const getStyle = () => {
    switch (type) {
      case 'AI':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-800/80';
      case 'NWP':
        return 'bg-blue-950/80 text-blue-300 border-blue-800/80';
      case 'ENSEMBLE':
        return 'bg-purple-950/80 text-purple-300 border-purple-800/80';
      case 'HYBRID':
      default:
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80';
    }
  };

  const getDotColor = () => {
    switch (type) {
      case 'AI': return 'bg-cyan-400';
      case 'NWP': return 'bg-blue-400';
      case 'ENSEMBLE': return 'bg-purple-400';
      case 'HYBRID': default: return 'bg-emerald-400';
    }
  };

  const weightFormatted = weight !== undefined 
    ? (weight <= 1 ? `${(weight * 100).toFixed(0)}%` : `${weight.toFixed(0)}%`) 
    : null;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono border ${getStyle()} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${getDotColor()}`} />
      <span className="font-bold">{name || type}</span>
      {weightFormatted && <span className="opacity-80 text-[10px]">({weightFormatted})</span>}
    </span>
  );
}
