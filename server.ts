import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY"),
    timestamp: new Date().toISOString(),
  });
});

// 1. Agriculture: AI Crop Doctor & Soil Advisor
app.post("/api/ai/crop-doctor", async (req, res) => {
  try {
    const { cropName, symptoms, soilType, imageBase64, language = "English" } = req.body;
    const ai = getGeminiClient();

    const prompt = `You are a rural agricultural scientist and crop doctor helping rural farmers.
Target Language: ${language} (Please respond completely in ${language} with simple, clear, actionable rural terms).

Crop: ${cropName || "Unspecified Crop"}
Observed Symptoms: ${symptoms || "General health inspection"}
Soil Type: ${soilType || "Standard farm soil"}
${imageBase64 ? "An image of the affected plant/leaf has been provided." : ""}

Analyze this crop health issue and provide a structured diagnosis:
1. Diagnosis & Disease/Pest Identification (or likely nutritional deficiency)
2. Severity Level (Mild, Moderate, Severe)
3. Immediate Action (What the farmer should do today)
4. Organic / Low-Cost Remediation (Neem oil, wood ash, compost tea, biological controls suitable for rural areas)
5. Chemical Treatment (Standard accessible pesticides/fertilizers with safe dosage instructions)
6. Prevention for Next Cycle (Crop rotation, spacing, drainage, seed treatment)

Format with clear headers and bullet points. Be compassionate, practical, and prioritize farmer safety and cost-effectiveness.`;

    if (ai) {
      const parts: any[] = [];
      if (imageBase64) {
        // Strip data URL header if present
        const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        parts.push({
          inlineData: {
            mimeType: "image/jpeg",
            data: cleanBase64,
          },
        });
      }
      parts.push({ text: prompt });

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: imageBase64 ? { parts } : prompt,
      });

      return res.json({ result: response.text });
    }

    // Fallback response if API key is not yet set
    return res.json({
      result: `### 🌾 Rural Agriculture Advisory (${language})
**Diagnosis:** Probable Early Leaf Blight / Moisture Stress on ${cropName || "Crop"}
**Severity Level:** Moderate

**Immediate Action:**
- Isolate severely affected lower foliage to prevent fungal spores spreading.
- Refrain from overhead sprinkler irrigation; irrigate early morning directly at the root zone.

**Organic & Low-Cost Remedy:**
- Prepare Neem Seed Kernel Extract (5%) or spray 3ml Neem Oil per liter of water with a pinch of mild soap.
- Dust dry wood ash lightly on morning-damp leaves to deter sucking pests and absorb excess leaf moisture.

**Standard Treatment:**
- If fungal spots expand, apply Mancozeb 75% WP @ 2g per liter or Copper Oxychloride 50% WP @ 2.5g per liter.
- Wear mask and gloves; spray during calm wind hours.

**Prevention Advice:**
- Practice 2-season crop rotation with legumes to replenish soil nitrogen.
- Ensure 45cm furrow drainage to prevent stagnant root waterlogging.`,
    });
  } catch (error: any) {
    console.error("Error in crop-doctor API:", error);
    res.status(500).json({ error: error.message || "Failed to analyze crop issue" });
  }
});

// 2. Rural Healthcare: AI Symptom Triage & First-Aid Advisor
app.post("/api/ai/health-triage", async (req, res) => {
  try {
    const { patientAge, symptoms, duration, vitals, language = "English" } = req.body;
    const ai = getGeminiClient();

    const prompt = `You are a certified community health advisor assisting rural community health workers (ASHA/ANM/CHWs) and villagers.
Target Language: ${language} (Please respond completely in ${language} using compassionate, easy-to-understand terms).

Patient Age: ${patientAge || "Adult"}
Reported Symptoms: ${symptoms}
Duration: ${duration || "Recent"}
Known Vitals / Context: ${vitals || "Standard rural setting"}

Provide a rural medical triage assessment:
1. Urgency Level: [GREEN: Home Care & Monitoring | YELLOW: Visit Primary Health Centre (PHC) within 24h | RED: Immediate Hospital / Emergency Transfer]
2. Probable Causes & Risk Assessment
3. Immediate First Aid & Home Comfort Measures (Safe, non-pharmacological, hydration/ORS, rest, posture)
4. Red Flag Warnings (Signs that mean get to an ambulance or emergency doctor immediately)
5. Crucial Questions to ask the patient
6. Standard Medical Disclaimer (This is an assistive advisory, not a replacement for a certified medical officer).`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });
      return res.json({ result: response.text });
    }

    return res.json({
      result: `### 🏥 Community Health Triage Advisory (${language})
**Urgency Level:** 🟡 **YELLOW: Visit Primary Health Centre (PHC) within 24 Hours**

**Assessment & Immediate Comfort:**
- Ensure continuous hydration with Oral Rehydration Salts (ORS) or boiled and cooled rice water with a pinch of salt.
- Keep the patient rested in a well-ventilated, shaded room.
- Monitor temperature and fluid intake every 2 hours.

**Red Flag Warnings (Seek Immediate Hospital Emergency):**
- High fever (>102°F / 39°C) persisting for over 48 hours or accompanied by stiff neck.
- Difficulty breathing, blue discoloration of lips or nail beds, or severe chest pain.
- Inability to retain fluids, lethargy, or confusion.

*Disclaimer: This assessment is an automated community health guidance tool. Always consult your local Primary Health Centre (PHC) doctor or Community Health Worker.*`,
    });
  } catch (error: any) {
    console.error("Error in health-triage API:", error);
    res.status(500).json({ error: error.message || "Failed to perform health triage" });
  }
});

// 3. Education: Multilingual Rural Tutor & Skill Explainer
app.post("/api/ai/edu-tutor", async (req, res) => {
  try {
    const { topic, gradeLevel, question, language = "English" } = req.body;
    const ai = getGeminiClient();

    const prompt = `You are an inspiring rural community teacher and village mentor.
Target Language: ${language} (Please respond completely in ${language}).
Subject / Topic: ${topic || "General Knowledge"}
Target Audience / Grade: ${gradeLevel || "Community & Youth"}
Question / Concept: ${question}

Teach this concept in a remarkably engaging way:
1. Explain in simple, vivid terms using everyday rural analogies (farming, seasons, river currents, solar light, local markets, trees).
2. Step-by-Step Breakdown with a relatable real-world example.
3. Quick Interactive Check (2 fun questions with answers).
4. Practical Practical Village Application (How knowing this helps in daily life, farming, or vocational skills).`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });
      return res.json({ result: response.text });
    }

    return res.json({
      result: `### 📚 Rural Village Tutor (${language})
**Topic:** Understanding Solar Energy & Electricity
**Everyday Analogy:** Think of the sun like an endless overhead water tank, and solar panels like rain gutters that channel flowing rainwater through pipes to turn a waterwheel!

**How it works simply:**
1. **The Sun's Rays (Photons):** Sunlight hits the dark silicon wafers on your solar roof.
2. **The Flow (Electric Current):** The energy knocks loose tiny particles (electrons), creating an electrical flow just like water flowing down a slope.
3. **The Battery Storage:** Excess current is stored into chemical batteries, like water stored in a masonry cistern for dry days.

**Everyday Village Application:**
- Powering submersible irrigation pumps during daytime without diesel expenses.
- Charging community LED lanterns and study lamps for students during grid blackouts.`,
    });
  } catch (error: any) {
    console.error("Error in edu-tutor API:", error);
    res.status(500).json({ error: error.message || "Failed to generate lesson" });
  }
});

// 4. Government Services: Welfare Scheme Eligibility & Document Assistant
app.post("/api/ai/gov-schemes", async (req, res) => {
  try {
    const { occupation, landholding, incomeLevel, familySize, category, goal, language = "English" } = req.body;
    const ai = getGeminiClient();

    const prompt = `You are an expert rural public service and welfare scheme counselor.
Target Language: ${language} (Respond fully in ${language}).

Citizen Profile:
- Occupation: ${occupation || "Farmer / Daily Wage Worker"}
- Landholding: ${landholding || "Under 2 Acres (Small/Marginal)"}
- Annual Household Income: ${incomeLevel || "Below Poverty Line / Low Income"}
- Family Size: ${familySize || "4 Members"}
- Category / Special Demographics: ${category || "Rural Resident / Women Beneficiary"}
- Primary Need / Goal: ${goal || "Agricultural subsidy, health insurance, and rural housing"}

Identify relevant government welfare schemes, subsidies, and citizen entitlements:
1. Top 3-4 Eligible Schemes (Provide full scheme names, purpose, and financial/material benefit amount).
2. Mandatory Documents Checklist (IDs, land records, bank account linkage, certificates).
3. Step-by-Step Application Process (Online portal, Common Service Centre [CSC], Panchayat office, or Gram Sevak).
4. Critical Deadlines & Verification Tips to avoid rejection.
5. Grievance Redressal Hotline / Helpline numbers.`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });
      return res.json({ result: response.text });
    }

    return res.json({
      result: `### 🏛️ Citizen Welfare & Subsidy Guide (${language})
**Top Matching Schemes for Your Profile:**

1. **PM-KISAN / Small Farmer Direct Income Support:**
   - **Benefit:** Direct income transfer of ₹6,000 / $80 annually in 3 direct installments into Aadhaar-seeded bank account.
2. **PM Fasal Bima Yojana (Crop Insurance Scheme):**
   - **Benefit:** Subsidized premium (1.5% - 2%) protection against drought, localized floods, unseasonal hail, and pest epidemics.
3. **PM Awas Yojana - Gramin (Rural Housing Assistance):**
   - **Benefit:** Financial assistance of ₹1,20,000 to ₹1,30,000 for constructing a pucca (permanent) home with clean sanitation facility.
4. **PM Kusum Yojana (Solar Agriculture Pump Subsidy):**
   - **Benefit:** Up to 60% government subsidy to replace costly diesel pumps with high-efficiency solar pumps.

**Document Checklist:**
- Official Citizen ID (Aadhaar / Voter ID / National ID)
- Land Record (7/12 extract or Land Ownership Deed)
- Active Bank Passbook linked with National ID (DBT enabled)
- Recent Passport-size Photographs & Mobile Number linked to ID`,
    });
  } catch (error: any) {
    console.error("Error in gov-schemes API:", error);
    res.status(500).json({ error: error.message || "Failed to find schemes" });
  }
});

// 5. Environmental & Climate Monitoring: Early Warnings & Resource Planning
app.post("/api/ai/eco-advisor", async (req, res) => {
  try {
    const { weatherCondition, groundWaterLevel, aqi, soilMoisture, season, language = "English" } = req.body;
    const ai = getGeminiClient();

    const prompt = `You are an environmental scientist and rural disaster resilience coordinator.
Target Language: ${language} (Respond fully in ${language}).

Village Environmental Data:
- Current Weather & Forecast: ${weatherCondition || "High heat, dry winds"}
- Ground Water Depth: ${groundWaterLevel || "45 meters below surface (Declining)"}
- Air Quality Index (AQI): ${aqi || "65 (Moderate)"}
- Soil Moisture Sensor Average: ${soilMoisture || "28% (Low)"}
- Agricultural Season: ${season || "Summer / Pre-Monsoon"}

Provide an Environmental & Climate Advisory for the village:
1. Ecological Risk Level (Low, Moderate, High Alert)
2. Water Resource Management Protocol (Borewell rotation, community check-dam usage, drip irrigation advice)
3. Crop & Livestock Protection from extreme heat/frost/unseasonal weather
4. Community Action Plan (Rainwater recharge pit digging, organic mulching, forest/fire watch)
5. Early Warning Protocols (What the village leadership should announce).`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });
      return res.json({ result: response.text });
    }

    return res.json({
      result: `### 🌍 Village Environmental & Climate Advisory (${language})
**Ecological Risk Level:** 🟠 **MODERATE RISK - Pre-Drought & Water Depletion Alert**

**Water Management Directives:**
- Groundwater depth is receding; prohibit flood-irrigation during peak sun hours (10:00 AM - 4:00 PM).
- Switch to night or early dawn furrow/drip irrigation to reduce evaporative loss by up to 40%.
- Maintain communal village pond bunds and desilt incoming runoff channels before monsoon rains arrive.

**Crop & Livestock Shielding:**
- Apply 3-inch straw or dry leaf mulch across open vegetable beds to lock in remaining soil moisture.
- Ensure community cattle sheds are shaded with thatch roofs and lime-washed to reflect solar radiation. Provide mineral electrolytes in drinking troughs.

**Community Resilience Action:**
- Organize community Shramdaan (voluntary labor) to dig recharge trenches around existing borewells.`,
    });
  } catch (error: any) {
    console.error("Error in eco-advisor API:", error);
    res.status(500).json({ error: error.message || "Failed to assess environmental risk" });
  }
});

// 6. Unified Multilingual AI Rural Assistant (Voice / Text)
app.post("/api/ai/ask", async (req, res) => {
  try {
    const { query, category = "general", language = "English", history = [] } = req.body;
    const ai = getGeminiClient();

    const systemInstruction = `You are 'GramMitra' (Rural Friend), an intelligent, compassionate, and practical AI assistant for rural communities.
You assist villagers, farmers, students, and community health workers with:
- Agriculture (crops, livestock, fertilizers, pest control, weather)
- Healthcare (first aid, maternal health, preventive care, clinic directions)
- Education (village school tutoring, homework, digital skills)
- Government services (subsidies, welfare schemes, pensions, ration cards)
- Environmental monitoring (water conservation, clean energy, weather warnings)

Target Language: ${language}. Always reply in ${language} with clear, respectful, jargon-free explanations.
Keep answers well-structured with bullet points and bold highlights. If there is a health or emergency danger, always advise contacting certified professionals immediately.`;

    if (ai) {
      const conversation = [
        ...history.map((m: any) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
        {
          role: "user",
          parts: [{ text: `Category: ${category}. User Query: ${query}` }],
        },
      ];

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: conversation,
        config: {
          systemInstruction,
        },
      });

      return res.json({ reply: response.text });
    }

    return res.json({
      reply: `Namaste! I am your Rural Community Assistant. How can I assist your village today? In ${language}, you can ask me about crop diseases, fertilizers, symptom checks, school lessons, welfare schemes, or groundwater conservation!`,
    });
  } catch (error: any) {
    console.error("Error in ask API:", error);
    res.status(500).json({ error: error.message || "Failed to answer query" });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Rural Smart Community Server running on http://localhost:${PORT}`);
  });
}

startServer();
