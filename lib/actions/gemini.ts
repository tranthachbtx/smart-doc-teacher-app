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
import { JsonHealer } from "@/lib/utils/json-healer";
import { KNTT_DATABASE } from "@/lib/data/kntt-curriculum-database";

export interface ActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  content?: string;
}

// --- RESILIENCE: CIRCUIT BREAKER STATE ---
const FAILED_KEYS_REGISTRY: Record<string, number> = {};
const CIRCUIT_BREAKER_TIME = 10 * 60 * 1000; // 10 minutes

function isKeyBlocked(key: string): boolean {
  if (!key) return true;
  const lastError = FAILED_KEYS_REGISTRY[key];
  if (!lastError) return false;
  if (Date.now() - lastError > CIRCUIT_BREAKER_TIME) {
    delete FAILED_KEYS_REGISTRY[key];
    console.log(`[CIRCUIT-BREAKER] 🔓 Unblocking key: ${key.slice(0, 8)}...`);
    return false;
  }
  return true;
}

function registerKeyFailure(key: string, reason: string) {
  if (!key) return;
  FAILED_KEYS_REGISTRY[key] = Date.now();
  console.warn(`[CIRCUIT-BREAKER] 🚨 Trip registered for key: ${key.slice(0, 8)}... Reason: ${reason}`);
}

const clean = (k: string | undefined) =>
  k?.trim().replace(/^["']|["']$/g, "") || "";

const sanitize = (text: string | null | undefined) => {
  if (!text) return "";
  return text
    .toString()
    .replace(/[\x00-\x09\x0B-\x0C\x0E-\x1F\x7F]/g, "")
    .trim();
};

function getApiConfig(modelName: string) {
  let cleanName = modelName.replace("models/", "");
  const CANONICAL_MAP: Record<string, string> = {
    "gemini-1.5-flash": "gemini-1.5-flash-001",
    "gemini-1.5-pro": "gemini-1.5-pro-001",
    "gemini-1.0-pro": "gemini-1.0-pro-001",
  };
  if (CANONICAL_MAP[cleanName]) cleanName = CANONICAL_MAP[cleanName];

  if (cleanName.includes("2.0") || cleanName.includes("exp")) {
    return {
      version: "v1beta",
      model: `models/${cleanName}`,
    };
  }
  return {
    version: "v1",
    model: `models/${cleanName}`,
  };
}

/**
 * 🕵️ DEEP TRACE ENGINE v61.5
 * Core AI caller with exhaustive logging and multi-provider fallback.
 */
export async function callAI(
  prompt: string,
  modelName = "gemini-1.5-flash",
  file?: { mimeType: string; data: string },
  systemContent: string = MASTER_SYSTEM_INSTRUCTION_V60
): Promise<string> {
  const errorLogs: string[] = [];
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
    contents: [{ role: "user", parts: contentParts }],
    generationConfig: { temperature: 0.85 },
  };

  const proxyUrl = clean(process.env.GEMINI_PROXY_URL);
  const geminiKeysForProxy = [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
  ].map((k) => clean(k)).filter((k) => k.length > 5 && !isKeyBlocked(k));

  if (proxyUrl && !proxyUrl.includes("example.com") && geminiKeysForProxy.length > 0) {
    const { version, model } = getApiConfig(modelName);
    for (const key of geminiKeysForProxy) {
      try {
        const url = `${proxyUrl.startsWith("http") ? "" : "https://"}${proxyUrl.replace(/\/$/, "")}/${version}/${model}:generateContent?key=${key}`;
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
          if (response.status === 429 || response.status === 403) registerKeyFailure(key, `Proxy ${response.status}`);
          errorLogs.push(`Proxy ${response.status}`);
        }
      } catch (e: any) {
        errorLogs.push(`Proxy Ex: ${e.message}`);
      }
    }
  }

  let geminiKeys = [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
  ].map((k) => clean(k)).filter((k) => k.length > 5 && !isKeyBlocked(k));

  if (geminiKeys.length > 0) {
    const modelFallbackPool = [modelName, "gemini-1.5-flash", "gemini-2.0-flash-exp"];
    for (const key of geminiKeys) {
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
            if (resp.status === 429 || resp.status === 403) {
              registerKeyFailure(key, `Gemini ${resp.status}`);
              break;
            }
            errorLogs.push(`Gemini ${resp.status}`);
          }
        } catch (e: any) {
          errorLogs.push(`Gemini Ex: ${e.message}`);
          break;
        }
      }
    }
  }

  const groqKey = clean(process.env.GROQ_API_KEY);
  if (groqKey && !isKeyBlocked(groqKey)) {
    try {
      const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "system", content: systemContent }, { role: "user", content: prompt }],
          temperature: 0.7,
        }),
        signal: AbortSignal.timeout(60000),
      });
      if (resp.ok) {
        const data = await resp.json();
        return data.choices[0].message.content || "";
      }
    } catch (e) { }
  }

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
          messages: [{ role: "system", content: systemContent }, { role: "user", content: prompt }],
          temperature: 0.7,
        }),
        signal: AbortSignal.timeout(90000),
      });
      if (resp.ok) {
        const data = await resp.json();
        return data.choices[0].message.content || "";
      }
    } catch (e) { }
  }

  throw new Error(`ALL_AI_PROVIDERS_EXHAUSTED: ${errorLogs.join(" | ")}`);
}

/**
 * 🛠️ DEEP TRACE WRAPPER
 */
export async function generateAIContent(
  prompt: string,
  modelName = "gemini-2.0-flash",
  type: "meeting" | "event" | "ncbh" | "lesson" = "lesson",
  file?: any
): Promise<ActionResult<any>> {
  let text = "";
  try {
    console.log(`[DEEP_TRACE:INIT] Running generateAIContent for type: ${type}`);
    text = await callAI(prompt, modelName, file);
    if (!text || text.length < 50) {
      throw new Error(`AI_RESPONSE_TOO_SHORT: Only ${text?.length || 0} characters received.`);
    }

    const data = JsonHealer.parse(text, `GENERATE_${type.toUpperCase()}`);

    // Clean CJK characters from string values in the resulting object
    if (data && typeof data === 'object') {
      Object.keys(data).forEach(key => {
        if (typeof data[key] === 'string') {
          data[key] = data[key].replace(/[\u4E00-\u9FFF]/g, "").trim();
        }
      });
    }

    return { success: true, data, content: text };
  } catch (e: any) {
    console.error(`[DEEP_TRACE:FAIL] generateAIContent failed for ${type}:`, e.message);
    return { success: false, error: e.message, content: text };
  }
}

function parseSmartJSON(text: string): any {
  return JsonHealer.parse(text, "SMART_PARSER");
}

function parseHybridJSON(text: string): any {
  let finalData: any = {};
  try {
    const jsonPatterns = [
      /@@@META_JSON_START@@@([\s\S]*?)@@@META_JSON_END@@@/,
      /@@@META_START@@@([\s\S]*?)@@@META_END@@@/,
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
      try {
        finalData = JsonHealer.parse(jsonRaw, "HYBRID_META");
      } catch (e) { }
    }

    const sectionMarkers = [
      { tag: "### SECTION: MUCTIEU", field: "muc_tieu" },
      { tag: "### SECTION: NANGLUC", field: "nang_luc" },
      { tag: "### SECTION: PHAMCHAT", field: "pham_chat" },
      { tag: "### SECTION: LOGISTICS", field: "thoi_gian" },
      { tag: "### SECTION: KINHPHI", field: "kinh_phi" },
      { tag: "### SECTION: CHUANBI", field: "chuan_bi" },
      { tag: "### SECTION: KICHBAN", field: "kich_ban_chi_tiet" },
      { tag: "### SECTION: INTERACTION", field: "interaction" },
      { tag: "### SECTION: THONGDIEP", field: "thong_diep_ket_thuc" },
      { tag: "### SECTION: FOOTER", field: "footer_admin" }
    ];

    sectionMarkers.forEach((marker) => {
      const startIdx = text.indexOf(marker.tag);
      if (startIdx !== -1) {
        const contentStart = startIdx + marker.tag.length;
        let nearestNext = text.length;
        sectionMarkers.forEach((m) => {
          const nextIdx = text.indexOf(m.tag, contentStart);
          if (nextIdx !== -1 && nextIdx < nearestNext) nearestNext = nextIdx;
        });

        let extracted = text.substring(contentStart, nearestNext).trim();
        extracted = extracted
          .replace(/[\u0400-\u04FF\u4E00-\u9FFF]/g, "")
          .replace(/^(I|II|III|IV|V|VI|VII)\..*$/gm, "")
          .replace(/^(1|2|3|4|5|6|7|8)\..*$/gm, "")
          .replace(/^(Mục đích|Yêu cầu|Kịch bản|MC Script|Thời gian|Địa điểm|Kinh phí|Chuẩn bị|Hành động):/gi, "")
          .replace(/\.\.\./g, "")
          .trim();

        finalData[marker.field] = extracted;
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
  let eventPrompt = "";
  try {
    // Smart Injection: Fetch curriculum context for the theme
    const curriculumContext = KNTT_DATABASE.taoContextNgoaiKhoa(Number(grade), topic);

    eventPrompt = getEventPrompt(
      grade,
      topic,
      month,
      instructions,
      budget,
      checklist,
      duration,
      curriculumContext
    );

    const text = await callAI(eventPrompt, modelName, undefined, MASTER_SYSTEM_INSTRUCTION_V60);
    const data = parseSmartJSON(text);
    return { success: true, data };
  } catch (e: any) {
    return { success: false, error: e.message, content: eventPrompt };
  }
}

export async function extractTextFromFile(f: { mimeType: string; data: string }, p: string): Promise<ActionResult<string>> {
  return generateAIContent(p, "gemini-2.0-flash", "lesson", f);
}

export async function generateLesson(...args: any[]): Promise<ActionResult<any>> {
  return generateLessonPlan(args[0], args[1], args[2], args[3] || "", args[4] || [], args[5], args[6], args[7], args[8]);
}

export async function generateLessonAction(...args: any[]): Promise<ActionResult<any>> {
  return generateLessonPlan(args[0], args[1], args[2], args[3] || "", args[4] || [], args[5], args[6], args[7], args[8]);
}

export async function genMtgMinutes(m?: string, s?: string, k?: string, c?: string, mn = "gemini-2.0-flash"): Promise<ActionResult<any>> {
  try {
    const p = getMeetingMinutesPrompt(m || "9", s || "1", k || "", c || "", "");
    const text = await callAI(p, mn, undefined, "Bạn là thư ký cuộc họp chuyên nghiệp. Chỉ trả về JSON.");

    let data = parseSmartJSON(text);

    // Additional cleaning for meeting data
    if (data) {
      ["noi_dung_chinh", "uu_diem", "han_che", "y_kien_dong_gop", "ke_hoach_thang_toi"].forEach(key => {
        if (typeof data[key] === 'string') {
          // Remove Chinese characters and redundant headers
          data[key] = data[key]
            .replace(/[\u4E00-\u9FFF]/g, "")
            .replace(/^(Nội dung chính|Ưu điểm|Hạn chế|Kết luận):?\s*/gi, "")
            .trim();
        }
      });
    }

    return { success: true, data };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function generateNCBHAction(g: string, t: string, i?: string, mn = "gemini-2.0-flash"): Promise<ActionResult<any>> {
  try {
    const p = `${NCBH_ROLE} \n\n${NCBH_TASK} \n\nKHỐI: ${g} \nCHỦ ĐỀ: ${t} \nHƯỜNG DẪN: ${i || ""}`;
    const text = await callAI(p, mn, undefined, "ROLE: Lesson Study Expert.");
    return { success: true, data: parseSmartJSON(text) };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function generateAssessmentPlan(g: string, te: string, pt: string, to: string, mn = "gemini-2.0-flash"): Promise<ActionResult<any>> {
  try {
    const p = getAssessmentPrompt(g, te, pt, to);
    const text = await callAI(p, mn, undefined, "ROLE: Assessment Expert.");
    return { success: true, data: parseSmartJSON(text) };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function generateLessonSection(g: string, t: string, s: string, c: string, d?: string, ci?: string, ts?: string[], cds?: string, su?: string, mn = "gemini-2.0-flash", f?: any, si?: string): Promise<ActionResult<any>> {
  try {
    const p = getLessonPrompt(s as any, g, t, d, c, ci, ts, cds, JSON.parse(su || "{}"), si);
    const text = await callAI(p, mn, f);
    return { success: true, data: parseSmartJSON(text) };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function auditLessonPlan(lessonResult: any): Promise<ActionResult<any>> {
  const { performAdvancedAudit } = await import("./advanced-audit");
  const result = await performAdvancedAudit(lessonResult);
  return { success: result.success, data: result.report, error: result.error };
}

export async function generateLessonPlan(g: string, t: string, d: string, ci: string, ts: string[], cds?: string, su?: string, f?: any, mn = "gemini-2.0-flash"): Promise<ActionResult<any>> {
  try {
    const tasksArray = Array.isArray(ts) ? ts.map(n => ({ name: n, description: "" })) : [];
    const p = getKHDHPrompt(g, t, d, ci, tasksArray, cds ? Number(cds) : undefined, JSON.parse(su || "{}"), !!f);
    const text = await callAI(p, mn, f);
    const data = parseSmartJSON(text);
    return { success: true, data };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function onRefineSection(...args: any[]): Promise<ActionResult<any>> {
  return { success: false, error: "Feature currently unavailable." };
}

export async function checkApiKeyStatus() {
  return { configured: !!process.env.GEMINI_API_KEY };
}
