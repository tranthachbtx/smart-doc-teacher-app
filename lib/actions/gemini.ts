"use server";

import { DEFAULT_LESSON_SYSTEM_PROMPT } from "@/lib/prompts/system-prompts";
import {
  getMeetingPrompt,
  getEventPrompt,
  getLessonPrompt
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
  console.warn(`[CIRCUIT-BREAKER] 🚨 Trip registered for key: ${key.slice(0, 8)}...`);
}

// Helper to deep clean API keys
const clean = (k: string | undefined) => k?.trim().replace(/^["']|["']$/g, '') || "";

// --- DYNAMIC ROUTING CONFIGURATION v45.0 ---
function getApiConfig(modelName: string) {
  let cleanName = modelName.replace("models/", "");

  // CANONICAL ID MAPPING: Fix 404 on v1 endpoint
  const CANONICAL_MAP: Record<string, string> = {
    "gemini-1.5-flash": "gemini-1.5-flash-001",
    "gemini-1.5-pro": "gemini-1.5-pro-001",
    "gemini-1.0-pro": "gemini-1.0-pro-001"
  };

  if (CANONICAL_MAP[cleanName]) {
    cleanName = CANONICAL_MAP[cleanName];
  }

  // Model 2.0 or Experimental MUST use v1beta
  if (cleanName.includes("2.0") || cleanName.includes("exp")) {
    return {
      version: "v1beta",
      model: `models/${cleanName}`
    };
  }

  // Stable Models (1.5, 1.0) use v1 with Canonical ID
  return {
    version: "v1",
    model: `models/${cleanName}`
  };
}

// --- CORE AI CALLER v40.0 (ROBUST MULTI-PROVIDER STRATEGY) ---
export async function callAI(
  prompt: string,
  modelName = "gemini-1.5-flash",
  file?: { mimeType: string, data: string },
  systemContent: string = DEFAULT_LESSON_SYSTEM_PROMPT
): Promise<string> {
  const errorLogs: string[] = [];

  // Prepare Payload for Gemini-style APIs
  const geminiBody = {
    contents: [{
      parts: [
        { text: `${systemContent}\n\nPROMPT:\n${prompt}` },
        ...(file?.data ? [{ inlineData: { mimeType: file.mimeType || "application/pdf", data: file.data } }] : [])
      ]
    }],
    generationConfig: { temperature: 0.85, maxOutputTokens: 8192 }
  };

  // 1. STRATEGY: PROXY (With Circuit Breaker & Key Forwarding)
  const proxyUrl = clean(process.env.GEMINI_PROXY_URL);
  const geminiKeysForProxy = [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3
  ].map(k => clean(k)).filter(k => k.length > 5 && !isKeyBlocked(k));

  if (proxyUrl && !proxyUrl.includes("example.com") && !isKeyBlocked(proxyUrl) && geminiKeysForProxy.length > 0) {
    const { version, model } = getApiConfig(modelName);
    const shuffledProxyKeys = [...geminiKeysForProxy].sort(() => Math.random() - 0.5);

    for (const key of shuffledProxyKeys) {
      try {
        const url = `${proxyUrl.startsWith('http') ? '' : 'https://'}${proxyUrl.replace(/\/$/, '')}/${version}/${model}:generateContent?key=${key}`;

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(geminiBody),
          signal: AbortSignal.timeout(20000)
        });

        const data = await response.json().catch(() => ({}));

        if (response.ok) {
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) return text;
        } else {
          const errMsg = data.error?.message || "";
          // 429 Limit 0 Detection
          if (response.status === 429 && errMsg.includes("limit: 0")) {
            errorLogs.push(`💳 Lỗi 429: Bạn chưa liên kết thẻ VISA vào Google Cloud cho Key ${key.slice(0, 5)}...`);
            registerKeyFailure(key);
          } else if (response.status === 403) {
            errorLogs.push(`🌏 Lỗi 403: Chặn vùng địa lý (Geo-block). Hãy dùng AI Gateway.`);
            registerKeyFailure(key);
          } else if (response.status === 404) {
            // Keep trying next model in pool if 404
            errorLogs.push(`Model ${model} not found on ${version}`);
          } else {
            if (response.status >= 400) registerKeyFailure(key);
            errorLogs.push(`Proxy ${response.status}: ${errMsg || 'Unknown error'}`);
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
    process.env.GEMINI_API_KEY_3
  ].map(k => clean(k)).filter(k => k.length > 5);

  geminiKeys = geminiKeys.filter(k => !isKeyBlocked(k)).sort(() => Math.random() - 0.5);

  if (geminiKeys.length === 0) console.warn("[AI-RELAY] ⚠️ All Gemini keys blocked.");

  // EXPANDED MODEL POOL FOR FALLBACK (Fix 404)
  const modelFallbackPool = [
    modelName,
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-2.0-flash-exp",
    "gemini-1.5-pro"
  ];

  for (const key of geminiKeys) {
    // Try each model in the fallback pool for this key
    for (const currentModel of modelFallbackPool) {
      try {
        const { version, model } = getApiConfig(currentModel);
        const url = `https://generativelanguage.googleapis.com/${version}/${model}:generateContent?key=${key}`;

        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(geminiBody),
          signal: AbortSignal.timeout(15000)
        });

        const data = await resp.json().catch(() => ({}));

        if (resp.ok) {
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) return text;
        } else {
          const errMsg = data.error?.message || "";
          if (resp.status === 429 && errMsg.includes("limit: 0")) {
            errorLogs.push(`💳 Lỗi 429: Bạn cần liên kết thẻ VISA để mở khóa Key ${key.slice(0, 5)}...`);
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
      const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${groqKey}` },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemContent },
            { role: "user", content: prompt }
          ],
          temperature: 0.7
        }),
        signal: AbortSignal.timeout(25000)
      });
      if (resp.ok) {
        const data = await resp.json();
        return data.choices[0].message.content || "";
      } else if (resp.status === 429) {
        registerKeyFailure(groqKey);
      }
    } catch (e: any) { errorLogs.push(`Groq: ${e.message}`); }
  }

  // 4. STRATEGY: OPENAI FALLBACK (Last Resort)
  const openAIKey = clean(process.env.OPENAI_API_KEY);
  if (openAIKey && !isKeyBlocked(openAIKey)) {
    try {
      const resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${openAIKey}` },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "system", content: systemContent }, { role: "user", content: prompt }],
          temperature: 0.7
        }),
        signal: AbortSignal.timeout(25000)
      });
      if (resp.ok) {
        const data = await resp.json();
        return data.choices[0].message.content || "";
      } else if (resp.status === 401 || resp.status === 429) {
        registerKeyFailure(openAIKey);
      }
    } catch (e: any) { errorLogs.push(`OpenAI: ${e.message}`); }
  }

  throw new Error(`ALL_AI_PROVIDERS_EXHAUSTED: ${errorLogs.join(' | ')}`);
}

// --- API WRAPPERS ---

/**
 * ROBUST JSON PARSER: Extracts JSON object even if wrapped in Markdown or chat text.
 */
function parseSmartJSON(text: string): any {
  try {
    // 1. Try removing Markdown code blocks
    let cleanText = text.replace(/```json\s*/g, "").replace(/```\s*$/g, "").trim();

    // 2. Find first '{' and last '}'
    const firstOpen = cleanText.indexOf('{');
    const lastClose = cleanText.lastIndexOf('}');

    if (firstOpen !== -1 && lastClose !== -1 && lastClose > firstOpen) {
      cleanText = cleanText.substring(firstOpen, lastClose + 1);
      return JSON.parse(cleanText);
    }

    // 3. Last ditch: Fallback to simple parse (might throw)
    return JSON.parse(text);
  } catch (e) {
    console.error("[SmartJSON] Parsing failed. Raw text:", text.substring(0, 100) + "...");
    throw new Error("AI returned text but it wasn't valid JSON.");
  }
}

/**
 * Compatibility wrapper for generateAIContent
 */
export async function generateAIContent(prompt: string, model?: string, file?: any): Promise<ActionResult<string>> {
  try {
    const text = await callAI(prompt, model || "gemini-2.0-flash", file);
    return { success: true, content: text, data: text };
  } catch (e: any) { return { success: false, error: e.message, content: prompt }; }
}

/**
 * CRITICAL: Fixed signature for extractTextFromFile (matching legacy calls)
 */
export async function extractTextFromFile(file: { mimeType: string, data: string }, prompt: string): Promise<ActionResult<string>> {
  return generateAIContent(prompt, "gemini-2.0-flash", file);
}

export async function generateLesson(...args: any[]): Promise<ActionResult<any>> {
  return { success: false, error: "Legacy generateLesson is disabled. Use Manual Hub." };
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
  file?: { mimeType: string, data: string },
  modelName = "gemini-2.0-flash"
): Promise<ActionResult<any>> {
  let prompt = "";
  try {
    // For Lesson Plan, we use the specialized wrapper in ai-prompts that handles KHDH logic
    const activitySuggestions = JSON.parse(suggestions || "{}");
    const sectionRequirements = `
YÊU CẦU CHO PHẦN THIẾT KẾ: TOÀN BÀI
Ngữ cảnh hiện tại: Thiết kế bài dạy mới
Hướng dẫn chi tiết: ${customInstructions || "Thiết kế sư phạm cao cấp theo chuẩn 5512"}
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
      tasks.map(t => ({ name: t, description: "" })),
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
      ""  // nextMonth
    );
    const text = await callAI(prompt, modelName);
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
  modelName = "gemini-2.0-flash"
): Promise<ActionResult<any>> {
  let prompt = "";
  try {
    // DIRECT USE of ai-prompts.ts (Event section)
    prompt = getEventPrompt(grade, topic);
    if (instructions) prompt += `\n\nYÊU CẦU BỔ SUNG TỪ NGƯỜI DÙNG:\n${instructions}`;

    const text = await callAI(prompt, modelName);
    const data = parseSmartJSON(text);
    return { success: true, data };
  } catch (e: any) {
    return { success: false, error: e.message, content: prompt };
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
    prompt = `${NCBH_ROLE}\n\n${NCBH_TASK}\n\nKHỐI: ${grade}\nCHỦ ĐỀ: ${topic}\nHƯỚNG DẪN: ${instructions || ""}`;
    const text = await callAI(prompt, modelName);
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
    const text = await callAI(prompt, modelName);
    const data = parseSmartJSON(text);
    return { success: true, data };
  } catch (e: any) {
    return { success: false, error: e.message, content: prompt };
  }
}

export async function auditLessonPlan(lessonResult: any): Promise<ActionResult<any>> {
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
  file?: { mimeType: string, data: string },
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

export async function onRefineSection(...args: any[]): Promise<ActionResult<any>> {
  return { success: false, error: "Feature currently unavailable." };
}

export async function checkApiKeyStatus() {
  return { configured: !!process.env.GEMINI_API_KEY };
}
