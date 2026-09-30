'use client';

import React, { useState } from 'react';
import { useApp } from '@/components/context/AppContext';
import { AppShell } from '@/components/layout/AppShell';
import { Settings, Server, ShieldCheck, Database, RefreshCw, Terminal, Download, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  return (
    <AppShell>
      <SettingsPageContent />
    </AppShell>
  );
}

function SettingsPageContent() {
  const { unit, setUnit, refreshData, lastUpdated } = useApp();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [aiConfidenceCutoff, setAiConfidenceCutoff] = useState(60);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-cyan-900/30 pb-4">
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Settings className="w-6 h-6 text-cyan-400" />
          Operational System Settings & Pipeline Telemetry
        </h1>
        <p className="text-xs text-slate-400">
          Configure multi-model data pipelines, blending threshold cutoffs, and system diagnostics
        </p>
      </div>

      {/* Operational Pipeline Status Cards */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" />
            Active Data Ingestion Pipelines
          </h3>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
            ALL SYSTEMS NOMINAL
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-200">IMD / ECMWF Operational Feed</div>
              <div className="text-[10px] text-slate-400">GRIB2 High-Res Stream (9km)</div>
            </div>
            <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" /> ONLINE
            </span>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-200">AI Neural Graph Engine</div>
              <div className="text-[10px] text-slate-400">ClimoraX GPU Inference Nodes</div>
            </div>
            <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" /> ONLINE
            </span>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-200">50-Member GEFS Ensemble Feed</div>
              <div className="text-[10px] text-slate-400">NCMRWF Perturbation Stream</div>
            </div>
            <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" /> ONLINE
            </span>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-200">AWS Ground Truth Ingestion</div>
              <div className="text-[10px] text-slate-400">1,240 Indian Weather Stations</div>
            </div>
            <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" /> ONLINE
            </span>
          </div>
        </div>
      </div>

      {/* Config Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4 text-xs">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            Blending Engine Threshold Controls
          </h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div>
              <div className="font-bold text-slate-200">Auto-Recalculate Blending Engine</div>
              <div className="text-slate-400 text-[11px]">
                Automatically recalculates dynamic weights when station location or lead time changes
              </div>
            </div>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="accent-cyan-500 w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
            <div className="flex justify-between font-bold text-slate-200">
              <span>AI Model Minimum Confidence Floor Cutoff:</span>
              <span className="text-cyan-400 font-mono">{aiConfidenceCutoff}%</span>
            </div>
            <input
              type="range"
              min="30"
              max="90"
              value={aiConfidenceCutoff}
              onChange={(e) => setAiConfidenceCutoff(parseInt(e.target.value, 10))}
              className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <p className="text-[10px] text-slate-400">
              If AI WeatherNet uncertainty rises above this floor, blending engine automatically shifts weight to NWP physics.
            </p>
          </div>
        </div>
      </div>

      {/* System Diagnostics Export */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl flex items-center justify-between">
        <div>
          <div className="font-bold text-slate-100 text-sm">Export System Telemetry & Logs</div>
          <div className="text-xs text-slate-400">Download operational GRIB2 metadata & SIH 2026 system state</div>
        </div>
        <button
          onClick={() => alert('Downloading system logs file...')}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Export Logs</span>
        </button>
      </div>
    </div>
  );
}
