# CLIMORAX — Adaptive Weather Intelligence

> **Multiple forecasts. One intelligent view.**
> Smart India Hackathon (SIH) 2026 Problem Statement PS-26081 Implementation
> Developed by Team Hacksphere1

---

## 1. Project Overview

**CLIMORAX** is an operational-grade, multi-model weather intelligence platform engineered to address the core challenges of modern meteorological forecasting. Instead of relying on a single deterministic weather model or treating AI/NWP predictions as a black box, CLIMORAX dynamically blends:

1. **Numerical Weather Prediction (NWP Core)**: High-resolution physics-based hydro-thermodynamic equations (ECMWF IFS / IMD GFS).
2. **AI WeatherNet**: Deep learning graph neural network trained on reanalysis data for high-resolution short-range pattern inference.
3. **Ensemble Fusion**: 50-member perturbed initial condition ensemble providing spatial variance and tail-risk bounds.

By evaluating **Historical Model Skill**, **Weather Regime (e.g., Monsoon, Heat Wave, Cyclonic)**, **Lead-Time Horizon Decay**, and **Inter-Model Agreement**, CLIMORAX computes an optimal hybrid consensus with transparent, explainable model weight attributions.

---

## 2. Problem Statement (SIH PS-26081)

Meteorological agencies and disaster response personnel face several critical hurdles:
* **Model Disagreement**: Individual weather models (NWP vs AI vs Ensembles) frequently diverge on precipitation intensity, landfall trajectory, and peak temperature timing.
* **Black-Box AI Models**: Machine learning weather models provide point forecasts without explaining why a prediction was made or when the model might be out of domain skill.
* **Lead-Time Decay**: AI models excel at short-range horizons (<48h) but degrade rapidly at extended lead times (>120h), whereas NWP models maintain physical conservation laws over longer horizons.
* **Operational Decision Fatigue**: Emergency managers need clear risk signals and confidence calibration, not confusing raw ensemble dumps.

**CLIMORAX** solves this by providing a unified, adaptive blending engine with complete feature explainability, hazard detection, and backtesting verification scorecards.

---

## 3. System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            INPUT WEATHER DATASETS                           │
│  ┌───────────────────────┐  ┌───────────────────────┐  ┌─────────────────┐ │
│  │   NWP Physics Core    │  │     AI WeatherNet     │  │ Ensemble Fusion │ │
│  │ (ECMWF IFS / IMD GFS) │  │(Graph Neural Network) │  │  (50 Members)   │ │
│  └───────────┬───────────┘  └───────────┬───────────┘  └────────┬────────┘ │
└──────────────┼──────────────────────────┼───────────────────────┼──────────┘
               │                          │                       │
               ▼                          ▼                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                   DETERMINISTIC FUSION & WEIGHTING ENGINE                   │
│                                                                             │
│   • Regional Skill Matrix     • Weather Regime Classifier (Monsoon/Heat)   │
│   • Lead-Time Decay Function  • Disagreement Spread / Variance Calculation │
│                                                                             │
│                        Normalized Weights Σ(w_i) = 1.0                      │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      CLIMORAX HYBRID FORECAST OUTPUT                        │
│                                                                             │
│   • Consensus Forecast       • Calibrated Confidence Score                  │
│   • Multi-Model Agreement %  • Extreme Risk Classification (IMD/NDMA)       │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       OPERATIONAL INTELLIGENCE DASHBOARD                    │
│                                                                             │
│   /dashboard      /forecast       /models         /weights       /extremes  │
│   /explainability /verification   /assistant      /settings                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Technology Stack

* **Framework**: [Next.js 15+ App Router](https://nextjs.org/) (React 19)
* **Language**: TypeScript (Strict Mode)
* **Styling**: Tailwind CSS v4, Lucide React Icons
* **Data Visualization**: Recharts (ComposedCharts, LineCharts, BarCharts)
* **Mapping**: Leaflet / Custom SVG Interactive Regional Maps
* **AI & LLM**: Google GenAI SDK (`@google/genai`) for Gemini 3.5 / 3.6 operational assistant integration
* **State Management**: React Context (`AppContext`) with global filter state propagation

---

## 5. Local Setup Instructions

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher

### Steps

1. **Clone & Navigate**:
   ```bash
   git clone https://github.com/your-org/climorax.git
   cd climorax
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   *Note: Set your `GEMINI_API_KEY` in `.env.local` for AI Assistant queries.*

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

5. **Build for Production**:
   ```bash
   npm run build
   npm run start
   ```

---

## 6. npm Commands

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts local Next.js development server on port 3000 |
| `npm run build` | Compiles production build and runs TypeScript / Next.js checks |
| `npm run start` | Launches production Node.js server |
| `npm run lint` | Runs ESLint analysis across codebase |

---

## 7. Project Structure

```
├── app/
│   ├── api/                   # REST Route Handlers (/api/forecast, /api/models, etc.)
│   ├── assistant/             # ClimoraX Intelligence Assistant page
│   ├── dashboard/             # Command Center Dashboard
│   ├── explainability/        # Forecast Explainability & Feature Contribution
│   ├── extremes/              # Extreme Weather Early Warning & Hazard Center
│   ├── forecast/              # Multi-Model Hybrid Forecast Workspace
│   ├── models/                # Model Intelligence & Skill Matrix
│   ├── settings/              # Ingestion Pipelines & System Configuration
│   ├── verification/          # Forecast Verification & Backtesting Scorecards
│   ├── weights/               # Adaptive Weight Maps & Simulator
│   ├── globals.css            # Global Tailwind CSS import
│   ├── layout.tsx             # Root layout with SEO metadata & theme
│   └── page.tsx               # Root page (redirects to /dashboard)
├── components/
│   ├── context/               # Global AppContext state provider
│   ├── layout/                # AppShell, Header, Sidebar
│   ├── maps/                  # Interactive IndiaWeatherMap
│   ├── ui/                    # Reusable StatusBadges, Skeletons, ErrorBoundary, Modals
├── lib/
│   ├── constants/             # Weather constants and threshold definitions
│   ├── mock-data/             # Station locations and historical reanalysis records
│   ├── simulation/            # Centralized deterministic blending & weight calculation engine
│   └── types/                 # TypeScript type definitions for weather & models
├── .env.example               # Safe environment variable template
├── metadata.json              # Applet metadata
├── package.json               # NPM package configuration
└── README.md                  # Comprehensive project documentation
```

---

## 8. Demo Data & Simulation Disclaimer

> **IMPORTANT SCIENTIFIC DISCLAIMER**:
> The current demonstration environment uses a **deterministic, seeded simulation engine** to model weather predictions across 16 operational Indian station sectors (including Mumbai, New Delhi, Jaipur, Kolkata, Chennai, Srinagar, etc.).
>
> * Displayed values represent simulated meteorological predictions.
> * Confidence scores represent model convergence indices, not direct probabilities of correctness.
> * Operational emergency hazard thresholds are mapped to official IMD / NDMA criteria for decision support demonstration.

---

## 9. How to Replace Simulation with Real Meteorological APIs

To connect CLIMORAX to live operational data feeds:

1. **Replace Route Handlers (`app/api/*/route.ts`)**:
   Modify the Next.js API route handlers to fetch GRIB2 or NetCDF datasets from:
   * **IMD Open Data Portal** (Indian Meteorological Department GFS / AWS API)
   * **ECMWF Open Data API** (Integrated Forecasting System GRIB2 files)
   * **NOAA GFS / GEFS API** (Global Ensemble Forecast System)

2. **Parsing Data**:
   Parse incoming NetCDF/GRIB2 files using Node.js wrappers like `netcdf4` or `grib2-json` and normalize values into the `HybridForecastData` TypeScript interface in `lib/types/weather.ts`.

3. **Connecting Model Weights**:
   Replace the deterministic weight engine in `lib/simulation/blending-engine.ts` with predictions from an offline-trained XGBoost or Random Forest weight predictor model.

---

## 10. Future ML Integration Architecture

For production deployment with real machine learning models:

* **Offline Training**: Train gradient-boosted decision trees (XGBoost / LightGBM) or Graph Neural Networks on 10+ years of ERA5 reanalysis and IMD AWS ground truth observations.
* **On-Line Weight Prediction**: Expose an ONNX runtime inference endpoint or Python FastAPI container that takes current NWP, AI, and Ensemble spatial outputs and outputs normalized model weight vectors $w_i$.
* **Real-time Calibrated Verification**: Connect live ground truth Automatic Weather Station (AWS) telemetry streams to continuously calculate Brier Scores, CRPS, and CSI skill metrics in real time.
