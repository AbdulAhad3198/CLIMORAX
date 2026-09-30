'use client';

import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import { Location } from '@/lib/types/weather';
import { calculateModelWeights, classifyWeatherRegime } from '@/lib/simulation/blending-engine';

interface WeightDecayChartProps {
  location: Location;
}

export function WeightDecayChart({ location }: WeightDecayChartProps) {
  const regime = classifyWeatherRegime(location);

  // Sample lead times from 0h to 240h
  const leadTimes = [0, 6, 12, 24, 36, 48, 72, 96, 120, 168, 240];

  const chartData = leadTimes.map((hours) => {
    const weights = calculateModelWeights(location, hours, regime);
    return {
      hours: `+${hours}h`,
      NWP: Math.round(weights[0].weight * 100),
      AI: Math.round(weights[1].weight * 100),
      Ensemble: Math.round(weights[2].weight * 100),
    };
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 md:p-5 shadow-xl space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-100">
            Lead-Time Model Weight Decay Curve (0h - 240h)
          </h3>
          <p className="text-[11px] text-slate-400">
            Regime: <span className="text-cyan-400 font-semibold">{regime.name}</span> · Adaptive model contribution shift over forecast horizon
          </p>
        </div>
      </div>

      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="hours" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit="%" domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#020617',
                borderColor: '#334155',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#f8fafc',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} iconType="square" />
            <Area
              type="monotone"
              dataKey="AI"
              name="AI WeatherNet Weight"
              stackId="1"
              stroke="#06b6d4"
              fill="#06b6d4"
              fillOpacity={0.8}
            />
            <Area
              type="monotone"
              dataKey="Ensemble"
              name="Ensemble Fusion Weight"
              stackId="1"
              stroke="#a855f7"
              fill="#a855f7"
              fillOpacity={0.8}
            />
            <Area
              type="monotone"
              dataKey="NWP"
              name="NWP Core Weight"
              stackId="1"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.8}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
