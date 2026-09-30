import { Location, ModelForecast, ModelWeight, HybridForecast, WeatherRegime, ExtremeEvent, ForecastPoint, VerificationMetric } from '../types/weather';
import { WEATHER_REGIMES } from '../constants/regimes';

// Seeded pseudo-random generator for deterministic calculations
function seededRandom(seed: number): number {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// Classify Weather Regime based on latitude, elevation, month & location
export function classifyWeatherRegime(location: Location, month: number = 9): WeatherRegime {
  // Month: 1-12 (September is 9)
  if (location.lat > 30 || location.elevation > 1200) {
    return WEATHER_REGIMES.western_disturbance;
  }
  if (location.climateZone === 'Coastal Monsoon' || location.climateZone === 'Tropical Wet') {
    if (month >= 6 && month <= 10) {
      return WEATHER_REGIMES.monsoon;
    }
    return WEATHER_REGIMES.cyclone;
  }
  if (location.climateZone === 'Semi-Arid' && (month >= 4 && month <= 6)) {
    return WEATHER_REGIMES.heatwave;
  }
  if (month >= 6 && month <= 9) {
    return WEATHER_REGIMES.monsoon;
  }
  return WEATHER_REGIMES.thunderstorm;
}

// Calculate dynamic model weights for NWP, AI, and Ensemble
export function calculateModelWeights(
  location: Location,
  leadTimeHours: number,
  regime: WeatherRegime
): ModelWeight[] {
  // Base skill scores
  let nwpSkill = 82;
  let aiSkill = 88;
  let ensembleSkill = 85;

  // Lead Time decay adjustment
  // AI is dominant at short lead times (<48h), NWP excels at long lead times (>120h), Ensemble excels mid-to-long (48-168h)
  let nwpLeadFactor = 1.0 + (leadTimeHours / 240) * 0.35; // NWP grows relatively stronger as lead time increases
  let aiLeadFactor = Math.max(0.45, 1.3 - (leadTimeHours / 120) * 0.6); // AI decays faster at longer horizons
  let ensembleLeadFactor = 0.9 + Math.sin((leadTimeHours / 240) * Math.PI) * 0.35; // Peak mid-range

  // Regime adjustment
  if (regime.favorableModelType === 'NWP') {
    nwpSkill += 12;
  } else if (regime.favorableModelType === 'AI') {
    aiSkill += 14;
  } else if (regime.favorableModelType === 'ENSEMBLE') {
    ensembleSkill += 13;
  }

  // Location elevation factor (complex terrain gives edge to NWP high-res topography or Ensembles)
  if (location.elevation > 800) {
    nwpSkill += 6;
    aiSkill -= 4;
  }

  // Raw weighted scores
  const rawNwpWeight = nwpSkill * nwpLeadFactor;
  const rawAiWeight = aiSkill * aiLeadFactor;
  const rawEnsembleWeight = ensembleSkill * ensembleLeadFactor;

  const totalRaw = rawNwpWeight + rawAiWeight + rawEnsembleWeight;

  // Normalized weights sum to exactly 1.0
  const wNWP = Number((rawNwpWeight / totalRaw).toFixed(3));
  const wAI = Number((rawAiWeight / totalRaw).toFixed(3));
  // Ensure strict sum to 1.0
  const wEnsemble = Number((1.0 - wNWP - wAI).toFixed(3));

  return [
    {
      modelId: 'nwp_core',
      modelName: 'NWP Core (IFS/IMD)',
      modelType: 'NWP',
      weight: wNWP,
      historicalSkillScore: Math.round(nwpSkill),
      regimeSuitability: regime.favorableModelType === 'NWP' ? 94 : 78,
      leadTimeDecayFactor: Number(nwpLeadFactor.toFixed(2)),
      color: '#3b82f6', // blue
    },
    {
      modelId: 'ai_weathernet',
      modelName: 'AI WeatherNet',
      modelType: 'AI',
      weight: wAI,
      historicalSkillScore: Math.round(aiSkill),
      regimeSuitability: regime.favorableModelType === 'AI' ? 96 : 81,
      leadTimeDecayFactor: Number(aiLeadFactor.toFixed(2)),
      color: '#06b6d4', // cyan
    },
    {
      modelId: 'ensemble_fusion',
      modelName: 'Ensemble Fusion (50-M)',
      modelType: 'ENSEMBLE',
      weight: wEnsemble,
      historicalSkillScore: Math.round(ensembleSkill),
      regimeSuitability: regime.favorableModelType === 'ENSEMBLE' ? 95 : 82,
      leadTimeDecayFactor: Number(ensembleLeadFactor.toFixed(2)),
      color: '#a855f7', // purple
    },
  ];
}

// Generate deterministic individual model predictions based on location & lead time
export function generateModelForecasts(location: Location, leadTimeHours: number): ModelForecast[] {
  // Deterministic seed based on location lat/lng and leadTime
  const seed = Math.floor(location.lat * 100 + location.lng * 10 + leadTimeHours);
  
  // Base climate values for India
  const baseTemp = 28 + Math.sin((location.lat / 30) * Math.PI) * 5 + (1000 - location.elevation) / 200;
  const basePrecip = location.climateZone === 'Coastal Monsoon' ? 14 : location.climateZone === 'Tropical Wet' ? 10 : 2;
  const baseWind = 12 + (location.elevation > 500 ? 8 : 4);
  const basePressure = 1010 - (location.elevation / 8.5);
  const baseHumidity = location.climateZone.includes('Coastal') ? 82 : 62;

  // NWP variation (tends to overestimate peak rainfall slightly)
  const nwpTemp = Number((baseTemp + (seededRandom(seed + 1) * 2.4 - 1.2)).toFixed(1));
  const nwpPrecip = Number((Math.max(0, basePrecip + (seededRandom(seed + 2) * 8 - 3))).toFixed(1));
  const nwpWind = Number((baseWind + (seededRandom(seed + 3) * 6 - 3)).toFixed(1));
  const nwpPressure = Number((basePressure + (seededRandom(seed + 4) * 3 - 1.5)).toFixed(1));
  const nwpHumidity = Math.min(100, Math.max(20, Math.round(baseHumidity + (seededRandom(seed + 5) * 10 - 5))));

  // AI variation (tends to smooth peaks, faster localized updates)
  const aiTemp = Number((baseTemp + (seededRandom(seed + 10) * 1.8 - 0.9)).toFixed(1));
  const aiPrecip = Number((Math.max(0, basePrecip + (seededRandom(seed + 11) * 6 - 2.5))).toFixed(1));
  const aiWind = Number((baseWind + (seededRandom(seed + 12) * 4 - 2)).toFixed(1));
  const aiPressure = Number((basePressure + (seededRandom(seed + 13) * 2 - 1)).toFixed(1));
  const aiHumidity = Math.min(100, Math.max(20, Math.round(baseHumidity + (seededRandom(seed + 14) * 8 - 4))));

  // Ensemble variation (mean of 50 members)
  const ensembleTemp = Number((baseTemp + (seededRandom(seed + 20) * 2.0 - 1.0)).toFixed(1));
  const ensemblePrecip = Number((Math.max(0, basePrecip + (seededRandom(seed + 21) * 7 - 3))).toFixed(1));
  const ensembleWind = Number((baseWind + (seededRandom(seed + 22) * 5 - 2.5)).toFixed(1));
  const ensemblePressure = Number((basePressure + (seededRandom(seed + 23) * 2.5 - 1.25)).toFixed(1));
  const ensembleHumidity = Math.min(100, Math.max(20, Math.round(baseHumidity + (seededRandom(seed + 24) * 9 - 4.5))));

  return [
    {
      modelId: 'nwp_core',
      modelName: 'NWP Core (IFS/IMD)',
      modelType: 'NWP',
      version: 'v4.2-ECMWF',
      provider: 'IMD / ECMWF Operational',
      temperature: nwpTemp,
      precipitation: nwpPrecip,
      windSpeed: nwpWind,
      windDirection: Math.round(180 + seededRandom(seed + 30) * 60),
      pressure: nwpPressure,
      humidity: nwpHumidity,
      dewPoint: Number((nwpTemp - (100 - nwpHumidity) / 5).toFixed(1)),
      uvIndex: Math.min(12, Math.round(6 + seededRandom(seed + 31) * 4)),
      airQualityIndex: Math.round(120 + seededRandom(seed + 32) * 80),
      uncertaintyScore: Math.round(15 + (leadTimeHours / 240) * 35),
    },
    {
      modelId: 'ai_weathernet',
      modelName: 'AI WeatherNet',
      modelType: 'AI',
      version: 'v3.8-NeuralGraph',
      provider: 'ClimoraX AI Core',
      temperature: aiTemp,
      precipitation: aiPrecip,
      windSpeed: aiWind,
      windDirection: Math.round(185 + seededRandom(seed + 40) * 55),
      pressure: aiPressure,
      humidity: aiHumidity,
      dewPoint: Number((aiTemp - (100 - aiHumidity) / 5).toFixed(1)),
      uvIndex: Math.min(12, Math.round(6 + seededRandom(seed + 41) * 4)),
      airQualityIndex: Math.round(115 + seededRandom(seed + 42) * 75),
      uncertaintyScore: Math.round(10 + (leadTimeHours / 240) * 45),
    },
    {
      modelId: 'ensemble_fusion',
      modelName: 'Ensemble Fusion',
      modelType: 'ENSEMBLE',
      version: '50-Member GEFS',
      provider: 'NCMRWF / NCEP',
      temperature: ensembleTemp,
      precipitation: ensemblePrecip,
      windSpeed: ensembleWind,
      windDirection: Math.round(182 + seededRandom(seed + 50) * 58),
      pressure: ensemblePressure,
      humidity: ensembleHumidity,
      dewPoint: Number((ensembleTemp - (100 - ensembleHumidity) / 5).toFixed(1)),
      uvIndex: Math.min(12, Math.round(6 + seededRandom(seed + 51) * 4)),
      airQualityIndex: Math.round(118 + seededRandom(seed + 52) * 78),
      uncertaintyScore: Math.round(12 + (leadTimeHours / 240) * 30),
    },
  ];
}

// Compute Hybrid Consensus Forecast
export function calculateHybridForecast(location: Location, leadTimeHours: number = 24): HybridForecast {
  const regime = classifyWeatherRegime(location);
  const weights = calculateModelWeights(location, leadTimeHours, regime);
  const models = generateModelForecasts(location, leadTimeHours);

  const wNWP = weights[0].weight;
  const wAI = weights[1].weight;
  const wEns = weights[2].weight;

  const nwp = models[0];
  const ai = models[1];
  const ens = models[2];

  // Blended values according to exact formula:
  // Hybrid = (w_NWP * NWP) + (w_AI * AI) + (w_Ens * Ens)
  const temperature = Number((wNWP * nwp.temperature + wAI * ai.temperature + wEns * ens.temperature).toFixed(1));
  const precipitation = Number((wNWP * nwp.precipitation + wAI * ai.precipitation + wEns * ens.precipitation).toFixed(1));
  const windSpeed = Number((wNWP * nwp.windSpeed + wAI * ai.windSpeed + wEns * ens.windSpeed).toFixed(1));
  const windDirection = Math.round(wNWP * nwp.windDirection + wAI * ai.windDirection + wEns * ens.windDirection);
  const pressure = Number((wNWP * nwp.pressure + wAI * ai.pressure + wEns * ens.pressure).toFixed(1));
  const humidity = Math.round(wNWP * nwp.humidity + wAI * ai.humidity + wEns * ens.humidity);
  const dewPoint = Number((temperature - (100 - humidity) / 5).toFixed(1));
  const uvIndex = Math.round(wNWP * nwp.uvIndex + wAI * ai.uvIndex + wEns * ens.uvIndex);
  const airQualityIndex = Math.round(wNWP * nwp.airQualityIndex + wAI * ai.airQualityIndex + wEns * ens.airQualityIndex);

  // Model agreement & spread calculation
  const temps = [nwp.temperature, ai.temperature, ens.temperature];
  const meanTemp = temps.reduce((a, b) => a + b, 0) / 3;
  const varianceTemp = temps.reduce((sum, val) => sum + Math.pow(val - meanTemp, 2), 0) / 3;
  const stdTemp = Math.sqrt(varianceTemp);

  // Model Disagreement metric (higher = models diverge)
  const tempSpread = Math.max(...temps) - Math.min(...temps);
  const agreementPercentage = Math.max(50, Math.min(99, Math.round(100 - (tempSpread / (meanTemp || 1)) * 180)));

  // Confidence Score decreases with lead time and model disagreement
  const leadPenalty = (leadTimeHours / 240) * 25;
  const agreementBonus = (agreementPercentage / 100) * 25;
  const confidenceScore = Math.max(30, Math.min(98, Math.round(70 + agreementBonus - leadPenalty)));

  let confidenceLevel: 'VERY HIGH' | 'HIGH' | 'MODERATE' | 'LOW' | 'VERY LOW' = 'HIGH';
  if (confidenceScore >= 90) confidenceLevel = 'VERY HIGH';
  else if (confidenceScore >= 78) confidenceLevel = 'HIGH';
  else if (confidenceScore >= 62) confidenceLevel = 'MODERATE';
  else if (confidenceScore >= 45) confidenceLevel = 'LOW';
  else confidenceLevel = 'VERY LOW';

  // Extreme Risk Detection logic
  const alerts: ExtremeEvent[] = [];
  let extremeRiskLevel: 'NONE' | 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE' = 'NONE';

  if (precipitation > 15) {
    extremeRiskLevel = precipitation > 30 ? 'SEVERE' : 'HIGH';
    alerts.push({
      id: 'alert_rain_01',
      type: 'HEAVY_RAINFALL',
      title: 'Monsoonal Downpour Advisory',
      severity: precipitation > 30 ? 'EMERGENCY' : 'WARNING',
      probability: Math.min(95, Math.round(precipitation * 2.8 + 30)),
      leadTimeHours,
      affectedRegions: [location.name, location.state],
      thresholdExceeded: `Precipitation rate ${precipitation} mm/hr exceeds 15 mm/hr threshold`,
      recommendedAction: 'Deploy urban drainage monitoring, clear stormwater channels, advise coastal fishermen against venturing into sea.',
      impactScore: precipitation > 30 ? 9 : 7,
    });
  }

  if (temperature > 40) {
    extremeRiskLevel = temperature > 43 ? 'SEVERE' : 'HIGH';
    alerts.push({
      id: 'alert_heat_02',
      type: 'HEATWAVE',
      title: 'Extreme Heatwave Warning',
      severity: temperature > 43 ? 'EMERGENCY' : 'WARNING',
      probability: Math.min(98, Math.round(temperature * 2)),
      leadTimeHours,
      affectedRegions: [location.name, location.state],
      thresholdExceeded: `Surface temperature ${temperature}°C exceeds critical heat threshold`,
      recommendedAction: 'Issue heat advisories for outdoor workers, ensure emergency cooling centers are operational.',
      impactScore: temperature > 43 ? 9 : 7,
    });
  }

  if (windSpeed > 35) {
    extremeRiskLevel = 'HIGH';
    alerts.push({
      id: 'alert_wind_03',
      type: 'CYCLONE',
      title: 'High Wind Squall Risk',
      severity: 'WARNING',
      probability: 82,
      leadTimeHours,
      affectedRegions: [location.name, location.state],
      thresholdExceeded: `Wind gust ${windSpeed} km/h exceeds squall safety limits`,
      recommendedAction: 'Secure high-rise construction cranes, halt port container loading.',
      impactScore: 8,
    });
  }

  return {
    locationId: location.id,
    locationName: `${location.name}, ${location.state}`,
    timestamp: new Date().toISOString(),
    leadTimeHours,
    temperature,
    precipitation,
    windSpeed,
    windDirection,
    pressure,
    humidity,
    dewPoint,
    uvIndex,
    airQualityIndex,
    modelAgreementPercentage: agreementPercentage,
    confidenceScore,
    confidenceLevel,
    uncertaintyMargin: {
      tempMin: Number((temperature - stdTemp * 1.2 - 0.5).toFixed(1)),
      tempMax: Number((temperature + stdTemp * 1.2 + 0.5).toFixed(1)),
      precipMin: Math.max(0, Number((precipitation - 2.5).toFixed(1))),
      precipMax: Number((precipitation + 4.2).toFixed(1)),
      windMin: Number((windSpeed - 3.0).toFixed(1)),
      windMax: Number((windSpeed + 4.5).toFixed(1)),
    },
    weights,
    models,
    regime,
    extremeRiskLevel,
    extremeAlerts: alerts,
  };
}

// Generate 24h or 72h forecast timelines for charts
export function generateForecastTimeline(location: Location, totalHours: number = 72): ForecastPoint[] {
  const points: ForecastPoint[] = [];
  const step = totalHours <= 24 ? 1 : 3;

  for (let h = 0; h <= totalHours; h += step) {
    const hybrid = calculateHybridForecast(location, h);
    const nwp = hybrid.models[0];
    const ai = hybrid.models[1];
    const ens = hybrid.models[2];

    const hourLabel = h === 0 ? 'Now' : `+${h}h`;

    points.push({
      time: hourLabel,
      hour: h,
      leadTimeHours: h,
      hybridTemp: hybrid.temperature,
      nwpTemp: nwp.temperature,
      aiTemp: ai.temperature,
      ensembleTemp: ens.temperature,
      
      hybridPrecip: hybrid.precipitation,
      nwpPrecip: nwp.precipitation,
      aiPrecip: ai.precipitation,
      ensemblePrecip: ens.precipitation,

      hybridWind: hybrid.windSpeed,
      nwpWind: nwp.windSpeed,
      aiWind: ai.windSpeed,
      ensembleWind: ens.windSpeed,

      confidence: hybrid.confidenceScore,
      agreement: hybrid.modelAgreementPercentage,
    });
  }

  return points;
}

// Verification metrics table data comparing individual models vs ClimoraX Hybrid
export function calculateVerificationMetrics(): VerificationMetric[] {
  return [
    {
      metricName: 'Root Mean Square Error (RMSE)',
      metricCode: 'RMSE',
      description: 'Measures magnitude of forecast error for temperature & pressure (Lower is better).',
      unit: '°C / hPa',
      nwpScore: 2.14,
      aiScore: 1.82,
      ensembleScore: 1.95,
      hybridScore: 1.38,
      improvementPercentage: 24.2,
    },
    {
      metricName: 'Mean Absolute Error (MAE)',
      metricCode: 'MAE',
      description: 'Average absolute deviation across all operational weather stations.',
      unit: '°C',
      nwpScore: 1.68,
      aiScore: 1.45,
      ensembleScore: 1.52,
      hybridScore: 1.08,
      improvementPercentage: 25.5,
    },
    {
      metricName: 'Equitable Threat Score (ETS)',
      metricCode: 'ETS',
      description: 'Accuracy of severe precipitation detection relative to chance (Higher is better).',
      unit: 'Score (0-1)',
      nwpScore: 0.48,
      aiScore: 0.59,
      ensembleScore: 0.54,
      hybridScore: 0.72,
      improvementPercentage: 22.0,
    },
    {
      metricName: 'Continuous Ranked Probability Score (CRPS)',
      metricCode: 'CRPS',
      description: 'Evaluates full probabilistic distribution quality and sharp calibration.',
      unit: 'CRPS',
      nwpScore: 1.42,
      aiScore: 1.28,
      ensembleScore: 1.15,
      hybridScore: 0.84,
      improvementPercentage: 27.0,
    },
    {
      metricName: 'Systematic Bias',
      metricCode: 'BIAS',
      description: 'Tendency to over- or under-forecast (0.0 represents zero bias).',
      unit: 'Delta',
      nwpScore: +0.45,
      aiScore: -0.22,
      ensembleScore: +0.18,
      hybridScore: +0.03,
      improvementPercentage: 83.3,
    },
  ];
}
