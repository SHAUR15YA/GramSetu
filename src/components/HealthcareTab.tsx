import React, { useState } from "react";
import {
  HeartPulse,
  AlertTriangle,
  Sparkles,
  PhoneCall,
  UserCheck,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Thermometer,
  Activity,
  Baby,
  Clock
} from "lucide-react";
import Markdown from "react-markdown";
import { LanguageCode, HealthWorker } from "../types";
import { HEALTH_WORKERS } from "../data/mockData";
import { getTranslation } from "../data/translations";
import { AudioReaderButton } from "./AudioReaderButton";

interface HealthcareTabProps {
  currentLang: LanguageCode;
}

export const HealthcareTab: React.FC<HealthcareTabProps> = ({ currentLang }) => {
  // Symptom Triage State
  const [patientAge, setPatientAge] = useState("Adult (18-59 yrs)");
  const [symptoms, setSymptoms] = useState("");
  const [duration, setDuration] = useState("Past 24 Hours");
  const [vitals, setVitals] = useState("Mild Fever, Conscious");
  const [isTriaging, setIsTriaging] = useState(false);
  const [triageResult, setTriageResult] = useState<string | null>(null);
  const [triageError, setTriageError] = useState<string | null>(null);

  // Quick symptom presets common in rural areas
  const presetCases = [
    {
      title: "Snakebite / Insect Sting",
      symptoms: "Bite marks on foot, swelling, severe localized pain and numbness.",
      vitals: "Fast heartbeat, anxious, no bleeding from gums yet."
    },
    {
      title: "Severe Dehydration & Diarrhea",
      symptoms: "Watery stools 6 times since morning, dry mouth, sunken eyes, weakness.",
      vitals: "Thirsty, low urine output, mild cramps."
    },
    {
      title: "Heat Exhaustion & Sunstroke",
      symptoms: "Dizziness, heavy sweating followed by hot dry skin, headache after farm labor.",
      vitals: "Body temperature 101°F, nausea."
    },
    {
      title: "Child High Fever with Shivering",
      symptoms: "Toddler crying, shivering, refusal to feed, body burning hot.",
      vitals: "High fever 102.5°F, rapid breathing."
    }
  ];

  const handleSelectPreset = (preset: typeof presetCases[0]) => {
    setSymptoms(preset.symptoms);
    setVitals(preset.vitals);
  };

  const handleTriageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      setTriageError("Please enter the patient's symptoms or select a preset.");
      return;
    }

    setIsTriaging(true);
    setTriageError(null);
    setTriageResult(null);

    try {
      const response = await fetch("/api/ai/health-triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientAge,
          symptoms,
          duration,
          vitals,
          language: currentLang,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reach community health triage service");
      }

      const data = await response.json();
      setTriageResult(data.result);
    } catch (err: any) {
      console.error(err);
      setTriageError("Could not connect to health network. Displaying standard emergency protocols.");
    } finally {
      setIsTriaging(false);
    }
  };

  return (
    <div id="healthcare-tab-content" className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-rose-900 to-rose-800 text-white rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-700/80 text-rose-100 text-xs font-semibold mb-2">
            <HeartPulse className="w-3.5 h-3.5" />
            <span>Swasthya Kendra • Rural Health & Tele-Triage</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-['Outfit']">
            Symptom Urgency Triage & Village First-Aid
          </h2>
          <p className="text-xs sm:text-sm text-rose-100 max-w-2xl mt-1">
            Evaluate urgency levels, receive safe non-pharmacological village first aid, and find immediate contacts for local ASHA workers and PHC doctors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AudioReaderButton
            textToRead="Swasthya Kendra Health Portal. Assess medical urgency levels, follow safe village first-aid for snakebites and dehydration, and directly dial your ASHA worker or ambulance."
            lang={currentLang}
            label="Audio Overview"
          />
        </div>
      </div>

      {/* Emergency Alert Hotline Callout */}
      <div className="bg-red-50 border border-red-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-red-200 text-red-900 shrink-0">
            <ShieldAlert className="w-5 h-5 text-red-700" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-red-950">Critical Medical Emergency?</h4>
            <p className="text-xs text-red-800 mt-0.5">
              For unconsciousness, uncontrollable bleeding, chest pain, or severe snakebites, call the Free Rural Ambulance immediately.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="tel:108"
            className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Call 108 Ambulance</span>
          </a>
        </div>
      </div>

      {/* Main Grid: AI Symptom Checker + Directory / First Aid Protocols */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Triage Assistant (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/90 shadow-xs space-y-5">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-rose-600" />
              <span>AI Community Health Triage Form</span>
            </h3>
            <p className="text-xs text-stone-500">
              Answers evaluated according to WHO Community Health Worker standards
            </p>
          </div>

          {/* Quick Presets */}
          <div>
            <span className="text-xs font-semibold text-stone-600 block mb-2">
              Quick Select Rural Health Scenario:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {presetCases.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  className={`p-2.5 rounded-xl text-left border transition-all text-xs ${
                    symptoms === p.symptoms
                      ? "border-rose-600 bg-rose-50 text-rose-900 font-semibold ring-1 ring-rose-500"
                      : "border-stone-200 hover:border-stone-300 bg-stone-50/70 text-stone-700"
                  }`}
                >
                  <div className="font-semibold text-stone-800 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    {p.title}
                  </div>
                  <div className="text-[11px] text-stone-500 mt-1 line-clamp-1">{p.symptoms}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleTriageSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Patient Age Group
                </label>
                <select
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="Infant / Child (< 5 yrs)">Infant / Child (Under 5 Years)</option>
                  <option value="School Child (5-17 yrs)">School Child (5 - 17 Years)</option>
                  <option value="Adult (18-59 yrs)">Adult (18 - 59 Years)</option>
                  <option value="Pregnant or Nursing Mother">Pregnant or Nursing Mother</option>
                  <option value="Elderly (60+ yrs)">Elderly (60+ Years)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Symptom Duration
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="Just started (< 2 hours)">Sudden Onset (Under 2 hours)</option>
                  <option value="Past 24 Hours">Past 24 Hours</option>
                  <option value="2 to 4 Days">2 to 4 Days</option>
                  <option value="More than a week">More than a week (Chronic)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Describe All Symptoms & Complaints
              </label>
              <textarea
                rows={3}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="e.g., Fever for 2 days, chills at night, vomiting, unable to eat, body ache..."
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-300 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Observed Signs (Breathing, Alertness, Temperature)
              </label>
              <input
                type="text"
                value={vitals}
                onChange={(e) => setVitals(e.target.value)}
                placeholder="e.g., Conscious, breathing fast, warm to touch"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {triageError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{triageError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isTriaging}
              className="w-full bg-rose-700 hover:bg-rose-600 disabled:bg-stone-300 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              {isTriaging ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Evaluating Urgency with Health AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Run Health Urgency Triage</span>
                </>
              )}
            </button>
          </form>

          {/* Triage Result Output */}
          {triageResult && (
            <div
              id="health-triage-result"
              className="mt-4 p-4 sm:p-5 rounded-2xl bg-stone-50 border border-rose-300 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                  <HeartPulse className="w-4 h-4 text-rose-600" />
                  Urgency Assessment & Action Plan
                </span>
                <AudioReaderButton
                  id="health-result-audio-btn"
                  textToRead={triageResult}
                  lang={currentLang}
                />
              </div>

              <div className="prose prose-sm max-w-none text-xs sm:text-sm text-stone-800 leading-relaxed">
                <div className="markdown-body">
                  <Markdown>{triageResult}</Markdown>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Local Health Directory & First Aid Guide (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Local Health Personnel Directory */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>Village Health Workers & PHC</span>
              </h3>
              <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                Verified
              </span>
            </div>

            <div className="space-y-2.5">
              {HEALTH_WORKERS.map((worker) => (
                <div
                  key={worker.id}
                  className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex flex-col justify-between gap-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-stone-800">{worker.name}</div>
                      <div className="text-[11px] text-emerald-700 font-medium">{worker.role}</div>
                      <div className="text-[10px] text-stone-500 mt-0.5">{worker.location}</div>
                    </div>
                    <a
                      href={`tel:${worker.contact.replace(/\s+/g, "")}`}
                      className="p-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition-colors shrink-0"
                      title="Direct Call"
                    >
                      <PhoneCall className="w-4 h-4" />
                    </a>
                  </div>
                  <div className="text-[10px] text-stone-500 border-t border-stone-200/60 pt-1.5 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-stone-400" />
                    <span>{worker.availability}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick First Aid Protocols */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Essential Rural First Aid Rules</span>
              </h3>
              <AudioReaderButton
                textToRead="Essential Rural First Aid Rules: For snakebites, keep the bitten limb immobilized below heart level. Never cut the wound, never suck venom, and never apply tight tourniquets. Rush to the PHC for Anti-Snake Venom. For diarrhea, mix 1 packet ORS in 1 liter clean boiled and cooled water. Continue breastfeeding infants."
                lang={currentLang}
                variant="minimal"
              />
            </div>

            <div className="space-y-2 text-xs text-stone-700">
              <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
                <div className="font-bold text-amber-900">🐍 Snakebite Protocol:</div>
                <p className="text-[11px] text-amber-950 leading-relaxed">
                  • <strong>DO:</strong> Immobilize the limb with a splint; keep victim still and calm.<br />
                  • <strong>DON'T:</strong> Do NOT cut, burn, or suck the wound. Do NOT tie a tight wire/tourniquet that cuts arterial blood flow. Rush to the PHC for Anti-Snake Venom (ASV).
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200 space-y-1">
                <div className="font-bold text-blue-900">💧 ORS Preparation:</div>
                <p className="text-[11px] text-blue-950 leading-relaxed">
                  Mix 1 packet Oral Rehydration Salt (ORS) in exactly 1 Liter of clean boiled & cooled water. Drink in small sips. If ORS packet is unavailable, mix 6 level teaspoons sugar + 1/2 teaspoon salt in 1 liter water.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
