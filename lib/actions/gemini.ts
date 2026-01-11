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
  modelName = "gemini-2.0-flash",
  file?: { mimeType: string, data: string },
  systemContent: string = DEFAULT_LESSON_SYSTEM_PROMPT
): Promise<string> {
  const errorLogs: string[] = [];
  const body = {
    contents: [{
      parts: [
        { text: `${systemContent}\n\nPROMPT:\n${prompt}` },
        ...(file?.data ? [{ inlineData: { mimeType: file.mimeType || "application/pdf", data: file.data } }] : [])
      ]
    }],
    generationConfig: { temperature: 0.85, maxOutputTokens: 8192 }
  };

  // 1. STRATEGY: PROXY
  const proxyUrl = process.env.GEMINI_PROXY_URL;
  if (proxyUrl && !proxyUrl.includes("example.com")) {
    try {
      const url = `${proxyUrl.startsWith('http') ? '' : 'https://'}${proxyUrl.replace(/\/$/, '')}/v1beta/models/${modelName}:generateContent`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(25000)
      });
      if (response.ok) {
        const json = await response.json();
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      }
    } catch (e: any) { errorLogs.push(`Proxy: ${e.message}`); }
  }

  // 2. STRATEGY: GEMINI ROTATION (Free Tier - Random Balanced)
  let geminiKeys = [process.env.GEMINI_API_KEY, process.env.GEMINI_API_KEY_2, process.env.GEMINI_API_KEY_3].filter(k => !!k && k.length > 5);

  // Shuffle keys to distribute traffic across potentially different projects/limits
  geminiKeys = geminiKeys.sort(() => Math.random() - 0.5);

  for (let i = 0; i < geminiKeys.length; i++) {
    try {
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiKeys[i]}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(15000)
      });
      if (resp.ok) {
        const json = await resp.json();
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      }
      if (resp.status === 403 || resp.status === 429) continue;
    } catch (e: any) { errorLogs.push(`Gemini K${i + 1}: ${e.message}`); }
  }

  // 3. STRATEGY: GROQ FALLBACK (Highest priority Free Fallback)
  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey) {
    try {
      const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${groqKey}` },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "system", content: systemContent }, { role: "user", content: prompt }],
          temperature: 0.7
        }),
        signal: AbortSignal.timeout(25000)
      });
      if (resp.ok) {
        const data = await resp.json();
        return data.choices[0].message.content || "";
      }
    } catch (e: any) { errorLogs.push(`Groq: ${e.message}`); }
  }

  // 4. STRATEGY: OPENAI FALLBACK (Last resort - Paid)
  const openAIKey = process.env.OPENAI_API_KEY;
  if (openAIKey) {
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
      }
    } catch (e: any) { errorLogs.push(`OpenAI: ${e.message}`); }
  }

  throw new Error(`ALL_PROVIDERS_FAILED: ${errorLogs.join(' | ')}`);
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
