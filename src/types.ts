export type LanguageCode = "en" | "hi" | "es" | "sw" | "bn" | "te" | "fr" | "pt";

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
  speechCode: string;
}

export type ActiveDomain = "overview" | "agriculture" | "healthcare" | "education" | "government" | "environment";

export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  rainfallProbability: number;
  windSpeed: number;
  uvIndex: number;
  alert?: {
    level: "info" | "warning" | "danger";
    title: string;
    description: string;
  };
}

export interface EnvironmentalSensors {
  aqi: number;
  aqiStatus: "Good" | "Moderate" | "Unhealthy for Sensitive" | "Poor";
  pm25: number;
  groundwaterDepthMeters: number;
  groundwaterTrend: "stable" | "declining" | "recharging";
  soilMoisturePct: number;
  solarGenerationKw: number;
  reservoirLevelPct: number;
}

export interface CommodityPrice {
  id: string;
  crop: string;
  market: string;
  pricePerQuintal: number;
  currency: string;
  trend: "up" | "down" | "stable";
  changePct: number;
  updatedAt: string;
}

export interface CropCaseSample {
  id: string;
  cropName: string;
  symptoms: string;
  imageUrl: string;
  description: string;
}

export interface VocationalCourse {
  id: string;
  title: string;
  category: "agriculture" | "energy" | "digital" | "craft";
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  modulesCount: number;
  description: string;
  keySkills: string[];
  instructor: string;
}

export interface GovernmentScheme {
  id: string;
  title: string;
  department: string;
  benefit: string;
  eligibility: string;
  requiredDocuments: string[];
  applicationMode: "Online" | "CSC / Panchayat" | "Both";
  category: "farmer" | "health" | "housing" | "women" | "employment";
}

export interface HealthWorker {
  id: string;
  name: string;
  role: string;
  location: string;
  contact: string;
  availability: string;
}

export interface GrievanceReport {
  id: string;
  category: string;
  villageWard: string;
  description: string;
  status: "Submitted" | "Under Review" | "Action Assigned" | "Resolved";
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  domain?: ActiveDomain;
}
