"use server";

// --- VERCEL EDGE RUNTIME CONFIGURATION ---
// Critical to bypass 10s Serverless Timeout on Hobby Plan
// MEMO: To enable Edge Runtime, add "export const runtime = 'edge';" to app/page.tsx instead.

import { GoogleGenerativeAI } from "@google/generative-ai";
import { HDTN_CURRICULUM } from "@/lib/hdtn-curriculum";
import { getPPCTChuDe } from "@/lib/data/ppct-database";
import {
  ActionResult,
  MeetingResult,
  LessonResult,
  EventResult,
  NCBHResult,
  AssessmentResult,
} from "@/lib/types";
import {
  getMeetingPrompt,
  getLessonIntegrationPrompt,
  getEventPrompt,
} from "@/lib/prompts/ai-prompts";
import { check5512Compliance } from "./compliance-checker";
import { AIResilienceService } from "@/lib/services/ai-resilience-service";
import { getAssessmentPrompt } from "@/lib/prompts/assessment-prompts";
import { getKHDHPrompt, MONTH_TO_CHU_DE } from "@/lib/prompts/khdh-prompts";
import { NCBH_ROLE, NCBH_TASK } from "@/lib/prompts/ncbh-prompts";
import {
  parseLessonResult,
  parseMeetingResult,
  parseEventResult,
  parseNCBHResult,
  parseAssessmentResult,
  parseResilient
} from "@/lib/utils/ai-response-parser";

import type { ActivitySuggestions } from "@/lib/prompts/khdh-prompts";

// ========================================
// ✅ CORE AI FUNCTIONS (STATELESS & RESILIENT)
// ========================================


// --- 1. RESILIENCE & CIRCUIT BREAKER (v6.0 Stable) ---
const blacklist = new Set<string>();
let isProxyDead = false; // Self-healing: if found dead, we skip it
let tokens = 15; // 15 requests per minute
let lastCheck = Date.now();
let lastSuccess = Date.now();
const GAP_MIN = 60000;  // 1 phút tối thiểu
const GAP_MAX = 180000; // 3 phút tối đa

// Circuit Breaker State
let consecutiveShadowBans = 0;
let circuitOpenUntil = 0;

async function physical_gap() {
  const now = Date.now();
  if (now < circuitOpenUntil) {
    const wait = circuitOpenUntil - now;
    console.log(`[CircuitBreaker] OPEN: Safety cooling for ${Math.round(wait / 1000)}s...`);
    await new Promise(r => setTimeout(r, wait));
  }

  // Decorrelated Jitter implementation
  const jitter = Math.floor(Math.random() * (GAP_MAX - GAP_MIN)) + GAP_MIN;
  const elapsed = Date.now() - lastSuccess;
  if (elapsed < jitter) {
    const wait = jitter - elapsed;
    console.log(`[Antigravity] Jittered Gap: Waiting ${Math.round(wait / 1000)}s...`);
    await new Promise(r => setTimeout(r, wait));
  }
}

// --- 2. CORE ENGINE (TUNNEL-FETCH MODE v6.0) ---

const DEFAULT_LESSON_SYSTEM_PROMPT = `ROLE: Expert Curriculum Developer (K12 Vietnam).
TASK: Generate high-density lesson plans compliant with MOET 5512. 
CONTEXT: If a file is attached, it is an OLD LESSON PLAN for optimization.
LANGUAGE CONSTRAINT: System instructions are English. OUTPUT CONTENT MUST BE VIETNAMESE (Tiếng Việt).
FORMAT: Clean Markdown (No JSON blocks).
METHOD: Recursive Chain-of-Density (Pack details, examples, dialogues).`;

const JSON_SYSTEM_PROMPT = `ROLE: Expert Educational Administrator (Vietnam).
TASK: Generate structured documents (Minutes, Plans, Assessments).
LANGUAGE: OUTPUT MUST BE VIETNAMESE (Tiếng Việt).
FORMAT: STRICT JSON ONLY. Ensure valid JSON structure for parsing.`;

async function callAI(
  prompt: string,
  modelName = "gemini-1.5-flash-8b",
  file?: { mimeType: string, data: string },
  systemContent: string = DEFAULT_LESSON_SYSTEM_PROMPT
): Promise<string> {

  let lastError = "";

  for (const key of availableKeys) {
    let retryWait = 2000; // Base 2s

    // Try multiple attempts per key
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        // 1. Token Bucket Throttling (Strict 15 RPM)
        const now = Date.now();
        tokens = Math.min(15, tokens + (now - lastCheck) * (15 / 60000));
        lastCheck = now;
        if (tokens < 1) {
          const throttleWait = 5000;
          console.log(`[Throttling] RPM Limit reached. Cooling ${throttleWait / 1000}s...`);
          await new Promise(r => setTimeout(r, throttleWait));
        }
        tokens--;

        // 2. Physical Gap & Circuit Breaker Check
        await physical_gap();

        console.log(`[AI-TUNNEL] [${new Date().toLocaleTimeString()}] Key: ${key.slice(0, 8)}... | ${modelName} | File: ${!!file}`);

        // 3. NATIVE FETCH via TUNNEL (Bypass SDK Fingerprint)
        const proxyUrl = !isProxyDead ? process.env.GEMINI_PROXY_URL : null;
        const endpoint = proxyUrl
          ? `${proxyUrl.replace(/\/$/, '')}/v1beta/models/${modelName}:generateContent?key=${key}`
          : `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${key}`;

        const parts: any[] = [{ text: `${systemContent}\n\nPROMPT:\n${prompt}` }];
        if (file && file.data) {
          parts.push({
            inlineData: {
              mimeType: file.mimeType || "application/pdf",
              data: file.data
            }
          });
        }

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-antigravity-proxy": "v6.0",
          },
          body: JSON.stringify({
            contents: [{ parts }]
          })
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`${response.status} - ${errText}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const rawText = await response.text();
          const preview = rawText.substring(0, 100);

          if (preview.includes("Hello World!")) {
            console.warn(`[ProxyWarning] Proxy at ${proxyUrl} returned "Hello World!". Attempting fallback to direct Google API...`);
            // Attempt fallback to direct API
            const directEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${key}`;
            const directResponse = await fetch(directEndpoint, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ contents: [{ parts }] })
            });

            if (directResponse.ok) {
              const directJson = await directResponse.json();
              const directText = directJson.candidates?.[0]?.content?.parts?.[0]?.text;
              if (directText) {
                lastSuccess = Date.now();
                consecutiveShadowBans = 0;
                // Successfully healed! Don't use proxy for subsequent calls in this session
                isProxyDead = true;
                console.log("[AI-TUNNEL] PROXY BYPASSED PERMANENTLY for this session.");
                return directText;
              }
            } else {
              const directStatus = directResponse.status;
              const directError = await directResponse.text();
              console.error(`[FallbackFailed] Direct API also failed (${directStatus}): ${directError.substring(0, 200)}`);
            }

            throw new Error(`PROXY_CONFIG_ERROR: Your Gemini Proxy is returning "Hello World!" instead of forwarding the request. 
            HƯỚNG DẪN: Cloudflare Worker của bạn đang trả về trang mặc định. 
            Hệ thống đã thử kết nối trực tiếp nhưng thất bại. Vui lòng kiểm tra GEMINI_API_KEY trong .env.local.`);
          }

          throw new Error(`NON_JSON_RESPONSE: Proxy returned unexpected content-type (${contentType}). Preview: "${preview}"`);
        }

        const json = await response.json();
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) throw new Error("EMPTY_RESPONSE_JSON");

        // SUCCESS: Reset Circuit
        lastSuccess = Date.now();
        consecutiveShadowBans = 0;
        return text;

      } catch (e: any) {
        const errorMsg = e.message || "";
        const status = parseInt(errorMsg.split(' - ')[0]) || 500;
        lastError = errorMsg;

        // 3. SHADOW BAN DETECTION (404/403)
        if (status === 404 || status === 403 || errorMsg.includes("404") || errorMsg.includes("403")) {
          consecutiveShadowBans++;
          console.error(`[CRITICAL] Shadow Ban Detected (${status}). Key: ${key.slice(0, 8)}...`);

          if (consecutiveShadowBans >= 5) {
            console.log("[CircuitBreaker] TRIPPED. IP/Key Protected. Cooling 65s.");
            circuitOpenUntil = Date.now() + 65000;
            blacklist.add(key);
          }
          break; // Next key
        }

        // 4. RATE LIMIT (429)
        if (status === 429 || errorMsg.includes("429") || errorMsg.includes("RESOURCE_EXHAUSTED")) {
          console.error(`[RateLimit] ${status} on key ${key.slice(0, 8)}...`);
          blacklist.add(key);
          break; // Next key
        }

        // 5. RETRY LOGIC (Internal Server Error)
        if (status >= 500 && attempt < 1) {
          console.warn(`[Retryable] ${status} on key ${key.slice(0, 8)}... Retrying...`);
          await new Promise(r => setTimeout(r, retryWait));
          retryWait *= 2; // Exponential backoff
          continue;
        }

        // 6. FATAL ERRORS
        console.error(`[Fatal] ${status} on key ${key.slice(0, 8)}...`);
        break;
      }
    }
  }

  // ALL KEYS FAILED
  throw new Error(`ALL_KEYS_FAILED. Last error: ${lastError}`);
}

// --- 3. IMPROVED JSON PARSER (v2.0) ---
// ✅ Using hardened parser from lib/utils/ai-response-parser.ts

// --- 4. CORE GENERATION FUNCTIONS ---

export async function generateLessonSection(
  grade: string,
  topic: string,
  section: string,
  context: string = "",
  duration?: string,
  custInstr?: string,
  tasks?: Array<string> | Array<{ name: string; description: string; time?: number }>,
  month?: string,
  suggest?: string | ActivitySuggestions,
  model?: string,
  file?: { mimeType: string, data: string, name: string },
  stepInstr?: string
): Promise<ActionResult> {
  try {
    const pName = `${grade}_${topic.replace(/\s+/g, '_')}`;
    const ckptId = `section_${section}`;

    // Check cache first
    const cached = checkpoint_load(pName, ckptId);
    if (cached) {
      console.log(`[Cache] Hit for ${ckptId}`);
      return { success: true, data: cached };
    }

    // CONTEXT INJECTION: GIST-BASED
    let context_injection = context;

    let specializedPrompt = "";
    switch (section) {
      case 'blueprint':
        specializedPrompt = "TASK: Design a 30-50 page lesson architecture. Focus on high information density, not filler.";
        break;
      case 'setup':
        specializedPrompt = "TASK: Draft knowledge targets (CV 5512). Be succinct and professional.";
        break;
      case 'khởi động':
        specializedPrompt = "TASK: Create a 5-minute energetic warm-up. Detail teacher script.";
        break;
      case 'final':
        specializedPrompt = "TASK: CONSOLIDATE. Combine all PREVIOUS_LEARNING_GISTS into a cohesive document. Add final Assessment Rubrics.";
        break;
      default:
        specializedPrompt = `
        TASK: GENERATE CONTENT FOR SECTION '${section}'.
        STRATEGY: TEACHER Q & STUDENT GIST (Abstractive Generative QA).
        
        STRUCTURE:
        1. TEACHER_Q: A thought-provoking question or activity setup provided by the teacher (Max 200 words).
        2. ACTIVITY_DENSITY: Expand using 'Chain of Density'. DO NOT just lengthen. Layer in:
           - Specific pedagogical techniques (e.g., Think-Pair-Share).
           - Concrete real-world examples.
           - Socratic dialogue scripts between Teacher/Student.
           - Deep knowledge formation (Max 1000 words).
        3. STUDENT_GIST: A concise summary (100 words) of learned concepts.
        
        CONSTRAINT: Output strictly in Vietnamese. No filler.`;
    }

    const normalizedTasks = Array.isArray(tasks)
      ? (tasks.length > 0 && typeof tasks[0] === "string"
        ? (tasks as string[]).map((t) => {
          const [name, ...rest] = t.split(":");
          return {
            name: (name || t).trim(),
            description: (rest.join(":").trim() || t).trim(),
          };
        })
        : (tasks as Array<{ name: string; description: string; time?: number }>))
      : undefined;

    const monthNumber = typeof month === "string" ? Number.parseInt(month, 10) : undefined;

    const activitySuggestions: ActivitySuggestions | undefined = (() => {
      if (!suggest) return undefined;
      if (typeof suggest === "object") return suggest;
      try {
        return JSON.parse(suggest) as ActivitySuggestions;
      } catch {
        return undefined;
      }
    })();

    const base = getKHDHPrompt(
      grade,
      topic,
      duration || "2 tiết",
      custInstr,
      normalizedTasks,
      Number.isFinite(monthNumber) ? monthNumber : undefined,
      activitySuggestions,
      !!file
    );
    const qualityRules = `
    RULES (Antigravity v6.0):
    1. Output Target: High-Density Pedagogical Content (Markdown).
    2. Format: Use ## Headers, - Bullet points. NO JSON.
    3. MANDATORY: End output with "STUDENT_GIST: <summary>" for memory retention.`;

    const complexPrompt = `${context_injection}\n\n${base}\n\nCORE_TASK: ${specializedPrompt}\n${stepInstr || ""}\n${qualityRules}`;

    const text = await callAI(complexPrompt, model, file);
    const data = parseLessonResult(text);

    return { success: true, data };
  } catch (e: any) {
    console.error(`[Fatal Stage ${section}] ${e.message}`);
    return { success: false, error: e.message };
  }
}

// Simple cache functions (stateless)
function checkpoint_load(pName: string, id: string) {
  return null; // Disabled server-side caching
}

// ========================================
// ✅ LEGACY FUNCTIONS (FOR COMPATIBILITY)
// ========================================

export async function generateMeetingMinutes(m: string, s: string, c: string, conc: string, model?: string): Promise<ActionResult<MeetingResult>> {
  try {
    const t = await callAI(getMeetingPrompt(m, s, c, conc, "", ""), model, undefined, JSON_SYSTEM_PROMPT);
    return { success: true, data: parseMeetingResult(t) };
  } catch (e: any) { return { success: false, error: e.message }; }
}

export async function generateLesson(g: string, t: string, d?: string, c?: string, tasks?: string[], m?: string, s?: string, f?: { mimeType: string, data: string, name: string }, model?: string): Promise<ActionResult<LessonResult>> {
  try {
    const normalizedTasks = Array.isArray(tasks)
      ? tasks.map((task) => ({ name: task, description: task }))
      : undefined;
    const monthNumber = typeof m === "string" ? Number.parseInt(m, 10) : undefined;

    const activitySuggestions: ActivitySuggestions | undefined = (() => {
      if (!s) return undefined;
      try {
        return JSON.parse(s) as ActivitySuggestions;
      } catch {
        return undefined;
      }
    })();

    const p = f
      ? getKHDHPrompt(
        g,
        t,
        d || "2 tiết",
        c,
        normalizedTasks,
        Number.isFinite(monthNumber) ? monthNumber : undefined,
        activitySuggestions,
        !!f
      )
      : getLessonIntegrationPrompt(g, t);
    const text = await callAI(p, model, f);
    return { success: true, data: parseLessonResult(text) };
  } catch (e: any) { return { success: false, error: e.message }; }
}

export async function generateEvent(g: string, t: string, i?: string, budget?: string, checklist?: string, evaluation?: string, model?: string): Promise<ActionResult<EventResult>> {
  try {
    const extra = `\n\nNGÂN SÁCH: ${budget || "Tối ưu hóa"}\nDANH MỤC CẦN CHUẨN BỊ: ${checklist || "Tự đề xuất"}\nTIÊU CHÍ ĐÁNH GIÁ: ${evaluation || "Tự đề xuất"}`;
    const text = await callAI(getEventPrompt(g, t, undefined) + (i ? `\n\nCHỈ DẪN BỔ SUNG:\n${i}` : "") + extra, model, undefined, JSON_SYSTEM_PROMPT);
    return { success: true, data: parseEventResult(text) };
  } catch (e: any) { return { success: false, error: e.message }; }
}

export async function generateNCBH(g: string, t: string, i?: string, m?: string): Promise<ActionResult<NCBHResult>> {
  try {
    const text = await callAI(`${NCBH_ROLE}\n${NCBH_TASK}\n${g}, ${t}, ${i || ""}`, m, undefined, JSON_SYSTEM_PROMPT);
    return { success: true, data: parseNCBHResult(text) };
  } catch (e: any) { return { success: false, error: e.message }; }
}

export async function generateAssessmentPlan(g: string, tr: string, ty: string, to: string, model?: string): Promise<ActionResult<AssessmentResult>> {
  try {
    const text = await callAI(getAssessmentPrompt(g, tr, ty, to), model, undefined, JSON_SYSTEM_PROMPT);
    return { success: true, data: parseAssessmentResult(text) };
  } catch (e: any) { return { success: false, error: e.message }; }
}

// API Key Status Check
export async function checkApiKeyStatus(): Promise<{ configured: boolean; primaryKey: boolean; backupKey: boolean; backupKey2: boolean }> {
  const k = [process.env.GEMINI_API_KEY, process.env.GEMINI_API_KEY_2, process.env.GEMINI_API_KEY_3]
    .filter((k): k is string => !!k)
    .map(k => k.trim().replace(/^["']|["']$/g, ""));
  return { configured: k.length > 0, primaryKey: k.length > 0, backupKey: k.length > 1, backupKey2: k.length > 2 };
}

// ========================================
// ✅ LEGACY EXPORTS (FOR COMPATIBILITY)
// ========================================

// Aliases for backward compatibility
export const generateLessonPlan = generateLesson;
export const generateEventScript = generateEvent;
export const auditLessonPlan = check5512Compliance;

// Generic AI content generator
export async function generateAIContent(prompt: string, model?: string): Promise<ActionResult> {
  try {
    const text = await callAI(prompt, model);
    return { success: true, content: text };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

/**
 * REFINE SECTION: Tinh chỉnh một đoạn nội dung cụ thể
 */
export async function onRefineSection(content: string, instruction: string, model: string = "gemini-1.5-flash"): Promise<ActionResult> {
  const prompt = `
    VAI TRÒ: Chuyên gia biên soạn giáo án.
    YÊU CẦU: Một giáo viên đang cần bạn tinh chỉnh đoạn nội dung dưới đây.
    
    NỘI DUNG HIỆN TẠI:
    "${content}"
    
    CHỈ DẪN TINH CHỈNH:
    "${instruction}"
    
    QUY TẮC:
    1. Giữ nguyên định dạng Markdown.
    2. Chỉ trả về nội dung đã tinh chỉnh, không thêm lời dẫn giải.
    3. Ngôn ngữ: Tiếng Việt.
  `;

  return generateAIContent(prompt, model);
}
// CV5512 COMPLIANCE CHECKER is now imported from compliance-checker.ts

/**
 * FILE ANALYZER: Trích xuất nội dung từ file (PDF, Image) để làm context
 */
export async function extractTextFromFile(
  file: { mimeType: string; data: string },
  prompt: string = "Hãy tóm tắt nội dung chính của tài liệu này để làm tư liệu soạn bài. Liệt kê các hoạt động chính."
): Promise<ActionResult> {
  try {
    const text = await callAI(prompt, "gemini-1.5-flash", file);
    return { success: true, content: text };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
