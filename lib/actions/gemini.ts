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
  throw new Error("ALL_PROVIDERS_FAILED");
}

// --- API WRAPPERS ---

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
    const activitySuggestions = JSON.parse(suggestions || "{}");
    prompt = getKHDHPrompt(
      grade,
      topic,
      duration,
      customInstructions,
      tasks.map(t => ({ name: t, description: "" })),
      undefined, // month can be null
      activitySuggestions,
      !!file
    );
    const text = await callAI(prompt, modelName, file);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI did not return valid JSON");
    const data = JSON.parse(jsonMatch[0]);
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
    prompt = getMeetingPrompt(month || "", session || "", keyContent || "", "", "", "");
    const text = await callAI(prompt, modelName);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI did not return valid JSON");
    const data = JSON.parse(jsonMatch[0]);
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
    prompt = getEventPrompt(grade, topic);
    const text = await callAI(prompt, modelName);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI did not return valid JSON");
    const data = JSON.parse(jsonMatch[0]);
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
    prompt = `${NCBH_ROLE}\n\n${NCBH_TASK}\n\nKHỐI: ${grade}\nCHỦ ĐỀ: ${topic}\nHƯỚNG DẪN: ${instructions || ""}`;
    const text = await callAI(prompt, modelName);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI did not return valid JSON");
    const data = JSON.parse(jsonMatch[0]);
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
    prompt = getAssessmentPrompt(grade, term, productType, topic);
    const text = await callAI(prompt, modelName);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI did not return valid JSON");
    const data = JSON.parse(jsonMatch[0]);
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
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI did not return valid JSON");
    const data = JSON.parse(jsonMatch[0]);
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
