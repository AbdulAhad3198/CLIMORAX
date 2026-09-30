'use client';

import React, { createContext, useContext, useState, useMemo } from 'react';
import { Location, HybridForecast, ForecastPoint } from '@/lib/types/weather';
import { INDIA_LOCATIONS, DEFAULT_LOCATION } from '@/lib/mock-data/locations';
import { calculateHybridForecast, generateForecastTimeline } from '@/lib/simulation/blending-engine';

interface AppContextType {
  locations: Location[];
  selectedLocation: Location;
  setSelectedLocation: (loc: Location) => void;
  leadTimeHours: number;
  setLeadTimeHours: (hours: number) => void;
  language: string;
  setLanguage: (lang: string) => void;
  unit: 'C' | 'F';
  setUnit: (u: 'C' | 'F') => void;
  hybridData: HybridForecast;
  forecastTimeline: ForecastPoint[];
  lastUpdated: string;
  refreshData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [selectedLocation, setSelectedLocation] = useState<Location>(DEFAULT_LOCATION);
  const [leadTimeHours, setLeadTimeHours] = useState<number>(24);
  const [language, setLanguage] = useState<string>('en');
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [lastUpdated, setLastUpdated] = useState<string>(() => {
    return '07:00:00 IST';
  });

  const hybridData = useMemo(() => {
    return calculateHybridForecast(selectedLocation, leadTimeHours);
  }, [selectedLocation, leadTimeHours]);

  const forecastTimeline = useMemo(() => {
    return generateForecastTimeline(selectedLocation, 72);
  }, [selectedLocation]);

  const refreshData = () => {
    const now = new Date();
    setLastUpdated(`${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} IST`);
  };

  return (
    <AppContext.Provider
      value={{
        locations: INDIA_LOCATIONS,
        selectedLocation,
        setSelectedLocation,
        leadTimeHours,
        setLeadTimeHours,
        language,
        setLanguage,
        unit,
        setUnit,
        hybridData,
        forecastTimeline,
        lastUpdated,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
