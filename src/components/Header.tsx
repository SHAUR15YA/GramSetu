import React, { useState } from "react";
import {
  Sparkles,
  PhoneCall,
  Globe,
  Radio,
  X,
  AlertTriangle,
  Sun,
  ShieldAlert,
  HelpCircle
} from "lucide-react";
import { LanguageCode } from "../types";
import { AVAILABLE_LANGUAGES, getTranslation } from "../data/translations";

interface HeaderProps {
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onOpenAssistant: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  onOpenAssistant,
}) => {
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  return (
    <header id="platform-header" className="sticky top-0 z-40 bg-stone-900 text-stone-100 border-b border-stone-800 shadow-md">
      {/* Top emergency hotline bar */}
      <div className="bg-emerald-950 text-emerald-200 text-xs py-1.5 px-4 sm:px-8 flex flex-wrap items-center justify-between gap-2 border-b border-emerald-900/60">
        <div className="flex items-center gap-2 font-medium">
          <span className="inline-flex items-center gap-1 text-emerald-400">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span className="font-semibold tracking-wide">VILLAGE CONNECT:</span>
          </span>
          <span>{getTranslation(currentLang, "villageName")}</span>
          <span className="hidden sm:inline text-emerald-500/70">•</span>
          <span className="hidden sm:inline text-emerald-300">Cluster Solar Grid: Active (18.5 kW)</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="emergency-hotline-btn"
            type="button"
            onClick={() => setShowEmergencyModal(true)}
            className="inline-flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-semibold transition-colors text-xs bg-amber-950/60 px-2.5 py-0.5 rounded border border-amber-800/60"
          >
            <PhoneCall className="w-3 h-3 text-amber-400" />
            <span>{getTranslation(currentLang, "emergencyHelpline")} (108 / 112 / 1551)</span>
          </button>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold shadow-sm ring-2 ring-emerald-500/30">
            <span className="text-xl font-['Outfit'] tracking-tight">GS</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold font-['Outfit'] tracking-tight text-white">
                {getTranslation(currentLang, "appTitle")}
              </h1>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Rural 5-in-1 AI
              </span>
            </div>
            <p className="text-xs text-stone-400 hidden sm:block">
              {getTranslation(currentLang, "appSubtitle")}
            </p>
          </div>
        </div>

        {/* Right action controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector */}
          <div className="relative flex items-center bg-stone-800 rounded-lg p-1 border border-stone-700">
            <Globe className="w-4 h-4 text-emerald-400 ml-1.5 mr-1" />
            <select
              id="language-select-dropdown"
              value={currentLang}
              onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
              className="bg-transparent text-stone-100 text-xs sm:text-sm font-medium py-1 px-1 pr-6 focus:outline-none cursor-pointer"
              aria-label="Select Application Language"
            >
              {AVAILABLE_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-stone-900 text-stone-100">
                  {lang.nativeLabel} ({lang.label})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Help Guide */}
          <button
            id="quick-help-btn"
            type="button"
            onClick={() => setShowHelpModal(true)}
            className="p-2 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition-colors"
            title="Rural Guide & How-To"
            aria-label="Platform Guide"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* AI Rural Assistant Trigger */}
          <button
            id="open-ai-assistant-btn"
            type="button"
            onClick={onOpenAssistant}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-lg transition-all shadow-sm ring-1 ring-emerald-400/40"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="whitespace-nowrap">{getTranslation(currentLang, "askAiAssistant")}</span>
          </button>
        </div>
      </div>

      {/* Emergency Hotline Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div
            id="emergency-modal-content"
            className="bg-stone-900 text-stone-100 rounded-2xl max-w-lg w-full p-6 border border-stone-700 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2.5 text-amber-400 font-bold text-lg">
                <AlertTriangle className="w-6 h-6" />
                <span>Rural Emergency Hotlines (24/7)</span>
              </div>
              <button
                type="button"
                onClick={() => setShowEmergencyModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-300">
              Direct emergency calling numbers connecting to immediate rural assistance, local ambulances, agricultural helplines, and disaster squads.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-900/60 space-y-1">
                <div className="font-semibold text-red-300">Medical Ambulance</div>
                <div className="text-2xl font-black text-white tracking-wider">108 / 102</div>
                <div className="text-[11px] text-red-200">Free rural emergency patient transit</div>
              </div>

              <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-900/60 space-y-1">
                <div className="font-semibold text-blue-300">Police & Security</div>
                <div className="text-2xl font-black text-white tracking-wider">112</div>
                <div className="text-[11px] text-blue-200">Unified national emergency response</div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-900/60 space-y-1">
                <div className="font-semibold text-emerald-300">Kisan Call Centre</div>
                <div className="text-2xl font-black text-white tracking-wider">1800-180-1551</div>
                <div className="text-[11px] text-emerald-200">Free agriculture and crop scientist hotline</div>
              </div>

              <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-900/60 space-y-1">
                <div className="font-semibold text-purple-300">Women & Domestic Safety</div>
                <div className="text-2xl font-black text-white tracking-wider">181 / 1091</div>
                <div className="text-[11px] text-purple-200">Confidential counselling and legal aid</div>
              </div>

              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-900/60 space-y-1">
                <div className="font-semibold text-amber-300">Disaster Management</div>
                <div className="text-2xl font-black text-white tracking-wider">1070 / 1077</div>
                <div className="text-[11px] text-amber-200">Floods, lightning, storm & fire relief</div>
              </div>

              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-900/60 space-y-1">
                <div className="font-semibold text-cyan-300">Cyber / UPI Fraud Help</div>
                <div className="text-2xl font-black text-white tracking-wider">1930</div>
                <div className="text-[11px] text-cyan-200">Report unauthorized bank/OTP withdrawals</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-stone-800/80 text-xs text-stone-300 flex items-center justify-between">
              <span>Local Greenfield Sub-Centre ASHA Lead:</span>
              <span className="font-bold text-emerald-400">+91 98765 43210</span>
            </div>
          </div>
        </div>
      )}

      {/* Guide Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div
            id="guide-modal-content"
            className="bg-stone-900 text-stone-100 rounded-2xl max-w-lg w-full p-6 border border-stone-700 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg">
                <Sun className="w-5 h-5" />
                <span>About GramSetu AI Platform</span>
              </div>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-300 leading-relaxed">
              <p>
                <strong>GramSetu AI</strong> is an integrated, offline-resilient community smart portal engineered for rural panchayats, farmers, village clinics, schools, and citizens.
              </p>
              <div className="grid grid-cols-1 gap-2 pt-1">
                <div className="p-2.5 rounded-lg bg-stone-800/70 border border-stone-700">
                  <span className="font-semibold text-emerald-300">🌾 Agriculture:</span> AI Crop disease diagnosis, organic remedies, soil fertilizer calculations, and live mandi prices.
                </div>
                <div className="p-2.5 rounded-lg bg-stone-800/70 border border-stone-700">
                  <span className="font-semibold text-rose-300">🏥 Healthcare:</span> Symptom urgency triage (Green/Yellow/Red), first aid checklists, and local PHC directory.
                </div>
                <div className="p-2.5 rounded-lg bg-stone-800/70 border border-stone-700">
                  <span className="font-semibold text-blue-300">📚 Education:</span> Village tutor explaining concepts using farming analogies, and 5 practical vocational courses.
                </div>
                <div className="p-2.5 rounded-lg bg-stone-800/70 border border-stone-700">
                  <span className="font-semibold text-amber-300">🏛️ Govt Services:</span> Welfare scheme eligibility scanner (PM-KISAN, Housing, Health Card) and grievance lodger.
                </div>
                <div className="p-2.5 rounded-lg bg-stone-800/70 border border-stone-700">
                  <span className="font-semibold text-teal-300">🌍 Environment:</span> Groundwater depth gauge, soil moisture sensor grid, solar status, and weather alerts.
                </div>
              </div>
              <p className="text-stone-400 text-[11px] pt-1">
                Tip: Click the <span className="text-emerald-400 font-semibold">"Listen"</span> button on any AI advice to hear it spoken aloud in your chosen language.
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
