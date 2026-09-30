'use client';

import React, { useState } from 'react';
import { useApp } from '@/components/context/AppContext';
import { AppShell } from '@/components/layout/AppShell';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ModelBadge } from '@/components/ui/ModelBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatTemp, formatSpeed, formatPrecip } from '@/lib/formatting/units';
import { 
  Cpu, 
  Server, 
  Zap, 
  Layers, 
  BarChart2, 
  ShieldCheck, 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  GitMerge, 
  TrendingUp, 
  TrendingDown, 
  X, 
  Info,
  SlidersHorizontal,
  Flame,
  Droplets,
  Wind,
  Waves,
  CloudLightning,
  Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';

export type RegimeTabKey = 'Normal' | 'Heavy Rain' | 'Heat Wave' | 'High Wind' | 'Cyclonic' | 'Thunderstorm';

export default function ModelsPage() {
  return (
    <AppShell>
      <ModelsPageContent />
    </AppShell>
  );
}

function ModelsPageContent() {
  const { selectedLocation, leadTimeHours, setLeadTimeHours, hybridData, forecastTimeline, unit } = useApp();

  const [activeVariable, setActiveVariable] = useState<'precip' | 'temp' | 'wind'>('precip');
  const [activeRegimeTab, setActiveRegimeTab] = useState<RegimeTabKey>('Heavy Rain');
  const [selectedDrawerModel, setSelectedDrawerModel] = useState<any | null>(null);

  // Model cards definitions
  const nwpWeight = hybridData.weights[0];
  const aiWeight = hybridData.weights[1];
  const ensWeight = hybridData.weights[2];

  const nwpForecast = hybridData.models[0];
  const aiForecast = hybridData.models[1];
  const ensForecast = hybridData.models[2];

  // Lead Time Skill Degradation Data
  const leadTimeSkillData = [
    { lead: '6h', AI: 94, Ensemble: 82, NWP: 78, Hybrid: 96 },
    { lead: '12h', AI: 92, Ensemble: 83, NWP: 80, Hybrid: 95 },
    { lead: '24h', AI: 88, Ensemble: 85, NWP: 82, Hybrid: 93 },
    { lead: '48h', AI: 78, Ensemble: 88, NWP: 83, Hybrid: 91 },
    { lead: '72h', AI: 65, Ensemble: 86, NWP: 84, Hybrid: 88 },
    { lead: '120h', AI: 52, Ensemble: 81, NWP: 82, Hybrid: 85 },
  ];

  // Weather Regime analysis state mapping
  const regimeAnalysisMap: Record<RegimeTabKey, {
    aiContrib: number;
    nwpContrib: number;
    ensContrib: number;
    aiSkill: number;
    nwpSkill: number;
    ensSkill: number;
    hybridSkill: number;
    explanation: string;
    favorable: string;
  }> = {
    'Normal': {
      aiContrib: 45, nwpContrib: 35, ensContrib: 20,
      aiSkill: 0.88, nwpSkill: 0.84, ensSkill: 0.82, hybridSkill: 0.92,
      explanation: 'Under stable atmospheric boundary conditions, AI WeatherNet captures localized diurnal thermal curves with minimal error.',
      favorable: 'AI WeatherNet',
    },
    'Heavy Rain': {
      aiContrib: 51, nwpContrib: 28, ensContrib: 21,
      aiSkill: 0.91, nwpSkill: 0.74, ensSkill: 0.81, hybridSkill: 0.94,
      explanation: 'Monsoonal precipitation plumes display strong spatial auto-correlation; AI neural graph transformer outperforms hydrostatic grid solvers.',
      favorable: 'AI WeatherNet',
    },
    'Heat Wave': {
      aiContrib: 25, nwpContrib: 55, ensContrib: 20,
      aiSkill: 0.80, nwpSkill: 0.92, ensSkill: 0.83, hybridSkill: 0.95,
      explanation: 'Synoptic high-pressure thermal ridges are governed by large-scale geopotential physics; NWP primitive equation solvers hold top accuracy.',
      favorable: 'NWP Core',
    },
    'High Wind': {
      aiContrib: 30, nwpContrib: 30, ensContrib: 40,
      aiSkill: 0.78, nwpSkill: 0.81, ensSkill: 0.89, hybridSkill: 0.92,
      explanation: 'Gale wind gusts and squalls exhibit high turbulence; 50-member Ensemble dispersion captures maximum gust risk envelope.',
      favorable: 'Ensemble Fusion',
    },
    'Cyclonic': {
      aiContrib: 22, nwpContrib: 28, ensContrib: 50,
      aiSkill: 0.75, nwpSkill: 0.82, ensSkill: 0.93, hybridSkill: 0.96,
      explanation: 'Tropical cyclone landfall track and storm surge require multi-member perturbation cloud to evaluate track divergence probability.',
      favorable: 'Ensemble Fusion',
    },
    'Thunderstorm': {
      aiContrib: 48, nwpContrib: 22, ensContrib: 30,
      aiSkill: 0.89, nwpSkill: 0.68, ensSkill: 0.84, hybridSkill: 0.93,
      explanation: 'Mesoscale severe convection with high CAPE requires rapid non-linear updraft pattern matching.',
      favorable: 'AI WeatherNet',
    },
  };

  const activeRegimeData = regimeAnalysisMap[activeRegimeTab];

  // Performance Matrix Table Data
  const performanceMatrix = [
    { row: 'Monsoon / Kerala / 24h', nwp: '0.72', ai: '0.84', ensemble: '0.77', hybrid: '0.89', best: 'Hybrid' },
    { row: 'Thermal Ridge / Rajasthan / 12h', nwp: '0.91', ai: '0.79', ensemble: '0.82', hybrid: '0.94', best: 'Hybrid' },
    { row: 'Cyclone Track / Odisha / 48h', nwp: '0.78', ai: '0.72', ensemble: '0.91', hybrid: '0.95', best: 'Hybrid' },
    { row: 'Western Disturbance / J&K / 72h', nwp: '0.85', ai: '0.64', ensemble: '0.80', hybrid: '0.88', best: 'Hybrid' },
    { row: 'Thunderstorm / Gangetic Plains / 6h', nwp: '0.68', ai: '0.89', ensemble: '0.82', hybrid: '0.93', best: 'Hybrid' },
  ];

  // Simulated Comparison Chart with Ground Truth Observation line
  const comparisonTimeline = forecastTimeline.map((pt, idx) => ({
    time: pt.time,
    hybridPrecip: pt.hybridPrecip,
    nwpPrecip: pt.nwpPrecip,
    aiPrecip: pt.aiPrecip,
    ensemblePrecip: pt.ensemblePrecip,
    // Simulated AWS observation line (tracks close to hybrid)
    observationPrecip: Number((pt.hybridPrecip + (idx % 2 === 0 ? 0.3 : -0.2)).toFixed(1)),
    hybridTemp: pt.hybridTemp,
    nwpTemp: pt.nwpTemp,
    aiTemp: pt.aiTemp,
    ensembleTemp: pt.ensembleTemp,
    observationTemp: Number((pt.hybridTemp + (idx % 2 === 0 ? -0.2 : 0.3)).toFixed(1)),
  }));

  return (
    <div className="space-y-6">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-900/30 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2 font-sans">
              <Cpu className="w-6 h-6 text-cyan-400" />
              Model Intelligence & Architecture Profiler
            </h1>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
              SIMULATED METRICS DEMO
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Understand how each forecasting source performs across region, season, lead time and weather regime.
          </p>
        </div>
      </div>

      {/* 2. THREE MAJOR MODEL CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: NWP Core */}
        <div
          onClick={() => setSelectedDrawerModel({
            name: 'NWP Core (IFS/IMD)',
            type: 'NWP',
            provider: 'IMD / ECMWF Operational',
            weight: nwpWeight.weight,
            skill: '82/100',
            forecast: `${nwpForecast.precipitation} mm/h`,
            description: 'Physics-based hydrostatic primitive equation solver modeling fluid dynamics, thermodynamics, radiation, and moisture conservation laws.',
            strongest: 'Synoptic thermal ridges, baroclinic waves, high mountainous terrain (>1200m), extended lead times (>120h).',
            weakest: 'Short-range convective initiation (<12h), localized urban downpours.',
            rmse: '2.14 °C',
            mae: '1.68 °C',
            bias: '+0.45 hPa',
          })}
          className="bg-slate-900/90 border border-blue-900/50 hover:border-blue-500 rounded-xl p-5 shadow-xl space-y-4 cursor-pointer transition-all hover:scale-[1.01] flex flex-col justify-between group"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-sm">NWP Core</h3>
                  <p className="text-[10px] text-blue-400 font-mono">ECMWF / IMD IFS v4.2</p>
                </div>
              </div>
              <ModelBadge type="NWP" weight={nwpWeight.weight} />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400">Skill Index</div>
                <div className="font-bold text-blue-400 text-sm">82/100</div>
              </div>
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400">Current Forecast</div>
                <div className="font-bold text-slate-100 text-sm">{nwpForecast.precipitation} mm</div>
              </div>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              <div className="text-[11px] text-slate-300 font-semibold flex items-center gap-1 text-emerald-400">
                <TrendingUp className="w-3.5 h-3.5" /> Strongest Conditions:
              </div>
              <p className="text-[11px] text-slate-400 font-sans line-clamp-2">
                Large-scale synoptic ridges, extended lead times (&gt;120h), mountainous terrain.
              </p>

              <div className="text-[11px] text-slate-300 font-semibold flex items-center gap-1 text-amber-400 pt-1">
                <TrendingDown className="w-3.5 h-3.5" /> Weakest Conditions:
              </div>
              <p className="text-[11px] text-slate-400 font-sans line-clamp-2">
                Short-range convective initiation (&lt;12h), rapid localized downpours.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Click to inspect details</span>
            <span className="text-blue-400 font-bold group-hover:translate-x-1 transition-transform">Drawer →</span>
          </div>
        </div>

        {/* Card 2: AI WeatherNet */}
        <div
          onClick={() => setSelectedDrawerModel({
            name: 'AI WeatherNet',
            type: 'AI',
            provider: 'ClimoraX AI Core',
            weight: aiWeight.weight,
            skill: '88/100',
            forecast: `${aiForecast.precipitation} mm/h`,
            description: 'Autoregressive deep spatial graph neural network trained on 40 years of ERA5 reanalysis data for real-time inference.',
            strongest: 'Monsoonal precipitation advection, short-range lead times (<48h), boundary-layer thermal inversions.',
            weakest: 'Extended horizons (>120h) where autoregressive error accumulation occurs.',
            rmse: '1.82 °C',
            mae: '1.45 °C',
            bias: '-0.22 hPa',
          })}
          className="bg-slate-900/90 border border-cyan-900/50 hover:border-cyan-500 rounded-xl p-5 shadow-xl space-y-4 cursor-pointer transition-all hover:scale-[1.01] flex flex-col justify-between group"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-400">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-sm">AI WeatherNet</h3>
                  <p className="text-[10px] text-cyan-400 font-mono">Neural Graph Transformer v3.8</p>
                </div>
              </div>
              <ModelBadge type="AI" weight={aiWeight.weight} />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400">Skill Index</div>
                <div className="font-bold text-cyan-400 text-sm">88/100</div>
              </div>
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400">Current Forecast</div>
                <div className="font-bold text-slate-100 text-sm">{aiForecast.precipitation} mm</div>
              </div>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              <div className="text-[11px] text-slate-300 font-semibold flex items-center gap-1 text-emerald-400">
                <TrendingUp className="w-3.5 h-3.5" /> Strongest Conditions:
              </div>
              <p className="text-[11px] text-slate-400 font-sans line-clamp-2">
                Short lead times (&lt;48h), monsoonal rainfall advection, fast GPU inference (1.2s).
              </p>

              <div className="text-[11px] text-slate-300 font-semibold flex items-center gap-1 text-amber-400 pt-1">
                <TrendingDown className="w-3.5 h-3.5" /> Weakest Conditions:
              </div>
              <p className="text-[11px] text-slate-400 font-sans line-clamp-2">
                Extended horizons (&gt;120h) where autoregressive error accumulation occurs.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Click to inspect details</span>
            <span className="text-cyan-400 font-bold group-hover:translate-x-1 transition-transform">Drawer →</span>
          </div>
        </div>

        {/* Card 3: Ensemble Fusion */}
        <div
          onClick={() => setSelectedDrawerModel({
            name: 'Ensemble Fusion (50-M)',
            type: 'ENSEMBLE',
            provider: 'NCMRWF / NCEP',
            weight: ensWeight.weight,
            skill: '85/100',
            forecast: `${ensForecast.precipitation} mm/h`,
            description: '50 perturbed initial condition runs quantifying chaotic divergence, probability density functions, and tail risks.',
            strongest: 'Cyclonic storm track divergence, squall lines, mid-range lead times (48-120h).',
            weakest: 'High-resolution localized micro-scale turbulence.',
            rmse: '1.95 °C',
            mae: '1.52 °C',
            bias: '+0.18 hPa',
          })}
          className="bg-slate-900/90 border border-purple-900/50 hover:border-purple-500 rounded-xl p-5 shadow-xl space-y-4 cursor-pointer transition-all hover:scale-[1.01] flex flex-col justify-between group"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-sm">Ensemble Fusion</h3>
                  <p className="text-[10px] text-purple-400 font-mono">50-Member GEFS Cloud</p>
                </div>
              </div>
              <ModelBadge type="ENSEMBLE" weight={ensWeight.weight} />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400">Skill Index</div>
                <div className="font-bold text-purple-400 text-sm">85/100</div>
              </div>
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400">Current Forecast</div>
                <div className="font-bold text-slate-100 text-sm">{ensForecast.precipitation} mm</div>
              </div>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              <div className="text-[11px] text-slate-300 font-semibold flex items-center gap-1 text-emerald-400">
                <TrendingUp className="w-3.5 h-3.5" /> Strongest Conditions:
              </div>
              <p className="text-[11px] text-slate-400 font-sans line-clamp-2">
                Tropical cyclones, mid-range lead times (48-120h), tail risk probability.
              </p>

              <div className="text-[11px] text-slate-300 font-semibold flex items-center gap-1 text-amber-400 pt-1">
                <TrendingDown className="w-3.5 h-3.5" /> Weakest Conditions:
              </div>
              <p className="text-[11px] text-slate-400 font-sans line-clamp-2">
                Micro-scale boundary layer thermal turbulence.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Click to inspect details</span>
            <span className="text-purple-400 font-bold group-hover:translate-x-1 transition-transform">Drawer →</span>
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE MODEL COMPARISON CHART WITH SIMULATED GROUND TRUTH */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              Interactive Model Comparison vs Ground Truth Observation
            </h3>
            <p className="text-[11px] text-slate-400">
              Includes simulated AWS ground truth observation line for historical backtesting comparison
            </p>
          </div>

          {/* Variable & Horizon Filter Controls */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setActiveVariable('precip')}
                className={`px-3 py-1 rounded transition-colors ${
                  activeVariable === 'precip' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                Rainfall
              </button>
              <button
                onClick={() => setActiveVariable('temp')}
                className={`px-3 py-1 rounded transition-colors ${
                  activeVariable === 'temp' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                Temp
              </button>
              <button
                onClick={() => setActiveVariable('wind')}
                className={`px-3 py-1 rounded transition-colors ${
                  activeVariable === 'wind' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                Wind
              </button>
            </div>

            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              {[6, 12, 24, 48, 72, 120].map((h) => (
                <button
                  key={h}
                  onClick={() => setLeadTimeHours(h)}
                  className={`px-2 py-0.5 rounded font-bold transition-colors ${
                    leadTimeHours === h ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-100'
                  }`}
                >
                  +{h}h
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recharts Chart */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={comparisonTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit={activeVariable === 'precip' ? 'mm/h' : activeVariable === 'temp' ? '°C' : 'km/h'} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#020617',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#f8fafc',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />

              <Line
                type="monotone"
                dataKey={activeVariable === 'precip' ? 'nwpPrecip' : 'nwpTemp'}
                name="NWP Core"
                stroke="#3b82f6"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey={activeVariable === 'precip' ? 'aiPrecip' : 'aiTemp'}
                name="AI WeatherNet"
                stroke="#06b6d4"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey={activeVariable === 'precip' ? 'ensemblePrecip' : 'ensembleTemp'}
                name="Ensemble Fusion"
                stroke="#a855f7"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey={activeVariable === 'precip' ? 'hybridPrecip' : 'hybridTemp'}
                name="ClimoraX Hybrid Consensus"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 3, fill: '#10b981' }}
              />
              <Line
                type="monotone"
                dataKey={activeVariable === 'precip' ? 'observationPrecip' : 'observationTemp'}
                name="Actual Ground Observation (AWS)"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="2 2"
                dot={{ r: 2, fill: '#f59e0b' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. PERFORMANCE SKILL MATRIX TABLE */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <SectionHeader
          title="Multi-Domain Performance Skill Matrix (ETS / Critical Success Index)"
          subtitle="Comparing historical backtest skill scores across regions, seasons, and lead times"
          icon={ShieldCheck}
          badge="DEMO SKILL VALUES"
        />

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950">
                <th className="p-3">Region / Season / Weather Regime / Lead</th>
                <th className="p-3 text-blue-400">NWP Core Skill</th>
                <th className="p-3 text-cyan-400">AI WeatherNet Skill</th>
                <th className="p-3 text-purple-400">Ensemble Skill</th>
                <th className="p-3 text-emerald-400 font-bold bg-emerald-950/20">ClimoraX Hybrid Skill</th>
                <th className="p-3 text-slate-300">Top Performer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {performanceMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-sans font-semibold text-slate-100">{row.row}</td>
                  <td className="p-3 text-blue-300">{row.nwp}</td>
                  <td className="p-3 text-cyan-300">{row.ai}</td>
                  <td className="p-3 text-purple-300">{row.ensemble}</td>
                  <td className="p-3 font-bold text-emerald-300 bg-emerald-950/20">
                    {row.hybrid}
                  </td>
                  <td className="p-3 font-bold text-emerald-400">{row.best}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. HYBRID ADVANTAGE ANIMATED VISUAL FLOW ("Why combine them?") */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-cyan-800/60 rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="text-center space-y-1">
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 uppercase tracking-wider font-bold">
            Adaptive Fusion Architecture
          </span>
          <h2 className="text-lg font-black text-slate-100 font-sans">Why Combine NWP, AI, and Ensemble Models?</h2>
          <p className="text-xs text-slate-400 max-w-2xl mx-auto">
            The ClimoraX Blending Engine does <strong className="text-cyan-300">NOT</strong> simply average predictions. It dynamically weight-adjusts based on physics, pattern memory, and divergence.
          </p>
        </div>

        {/* Visual Flow Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono pt-2">
          <div className="p-4 bg-slate-900 border border-blue-900/60 rounded-xl space-y-2 text-center relative">
            <Server className="w-6 h-6 text-blue-400 mx-auto" />
            <div className="font-bold text-blue-300 text-sm">NWP Core</div>
            <div className="text-[11px] text-slate-400 font-sans">
              Physical fluid dynamics & thermodynamic conservation laws.
            </div>
            <div className="text-[10px] text-blue-400 font-bold pt-1">↓ Physical Modeling</div>
          </div>

          <div className="p-4 bg-slate-900 border border-cyan-900/60 rounded-xl space-y-2 text-center relative">
            <Zap className="w-6 h-6 text-cyan-400 mx-auto" />
            <div className="font-bold text-cyan-300 text-sm">AI WeatherNet</div>
            <div className="text-[11px] text-slate-400 font-sans">
              Neural graph spatial pattern recognition trained on 40-yr ERA5.
            </div>
            <div className="text-[10px] text-cyan-400 font-bold pt-1">↓ Data-Driven Patterns</div>
          </div>

          <div className="p-4 bg-slate-900 border border-purple-900/60 rounded-xl space-y-2 text-center relative">
            <Layers className="w-6 h-6 text-purple-400 mx-auto" />
            <div className="font-bold text-purple-300 text-sm">Ensemble Fusion</div>
            <div className="text-[11px] text-slate-400 font-sans">
              50-member perturbation cloud for tail risk & chaotic divergence.
            </div>
            <div className="text-[10px] text-purple-400 font-bold pt-1">↓ Uncertainty Diversity</div>
          </div>

          <div className="p-4 bg-emerald-950/60 border border-emerald-500/80 rounded-xl space-y-2 text-center shadow-lg shadow-emerald-950/40">
            <Sparkles className="w-6 h-6 text-emerald-400 mx-auto animate-pulse" />
            <div className="font-bold text-emerald-300 text-sm">Adaptive Hybrid</div>
            <div className="text-[11px] text-slate-200 font-sans">
              Dynamically weighted consensus optimized for current regime.
            </div>
            <div className="text-[10px] text-emerald-400 font-bold pt-1">✓ Calibrated Output</div>
          </div>
        </div>
      </div>

      {/* 6. LEAD-TIME SKILL DEGRADATION ANALYSIS CHART */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <SectionHeader
          title="Lead-Time Skill Degradation Curve (6h to 120h)"
          subtitle="Demonstrating how AI leads short range while Ensemble holds mid range and NWP holds long range"
          icon={Clock}
        />

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={leadTimeSkillData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="lead" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[40, 100]} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#020617',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#f8fafc',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="AI" name="AI WeatherNet Skill" stroke="#06b6d4" strokeWidth={2} />
              <Line type="monotone" dataKey="Ensemble" name="Ensemble Fusion Skill" stroke="#a855f7" strokeWidth={2} />
              <Line type="monotone" dataKey="NWP" name="NWP Core Skill" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="Hybrid" name="ClimoraX Hybrid Consensus" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 7. WEATHER REGIME ANALYSIS TABS */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <SectionHeader
          title="Weather Regime Behavior & Dynamic Re-balancing"
          subtitle="Select a synoptic weather regime tab to inspect model weight adaptation"
          icon={SlidersHorizontal}
        />

        {/* Regime Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-mono">
          {(['Normal', 'Heavy Rain', 'Heat Wave', 'High Wind', 'Cyclonic', 'Thunderstorm'] as RegimeTabKey[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveRegimeTab(tab)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeRegimeTab === tab
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Active Regime Detail Box */}
        <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-4 font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <div className="font-bold text-slate-100 text-sm font-sans">Active Regime: {activeRegimeTab}</div>
              <p className="text-slate-400 text-[11px] font-sans mt-0.5">{activeRegimeData.explanation}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400">Dominant Model Recommendation:</span>
              <div className="font-bold text-cyan-400 text-sm">{activeRegimeData.favorable}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-900 rounded-lg border border-blue-900/60 space-y-1">
              <div className="text-blue-400 font-bold flex justify-between">
                <span>NWP Core</span>
                <span>{activeRegimeData.nwpContrib}% Weight</span>
              </div>
              <div className="text-[10px] text-slate-400">Skill Score: {(activeRegimeData.nwpSkill * 100).toFixed(0)}/100</div>
            </div>

            <div className="p-3 bg-slate-900 rounded-lg border border-cyan-900/60 space-y-1">
              <div className="text-cyan-400 font-bold flex justify-between">
                <span>AI WeatherNet</span>
                <span>{activeRegimeData.aiContrib}% Weight</span>
              </div>
              <div className="text-[10px] text-slate-400">Skill Score: {(activeRegimeData.aiSkill * 100).toFixed(0)}/100</div>
            </div>

            <div className="p-3 bg-slate-900 rounded-lg border border-purple-900/60 space-y-1">
              <div className="text-purple-400 font-bold flex justify-between">
                <span>Ensemble Fusion</span>
                <span>{activeRegimeData.ensContrib}% Weight</span>
              </div>
              <div className="text-[10px] text-slate-400">Skill Score: {(activeRegimeData.ensSkill * 100).toFixed(0)}/100</div>
            </div>
          </div>
        </div>
      </div>

      {/* 8. MODEL DETAIL DRAWER */}
      {selectedDrawerModel && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-lg bg-slate-900 border-l border-cyan-800/80 h-full p-6 shadow-2xl overflow-y-auto space-y-5 font-sans">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-100 font-mono">{selectedDrawerModel.name}</h3>
                <p className="text-xs text-cyan-400 font-mono">{selectedDrawerModel.provider}</p>
              </div>
              <button
                onClick={() => setSelectedDrawerModel(null)}
                className="p-1.5 text-slate-400 hover:text-slate-100 rounded bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <div className="text-slate-400 text-[10px]">Architecture Description:</div>
                <p className="text-slate-200 font-sans text-xs leading-relaxed">{selectedDrawerModel.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Current Weight Contribution:</div>
                  <div className="text-cyan-300 font-bold text-sm">{(selectedDrawerModel.weight * 100).toFixed(1)}%</div>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Historical Skill Index:</div>
                  <div className="text-emerald-400 font-bold text-sm">{selectedDrawerModel.skill}</div>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Historical Error Metrics:</div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-1.5 bg-slate-900 rounded">
                    <div className="text-[9px] text-slate-400">RMSE</div>
                    <div className="font-bold text-slate-100">{selectedDrawerModel.rmse}</div>
                  </div>
                  <div className="p-1.5 bg-slate-900 rounded">
                    <div className="text-[9px] text-slate-400">MAE</div>
                    <div className="font-bold text-slate-100">{selectedDrawerModel.mae}</div>
                  </div>
                  <div className="p-1.5 bg-slate-900 rounded">
                    <div className="text-[9px] text-slate-400">BIAS</div>
                    <div className="font-bold text-slate-100">{selectedDrawerModel.bias}</div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1 font-sans">
                <div className="text-emerald-400 text-[10px] font-mono font-bold uppercase">Best Performing Conditions:</div>
                <p className="text-slate-200 text-xs leading-relaxed">{selectedDrawerModel.strongest}</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1 font-sans">
                <div className="text-amber-400 text-[10px] font-mono font-bold uppercase">Current Limitations / Known Drift:</div>
                <p className="text-slate-200 text-xs leading-relaxed">{selectedDrawerModel.weakest}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
