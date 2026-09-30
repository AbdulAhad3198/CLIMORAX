import { WeatherRegime } from '../types/weather';

export const WEATHER_REGIMES: Record<string, WeatherRegime> = {
  monsoon: {
    id: 'monsoon',
    name: 'Monsoon Low Pressure',
    code: 'REG-MONSOON-01',
    description: 'Active monsoon trough over central/coastal India. High moisture transport, convective precipitation, heavy localized downpours.',
    favorableModelType: 'AI', // AI models usually excel at nonlinear precipitation pattern matching
    stabilityIndex: 78,
    dominantFactors: ['850hPa Moisture Flux', 'Bay of Bengal Depression', 'OROGRAPHIC LIFT'],
    spatialExtents: 'Peninsular & Eastern Coast',
  },
  thunderstorm: {
    id: 'thunderstorm',
    name: 'Convective Thunderstorm',
    code: 'REG-THUNDER-02',
    description: 'Mesoscale severe convection with high CAPE, vertical wind shear, rapid lightning activity and hail potential.',
    favorableModelType: 'ENSEMBLE', // Ensemble captures localized convective dispersion
    stabilityIndex: 42,
    dominantFactors: ['CAPE > 2500 J/kg', 'Surface Dewpoint Spike', 'Dryline Convergence'],
    spatialExtents: 'Gangetic Plains & Deccan Plateau',
  },
  heatwave: {
    id: 'heatwave',
    name: 'Heatwave Surge',
    code: 'REG-HEAT-03',
    description: 'Persistent high pressure ridge causing severe solar radiation accumulation and hot advection from arid regions.',
    favorableModelType: 'NWP', // NWP is highly deterministic for synoptic temperature ridges
    stabilityIndex: 92,
    dominantFactors: ['500hPa Geopotential Height Ridge', 'Surface Albedo', 'Desiccating Northwesterlies'],
    spatialExtents: 'North & Central India',
  },
  western_disturbance: {
    id: 'western_disturbance',
    name: 'Western Disturbance',
    code: 'REG-WD-04',
    description: 'Extratropical storm originating in Mediterranean, bringing winter rain/snow to Western Himalayas and Northern Plains.',
    favorableModelType: 'NWP', // Physics-based NWP handles large-scale baroclinic waves best
    stabilityIndex: 65,
    dominantFactors: ['Subtropical Jet Stream', '500hPa Trough', 'Himalayan Orography'],
    spatialExtents: 'J&K, Himachal, Punjab, Haryana, Delhi',
  },
  cyclone: {
    id: 'cyclone',
    name: 'Tropical Cyclone',
    code: 'REG-CYCLONE-05',
    description: 'Severe cyclonic vortex over North Indian Ocean / Bay of Bengal with storm surge, gale winds and torrential rainfall.',
    favorableModelType: 'ENSEMBLE', // Multi-member ensemble crucial for track and landfall spread
    stabilityIndex: 18,
    dominantFactors: ['SST > 28°C', 'Low Vertical Wind Shear', 'Core Vorticity'],
    spatialExtents: 'Bay of Bengal & Arabian Sea Coasts',
  },
  stable: {
    id: 'stable',
    name: 'Stable Anti-Cyclone',
    code: 'REG-STABLE-06',
    description: 'Clear sky, light surface winds, strong subsidence inversion leading to atmospheric stagnation or smog retention.',
    favorableModelType: 'AI', // AI captures boundary layer thermal inversions efficiently
    stabilityIndex: 88,
    dominantFactors: ['Subsidence Inversion', 'Low Surface Wind', 'Radiation Boundary Layer'],
    spatialExtents: 'Pan-India Dry Season',
  }
};
