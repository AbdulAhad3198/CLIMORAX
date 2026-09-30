'use client';

import React, { useState } from 'react';
import { useApp } from '@/components/context/AppContext';
import { AppShell } from '@/components/layout/AppShell';
import { WeightDecayChart } from '@/components/charts/WeightDecayChart';
import { calculateModelWeights, classifyWeatherRegime } from '@/lib/simulation/blending-engine';
import { WEATHER_REGIMES } from '@/lib/constants/regimes';
import { SlidersHorizontal, Layers, Cpu, Server, Zap, RefreshCw, BarChart, Info } from 'lucide-react';

export default function WeightsPage() {
  return (
    <AppShell>
      <WeightsPageContent />
    </AppShell>
  );
}

function WeightsPageContent() {
  const { selectedLocation, setSelectedLocation, locations } = useApp();
  const [simLeadTime, setSimLeadTime] = useState<number>(24);
  const [simRegimeKey, setSimRegimeKey] = useState<string>('monsoon');

  const simRegime = WEATHER_REGIMES[simRegimeKey] || WEATHER_REGIMES.monsoon;
  const simWeights = calculateModelWeights(selectedLocation, simLeadTime, simRegime);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-cyan-900/30 pb-4">
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <SlidersHorizontal className="w-6 h-6 text-cyan-400" />
          Dynamic Model Weight Predictor & Spatial Weight Maps
        </h1>
        <p className="text-xs text-slate-400">
          Real-time adaptive weight allocation based on lead-time decay, weather regime, and historical skill
        </p>
      </div>

      {/* Interactive Weight Simulator Console */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              Interactive Blending Simulator
            </h3>
            <p className="text-[11px] text-slate-400">
              Adjust parameters below to see live re-balancing of NWP, AI, and Ensemble weights
            </p>
          </div>

          <div className="text-xs font-mono text-cyan-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-2">
            <span>Formula: Σ(w_i) = 1.0</span>
            <span className="text-slate-500">|</span>
            <span className="text-emerald-400 font-bold">100.0% Normalized</span>
          </div>
        </div>

        {/* Simulator Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800/80">
          {/* Location Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">1. Target Station Location</label>
            <select
              value={selectedLocation.id}
              onChange={(e) => {
                const loc = locations.find((l) => l.id === e.target.value);
                if (loc) setSelectedLocation(loc);
              }}
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs rounded-lg p-2.5 focus:outline-none focus:border-cyan-500 font-mono"
            >
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}, {loc.state} ({loc.climateZone})
                </option>
              ))}
            </select>
          </div>

          {/* Weather Regime Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">2. Synoptic Weather Regime</label>
            <select
              value={simRegimeKey}
              onChange={(e) => setSimRegimeKey(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs rounded-lg p-2.5 focus:outline-none focus:border-cyan-500 font-mono"
            >
              {Object.entries(WEATHER_REGIMES).map(([key, reg]) => (
                <option key={key} value={key}>
                  {reg.name} ({reg.code})
                </option>
              ))}
            </select>
          </div>

          {/* Lead Time Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span>3. Lead Time Horizon:</span>
              <span className="text-cyan-400 font-mono">+{simLeadTime} Hours ({Math.round(simLeadTime/24)} Days)</span>
            </div>
            <input
              type="range"
              min="0"
              max="240"
              step="6"
              value={simLeadTime}
              onChange={(e) => setSimLeadTime(parseInt(e.target.value, 10))}
              className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0h (Nowcast)</span>
              <span>48h</span>
              <span>120h</span>
              <span>240h (Extended)</span>
            </div>
          </div>
        </div>

        {/* Live Weight Output Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {simWeights.map((w) => (
            <div
              key={w.modelId}
              className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: w.color }} />
                  {w.modelName}
                </span>
                <span className="font-mono text-lg font-black" style={{ color: w.color }}>
                  {(w.weight * 100).toFixed(1)}%
                </span>
              </div>

              {/* Bar visualization */}
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-300 rounded-full"
                  style={{ width: `${w.weight * 100}%`, backgroundColor: w.color }}
                />
              </div>

              <div className="text-[11px] text-slate-400 space-y-1 pt-1 font-mono">
                <div className="flex justify-between">
                  <span>Skill Score:</span>
                  <span className="text-slate-200">{w.historicalSkillScore}/100</span>
                </div>
                <div className="flex justify-between">
                  <span>Regime Match:</span>
                  <span className="text-slate-200">{w.regimeSuitability}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Lead Decay Factor:</span>
                  <span className="text-slate-200">{w.leadTimeDecayFactor}x</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lead Time Weight Decay Chart */}
      <WeightDecayChart location={selectedLocation} />

      {/* Regional Weight Allocation Reference Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-400" />
            Regional & Seasonal Model Weight Matrix Across India
          </h3>
          <p className="text-[11px] text-slate-400">
            Pre-computed baseline weights derived from historical backtesting verification datasets
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950 font-mono">
                <th className="p-3">Geographical Zone</th>
                <th className="p-3">Dominant Regime</th>
                <th className="p-3 text-blue-400">NWP Core Weight</th>
                <th className="p-3 text-cyan-400">AI WeatherNet Weight</th>
                <th className="p-3 text-purple-400">Ensemble Weight</th>
                <th className="p-3 text-emerald-400">Hybrid Advantage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-200">
              <tr>
                <td className="p-3 font-sans font-semibold">Gangetic Plains (Delhi/UP/Bihar)</td>
                <td className="p-3 font-sans text-slate-400">Western Disturbance / Smog</td>
                <td className="p-3">35.0%</td>
                <td className="p-3 font-bold text-cyan-300">45.0%</td>
                <td className="p-3">20.0%</td>
                <td className="p-3 text-emerald-400">+26% Inversion Accuracy</td>
              </tr>
              <tr>
                <td className="p-3 font-sans font-semibold">Western Coast (Mumbai/Kerala)</td>
                <td className="p-3 font-sans text-slate-400">Monsoon Low Pressure</td>
                <td className="p-3">28.0%</td>
                <td className="p-3 font-bold text-cyan-300">48.0%</td>
                <td className="p-3">24.0%</td>
                <td className="p-3 text-emerald-400">+31% Rain Detection</td>
              </tr>
              <tr>
                <td className="p-3 font-sans font-semibold">Bay of Bengal Coast (Odisha/WB)</td>
                <td className="p-3 font-sans text-slate-400">Tropical Cyclone Risk</td>
                <td className="p-3">30.0%</td>
                <td className="p-3">25.0%</td>
                <td className="p-3 font-bold text-purple-300">45.0%</td>
                <td className="p-3 text-emerald-400">+28% Track Precision</td>
              </tr>
              <tr>
                <td className="p-3 font-sans font-semibold">Himalayan Region (J&K/Himachal)</td>
                <td className="p-3 font-sans text-slate-400">Mountainous Snow/Orographic</td>
                <td className="p-3 font-bold text-blue-300">52.0%</td>
                <td className="p-3">22.0%</td>
                <td className="p-3">26.0%</td>
                <td className="p-3 text-emerald-400">+22% Topographic Skill</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
