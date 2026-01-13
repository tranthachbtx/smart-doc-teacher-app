"use server";

import { DEFAULT_LESSON_SYSTEM_PROMPT, MASTER_SYSTEM_INSTRUCTION_V60 } from "@/lib/prompts/system-prompts";
import {
  getMeetingPrompt,
  getEventPrompt,
  getLessonPrompt,
} from "@/lib/prompts/ai-prompts";
import { getAssessmentPrompt } from "@/lib/prompts/assessment-prompts";
import { NCBH_ROLE, NCBH_TASK } from "@/lib/prompts/ncbh-prompts";
import { getKHDHPrompt } from "@/lib/prompts/khdh-prompts";
import { getMeetingMinutesPrompt } from "@/lib/prompts/meeting-prompts";

export interface ActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  content?: string;
}

// --- RESILIENCE: CIRCUIT BREAKER STATE ---
// Stores timestamp of when a key failed to skip it for 10 minutes
const FAILED_KEYS_REGISTRY: Record<string, number> = {};
const CIRCUIT_BREAKER_TIME = 10 * 60 * 1000; // 10 minutes

function isKeyBlocked(key: string): boolean {
  if (!key) return true;
  const lastError = FAILED_KEYS_REGISTRY[key];
  if (!lastError) return false;
  if (Date.now() - lastError > CIRCUIT_BREAKER_TIME) {
    delete FAILED_KEYS_REGISTRY[key]; // Reset after 10 mins
    return false;
  }
  return true;
}

function registerKeyFailure(key: string) {
  if (!key) return;
  FAILED_KEYS_REGISTRY[key] = Date.now();
  console.warn(
    `[CIRCUIT-BREAKER] 🚨 Trip registered for key: ${key.slice(0, 8)}...`
  );
}

// Helper to deep clean API keys
const clean = (k: string | undefined) =>
  k?.trim().replace(/^["']|["']$/g, "") || "";

// HELPER: Sanitize text to remove control chars (fix Error 400)
const sanitize = (text: string | null | undefined) => {
  if (!text) return "";
  // Remove non-printable chars (except newline, return, tab)
  return text
    .toString()
    .replace(/[\x00-\x09\x0B-\x0C\x0E-\x1F\x7F]/g, "")
    .trim();
};

// --- DYNAMIC ROUTING CONFIGURATION v45.0 ---
function getApiConfig(modelName: string) {
  let cleanName = modelName.replace("models/", "");

  // CANONICAL ID MAPPING: Fix 404 on v1 endpoint
  const CANONICAL_MAP: Record<string, string> = {
    "gemini-1.5-flash": "gemini-1.5-flash-001",
    "gemini-1.5-pro": "gemini-1.5-pro-001",
    "gemini-1.0-pro": "gemini-1.0-pro-001",
  };

  if (CANONICAL_MAP[cleanName]) {
    cleanName = CANONICAL_MAP[cleanName];
  }

  // Model 2.0 or Experimental MUST use v1beta
  if (cleanName.includes("2.0") || cleanName.includes("exp")) {
    return {
      version: "v1beta",
      model: `models/${cleanName}`,
    };
  }

  // Stable Models (1.5, 1.0) use v1 with Canonical ID
  return {
    version: "v1",
    model: `models/${cleanName}`,
  };
}

// --- CORE AI CALLER v40.0 (ROBUST MULTI-PROVIDER STRATEGY) ---
export async function callAI(
  prompt: string,
  modelName = "gemini-1.5-flash",
  file?: { mimeType: string; data: string },
  systemContent: string = MASTER_SYSTEM_INSTRUCTION_V60
): Promise<string> {
  const errorLogs: string[] = [];

  // Prepare Payload for Gemini-style APIs
  // Prepare Payload for Gemini-style APIs
  const contentParts: any[] = [{ text: sanitize(prompt) }];

  if (file?.data) {
    contentParts.push({
      inlineData: {
        mimeType: file.mimeType || "application/pdf",
        data: file.data,
      },
    });
  }

  const geminiBody = {
    systemInstruction: {
      parts: [{ text: sanitize(systemContent) }],
    },
    contents: [
      {
        role: "user",
        parts: contentParts,
      },
    ],
    generationConfig: { temperature: 0.85 },
  };

  // 1. STRATEGY: PROXY (With Circuit Breaker & Key Forwarding)
  const proxyUrl = clean(process.env.GEMINI_PROXY_URL);
  const geminiKeysForProxy = [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
  ]
    .map((k) => clean(k))
    .filter((k) => k.length > 5 && !isKeyBlocked(k));

  if (
    proxyUrl &&
    !proxyUrl.includes("example.com") &&
    !isKeyBlocked(proxyUrl) &&
    geminiKeysForProxy.length > 0
  ) {
    const { version, model } = getApiConfig(modelName);
    const shuffledProxyKeys = [...geminiKeysForProxy].sort(
      () => Math.random() - 0.5
    );

    for (const key of shuffledProxyKeys) {
      try {
        const url = `${proxyUrl.startsWith("http") ? "" : "https://"
          }${proxyUrl.replace(
            /\/$/,
            ""
          )}/${version}/${model}:generateContent?key=${key}`;

        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(geminiBody),
          signal: AbortSignal.timeout(90000),
        });

        const data = await response.json().catch(() => ({}));

        if (response.ok) {
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) return text;
        } else {
          const errMsg = data.error?.message || "";
          // 429 Limit 0 Detection
          if (response.status === 429 && errMsg.includes("limit: 0")) {
            errorLogs.push(
              `💳 Lỗi 429: Bạn chưa liên kết thẻ VISA vào Google Cloud cho Key ${key.slice(
                0,
                5
              )}...`
            );
            registerKeyFailure(key);
          } else if (response.status === 403) {
            errorLogs.push(
              `🌏 Lỗi 403: Chặn vùng địa lý (Geo-block). Hãy dùng AI Gateway.`
            );
            registerKeyFailure(key);
          } else if (response.status === 404) {
            // Keep trying next model in pool if 404
            errorLogs.push(`Model ${model} not found on ${version}`);
          } else {
            if (response.status >= 400) registerKeyFailure(key);
            errorLogs.push(
              `Proxy ${response.status}: ${errMsg || "Unknown error"}`
            );
          }
        }
      } catch (e: any) {
        errorLogs.push(`Proxy Ex: ${e.message}`);
        registerKeyFailure(proxyUrl);
        break;
      }
    }
  }

  // 2. STRATEGY: GEMINI ROTATION (Free Tier - Randomized & Balanced)
  let geminiKeys = [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
  ]
    .map((k) => clean(k))
    .filter((k) => k.length > 5);

  geminiKeys = geminiKeys
    .filter((k) => !isKeyBlocked(k))
    .sort(() => Math.random() - 0.5);

  if (geminiKeys.length === 0)
    console.warn("[AI-RELAY] ⚠️ All Gemini keys blocked.");

  // EXPANDED MODEL POOL FOR FALLBACK (Fix 404)
  const modelFallbackPool = [
    modelName,
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-2.0-flash-exp",
    "gemini-1.5-pro",
  ];

  for (const key of geminiKeys) {
    // Try each model in the fallback pool for this key
    for (const currentModel of modelFallbackPool) {
      try {
        const { version, model } = getApiConfig(currentModel);
        const url = `https://generativelanguage.googleapis.com/${version}/${model}:generateContent?key=${key}`;

        const resp = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(geminiBody),
          signal: AbortSignal.timeout(90000),
        });

        const data = await resp.json().catch(() => ({}));

        if (resp.ok) {
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) return text;
        } else {
          const errMsg = data.error?.message || "";
          if (resp.status === 429 && errMsg.includes("limit: 0")) {
            errorLogs.push(
              `💳 Lỗi 429: Bạn cần liên kết thẻ VISA để mở khóa Key ${key.slice(
                0,
                5
              )}...`
            );
            registerKeyFailure(key);
            break; // Skip models for this key
          }
          if (resp.status === 403 || resp.status === 429) {
            registerKeyFailure(key);
            break;
          }
          errorLogs.push(`Gemini ${resp.status}: ${model}@${version}`);
        }
      } catch (e: any) {
        errorLogs.push(`Gemini Ex: ${e.message}`);
        break; // Connection error, try next key
      }
    }
  }

  // 3. STRATEGY: GROQ FALLBACK (Stable Free Backup)
  const groqKey = clean(process.env.GROQ_API_KEY);
  if (groqKey && !isKeyBlocked(groqKey)) {
    try {
      const resp = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: systemContent },
              { role: "user", content: prompt },
            ],
            temperature: 0.7,
          }),
          signal: AbortSignal.timeout(90000),
        }
      );
      if (resp.ok) {
        const data = await resp.json();
        return data.choices[0].message.content || "";
      } else if (resp.status === 429) {
        registerKeyFailure(groqKey);
      }
    } catch (e: any) {
      errorLogs.push(`Groq: ${e.message}`);
    }
  }

  // 4. STRATEGY: OPENAI FALLBACK (Last Resort)
  const openAIKey = clean(process.env.OPENAI_API_KEY);
  if (openAIKey && !isKeyBlocked(openAIKey)) {
    try {
      const resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openAIKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemContent },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
        }),
        signal: AbortSignal.timeout(90000),
      });
      if (resp.ok) {
        const data = await resp.json();
        return data.choices[0].message.content || "";
      } else if (resp.status === 401 || resp.status === 429) {
        registerKeyFailure(openAIKey);
      }
    } catch (e: any) {
      errorLogs.push(`OpenAI: ${e.message}`);
    }
  }

  throw new Error(`ALL_AI_PROVIDERS_EXHAUSTED: ${errorLogs.join(" | ")}`);
}

// --- API WRAPPERS ---

/**
 * ROBUST JSON PARSER: Extracts JSON object even if wrapped in Markdown or chat text.
 * 🧠 SMART JSON PARSER v52.0 (DEEP SANITIZATION)
 * Giải quyết triệt để lỗi "Bad control character in string literal".
 */
export async function generateAIContent(
  prompt: string,
  modelName = "gemini-2.0-flash",
  type: "meeting" | "event" | "ncbh" | "lesson" = "lesson",
  file?: any
): Promise<ActionResult<any>> {
  try {
    console.log(`[DEEP_TRACE:1_INPUT] Type: ${type}, Prompt Length: ${prompt.length}, File present: ${!!file}`);
    const text = await callAI(prompt, modelName, file);
    console.log(`[DEEP_TRACE:2_AI_RESPOND] Response Length: ${text.length}`);

    // Fail Fast: if text is empty or too short
    if (!text || text.length < 50) {
      throw new Error(`AI_RESPONSE_TOO_SHORT: Only received ${text?.length || 0} characters.`);
    }

    const data = type === "event" ? parseHybridJSON(text) : parseSmartJSON(text);

    // Fail Loud: Audit keys
    const keys = Object.keys(data);
    console.log(`[DEEP_TRACE:3_PARSED] Keys found: ${keys.join(", ")}`);

    return { success: true, data };
  } catch (e: any) {
    console.error(`[DEEP_TRACE:FATAL] ${e.message}`);
    return { success: false, error: e.message };
  }
}

/**
 * 🧠 SMART JSON PARSER v60.1
 * Tự động sửa lỗi kịch bản và biểu thức toán học.
 */
function parseSmartJSON(text: string): any {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```json\s*/g, "").replace(/```\s*$/g, "").trim();

  const firstOpen = cleaned.indexOf("{");
  const lastClose = cleaned.lastIndexOf("}");

  if (firstOpen !== -1 && lastClose !== -1 && lastClose > firstOpen) {
    cleaned = cleaned.substring(firstOpen, lastClose + 1);
  } else {
    throw new Error("Không tìm thấy khối JSON { } trong phản hồi từ AI.");
  }

  try {
    return JSON.parse(cleaned);
  } catch (e1) {
    console.warn("[SmartJSON] Thử nghiệm Deep Sanitization...");
    let healed = cleaned
      .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g, "")
      .replace(/,\s*}/g, "}")
      .replace(/,\s*]/g, "]")
      .replace(/:\s*(\d+\s*[\*\+\-\/]\s*[\d\s\*\+\-\/]+)([,}\]])/g, ': "$1"$2');

    let finalJson = "";
    try {
      const parts = healed.split(/("(?:\\.|[^"])*")/g);
      const sanitiedParts = parts.map((part) => {
        if (part.startsWith('"') && part.endsWith('"')) {
          return part.replace(/\n/g, "\\n").replace(/\r/g, "\\r");
        }
        return part;
      });
      finalJson = sanitiedParts.join("");
      return JSON.parse(finalJson);
    } catch (e2: any) {
      const posMatch = e2.message.match(/position (\d+)/);
      if (posMatch) {
        const pos = parseInt(posMatch[1]);
        const start = Math.max(0, pos - 40);
        const end = Math.min(finalJson.length, pos + 40);
        console.error(`[DEEP_TRACE:4_REPORT] Lỗi JSON tại vị trí ${pos}: ...${finalJson.substring(start, end)}...`);
      }
      throw new Error(`JSON_PARSE_FAILED: ${e2.message}`);
    }
  }
}

/**
 * 🥪 HYBRID-SANDWICH PARSER v60.1
 * Phân tách kịch bản Markdown Structured.
 */
function parseHybridJSON(text: string): any {
  let finalData: any = {};
  try {
    // 1. Extract Metadata JSON
    const jsonPatterns = [
      /@@@META_JSON_START@@@([\s\S]*?)@@@META_JSON_END@@@/,
      /@@@META_START@@@([\s\S]*?)@@@META_END@@@/, // Backward compatibility
      /\{[\s\S]*?"theme"[\s\S]*?\}/
    ];
    let jsonRaw = "";
    for (const pattern of jsonPatterns) {
      const match = text.match(pattern);
      if (match) {
        jsonRaw = match[1] || match[0];
        break;
      }
    }

    if (jsonRaw) {
      try { finalData = parseSmartJSON(jsonRaw); } catch (e) { }
    }

    // 2. Extract Markdown Sections based on v60.0 markers
    const sectionMarkers = [
      { tag: "### SECTION: MUCTIEU", field: "muc_dich_yeu_cau" },
      { tag: "### SECTION: NANGLUC_PHAMCHAT", field: "nang_luc" },
      { tag: "### SECTION: LOGISTICS", field: "kinh_phi" },
      { tag: "### SECTION: CHUANBI", field: "chuan_bi" },
      { tag: "### SECTION: KICHBAN", field: "kich_ban_chi_tiet" },
      { tag: "### SECTION: THONGDIEP", field: "thong_diep_ket_thuc" }
    ];

    sectionMarkers.forEach((marker, index) => {
      const startIdx = text.indexOf(marker.tag);
      if (startIdx !== -1) {
        const contentStart = startIdx + marker.tag.length;
        let contentEnd = text.length;

        // Find the next marker
        let nearestNext = text.length;
        sectionMarkers.forEach((m) => {
          const nextIdx = text.indexOf(m.tag, contentStart);
          if (nextIdx !== -1 && nextIdx < nearestNext) {
            nearestNext = nextIdx;
          }
        });
        contentEnd = nearestNext;

        finalData[marker.field] = text.substring(contentStart, contentEnd).trim();
      }
    });

    if (finalData.kich_ban_chi_tiet) {
      finalData.kich_ban_chi_tiet = finalData.kich_ban_chi_tiet.replace(/^\s*\([\s\S]*?\)\s*/, "").trim();
    }

    return finalData;
  } catch (e) {
    return finalData || {};
  }
}


/**
 * CRITICAL: Fixed signature for extractTextFromFile (matching legacy calls)
 */
export async function extractTextFromFile(
  file: { mimeType: string; data: string },
  prompt: string
): Promise<ActionResult<string>> {
  return generateAIContent(prompt, "gemini-2.0-flash", "lesson", file);
}

export async function generateLesson(
  ...args: any[]
): Promise<ActionResult<any>> {
  return {
    success: false,
    error: "Legacy generateLesson is disabled. Use Manual Hub.",
  };
}

// Fixed Stubs to match TemplateEngineV2.tsx requirements
export async function generateLessonPlan(
  grade: string,
  topic: string,
  duration: string,
  customInstructions: string,
  tasks: string[],
  chuDeSo?: string,
  suggestions?: string,
  file?: { mimeType: string; data: string },
  modelName = "gemini-2.0-flash"
): Promise<ActionResult<any>> {
  let prompt = "";
  try {
    // For Lesson Plan, we use the specialized wrapper in ai-prompts that handles KHDH logic
    const activitySuggestions = JSON.parse(suggestions || "{}");
    const sectionRequirements = `
YÊU CẦU CHO PHẦN THIẾT KẾ: TOÀN BÀI
Ngữ cảnh hiện tại: Thiết kế bài dạy mới
Hướng dẫn chi tiết: ${customInstructions || "Thiết kế sư phạm cao cấp theo chuẩn 5512"
      }
`;
    // We construct the prompt manually using getKHDHPrompt equivalent or the wrapper
    // Actually, getLessonPrompt in ai-prompts is designed for sections.
    // Here we need a full lesson prompt. Let's use the one imported from ai-prompts/khdh-prompts via getKHDHPrompt
    // Re-importing getKHDHPrompt here locally to be safe
    const { getKHDHPrompt } = await import("@/lib/prompts/khdh-prompts");

    prompt = getKHDHPrompt(
      grade,
      topic,
      duration,
      sectionRequirements,
      tasks.map((t) => ({ name: t, description: "" })),
      chuDeSo ? Number(chuDeSo) : undefined,
      activitySuggestions,
      !!file
    );

    const text = await callAI(prompt, modelName, file);
    const data = parseSmartJSON(text);
    return { success: true, data };
  } catch (e: any) {
    return { success: false, error: e.message, content: prompt };
  }
}

export async function genMtgMinutes(
  month?: string,
  session?: string,
  keyContent?: string,
  conclusion?: string,
  modelName = "gemini-2.0-flash"
): Promise<ActionResult<any>> {
  let prompt = "";
  try {
    // DIRECT USE of meeting-prompts.ts
    // We pass placeholder values for currentThemes/nextThemes if not provided, allowing AI to hallucinate based on month/grade logic internally
    prompt = getMeetingMinutesPrompt(
      month || "9",
      session || "1",
      keyContent || "",
      "", // currentThemes (will be auto-filled by prompt logic if empty)
      "", // nextThemes
      "" // nextMonth
    );

    // SIMPLE SYSTEM PROMPT FOR MEETING
    const meetingSystemPrompt = `ROLE: Professional Secretary.TASK: Create meeting minutes.OUTPUT: Valid JSON.LANGUAGE: Vietnamese.`;

    const text = await callAI(
      prompt,
      modelName,
      undefined,
      meetingSystemPrompt
    );
    const data = parseSmartJSON(text);
    return { success: true, data };
  } catch (e: any) {
    return { success: false, error: e.message, content: prompt };
  }
}

export async function generateEventScript(
  grade: string,
  topic: string,
  instructions?: string,
  budget?: string,
  checklist?: string,
  evaluation?: string,
  modelName = "gemini-2.0-flash",
  month?: number,
  duration: string = "45"
): Promise<ActionResult<any>> {
  console.log(
    `[EVENT_DIRECTOR_V55] 🚀 Master Prompt v55.0 Activated - Khối: ${grade}, Thời lượng: ${duration} p`
  );

  let eventPrompt = "";
  try {
    eventPrompt = getEventPrompt(
      grade,
      topic,
      month,
      instructions,
      budget,
      checklist,
      duration
    );

    // SYSTEM PROMPT ĐỊA PHƯƠNG HÓA VÀ CHỐNG SÁO RỖNG (v60.0 Master)
    const eventSystemPrompt = MASTER_SYSTEM_INSTRUCTION_V60;

    const text = await callAI(eventPrompt, modelName, undefined, eventSystemPrompt);
    console.log(`[DEEP_TRACE:2_FLOW] Response length: ${text.length} chars`);

    const data = parseHybridJSON(text);
    return { success: true, data };
  } catch (e: any) {
    console.error("[EVENT_DIRECTOR_V55] ❌ THẤT BẠI:", e);
    return { success: false, error: e.message, content: eventPrompt };
  }
}

export async function generateNCBHAction(
  grade: string,
  topic: string,
  instructions?: string,
  modelName = "gemini-2.0-flash"
): Promise<ActionResult<any>> {
  let prompt = "";
  try {
    // DIRECT USE of ncbh-prompts.ts
    prompt = `${NCBH_ROLE} \n\n${NCBH_TASK} \n\nKHỐI: ${grade} \nCHỦ ĐỀ: ${topic} \nHƯỚNG DẪN: ${instructions || ""
      } `;

    // SYSTEM PROMPT FOR NCBH
    const ncbhSystemPrompt = `ROLE: Lesson Study Expert.TASK: Analyze learning process.OUTPUT: Valid JSON.LANGUAGE: Vietnamese.`;

    const text = await callAI(prompt, modelName, undefined, ncbhSystemPrompt);
    const data = parseSmartJSON(text);
    return { success: true, data };
  } catch (e: any) {
    return { success: false, error: e.message, content: prompt };
  }
}

export async function generateAssessmentPlan(
  grade: string,
  term: string,
  productType: string,
  topic: string,
  modelName = "gemini-2.0-flash"
): Promise<ActionResult<any>> {
  let prompt = "";
  try {
    // DIRECT USE of assessment-prompts.ts
    prompt = getAssessmentPrompt(grade, term, productType, topic);

    // SYSTEM PROMPT FOR ASSESSMENT (Focus on measurement & evaluation)
    const assessmentSystemPrompt = `ROLE: Educational Assessment Expert.TASK: Design Rubrics & Evaluation Plan.OUTPUT: Valid JSON.LANGUAGE: Vietnamese.`;

    const text = await callAI(
      prompt,
      modelName,
      undefined,
      assessmentSystemPrompt
    );
    const data = parseSmartJSON(text);
    return { success: true, data };
  } catch (e: any) {
    return { success: false, error: e.message, content: prompt };
  }
}

export async function auditLessonPlan(
  lessonResult: any
): Promise<ActionResult<any>> {
  // audit logic is typically handled by performAdvancedAudit but we'll provide a wrapper
  const { performAdvancedAudit } = await import("./advanced-audit");
  const result = await performAdvancedAudit(lessonResult);
  return { success: result.success, data: result.report, error: result.error };
}

export async function generateLessonSection(
  grade: string,
  topic: string,
  section: string,
  context: string,
  duration?: string,
  customInstructions?: string,
  tasks?: string[],
  chuDeSo?: string,
  suggestions?: string,
  modelName = "gemini-2.0-flash",
  file?: { mimeType: string; data: string },
  stepInstruction?: string
): Promise<ActionResult<any>> {
  let prompt = "";
  try {
    const activitySuggestions = JSON.parse(suggestions || "{}");
    // DIRECT USE of ai-prompts wrapper for sections
    prompt = getLessonPrompt(
      section as any,
      grade,
      topic,
      duration || "45 phút",
      context,
      customInstructions || "",
      tasks || [],
      chuDeSo,
      activitySuggestions,
      stepInstruction
    );
    const text = await callAI(prompt, modelName, file);
    const data = parseSmartJSON(text);
    return { success: true, data };
  } catch (e: any) {
    return { success: false, error: e.message, content: prompt };
  }
}

export async function onRefineSection(
  ...args: any[]
): Promise<ActionResult<any>> {
  return { success: false, error: "Feature currently unavailable." };
}

export async function checkApiKeyStatus() {
  return { configured: !!process.env.GEMINI_API_KEY };
}
