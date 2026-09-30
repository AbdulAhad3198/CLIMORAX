'use client';

import React, { useState } from 'react';
import { useApp } from '@/components/context/AppContext';
import { AppShell } from '@/components/layout/AppShell';
import { IndiaWeatherMap, MapVariable } from '@/components/maps/IndiaWeatherMap';
import { ModelComparisonChart } from '@/components/charts/ModelComparisonChart';
import { MetricCard } from '@/components/ui/MetricCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SeverityBadge } from '@/components/ui/SeverityBadge';
import { ModelBadge } from '@/components/ui/ModelBadge';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { formatTemp, formatSpeed, formatPrecip, getWindCompass } from '@/lib/formatting/units';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Gauge, 
  ShieldAlert, 
  Activity, 
  Layers, 
  Cpu, 
  SlidersHorizontal,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  MapPin,
  Clock,
  Compass,
  FileText,
  Info,
  Zap,
  Check
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <AppShell>
      <CommandCenterContent />
    </AppShell>
  );
}

function CommandCenterContent() {
  const { 
    selectedLocation, 
    setSelectedLocation, 
    locations, 
    leadTimeHours, 
    setLeadTimeHours, 
    hybridData, 
    forecastTimeline, 
    unit, 
    lastUpdated 
  } = useApp();

  const [activeTimelineVariable, setActiveTimelineVariable] = useState<'temp' | 'precip' | 'wind'>('temp');

  // Sparkline data series
  const tempSparkline = forecastTimeline.map((f) => f.hybridTemp);
  const precipSparkline = forecastTimeline.map((f) => f.hybridPrecip);
  const agreementSparkline = forecastTimeline.map((f) => f.agreement);

  // Dominant model derived from highest weight
  const dominantModel = [...hybridData.weights].sort((a, b) => b.weight - a.weight)[0];

  // Active risks derived from regional hazards
  const activeRisksList = [
    {
      type: 'Heavy Rain',
      region: 'Maharashtra (Konkan)',
      leadTime: '18h',
      confidence: 82,
      severity: 'EMERGENCY' as const,
    },
    {
      type: 'High Wind',
      region: 'Gujarat Coast',
      leadTime: '27h',
      confidence: 74,
      severity: 'WARNING' as const,
    },
    {
      type: 'Heat Risk',
      region: 'Rajasthan & Delhi',
      leadTime: '42h',
      confidence: 68,
      severity: 'ADVISORY' as const,
    },
  ];

  // Regional Risk Table rows
  const regionalRiskTable = [
    {
      region: 'Gangetic Plains (Delhi / UP)',
      event: 'Thermal Ridge Surge',
      lead: '+24h',
      severity: 'HIGH' as const,
      confidence: 86,
      dominantModel: 'NWP Core',
      status: 'MONITORING',
    },
    {
      region: 'Konkan Coast (Mumbai / Goa)',
      event: 'Monsoonal Downpour',
      lead: '+18h',
      severity: 'SEVERE' as const,
      confidence: 88,
      dominantModel: 'AI WeatherNet',
      status: 'PROTOCOL DEPLOYED',
    },
    {
      region: 'Bay of Bengal Coast (Odisha)',
      event: 'Coastal Squall Winds',
      lead: '+36h',
      severity: 'MODERATE' as const,
      confidence: 79,
      dominantModel: 'Ensemble Fusion',
      status: 'ADVISORY ACTIVE',
    },
    {
      region: 'Himalayan Belt (Srinagar / J&K)',
      event: 'Western Disturbance Rain',
      lead: '+48h',
      severity: 'MODERATE' as const,
      confidence: 81,
      dominantModel: 'NWP Core',
      status: 'STANDBY',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. HEADER AREA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyan-900/30 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-100 font-sans tracking-tight">Command Center</h1>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
              NATIONAL-SCALE DEPLOYMENT
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Adaptive multi-model weather intelligence & early disaster risk detection
          </p>
        </div>

        {/* Header Right Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          {/* Location Selector */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-lg">
            <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <select
              value={selectedLocation.id}
              onChange={(e) => {
                const loc = locations.find((l) => l.id === e.target.value);
                if (loc) setSelectedLocation(loc);
              }}
              className="bg-transparent text-slate-100 font-semibold focus:outline-none cursor-pointer pr-1 font-sans"
            >
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id} className="bg-slate-900 text-slate-100">
                  {loc.name}, {loc.state}
                </option>
              ))}
            </select>
          </div>

          {/* Horizon Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1">
            {[6, 12, 24, 48, 72, 120].map((h) => (
              <button
                key={h}
                onClick={() => setLeadTimeHours(h)}
                className={`px-2 py-0.5 rounded font-bold transition-colors ${
                  leadTimeHours === h
                    ? 'bg-cyan-500 text-slate-950'
                    : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                +{h}h
              </button>
            ))}
          </div>

          {/* Timestamp */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-lg text-slate-400">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lastUpdated}</span>
          </div>

          {/* DEMO DATA Badge */}
          <span className="bg-slate-950 text-slate-400 border border-slate-800 px-2 py-1 rounded-lg text-[10px] font-bold">
            DEMO DATA
          </span>
        </div>
      </div>

      {/* 2. HERO WEATHER SUMMARY PANEL */}
      <div className="bg-slate-900/90 border border-cyan-900/40 rounded-2xl p-5 shadow-2xl space-y-4 relative overflow-hidden backdrop-blur-md">
        {/* Background Atmospheric Motion Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/10 via-blue-600/5 to-transparent rounded-full filter blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          {/* Current Location & Regime */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-slate-100 font-sans tracking-tight">
                {selectedLocation.name}, {selectedLocation.state}
              </span>
              <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/80 border border-cyan-800 px-2 py-0.5 rounded">
                Elevation {selectedLocation.elevation}m · {selectedLocation.climateZone}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300">
              <span className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-purple-400" />
                Regime: <strong className="text-purple-300 font-sans">{hybridData.regime.name}</strong> ({hybridData.regime.code})
              </span>
              <span className="text-slate-600">|</span>
              <span>Favors: <strong className="text-cyan-400">{hybridData.regime.favorableModelType} Models</strong></span>
            </div>
          </div>

          {/* System Hybrid Forecast Confidence */}
          <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-4 flex items-center gap-4 shrink-0 shadow-inner">
            <div className="text-center font-mono">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                Hybrid Forecast Confidence
              </div>
              <div className="text-3xl font-extrabold text-emerald-400 tracking-tight mt-0.5">
                {hybridData.confidenceScore}%
              </div>
              <div className="text-[10px] text-emerald-300 font-semibold">{hybridData.confidenceLevel}</div>
            </div>

            <div className="border-l border-slate-800 pl-4 space-y-1 text-[11px] text-slate-400 font-mono">
              <p className="max-w-[210px] leading-tight text-slate-300">
                Calibrated system convergence index derived from model agreement spread.
              </p>
              <div className="text-[10px] text-slate-500 italic">
                *Indicates model stability, not literal certainty
              </div>
            </div>
          </div>
        </div>

        {/* Primary Operational Measurements Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2 border-t border-slate-800/80 text-xs font-mono">
          <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800/60 space-y-0.5">
            <div className="text-slate-400 text-[10px] flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-cyan-400" /> Temperature
            </div>
            <div className="text-slate-100 font-bold text-sm">
              {formatTemp(hybridData.temperature, unit)}
            </div>
            <div className="text-[10px] text-slate-400">Feels like {formatTemp(hybridData.temperature + 1.2, unit)}</div>
          </div>

          <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800/60 space-y-0.5">
            <div className="text-slate-400 text-[10px] flex items-center gap-1">
              <Droplets className="w-3 h-3 text-blue-400" /> Precipitation
            </div>
            <div className="text-slate-100 font-bold text-sm">
              {formatPrecip(hybridData.precipitation)}
            </div>
            <div className="text-[10px] text-slate-400">Monsoonal Trough</div>
          </div>

          <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800/60 space-y-0.5">
            <div className="text-slate-400 text-[10px] flex items-center gap-1">
              <Wind className="w-3 h-3 text-purple-400" /> Wind Velocity
            </div>
            <div className="text-slate-100 font-bold text-sm">
              {formatSpeed(hybridData.windSpeed)}
            </div>
            <div className="text-[10px] text-slate-400">{getWindCompass(hybridData.windDirection)} ({hybridData.windDirection}°)</div>
          </div>

          <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800/60 space-y-0.5">
            <div className="text-slate-400 text-[10px] flex items-center gap-1">
              <Gauge className="w-3 h-3 text-amber-400" /> Pressure
            </div>
            <div className="text-slate-100 font-bold text-sm">
              {hybridData.pressure} hPa
            </div>
            <div className="text-[10px] text-slate-400">Station MSLP</div>
          </div>

          <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800/60 space-y-0.5">
            <div className="text-slate-400 text-[10px]">Humidity</div>
            <div className="text-slate-100 font-bold text-sm">
              {hybridData.humidity}%
            </div>
            <div className="text-[10px] text-slate-400">Dew Pt {formatTemp(hybridData.dewPoint, unit)}</div>
          </div>

          <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800/60 space-y-0.5">
            <div className="text-slate-400 text-[10px]">Model Agreement</div>
            <div className="text-emerald-400 font-bold text-sm">
              {hybridData.modelAgreementPercentage}%
            </div>
            <div className="text-[10px] text-slate-400">3 Models Converging</div>
          </div>
        </div>
      </div>

      {/* 3. MAIN MAP & 4. RIGHT-SIDE INTELLIGENCE PANEL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: India Hybrid Forecast Map */}
        <div className="lg:col-span-2">
          <IndiaWeatherMap
            selectedLocation={selectedLocation}
            onSelectLocation={(loc) => setSelectedLocation(loc)}
            leadTimeHours={leadTimeHours}
            onLeadTimeChange={(h) => setLeadTimeHours(h)}
          />
        </div>

        {/* Right 1 Column: Intelligence Cards */}
        <div className="space-y-4 flex flex-col justify-between">
          {/* Card A: Active Risks List */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl space-y-3">
            <SectionHeader
              title="Active Regional Hazards"
              subtitle="Detected early risk signals"
              icon={ShieldAlert}
              badge={`${activeRisksList.length} Active`}
            />

            <div className="space-y-2 text-xs">
              {activeRisksList.map((risk, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg flex items-center justify-between font-mono"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200">{risk.type}</span>
                      <SeverityBadge severity={risk.severity} />
                    </div>
                    <div className="text-[10px] text-slate-400 font-sans">{risk.region}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-slate-400">+{risk.leadTime} Lead</div>
                    <div className="font-bold text-cyan-400">{risk.confidence}% Conf</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card B: Model Intelligence Contribution Bars */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl space-y-3">
            <SectionHeader
              title="Model Intelligence Contribution"
              subtitle="Live dynamic weight distribution"
              icon={Cpu}
            />

            <div className="space-y-3 mt-2">
              {hybridData.weights.map((w) => (
                <div key={w.modelId} className="space-y-1 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-300 font-semibold">{w.modelName}</span>
                    <span className="font-bold text-cyan-400">{(w.weight * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full transition-all duration-500 rounded-full"
                      style={{ width: `${w.weight * 100}%`, backgroundColor: w.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800/80 text-[11px] text-slate-300 font-sans leading-relaxed">
              <strong className="text-cyan-400">{dominantModel.modelName}</strong> currently has the highest contribution ({(dominantModel.weight * 100).toFixed(0)}%) due to optimal spatial skill for current weather regime.
            </div>
          </div>

          {/* Card C: Model Agreement Convergence */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl space-y-3">
            <SectionHeader
              title="Model Convergence & Uncertainty"
              subtitle="Ensemble member divergence"
              icon={Layers}
            />

            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-mono">Disagreement Level:</span>
                <span className="font-bold font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded">
                  HIGH CONVERGENCE
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Models are currently converging on similar rainfall and temperature estimates. Forecast uncertainty is low for short horizon.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. FORECAST TIMELINE CHART */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <SectionHeader
          title="Multi-Model Forecast Timeline (+0h to +72h)"
          subtitle={`Comparing NWP, AI, and Ensemble predictions for ${selectedLocation.name}`}
          icon={Clock}
          action={
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setActiveTimelineVariable('temp')}
                className={`px-3 py-1 rounded transition-colors ${
                  activeTimelineVariable === 'temp' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                Temp
              </button>
              <button
                onClick={() => setActiveTimelineVariable('precip')}
                className={`px-3 py-1 rounded transition-colors ${
                  activeTimelineVariable === 'precip' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                Rainfall
              </button>
              <button
                onClick={() => setActiveTimelineVariable('wind')}
                className={`px-3 py-1 rounded transition-colors ${
                  activeTimelineVariable === 'wind' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                Wind
              </button>
            </div>
          }
        />

        <ModelComparisonChart data={forecastTimeline} />
      </div>

      {/* 6. BOTTOM OPERATIONAL SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Forecast Summary Statement & Regional Risk Table (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Box */}
          <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-slate-900 border border-cyan-800/60 rounded-xl p-4 shadow-xl space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold font-mono">
              <FileText className="w-4 h-4" />
              OPERATIONAL FORECAST SUMMARY STATEMENT
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              Operational guidance for <strong>{selectedLocation.name}</strong> indicates elevated monsoonal moisture advection over the next 24-48 hours. Blended consensus recommends maintaining urban drainage readiness and monitoring coastal wind advisories. Model agreement remains high ({hybridData.modelAgreementPercentage}%).
            </p>
          </div>

          {/* Regional Risk Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
            <SectionHeader
              title="Pan-India Regional Risk Matrix"
              subtitle="Operational hazard monitor across major geographic sectors"
              icon={ShieldAlert}
            />

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 bg-slate-950">
                    <th className="p-3">Region</th>
                    <th className="p-3">Event</th>
                    <th className="p-3">Lead</th>
                    <th className="p-3">Severity</th>
                    <th className="p-3">Confidence</th>
                    <th className="p-3">Dominant Model</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {regionalRiskTable.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-sans font-semibold text-slate-100">{row.region}</td>
                      <td className="p-3 text-cyan-300">{row.event}</td>
                      <td className="p-3 text-slate-400">{row.lead}</td>
                      <td className="p-3">
                        <SeverityBadge severity={row.severity} />
                      </td>
                      <td className="p-3 text-emerald-400 font-bold">{row.confidence}%</td>
                      <td className="p-3 text-slate-300">{row.dominantModel}</td>
                      <td className="p-3">
                        <StatusBadge status="OPERATIONAL" label={row.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Model Performance Snapshot & Recent Alerts Feed (1 Col) */}
        <div className="space-y-6">
          {/* Performance Snapshot */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
            <SectionHeader
              title="Verification Performance"
              subtitle="24h backtest skill metrics vs observations"
              icon={CheckCircle2}
            />

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 flex justify-between">
                <span className="text-slate-400">RMSE Error:</span>
                <span className="font-bold text-emerald-400">1.38 °C (-24%)</span>
              </div>
              <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 flex justify-between">
                <span className="text-slate-400">Threat Score (ETS):</span>
                <span className="font-bold text-cyan-400">0.72 (+22%)</span>
              </div>
              <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 flex justify-between">
                <span className="text-slate-400">Probability Score:</span>
                <span className="font-bold text-purple-400">0.84 CRPS</span>
              </div>
            </div>

            <Link
              href="/verification"
              className="block text-center py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors border border-slate-700 mt-2 font-sans"
            >
              View Full Backtesting Scorecards →
            </Link>
          </div>

          {/* Recent Alerts Feed */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
            <SectionHeader
              title="Operational Hazard Feed"
              subtitle="Live dispatch alerts"
              icon={AlertTriangle}
            />

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-red-950/30 border border-red-500/40 rounded-lg space-y-1">
                <div className="font-bold text-red-300">Monsoonal Downpour Advisory</div>
                <div className="text-[11px] text-slate-300 font-sans">
                  Target: {selectedLocation.name} · Heavy rain &gt;15 mm/h predicted for +24h.
                </div>
              </div>

              <div className="p-3 bg-amber-950/30 border border-amber-500/40 rounded-lg space-y-1">
                <div className="font-bold text-amber-300">Squall Wind Caution</div>
                <div className="text-[11px] text-slate-300 font-sans">
                  Coastal gusts exceeding 35 km/h along Western Ghats.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
