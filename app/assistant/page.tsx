'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/components/context/AppContext';
import { AppShell } from '@/components/layout/AppShell';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { formatTemp, formatPrecip, formatSpeed } from '@/lib/formatting/units';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  RefreshCw, 
  Mic, 
  Globe, 
  MapPin, 
  Clock, 
  Activity, 
  Info
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export default function AssistantPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="p-6 text-slate-400 font-mono">Loading Assistant...</div>}>
        <AssistantPageContent />
      </Suspense>
    </AppShell>
  );
}

function AssistantPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('prompt') || '';

  const { selectedLocation, hybridData, leadTimeHours, unit } = useApp();

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi' | 'mr' | 'bn' | 'ta'>('en');
  const [micActive, setMicActive] = useState(false);

  const dominantModel = [...hybridData.weights].sort((a, b) => b.weight - a.weight)[0];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome-1',
      sender: 'assistant',
      text: `Greetings. I am the ClimoraX Intelligence Assistant, an operational meteorological copilot. I am monitoring live simulation telemetry for ${selectedLocation.name}, ${selectedLocation.state} (+${leadTimeHours}h horizon). How can I assist with forecast interpretation, model blending weights, or regional risk signals today?`,
      timestamp: '08:00 AM',
    },
  ]);

  // Specific required quick prompts list
  const quickPromptsList = [
    "Why is AI WeatherNet weighted higher here?",
    "Compare the models for rainfall.",
    "What regions have elevated rainfall risk?",
    "Why is confidence lower at 120 hours?",
    "Explain the forecast in simple language.",
    "What does model disagreement mean?",
  ];

  // Deterministic response generator grounded in current application state
  const generateGroundedResponse = useCallback((userText: string, lang: 'en' | 'hi' | 'mr' | 'bn' | 'ta') => {
    const textLower = userText.toLowerCase();

    // Multilingual response handlers for predefined intents
    if (textLower.includes('weighted higher') || textLower.includes('why is ai') || textLower.includes('model weights')) {
      if (lang === 'hi') {
        return `वर्तमान में ${selectedLocation.name} के लिए AI WeatherNet को सर्वोच्च भार (${(hybridData.weights[1].weight * 100).toFixed(0)}%) दिया गया है क्योंकि +${leadTimeHours} घंटे के पूर्वानुमान में मानसूनी वर्षा पैटर्न की सटीकता के लिए इसका ऐतिहासिक स्कोर (88/100) उच्चतम है।`;
      }
      if (lang === 'mr') {
        return `सध्या ${selectedLocation.name} साठी AI WeatherNet ला सर्वाधिक वजन (${(hybridData.weights[1].weight * 100).toFixed(0)}%) दिले गेले आहे कारण या हवामान स्थितीत त्याचा ऐतिहासिक स्कोअर (88/100) सर्वोत्तम आहे.`;
      }
      return `For ${selectedLocation.name} (+${leadTimeHours}h horizon), ${dominantModel.modelName} currently holds the highest weight (${(dominantModel.weight * 100).toFixed(1)}%). The blending engine assigns this higher weight because the active weather regime (${hybridData.regime.name}) demonstrates superior non-linear spatial skill for monsoonal moisture advection. NWP Core holds ${(hybridData.weights[0].weight * 100).toFixed(1)}% and Ensemble Fusion holds ${(hybridData.weights[2].weight * 100).toFixed(1)}%.`;
    }

    if (textLower.includes('compare the models') || textLower.includes('compare') || textLower.includes('rainfall')) {
      const nwp = hybridData.models[0];
      const ai = hybridData.models[1];
      const ens = hybridData.models[2];

      return `Model Rainfall Comparison for ${selectedLocation.name} (+${leadTimeHours}h):\n` +
        `• NWP Core (IFS): ${formatPrecip(nwp.precipitation)} (Tends to overestimate convective peaks slightly)\n` +
        `• AI WeatherNet: ${formatPrecip(ai.precipitation)} (Smooths peaks, aligns spatial moisture plume)\n` +
        `• Ensemble Fusion: ${formatPrecip(ens.precipitation)} (Mean of 50 perturbed members)\n` +
        `• ClimoraX Hybrid Consensus: ${formatPrecip(hybridData.precipitation)} (Dynamically weighted output with ${hybridData.confidenceScore}% confidence).`;
    }

    if (textLower.includes('elevated rainfall risk') || textLower.includes('regions') || textLower.includes('risk')) {
      return `Regional Risk Signal Breakdown:\n` +
        `1. Konkan Coast (Maharashtra): SEVERE RISK - Heavy rainfall (120–180 mm expected in 18h).\n` +
        `2. Rajasthan & Delhi Sector: HIGH RISK - Thermal heat ridge signal (42–45°C).\n` +
        `3. Gujarat Coast: ELEVATED RISK - Coastal gale squall gusts (45–65 km/h).\n` +
        `4. Assam Valley: WATCH - Convective thunderstorm and lightning activity.\n` +
        `Note: Displayed values are simulated prototype risk signals for decision support.`;
    }

    if (textLower.includes('120 hours') || textLower.includes('lower at 120') || textLower.includes('confidence')) {
      return `System confidence decreases at extended lead times (+120h) due to atmospheric chaos and lead-time decay behavior. At +24h, confidence is high (${hybridData.confidenceScore}%) because AI and NWP models agree closely. Beyond +72h, model trajectories diverge, widening the ensemble spread corridor and lowering calibrated system confidence.`;
    }

    if (textLower.includes('simple language') || textLower.includes('simple')) {
      return `In simple terms for ${selectedLocation.name}:\n` +
        `Expect ${hybridData.precipitation > 5 ? 'heavy monsoonal showers' : 'moderate weather'} over the next ${leadTimeHours} hours with temperatures around ${formatTemp(hybridData.temperature, unit)}. All three computer forecasting systems are in good agreement (${hybridData.modelAgreementPercentage}%), making this a reliable forecast.`;
    }

    if (textLower.includes('model disagreement') || textLower.includes('disagreement')) {
      return `Model disagreement measures how much individual forecasting systems (NWP, AI, Ensemble) differ in their predictions. Low disagreement (${hybridData.modelAgreementPercentage}% agreement currently) means models are converging on similar outcomes, indicating higher forecast stability. High disagreement indicates elevated atmospheric uncertainty.`;
    }

    // Default grounded fall-back response
    return `ClimoraX Operational Analysis for ${selectedLocation.name}:\n` +
      `• Hybrid Forecast: ${formatPrecip(hybridData.precipitation)}, ${formatTemp(hybridData.temperature, unit)}, ${formatSpeed(hybridData.windSpeed)}\n` +
      `• Active Regime: ${hybridData.regime.name}\n` +
      `• Dynamic Weights: AI WeatherNet (${(hybridData.weights[1].weight * 100).toFixed(0)}%), NWP Core (${(hybridData.weights[0].weight * 100).toFixed(0)}%), Ensemble (${(hybridData.weights[2].weight * 100).toFixed(0)}%)\n` +
      `• System Confidence: ${hybridData.confidenceScore}% (${hybridData.confidenceLevel}).\n\n` +
      `This operational intelligence response is generated directly from live simulation telemetry.`;
  }, [selectedLocation, hybridData, leadTimeHours, dominantModel, unit]);

  const handleSend = useCallback((customPrompt?: string) => {
    const query = customPrompt || prompt;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setPrompt('');
    setLoading(true);

    setTimeout(() => {
      const responseText = generateGroundedResponse(query, selectedLanguage);
      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now() + 1}`,
        sender: 'assistant',
        text: responseText,
        timestamp: 'Now',
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setLoading(false);
    }, 400);
  }, [prompt, loading, generateGroundedResponse, selectedLanguage]);

  // Auto-send initial query if passed in query param
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      const timer = setTimeout(() => {
        handleSend(initialQuery);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [initialQuery, handleSend]);

  const toggleMic = () => {
    setMicActive(!micActive);
    if (!micActive) {
      setPrompt("Why is AI WeatherNet weighted higher here?");
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER AREA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-900/30 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2 font-sans">
              <Bot className="w-6 h-6 text-cyan-400" />
              ClimoraX Intelligence Assistant
            </h1>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
              OPERATIONAL COPILOT
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Professional weather intelligence assistant grounded in operational simulation data.
          </p>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800 text-xs font-mono">
          <Globe className="w-3.5 h-3.5 text-cyan-400 ml-1" />
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

      {/* 3-COLUMN OPERATIONAL WORKSPACE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: QUICK PROMPTS & HISTORY (lg:col-span-3) */}
        <div className="lg:col-span-3 space-y-4">
          <SectionHeader
            title="Operational Quick Prompts"
            subtitle="Click to evaluate intent"
            icon={Sparkles}
          />

          <div className="space-y-2">
            {quickPromptsList.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(qp)}
                className="w-full p-2.5 bg-slate-900 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/50 rounded-xl text-left text-xs text-slate-300 font-sans transition-all flex items-center justify-between gap-2 group shadow"
              >
                <span className="line-clamp-2">{qp}</span>
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
              </button>
            ))}
          </div>
        </div>

        {/* CENTER COLUMN: MAIN CHAT MESSAGES & INPUT (lg:col-span-6) */}
        <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-2xl space-y-4 min-h-[420px] max-h-[520px] overflow-y-auto">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex items-start gap-3 text-xs ${
                  m.sender === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`p-2 rounded-xl shrink-0 ${
                    m.sender === 'user'
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-cyan-400 border border-slate-700'
                  }`}
                >
                  {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[85%] p-3.5 rounded-xl space-y-1 ${
                    m.sender === 'user'
                      ? 'bg-cyan-950 text-cyan-100 border border-cyan-800/80'
                      : 'bg-slate-950 text-slate-200 border border-slate-800/80'
                  }`}
                >
                  <div className="text-[10px] text-slate-400 font-mono flex justify-between gap-4">
                    <span>{m.sender === 'user' ? 'Disaster Authority' : 'ClimoraX Copilot'}</span>
                    <span>{m.timestamp}</span>
                  </div>
                  <p className="whitespace-pre-wrap leading-relaxed font-sans text-xs">{m.text}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-cyan-400 p-2 font-mono">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Evaluating simulation context & weight matrices...</span>
              </div>
            )}
          </div>

          {/* Chat Input Bar with Simulated Voice UI */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800 shadow-xl">
              <button
                onClick={toggleMic}
                title="Voice Input (Simulated Copilot Microphone)"
                className={`p-2 rounded-lg transition-colors ${
                  micActive ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-800 text-slate-400 hover:text-slate-100'
                }`}
              >
                <Mic className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={`Ask about ${selectedLocation.name} forecast, model weights, or risks...`}
                className="flex-1 bg-transparent text-xs text-slate-100 placeholder-slate-500 px-2 py-2 focus:outline-none font-sans"
              />

              <button
                onClick={() => handleSend()}
                disabled={loading || !prompt.trim()}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-2 shrink-0 font-mono"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            {micActive && (
              <div className="text-[10px] text-red-400 font-mono pl-2">
                • Voice Input Active: Listening for operational speech input (Simulated microphone)...
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE CONTEXT PANEL (lg:col-span-3) */}
        <div className="lg:col-span-3 space-y-4">
          <SectionHeader
            title="Live Context Panel"
            subtitle="Grounded simulation state"
            icon={Info}
          />

          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl space-y-3 font-mono text-xs">
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 space-y-0.5">
              <div className="text-slate-400 text-[10px] flex items-center gap-1">
                <MapPin className="w-3 h-3 text-cyan-400" /> Station Focus
              </div>
              <div className="font-bold text-slate-100 font-sans text-xs">{selectedLocation.name}, {selectedLocation.state}</div>
            </div>

            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 space-y-0.5">
              <div className="text-slate-400 text-[10px] flex items-center gap-1">
                <Clock className="w-3 h-3 text-cyan-400" /> Horizon
              </div>
              <div className="font-bold text-cyan-300">+{leadTimeHours} Hours</div>
            </div>

            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 space-y-0.5">
              <div className="text-slate-400 text-[10px] flex items-center gap-1">
                <Activity className="w-3 h-3 text-purple-400" /> Active Regime
              </div>
              <div className="font-bold text-purple-300 font-sans text-xs">{hybridData.regime.name}</div>
            </div>

            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 space-y-0.5">
              <div className="text-slate-400 text-[10px]">Hybrid Forecast</div>
              <div className="font-bold text-emerald-300 text-xs">{formatPrecip(hybridData.precipitation)}</div>
            </div>

            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5">
              <div className="text-slate-400 text-[10px] uppercase font-bold">Dynamic Weights:</div>
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-blue-400">NWP Core:</span>
                  <span className="font-bold">{(hybridData.weights[0].weight * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-400">AI WeatherNet:</span>
                  <span className="font-bold">{(hybridData.weights[1].weight * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-400">Ensemble:</span>
                  <span className="font-bold">{(hybridData.weights[2].weight * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 space-y-0.5">
              <div className="text-slate-400 text-[10px]">Model Agreement</div>
              <div className="font-bold text-emerald-400 text-xs">{hybridData.modelAgreementPercentage}% Agreement</div>
            </div>

            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 space-y-0.5">
              <div className="text-slate-400 text-[10px]">System Confidence</div>
              <div className="font-bold text-emerald-400 text-xs">{hybridData.confidenceScore}% ({hybridData.confidenceLevel})</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
