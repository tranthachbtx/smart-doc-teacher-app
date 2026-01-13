"use server";

import { DEFAULT_LESSON_SYSTEM_PROMPT } from "@/lib/prompts/system-prompts";
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
  systemContent: string = DEFAULT_LESSON_SYSTEM_PROMPT
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
 */
/**
 * 🧠 SMART JSON PARSER v52.0 (DEEP SANITIZATION)
 * Giải quyết triệt để lỗi "Bad control character in string literal".
 */
function parseSmartJSON(text: string): any {
  let cleaned = text.trim();

  // 1. Gỡ bỏ Markdown Code Blocks
  cleaned = cleaned.replace(/^```json\s*/g, "").replace(/```\s*$/g, "").trim();

  // 2. Tìm khối JSON đầu tiên { ... }
  const firstOpen = cleaned.indexOf("{");
  const lastClose = cleaned.lastIndexOf("}");

  if (firstOpen !== -1 && lastClose !== -1 && lastClose > firstOpen) {
    cleaned = cleaned.substring(firstOpen, lastClose + 1);
  } else {
    throw new Error("Không tìm thấy khối JSON { } trong phản hồi từ AI.");
  }

  try {
    // Thử parse bản gốc
    return JSON.parse(cleaned);
  } catch (e1: any) {
    console.warn("[SmartJSON] Thử nghiệm Deep Sanitization...");

    try {
      /**
       * 🩺 BÁC SĨ JSON: Xử lý ký tự điều khiển lỗi
       * AI thường để nguyên dấu xuống dòng (0x0A) hoặc Tab trong chuỗi JSON.
       * Chúng ta sẽ quét qua nội dung và thay thế chúng một cách an toàn.
       */
      let healed = cleaned
        // Gỡ bỏ các ký tự điều khiển thực sự nguy hiểm (TAB, NULL, v.v. trừ xuống dòng)
        .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g, "")
        // Gỡ dấu phẩy dư thừa
        .replace(/,\s*}/g, "}")
        .replace(/,\s*]/g, "]");

      /**
       * Kỹ thuật "Phẫu thuật chuỗi": 
       * Tìm tất cả các giá trị nằm giữa dấu ngoặc kép và thay thế xuống dòng thực bằng \n
       */
      const parts = healed.split(/("(?:\\.|[^"])*")/g);
      const sanitiedParts = parts.map(part => {
        if (part.startsWith('"') && part.endsWith('"')) {
          // Đây là một chuỗi JSON (hoặc key/value)
          // Escape các dấu xuống dòng thực nằm TRONG chuỗi
          return part.replace(/\n/g, "\\n").replace(/\r/g, "\\r");
        }
        return part;
      });

      const finalJson = sanitiedParts.join("");
      return JSON.parse(finalJson);
    } catch (e2: any) {
      console.error("[DEEP_TRACE:4_REPORT] 🚨 CRITICAL PARSE FAILURE");

      // Tìm vị trí lỗi để báo cáo
      const posMatch = e2.message.match(/position (\d+)/);
      if (posMatch) {
        const pos = parseInt(posMatch[1]);
        const snippet = cleaned.substring(Math.max(0, pos - 50), Math.min(cleaned.length, pos + 50));
        console.error(`[DEEP_TRACE:4_REPORT] Đoạn mã lỗi tại vĩ độ ${pos}: "...${snippet}..."`);
      }

      throw new Error(`Cấu trúc kịch bản quá phức tạp khiến AI bị lỗi định dạng: ${e2.message}`);
    }
  }
}

/**
 * 🥪 HYBRID-SANDWICH PARSER v35.0
 * Tách biệt JSON cấu trúc và Kịch bản văn bản thô.
 * Giải quyết triệt để lỗi vỡ JSON khi có nội dung dài.
 */
function parseHybridJSON(text: string): any {
  try {
    let finalData: any = {};
    let scriptContent = "";

    // 1. Trích xuất phần JSON (Metadata)
    const jsonMatch = text.match(/\[PHẦN_1_JSON\]([\s\S]*?)\[\/PHẦN_1_JSON\]/);
    if (jsonMatch && jsonMatch[1]) {
      finalData = JSON.parse(jsonMatch[1].trim());
    } else {
      // Fallback: Tìm khối JSON đầu tiên nếu AI quên tag
      const firstOpen = text.indexOf("{");
      const lastClose = text.lastIndexOf("}");
      if (firstOpen !== -1 && lastClose !== -1) {
        finalData = JSON.parse(text.substring(firstOpen, lastClose + 1));
      }
    }

    // 2. Trích xuất phần Kịch bản (Raw Text)
    const scriptMatch = text.match(/\[PHẦN_2_KICH_BAN_CHI_TIET\]([\s\S]*?)\[\/PHẦN_2_KICH_BAN_CHI_TIET\]/);
    if (scriptMatch && scriptMatch[1]) {
      scriptContent = scriptMatch[1].trim();
    } else {
      // Fallback: Lấy phần text sau tag đóng JSON
      const splitParts = text.split("[/PHẦN_1_JSON]");
      if (splitParts.length > 1) {
        scriptContent = splitParts[1]
          .replace(/\[PHẦN_2_KICH_BAN_CHI_TIET\]/g, "")
          .replace(/\[\/PHẦN_2_KICH_BAN_CHI_TIET\]/g, "")
          .trim();
      }
    }

    // Gỡ bỏ các dòng hướng dẫn trong ngoặc đơn ở đầu (AI thường tự thêm vào)
    scriptContent = scriptContent.replace(/^\s*\([\s\S]*?\)\s*/, "").trim();

    // 3. MERGE
    return {
      ...finalData,
      kich_ban_chi_tiet: scriptContent
    };
  } catch (e: any) {
    console.error("[HYBRID_PARSER] Lỗi nghiêm trọng:", e.message);
    // Fallback sang parseSmartJSON nếu hybrid fail
    return parseSmartJSON(text);
  }
}

/**
 * Compatibility wrapper for generateAIContent
 */
export async function generateAIContent(
  prompt: string,
  modelName = "gemini-2.0-flash",
  type: "meeting" | "event" | "ncbh" | "lesson" = "lesson",
  file?: any
): Promise<ActionResult<any>> {
  try {
    const text = await callAI(prompt, modelName, file);
    const data = type === "event" ? parseHybridJSON(text) : parseSmartJSON(text);
    return { success: true, data };
  } catch (e: any) {
    return { success: false, error: e.message };
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

export async function generateMeetingMinutes(
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
    const meetingSystemPrompt = `ROLE: Professional Secretary. TASK: Create meeting minutes. OUTPUT: Valid JSON. LANGUAGE: Vietnamese.`;

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
    `[EVENT_DIRECTOR_V52] 🚀 Khởi động Đạo diễn Sự kiện (v52.0) - Khối: ${grade}, Thời lượng: ${duration}p`
  );
  if (month) console.log(`[EVENT_DIRECTOR_V52] 📅 Tháng thực hiện: ${month}`);

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

    // AUDIT: Xác nhận kích hoạt mode Scripting chuyên sâu
    if (eventPrompt.includes("Master Event Director")) {
      console.log(
        "[EVENT_DIRECTOR_V62] ✅ Hệ thống Master Prompt v62.0 (Direct-Injection) đã kích hoạt."
      );
    }

    // SYSTEM PROMPT ĐỊA PHƯƠNG HÓA VÀ CHỐNG SÁO RỖNG
    const eventSystemPrompt = `BẠN LÀ BẬC THẦY ĐẠO DIỄN SỰ KIỆN & CHUYÊN GIA SƯ PHẠM (Master Architect v65.0).
YÊU CẦU CỐT LÕI: 
1. CHỐNG SÁO RỖNG: Mục tiêu phải là HÀNH VI CỤ THỂ (Verbs + Content + Context). Không dùng từ khóa rỗng nếu không có hoạt động minh chứng.
2. LOGIC SƯ PHẠM: Tranh biện/Diễn đàn phải có chiều sâu, lập luận sắc bén, không phản giáo dục.
3. VĂN PHONG BẢN ĐỊA: Lời thoại MC phải đậm chất học đường Việt Nam, hào hứng, tự nhiên. Tuyệt đối không dùng văn phong dịch thuật ("Chào mọi người", "Mình rất vui").
4. ĐỊA PHƯƠNG HÓA 100%: Gắn chặt với bối cảnh Mũi Né (Biển, rác thải đại dương, du lịch, làng chài).
SẢN PHẨM: Kịch bản ngoại khóa SIÊU CHI TIẾT (>2000 từ). Trả về JSON chuẩn.`;

    const text = await callAI(eventPrompt, modelName, undefined, eventSystemPrompt);
    console.log(`[DEEP_TRACE:2_FLOW] Gemini raw response length: ${text.length} chars`);

    const data = parseHybridJSON(text);
    console.log(`[DEEP_TRACE:2_FLOW] Parsed Data keys: ${Object.keys(data).join(", ")}`);
    console.log(`[DEEP_TRACE:3_LOGIC] doi_tuong value: "${data.doi_tuong}"`);

    return { success: true, data };
  } catch (e: any) {
    console.error("[EVENT_DIRECTOR_V52_HYBRID] ❌ THẤT BẠI:", e);
    return { success: false, error: e.message, content: eventPrompt };
  }
}

export async function generateNCBH(
  grade: string,
  topic: string,
  instructions?: string,
  modelName = "gemini-2.0-flash"
): Promise<ActionResult<any>> {
  let prompt = "";
  try {
    // DIRECT USE of ncbh-prompts.ts
    prompt = `${NCBH_ROLE}\n\n${NCBH_TASK}\n\nKHỐI: ${grade}\nCHỦ ĐỀ: ${topic}\nHƯỚNG DẪN: ${instructions || ""
      }`;

    // SYSTEM PROMPT FOR NCBH
    const ncbhSystemPrompt = `ROLE: Lesson Study Expert. TASK: Analyze learning process. OUTPUT: Valid JSON. LANGUAGE: Vietnamese.`;

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
    const assessmentSystemPrompt = `ROLE: Educational Assessment Expert. TASK: Design Rubrics & Evaluation Plan. OUTPUT: Valid JSON. LANGUAGE: Vietnamese.`;

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
