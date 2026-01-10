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

// --- CORE AI CALLER (ROBUST MULTI-PROVIDER STRATEGY) ---
export async function callAI(
  prompt: string,
  modelName = "gemini-2.0-flash", // Upgraded default model
  file?: { mimeType: string, data: string },
  systemContent: string = DEFAULT_LESSON_SYSTEM_PROMPT
): Promise<string> {
  console.log(`[AI-RELAY] Starting callAI with model: ${modelName}`);

  // 1. Prepare Payload
  const parts: any[] = [{ text: `${systemContent}\n\nPROMPT:\n${prompt}` }];
  if (file && file.data) {
    parts.push({ inlineData: { mimeType: file.mimeType || "application/pdf", data: file.data } });
  }
  const body = {
    contents: [{ parts }],
    generationConfig: { temperature: 0.85, maxOutputTokens: 8192 }
  };

  // 2. STRATEGY: PROXY (First priority if configured)
  const proxyUrl = process.env.GEMINI_PROXY_URL;
  if (proxyUrl && !proxyUrl.includes("example.com")) {
    try {
      console.log(`[AI-RELAY] 🛰️ Attempting Cloudflare Proxy...`);
      const response = await fetch(`${proxyUrl.replace(/\/$/, '')}/v1beta/models/${modelName}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(20000)
      });
      if (response.ok) {
        const json = await response.json();
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          console.log("[AI-RELAY] ✅ Proxy SUCCESS");
          return text;
        }
      }
    } catch (e: any) { console.warn(`[AI-RELAY] ⚠️ Proxy failed: ${e.message}`); }
  }

  // 3. STRATEGY: DIRECT GEMINI ROTATION
  const geminiKeys = [process.env.GEMINI_API_KEY, process.env.GEMINI_API_KEY_2, process.env.GEMINI_API_KEY_3].filter(k => !!k && k.length > 5);
  console.log(`[AI-RELAY] Found ${geminiKeys.length} Gemini keys.`);

  for (const key of geminiKeys) {
    try {
      console.log(`[AI-RELAY] 💎 Attempting Direct Gemini Key...`);
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(15000)
      });

      if (response.ok) {
        const json = await response.json();
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          console.log("[AI-RELAY] ✅ Gemini SUCCESS");
          return text;
        }
      }
    } catch (e: any) { console.warn(`[AI-RELAY] ⚠️ Gemini Key failed: ${e.message}`); }
  }

  // 4. STRATEGY: OPENAI FALLBACK
  const openAIKey = process.env.OPENAI_API_KEY;
  if (openAIKey) {
    try {
      console.log(`[AI-RELAY] 🤖 Falling back to OpenAI...`);
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${openAIKey}` },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "system", content: systemContent }, { role: "user", content: prompt }],
          temperature: 0.7
        }),
        signal: AbortSignal.timeout(20000)
      });
      if (response.ok) {
        const data = await response.json();
        console.log("[AI-RELAY] ✅ OpenAI SUCCESS");
        return data.choices[0].message.content || "";
      }
    } catch (e: any) { console.warn(`[AI-RELAY] OpenAI Exception: ${e.message}`); }
  }

  // 5. STRATEGY: GROQ FALLBACK
  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey) {
    try {
      console.log(`[AI-RELAY] 🦊 Falling back to Groq...`);
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${groqKey}` },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [{ role: "system", content: systemContent }, { role: "user", content: prompt }],
          temperature: 0.7
        }),
        signal: AbortSignal.timeout(20000)
      });
      if (response.ok) {
        const data = await response.json();
        console.log("[AI-RELAY] ✅ Groq SUCCESS");
        return data.choices[0].message.content || "";
      }
    } catch (e: any) { console.warn(`[AI-RELAY] Groq Exception: ${e.message}`); }
  }

  console.error(`[AI-RELAY] 💀 ALL PROVIDERS FAILED.`);
  console.error(`[AI-RELAY] Checked: Proxy (${!!proxyUrl}), Gemini Keys (${geminiKeys.length}), OpenAI (${!!openAIKey}), Groq (${!!groqKey})`);
  throw new Error(`ALL_PROVIDERS_FAILED: Keys Available -> Gemini: ${geminiKeys.length}, OpenAI: ${!!openAIKey}, Groq: ${!!groqKey}`);
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
