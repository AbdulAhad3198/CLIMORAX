'use client';

import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid,
  Area,
  ComposedChart
} from 'recharts';
import { ForecastPoint } from '@/lib/types/weather';

interface ModelComparisonChartProps {
  data: ForecastPoint[];
}

export function ModelComparisonChart({ data }: ModelComparisonChartProps) {
  const [variable, setVariable] = useState<'temp' | 'precip' | 'wind'>('temp');

  const getMetricKey = (model: string) => {
    if (variable === 'temp') return `${model}Temp`;
    if (variable === 'precip') return `${model}Precip`;
    return `${model}Wind`;
  };

  const getUnitLabel = () => {
    if (variable === 'temp') return '°C';
    if (variable === 'precip') return 'mm/h';
    return 'km/h';
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 md:p-5 shadow-xl space-y-4">
      {/* Chart Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            Multi-Model Forecast Comparison & Consensus Curve
          </h3>
          <p className="text-[11px] text-slate-400">
            NWP Core vs AI WeatherNet vs Ensemble Fusion vs ClimoraX Hybrid
          </p>
        </div>

        {/* Variable Selector Buttons */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px]">
          <button
            onClick={() => setVariable('temp')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              variable === 'temp' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            Temperature
          </button>
          <button
            onClick={() => setVariable('precip')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              variable === 'precip' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            Precipitation
          </button>
          <button
            onClick={() => setVariable('wind')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              variable === 'wind' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            Wind Speed
          </button>
        </div>
      </div>

      {/* Chart Area */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit={getUnitLabel()} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#020617',
                borderColor: '#334155',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#f8fafc',
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              iconType="circle"
            />
            
            {/* Raw Model Lines */}
            <Line
              type="monotone"
              dataKey={getMetricKey('nwp')}
              name="NWP Core (IFS)"
              stroke="#3b82f6"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey={getMetricKey('ai')}
              name="AI WeatherNet"
              stroke="#06b6d4"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey={getMetricKey('ensemble')}
              name="Ensemble Fusion"
              stroke="#a855f7"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
            />

            {/* ClimoraX Hybrid Consensus Bold Highlight Line */}
            <Line
              type="monotone"
              dataKey={getMetricKey('hybrid')}
              name="ClimoraX Hybrid Consensus"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 3, fill: '#10b981' }}
              activeDot={{ r: 6, fill: '#34d399' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
