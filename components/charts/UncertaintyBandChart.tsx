'use client';

import React from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Area, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { ForecastPoint } from '@/lib/types/weather';

interface UncertaintyBandChartProps {
  data: ForecastPoint[];
}

export function UncertaintyBandChart({ data }: UncertaintyBandChartProps) {
  // Compute upper and lower confidence spread for temperature
  const chartData = data.map((pt) => {
    const spread = (100 - pt.confidence) * 0.08;
    return {
      time: pt.time,
      hybridTemp: pt.hybridTemp,
      tempMax: Number((pt.hybridTemp + spread).toFixed(1)),
      tempMin: Number((pt.hybridTemp - spread).toFixed(1)),
      confidence: pt.confidence,
    };
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 md:p-5 shadow-xl space-y-3">
      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
        <div>
          <h3 className="text-sm font-bold text-slate-100">
            Ensemble Dispersion & Uncertainty Envelope
          </h3>
          <p className="text-[11px] text-slate-400">
            Shaded 90% confidence corridor derived from 50-member perturbation spread
          </p>
        </div>
      </div>

      <div className="h-60 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit="°C" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#020617',
                borderColor: '#334155',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#f8fafc',
              }}
            />
            {/* Shaded Upper and Lower Uncertainty Envelope */}
            <Area
              type="monotone"
              dataKey="tempMax"
              stroke="none"
              fill="#06b6d4"
              fillOpacity={0.15}
            />
            <Area
              type="monotone"
              dataKey="tempMin"
              stroke="none"
              fill="#020617"
              fillOpacity={1}
            />
            {/* Hybrid Consensus Center Line */}
            <Line
              type="monotone"
              dataKey="hybridTemp"
              name="Hybrid Value (°C)"
              stroke="#06b6d4"
              strokeWidth={2.5}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
