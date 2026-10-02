import React, { useState } from "react";
import {
  Landmark,
  Sparkles,
  FileText,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Send,
  Building2,
  Search,
  Filter,
  Users
} from "lucide-react";
import Markdown from "react-markdown";
import { LanguageCode, GovernmentScheme, GrievanceReport } from "../types";
import { GOVERNMENT_SCHEMES, INITIAL_GRIEVANCES } from "../data/mockData";
import { getTranslation } from "../data/translations";
import { AudioReaderButton } from "./AudioReaderButton";

interface GovernmentTabProps {
  currentLang: LanguageCode;
}

export const GovernmentTab: React.FC<GovernmentTabProps> = ({ currentLang }) => {
  // AI Scheme Finder State
  const [occupation, setOccupation] = useState("Small Farmer (Under 2 Acres)");
  const [landholding, setLandholding] = useState("1.5 Acres");
  const [incomeLevel, setIncomeLevel] = useState("Below Poverty Line (BPL) / Low Income");
  const [familySize, setFamilySize] = useState("4 Members");
  const [category, setCategory] = useState("Rural Resident / Women Beneficiary");
  const [goal, setGoal] = useState("Solar irrigation pump subsidy and crop insurance");
  const [isScanning, setIsScanning] = useState(false);
  const [schemesResult, setSchemesResult] = useState<string | null>(null);
  const [schemesError, setSchemesError] = useState<string | null>(null);

  // Scheme Directory Filter
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");

  // Grievance Lodger State
  const [grievanceCategory, setGrievanceCategory] = useState("Drinking Water / Handpump");
  const [villageWard, setVillageWard] = useState("Ward #3 (South Hamlet)");
  const [grievanceDesc, setGrievanceDesc] = useState("");
  const [grievancesList, setGrievancesList] = useState<GrievanceReport[]>(INITIAL_GRIEVANCES);
  const [lodgedSuccess, setLodgedSuccess] = useState<string | null>(null);

  const handleScanSchemes = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsScanning(true);
    setSchemesError(null);
    setSchemesResult(null);

    try {
      const response = await fetch("/api/ai/gov-schemes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          occupation,
          landholding,
          incomeLevel,
          familySize,
          category,
          goal,
          language: currentLang,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to scan welfare schemes");
      }

      const data = await response.json();
      setSchemesResult(data.result);
    } catch (err: any) {
      console.error(err);
      setSchemesError("Could not reach digital welfare registry. Showing standard rural entitlement schemes.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleLodgeGrievance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grievanceDesc.trim()) return;

    const newTicketId = `GRV-${Math.floor(1000 + Math.random() * 9000)}`;
    const newGrievance: GrievanceReport = {
      id: newTicketId,
      category: grievanceCategory,
      villageWard,
      description: grievanceDesc,
      status: "Submitted",
      timestamp: "Just now",
    };

    setGrievancesList([newGrievance, ...grievancesList]);
    setLodgedSuccess(`Grievance lodged successfully! Tracking Ticket ID: ${newTicketId}. Forwarded to Panchayat Secretary.`);
    setGrievanceDesc("");
    setTimeout(() => setLodgedSuccess(null), 7000);
  };

  const filteredSchemes =
    selectedCategoryFilter === "all"
      ? GOVERNMENT_SCHEMES
      : GOVERNMENT_SCHEMES.filter((s) => s.category === selectedCategoryFilter);

  return (
    <div id="government-tab-content" className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-950 to-purple-900 text-white rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-800/80 text-purple-200 text-xs font-semibold mb-2">
            <Landmark className="w-3.5 h-3.5" />
            <span>Jan Seva Portal • Public Entitlements & Citizen Services</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-['Outfit']">
            AI Welfare Scheme Scanner & Citizen Grievance Portal
          </h2>
          <p className="text-xs sm:text-sm text-purple-100 max-w-2xl mt-1">
            Instantly match your family profile to central & state government welfare schemes, check mandatory documents, and lodge village civic issues directly to the Panchayat.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AudioReaderButton
            textToRead="Jan Seva Citizen Portal. Find government welfare subsidies, crop insurance, housing grants, and register handpump or electricity complaints with Greenfield Gram Panchayat."
            lang={currentLang}
            label="Audio Overview"
          />
        </div>
      </div>

      {/* Grid: AI Scheme Scanner (7 Cols) + Directory & Grievances (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: AI Scheme Scanner (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/90 shadow-xs space-y-5">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-purple-600" />
              <span>AI Welfare Scheme Eligibility Scanner</span>
            </h3>
            <p className="text-xs text-stone-500">
              Input your household details to match against over 40+ rural welfare programs
            </p>
          </div>

          <form onSubmit={handleScanSchemes} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Primary Occupation
                </label>
                <select
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Small Farmer (Under 2 Acres)">Small / Marginal Farmer (Under 2 Acres)</option>
                  <option value="Medium Farmer (2-5 Acres)">Medium Farmer (2 - 5 Acres)</option>
                  <option value="Landless Agricultural Laborer">Landless Agricultural Laborer</option>
                  <option value="Village Artisan / Craftsman">Village Artisan / Handloom Weaver</option>
                  <option value="Small Shopkeeper / Self-Employed">Small Kirana Shop / Self-Employed</option>
                  <option value="Unemployed Rural Youth">Unemployed Rural Youth</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Landholding Size
                </label>
                <input
                  type="text"
                  value={landholding}
                  onChange={(e) => setLandholding(e.target.value)}
                  placeholder="e.g. 1.5 Acres, Landless, 3 Acres"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Annual Income Bracket
                </label>
                <select
                  value={incomeLevel}
                  onChange={(e) => setIncomeLevel(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Below Poverty Line (BPL) / Low Income">Below Poverty Line (BPL / Antyodaya)</option>
                  <option value="Under ₹1,00,000 per year">Under ₹1,00,000 / $1,200 per year</option>
                  <option value="₹1,00,000 to ₹2,50,000 per year">₹1,00,000 to ₹2,50,000 per year</option>
                  <option value="Above ₹2,50,000">Above ₹2,50,000</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Social Category / Beneficiary
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Rural Resident / Women Beneficiary">Women-Headed Household</option>
                  <option value="SC / ST Category">SC / ST Deprived Category</option>
                  <option value="OBC Category">OBC Category</option>
                  <option value="General Small Farmer">General Category Farmer</option>
                  <option value="Differently Abled (Divyang)">Differently Abled (Divyangjan)</option>
                  <option value="Senior Citizen (60+ yrs)">Senior Citizen</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                What are your family's biggest needs right now?
              </label>
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Solar water pump subsidy, pucca housing grant, Ayushman health card, crop loss insurance"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {schemesError && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                {schemesError}
              </div>
            )}

            <button
              type="submit"
              disabled={isScanning}
              className="w-full bg-purple-800 hover:bg-purple-700 disabled:bg-stone-300 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              {isScanning ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Scanning Eligibility Database with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Discover Matching Welfare Schemes & Grants</span>
                </>
              )}
            </button>
          </form>

          {/* Scheme Scanner Output */}
          {schemesResult && (
            <div
              id="schemes-scanner-result"
              className="mt-4 p-4 sm:p-5 rounded-2xl bg-stone-50 border border-purple-300 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                  <Landmark className="w-4 h-4 text-purple-700" />
                  Eligible Schemes & Mandatory Checklist
                </span>
                <AudioReaderButton
                  id="schemes-audio-btn"
                  textToRead={schemesResult}
                  lang={currentLang}
                />
              </div>

              <div className="prose prose-sm max-w-none text-xs sm:text-sm text-stone-800 leading-relaxed">
                <div className="markdown-body">
                  <Markdown>{schemesResult}</Markdown>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Scheme Directory & Grievance Lodger (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Government Welfare Schemes Directory */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-600" />
                <span>Featured Government Schemes</span>
              </h3>
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="text-[11px] font-semibold bg-stone-100 border border-stone-300 rounded-lg px-2 py-1"
              >
                <option value="all">All Categories</option>
                <option value="farmer">Agriculture & Solar</option>
                <option value="health">Healthcare</option>
                <option value="housing">Rural Housing</option>
                <option value="employment">Employment</option>
              </select>
            </div>

            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {filteredSchemes.map((scheme) => (
                <div
                  key={scheme.id}
                  className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-stone-900">{scheme.title}</h4>
                    <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      {scheme.applicationMode}
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-800 font-medium">
                    💰 {scheme.benefit}
                  </p>
                  <p className="text-[11px] text-stone-600">
                    <strong>Eligibility:</strong> {scheme.eligibility}
                  </p>
                  <div className="text-[10px] text-stone-400 pt-1 flex flex-wrap gap-1">
                    {scheme.requiredDocuments.map((doc, i) => (
                      <span key={i} className="bg-white border border-stone-200 px-1.5 py-0.5 rounded">
                        ✓ {doc}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Village Grievance Lodger */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-xs space-y-4">
            <div className="border-b border-stone-100 pb-2">
              <h3 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-600" />
                <span>Panchayat Civic Grievance Lodger</span>
              </h3>
              <p className="text-xs text-stone-500">
                Directly report broken pumps, roads, streetlights, or ration delays
              </p>
            </div>

            {lodgedSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-medium">
                {lodgedSuccess}
              </div>
            )}

            <form onSubmit={handleLodgeGrievance} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                    Issue Category
                  </label>
                  <select
                    value={grievanceCategory}
                    onChange={(e) => setGrievanceCategory(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 bg-stone-50"
                  >
                    <option value="Drinking Water / Handpump">Water / Handpump</option>
                    <option value="Solar Streetlights">Solar Streetlights</option>
                    <option value="Canal Water Distribution">Canal Water Silt</option>
                    <option value="Ration Shop (PDS) Quota">Ration Shop / PDS</option>
                    <option value="Road Repair / Drainage">Road / Drainage</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                    Village Ward / Hamlet
                  </label>
                  <input
                    type="text"
                    value={villageWard}
                    onChange={(e) => setVillageWard(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 bg-stone-50"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                  Describe Issue & Exact Location
                </label>
                <textarea
                  rows={2}
                  value={grievanceDesc}
                  onChange={(e) => setGrievanceDesc(e.target.value)}
                  placeholder="e.g. Handpump near the banyan tree pumping muddy rust water since Tuesday..."
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-stone-50"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Submit Civic Grievance to Panchayat
              </button>
            </form>

            {/* Existing Grievance Tickets */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-semibold text-stone-500 block">
                Recent Public Grievance Statuses:
              </span>
              {grievancesList.slice(0, 3).map((g) => (
                <div
                  key={g.id}
                  className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-stone-800">
                      <span className="font-mono text-purple-700 mr-1">{g.id}</span>
                      {g.category}
                    </div>
                    <div className="text-[10px] text-stone-500">{g.villageWard} • {g.timestamp}</div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      g.status === "Resolved"
                        ? "bg-emerald-100 text-emerald-800"
                        : g.status === "Action Assigned"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {g.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
