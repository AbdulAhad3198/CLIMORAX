'use client';

import React, { useState } from 'react';
import { Location, HybridForecast } from '@/lib/types/weather';
import { INDIA_LOCATIONS } from '@/lib/mock-data/locations';
import { calculateHybridForecast } from '@/lib/simulation/blending-engine';
import { 
  Compass, 
  Thermometer, 
  Droplets, 
  Wind, 
  Gauge, 
  AlertTriangle, 
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';

export type MapVariable = 'precip' | 'temp' | 'wind' | 'pressure' | 'risk' | 'agreement';

interface IndiaWeatherMapProps {
  selectedLocation: Location;
  onSelectLocation: (loc: Location) => void;
  leadTimeHours: number;
  onLeadTimeChange?: (hours: number) => void;
}

export function IndiaWeatherMap({
  selectedLocation,
  onSelectLocation,
  leadTimeHours,
  onLeadTimeChange
}: IndiaWeatherMapProps) {
  const [activeVariable, setActiveVariable] = useState<MapVariable>('precip');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredData, setHoveredLocation] = useState<{
    loc: Location;
    hybrid: HybridForecast;
    valueStr: string;
    nwpValStr: string;
    aiValStr: string;
    ensValStr: string;
    dominantModel: string;
  } | null>(null);

  // Convert Lat / Lng to SVG viewBox coordinates (Bounds: Lat 6.5N-37.5N, Lng 68E-97.5E)
  const getCoordinates = (lat: number, lng: number) => {
    const minLat = 6.5;
    const maxLat = 37.5;
    const minLng = 68.0;
    const maxLng = 97.5;

    const x = ((lng - minLng) / (maxLng - minLng)) * 600;
    const y = 600 - ((lat - minLat) / (maxLat - minLat)) * 600;

    return { x, y };
  };

  // Variable formatting and value extraction helper
  const getVariableValues = (hybrid: HybridForecast) => {
    const nwp = hybrid.models[0];
    const ai = hybrid.models[1];
    const ens = hybrid.models[2];

    if (activeVariable === 'temp') {
      return {
        unit: '°C',
        hybridStr: `${hybrid.temperature} °C`,
        nwpStr: `${nwp.temperature} °C`,
        aiStr: `${ai.temperature} °C`,
        ensStr: `${ens.temperature} °C`,
        color: hybrid.temperature > 35 ? '#ef4444' : hybrid.temperature > 28 ? '#f59e0b' : '#3b82f6',
      };
    }
    if (activeVariable === 'precip') {
      return {
        unit: 'mm/h',
        hybridStr: `${hybrid.precipitation} mm/h`,
        nwpStr: `${nwp.precipitation} mm/h`,
        aiStr: `${ai.precipitation} mm/h`,
        ensStr: `${ens.precipitation} mm/h`,
        color: hybrid.precipitation > 20 ? '#a855f7' : hybrid.precipitation > 5 ? '#3b82f6' : '#64748b',
      };
    }
    if (activeVariable === 'wind') {
      return {
        unit: 'km/h',
        hybridStr: `${hybrid.windSpeed} km/h`,
        nwpStr: `${nwp.windSpeed} km/h`,
        aiStr: `${ai.windSpeed} km/h`,
        ensStr: `${ens.windSpeed} km/h`,
        color: hybrid.windSpeed > 30 ? '#ec4899' : '#06b6d4',
      };
    }
    if (activeVariable === 'pressure') {
      return {
        unit: 'hPa',
        hybridStr: `${hybrid.pressure} hPa`,
        nwpStr: `${nwp.pressure} hPa`,
        aiStr: `${ai.pressure} hPa`,
        ensStr: `${ens.pressure} hPa`,
        color: '#f59e0b',
      };
    }
    if (activeVariable === 'risk') {
      return {
        unit: 'Risk',
        hybridStr: hybrid.extremeRiskLevel,
        nwpStr: `Score: ${nwp.uncertaintyScore}`,
        aiStr: `Score: ${ai.uncertaintyScore}`,
        ensStr: `Score: ${ens.uncertaintyScore}`,
        color: hybrid.extremeRiskLevel === 'SEVERE' || hybrid.extremeRiskLevel === 'HIGH' ? '#ef4444' : '#10b981',
      };
    }
    // Agreement
    return {
      unit: '%',
      hybridStr: `${hybrid.modelAgreementPercentage}%`,
      nwpStr: `Weight ${(hybrid.weights[0].weight * 100).toFixed(0)}%`,
      aiStr: `Weight ${(hybrid.weights[1].weight * 100).toFixed(0)}%`,
      ensStr: `Weight ${(hybrid.weights[2].weight * 100).toFixed(0)}%`,
      color: hybrid.modelAgreementPercentage > 82 ? '#10b981' : hybrid.modelAgreementPercentage > 70 ? '#f59e0b' : '#ef4444',
    };
  };

  const handleZoomIn = () => setZoomLevel((z) => Math.min(2.5, z + 0.25));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(0.8, z - 0.25));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 md:p-5 shadow-2xl space-y-3 relative overflow-hidden">
      {/* Map Top Bar Controls */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400 shrink-0" />
            India Hybrid Forecast Intelligence Map
          </h3>
          <p className="text-[11px] text-slate-400 font-mono">
            Active Variable: <span className="text-cyan-400 font-bold uppercase">{activeVariable}</span> · Lead Time: <span className="text-cyan-400 font-bold">+{leadTimeHours}h Horizon</span>
          </p>
        </div>

        {/* Variable Layer Selector */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px] font-mono">
          <button
            onClick={() => setActiveVariable('precip')}
            className={`px-2.5 py-1 rounded font-medium flex items-center gap-1 transition-colors ${
              activeVariable === 'precip' ? 'bg-blue-500 text-white font-bold' : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            <Droplets className="w-3 h-3" /> Rainfall
          </button>
          <button
            onClick={() => setActiveVariable('temp')}
            className={`px-2.5 py-1 rounded font-medium flex items-center gap-1 transition-colors ${
              activeVariable === 'temp' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            <Thermometer className="w-3 h-3" /> Temperature
          </button>
          <button
            onClick={() => setActiveVariable('wind')}
            className={`px-2.5 py-1 rounded font-medium flex items-center gap-1 transition-colors ${
              activeVariable === 'wind' ? 'bg-purple-500 text-white font-bold' : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            <Wind className="w-3 h-3" /> Wind
          </button>
          <button
            onClick={() => setActiveVariable('pressure')}
            className={`px-2.5 py-1 rounded font-medium flex items-center gap-1 transition-colors ${
              activeVariable === 'pressure' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            <Gauge className="w-3 h-3" /> Pressure
          </button>
          <button
            onClick={() => setActiveVariable('risk')}
            className={`px-2.5 py-1 rounded font-medium flex items-center gap-1 transition-colors ${
              activeVariable === 'risk' ? 'bg-red-500 text-white font-bold' : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            <AlertTriangle className="w-3 h-3" /> Extreme Risk
          </button>
          <button
            onClick={() => setActiveVariable('agreement')}
            className={`px-2.5 py-1 rounded font-medium flex items-center gap-1 transition-colors ${
              activeVariable === 'agreement' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            <Layers className="w-3 h-3" /> Agreement
          </button>
        </div>
      </div>

      {/* Map Area & Time Horizon Sub-Bar */}
      <div className="flex items-center justify-between bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] font-mono">
        <span className="text-slate-400">Horizon Step:</span>
        <div className="flex items-center gap-1.5">
          {[6, 12, 24, 48, 72, 120].map((h) => (
            <button
              key={h}
              onClick={() => onLeadTimeChange && onLeadTimeChange(h)}
              className={`px-2 py-0.5 rounded font-bold transition-colors ${
                leadTimeHours === h ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              +{h}h
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Map Viewport Container */}
      <div className="relative w-full h-[420px] md:h-[480px] bg-slate-950/90 rounded-lg border border-slate-800 flex items-center justify-center p-2 overflow-hidden select-none">
        {/* Background Grid Lines & Atmospheric Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

        {/* Dynamic Synthetic Heat Map Contour Shapes */}
        <div className="absolute inset-0 opacity-20 pointer-events-none transition-all duration-700">
          <div 
            className="absolute top-1/3 left-1/3 w-64 h-64 rounded-full filter blur-3xl transition-colors duration-500"
            style={{
              backgroundColor: 
                activeVariable === 'precip' ? '#3b82f6' :
                activeVariable === 'temp' ? '#ef4444' :
                activeVariable === 'risk' ? '#ef4444' : '#10b981'
            }}
          />
          <div 
            className="absolute bottom-1/4 right-1/4 w-56 h-56 rounded-full filter blur-3xl transition-colors duration-500"
            style={{
              backgroundColor: 
                activeVariable === 'wind' ? '#a855f7' :
                activeVariable === 'pressure' ? '#f59e0b' : '#06b6d4'
            }}
          />
        </div>

        {/* SVG Map Canvas */}
        <div
          className="w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoomLevel}) translate(${pan.x}px, ${pan.y}px)` }}
        >
          <svg viewBox="0 0 600 600" className="w-full h-full max-h-[460px] drop-shadow-lg">
            {/* Synthetic Contour Grid Waves */}
            <g stroke="rgba(51, 65, 85, 0.4)" strokeWidth="0.8" fill="none">
              <path d="M 120 180 Q 250 120 450 200" />
              <path d="M 100 280 Q 300 220 500 320" />
              <path d="M 150 400 Q 320 350 420 480" />
            </g>

            {/* Schematic Contour Boundaries of India */}
            <path
              d="M 170 50 L 220 30 L 280 40 L 330 80 L 390 100 L 480 140 L 520 180 L 530 220 L 480 230 L 430 220 L 400 240 L 360 270 L 380 320 L 350 380 L 300 450 L 250 540 L 230 520 L 200 440 L 170 380 L 150 320 L 140 260 L 120 220 L 110 160 L 130 110 Z"
              fill="#0b1329"
              stroke="#1e293b"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* Station Dots */}
            {INDIA_LOCATIONS.map((loc) => {
              const { x, y } = getCoordinates(loc.lat, loc.lng);
              const hybrid = calculateHybridForecast(loc, leadTimeHours);
              const isSelected = loc.id === selectedLocation.id;
              const varInfo = getVariableValues(hybrid);

              // Highest contributing model name
              const dominant = [...hybrid.weights].sort((a, b) => b.weight - a.weight)[0];

              return (
                <g
                  key={loc.id}
                  onClick={() => onSelectLocation(loc)}
                  onMouseEnter={() =>
                    setHoveredLocation({
                      loc,
                      hybrid,
                      valueStr: varInfo.hybridStr,
                      nwpValStr: varInfo.nwpStr,
                      aiValStr: varInfo.aiStr,
                      ensValStr: varInfo.ensStr,
                      dominantModel: dominant.modelName,
                    })
                  }
                  onMouseLeave={() => setHoveredLocation(null)}
                  className="cursor-pointer group/station"
                >
                  {/* Selection Pulsing Ring */}
                  {isSelected && (
                    <circle
                      cx={x}
                      cy={y}
                      r="14"
                      fill="none"
                      stroke={varInfo.color}
                      strokeWidth="1.5"
                      className="animate-ping opacity-60"
                    />
                  )}

                  {/* Station Dot */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 7 : 4.5}
                    fill={varInfo.color}
                    stroke="#020617"
                    strokeWidth="2"
                    className="transition-all duration-200 group-hover/station:r-8"
                  />

                  {/* Station Label */}
                  <text
                    x={x + 9}
                    y={y + 3}
                    fill={isSelected ? '#38bdf8' : '#94a3b8'}
                    fontSize={isSelected ? '11 shadow-sm font-bold' : '9'}
                    fontFamily="monospace"
                    className="pointer-events-none drop-shadow"
                  >
                    {loc.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Map Zoom / Pan Controls Overlay */}
        <div className="absolute top-4 left-4 flex flex-col gap-1 bg-slate-950/90 border border-slate-800 rounded-lg p-1 z-20">
          <button
            onClick={handleZoomIn}
            className="p-1.5 text-slate-300 hover:text-slate-100 hover:bg-slate-800 rounded"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 text-slate-300 hover:text-slate-100 hover:bg-slate-800 rounded"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1.5 text-slate-300 hover:text-slate-100 hover:bg-slate-800 rounded border-t border-slate-800 mt-0.5"
            title="Reset Map"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Rich Hover Tooltip (Prompt Requirement) */}
        {hoveredData && (
          <div className="absolute bottom-4 left-4 bg-slate-950/95 border border-cyan-800/90 rounded-xl p-3.5 text-xs w-72 shadow-2xl z-30 pointer-events-none backdrop-blur-md space-y-2 font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 font-bold text-slate-100">
              <span className="font-sans text-sm">{hoveredData.loc.name}, {hoveredData.loc.state}</span>
              <span className="text-[10px] text-cyan-400">+{leadTimeHours}h Horizon</span>
            </div>

            <div className="space-y-1 text-slate-300 text-[11px]">
              <div className="flex justify-between font-bold text-cyan-300">
                <span>Hybrid Consensus:</span>
                <span>{hoveredData.valueStr}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>NWP Forecast:</span>
                <span>{hoveredData.nwpValStr}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>AI Forecast:</span>
                <span>{hoveredData.aiValStr}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Ensemble Forecast:</span>
                <span>{hoveredData.ensValStr}</span>
              </div>

              <div className="pt-1.5 border-t border-slate-800 flex justify-between text-emerald-400 font-bold">
                <span>Confidence:</span>
                <span>{hoveredData.hybrid.confidenceScore}% ({hoveredData.hybrid.confidenceLevel})</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Agreement:</span>
                <span>{hoveredData.hybrid.modelAgreementPercentage}%</span>
              </div>
              <div className="flex justify-between text-cyan-400">
                <span>Dominant Model:</span>
                <span className="truncate max-w-[130px]">{hoveredData.dominantModel}</span>
              </div>
              <div className="flex justify-between text-purple-300">
                <span>Regime:</span>
                <span className="truncate max-w-[130px]">{hoveredData.hybrid.regime.name}</span>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Variable Legend */}
        <div className="absolute top-4 right-4 bg-slate-950/90 border border-slate-800 rounded-lg p-2.5 text-[10px] font-mono space-y-1.5 text-slate-300 shadow-xl hidden sm:block">
          <div className="font-bold text-slate-200 uppercase tracking-wider text-[10px]">
            {activeVariable} Scale
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 rounded bg-emerald-500 inline-block" />
            <span>Normal / Low</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 rounded bg-amber-400 inline-block" />
            <span>Moderate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 rounded bg-red-500 inline-block" />
            <span>Severe / High</span>
          </div>
        </div>
      </div>
    </div>
  );
}
