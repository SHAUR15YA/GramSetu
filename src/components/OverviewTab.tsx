import React from "react";
import {
  AlertTriangle,
  Droplets,
  Wind,
  Sun,
  Sprout,
  HeartPulse,
  GraduationCap,
  Landmark,
  TrendingUp,
  TrendingDown,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import {
  ActiveDomain,
  LanguageCode,
  WeatherData,
  EnvironmentalSensors,
  CommodityPrice
} from "../types";
import { getTranslation } from "../data/translations";
import { COMMUNITY_NOTICES } from "../data/mockData";
import { AudioReaderButton } from "./AudioReaderButton";

interface OverviewTabProps {
  currentLang: LanguageCode;
  weather: WeatherData;
  sensors: EnvironmentalSensors;
  prices: CommodityPrice[];
  onSelectDomain: (domain: ActiveDomain) => void;
  onOpenAssistantWithPrompt: (prompt: string, domain: ActiveDomain) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  currentLang,
  weather,
  sensors,
  prices,
  onSelectDomain,
  onOpenAssistantWithPrompt,
}) => {
  return (
    <div id="overview-tab-content" className="space-y-6">
      {/* Village Early Warning Banner */}
      {weather.alert && (
        <div
          id="village-alert-banner"
          className="bg-amber-50 border border-amber-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
        >
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-200/80 text-amber-900 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded">
                  Village Advisory
                </span>
                <h3 className="text-sm sm:text-base font-bold text-amber-950">
                  {weather.alert.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-amber-900 mt-1">
                {weather.alert.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <AudioReaderButton
              id="alert-audio-read-btn"
              textToRead={`${weather.alert.title}. ${weather.alert.description}`}
              lang={currentLang}
              label="Listen Alert"
            />
          </div>
        </div>
      )}

      {/* 4 Key Village Real-Time Vital Gauges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Weather */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Village Weather</span>
            <Sun className="w-4 h-4 text-amber-500" />
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-bold font-['Outfit'] text-stone-800">
              {weather.temp}°C
            </div>
            <p className="text-xs text-stone-600 font-medium">{weather.condition}</p>
          </div>
          <div className="text-[11px] text-stone-400 flex items-center justify-between border-t border-stone-100 pt-2">
            <span>Humidity: {weather.humidity}%</span>
            <span>Rain: {weather.rainfallProbability}%</span>
          </div>
        </div>

        {/* Groundwater Depth */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Groundwater Level</span>
            <Droplets className="w-4 h-4 text-blue-500" />
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-bold font-['Outfit'] text-stone-800">
              {sensors.groundwaterDepthMeters}m
            </div>
            <p className="text-xs text-amber-700 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Trend: {sensors.groundwaterTrend}
            </p>
          </div>
          <div className="text-[11px] text-stone-400 flex items-center justify-between border-t border-stone-100 pt-2">
            <span>Soil Moisture: {sensors.soilMoisturePct}%</span>
            <span>Reservoir: {sensors.reservoirLevelPct}%</span>
          </div>
        </div>

        {/* Air Quality */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Air Quality (AQI)</span>
            <Wind className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-bold font-['Outfit'] text-stone-800">
              {sensors.aqi}
            </div>
            <p className="text-xs text-emerald-700 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {sensors.aqiStatus}
            </p>
          </div>
          <div className="text-[11px] text-stone-400 border-t border-stone-100 pt-2">
            <span>PM2.5: {sensors.pm25} µg/m³ (Safe)</span>
          </div>
        </div>

        {/* Solar Microgrid */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">Solar Microgrid</span>
            <Sun className="w-4 h-4 text-amber-600" />
          </div>
          <div className="my-2">
            <div className="text-2xl sm:text-3xl font-bold font-['Outfit'] text-stone-800">
              {sensors.solarGenerationKw} <span className="text-base font-normal">kW</span>
            </div>
            <p className="text-xs text-emerald-600 font-medium">Borewell pumps running</p>
          </div>
          <div className="text-[11px] text-stone-400 border-t border-stone-100 pt-2">
            <span>Community battery: 88% full</span>
          </div>
        </div>
      </div>

      {/* 5 Core Domain Fast-Access Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold font-['Outfit'] text-stone-900">
            {getTranslation(currentLang, "quickActions")}
          </h2>
          <span className="text-xs text-stone-500 font-medium">
            AI-Assisted Rural Solutions
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* 1. Agriculture */}
          <div
            id="card-quick-agri"
            className="group bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between cursor-pointer"
            onClick={() => onSelectDomain("agriculture")}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Sprout className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Krishi Sahayak
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-stone-800 group-hover:text-emerald-800 transition-colors">
                {getTranslation(currentLang, "cropDoctor")}
              </h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                {getTranslation(currentLang, "cropDoctorDesc")}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
              <span>Open Crop Doctor & Mandi</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 2. Healthcare */}
          <div
            id="card-quick-health"
            className="group bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-md hover:border-rose-300 transition-all flex flex-col justify-between cursor-pointer"
            onClick={() => onSelectDomain("healthcare")}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                  Swasthya Kendra
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-stone-800 group-hover:text-rose-800 transition-colors">
                {getTranslation(currentLang, "healthTriage")}
              </h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                {getTranslation(currentLang, "healthTriageDesc")}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-rose-700">
              <span>Symptom Triage & First Aid</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 3. Education */}
          <div
            id="card-quick-edu"
            className="group bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between cursor-pointer"
            onClick={() => onSelectDomain("education")}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  Shiksha Setu
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-stone-800 group-hover:text-blue-800 transition-colors">
                {getTranslation(currentLang, "eduTutor")}
              </h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                {getTranslation(currentLang, "eduTutorDesc")}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-blue-700">
              <span>Start Village Lessons</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 4. Government Services */}
          <div
            id="card-quick-gov"
            className="group bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-md hover:border-purple-300 transition-all flex flex-col justify-between cursor-pointer"
            onClick={() => onSelectDomain("government")}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                  <Landmark className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                  Jan Seva Portal
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-stone-800 group-hover:text-purple-800 transition-colors">
                {getTranslation(currentLang, "govServices")}
              </h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                {getTranslation(currentLang, "govServicesDesc")}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-purple-700">
              <span>Scan Welfare Schemes</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 5. Environmental Watch */}
          <div
            id="card-quick-env"
            className="group bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-md hover:border-teal-300 transition-all flex flex-col justify-between cursor-pointer"
            onClick={() => onSelectDomain("environment")}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                  <Wind className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                  Paryavaran Watch
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-stone-800 group-hover:text-teal-800 transition-colors">
                {getTranslation(currentLang, "ecoWatch")}
              </h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                {getTranslation(currentLang, "ecoWatchDesc")}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-teal-700">
              <span>View Sensor Station</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 6. AI Voice & Multilingual Assistant Prompt Card */}
          <div
            id="card-quick-copilot"
            className="bg-emerald-900 text-white p-4 sm:p-5 rounded-2xl shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>GramMitra AI Copilot</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Multilingual Voice & Chat
              </h3>
              <p className="text-xs text-emerald-100 mt-1 leading-relaxed">
                Speak or type in any village language. GramMitra assists with farming queries, health emergencies, and government documents.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-800/80 flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  onOpenAssistantWithPrompt(
                    "What are the best drought-resistant crops for this season?",
                    "agriculture"
                  )
                }
                className="w-full text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white py-2 px-3 rounded-xl transition-colors text-center"
              >
                Ask Copilot Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Section: Live Commodity Prices + Panchayat Notice Board */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Live Mandi Market Prices */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
                <Sprout className="w-4 h-4 text-emerald-600" />
                <span>{getTranslation(currentLang, "mandiPrices")}</span>
              </h3>
              <p className="text-xs text-stone-500">Live commodity updates for local village mandis</p>
            </div>
            <button
              type="button"
              onClick={() => onSelectDomain("agriculture")}
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              Full Mandi Board →
            </button>
          </div>

          <div className="divide-y divide-stone-100">
            {prices.slice(0, 4).map((p) => (
              <div key={p.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-stone-800">{p.crop}</div>
                  <div className="text-[11px] text-stone-400">{p.market} • {p.updatedAt}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs sm:text-sm font-bold font-['Outfit'] text-stone-900">
                    {p.currency} {p.pricePerQuintal} / quintal
                  </div>
                  <div
                    className={`text-[11px] font-semibold flex items-center justify-end gap-0.5 ${
                      p.trend === "up"
                        ? "text-emerald-600"
                        : p.trend === "down"
                        ? "text-rose-600"
                        : "text-stone-500"
                    }`}
                  >
                    {p.trend === "up" ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : p.trend === "down" ? (
                      <TrendingDown className="w-3 h-3" />
                    ) : null}
                    <span>{p.changePct > 0 ? `+${p.changePct}%` : `${p.changePct}%`}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panchayat Announcements & Notice Board */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span>{getTranslation(currentLang, "communityNotice")}</span>
              </h3>
              <p className="text-xs text-stone-500">Official updates from Greenfield Gram Panchayat</p>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Updated Today
            </span>
          </div>

          <div className="space-y-3">
            {COMMUNITY_NOTICES.map((notice) => (
              <div
                key={notice.id}
                className={`p-3 rounded-xl border ${
                  notice.urgent
                    ? "bg-rose-50/60 border-rose-200"
                    : "bg-stone-50/70 border-stone-200"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        notice.urgent
                          ? "bg-rose-600 text-white"
                          : "bg-stone-200 text-stone-700"
                      }`}
                    >
                      {notice.tag}
                    </span>
                    <span className="text-[11px] text-stone-500">{notice.date}</span>
                  </div>
                  <AudioReaderButton
                    textToRead={`${notice.title}. ${notice.body}`}
                    lang={currentLang}
                    variant="icon"
                  />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-stone-800">{notice.title}</h4>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">{notice.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
