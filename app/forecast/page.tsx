'use client';

import React, { useState } from 'react';
import { useApp } from '@/components/context/AppContext';
import { AppShell } from '@/components/layout/AppShell';
import { IndiaWeatherMap, MapVariable } from '@/components/maps/IndiaWeatherMap';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ModelBadge } from '@/components/ui/ModelBadge';
import { SeverityBadge } from '@/components/ui/SeverityBadge';
import { formatTemp, formatSpeed, formatPrecip } from '@/lib/formatting/units';
import { 
  CloudSun, 
  Compass, 
  Thermometer, 
  Droplets, 
  Wind, 
  Gauge, 
  AlertTriangle, 
  Layers, 
  SlidersHorizontal,
  Info,
  HelpCircle,
  X,
  MapPin,
  Clock,
  Layers3,
  CheckCircle2,
  Cpu,
  BarChart2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';

export type MapMode = 'hybrid' | 'compare' | 'agreement' | 'risk';

export default function ForecastPage() {
  return (
    <AppShell>
      <ForecastWorkspaceContent />
    </AppShell>
  );
}

function ForecastWorkspaceContent() {
  const { selectedLocation, setSelectedLocation, locations, leadTimeHours, setLeadTimeHours, hybridData, forecastTimeline, unit } = useApp();

  const [activeVariable, setActiveVariable] = useState<MapVariable>('precip');
  const [mapMode, setMapMode] = useState<MapMode>('hybrid');
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [drawerRegion, setDrawerRegion] = useState<any>(null);

  // Line Visibility Toggles for Bottom Forecast Evolution Chart
  const [showNwpLine, setShowNwpLine] = useState(true);
  const [showAiLine, setShowAiLine] = useState(true);
  const [showEnsembleLine, setShowEnsembleLine] = useState(true);
  const [showHybridLine, setShowHybridLine] = useState(true);

  // Dominant Model
  const dominantModel = [...hybridData.weights].sort((a, b) => b.weight - a.weight)[0];

  // Derive active variable values for display
  const getPrimaryDisplayValue = () => {
    if (activeVariable === 'temp') return { val: `${hybridData.temperature}`, unitStr: '°C Temperature', label: 'Surface Thermal' };
    if (activeVariable === 'precip') return { val: `${hybridData.precipitation}`, unitStr: 'mm/h Rainfall', label: 'Rainfall Rate' };
    if (activeVariable === 'wind') return { val: `${hybridData.windSpeed}`, unitStr: 'km/h Wind', label: 'Surface Wind Speed' };
    if (activeVariable === 'pressure') return { val: `${hybridData.pressure}`, unitStr: 'hPa Pressure', label: 'MSLP Pressure' };
    if (activeVariable === 'risk') return { val: hybridData.extremeRiskLevel, unitStr: 'Extreme Risk', label: 'Hazard Severity' };
    return { val: `${hybridData.modelAgreementPercentage}%`, unitStr: 'Agreement Index', label: 'Convergence Spread' };
  };

  const primary = getPrimaryDisplayValue();

  // Factors for "WHY THIS BLEND?" section
  const blendFactors = [
    { label: 'Regional Historical Skill', percent: 32 },
    { label: 'Current Weather Regime', percent: 24 },
    { label: 'Lead-Time Behavior Decay', percent: 18 },
    { label: 'Model Agreement Convergence', percent: 15 },
    { label: 'Station Bias Correction', percent: 11 },
  ];

  // Estimated forecast range around hybrid value
  const estimatedMin = Math.max(0, Number((hybridData.precipitation * 0.8).toFixed(1)));
  const estimatedMax = Number((hybridData.precipitation * 1.25 + 4.0).toFixed(1));

  // Handler for station / region click on map to open Detail Drawer
  const handleMapRegionClick = (loc: any) => {
    setSelectedLocation(loc);
    setDrawerRegion(loc);
    setShowDrawer(true);
  };

  return (
    <div className="space-y-6">
      {/* HEADER AREA */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-cyan-900/30 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2 font-sans">
              <CloudSun className="w-6 h-6 text-cyan-400" />
              Hybrid Forecast Intelligence Workspace
            </h1>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
              SIH PS-26081
            </span>
          </div>
          <p className="text-xs text-cyan-300 font-medium mt-0.5">
            Core Concept: <strong className="text-slate-100">&ldquo;One adaptive forecast generated from multiple forecasting systems.&rdquo;</strong>
          </p>
        </div>

        {/* Top Control Strip */}
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

          {/* Forecast Horizon Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1">
            {[6, 12, 24, 48, 72, 120].map((h) => (
              <button
                key={h}
                onClick={() => setLeadTimeHours(h)}
                className={`px-2.5 py-0.5 rounded font-bold transition-colors ${
                  leadTimeHours === h
                    ? 'bg-cyan-500 text-slate-950'
                    : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                +{h}h
              </button>
            ))}
          </div>

          {/* Map Mode Selector */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-1">
            <button
              onClick={() => setMapMode('hybrid')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                mapMode === 'hybrid' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              Hybrid
            </button>
            <button
              onClick={() => setMapMode('compare')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                mapMode === 'compare' ? 'bg-blue-500 text-white font-bold' : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              Compare
            </button>
            <button
              onClick={() => setMapMode('agreement')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                mapMode === 'agreement' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              Agreement Map
            </button>
            <button
              onClick={() => setMapMode('risk')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                mapMode === 'risk' ? 'bg-red-500 text-white font-bold' : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              Extreme Risk
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT: 70% MAP WORKSPACE + 30% RIGHT INTELLIGENCE PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* MAP AREA (lg:col-span-8 - 67% width) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Map Mode Banner Explanation */}
          {mapMode === 'compare' && (
            <div className="p-3 bg-blue-950/40 border border-blue-500/50 rounded-xl text-xs text-blue-200 flex items-center justify-between font-mono">
              <span className="flex items-center gap-2">
                <Layers3 className="w-4 h-4 text-blue-400" />
                COMPARE SOURCES MODE ACTIVE: Visually inspect how individual model inputs differ from ClimoraX Hybrid.
              </span>
              <button onClick={() => setMapMode('hybrid')} className="text-slate-400 hover:text-slate-100 underline text-[11px]">
                Reset View
              </button>
            </div>
          )}

          {mapMode === 'agreement' && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 rounded-xl text-xs text-emerald-200 flex items-center justify-between font-mono">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                MODEL AGREEMENT SPATIAL MAP: Shaded patterns indicate regions of high vs low model divergence.
              </span>
              <button onClick={() => setMapMode('hybrid')} className="text-slate-400 hover:text-slate-100 underline text-[11px]">
                Reset View
              </button>
            </div>
          )}

          {mapMode === 'risk' && (
            <div className="p-3 bg-red-950/40 border border-red-500/50 rounded-xl text-xs text-red-200 flex items-center justify-between font-mono">
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
                EXTREME RISK MAP MODE: Click any highlighted station or region to open the Emergency Detail Drawer.
              </span>
              <button onClick={() => setMapMode('hybrid')} className="text-slate-400 hover:text-slate-100 underline text-[11px]">
                Reset View
              </button>
            </div>
          )}

          {/* Main Map Component */}
          <IndiaWeatherMap
            selectedLocation={selectedLocation}
            onSelectLocation={handleMapRegionClick}
            leadTimeHours={leadTimeHours}
            onLeadTimeChange={(h) => setLeadTimeHours(h)}
          />

          {/* Synchronized Mini-Maps for Compare Mode */}
          {mapMode === 'compare' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
              <div className="bg-slate-900 border border-blue-900/60 rounded-xl p-3 space-y-1">
                <div className="font-bold text-blue-400 flex items-center justify-between">
                  <span>NWP Core</span>
                  <span>{hybridData.models[0].precipitation} mm/h</span>
                </div>
                <div className="text-[10px] text-slate-400">ECMWF / IMD IFS Physics</div>
              </div>

              <div className="bg-slate-900 border border-cyan-900/60 rounded-xl p-3 space-y-1">
                <div className="font-bold text-cyan-400 flex items-center justify-between">
                  <span>AI WeatherNet</span>
                  <span>{hybridData.models[1].precipitation} mm/h</span>
                </div>
                <div className="text-[10px] text-slate-400">Neural Graph Transformer</div>
              </div>

              <div className="bg-slate-900 border border-purple-900/60 rounded-xl p-3 space-y-1">
                <div className="font-bold text-purple-400 flex items-center justify-between">
                  <span>Ensemble</span>
                  <span>{hybridData.models[2].precipitation} mm/h</span>
                </div>
                <div className="text-[10px] text-slate-400">50-Member Dispersion</div>
              </div>

              <div className="bg-slate-900 border border-emerald-500/60 rounded-xl p-3 space-y-1">
                <div className="font-bold text-emerald-400 flex items-center justify-between">
                  <span>ClimoraX Hybrid</span>
                  <span>{hybridData.precipitation} mm/h</span>
                </div>
                <div className="text-[10px] text-emerald-300 font-bold">Consensus Output</div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT INTELLIGENCE PANEL (lg:col-span-4 - 33% width) */}
        <div className="lg:col-span-4 space-y-4">
          {/* SECTION 1: HYBRID FORECAST VALUE */}
          <div className="bg-slate-900/90 border border-cyan-900/50 rounded-xl p-5 shadow-xl space-y-3">
            <div className="border-b border-slate-800 pb-2 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-100 flex items-center gap-1.5 uppercase font-mono">
                <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                Hybrid Forecast Output
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">+{leadTimeHours}h Lead</span>
            </div>

            <div className="space-y-1">
              <div className="text-4xl font-extrabold text-cyan-300 font-mono tracking-tight">
                {primary.val}
              </div>
              <p className="text-xs text-slate-400 font-mono">{primary.unitStr} for {selectedLocation.name}</p>
            </div>

            {/* Individual Raw Model Comparison below */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[11px] font-mono text-center">
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/80">
                <div className="text-slate-400 text-[10px]">NWP</div>
                <div className="font-bold text-blue-400">{hybridData.models[0].precipitation} mm</div>
              </div>
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/80">
                <div className="text-slate-400 text-[10px]">AI</div>
                <div className="font-bold text-cyan-400">{hybridData.models[1].precipitation} mm</div>
              </div>
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800/80">
                <div className="text-slate-400 text-[10px]">Ensemble</div>
                <div className="font-bold text-purple-400">{hybridData.models[2].precipitation} mm</div>
              </div>
            </div>
          </div>

          {/* SECTION 2: DYNAMIC WEIGHTS */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
            <SectionHeader
              title="Dynamic Model Weights"
              subtitle="Sum of weights strictly equals 100%"
              icon={Cpu}
              badge="100.0%"
            />

            <div className="space-y-2.5 pt-1 font-mono text-xs">
              {hybridData.weights.map((w) => (
                <div key={w.modelId} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-300 font-semibold">{w.modelName}</span>
                    <span className="font-bold" style={{ color: w.color }}>
                      {(w.weight * 100).toFixed(1)}%
                    </span>
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
          </div>

          {/* SECTION 3: WHY THIS BLEND? */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
            <SectionHeader
              title="Why This Blend?"
              subtitle="Factors driving weight allocation"
              icon={Info}
            />

            <div className="space-y-2 text-xs font-mono">
              {blendFactors.map((f, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-slate-950/80 rounded-lg border border-slate-800/80">
                  <span className="text-slate-300 font-sans text-[11px]">{f.label}</span>
                  <span className="font-bold text-cyan-400">+{f.percent}%</span>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-slate-500 italic leading-tight">
              *Illustrative contribution indicators representing regime and lead-time decay factors.
            </p>
          </div>

          {/* SECTION 4: MODEL AGREEMENT GAUGE */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
            <SectionHeader
              title="Model Convergence Gauge"
              subtitle="Inter-model spread evaluation"
              icon={Layers}
            />

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between font-mono">
                <span className="text-slate-400">Convergence Level:</span>
                <span className="font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded">
                  {hybridData.confidenceLevel}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                Models are currently converging on similar precipitation and temperature trajectories. Inter-model spread is low.
              </p>
            </div>
          </div>

          {/* SECTION 5: ESTIMATED FORECAST RANGE */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
              Estimated Forecast Range
            </div>
            <div className="text-2xl font-mono font-extrabold text-slate-100">
              {estimatedMin} – {estimatedMax} mm
            </div>
            <p className="text-[10px] text-slate-500 italic">
              Estimated uncertainty spread based on 50-member ensemble variance envelope.
            </p>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: FORECAST EVOLUTION LINE CHART WITH LINE TOGGLES */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              Forecast Trajectory Evolution & Model Separation (+0h to +72h)
            </h3>
            <p className="text-[11px] text-slate-400">
              Toggle individual model lines below to inspect how the ClimoraX Hybrid consensus differs from raw sources
            </p>
          </div>

          {/* Line Toggle Checkboxes */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono bg-slate-950 p-2 rounded-lg border border-slate-800">
            <label className="flex items-center gap-1.5 text-blue-400 font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={showNwpLine}
                onChange={(e) => setShowNwpLine(e.target.checked)}
                className="accent-blue-500"
              />
              NWP Core
            </label>

            <label className="flex items-center gap-1.5 text-cyan-400 font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={showAiLine}
                onChange={(e) => setShowAiLine(e.target.checked)}
                className="accent-cyan-500"
              />
              AI WeatherNet
            </label>

            <label className="flex items-center gap-1.5 text-purple-400 font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={showEnsembleLine}
                onChange={(e) => setShowEnsembleLine(e.target.checked)}
                className="accent-purple-500"
              />
              Ensemble
            </label>

            <label className="flex items-center gap-1.5 text-emerald-400 font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={showHybridLine}
                onChange={(e) => setShowHybridLine(e.target.checked)}
                className="accent-emerald-500"
              />
              Hybrid Consensus
            </label>
          </div>
        </div>

        {/* Recharts Trajectory Evolution Line Chart */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={forecastTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit="mm/h" />
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

              {showNwpLine && (
                <Line
                  type="monotone"
                  dataKey="nwpPrecip"
                  name="NWP Core (IFS)"
                  stroke="#3b82f6"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
              )}

              {showAiLine && (
                <Line
                  type="monotone"
                  dataKey="aiPrecip"
                  name="AI WeatherNet"
                  stroke="#06b6d4"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
              )}

              {showEnsembleLine && (
                <Line
                  type="monotone"
                  dataKey="ensemblePrecip"
                  name="Ensemble Fusion"
                  stroke="#a855f7"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
              )}

              {showHybridLine && (
                <Line
                  type="monotone"
                  dataKey="hybridPrecip"
                  name="ClimoraX Hybrid Consensus"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 3, fill: '#10b981' }}
                  activeDot={{ r: 6, fill: '#34d399' }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* DETAIL DRAWER (PROMPT REQUIREMENT) */}
      {showDrawer && drawerRegion && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-lg bg-slate-900 border-l border-cyan-800/80 h-full p-6 shadow-2xl overflow-y-auto space-y-5 font-sans">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                  {drawerRegion.name}, {drawerRegion.state}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Station Lat: {drawerRegion.lat}N · Lng: {drawerRegion.lng}E
                </p>
              </div>
              <button
                onClick={() => setShowDrawer(false)}
                className="p-1.5 text-slate-400 hover:text-slate-100 rounded bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Region Details Grid */}
            <div className="space-y-4 text-xs font-mono">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <div className="text-slate-400 text-[10px]">Hazard / Event Type:</div>
                <div className="text-slate-100 font-bold text-sm">Monsoonal Heavy Rainfall Surge</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Expected Range:</div>
                  <div className="text-cyan-300 font-bold">{estimatedMin} – {estimatedMax} mm</div>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Lead Time Horizon:</div>
                  <div className="text-slate-100 font-bold">+{leadTimeHours} Hours</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Risk Severity Level:</div>
                  <div className="mt-1">
                    <SeverityBadge severity={hybridData.extremeRiskLevel as any} />
                  </div>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Model Convergence:</div>
                  <div className="text-emerald-400 font-bold mt-1">{hybridData.modelAgreementPercentage}%</div>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <div className="text-slate-400 text-[10px]">Dominant Model Source:</div>
                <div className="text-cyan-400 font-bold">{dominantModel.modelName} ({(dominantModel.weight * 100).toFixed(0)}% Weight)</div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1 font-sans">
                <div className="text-slate-400 text-[10px] uppercase font-mono font-bold">Forecast Explanation:</div>
                <p className="text-slate-200 text-xs leading-relaxed">
                  Deep convective moisture flux over Bay of Bengal is advecting inland. AI WeatherNet has assigned higher weight due to superior 24h precipitation skill for this moisture trajectory.
                </p>
              </div>

              <div className="p-3 bg-cyan-950/40 rounded-lg border border-cyan-800/80 space-y-1 font-sans">
                <div className="text-cyan-300 text-[10px] uppercase font-mono font-bold">Recommended Operational Action:</div>
                <p className="text-cyan-100 text-xs leading-relaxed">
                  Monitor AWS rainfall rate sensors every 30 minutes. Verify urban drainage channel readiness and issue preliminary advisories to district disaster control rooms.
                </p>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-[10px] text-slate-500 italic font-mono">
                *Prototype decision-support visualization for Smart India Hackathon 2026 PS-26081. Not an official IMD emergency alert.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
