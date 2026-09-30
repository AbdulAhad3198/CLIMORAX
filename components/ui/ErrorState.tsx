'use client';

import React from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Telemetry Sync Failure',
  message = 'Model source temporarily unavailable or network connection interrupted.',
  onRetry
}: ErrorStateProps) {
  return (
    <div className="p-8 rounded-xl bg-red-950/30 border border-red-500/40 flex flex-col items-center justify-center text-center space-y-3">
      <div className="p-3 rounded-full bg-red-500/20 text-red-400">
        <ShieldAlert className="w-6 h-6" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-red-200">{title}</h4>
        <p className="text-xs text-slate-300 mt-1 max-w-md">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-2 transition-colors mt-2"
        >
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Retry Data Ingestion</span>
        </button>
      )}
    </div>
  );
}
