export function formatTemp(celsius: number, unit: 'C' | 'F' = 'C'): string {
  if (unit === 'F') {
    const fahrenheit = (celsius * 9) / 5 + 32;
    return `${Math.round(fahrenheit)}°F`;
  }
  return `${celsius.toFixed(1)}°C`;
}

export function formatSpeed(kmh: number, unit: 'kmh' | 'mph' | 'knots' = 'kmh'): string {
  if (unit === 'mph') return `${Math.round(kmh * 0.621371)} mph`;
  if (unit === 'knots') return `${Math.round(kmh * 0.539957)} kts`;
  return `${kmh.toFixed(1)} km/h`;
}

export function formatPrecip(mm: number): string {
  if (mm <= 0.0) return '0.0 mm/h';
  return `${mm.toFixed(1)} mm/h`;
}

export function getWindCompass(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((degrees % 360) / 22.5) % 16;
  return directions[index];
}

export function getRiskColor(level: 'NONE' | 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE'): string {
  switch (level) {
    case 'SEVERE': return 'bg-red-500/20 text-red-400 border-red-500/40';
    case 'HIGH': return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
    case 'MODERATE': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
    case 'LOW': return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
    default: return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
  }
}

export function getConfidenceBadgeColor(level: string): string {
  switch (level) {
    case 'VERY HIGH': return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60';
    case 'HIGH': return 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60';
    case 'MODERATE': return 'text-amber-400 bg-amber-950/60 border-amber-800/60';
    case 'LOW': return 'text-orange-400 bg-orange-950/60 border-orange-800/60';
    default: return 'text-red-400 bg-red-950/60 border-red-800/60';
  }
}
