import React, { useState } from "react";
import {
  CloudSun,
  Droplets,
  Wind,
  Sun,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Gauge,
  Waves,
  Zap,
  Leaf
} from "lucide-react";
import Markdown from "react-markdown";
import { LanguageCode, WeatherData, EnvironmentalSensors } from "../types";
import { getTranslation } from "../data/translations";
import { AudioReaderButton } from "./AudioReaderButton";

interface EnvironmentTabProps {
  currentLang: LanguageCode;
  weather: WeatherData;
  sensors: EnvironmentalSensors;
}

export const EnvironmentTab: React.FC<EnvironmentTabProps> = ({
  currentLang,
  weather,
  sensors,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [ecoAdvice, setEcoAdvice] = useState<string | null>(null);
  const [ecoError, setEcoError] = useState<string | null>(null);

  // Plot soil moisture data
  const villagePlots = [
    { name: "North Hamlet (Wheat/Mustard)", moisture: 28, status: "Low - Needs Night Irrigation", color: "amber" },
    { name: "Riverside Plots (Vegetables)", moisture: 48, status: "Optimal Moisture", color: "emerald" },
    { name: "West Mango Orchard", moisture: 34, status: "Adequate Moisture", color: "blue" },
    { name: "Hillside Terraces (Millets)", moisture: 22, status: "Critical Dry - Mulch Needed", color: "rose" }
  ];

  const handleRunEcoAnalysis = async () => {
    setIsAnalyzing(true);
    setEcoError(null);
    setEcoAdvice(null);

    try {
      const response = await fetch("/api/ai/eco-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weatherCondition: `${weather.condition}, Temp: ${weather.temp}°C, Humidity: ${weather.humidity}%`,
          groundWaterLevel: `${sensors.groundwaterDepthMeters} meters (${sensors.groundwaterTrend})`,
          aqi: `${sensors.aqi} (${sensors.aqiStatus})`,
          soilMoisture: `${sensors.soilMoisturePct}% average`,
          season: "Summer / Pre-Monsoon Transition",
          language: currentLang,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reach environmental advisory service");
      }

      const data = await response.json();
      setEcoAdvice(data.result);
    } catch (err: any) {
      console.error(err);
      setEcoError("Could not connect to environmental sensor AI. Displaying standard village conservation protocol.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div id="environment-tab-content" className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-950 to-teal-900 text-white rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-800/80 text-teal-200 text-xs font-semibold mb-2">
            <CloudSun className="w-3.5 h-3.5" />
            <span>Paryavaran Watch • Climate & Village Resource Sentinel</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-['Outfit']">
            Village Microclimate, Groundwater & Early Warnings
          </h2>
          <p className="text-xs sm:text-sm text-teal-100 max-w-2xl mt-1">
            Real-time IoT environmental telemetry tracking aquifer depth, multi-plot soil moisture, air quality, solar generation, and climate resilience advisories.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AudioReaderButton
            textToRead="Paryavaran Watch Environmental Sentinel. Monitoring live village groundwater depth at 46.4 meters, soil moisture at 31 percent, air quality index at 62, and community solar generation at 18.5 kilowatts."
            lang={currentLang}
            label="Audio Overview"
          />
        </div>
      </div>

      {/* 4 Sensor Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Groundwater Depth */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Aquifer Depth
            </span>
            <Droplets className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="text-3xl font-bold font-['Outfit'] text-stone-900">
              {sensors.groundwaterDepthMeters} <span className="text-lg font-normal text-stone-500">meters</span>
            </div>
            <p className="text-xs font-medium text-amber-700 flex items-center gap-1 mt-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Trend: Receding (0.3m this month)
            </p>
          </div>
          <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: "42%" }} />
          </div>
          <div className="text-[11px] text-stone-500 flex justify-between">
            <span>Critical: &gt; 55m</span>
            <span>Target: &lt; 30m</span>
          </div>
        </div>

        {/* Air Quality Index */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Air Quality
            </span>
            <Wind className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="text-3xl font-bold font-['Outfit'] text-stone-900">
              {sensors.aqi} <span className="text-lg font-normal text-stone-500">AQI</span>
            </div>
            <p className="text-xs font-medium text-emerald-700 flex items-center gap-1 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Status: {sensors.aqiStatus}
            </p>
          </div>
          <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: "31%" }} />
          </div>
          <div className="text-[11px] text-stone-500 flex justify-between">
            <span>PM2.5: {sensors.pm25} µg/m³</span>
            <span>PM10: 45 µg/m³</span>
          </div>
        </div>

        {/* Community Reservoir / Pond */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Village Pond / Check-Dam
            </span>
            <Waves className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <div className="text-3xl font-bold font-['Outfit'] text-stone-900">
              {sensors.reservoirLevelPct}% <span className="text-lg font-normal text-stone-500">Capacity</span>
            </div>
            <p className="text-xs font-medium text-stone-600 mt-1">
              Estimated 42 days of cattle & domestic supply
            </p>
          </div>
          <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
            <div className="bg-teal-600 h-full rounded-full" style={{ width: `${sensors.reservoirLevelPct}%` }} />
          </div>
          <div className="text-[11px] text-stone-500 flex justify-between">
            <span>Silt Accumulation: 18%</span>
            <span>Status: Healthy</span>
          </div>
        </div>

        {/* Solar Microgrid */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Panchayat Solar Grid
            </span>
            <Zap className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <div className="text-3xl font-bold font-['Outfit'] text-stone-900">
              {sensors.solarGenerationKw} <span className="text-lg font-normal text-stone-500">kW</span>
            </div>
            <p className="text-xs font-medium text-emerald-700 mt-1">
              Powering 14 irrigation pumps & cold storage
            </p>
          </div>
          <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: "88%" }} />
          </div>
          <div className="text-[11px] text-stone-500 flex justify-between">
            <span>Battery: 88% Charged</span>
            <span>CO2 Offset: 140 kg/day</span>
          </div>
        </div>
      </div>

      {/* Two Column Grid: AI Climate Advisor + Soil Moisture Grid & Disaster Checklists */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: AI Climate Advisor (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/90 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-600" />
                <span>AI Climate & Ecological Risk Sentinel</span>
              </h3>
              <p className="text-xs text-stone-500">
                Synthesize current microclimate telemetry into village resilience actions
              </p>
            </div>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed">
            Our AI analysis correlates real-time temperature ({weather.temp}°C), low soil moisture ({sensors.soilMoisturePct}%), and receding groundwater depth ({sensors.groundwaterDepthMeters}m) to formulate water-conserving irrigation plans, livestock thermal shielding, and community check-dam recharge directives.
          </p>

          <button
            id="run-eco-advisor-btn"
            type="button"
            onClick={handleRunEcoAnalysis}
            disabled={isAnalyzing}
            className="w-full bg-teal-800 hover:bg-teal-700 disabled:bg-stone-300 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                <span>Analyzing Microclimate Telemetry with AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate Village Ecological & Water Advisory</span>
              </>
            )}
          </button>

          {ecoError && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
              {ecoError}
            </div>
          )}

          {/* AI Result Output */}
          {ecoAdvice && (
            <div
              id="eco-advisor-result"
              className="mt-4 p-4 sm:p-5 rounded-2xl bg-stone-50 border border-teal-300 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-teal-700" />
                  Environmental Sentinel Action Directives
                </span>
                <AudioReaderButton
                  id="eco-audio-btn"
                  textToRead={ecoAdvice}
                  lang={currentLang}
                />
              </div>

              <div className="prose prose-sm max-w-none text-xs sm:text-sm text-stone-800 leading-relaxed">
                <div className="markdown-body">
                  <Markdown>{ecoAdvice}</Markdown>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Multi-Plot Soil Moisture & Disaster Protocols (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Multi-Plot Soil Moisture Grid */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-600" />
                <span>Village Field Soil Moisture Grid</span>
              </h3>
              <span className="text-[10px] font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                Live Probes
              </span>
            </div>

            <div className="space-y-2.5">
              {villagePlots.map((plot, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between font-semibold text-stone-800">
                    <span>{plot.name}</span>
                    <span className="font-bold text-stone-900 font-['Outfit']">{plot.moisture}%</span>
                  </div>
                  <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        plot.moisture < 25
                          ? "bg-rose-500"
                          : plot.moisture < 35
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${plot.moisture}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-stone-500 flex items-center justify-between">
                    <span>{plot.status}</span>
                    <span className="text-stone-400">Sensor ID #S-{idx + 101}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Early Disaster Emergency Checklists */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Disaster Preparedness Action Cards</span>
              </h3>
              <AudioReaderButton
                textToRead="Disaster Preparedness Action Cards. For heatwaves: shield livestock with damp gunny bags and thatch roofs. For heavy rain: clear field bund drainage sluices. For frost: light evening smoke mulches around orchards."
                lang={currentLang}
                variant="minimal"
              />
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 space-y-1">
                <span className="font-bold text-amber-900">☀️ Extreme Heat & Water Depletion:</span>
                <p className="text-[11px] text-amber-950 leading-relaxed">
                  • Irrigate only between 7 PM and 6 AM.<br />
                  • Apply 3-inch straw mulch to retain root hydration.<br />
                  • Add electrolytes / molasses in cattle drinking troughs.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-200 space-y-1">
                <span className="font-bold text-blue-900">🌧️ Heavy Cloudburst / Silt Flood Defense:</span>
                <p className="text-[11px] text-blue-950 leading-relaxed">
                  • Open tail-end drainage furrows to prevent stagnant root rot.<br />
                  • Store harvested grain bags at least 2 feet above ground on wooden pallets.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
