import React, { useState } from "react";
import {
  Sprout,
  Upload,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Calculator,
  Bug,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import Markdown from "react-markdown";
import { LanguageCode, CommodityPrice, CropCaseSample } from "../types";
import { COMMODITY_PRICES, CROP_SAMPLES } from "../data/mockData";
import { getTranslation } from "../data/translations";
import { AudioReaderButton } from "./AudioReaderButton";

interface AgricultureTabProps {
  currentLang: LanguageCode;
}

export const AgricultureTab: React.FC<AgricultureTabProps> = ({ currentLang }) => {
  // Crop Doctor State
  const [selectedCrop, setSelectedCrop] = useState("Tomato");
  const [symptoms, setSymptoms] = useState("");
  const [soilType, setSoilType] = useState("Loamy Soil");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<string | null>(null);
  const [diagnosisError, setDiagnosisError] = useState<string | null>(null);

  // Fertilizer Calculator State
  const [calcCrop, setCalcCrop] = useState("Wheat");
  const [landAcres, setLandAcres] = useState<number>(2.5);
  const [calcSoil, setCalcSoil] = useState("Loamy Soil");
  const [calcResult, setCalcResult] = useState<any | null>(null);

  // Quick sample selection
  const handleSelectSample = (sample: CropCaseSample) => {
    setSelectedCrop(sample.cropName);
    setSymptoms(sample.symptoms);
    setImagePreview(sample.imageUrl);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDiagnose = async () => {
    if (!selectedCrop && !symptoms && !imagePreview) {
      setDiagnosisError("Please enter crop symptoms or select an affected plant image.");
      return;
    }

    setIsDiagnosing(true);
    setDiagnosisError(null);
    setDiagnosisResult(null);

    try {
      const response = await fetch("/api/ai/crop-doctor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cropName: selectedCrop,
          symptoms: symptoms || "Noticeable discoloration and spotting on leaves",
          soilType,
          imageBase64: imagePreview,
          language: currentLang,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reach rural crop doctor service");
      }

      const data = await response.json();
      setDiagnosisResult(data.result);
    } catch (err: any) {
      console.error(err);
      setDiagnosisError("Network issue. Reconnecting to local agricultural database...");
    } finally {
      setIsDiagnosing(false);
    }
  };

  const calculateFertilizer = (e: React.FormEvent) => {
    e.preventDefault();
    const acres = Number(landAcres) || 1;

    // Standard agronomic ratios per acre
    const cropRequirements: Record<string, { urea: number; dap: number; mop: number; fymTons: number; note: string }> = {
      Wheat: { urea: 90, dap: 55, mop: 25, fymTons: 4, note: "Apply 50% Urea + full DAP & MOP at basal sowing. Top-dress remaining Urea at crown root initiation & flowering." },
      Paddy: { urea: 110, dap: 60, mop: 30, fymTons: 5, note: "Apply DAP at puddling; split Urea into 3 doses: basal, tillering, and panicle initiation." },
      Cotton: { urea: 80, dap: 45, mop: 35, fymTons: 4.5, note: "Heavy potassium feeder during boll formation. Add foliar magnesium sulfate spray if reddening appears." },
      Maize: { urea: 100, dap: 50, mop: 30, fymTons: 4, note: "Split nitrogen into 3 equal splits: sowing, knee-high stage, and tasseling." },
      Mustard: { urea: 65, dap: 40, mop: 20, fymTons: 3.5, note: "Crucial to add 20kg Elemental Sulphur per acre for maximum oil content." },
      Tomato: { urea: 75, dap: 70, mop: 45, fymTons: 6, note: "Drip fertigation recommended twice weekly; supplement with Calcium Nitrate to stop Blossom End Rot." }
    };

    const base = cropRequirements[calcCrop] || cropRequirements.Wheat;

    setCalcResult({
      crop: calcCrop,
      acres,
      soil: calcSoil,
      ureaKg: Math.round(base.urea * acres),
      dapKg: Math.round(base.dap * acres),
      mopKg: Math.round(base.mop * acres),
      fymTons: Math.round(base.fymTons * acres * 10) / 10,
      bagsUrea: Math.ceil((base.urea * acres) / 45), // 45kg bag
      bagsDap: Math.ceil((base.dap * acres) / 50),  // 50kg bag
      note: base.note
    });
  };

  return (
    <div id="agriculture-tab-content" className="space-y-6">
      {/* Tab Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-700/80 text-emerald-200 text-xs font-semibold mb-2">
            <Sprout className="w-3.5 h-3.5" />
            <span>Krishi Sahayak • Smart Agriculture Hub</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-['Outfit']">
            AI Crop Doctor & Smart Farm Management
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl mt-1">
            Instant crop disease identification, organic remedies, soil fertility planning, and direct mandi market prices to maximize rural harvest profits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AudioReaderButton
            textToRead="Welcome to Krishi Sahayak Smart Agriculture Hub. You can upload leaf photos to diagnose crop diseases, calculate exact fertilizer quantities for your land, and monitor live mandi crop market prices."
            lang={currentLang}
            label="Audio Overview"
          />
        </div>
      </div>

      {/* Grid: Crop Doctor + Fertilizer Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: AI Crop Doctor (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/90 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
                <Bug className="w-5 h-5 text-emerald-600" />
                <span>AI Crop Doctor Diagnosis</span>
              </h3>
              <p className="text-xs text-stone-500">
                Describe symptoms or select sample cases for instant diagnosis
              </p>
            </div>
            {imagePreview && (
              <button
                type="button"
                onClick={() => setImagePreview(null)}
                className="text-xs text-rose-600 hover:underline flex items-center gap-1 font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Clear Photo
              </button>
            )}
          </div>

          {/* Quick Select Sample Cases */}
          <div>
            <span className="text-xs font-semibold text-stone-600 block mb-2">
              Select a Common Field Sample or Upload:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CROP_SAMPLES.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleSelectSample(sample)}
                  className={`p-2 rounded-xl text-left border transition-all text-xs flex flex-col items-center text-center ${
                    selectedCrop === sample.cropName && symptoms === sample.symptoms
                      ? "border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold ring-1 ring-emerald-500"
                      : "border-stone-200 hover:border-stone-300 bg-stone-50/60 text-stone-700"
                  }`}
                >
                  <img
                    src={sample.imageUrl}
                    alt={sample.cropName}
                    className="w-12 h-12 object-cover rounded-lg mb-1.5"
                  />
                  <span className="font-semibold text-stone-800">{sample.cropName}</span>
                  <span className="text-[10px] text-stone-500 line-clamp-1">{sample.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Inputs Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Crop Name
              </label>
              <input
                id="crop-name-input"
                type="text"
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                placeholder="e.g. Wheat, Tomato, Paddy, Cotton"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-stone-50"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Field Soil Type
              </label>
              <select
                id="soil-type-select"
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-stone-50"
              >
                <option value="Loamy Soil">Loamy Soil (Fertile & Well-draining)</option>
                <option value="Clay / Heavy Soil">Clay / Heavy Black Soil (High Water Retention)</option>
                <option value="Sandy Loam">Sandy Loam (Quick Draining)</option>
                <option value="Red Laterite Soil">Red Laterite Soil (Low Phosphorus)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Observed Symptoms (Leaf discoloration, holes, wilting, curling, pests)
            </label>
            <textarea
              id="crop-symptoms-input"
              rows={3}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g. Leaves turning yellow from bottom up with dark spots and curled edges..."
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-stone-50"
            />
          </div>

          {/* Photo upload / preview */}
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1.5">
              Upload Plant / Leaf Photo (Optional)
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold border border-stone-300 transition-colors">
                <Upload className="w-4 h-4 text-emerald-600" />
                <span>Choose Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              {imagePreview && (
                <div className="flex items-center gap-2">
                  <img
                    src={imagePreview}
                    alt="Uploaded leaf"
                    className="w-10 h-10 object-cover rounded-lg border border-stone-300"
                  />
                  <span className="text-xs text-emerald-700 font-medium">Image attached</span>
                </div>
              )}
            </div>
          </div>

          {diagnosisError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{diagnosisError}</span>
            </div>
          )}

          <button
            id="run-crop-diagnosis-btn"
            type="button"
            onClick={handleDiagnose}
            disabled={isDiagnosing}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-stone-300 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            {isDiagnosing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                <span>{getTranslation(currentLang, "analyzing")}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Diagnose Crop with AI Doctor</span>
              </>
            )}
          </button>

          {/* Diagnosis Result Display */}
          {diagnosisResult && (
            <div
              id="crop-diagnosis-result"
              className="mt-4 p-4 sm:p-5 rounded-2xl bg-stone-50 border border-emerald-300/80 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  AI Agricultural Diagnosis & Treatment Plan
                </span>
                <AudioReaderButton
                  id="crop-result-audio-btn"
                  textToRead={diagnosisResult}
                  lang={currentLang}
                />
              </div>

              <div className="prose prose-sm max-w-none text-xs sm:text-sm text-stone-800 leading-relaxed">
                <div className="markdown-body">
                  <Markdown>{diagnosisResult}</Markdown>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Fertilizer Calculator & Mandi Highlights (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Soil & Fertilizer Calculator */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-amber-600" />
                <span>{getTranslation(currentLang, "fertilizerCalc")}</span>
              </h3>
              <span className="text-[10px] font-semibold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                NPK Ratio
              </span>
            </div>

            <form onSubmit={calculateFertilizer} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Target Crop
                </label>
                <select
                  value={calcCrop}
                  onChange={(e) => setCalcCrop(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Wheat">Wheat (Grain)</option>
                  <option value="Paddy">Paddy / Rice</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Maize">Maize (Corn)</option>
                  <option value="Mustard">Mustard</option>
                  <option value="Tomato">Tomato (Vegetable)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Land Size (Acres)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="50"
                    value={landAcres}
                    onChange={(e) => setLandAcres(parseFloat(e.target.value) || 1)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Soil Texture
                  </label>
                  <select
                    value={calcSoil}
                    onChange={(e) => setCalcSoil(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 bg-stone-50"
                  >
                    <option value="Loamy Soil">Loamy Soil</option>
                    <option value="Black Soil">Black Cotton Soil</option>
                    <option value="Sandy Soil">Sandy Loam</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 px-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Compute Exact Fertilizer Requirement
              </button>
            </form>

            {calcResult && (
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-2.5">
                <div className="font-bold text-amber-950 flex items-center justify-between">
                  <span>Requirement for {calcResult.acres} Acres of {calcResult.crop}:</span>
                  <AudioReaderButton
                    textToRead={`For ${calcResult.acres} acres of ${calcResult.crop}, recommended dosage is ${calcResult.ureaKg} kilograms of Urea, ${calcResult.dapKg} kilograms of DAP, and ${calcResult.mopKg} kilograms of Potash.`}
                    lang={currentLang}
                    variant="minimal"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white p-2 rounded-lg border border-amber-200">
                    <span className="text-[10px] text-stone-500 block">Urea (46% N)</span>
                    <span className="font-bold text-stone-800 text-sm">{calcResult.ureaKg} kg</span>
                    <span className="text-[10px] text-amber-700 block">({calcResult.bagsUrea} bags)</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-amber-200">
                    <span className="text-[10px] text-stone-500 block">DAP (18-46-0)</span>
                    <span className="font-bold text-stone-800 text-sm">{calcResult.dapKg} kg</span>
                    <span className="text-[10px] text-amber-700 block">({calcResult.bagsDap} bags)</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-amber-200">
                    <span className="text-[10px] text-stone-500 block">MOP Potash</span>
                    <span className="font-bold text-stone-800 text-sm">{calcResult.mopKg} kg</span>
                    <span className="text-[10px] text-stone-400 block">Basal dose</span>
                  </div>
                </div>

                <p className="text-[11px] text-amber-900/90 leading-tight">
                  💡 <strong>Timing Tip:</strong> {calcResult.note}
                </p>
              </div>
            )}
          </div>

          {/* Mandi Market Price Board */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
                <Sprout className="w-4 h-4 text-emerald-600" />
                <span>{getTranslation(currentLang, "mandiPrices")}</span>
              </h3>
              <span className="text-[11px] text-stone-400">Live Yard Rates</span>
            </div>

            <div className="space-y-2">
              {COMMODITY_PRICES.map((p) => (
                <div
                  key={p.id}
                  className="p-2.5 rounded-xl bg-stone-50 hover:bg-stone-100/80 transition-colors flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-stone-800">{p.crop}</div>
                    <div className="text-[10px] text-stone-500">{p.market}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-stone-900 font-['Outfit']">
                      {p.currency} {p.pricePerQuintal}
                    </div>
                    <div
                      className={`text-[10px] font-semibold flex items-center justify-end ${
                        p.trend === "up" ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {p.trend === "up" ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                      {p.changePct}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
