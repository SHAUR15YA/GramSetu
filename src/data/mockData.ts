import {
  WeatherData,
  EnvironmentalSensors,
  CommodityPrice,
  CropCaseSample,
  VocationalCourse,
  GovernmentScheme,
  HealthWorker,
  GrievanceReport
} from "../types";

export const INITIAL_WEATHER: WeatherData = {
  temp: 33,
  condition: "Sunny & Dry Winds",
  humidity: 38,
  rainfallProbability: 12,
  windSpeed: 16,
  uvIndex: 8,
  alert: {
    level: "warning",
    title: "High Evaporative Heat Advisory",
    description: "Peak afternoon ground evaporation. Recommend scheduling drip/furrow irrigation between 7:00 PM and 6:00 AM."
  }
};

export const INITIAL_SENSORS: EnvironmentalSensors = {
  aqi: 62,
  aqiStatus: "Moderate",
  pm25: 28,
  groundwaterDepthMeters: 46.4,
  groundwaterTrend: "declining",
  soilMoisturePct: 31,
  solarGenerationKw: 18.5,
  reservoirLevelPct: 54
};

export const COMMODITY_PRICES: CommodityPrice[] = [
  {
    id: "c1",
    crop: "Wheat (Sharbati Grade)",
    market: "Central Mandi Yard #2",
    pricePerQuintal: 2580,
    currency: "₹",
    trend: "up",
    changePct: 2.4,
    updatedAt: "Today, 09:30 AM"
  },
  {
    id: "c2",
    crop: "Paddy / Rice (Basmati)",
    market: "District Grain Market",
    pricePerQuintal: 3850,
    currency: "₹",
    trend: "stable",
    changePct: 0.2,
    updatedAt: "Today, 10:15 AM"
  },
  {
    id: "c3",
    crop: "Mustard Seed",
    market: "Agri Hub Mandi",
    pricePerQuintal: 5420,
    currency: "₹",
    trend: "up",
    changePct: 3.1,
    updatedAt: "Today, 08:45 AM"
  },
  {
    id: "c4",
    crop: "Raw Cotton (Medium Staple)",
    market: "Cooperative Ginning Yard",
    pricePerQuintal: 7100,
    currency: "₹",
    trend: "down",
    changePct: -1.8,
    updatedAt: "Yesterday"
  },
  {
    id: "c5",
    crop: "Maize (Yellow Corn)",
    market: "Regional Feed Hub",
    pricePerQuintal: 2190,
    currency: "₹",
    trend: "up",
    changePct: 1.5,
    updatedAt: "Today, 11:00 AM"
  },
  {
    id: "c6",
    crop: "Onion (Red Nashik)",
    market: "Vegetable Terminal",
    pricePerQuintal: 1850,
    currency: "₹",
    trend: "down",
    changePct: -4.2,
    updatedAt: "Today, 07:15 AM"
  }
];

export const CROP_SAMPLES: CropCaseSample[] = [
  {
    id: "sample-1",
    cropName: "Tomato",
    symptoms: "Concentric dark brown circular lesions on lower foliage with yellow halos; leaf drying and curling.",
    imageUrl: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600&q=80",
    description: "Probable Early Blight (Alternaria solani)"
  },
  {
    id: "sample-2",
    cropName: "Paddy / Rice",
    symptoms: "Spindle-shaped diamond lesions with ash-grey centers on leaf blades; necrotic leaf margins.",
    imageUrl: "https://images.unsplash.com/photo-1536939459926-301728717817?auto=format&fit=crop&w=600&q=80",
    description: "Probable Rice Blast (Magnaporthe oryzae)"
  },
  {
    id: "sample-3",
    cropName: "Wheat",
    symptoms: "Bright yellow pustules aligned in linear stripes between leaf veins, rubbing off on fingers as yellow powder.",
    imageUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80",
    description: "Probable Stripe / Yellow Rust (Puccinia striiformis)"
  },
  {
    id: "sample-4",
    cropName: "Corn / Maize",
    symptoms: "Older leaves showing V-shaped yellowing starting from leaf tips down the central midrib.",
    imageUrl: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80",
    description: "Probable Nitrogen Deficiency & Moisture Stress"
  }
];

export const VOCATIONAL_COURSES: VocationalCourse[] = [
  {
    id: "course-1",
    title: "Solar Agriculture Pump Operation & First-Line Maintenance",
    category: "energy",
    duration: "4 Weeks (Self-paced)",
    difficulty: "Beginner",
    modulesCount: 8,
    description: "Learn how to clean PV solar panels, troubleshoot DC-to-AC inverters, inspect submersible pump bearings, and protect against dry-run damage.",
    keySkills: ["Inverter error codes", "Dust cleaning cycles", "Lightning surge protectors", "Seasonal tilt adjustment"],
    instructor: "Er. Ramesh Patel (Rural Energy Mission)"
  },
  {
    id: "course-2",
    title: "Drip & Micro-Irrigation Design for Water Scarcity",
    category: "agriculture",
    duration: "3 Weeks",
    difficulty: "Intermediate",
    modulesCount: 6,
    description: "Master venturi fertilizer injection, hydrocyclone sand filter backwashing, emitter unclogging with citric acid, and zero-pressure gravity kits.",
    keySkills: ["Emitter spacing", "Acid treatment for clogging", "Fertigation ratio", "Low-pressure drip lines"],
    instructor: "Dr. Ananya Sharma (Agri Scientist)"
  },
  {
    id: "course-3",
    title: "Organic Vermicomposting & Bio-Pesticide Production",
    category: "agriculture",
    duration: "2 Weeks",
    difficulty: "Beginner",
    modulesCount: 5,
    description: "Convert crop residues and cow dung into nutrient-rich black gold vermicast using Eisenia fetida earthworms. Formulate neem-dashparni bio-repellents.",
    keySkills: ["Bed temperature control", "Moisture balance (60-70%)", "Worm tea extraction", "Packaging & village sales"],
    instructor: "Kisan Mitra Collective"
  },
  {
    id: "course-4",
    title: "Safe Digital Payments, UPI & Banking Fraud Prevention",
    category: "digital",
    duration: "1 Week",
    difficulty: "Beginner",
    modulesCount: 4,
    description: "Essential digital financial literacy: making secure QR payments, verifying receiver names, protecting OTPs/PINs, and using Aadhaar-enabled ATMs.",
    keySkills: ["OTP secrecy", "Direct Benefit Transfer (DBT)", "ATM card safety", "Cyber helpline 1930 reporting"],
    instructor: "Lead Bank Rural Digital Fellow"
  },
  {
    id: "course-5",
    title: "Scientific Backyard Beekeeping & Raw Honey Harvesting",
    category: "craft",
    duration: "4 Weeks",
    difficulty: "Intermediate",
    modulesCount: 7,
    description: "Start apiculture with Apis cerana indica bee boxes. Learn queen bee rearing, seasonal bee forage management, and zero-heat honey centrifugation.",
    keySkills: ["Bee smoker handling", "Wax moth pest defense", "Uncapped comb harvesting", "Bee flora calendar"],
    instructor: "Khadi & Village Commission Mentor"
  }
];

export const GOVERNMENT_SCHEMES: GovernmentScheme[] = [
  {
    id: "sch-1",
    title: "PM-KISAN (Direct Farmer Income Support)",
    department: "Ministry of Agriculture & Farmer Welfare",
    benefit: "₹6,000 / $80 direct annual cash transfer in 3 quarterly installments of ₹2,000.",
    eligibility: "All landholding small and marginal farmer families with cultivable land in their name.",
    requiredDocuments: ["Aadhaar Card", "Land Record (7/12 or RoR)", "Aadhaar-seeded Bank Passbook"],
    applicationMode: "Both",
    category: "farmer"
  },
  {
    id: "sch-2",
    title: "PM Fasal Bima Yojana (Crop Insurance Scheme)",
    department: "Department of Financial Services",
    benefit: "Comprehensive yield loss coverage for drought, floods, pest attack; only 1.5-2% farmer premium.",
    eligibility: "Farmers growing notified food crops, oilseeds, or annual commercial/horticultural crops.",
    requiredDocuments: ["Sowing Certificate from Patwari", "Land Possession Certificate", "Kisan Credit Card / Bank Account"],
    applicationMode: "Both",
    category: "farmer"
  },
  {
    id: "sch-3",
    title: "Ayushman Bharat - PM-JAY (National Health Protection)",
    department: "National Health Authority",
    benefit: "Cashless health cover up to ₹5,00,000 per family per year for secondary and tertiary hospitalization.",
    eligibility: "Rural families identified under SECC deprivation criteria (D1 to D7 criteria).",
    requiredDocuments: ["Ration Card", "Aadhaar Card", "PM-JAY Golden Card or Family ID"],
    applicationMode: "CSC / Panchayat",
    category: "health"
  },
  {
    id: "sch-4",
    title: "PM Awas Yojana - Gramin (Pucca Rural Housing)",
    department: "Ministry of Rural Development",
    benefit: "Grant of ₹1,20,000 (plains) to ₹1,30,000 (hilly areas) for building a permanent safe home + 90 days MGNREGA wages.",
    eligibility: "Homeless households or families living in kutcha/dilapidated single-room houses.",
    requiredDocuments: ["BPL / SECC Census ID", "Bank Account Details", "Land or Homestead Certificate", "Aadhaar"],
    applicationMode: "Both",
    category: "housing"
  },
  {
    id: "sch-5",
    title: "PM Kusum Scheme (Solar Agricultural Water Pumps)",
    department: "Ministry of New & Renewable Energy",
    benefit: "60% direct subsidy for standalone solar irrigation pumps (3 HP to 7.5 HP) replacing diesel engines.",
    eligibility: "Individual farmers, water user associations, and farmer producer groups (FPOs).",
    requiredDocuments: ["Land ownership deed", "Bank Certificate", "Borewell / Source of Water Proof"],
    applicationMode: "Online",
    category: "farmer"
  },
  {
    id: "sch-6",
    title: "MGNREGA (Rural Employment Guarantee)",
    department: "Panchayat & Rural Development",
    benefit: "Guaranteed minimum 100 days of wage employment per financial year for rural adult manual labor.",
    eligibility: "Every rural household whose adult members volunteer to do unskilled manual work.",
    requiredDocuments: ["MGNREGA Job Card", "Aadhaar Card", "Post Office / Bank Account"],
    applicationMode: "CSC / Panchayat",
    category: "employment"
  }
];

export const HEALTH_WORKERS: HealthWorker[] = [
  {
    id: "hw-1",
    name: "Sunita Devi",
    role: "Lead ASHA Health Worker (Ward 1-4)",
    location: "Anganwadi Center East",
    contact: "+91 98765 43210",
    availability: "Daily 8:00 AM - 6:00 PM (Emergency on-call)"
  },
  {
    id: "hw-2",
    name: "Sister Mary Kurian",
    role: "Auxiliary Nurse Midwife (ANM)",
    location: "Sub-Health Centre Greenfield",
    contact: "+91 98765 43211",
    availability: "Mon - Sat 9:00 AM - 4:00 PM"
  },
  {
    id: "hw-3",
    name: "Dr. Vikram Kulkarni (MBBS)",
    role: "Primary Health Centre (PHC) Medical Officer",
    location: "Block PHC Greenfield (3.5 km from Panchayat)",
    contact: "+91 98765 43212",
    availability: "Emergency 24x7 | OPD 9:00 AM - 2:00 PM"
  },
  {
    id: "hw-4",
    name: "Mobile Medical Unit (Van #7)",
    role: "Free Diagnostic & Medicine Van",
    location: "Village Square / Temple Tree",
    contact: "Toll-Free 104",
    availability: "Every Tuesday & Friday, 10:00 AM - 3:30 PM"
  }
];

export const INITIAL_GRIEVANCES: GrievanceReport[] = [
  {
    id: "GRV-8821",
    category: "Drinking Water / Handpump",
    villageWard: "Ward #2, North Hamlet",
    description: "Deep bore handpump handle broken and muddy water seepage noticed.",
    status: "Action Assigned",
    timestamp: "Yesterday, 3:45 PM"
  },
  {
    id: "GRV-8819",
    category: "Solar Streetlights",
    villageWard: "School Junction",
    description: "Solar battery discharging within 2 hours of sundown; junction dark at night.",
    status: "Under Review",
    timestamp: "2 days ago"
  },
  {
    id: "GRV-8804",
    category: "Canal Water Distribution",
    villageWard: "South Branch Canal",
    description: "Silt accumulation blocking flow to tail-end farms.",
    status: "Resolved",
    timestamp: "4 days ago"
  }
];

export const COMMUNITY_NOTICES = [
  {
    id: "n1",
    date: "Sep 15, 2026",
    tag: "Health Camp",
    urgent: true,
    title: "National Pulse Polio & Child Immunization Drive",
    body: "All children under 5 years must be brought to Anganwadi center between 8:30 AM and 4:30 PM. Free vitamin-A drops provided."
  },
  {
    id: "n2",
    date: "Sep 18, 2026",
    tag: "Agriculture",
    urgent: false,
    title: "Subsidized Certified Wheat & Mustard Seed Distribution",
    body: "Block Agriculture Office opening seed window at Panchayat Bhawan. Bring Aadhaar card and land receipt."
  },
  {
    id: "n3",
    date: "Sep 20, 2026",
    tag: "Gram Sabha",
    urgent: false,
    title: "Open Village Assembly on Water Harvesting & Solar Grid",
    body: "Public discussion on new check dam proposal and rooftop solar net-metering. All ward members requested to participate."
  }
];
