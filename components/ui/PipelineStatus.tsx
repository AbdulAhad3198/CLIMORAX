'use client';

import React from 'react';
import { Database, CheckCircle2 } from 'lucide-react';

export function PipelineStatus({ className = '' }: { className?: string }) {
  return (
    <div className={`p-3 rounded-lg bg-slate-900/90 border border-slate-800/80 space-y-2 text-xs ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 font-bold">
            DATA PIPELINE
          </span>
        </div>
        <span className="text-emerald-400 font-mono font-bold text-[10px]">OPERATIONAL</span>
      </div>

      <div className="flex justify-between items-center text-[11px] text-slate-300 font-mono">
        <span className="text-slate-400">Last Update:</span>
        <span className="text-slate-200">09:30 UTC</span>
      </div>

      <div className="flex justify-between items-center text-[11px] text-slate-300 font-mono">
        <span className="text-slate-400">Inflow Sources:</span>
        <span className="text-cyan-400 font-bold">3/3 Available</span>
      </div>

      <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[9px] text-slate-500 font-mono">
        <span>SIMULATION ENGINE</span>
        <span className="bg-slate-950 px-1 rounded border border-slate-800 text-slate-400">DEMO DATA</span>
      </div>
    </div>
  );
}
