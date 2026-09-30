'use client';

import React from 'react';
import { Layers, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  title = 'No Meteorological Records Found',
  description = 'No forecast data or observations match the selected criteria.',
  action
}: EmptyStateProps) {
  return (
    <div className="p-8 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col items-center justify-center text-center space-y-3">
      <div className="p-3 rounded-full bg-slate-800 text-slate-400">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-200">{title}</h4>
        <p className="text-xs text-slate-400 mt-1 max-w-md">{description}</p>
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
