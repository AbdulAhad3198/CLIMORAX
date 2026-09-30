'use client';

import React, { useState } from 'react';
import { useApp } from '@/components/context/AppContext';
import { AppShell } from '@/components/layout/AppShell';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { 
  BarChart3, 
  CheckCircle2, 
  TrendingUp, 
  Award, 
  ShieldCheck, 
  FileCheck, 
  Calendar, 
  MapPin, 
  Clock, 
  Info, 
  SlidersHorizontal,
  HelpCircle,
  Database,
  ArrowRight,
  Sparkles,
  BarChart,
  PieChart
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  LineChart, 
  BarChart as RechartsBarChart,
  Bar,
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';

export type VerificationVar = 'Rainfall' | 'Temperature' | 'Wind';
export type VerificationRegime = 'Normal' | 'Heavy Rain' | 'Heat Wave' | 'High Wind' | 'Cyclonic';

export default function VerificationPage() {
  return (
    <AppShell>
      <VerificationPageContent />
    </AppShell>
  );
}

function VerificationPageContent() {
  const { forecastTimeline } = useApp();

  const [activeVar, setActiveVar] = useState<VerificationVar>('Rainfall');
  const [selectedRegion, setSelectedRegion] = useState('India (National)');
  const [selectedPeriod, setSelectedPeriod] = useState('30 days');
  const [selectedLead, setSelectedLead] = useState('24h');
  const [activeRegime, setActiveRegime] = useState<VerificationRegime>('Heavy Rain');

  // Main Performance Table Data
  const performanceTable = [
    { model: 'NWP Core (IFS/IMD)', mae: '1.68', rmse: '2.14', bias: '+0.45', skill: '0.74', status: 'BASELINE' },
    { model: 'AI WeatherNet', mae: '1.45', rmse: '1.82', bias: '-0.22', skill: '0.82', status: 'FAST INFERENCE' },
    { model: 'Ensemble Fusion (50-M)', mae: '1.52', rmse: '1.95', bias: '+0.18', skill: '0.79', status: 'TAIL RISK' },
    { model: 'ClimoraX Hybrid Consensus', mae: '1.08', rmse: '1.38', bias: '+0.03', skill: '0.89', status: 'HYBRID OPTIMAL' },
  ];

  // Error Histogram Distribution Data (Error Delta Bins)
  const errorHistogramData = [
    { bin: '-3.0 or less', NWP: 8, AI: 4, Ensemble: 6, Hybrid: 2 },
    { bin: '-2.0 to -1.0', NWP: 18, AI: 14, Ensemble: 16, Hybrid: 6 },
    { bin: '-1.0 to 0.0', NWP: 32, AI: 42, Ensemble: 36, Hybrid: 48 },
    { bin: '0.0 to +1.0', NWP: 30, AI: 38, Ensemble: 34, Hybrid: 42 },
    { bin: '+1.0 to +2.0', NWP: 22, AI: 12, Ensemble: 18, Hybrid: 5 },
    { bin: '+3.0 or more', NWP: 12, AI: 6, Ensemble: 8, Hybrid: 1 },
  ];

  // Lead Time Error Evolution Data (+6h to +120h)
  const leadTimeErrorData = [
    { lead: '6h', NWP: 1.4, AI: 0.9, Ensemble: 1.2, Hybrid: 0.8 },
    { lead: '12h', NWP: 1.6, AI: 1.1, Ensemble: 1.4, Hybrid: 0.9 },
    { lead: '24h', NWP: 1.9, AI: 1.4, Ensemble: 1.6, Hybrid: 1.1 },
    { lead: '48h', NWP: 2.3, AI: 2.1, Ensemble: 1.9, Hybrid: 1.5 },
    { lead: '72h', NWP: 2.8, AI: 2.9, Ensemble: 2.3, Hybrid: 2.0 },
    { lead: '120h', NWP: 3.4, AI: 3.9, Ensemble: 2.9, Hybrid: 2.6 },
  ];

  // Regime metrics mapping
  const regimeMetricsMap: Record<VerificationRegime, {
    nwpMAE: string; aiMAE: string; ensMAE: string; hybridMAE: string;
    nwpCSI: string; aiCSI: string; ensCSI: string; hybridCSI: string;
    explanation: string;
  }> = {
    'Normal': {
      nwpMAE: '1.2 °C', aiMAE: '0.9 °C', ensMAE: '1.1 °C', hybridMAE: '0.8 °C',
      nwpCSI: '0.78', aiCSI: '0.88', ensCSI: '0.82', hybridCSI: '0.91',
      explanation: 'Under normal seasonal flow, AI WeatherNet and Hybrid show minimal deviation from AWS ground truth.',
    },
    'Heavy Rain': {
      nwpMAE: '3.8 mm', aiMAE: '2.4 mm', ensMAE: '2.9 mm', hybridMAE: '1.9 mm',
      nwpCSI: '0.52', aiCSI: '0.71', ensCSI: '0.64', hybridCSI: '0.78',
      explanation: 'Heavy monsoonal precipitation shows non-linear spatial moisture advection; Hybrid consensus reduces peak overestimation bias.',
    },
    'Heat Wave': {
      nwpMAE: '1.1 °C', aiMAE: '1.6 °C', ensMAE: '1.4 °C', hybridMAE: '0.9 °C',
      nwpCSI: '0.84', aiCSI: '0.72', ensCSI: '0.79', hybridCSI: '0.88',
      explanation: 'High pressure thermal ridges favor NWP hydrostatic equation solvers; Hybrid increases NWP weight during heatwaves.',
    },
    'High Wind': {
      nwpMAE: '4.2 km/h', aiMAE: '4.8 km/h', ensMAE: '3.1 km/h', hybridMAE: '2.6 km/h',
      nwpCSI: '0.61', aiCSI: '0.58', ensCSI: '0.74', hybridCSI: '0.81',
      explanation: 'Squall wind gusts exhibit turbulent dispersion; 50-member Ensemble provides superior variance bounds.',
    },
    'Cyclonic': {
      nwpMAE: '5.1 mm', aiMAE: '5.8 mm', ensMAE: '3.6 mm', hybridMAE: '2.9 mm',
      nwpCSI: '0.55', aiCSI: '0.49', ensCSI: '0.78', hybridCSI: '0.84',
      explanation: 'Tropical cyclone landfall track divergence is captured best by multi-member perturbation dispersion.',
    },
  };

  const activeRegimeMetrics = regimeMetricsMap[activeRegime];

  // Time Series comparison data with simulated AWS ground truth
  const verificationTimeSeries = forecastTimeline.map((pt, idx) => ({
    time: pt.time,
    hybrid: pt.hybridPrecip,
    nwp: pt.nwpPrecip,
    ai: pt.aiPrecip,
    ensemble: pt.ensemblePrecip,
    observation: Number((pt.hybridPrecip + (idx % 2 === 0 ? 0.3 : -0.2)).toFixed(1)),
  }));

  return (
    <div className="space-y-6">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-900/30 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2 font-sans">
              <BarChart3 className="w-6 h-6 text-cyan-400" />
              Forecast Verification & Backtesting Scorecards
            </h1>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
              DETERMINISTIC SIMULATED METRICS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Measure model performance against historical observations using standard meteorological verification metrics.
          </p>
        </div>
      </div>

      {/* 2. TOP FILTERS */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-3">
          {/* Variable Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 font-bold">Variable:</span>
            <select
              value={activeVar}
              onChange={(e) => setActiveVar(e.target.value as VerificationVar)}
              className="bg-transparent text-slate-100 font-bold focus:outline-none cursor-pointer"
            >
              <option value="Rainfall" className="bg-slate-900">Rainfall (mm)</option>
              <option value="Temperature" className="bg-slate-900">Temperature (°C)</option>
              <option value="Wind" className="bg-slate-900">Wind Speed (km/h)</option>
            </select>
          </div>

          {/* Region Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-transparent text-slate-100 font-bold focus:outline-none cursor-pointer"
            >
              <option value="India (National)" className="bg-slate-900">India (National Grid)</option>
              <option value="Maharashtra" className="bg-slate-900">Maharashtra (Konkan)</option>
              <option value="Delhi NCR" className="bg-slate-900">Delhi NCR</option>
              <option value="Rajasthan" className="bg-slate-900">Rajasthan (Arid)</option>
              <option value="Kerala" className="bg-slate-900">Kerala (Monsoon Coast)</option>
              <option value="Odisha" className="bg-slate-900">Odisha (Bay Sector)</option>
              <option value="Jammu & Kashmir" className="bg-slate-900">Jammu & Kashmir</option>
            </select>
          </div>

          {/* Period Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-transparent text-slate-100 font-bold focus:outline-none cursor-pointer"
            >
              <option value="7 days" className="bg-slate-900">Last 7 Days</option>
              <option value="30 days" className="bg-slate-900">Last 30 Days</option>
              <option value="3 months" className="bg-slate-900">Last 3 Months</option>
              <option value="1 year" className="bg-slate-900">Last 1 Year</option>
            </select>
          </div>
        </div>

        {/* Lead Horizon Selector */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <span className="text-slate-400 text-[10px] px-1 font-bold">Horizon:</span>
          {['6h', '24h', '48h', '72h', '120h'].map((lead) => (
            <button
              key={lead}
              onClick={() => setSelectedLead(lead)}
              className={`px-2 py-0.5 rounded font-bold transition-colors ${
                selectedLead === lead ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              +{lead}
            </button>
          ))}
        </div>
      </div>

      {/* 3. MAIN PERFORMANCE TABLE */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <SectionHeader
          title={`Main Performance Matrix (${activeVar} / +${selectedLead} Lead / ${selectedPeriod})`}
          subtitle="Deterministic evaluation metrics compared against automatic weather station ground truth"
          icon={FileCheck}
          badge="DETERMINISTIC SIMULATION"
        />

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950">
                <th className="p-3">Forecast Source / Model</th>
                <th className="p-3">MAE</th>
                <th className="p-3">RMSE</th>
                <th className="p-3">Systematic Bias</th>
                <th className="p-3">Skill Score (ETS)</th>
                <th className="p-3">Evaluation Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {performanceTable.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-sans font-semibold text-slate-100">{row.model}</td>
                  <td className="p-3 text-cyan-300">{row.mae}</td>
                  <td className="p-3 text-cyan-300">{row.rmse}</td>
                  <td className="p-3 text-purple-300">{row.bias}</td>
                  <td className="p-3 font-bold text-emerald-400">{row.skill}</td>
                  <td className="p-3">
                    <StatusBadge status="OPERATIONAL" label={row.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. METRICS CARDS & PROBABILISTIC SCORES */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
          <div className="text-slate-400 text-[10px] uppercase font-bold flex items-center justify-between">
            <span>Rainfall Metrics (CSI / ETS)</span>
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-extrabold text-emerald-400">0.78 CSI</div>
          <p className="text-[10px] text-slate-400 font-sans">
            Critical Success Index measuring precipitation detection accuracy relative to random chance.
          </p>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
          <div className="text-slate-400 text-[10px] uppercase font-bold flex items-center justify-between">
            <span>Probability of Detection (POD)</span>
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-extrabold text-cyan-400">0.86 POD</div>
          <p className="text-[10px] text-slate-400 font-sans">
            Ratio of correctly forecasted severe rainfall events to total observed occurrences.
          </p>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
          <div className="text-slate-400 text-[10px] uppercase font-bold flex items-center justify-between">
            <span>False Alarm Ratio (FAR)</span>
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-extrabold text-purple-400">0.14 FAR</div>
          <p className="text-[10px] text-slate-400 font-sans">
            Proportion of forecasted extreme events that did not occur in ground truth.
          </p>
        </div>

        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
          <div className="text-slate-400 text-[10px] uppercase font-bold flex items-center justify-between">
            <span>Probabilistic Score (CRPS)</span>
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-extrabold text-emerald-400">0.84 CRPS</div>
          <p className="text-[10px] text-slate-400 font-sans">
            Continuous Ranked Probability Score evaluating full probability distribution calibration.
          </p>
        </div>
      </div>

      {/* 5. ERROR DISTRIBUTION & BIAS VISUALIZATION SECTION */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <SectionHeader
          title="Error Distribution & Systematic Bias Spread Histogram"
          subtitle="Frequency distribution of error deltas (Forecast minus AWS Observation) highlighting central peak clustering"
          icon={BarChart}
        />

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={errorHistogramData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="bin" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit=" samples" />
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
              <Bar dataKey="NWP" name="NWP Core Error Delta" fill="#3b82f6" opacity={0.7} />
              <Bar dataKey="AI" name="AI WeatherNet Error Delta" fill="#06b6d4" opacity={0.7} />
              <Bar dataKey="Ensemble" name="Ensemble Fusion Error Delta" fill="#a855f7" opacity={0.7} />
              <Bar dataKey="Hybrid" name="ClimoraX Hybrid Consensus" fill="#10b981" />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 6. MAIN VERIFICATION TIME-SERIES CHART */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <SectionHeader
          title="Time-Series Verification vs Ground Truth Observation (AWS)"
          subtitle={`Comparing individual model outputs and hybrid consensus against actual station telemetry for ${selectedRegion}`}
          icon={BarChart3}
        />

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={verificationTimeSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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

              <Line type="monotone" dataKey="nwp" name="NWP Core" stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
              <Line type="monotone" dataKey="ai" name="AI WeatherNet" stroke="#06b6d4" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
              <Line type="monotone" dataKey="ensemble" name="Ensemble Fusion" stroke="#a855f7" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
              <Line type="monotone" dataKey="hybrid" name="ClimoraX Hybrid Consensus" stroke="#10b981" strokeWidth={3} dot={{ r: 3, fill: '#10b981' }} />
              <Line type="monotone" dataKey="observation" name="Actual Ground Observation (AWS)" stroke="#f59e0b" strokeWidth={2} strokeDasharray="2 2" dot={{ r: 2, fill: '#f59e0b' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 7. LEAD-TIME PERFORMANCE CHART */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <SectionHeader
          title="Lead-Time Error Evolution Chart (MAE Error Growth)"
          subtitle="Measures error accumulation as forecast horizon extends from +6h to +120h"
          icon={Clock}
        />

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={leadTimeErrorData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="lead" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit=" MAE" />
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
              <Line type="monotone" dataKey="AI" name="AI WeatherNet MAE" stroke="#06b6d4" strokeWidth={2} />
              <Line type="monotone" dataKey="Ensemble" name="Ensemble Fusion MAE" stroke="#a855f7" strokeWidth={2} />
              <Line type="monotone" dataKey="NWP" name="NWP Core MAE" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="Hybrid" name="ClimoraX Hybrid MAE" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 8. REGIME PERFORMANCE TABS */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <SectionHeader
          title="Weather Regime Performance Breakdown"
          subtitle="Select a weather regime to view model verification metrics"
          icon={SlidersHorizontal}
        />

        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-mono">
          {(['Normal', 'Heavy Rain', 'Heat Wave', 'High Wind', 'Cyclonic'] as VerificationRegime[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveRegime(tab)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeRegime === tab
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
            <span className="font-bold text-slate-100 text-sm font-sans">Regime Focus: {activeRegime}</span>
            <span className="text-[11px] text-slate-400 font-sans">{activeRegimeMetrics.explanation}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
              <div className="text-slate-400 text-[10px]">NWP Core MAE</div>
              <div className="font-bold text-blue-400 text-sm">{activeRegimeMetrics.nwpMAE}</div>
              <div className="text-[10px] text-slate-500">CSI: {activeRegimeMetrics.nwpCSI}</div>
            </div>

            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
              <div className="text-slate-400 text-[10px]">AI WeatherNet MAE</div>
              <div className="font-bold text-cyan-400 text-sm">{activeRegimeMetrics.aiMAE}</div>
              <div className="text-[10px] text-slate-500">CSI: {activeRegimeMetrics.aiCSI}</div>
            </div>

            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
              <div className="text-slate-400 text-[10px]">Ensemble MAE</div>
              <div className="font-bold text-purple-400 text-sm">{activeRegimeMetrics.ensMAE}</div>
              <div className="text-[10px] text-slate-500">CSI: {activeRegimeMetrics.ensCSI}</div>
            </div>

            <div className="p-2.5 bg-slate-900 rounded-lg border border-emerald-500/60 bg-emerald-950/20">
              <div className="text-emerald-300 text-[10px] font-bold">Hybrid Consensus MAE</div>
              <div className="font-extrabold text-emerald-400 text-sm">{activeRegimeMetrics.hybridMAE}</div>
              <div className="text-[10px] text-emerald-300 font-bold">CSI: {activeRegimeMetrics.hybridCSI}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 9. BACKTESTING METHODOLOGY & DATA LEAKAGE PANEL */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-cyan-800/60 rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="text-center space-y-1">
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 uppercase tracking-wider font-bold">
            Scientific Rigor & Validation
          </span>
          <h2 className="text-lg font-black text-slate-100 font-sans">Backtesting Pipeline & Data Separation Methodology</h2>
          <p className="text-xs text-slate-400 max-w-2xl mx-auto">
            How forecast improvement is scientifically demonstrated without future-data leakage.
          </p>
        </div>

        {/* Methodology Step Flow Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-2 text-xs font-mono text-center pt-2">
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
            <div className="text-slate-400 text-[10px]">Step 1</div>
            <div className="font-bold text-slate-200">Historical Forecasts</div>
          </div>
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
            <div className="text-slate-400 text-[10px]">Step 2</div>
            <div className="font-bold text-slate-200">Historical AWS Obs</div>
          </div>
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
            <div className="text-slate-400 text-[10px]">Step 3</div>
            <div className="font-bold text-cyan-400">Error Calculation</div>
          </div>
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
            <div className="text-slate-400 text-[10px]">Step 4</div>
            <div className="font-bold text-cyan-400">Feature Engineering</div>
          </div>
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
            <div className="text-slate-400 text-[10px]">Step 5</div>
            <div className="font-bold text-purple-400">Weight Model</div>
          </div>
          <div className="p-3 bg-emerald-950/60 border border-emerald-500/80 rounded-xl space-y-1">
            <div className="text-emerald-400 text-[10px]">Step 6</div>
            <div className="font-bold text-emerald-300">Out-of-Sample Test</div>
          </div>
        </div>

        {/* Dataset Splits Table */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs pt-2">
          <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
            <div className="text-blue-400 font-bold">Training Dataset (2018–2022)</div>
            <p className="text-[11px] text-slate-400 font-sans">5 years of historical reanalysis used to fit regime weight functions.</p>
          </div>
          <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
            <div className="text-cyan-400 font-bold">Validation Dataset (2023)</div>
            <p className="text-[11px] text-slate-400 font-sans">Used to tune lead-time decay hyperparameters and threshold floors.</p>
          </div>
          <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
            <div className="text-emerald-400 font-bold">Out-of-Sample Test (2024)</div>
            <p className="text-[11px] text-slate-400 font-sans">Held-out evaluation year used for un-biased backtesting scorecards.</p>
          </div>
        </div>

        {/* Critical Note */}
        <div className="p-3 bg-slate-950 border border-amber-500/50 rounded-xl text-xs text-amber-200 font-mono flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>IMPORTANT SCIENTIFIC NOTE:</strong> &ldquo;Production evaluation must use temporally separated historical datasets and avoid future-data leakage.&rdquo; Displayed backtesting metrics are simulated demonstrative scorecards.
          </span>
        </div>
      </div>
    </div>
  );
}
