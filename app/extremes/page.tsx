'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/components/context/AppContext';
import { AppShell } from '@/components/layout/AppShell';
import { IndiaWeatherMap, MapVariable } from '@/components/maps/IndiaWeatherMap';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SeverityBadge, SeverityType } from '@/components/ui/SeverityBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ModelBadge } from '@/components/ui/ModelBadge';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Clock, 
  Droplets, 
  Flame, 
  Wind, 
  CloudLightning, 
  Waves, 
  MapPin, 
  Siren, 
  Bot, 
  ArrowRight, 
  X, 
  Info, 
  Globe, 
  CheckCircle2, 
  Compass,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

export type EventFilterType = 'All' | 'Rain' | 'Heat' | 'Wind' | 'Storm';

export default function ExtremesPage() {
  return (
    <AppShell>
      <ExtremesCenterContent />
    </AppShell>
  );
}

function ExtremesCenterContent() {
  const router = useRouter();
  const { hybridData, selectedLocation, setSelectedLocation, locations, leadTimeHours, setLeadTimeHours } = useApp();

  const [activeFilter, setActiveFilter] = useState<EventFilterType>('All');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi' | 'mr' | 'bn' | 'ta'>('en');
  const [selectedDrawerEvent, setSelectedDrawerEvent] = useState<any | null>(null);

  // Detailed risk events list across Indian sectors
  const riskEventsList = [
    {
      id: 'risk_01',
      title: 'Monsoonal Heavy Rainfall Surge',
      category: 'Rain',
      region: 'Maharashtra (Konkan Coast)',
      locationId: 'mumbai',
      expectedRange: '120 – 180 mm',
      leadTime: '18h',
      severity: 'SEVERE' as SeverityType,
      agreement: '88% High',
      confidence: 82,
      dominantModel: 'AI WeatherNet',
      detected: 'Sustained precipitation rate >15 mm/h advecting from Arabian Sea plume.',
      flaggedReason: 'High moisture flux advection combined with urban drainage vulnerability.',
      regimeSimilarity: 'Similar to July 2021 Konkan extreme monsoon episode (91% match).',
      whyMatters: 'Urban low-lying transport corridors face localized waterlogging risk. Pre-positioning pumps recommended.',
      actionableAdvice: 'Monitor AWS station precipitation gauges every 30 mins; alert municipal drainage control rooms.',
    },
    {
      id: 'risk_02',
      title: 'Severe Heatwave Thermal Ridge Signal',
      category: 'Heat',
      region: 'Rajasthan & Delhi Sector',
      locationId: 'jaipur',
      expectedRange: '42.5 – 45.8 °C',
      leadTime: '42h',
      severity: 'HIGH' as SeverityType,
      agreement: '92% High',
      confidence: 86,
      dominantModel: 'NWP Core',
      detected: 'Sub-tropical anti-cyclonic subsidence generating severe thermal heat ridge.',
      flaggedReason: 'Surface temperature exceeding +5.2 °C above seasonal normal.',
      regimeSimilarity: 'Matches June 2022 North India thermal ridge pattern (88% match).',
      whyMatters: 'Increased heat stress on outdoor labor and peak power grid demand spikes.',
      actionableAdvice: 'Issue public health advisories for cooling centers and power grid emergency reserves.',
    },
    {
      id: 'risk_03',
      title: 'High Wind Coastal Gale Squall Signal',
      category: 'Wind',
      region: 'Gujarat Coast & Gulf of Kutch',
      locationId: 'ahmedabad',
      expectedRange: '45 – 65 km/h',
      leadTime: '27h',
      severity: 'ELEVATED' as SeverityType,
      agreement: '79% Moderate',
      confidence: 74,
      dominantModel: 'Ensemble Fusion',
      detected: 'Pressure gradient compression along coastal trough boundary.',
      flaggedReason: 'Wind gusts exceeding 45 km/h threshold for offshore marine safety.',
      regimeSimilarity: 'Matches pre-cyclonic squall conditions (84% match).',
      whyMatters: 'Small fishing craft and offshore port container loading operations face elevated sea state.',
      actionableAdvice: 'Issue marine safety advisories halting small craft venturing into deep sea.',
    },
    {
      id: 'risk_04',
      title: 'Convective Thunderstorm & Lightning Alert',
      category: 'Storm',
      region: 'Assam Valley & Gangetic Plains',
      locationId: 'guwahati',
      expectedRange: '35 – 55 mm + Lightning',
      leadTime: '12h',
      severity: 'WATCH' as SeverityType,
      agreement: '84% High',
      confidence: 80,
      dominantModel: 'AI WeatherNet',
      detected: 'High Convective Available Potential Energy (CAPE >2800 J/kg) trigger.',
      flaggedReason: 'Rapid localized updrafts capable of producing cloud-to-ground lightning squalls.',
      regimeSimilarity: 'Matches pre-monsoonal Nor’wester Kalbaishakhi thunderstorms.',
      whyMatters: 'Agricultural workers and outdoor electricity infrastructure face lightning strike potential.',
      actionableAdvice: 'Issue short-range emergency lightning squall warning via local broadcast media.',
    },
  ];

  const filteredEvents = riskEventsList.filter((e) => {
    if (activeFilter === 'All') return true;
    return e.category === activeFilter;
  });

  // Multilingual advisory text dictionary
  const multilingualAdvisories = {
    en: {
      lang: 'English',
      title: 'Elevated Monsoonal Rain Risk Advisory',
      body: 'Forecast models indicate an elevated risk signal for heavy rainfall (120–180 mm) in Konkan sector over the next 18 hours. District authorities recommended to maintain active monitoring of urban drainage channels.',
    },
    hi: {
      lang: 'हिन्दी (Hindi)',
      title: 'भारी मानसून वर्षा जोखिम चेतावनी',
      body: 'पूर्वानुमान मॉडल अगले 18 घंटों में कोंकण क्षेत्र में भारी बारिश (120-180 मिमी) के बढ़े हुए जोखिम का संकेत देते हैं। जिला अधिकारियों को शहरी जल निकासी चैनलों की सक्रिय निगरानी बनाए रखने की सिफारिश की जाती है।',
    },
    mr: {
      lang: 'मराठी (Marathi)',
      title: 'मुसळधार पावसाचा इशारा',
      body: 'पुढील १८ तासांत कोकण भागात मुसळधार पावसाचा (१२०-१८० मिमी) धोका वाढल्याचा अंदाज मॉडेल दर्शवत आहेत. जिल्हा प्रशासनाने नागरी निचरा वाहिनींवर लक्ष ठेवावे.',
    },
    bn: {
      lang: 'বাংলা (Bengali)',
      title: 'ভারী বর্ষণ ঝুঁকি সতর্কতা',
      body: 'পূর্বাভাস মডেলগুলি আগামী ১৮ ঘণ্টার মধ্যে কোঙ্কন অঞ্চলে ভারী বর্ষণের (১২০-১৮০ মিমি) ঝুঁকি নির্দেশ করছে। জেলা কর্তৃপক্ষকে নিকাশি ব্যবস্থার সক্রিয় পর্যবেক্ষণ বজায় রাখার পরামর্শ দেওয়া হচ্ছে।',
    },
    ta: {
      lang: 'தமிழ் (Tamil)',
      title: 'கனமழை ஆபத்து எச்சரிக்கை',
      body: 'அடுத்த 18 மணி நேரத்தில் கொங்கன் பகுதியில் கனமழை (120-180 மிமீ) பெய்யக்கூடும் என கணிப்பு மாதிரிகள் சுட்டிக்காட்டுகின்றன. மாவட்ட அதிகாரிகள் வடிகால் வாய்க்கால்களை தீவிரமாக கண்காணிக்க அறிவுறுத்தப்படுகிறார்கள்.',
    },
  };

  const currentAdv = multilingualAdvisories[selectedLanguage];

  // Helper to handle "Explain this risk" navigation to AI Assistant
  const handleExplainRisk = (eventTitle: string, region: string) => {
    const query = encodeURIComponent(`Explain the risk signal for "${eventTitle}" in ${region}. What are the model weights and recommended precautions?`);
    router.push(`/assistant?prompt=${query}`);
  };

  return (
    <div className="space-y-6">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyan-900/30 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-100 font-sans tracking-tight flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-red-400 animate-pulse" />
              Extreme Weather Center
            </h1>
            <span className="text-[10px] font-mono text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-800">
              DECISION SUPPORT PROTOCOL
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Risk-oriented interpretation of the hybrid forecast (Disaster Management Decision Support)
          </p>
        </div>

        {/* Threshold Disclaimer Note */}
        <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-[10px] text-slate-400 font-mono max-w-sm">
          *Production emergency thresholds are derived from official IMD / NDMA criteria. Displayed values are simulated prototype decision-support signals.
        </div>
      </div>

      {/* 2. TOP KPI STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="text-slate-400 text-[10px] font-mono font-bold uppercase">Active Signals</div>
          <div className="text-2xl font-extrabold text-red-400 font-mono">4 Detected</div>
          <div className="text-[10px] text-slate-400 font-mono">Rain, Heat, Wind, Storm</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="text-slate-400 text-[10px] font-mono font-bold uppercase">Regions Monitored</div>
          <div className="text-2xl font-extrabold text-slate-100 font-mono">16 Stations</div>
          <div className="text-[10px] text-slate-400 font-mono">Pan-India High Risk Zones</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="text-slate-400 text-[10px] font-mono font-bold uppercase">Highest Risk Sector</div>
          <div className="text-sm font-extrabold text-red-300 font-sans truncate">Maharashtra Konkan</div>
          <div className="text-[10px] text-red-400 font-mono font-bold">SEVERE RISK SIGNAL</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="text-slate-400 text-[10px] font-mono font-bold uppercase">Model Agreement</div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">88% High</div>
          <div className="text-[10px] text-slate-400 font-mono">Low Ensemble Disagreement</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="text-slate-400 text-[10px] font-mono font-bold uppercase">Critical Horizon</div>
          <div className="text-2xl font-extrabold text-cyan-400 font-mono">+18h Lead</div>
          <div className="text-[10px] text-slate-400 font-mono">Monsoonal Downpour Peak</div>
        </div>
      </div>

      {/* 3. MAIN INTERACTIVE MAP & RISK CARDS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: India Map with Event Overlays */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs font-mono">
            <span className="text-slate-300 font-bold flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-cyan-400" /> Event Filter:
            </span>
            <div className="flex items-center gap-1">
              {(['All', 'Rain', 'Heat', 'Wind', 'Storm'] as EventFilterType[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-3 py-1 rounded font-bold transition-colors ${
                    activeFilter === f ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-100'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <IndiaWeatherMap
            selectedLocation={selectedLocation}
            onSelectLocation={(loc) => setSelectedLocation(loc)}
            leadTimeHours={leadTimeHours}
            onLeadTimeChange={(h) => setLeadTimeHours(h)}
          />
        </div>

        {/* Right 5 Columns: Risk Cards List */}
        <div className="lg:col-span-5 space-y-4">
          <SectionHeader
            title="Detected Risk Signals"
            subtitle="Click card for detail drawer or ask AI Assistant"
            icon={AlertTriangle}
            badge={`${filteredEvents.length} Signals`}
          />

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                onClick={() => {
                  const loc = locations.find((l) => l.id === evt.locationId);
                  if (loc) setSelectedLocation(loc);
                  setSelectedDrawerEvent(evt);
                }}
                className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/60 rounded-xl p-4 shadow-xl space-y-3 cursor-pointer transition-all hover:scale-[1.01]"
              >
                <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-100 text-sm font-sans">{evt.title}</h3>
                      <SeverityBadge severity={evt.severity} />
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">{evt.region}</p>
                  </div>

                  <div className="text-right font-mono text-xs">
                    <div className="text-slate-400 text-[10px]">Lead Time</div>
                    <div className="font-bold text-cyan-400">+{evt.leadTime}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Expected Range</div>
                    <div className="font-bold text-slate-100">{evt.expectedRange}</div>
                  </div>
                  <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Hybrid Confidence</div>
                    <div className="font-bold text-emerald-400">{evt.confidence}%</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-slate-400">
                  <span>Dominant: <strong className="text-cyan-400">{evt.dominantModel}</strong></span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExplainRisk(evt.title, evt.region);
                    }}
                    className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 font-bold rounded border border-cyan-800 flex items-center gap-1 transition-colors"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>Explain this risk</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. RISK DEVELOPMENT TIMELINE */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <SectionHeader
          title="Risk Signal Development Timeline (+0h to +48h)"
          subtitle="Chronological progression of potential severe weather windows"
          icon={Clock}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
            <div className="text-cyan-400 font-bold text-xs flex items-center justify-between">
              <span>NOW → +6h</span>
              <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">Phase 1</span>
            </div>
            <div className="text-slate-200 font-sans font-bold">Moisture Advection Setup</div>
            <p className="text-[11px] text-slate-400 font-sans">
              Arabian Sea low pressure trough strengthening off Konkan Coast.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
            <div className="text-amber-400 font-bold text-xs flex items-center justify-between">
              <span>+12h → +18h</span>
              <span className="text-[10px] bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded border border-amber-800">Peak Signal</span>
            </div>
            <div className="text-amber-300 font-sans font-bold">Peak Downpour Window</div>
            <p className="text-[11px] text-slate-400 font-sans">
              Convective cloudburst potential exceeding 15 mm/h in Mumbai / Pune.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
            <div className="text-cyan-400 font-bold text-xs flex items-center justify-between">
              <span>+24h → +36h</span>
              <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">Phase 3</span>
            </div>
            <div className="text-slate-200 font-sans font-bold">Northward Shift</div>
            <p className="text-[11px] text-slate-400 font-sans">
              Precipitation belt moves toward South Gujarat Coast & Gulf of Khambhat.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
            <div className="text-emerald-400 font-bold text-xs flex items-center justify-between">
              <span>+48h</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded">Dissipation</span>
            </div>
            <div className="text-slate-200 font-sans font-bold">Trough Dissipation</div>
            <p className="text-[11px] text-slate-400 font-sans">
              Gradient relaxes; rainfall rates ease to normal seasonal shower levels.
            </p>
          </div>
        </div>
      </div>

      {/* 5. MULTILINGUAL ALERT PREVIEW CARD */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              Multilingual Prototype Alert Advisory Preview
            </h3>
            <p className="text-[11px] text-slate-400">
              Prototype alert text for regional disaster control room dispatches
            </p>
          </div>

          {/* Language Picker Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
            {(['en', 'hi', 'mr', 'bn', 'ta'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-2.5 py-1 rounded font-bold transition-colors ${
                  selectedLanguage === lang ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-950 rounded-xl border border-cyan-800/60 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-cyan-400">{currentAdv.lang} Advisory Preview</span>
            <span className="text-[10px] text-slate-500">PROTOTYPE TEXT</span>
          </div>
          <h4 className="text-sm font-bold text-slate-100 font-sans">{currentAdv.title}</h4>
          <p className="text-xs text-slate-200 leading-relaxed font-sans">{currentAdv.body}</p>
        </div>
      </div>

      {/* 6. EVENT DETAIL DRAWER */}
      {selectedDrawerEvent && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-lg bg-slate-900 border-l border-cyan-800/80 h-full p-6 shadow-2xl overflow-y-auto space-y-5 font-sans">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-400" />
                  {selectedDrawerEvent.title}
                </h3>
                <p className="text-xs text-slate-400 font-mono">{selectedDrawerEvent.region}</p>
              </div>
              <button
                onClick={() => setSelectedDrawerEvent(null)}
                className="p-1.5 text-slate-400 hover:text-slate-100 rounded bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <div className="text-slate-400 text-[10px] uppercase font-bold">What is Detected?</div>
                <p className="text-slate-200 font-sans text-xs">{selectedDrawerEvent.detected}</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Why Flagged?</div>
                <p className="text-slate-200 font-sans text-xs">{selectedDrawerEvent.flaggedReason}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Expected Range</div>
                  <div className="text-cyan-300 font-bold text-sm">{selectedDrawerEvent.expectedRange}</div>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Lead Time</div>
                  <div className="text-slate-100 font-bold text-sm">+{selectedDrawerEvent.leadTime} Horizon</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Model Agreement</div>
                  <div className="text-emerald-400 font-bold text-sm">{selectedDrawerEvent.agreement}</div>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Dominant Model</div>
                  <div className="text-cyan-400 font-bold text-sm">{selectedDrawerEvent.dominantModel}</div>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Historical Regime Similarity</div>
                <p className="text-slate-200 font-sans text-xs">{selectedDrawerEvent.regimeSimilarity}</p>
              </div>

              <div className="p-3 bg-red-950/40 rounded-lg border border-red-800/80 space-y-1 font-sans">
                <div className="text-red-300 text-[10px] font-mono font-bold uppercase">Why This Matters (Operational Context):</div>
                <p className="text-red-100 text-xs leading-relaxed">{selectedDrawerEvent.whyMatters}</p>
              </div>

              <div className="p-3 bg-cyan-950/40 rounded-lg border border-cyan-800/80 space-y-1 font-sans">
                <div className="text-cyan-300 text-[10px] font-mono font-bold uppercase">Recommended Action:</div>
                <p className="text-cyan-100 text-xs leading-relaxed">{selectedDrawerEvent.actionableAdvice}</p>
              </div>

              <button
                onClick={() => handleExplainRisk(selectedDrawerEvent.title, selectedDrawerEvent.region)}
                className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg transition-colors flex items-center justify-center gap-2 font-sans text-xs mt-2"
              >
                <Bot className="w-4 h-4" />
                <span>Ask AI Assistant to explain this risk in detail</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
