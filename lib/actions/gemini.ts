"use server";

import { DEFAULT_LESSON_SYSTEM_PROMPT } from "@/lib/prompts/system-prompts";

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

  try {
    const keys = [process.env.GEMINI_API_KEY, process.env.GEMINI_API_KEY_2, process.env.GEMINI_API_KEY_3].filter(k => !!k && k.length > 5);
    if (keys.length > 0) {
      const activeKey = keys[Math.floor(Math.random() * keys.length)];

      const parts: any[] = [{ text: `${systemContent}\n\nPROMPT:\n${prompt}` }];
      if (file && file.data) {
        parts.push({ inlineData: { mimeType: file.mimeType || "application/pdf", data: file.data } });
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${activeKey}`, {
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
      }
    }
  } catch (e) { console.warn(`[AI-RELAY] Gemini Step Failed.`); }

  try {
    const openAIKey = process.env.OPENAI_API_KEY;
    if (openAIKey) {
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
      }
    }
  } catch (e) { console.warn(`[AI-RELAY] OpenAI Step Failed.`); }

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
  } catch (e: any) { return { success: false, error: e.message }; }
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
export async function generateLessonPlan(...args: any[]): Promise<ActionResult<any>> {
  return { success: false, error: "Please use the Manual Processing Hub for the new workflow." };
}

export async function generateMeetingMinutes(...args: any[]): Promise<ActionResult<any>> {
  return { success: false, error: "Feature currently unavailable." };
}

export async function generateEventScript(...args: any[]): Promise<ActionResult<any>> {
  return { success: false, error: "Feature currently unavailable." };
}

export async function generateNCBH(...args: any[]): Promise<ActionResult<any>> {
  return { success: false, error: "Feature currently unavailable." };
}

export async function generateAssessmentPlan(...args: any[]): Promise<ActionResult<any>> {
  return { success: false, error: "Feature currently unavailable." };
}

export async function auditLessonPlan(...args: any[]): Promise<ActionResult<any>> {
  return { success: false, error: "Feature currently unavailable." };
}

export async function generateLessonSection(...args: any[]): Promise<ActionResult<any>> {
  return { success: false, error: "Feature currently unavailable." };
}

export async function onRefineSection(...args: any[]): Promise<ActionResult<any>> {
  return { success: false, error: "Feature currently unavailable." };
}

export async function checkApiKeyStatus() {
  return { configured: !!process.env.GEMINI_API_KEY };
}
