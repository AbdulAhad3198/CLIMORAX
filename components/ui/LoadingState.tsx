'use client';

import React from 'react';
import { RefreshCw } from 'lucide-react';

export function LoadingState({ message = 'Loading weather telemetry...' }: { message?: string }) {
  return (
    <div className="p-8 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col items-center justify-center text-center space-y-3">
      <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin" />
      <span className="text-xs font-mono text-slate-300">{message}</span>
    </div>
  );
}
