export type WeatherVariable = 
  | 'temperature' 
  | 'precipitation' 
  | 'windSpeed' 
  | 'pressure' 
  | 'humidity' 
  | 'airQualityIndex';

export interface Location {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  elevation: number; // in meters
  climateZone: 'Tropical Wet' | 'Semi-Arid' | 'Humid Subtropical' | 'Mountainous' | 'Coastal Monsoon';
  isHighRiskZone?: boolean;
}

export interface ModelForecast {
  modelId: string;
  modelName: string;
  modelType: 'NWP' | 'AI' | 'ENSEMBLE';
  version: string;
  provider: string;
  temperature: number; // °C
  precipitation: number; // mm/h
  windSpeed: number; // km/h
  windDirection: number; // degrees
  pressure: number; // hPa
  humidity: number; // %
  dewPoint: number; // °C
  uvIndex: number;
  airQualityIndex: number;
  uncertaintyScore: number; // 0 to 100
}

export interface ModelWeight {
  modelId: string;
  modelName: string;
  modelType: 'NWP' | 'AI' | 'ENSEMBLE';
  weight: number; // 0.0 to 1.0 (sum of all weights = 1.0)
  historicalSkillScore: number; // 0 to 100
  regimeSuitability: number; // 0 to 100
  leadTimeDecayFactor: number;
  color: string;
}

export interface HybridForecast {
  locationId: string;
  locationName: string;
  timestamp: string;
  leadTimeHours: number; // e.g. 6, 12, 24, 48, 72, 120, 240
  temperature: number;
  precipitation: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  humidity: number;
  dewPoint: number;
  uvIndex: number;
  airQualityIndex: number;
  
  // Consensus and Uncertainty
  modelAgreementPercentage: number; // 0-100%
  confidenceScore: number; // 0-100
  confidenceLevel: 'VERY HIGH' | 'HIGH' | 'MODERATE' | 'LOW' | 'VERY LOW';
  uncertaintyMargin: {
    tempMin: number;
    tempMax: number;
    precipMin: number;
    precipMax: number;
    windMin: number;
    windMax: number;
  };
  
  // Weights applied
  weights: ModelWeight[];
  // Raw forecasts input
  models: ModelForecast[];
  // Weather regime
  regime: WeatherRegime;
  // Detected extreme risks
  extremeRiskLevel: 'NONE' | 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
  extremeAlerts: ExtremeEvent[];
}

export interface WeatherRegime {
  id: string;
  name: 'Monsoon Low Pressure' | 'Convective Thunderstorm' | 'Heatwave Surge' | 'Western Disturbance' | 'Tropical Cyclone' | 'Stable Anti-Cyclone';
  code: string;
  description: string;
  favorableModelType: 'NWP' | 'AI' | 'ENSEMBLE';
  stabilityIndex: number; // CAPE / K-Index proxy
  dominantFactors: string[];
  spatialExtents: string;
}

export interface ExtremeEvent {
  id: string;
  type: 'CYCLONE' | 'HEAVY_RAINFALL' | 'HEATWAVE' | 'FLASH_FLOOD' | 'DUST_STORM' | 'SEVERE_THUNDERSTORM';
  title: string;
  severity: 'WATCH' | 'ADVISORY' | 'WARNING' | 'EMERGENCY';
  probability: number; // 0-100%
  leadTimeHours: number;
  affectedRegions: string[];
  thresholdExceeded: string;
  recommendedAction: string;
  impactScore: number; // 1-10
}

export interface VerificationMetric {
  metricName: string;
  metricCode: 'RMSE' | 'MAE' | 'ETS' | 'CRPS' | 'BIAS' | 'POD' | 'FAR';
  description: string;
  unit: string;
  nwpScore: number;
  aiScore: number;
  ensembleScore: number;
  hybridScore: number; // Hybrid system score (should beat individual models)
  improvementPercentage: number;
}

export interface ExplainabilityFeature {
  featureName: string;
  category: 'Regime' | 'Lead Time' | 'Historical Skill' | 'Spatial Error' | 'Atmospheric Dynamics';
  impactValue: number; // SHAP value -1.0 to +1.0
  direction: 'increased_ai' | 'increased_nwp' | 'increased_ensemble';
  explanation: string;
}

export interface ForecastPoint {
  time: string;
  hour: number;
  leadTimeHours: number;
  hybridTemp: number;
  nwpTemp: number;
  aiTemp: number;
  ensembleTemp: number;
  
  hybridPrecip: number;
  nwpPrecip: number;
  aiPrecip: number;
  ensemblePrecip: number;

  hybridWind: number;
  nwpWind: number;
  aiWind: number;
  ensembleWind: number;

  confidence: number;
  agreement: number;
}
