'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/components/context/AppContext';
import { Search, MapPin, Compass, LayoutDashboard, CloudSun, Cpu, SlidersHorizontal, AlertTriangle, GitMerge, BarChart3, Bot, Settings, X } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const { locations, setSelectedLocation, setLeadTimeHours } = useApp();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent or state trigger
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const routes = [
    { label: 'Command Center', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Hybrid Forecast', href: '/forecast', icon: CloudSun },
    { label: 'Model Intelligence', href: '/models', icon: Cpu },
    { label: 'Weight Maps', href: '/weights', icon: SlidersHorizontal },
    { label: 'Extreme Weather', href: '/extremes', icon: AlertTriangle },
    { label: 'Explainability & SHAP', href: '/explainability', icon: GitMerge },
    { label: 'Verification & Backtesting', href: '/verification', icon: BarChart3 },
    { label: 'Multilingual AI Assistant', href: '/assistant', icon: Bot },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  const filteredLocations = locations.filter(
    (l) => l.name.toLowerCase().includes(query.toLowerCase()) || l.state.toLowerCase().includes(query.toLowerCase())
  );

  const filteredRoutes = routes.filter((r) => r.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-20 p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-slate-800 flex items-center gap-3 bg-slate-950">
          <Search className="w-4 h-4 text-cyan-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city, station, or jump to route... (e.g. Mumbai, Forecast, Weights)"
            className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none font-sans"
            autoFocus
          />
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="p-3 max-h-80 overflow-y-auto space-y-4 text-xs font-sans">
          {/* Station Locations */}
          <div>
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider px-2 mb-1.5 font-bold">
              Meteorological Stations ({filteredLocations.length})
            </div>
            <div className="space-y-1">
              {filteredLocations.slice(0, 6).map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => {
                    setSelectedLocation(loc);
                    onClose();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-cyan-500/50 text-slate-200 flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <strong>{loc.name}</strong>, {loc.state}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{loc.climateZone}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Route Links */}
          <div>
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider px-2 mb-1.5 font-bold">
              System Modules
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {filteredRoutes.map((r) => {
                const Icon = r.icon;
                return (
                  <button
                    key={r.href}
                    onClick={() => {
                      router.push(r.href);
                      onClose();
                    }}
                    className="text-left px-3 py-2 rounded-lg bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-cyan-500/50 text-slate-200 flex items-center gap-2 transition-colors"
                  >
                    <Icon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">{r.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Hint */}
        <div className="p-2.5 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-500 font-mono flex items-center justify-between px-4">
          <span>Navigate with arrows or click</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
}
