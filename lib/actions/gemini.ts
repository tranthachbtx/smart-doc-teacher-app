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

// --- CORE AI CALLER ---
export async function callAI(
  prompt: string,
  modelName = "gemini-1.5-flash",
  file?: { mimeType: string, data: string },
  systemContent: string = DEFAULT_LESSON_SYSTEM_PROMPT
): Promise<string> {
  console.log(`[AI-RELAY] Starting callAI with model: ${modelName}`);

  try {
    const keys = [process.env.GEMINI_API_KEY, process.env.GEMINI_API_KEY_2, process.env.GEMINI_API_KEY_3].filter(k => !!k && k.length > 5);
    console.log(`[AI-RELAY] Found ${keys.length} Gemini keys.`);

    if (keys.length > 0) {
      const activeKey = keys[Math.floor(Math.random() * keys.length)];

      const parts: any[] = [{ text: `${systemContent}\n\nPROMPT:\n${prompt}` }];
      if (file && file.data) {
        parts.push({ inlineData: { mimeType: file.mimeType || "application/pdf", data: file.data } });
      }

      const proxyUrl = process.env.GEMINI_PROXY_URL;
      const baseUrl = proxyUrl
        ? `${proxyUrl.endsWith('/') ? proxyUrl : proxyUrl + '/'}`
        : "https://generativelanguage.googleapis.com/v1beta/";

      console.log(`[AI-RELAY] Using Base URL: ${baseUrl}`);
      const apiUrl = `${baseUrl}models/${modelName}:generateContent?key=${activeKey}`;

      console.log(`[AI-RELAY] Attempting fetch to Gemini...`);
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: { temperature: 0.85, maxOutputTokens: 8192 }
        })
      });

      if (response.ok) {
        const json = await response.json();
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
        console.warn(`[AI-RELAY] Gemini response OK but no text found.`, json);
      } else {
        const errorBody = await response.text();
        console.error(`[AI-RELAY] Gemini API Error (${response.status}):`, errorBody);
      }
    } else {
      console.warn(`[AI-RELAY] No Gemini keys found.`);
    }
  } catch (e: any) { console.warn(`[AI-RELAY] Gemini Exception: ${e.message}`); }

  try {
    const openAIKey = process.env.OPENAI_API_KEY;
    if (openAIKey) {
      console.log(`[AI-RELAY] Falling back to OpenAI...`);
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${openAIKey}` },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "system", content: systemContent }, { role: "user", content: prompt }],
          temperature: 0.7
        })
      });
      if (response.ok) {
        const data = await response.json();
        return data.choices[0].message.content || "";
      } else {
        const errorBody = await response.text();
        console.error(`[AI-RELAY] OpenAI API Error (${response.status}):`, errorBody);
      }
    } else {
      console.warn(`[AI-RELAY] No OpenAI Key found.`);
    }
  } catch (e: any) { console.warn(`[AI-RELAY] OpenAI Exception: ${e.message}`); }

  console.error(`[AI-RELAY] All providers failed.`);
  throw new Error("ALL_PROVIDERS_FAILED");
}

// --- API WRAPPERS ---

/**
 * Compatibility wrapper for generateAIContent
 */
export async function generateAIContent(prompt: string, model?: string, file?: any): Promise<ActionResult<string>> {
  try {
    const text = await callAI(prompt, model || "gemini-1.5-flash", file);
    return { success: true, content: text, data: text };
  } catch (e: any) { return { success: false, error: e.message, content: prompt }; }
}

/**
 * CRITICAL: Fixed signature for extractTextFromFile (matching legacy calls)
 */
export async function extractTextFromFile(file: { mimeType: string, data: string }, prompt: string): Promise<ActionResult<string>> {
  return generateAIContent(prompt, "gemini-1.5-flash", file);
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
  modelName = "gemini-1.5-flash"
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
  modelName = "gemini-1.5-flash"
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
  modelName = "gemini-1.5-flash"
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
  modelName = "gemini-1.5-flash"
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
  modelName = "gemini-1.5-flash"
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
  modelName = "gemini-1.5-flash",
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
