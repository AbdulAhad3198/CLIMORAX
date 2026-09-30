'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CommandPalette } from '../ui/CommandPalette';
import { 
  MapPin, 
  Clock, 
  RefreshCw, 
  Languages, 
  Bell, 
  ChevronDown, 
  Menu,
  X,
  ShieldAlert,
  Search,
  User,
  Activity,
  Sliders,
  Sparkles
} from 'lucide-react';

const LEAD_TIME_OPTIONS = [
  { value: 6, label: '+6h' },
  { value: 12, label: '+12h' },
  { value: 24, label: '+24h' },
  { value: 48, label: '+48h' },
  { value: 72, label: '+72h' },
  { value: 120, label: '+120h' },
  { value: 240, label: '+240h' },
];

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'mr', label: 'मराठी' },
  { code: 'gu', label: 'ગુજરાતી' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'ml', label: 'മലയാളം' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ' },
];

export function Header({ onToggleMobileNav }: { onToggleMobileNav?: () => void }) {
  const { 
    locations, 
    selectedLocation, 
    setSelectedLocation, 
    leadTimeHours, 
    setLeadTimeHours, 
    language, 
    setLanguage,
    unit,
    setUnit,
    hybridData,
    lastUpdated,
    refreshData
  } = useApp();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <>
      <header className="h-16 bg-slate-950/85 border-b border-cyan-900/30 px-4 md:px-6 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
        {/* Left: Mobile Toggle, Location Dropdown & Forecast Cycle */}
        <div className="flex items-center gap-3">
          {onToggleMobileNav && (
            <button 
              onClick={onToggleMobileNav} 
              className="md:hidden p-1.5 rounded-md text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              aria-label="Toggle navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Location Selector Dropdown */}
          <div className="relative flex items-center gap-2 bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-lg px-2.5 py-1.5 transition-all">
            <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
            <select
              value={selectedLocation.id}
              onChange={(e) => {
                const loc = locations.find((l) => l.id === e.target.value);
                if (loc) setSelectedLocation(loc);
              }}
              className="bg-transparent text-xs font-semibold text-slate-100 focus:outline-none cursor-pointer pr-2 appearance-none font-sans"
            >
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id} className="bg-slate-900 text-slate-100">
                  {loc.name}, {loc.state} {loc.isHighRiskZone ? '⚠️' : ''}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Forecast Cycle Badge */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 px-2.5 py-1 rounded-lg text-[11px] font-mono text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>Cycle: <strong className="text-cyan-300">06:00 Z</strong></span>
          </div>

          {/* Quick Lead Time Selector */}
          <div className="hidden xl:flex items-center gap-1 bg-slate-900/90 border border-slate-800 rounded-lg p-1 text-xs">
            <Clock className="w-3.5 h-3.5 text-cyan-400 ml-1 shrink-0" />
            {LEAD_TIME_OPTIONS.slice(0, 5).map((opt) => (
              <button
                key={opt.value}
                onClick={() => setLeadTimeHours(opt.value)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold transition-colors ${
                  leadTimeHours === opt.value
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right Section: Command Palette, Refresh, Lang, Unit, Alerts, Profile */}
        <div className="flex items-center gap-2">
          {/* Command Palette Trigger */}
          <button
            onClick={() => setShowCommandPalette(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 rounded-lg text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-sans">Search...</span>
            <kbd className="text-[10px] font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* Refresh Timestamp */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 border border-slate-800 px-2.5 py-1 rounded-lg font-mono">
            <span className="text-[10px]">{lastUpdated}</span>
            <button
              onClick={handleRefresh}
              className="p-0.5 hover:text-cyan-400 transition-colors"
              title="Recalculate Blending Engine"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
          </div>

          {/* Temperature Unit Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-mono">
            <button
              onClick={() => setUnit('C')}
              className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                unit === 'C' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/80' : 'text-slate-400'
              }`}
            >
              °C
            </button>
            <button
              onClick={() => setUnit('F')}
              className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                unit === 'F' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/80' : 'text-slate-400'
              }`}
            >
              °F
            </button>
          </div>

          {/* Language Picker */}
          <div className="relative flex items-center bg-slate-900/90 border border-slate-800 rounded-lg px-2 py-1 text-xs">
            <Languages className="w-3.5 h-3.5 text-cyan-400 mr-1 shrink-0" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer appearance-none pr-1 font-sans"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-100">
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* Notifications Drawer Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-slate-300 relative transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {hybridData.extremeAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-4 z-50 text-xs font-sans">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                  <span className="font-semibold text-slate-100 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    Meteorological Alerts ({hybridData.extremeAlerts.length})
                  </span>
                  <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-200">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {hybridData.extremeAlerts.length === 0 ? (
                  <div className="text-slate-400 py-3 text-center">
                    No active extreme hazard alerts for {selectedLocation.name}.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {hybridData.extremeAlerts.map((alert) => (
                      <div key={alert.id} className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-800/60 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-300">{alert.title}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-slate-950">
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-slate-300 text-[11px]">{alert.thresholdExceeded}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Profile / Control Avatar */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-700 p-0.5 flex items-center justify-center font-mono text-xs font-extrabold text-slate-950 shadow-md shrink-0"
            >
              SIH
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3 z-50 text-xs font-sans space-y-2">
                <div className="border-b border-slate-800 pb-2">
                  <div className="font-bold text-slate-100">Team Hacksphere1</div>
                  <div className="text-[10px] text-cyan-400 font-mono">SIH 2026 PS-26081</div>
                </div>
                <div className="space-y-1 text-slate-300">
                  <div className="py-1 px-2 hover:bg-slate-800 rounded cursor-pointer">Disaster Control Protocol</div>
                  <div className="py-1 px-2 hover:bg-slate-800 rounded cursor-pointer">Export Telemetry Log</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Command Palette Modal */}
      <CommandPalette isOpen={showCommandPalette} onClose={() => setShowCommandPalette(false)} />
    </>
  );
}
