'use client';

import React, { useState } from 'react';
import { useApp } from '@/components/context/AppContext';
import { AppShell } from '@/components/layout/AppShell';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ModelBadge } from '@/components/ui/ModelBadge';
import { formatTemp, formatPrecip } from '@/lib/formatting/units';
import { 
  GitMerge, 
  HelpCircle, 
  ArrowRight, 
  Layers, 
  Cpu, 
  Server, 
  Zap, 
  CheckCircle2, 
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Info,
  MapPin,
  Clock,
  Activity,
  Sliders
} from 'lucide-react';

export default function ExplainabilityPage() {
  return (
    <AppShell>
      <ExplainabilityContent />
    </AppShell>
  );
}

function ExplainabilityContent() {
  const { selectedLocation, hybridData, leadTimeHours, unit } = useApp();
  const [showTechnicalFlow, setShowTechnicalFlow] = useState<boolean>(true);

  // Dominant Model
  const dominantModel = [...hybridData.weights].sort((a, b) => b.weight - a.weight)[0];

  // Factors for "WHY THIS FORECAST?"
  const explanationFactors = [
    { label: 'Regional Model Skill', percentage: 31, color: '#06b6d4' },
    { label: 'Weather Regime Alignment', percentage: 24, color: '#a855f7' },
    { label: 'Lead-Time Behavior Decay', percentage: 19, color: '#3b82f6' },
    { label: 'Model Agreement Spread', percentage: 14, color: '#10b981' },
    { label: 'Historical Station Bias Error', percentage: 12, color: '#f59e0b' },
  ];

  // Prototype SHAP-Inspired Feature Influence
  const featureInfluenceList = [
    { feature: 'Relative Humidity (82%)', influence: +0.28, direction: 'AI Shift', desc: 'High monsoonal humidity advection favors AI non-linear convective graph kernels.' },
    { feature: 'Surface Pressure (1008.4 hPa)', influence: +0.22, direction: 'AI Shift', desc: 'Low pressure depression alignment matches 40-yr ERA5 monsoonal training patterns.' },
    { feature: 'Lead-Time Horizon (+24h)', influence: +0.19, direction: 'AI Shift', desc: 'Short-range lead time (<48h) yields highest precision for AI WeatherNet.' },
    { feature: 'Rainfall Pattern Trajectory', influence: +0.14, direction: 'AI Shift', desc: 'Upstream coastal precip radar plume matches AI spatial advection vectors.' },
    { feature: 'Orographic Elevation (216m)', influence: -0.12, direction: 'NWP Shift', desc: 'Higher elevation terrain boosts NWP Core due to hydrostatic fluid equations.' },
    { feature: 'Model Disagreement (Low)', influence: -0.10, direction: 'Ensemble Shift', desc: 'Low inter-model spread reduces requirement for ensemble dispersion.' },
    { feature: 'Wind Speed & Gust Vector', influence: +0.08, direction: 'AI Shift', desc: 'Sustained monsoonal onshore winds reinforce neural moisture flux.' },
    { feature: 'Seasonal Index (September Monsoon)', influence: +0.06, direction: 'AI Shift', desc: 'Late monsoonal retreat phase aligns with historical neural weights.' },
    { feature: 'Regional Station Bias', influence: -0.04, direction: 'NWP Shift', desc: '30-day AWS station verification record shows minimal NWP pressure drift.' },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER AREA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-900/30 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2 font-sans">
              <GitMerge className="w-6 h-6 text-cyan-400" />
              Forecast Explainability
            </h1>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
              TRANSPARENT AI DECISION ENGINE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Understand why the hybrid system selected this forecast. No black-box predictions.
          </p>
        </div>
      </div>

      {/* 1. SELECTED FORECAST SUMMARY BOX */}
      <div className="bg-slate-900/90 border border-cyan-900/40 rounded-xl p-5 shadow-xl space-y-3">
        <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold">
          Currently Evaluated Forecast State
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono pt-1">
          <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-cyan-400" /> Location
            </div>
            <div className="font-bold text-slate-100 font-sans text-sm truncate">{selectedLocation.name}</div>
          </div>

          <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400">Variable</div>
            <div className="font-bold text-cyan-300 font-sans text-sm">Monsoon Rainfall</div>
          </div>

          <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400">Hybrid Forecast</div>
            <div className="font-bold text-emerald-300 font-mono text-sm">{formatPrecip(hybridData.precipitation)}</div>
          </div>

          <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-cyan-400" /> Horizon
            </div>
            <div className="font-bold text-slate-100 font-mono text-sm">+{leadTimeHours} Hours</div>
          </div>

          <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <Activity className="w-3 h-3 text-purple-400" /> Weather Regime
            </div>
            <div className="font-bold text-purple-300 font-sans text-sm truncate">{hybridData.regime.name}</div>
          </div>

          <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-400">Hybrid Confidence</div>
            <div className="font-bold text-emerald-400 font-mono text-sm">{hybridData.confidenceScore}% ({hybridData.confidenceLevel})</div>
          </div>
        </div>
      </div>

      {/* 2. "WHY THIS FORECAST?" & MODEL WEIGHT EXPLANATION GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* WHY THIS FORECAST? */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <SectionHeader
            title="Why This Forecast?"
            subtitle="Factor contribution breakdown driving consensus weighting"
            icon={SlidersHorizontal}
          />

          <div className="space-y-3 pt-1">
            {explanationFactors.map((f, idx) => (
              <div key={idx} className="space-y-1 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-300 font-sans">{f.label}</span>
                  <span className="font-bold text-cyan-400">{f.percentage}% Contribution</span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full transition-all duration-500 rounded-full"
                    style={{ width: `${f.percentage}%`, backgroundColor: f.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400 italic font-mono">
            *Simulated explanation contributions calculated by the ClimoraX adaptive feature attribution module.
          </div>
        </div>

        {/* MODEL WEIGHT EXPLANATION */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <SectionHeader
            title="Model Weight Allocation Explanation"
            subtitle="Dynamic weight allocation across active forecast models"
            icon={Cpu}
          />

          <div className="grid grid-cols-3 gap-2 font-mono text-xs text-center">
            <div className="p-3 bg-slate-950 rounded-lg border border-blue-900/60">
              <div className="text-blue-400 font-bold">NWP Core</div>
              <div className="text-xl font-extrabold text-slate-100 mt-1">
                {(hybridData.weights[0].weight * 100).toFixed(0)}%
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-cyan-900/60">
              <div className="text-cyan-400 font-bold">AI WeatherNet</div>
              <div className="text-xl font-extrabold text-slate-100 mt-1">
                {(hybridData.weights[1].weight * 100).toFixed(0)}%
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-purple-900/60">
              <div className="text-purple-400 font-bold">Ensemble</div>
              <div className="text-xl font-extrabold text-slate-100 mt-1">
                {(hybridData.weights[2].weight * 100).toFixed(0)}%
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-cyan-800/60 text-xs text-slate-200 leading-relaxed font-sans">
            <p>
              The system currently gives <strong className="text-cyan-400">{dominantModel.modelName}</strong> the largest contribution ({(dominantModel.weight * 100).toFixed(0)}%) because the simulated context indicates stronger historical and regime-specific monsoonal precipitation skill for short lead times (+{leadTimeHours}h).
            </p>
          </div>
        </div>
      </div>

      {/* 3. PROTOTYPE FEATURE INFLUENCE VISUALIZATION (SHAP-INSPIRED) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <SectionHeader
          title="Meteorological Feature Influence (SHAP-Inspired)"
          subtitle="Quantifying how meteorological factors push weights toward specific models"
          icon={Sliders}
          badge="PROTOTYPE VISUALIZATION"
        />

        <div className="space-y-2.5">
          {featureInfluenceList.map((ft, idx) => (
            <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200 font-sans">{ft.feature}</span>
                <span className={`font-bold ${ft.influence > 0 ? 'text-cyan-400' : 'text-blue-400'}`}>
                  {ft.influence > 0 ? `+${ft.influence} (${ft.direction})` : `${ft.influence} (${ft.direction})`}
                </span>
              </div>

              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden flex border border-slate-800">
                <div
                  className={`h-full rounded-full ${ft.influence > 0 ? 'bg-cyan-500' : 'bg-blue-500'}`}
                  style={{ width: `${Math.abs(ft.influence) * 220}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-400 font-sans">{ft.desc}</p>
            </div>
          ))}
        </div>

        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400 italic font-mono">
          *Prototype feature influence visualization demonstrating explainability concepts for Smart India Hackathon PS-26081.
        </div>
      </div>

      {/* 4. TECHNICAL EXPLANATION - COLLAPSIBLE DECISION FLOW */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div
          onClick={() => setShowTechnicalFlow(!showTechnicalFlow)}
          className="flex items-center justify-between border-b border-slate-800 pb-3 cursor-pointer select-none"
        >
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <GitMerge className="w-4 h-4 text-cyan-400" />
              Technical Decision Pipeline Flow
            </h3>
            <p className="text-[11px] text-slate-400">
              End-to-end mathematical data flow from raw feature ingestion to weighted hybrid output
            </p>
          </div>

          <button className="p-1.5 text-slate-400 hover:text-slate-100 rounded bg-slate-800">
            {showTechnicalFlow ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {showTechnicalFlow && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2 text-xs font-mono pt-1 text-center">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
              <div className="text-cyan-400 font-bold text-[11px]">1. Input Features</div>
              <p className="text-[10px] text-slate-400 font-sans">Temp, Precip, Wind, Pressure, Lat/Lng</p>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
              <div className="text-blue-400 font-bold text-[11px]">2. Weight Predictor</div>
              <p className="text-[10px] text-slate-400 font-sans">Regime & Lead Skill Evaluator</p>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
              <div className="text-purple-400 font-bold text-[11px]">3. Model Logits</div>
              <p className="text-[10px] text-slate-400 font-sans">Raw Unnormalized Skill Scores</p>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
              <div className="text-amber-400 font-bold text-[11px]">4. Softmax</div>
              <p className="text-[10px] text-slate-400 font-sans">Exponential Probability Normalization</p>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
              <div className="text-emerald-400 font-bold text-[11px]">5. Normalized Weights</div>
              <p className="text-[10px] text-emerald-300 font-sans font-bold">Σ(w_i) = 1.0 Strict Constraint</p>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
              <div className="text-cyan-400 font-bold text-[11px]">6. Weighted Forecast</div>
              <p className="text-[10px] text-slate-400 font-sans">Linear Weight Consensus</p>
            </div>

            <div className="p-3 bg-cyan-950 border border-cyan-800 rounded-lg space-y-1">
              <div className="text-emerald-400 font-bold text-[11px]">7. Risk Analysis</div>
              <p className="text-[10px] text-slate-300 font-sans">Confidence & Extreme Thresholds</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
