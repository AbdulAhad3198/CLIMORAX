'use client';

import React from 'react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  Radar, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Legend, 
  Tooltip 
} from 'recharts';

export function RadarRegimeChart() {
  const radarData = [
    { dimension: 'Convective Precip', NWP: 65, AI: 88, Ensemble: 82, Hybrid: 94 },
    { dimension: 'Thermal Ridge', NWP: 90, AI: 82, Ensemble: 84, Hybrid: 96 },
    { dimension: 'Moisture Transport', NWP: 82, AI: 89, Ensemble: 80, Hybrid: 92 },
    { dimension: 'Baroclinic Waves', NWP: 92, AI: 78, Ensemble: 86, Hybrid: 95 },
    { dimension: 'Boundary Inversion', NWP: 70, AI: 91, Ensemble: 76, Hybrid: 93 },
    { dimension: 'Ographic Lift', NWP: 88, AI: 75, Ensemble: 81, Hybrid: 91 },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl space-y-2">
      <div className="border-b border-slate-800 pb-2">
        <h3 className="text-sm font-bold text-slate-100">
          Atmospheric Physics Dimension Skill Radar
        </h3>
        <p className="text-[11px] text-slate-400">
          Model performance breakdown across meteorological skill categories
        </p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="dimension" stroke="#94a3b8" fontSize={10} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={9} />
            <Radar name="NWP Core" dataKey="NWP" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
            <Radar name="AI WeatherNet" dataKey="AI" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} />
            <Radar name="Ensemble Fusion" dataKey="Ensemble" stroke="#a855f7" fill="#a855f7" fillOpacity={0.2} />
            <Radar name="ClimoraX Hybrid" dataKey="Hybrid" stroke="#10b981" fill="#10b981" fillOpacity={0.3} strokeWidth={2.5} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#020617',
                borderColor: '#334155',
                borderRadius: '8px',
                fontSize: '11px',
                color: '#f8fafc',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '10px' }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
