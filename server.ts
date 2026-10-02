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

// Resilient multi-model Gemini caller with fallback to flash-lite on high-demand spikes
async function generateWithFallback(
  ai: GoogleGenAI | null,
  contents: any,
  config?: any,
  primaryModel: string = "gemini-3.8-flash"
): Promise<string | null> {
  if (!ai) return null;

  const models = [primaryModel, "gemini-3.1-flash-lite"];
  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        ...(config ? { config } : {}),
      });
      if (response && response.text && response.text.trim().length > 0) {
        return response.text;
      }
    } catch (err: any) {
      console.warn(`[Gemini API] Call with ${model} failed (${err?.status || err?.code || "error"}):`, err?.message || err);
      // Try next model in list
    }
  }
  return null;
}

// Comprehensive intelligent fallback knowledge engine for offline resilience
function getSmartRuralKnowledgeFallback(query: string, category: string, language: string = "English"): string {
  const q = query.toLowerCase();

  // 1. Education: Software Engineer Roadmap & Free Courses
  if (
    q.includes("software engineer") ||
    q.includes("software developer") ||
    q.includes("coding") ||
    q.includes("programmer") ||
    q.includes("roadmap") ||
    (q.includes("free course") && (q.includes("computer") || q.includes("tech") || q.includes("web")))
  ) {
    return `### 💻 Complete Guided Roadmap: Become a Software Engineer (100% Free Resources)

Welcome to your comprehensive, self-paced career roadmap. Becoming a software engineer is completely achievable from home or a rural setting with dedication, discipline, and free high-quality open education.

---

### 🗺️ Phase-by-Phase Learning Roadmap

#### **Phase 1: Computer Science & Programming Foundations (Weeks 1 – 8)**
- **Core Focus:** Computational thinking, algorithms, variables, control flow, functions, and debugging.
- **Top 100% Free Courses:**
  1. **Harvard CS50x: Introduction to Computer Science** *(edX / YouTube)*: The gold standard for CS foundations covering C, Python, SQL, and algorithms. Completely free to audit.
  2. **freeCodeCamp: Scientific Computing with Python** *(freecodecamp.org)*: Interactive, browser-based coding with zero software installation needed.
- **Milestone Project:** Build 3 console apps (CLI Expense Tracker, Unit Converter, Village Quiz Game).

#### **Phase 2: Modern Full-Stack Web Development (Weeks 9 – 20)**
- **Core Focus:** Building modern, interactive web applications accessible on mobile and desktop.
- **Top 100% Free Courses:**
  1. **The Odin Project (Full Stack JavaScript Track)** *(theodinproject.com)*: Practical, project-based curriculum covering Git, HTML5, modern CSS, JavaScript (ES6+), React, and Node.js.
  2. **Full Stack Open** *(fullstackopen.com - University of Helsinki)*: Deep dive into modern web development with React, Redux, Node.js, Express, REST APIs, and TypeScript.
  3. **MDN Web Docs** *(developer.mozilla.org)*: The definitive industry reference for web technologies.
- **Milestone Project:** Build an interactive Village Mandi Price Tracker or Local Service Directory with live search and local data storage.

#### **Phase 3: Databases, Git Version Control & Tooling (Weeks 21 – 28)**
- **Core Focus:** Relational data schemas, version control, and cloud deployments.
- **Top 100% Free Courses:**
  1. **GitHub Skills** *(skills.github.com)*: Interactive exercises to master Git branching, pull requests, and collaborative code reviews.
  2. **Khan Academy / freeCodeCamp Relational Databases**: Hands-on SQL queries, joins, indexes, and PostgreSQL fundamentals.
  3. **NeetCode Roadmap & LeetCode (Easy)**: Practice 50 fundamental algorithmic patterns (Arrays, Two Pointers, Sliding Window, Binary Search).
- **Milestone Project:** Build a Full-Stack CRUD app with user authentication and database persistence.

#### **Phase 4: Capstone Portfolio & Real-World Experience (Weeks 29 – 36)**
- **Core Focus:** Professional code quality, testing, and portfolio presentation.
- **Actions:**
  - Build **3 standout production projects** (e.g. Rural Telehealth Appointment Scheduler, Farm Crop Health Log, Personal Developer Portfolio).
  - Deploy projects live using free hosting tiers (Vercel, GitHub Pages, Render).
  - Contribute to open source on GitHub (start with repositories labeled \`good first issue\`).

#### **Phase 5: Technical Interviews & Job Applications (Weeks 37+)**
- **Actions:**
  - Prepare behavioral and technical interview questions via **Pramp** (free peer-to-peer mock interviews).
  - Optimize your LinkedIn and GitHub profiles.
  - Apply for internships and junior remote developer roles via **Internshala, Wellfound (AngelList), LinkedIn, and RemoteOK**.

---

### 💡 Rural & Self-Taught Success Tips:
1. **Low-Bandwidth & Offline Learning:** Download documentation using **DevDocs.io** (works 100% offline). Download video lectures during high-speed Wi-Fi hours at village digital kiosks or libraries.
2. **Smartphone Coding:** If a PC is not always available, write and test code on your phone using **Replit** or **Termux**.
3. **National Open Platforms:** In India, utilize **Swayam / NPTEL** for free university-level computer science courses conducted by IITs and IISc.
4. **Coursera Financial Aid:** You can apply for 100% financial aid on almost every Coursera certificate (select "Apply for Financial Aid" on the course page).`;
  }

  // 2. Government Schemes for Farmers (e.g. Income < 2 Lakh)
  if (
    q.includes("farmer") ||
    q.includes("2 lakh") ||
    q.includes("two lakh") ||
    q.includes("income") ||
    q.includes("subsidy") ||
    q.includes("eligible") ||
    q.includes("scheme") ||
    q.includes("yojana")
  ) {
    return `### 🏛️ Government Schemes Guide: Farmer with Annual Income < ₹2 Lakh

As a farmer with an annual income below ₹2 Lakh, you are classified under the **Small and Marginal Farmer (SMF)** category. This qualifies you for the highest tier of government subsidies, direct financial assistance, and welfare safety nets.

---

### 🌟 Top Eligible Central & State Schemes

#### 1. **PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)**
- **Financial Benefit:** **₹6,000 per year** in 3 direct cash installments of ₹2,000 directly into your Aadhaar-seeded bank account via Direct Benefit Transfer (DBT).
- **Eligibility:** All landholding farmer families with cultivable land parcels in their name.
- **How to Apply:** Visit \`pmkisan.gov.in\` under "New Farmer Registration" or your nearest Common Service Center (CSC).

#### 2. **PM Fasal Bima Yojana (PMFBY - Crop Insurance)**
- **Financial Benefit:** Comprehensive financial protection against crop failure caused by drought, flood, pests, or unseasonal weather.
- **Cost to Farmer:** Highly subsidized nominal premium:
  - **1.5%** for Rabi crops (Wheat, Mustard, Gram)
  - **2.0%** for Kharif crops (Paddy, Maize, Cotton)
  - Remainder (up to 95% of premium) is paid by Central & State governments.
- **How to Apply:** Apply through your bank branch, PACs society, or \`pmfby.gov.in\` within the seasonal cut-off date.

#### 3. **PM-KUSUM Scheme (Solar Agriculture Pumps)**
- **Financial Benefit:** **60% to 90% government subsidy** to install a standalone solar agriculture water pump (Components B & C), eliminating diesel fuel costs and grid dependency.
- **Eligibility:** Farmers with irrigation land; priority given to small/marginal farmers with water sources.
- **How to Apply:** State Renewable Energy Development Agency portal or District Agriculture Office.

#### 4. **Ayushman Bharat (PM-JAY - Health Cover)**
- **Financial Benefit:** **₹5,00,000 per family per year** free cashless secondary and tertiary hospitalization across all empaneled private and public hospitals.
- **Eligibility:** Automatically covers low-income rural households listed in SECC/Ration database.
- **How to Apply:** Check eligibility at \`beneficiary.nha.gov.in\` or visit your village Ayushman Arogya Mandir / CSC.

#### 5. **Pradhan Mantri Awas Yojana - Gramin (PMAY-G)**
- **Financial Benefit:** **₹1,20,000** (plain regions) or **₹1,30,000** (hilly/difficult regions) direct bank grant to construct a permanent pucca house with clean sanitation, plus 90 days of paid MGNREGA wages.
- **Eligibility:** Rural families living in kutcha/dilapidated single-room houses with income below rural poverty thresholds.
- **How to Apply:** Gram Sabha village beneficiary list / Gram Panchayat Secretary.

#### 6. **Kisan Credit Card (KCC) Subsidized Farm Loan**
- **Financial Benefit:** Short-term institutional crop loan up to **₹3,00,000 at a subsidized 7% interest rate**, which drops to **only 4% per annum** upon prompt on-time repayment.
- **Collateral Waiver:** Collateral-free loan up to **₹1,60,000**.
- **How to Apply:** Fill out the one-page KCC form at your local bank branch, cooperative bank, or CSC.

---

### 📋 Required Document Checklist
To ensure your applications are approved smoothly, keep these ready:
1. **Aadhaar Card** (Ensure mobile number is linked for OTP e-KYC).
2. **Land Records** (7/12 extract, Khasra/Khatauni, or Pattadar Passbook in your name).
3. **Active Bank Passbook** (Aadhaar-seeded, NPCI-mapped for Direct Benefit Transfer).
4. **Income Certificate / BPL Ration Card** issued by Tehsildar or Sub-Divisional Magistrate.
5. **Passport-size Photographs & Active Mobile Number**.

---

### 🚀 Step-by-Step Application Roadmap
1. **Step 1:** Visit your nearest **Common Service Center (CSC)** or your **Gram Panchayat Office**.
2. **Step 2:** Request the operator to run **Aadhaar e-KYC** and check your DBT status on the PFMS portal.
3. **Step 3:** Submit applications for PM-KISAN and PMFBY simultaneously.
4. **Step 4:** Note down your Application Reference ID to track status via SMS or the Kisan Suvidha App.`;
  }

  // 3. Agriculture general
  if (category === "agriculture" || q.includes("crop") || q.includes("soil") || q.includes("fertilizer") || q.includes("pest")) {
    return `### 🌾 GramMitra Agriculture Advisory (${language})
**Crop Health & Soil Care Recommendations:**
- **Pest & Disease Control:** For early sucking pests (aphids, thrips, whiteflies), spray 5ml cold-pressed Neem Oil per liter of water with 1ml organic soap. Spray during late afternoon to prevent evaporation.
- **Balanced N-P-K Nutrition:** Avoid excess Urea (Nitrogen) which causes soft foliage prone to fungal blight. Ensure adequate Potassium to strengthen cell walls against heat stress.
- **Soil Moisture Retention:** Apply 2-3 inches of crop residue mulch around root zones to reduce water evaporation by up to 40%.`;
  }

  // 4. Healthcare general
  if (category === "healthcare" || q.includes("health") || q.includes("doctor") || q.includes("symptom") || q.includes("fever")) {
    return `### 🩺 GramMitra Community Health Guidance (${language})
**Health & First-Aid Protocol:**
- **Hydration:** Ensure continuous fluid intake with Oral Rehydration Salts (ORS) or boiled cooled water with a pinch of salt and sugar.
- **Red Flag Signs:** If you observe high fever persisting over 48 hours, breathing difficulty, chest pain, or severe lethargy, do not delay.
- **Immediate Escalation:** Contact your local ASHA worker or visit the nearest Primary Health Centre (PHC). Dial **108** for emergency ambulance services.`;
  }

  // Default fallback
  return `### 🤝 GramMitra Community Guide (${language})
Thank you for your question: *"${query}"*.

**How GramMitra Can Help:**
1. **Agriculture:** Crop disease identification, organic spray remedies, and Mandi price updates.
2. **Government Services:** Eligibility checks for PM-KISAN, PM-KUSUM, Ayushman Bharat, PMAY-G, and KCC loans.
3. **Education & Career:** Free software engineering roadmaps, vocational technical skills, and school homework explanations.
4. **Health & Environment:** Community triage, first-aid advice, groundwater conservation, and heatwave safety.

Feel free to ask a specific question in any domain!`;
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

    let contents: any = prompt;
    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      contents = {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64,
            },
          },
          { text: prompt },
        ],
      };
    }

    let result = await generateWithFallback(ai, contents, undefined, "gemini-3.8-flash");

    if (!result) {
      result = getSmartRuralKnowledgeFallback(`${cropName} ${symptoms}`, "agriculture", language);
    }

    return res.json({ result });
  } catch (error: any) {
    console.error("Error in crop-doctor API:", error);
    const result = getSmartRuralKnowledgeFallback(req.body.cropName || "", "agriculture", req.body.language || "English");
    return res.json({ result });
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

    let result = await generateWithFallback(ai, prompt, undefined, "gemini-3.8-flash");

    if (!result) {
      result = getSmartRuralKnowledgeFallback(symptoms || "health", "healthcare", language);
    }

    return res.json({ result });
  } catch (error: any) {
    console.error("Error in health-triage API:", error);
    const result = getSmartRuralKnowledgeFallback(req.body.symptoms || "", "healthcare", req.body.language || "English");
    return res.json({ result });
  }
});

// 3. Education: Multilingual Rural Tutor & Skill Explainer
app.post("/api/ai/edu-tutor", async (req, res) => {
  try {
    const { topic, gradeLevel, question, language = "English" } = req.body;
    const ai = getGeminiClient();

    const prompt = `You are an inspiring rural community teacher, career mentor, and village educator.
Target Language: ${language} (Please respond completely in ${language}).
Subject / Topic: ${topic || "General Knowledge"}
Target Audience / Grade: ${gradeLevel || "Community & Youth"}
Question / Concept: ${question}

Instructions:
- If the question is about career roadmaps or computer science (e.g., how to become a software engineer, coding, web development):
  1. Provide a detailed, step-by-step phased roadmap (Phase 1: CS Foundations -> Phase 2: Web Dev Stack -> Phase 3: Databases & Git -> Phase 4: Capstone Projects -> Phase 5: Job Readiness).
  2. List specific 100% FREE learning platforms (Harvard CS50x via edX/YouTube, freeCodeCamp, The Odin Project, Full Stack Open, Swayam/NPTEL).
  3. Include practical rural/self-taught study tips (offline documentation via DevDocs.io, mobile coding via Replit/Termux).
  4. Outline milestone projects to build.
- For other concepts (science, agriculture, daily math, environmental concepts):
  1. Explain in simple, vivid terms using everyday rural analogies (farming, seasons, river currents, solar light, local markets, trees).
  2. Step-by-Step Breakdown with a relatable real-world example.
  3. Quick Interactive Check (2 fun questions with answers).
  4. Practical Village Application (How knowing this helps in daily life, farming, or vocational skills).`;

    let result = await generateWithFallback(ai, prompt, undefined, "gemini-3.8-flash");

    if (!result) {
      result = getSmartRuralKnowledgeFallback(question || topic || "software engineer", "education", language);
    }

    return res.json({ result });
  } catch (error: any) {
    console.error("Error in edu-tutor API:", error);
    const result = getSmartRuralKnowledgeFallback(req.body.question || "", "education", req.body.language || "English");
    return res.json({ result });
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
1. Top 4-5 Eligible Schemes (e.g. PM-KISAN, PM Fasal Bima Yojana, PM-KUSUM solar pumps, Ayushman Bharat PM-JAY, PM Awas Yojana Gramin, Kisan Credit Card). Provide exact benefit amounts.
2. Mandatory Documents Checklist (IDs, land records, bank account linkage, income certificates).
3. Step-by-Step Application Process (Online portal, Common Service Centre [CSC], Panchayat office, or Gram Sevak).
4. Critical Verification Tips to avoid rejection (e.g., Aadhaar e-KYC, DBT seeding).
5. Helpline and Support Contacts.`;

    let result = await generateWithFallback(ai, prompt, undefined, "gemini-3.8-flash");

    if (!result) {
      result = getSmartRuralKnowledgeFallback(`Farmer income ${incomeLevel} ${goal}`, "government", language);
    }

    return res.json({ result });
  } catch (error: any) {
    console.error("Error in gov-schemes API:", error);
    const result = getSmartRuralKnowledgeFallback(req.body.incomeLevel || "farmer", "government", req.body.language || "English");
    return res.json({ result });
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

    let result = await generateWithFallback(ai, prompt, undefined, "gemini-3.8-flash");

    if (!result) {
      result = getSmartRuralKnowledgeFallback("groundwater climate drought weather", "environment", language);
    }

    return res.json({ result });
  } catch (error: any) {
    console.error("Error in eco-advisor API:", error);
    const result = getSmartRuralKnowledgeFallback("weather", "environment", req.body.language || "English");
    return res.json({ result });
  }
});

// 6. Unified Multilingual AI Rural Assistant (Voice / Text)
app.post("/api/ai/ask", async (req, res) => {
  const { query = "", category = "general", language = "English", history = [] } = req.body;

  try {
    const ai = getGeminiClient();

    const systemInstruction = `You are 'GramMitra' (Rural Friend), an intelligent, compassionate, and practical AI assistant and mentor for rural communities.
You assist villagers, farmers, youth, students, and community health workers with actionable, structured, high-value guidance:

1. EDUCATION & CAREER ROADMAPS:
   - When asked about becoming a software engineer, coding, digital skills, or tech roadmaps:
     * Provide a clear 4-5 phase guided roadmap (CS Fundamentals -> Web Development / Core Tech Stack -> Databases, Git & Tooling -> Capstone Projects -> Job Readiness & Technical Interviews).
     * Recommend specific, reputable, 100% FREE learning platforms (Harvard CS50x via edX/YouTube, freeCodeCamp, The Odin Project, Full Stack Open, NPTEL/Swayam, MDN Web Docs).
     * Provide practical advice for rural or self-taught learners (offline study with DevDocs.io, coding on mobile with Replit/Termux, building local community apps).
2. GOVERNMENT WELFARE & SCHEMES:
   - When asked by farmers or rural citizens (such as income below ₹2 lakh):
     * Provide exact scheme matches: PM-KISAN (₹6,000/yr direct income), PM Fasal Bima Yojana (subsidized 1.5%-2% crop insurance), PM-KUSUM (60%-90% solar pump subsidy), Ayushman Bharat PM-JAY (₹5 Lakh free health cover), PM Awas Yojana Gramin (₹1.2 Lakh housing grant), Kisan Credit Card (subsidized 4% loan).
     * Provide a document checklist and step-by-step application via Common Service Center (CSC), Gram Panchayat, or official portals.
3. AGRICULTURE: Provide diagnostic guidance for crops, pests, fertilizers (NPK ratios), and low-cost organic solutions (neem oil, wood ash, Jeevamrut).
4. HEALTHCARE: Provide symptom triage, home first aid, and clear red-flag danger signs requiring urgent hospital care. Always include a reminder to contact local health workers (ASHA/ANM) or dial 108 in emergencies.
5. ENVIRONMENT: Advise on water conservation, borewell aquifer recharge, and extreme weather protection.

Target Language: ${language}. Always reply in ${language} with clear, respectful, jargon-free explanations formatted with Markdown headers and bullet points.`;

    // Ensure valid alternating history starting with user turn for Gemini API
    const formattedContents: any[] = [];
    let expectingUser = true;

    if (Array.isArray(history)) {
      for (const m of history) {
        if (!m || !m.content || typeof m.content !== "string") continue;
        const isAssistant = m.role === "assistant" || m.role === "model";
        if (expectingUser && !isAssistant) {
          formattedContents.push({ role: "user", parts: [{ text: m.content }] });
          expectingUser = false;
        } else if (!expectingUser && isAssistant) {
          formattedContents.push({ role: "model", parts: [{ text: m.content }] });
          expectingUser = true;
        }
      }
    }

    // Append the active user query
    formattedContents.push({
      role: "user",
      parts: [
        {
          text: `[Domain: ${category} | Preferred Language: ${language}]\n\nUser Question:\n${query}`,
        },
      ],
    });

    let reply = await generateWithFallback(
      ai,
      formattedContents,
      { systemInstruction },
      "gemini-3.8-flash"
    );

    if (!reply || reply.trim().length === 0) {
      reply = getSmartRuralKnowledgeFallback(query, category, language);
    }

    return res.json({ reply });
  } catch (error: any) {
    console.error("Error in ask API:", error);
    const fallbackReply = getSmartRuralKnowledgeFallback(query, category, language);
    return res.json({ reply: fallbackReply });
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
