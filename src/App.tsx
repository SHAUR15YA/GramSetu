import React, { useState, useEffect } from "react";
import {
  Sparkles,
  PhoneCall,
  Shield,
  Bot,
  Wifi,
  WifiOff,
  Sprout,
  HeartPulse,
  GraduationCap,
  Landmark,
  CloudSun,
  Layers
} from "lucide-react";
import {
  LanguageCode,
  ActiveDomain,
  WeatherData,
  EnvironmentalSensors,
} from "./types";
import {
  INITIAL_WEATHER,
  INITIAL_SENSORS,
  COMMODITY_PRICES,
} from "./data/mockData";
import { Header } from "./components/Header";
import { Navigation } from "./components/Navigation";
import { OverviewTab } from "./components/OverviewTab";
import { AgricultureTab } from "./components/AgricultureTab";
import { HealthcareTab } from "./components/HealthcareTab";
import { EducationTab } from "./components/EducationTab";
import { GovernmentTab } from "./components/GovernmentTab";
import { EnvironmentTab } from "./components/EnvironmentTab";
import { AIAssistantModal } from "./components/AIAssistantModal";

export default function App() {
  const [currentLang, setCurrentLang] = useState<LanguageCode>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("gramsetu_lang") || localStorage.getItem("ruralpulse_lang");
      if (saved) return saved as LanguageCode;
    }
    return "en";
  });

  const [activeTab, setActiveTab] = useState<ActiveDomain>("overview");
  const [weather, setWeather] = useState<WeatherData>(INITIAL_WEATHER);
  const [sensors, setSensors] = useState<EnvironmentalSensors>(INITIAL_SENSORS);

  // AI Modal State
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiModalPrompt, setAiModalPrompt] = useState<string | undefined>(undefined);
  const [aiModalDomain, setAiModalDomain] = useState<ActiveDomain>("overview");

  // Connectivity
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleLanguageChange = (lang: LanguageCode) => {
    setCurrentLang(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("gramsetu_lang", lang);
    }
  };

  const handleOpenAIAssistant = (prompt?: string, domain?: ActiveDomain) => {
    setAiModalPrompt(prompt);
    setAiModalDomain(domain || activeTab);
    setIsAIModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faf7] text-stone-800">
      {/* Offline warning notification if connection lost */}
      {!isOnline && (
        <div className="bg-amber-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4" />
          <span>You are currently in Offline Mode. Cached local data and first-aid protocols remain accessible.</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        onOpenAssistant={() => handleOpenAIAssistant(undefined, activeTab)}
      />

      {/* Domain Navigation Bar */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentLang={currentLang}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "overview" && (
          <OverviewTab
            currentLang={currentLang}
            weather={weather}
            sensors={sensors}
            prices={COMMODITY_PRICES}
            onSelectDomain={setActiveTab}
            onOpenAssistantWithPrompt={(prompt, domain) => handleOpenAIAssistant(prompt, domain)}
          />
        )}

        {activeTab === "agriculture" && (
          <AgricultureTab currentLang={currentLang} />
        )}

        {activeTab === "healthcare" && (
          <HealthcareTab currentLang={currentLang} />
        )}

        {activeTab === "education" && (
          <EducationTab currentLang={currentLang} />
        )}

        {activeTab === "government" && (
          <GovernmentTab currentLang={currentLang} />
        )}

        {activeTab === "environment" && (
          <EnvironmentTab
            currentLang={currentLang}
            weather={weather}
            sensors={sensors}
          />
        )}
      </main>

      {/* Floating Action Button (GramMitra AI Assistant) */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          id="fab-grammitra-btn"
          type="button"
          onClick={() => handleOpenAIAssistant(undefined, activeTab)}
          className="group flex items-center gap-2.5 bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white font-bold px-4 sm:px-5 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all border border-emerald-500/40"
        >
          <div className="w-6 h-6 rounded-full bg-emerald-800 flex items-center justify-center group-hover:rotate-12 transition-transform">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          </div>
          <span className="text-xs sm:text-sm font-['Outfit'] tracking-wide">
            Ask GramMitra AI
          </span>
          <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        </button>
      </div>

      {/* AI Assistant Modal */}
      <AIAssistantModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        currentLang={currentLang}
        initialPrompt={aiModalPrompt}
        initialDomain={aiModalDomain}
      />

      {/* Accessible Rural Footer with Quick Helplines */}
      <footer className="bg-white border-t border-stone-200/90 py-6 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-bold text-xs">
              G
            </div>
            <span className="font-bold text-stone-700 font-['Outfit']">GramSetu AI</span>
            <span>• Rural Smart Community Platform (Gram Swaraj & Digital Resilience)</span>
          </div>

          {/* Quick Helplines */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:108"
              className="inline-flex items-center gap-1 text-rose-700 hover:underline font-semibold bg-rose-50 px-2 py-1 rounded"
            >
              <PhoneCall className="w-3 h-3" /> Ambulance: 108
            </a>
            <a
              href="tel:18001801551"
              className="inline-flex items-center gap-1 text-emerald-800 hover:underline font-semibold bg-emerald-50 px-2 py-1 rounded"
            >
              <PhoneCall className="w-3 h-3" /> Kisan Call: 1800-180-1551
            </a>
            <a
              href="tel:1930"
              className="inline-flex items-center gap-1 text-blue-800 hover:underline font-semibold bg-blue-50 px-2 py-1 rounded"
            >
              <PhoneCall className="w-3 h-3" /> Cyber Fraud: 1930
            </a>
            <a
              href="tel:112"
              className="inline-flex items-center gap-1 text-purple-800 hover:underline font-semibold bg-purple-50 px-2 py-1 rounded"
            >
              <PhoneCall className="w-3 h-3" /> Emergency: 112
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
