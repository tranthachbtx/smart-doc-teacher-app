"use server";

// --- VERCEL EDGE RUNTIME CONFIGURATION ---
// Critical to bypass 10s Serverless Timeout on Hobby Plan
// MEMO: To enable Edge Runtime, add "export const runtime = 'edge';" to app/page.tsx instead.

import { DEFAULT_LESSON_SYSTEM_PROMPT, JSON_SYSTEM_PROMPT } from "@/lib/prompts/system-prompts";
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
import { PedagogicalOrchestrator } from "@/lib/services/pedagogical-orchestrator";

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
const GAP_MIN = 30000;  // 30s tối thiểu
const GAP_MAX = 60000;  // 60s tối đa

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

export async function callAI(
  prompt: string,
  modelName = "gemini-1.5-flash",
  file?: { mimeType: string, data: string },
  systemContent: string = DEFAULT_LESSON_SYSTEM_PROMPT
): Promise<string> {
  const allKeys = [process.env.GEMINI_API_KEY, process.env.GEMINI_API_KEY_2, process.env.GEMINI_API_KEY_3]
    .filter((k): k is string => !!k)
    .map(k => k.trim().replace(/^["']|["']$/g, ""));

  const availableKeys = allKeys.filter(k => !blacklist.has(k));

  if (availableKeys.length === 0 && allKeys.length > 0) {
    console.warn("[Antigravity] All Gemini keys are temporarily blacklisted. Checking hybrid fallbacks...");
  }

  // Multi-Proxy Pool Parsing
  const rawProxyUrl = process.env.GEMINI_PROXY_URL || "";
  const proxyPool = rawProxyUrl.split(',').map(u => u.trim()).filter(u => u.length > 0);
  let currentProxyIndex = 0;

  // Phase 3: Simple Rate Limiting Check
  if (!AIResilienceService.canMakeRequest()) {
    console.warn("[Resilience] Rate limit hit. Waiting 2s...");
    await new Promise(r => setTimeout(r, 2000));
  }

  let lastError = availableKeys.length === 0 ? "GEMINI_KEYS_BLACKLISTED" : "";

  for (const key of availableKeys) {
    let retryWait = 1000;
    let consecutiveShadowBansForKey = 0; // RESET PER KEY (Arch 18.0 Logic)

    for (let attempt = 0; attempt < 4; attempt++) {
      try {
        // 1. Token Bucket Throttling (Strict 30 RPM for Hybrid)
        const now = Date.now();
        const timeDiff = (now - lastCheck) / 60000;
        tokens = Math.min(30, tokens + timeDiff * 30);
        lastCheck = now;
        if (tokens < 1) {
          const throttleWait = 3000;
          console.log(`[Throttling] RPM Limit reached. Cooling ${throttleWait / 1000}s...`);
          await new Promise(r => setTimeout(r, throttleWait));
        }
        tokens--;

        // 2. Physical Gap & Circuit Breaker Check
        await physical_gap();

        // Proxy Rotation Logic
        let proxyToUse = null;
        if (!isProxyDead && proxyPool.length > 0) {
          proxyToUse = proxyPool[currentProxyIndex % proxyPool.length];
        }

        const apiVersions = ["v1beta", "v1"];
        let lastResp: any = null;

        for (const version of apiVersions) {
          const endpoint = proxyToUse
            ? `${proxyToUse.replace(/\/$/, '')}/${version}/models/${modelName}:generateContent?key=${key}`
            : `https://generativelanguage.googleapis.com/${version}/models/${modelName}:generateContent?key=${key}`;

          console.log(`[AI-TUNNEL] Key: ${key.slice(0, 8)} | Model: ${modelName} | API: ${version} | Proxy: ${proxyToUse || 'Direct'}`);

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
              "x-antigravity-proxy": "v21.0",
            },
            body: JSON.stringify({
              contents: [{ parts }],
              generationConfig: {
                temperature: 0.85,
                maxOutputTokens: 8192
              }
            })
          });

          if (!response.ok) {
            const errText = await response.text();
            lastError = `Gemini_${version}_${response.status}: ${errText.substring(0, 100)}`;
            console.warn(`[Gemini-Error] Version: ${version} | Status: ${response.status}`);

            // 🚨 EMERGENCY DIRECT FALLBACK (If Proxy Fails)
            if (response.status >= 500 && proxyToUse) {
              console.log("[Antigravity] Proxy failed (500). Attempting DIRECT connection to Google...");
              const directEndpoint = `https://generativelanguage.googleapis.com/${version}/models/${modelName}:generateContent?key=${key}`;
              try {
                const directResp = await fetch(directEndpoint, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ contents: [{ parts }], generationConfig: { temperature: 0.85 } })
                });
                if (directResp.ok) {
                  const directJson = await directResp.json();
                  const directText = directJson.candidates?.[0]?.content?.parts?.[0]?.text;
                  if (directText) {
                    console.log("[Antigravity] ✅ DIRECT connection succeeded!");
                    return directText;
                  }
                }
              } catch (directErr) {
                console.warn("[Antigravity] Direct fallback also failed.");
              }
            }
            continue;
          }

          const rawText = await response.text();

          // 🟢 HEALING: Detection of "Hello World!" (Broken Proxy)
          if (rawText.includes("Hello World!")) {
            console.warn(`[ProxyWarning] ${proxyToUse} returned "Hello World!". Attempting DIRECT bypass...`);

            // EMERGENCY DIRECT BYPASS FOR "HELLO WORLD"
            const directEndpoint = `https://generativelanguage.googleapis.com/${version}/models/${modelName}:generateContent?key=${key}`;
            try {
              const directResp = await fetch(directEndpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts }], generationConfig: { temperature: 0.85 } })
              });
              if (directResp.ok) {
                const directJson = await directResp.json();
                const directText = directJson.candidates?.[0]?.content?.parts?.[0]?.text;
                if (directText) {
                  console.log("[Antigravity] ✅ DIRECT bypass succeeded!");
                  return directText;
                }
              }
            } catch (directErr) {
              console.warn("[Antigravity] Direct bypass also failed.");
            }

            if (proxyPool.length > currentProxyIndex + 1) {
              currentProxyIndex++;
              attempt--;
              break;
            }
            continue;
          }

          const json = JSON.parse(rawText);
          const text = json.candidates?.[0]?.content?.parts?.[0]?.text;

          if (!text) {
            lastError = "EMPTY_RESPONSE_JSON";
            continue;
          }

          // SUCCESS: Reset Circuit
          lastSuccess = Date.now();
          return text;
        } // Hết vòng lặp apiVersions

        throw new Error(lastError || "VERSION_LOOP_FAILED"); // End of logic
      } catch (e: any) {
        // Error handling block start...
        const errorMsg = e.message || "";
        const status = parseInt(errorMsg.split(' - ')[0]) || 500;
        lastError = errorMsg;

        // 3. ERROR CATEGORIZATION & SHADOW BAN DETECTION
        const isModelNotFoundError = status === 404 && (errorMsg.includes("not found") || errorMsg.includes("not supported"));

        if (!isModelNotFoundError && (status === 404 || status === 403 || errorMsg.includes("404") || errorMsg.includes("403"))) {
          consecutiveShadowBansForKey++; // Fix: use local counter
          console.error(`[CRITICAL] Shadow Ban Detected (${status}). Key: ${key.slice(0, 8)}... (${consecutiveShadowBansForKey}/5)`);

          if (consecutiveShadowBansForKey >= 5) {
            console.log("[CircuitBreaker] TRIPPED for specific key. Cooling 65s.");
            blacklist.add(key);
          }
          break; // Next key
        }

        // 3.5 MODEL FALLBACK (if 404 is specifically about the model)
        if (isModelNotFoundError) {
          const fallbacks = ["gemini-1.5-flash", "gemini-pro", "gemini-1.5-flash-8b", "gemini-1.0-pro"];
          const currentIndex = fallbacks.indexOf(modelName);
          const nextModel = fallbacks[currentIndex + 1];

          if (nextModel) {
            console.warn(`[ModelFallback] Model ${modelName} returned 404. Trying ${nextModel}...`);
            return await callAI(prompt, nextModel, file, systemContent);
          }
        }

        // 4. RATE LIMIT (429) - EXPONENTIAL BACKOFF STRATEGY
        if (status === 429 || errorMsg.includes("429") || errorMsg.includes("RESOURCE_EXHAUSTED")) {
          const waitTime = (attempt + 1) * 10000; // 10s, 20s, 30s
          console.warn(`⚠️ [Quota Hit] Key ${key.slice(0, 8)}... | Retrying in ${waitTime / 1000}s... (Attempt ${attempt + 1})`);
          await new Promise(r => setTimeout(r, waitTime));
          continue; // Retry loop
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


  // --- LAYER 2: NEURAL FAILOVER (HIGH-FIDELITY OVERRIDE) ---
  const failoverProviders = [
    {
      name: "OpenAI",
      url: "https://api.openai.com/v1/chat/completions",
      key: process.env.OPENAI_API_KEY,
      model: "gpt-4o-mini"
    },
    {
      name: "Groq",
      url: "https://api.groq.com/openai/v1/chat/completions",
      key: process.env.GROQ_API_KEY,
      model: "llama3-70b-8192"
    },
    {
      name: "Anthropic",
      url: "https://api.anthropic.com/v1/messages",
      key: process.env.ANTHROPIC_API_KEY,
      model: "claude-3-haiku-20240307"
    }
  ];

  for (const provider of failoverProviders) {
    if (provider.key && provider.key.length > 20) {
      try {
        console.log(`[NeuralFailover] Attempting ${provider.name} (${provider.model})...`);

        let body: any;
        let headers: Record<string, string> = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${provider.key.trim()}`
        };

        if (provider.name === "Anthropic") {
          headers = {
            "Content-Type": "application/json",
            "x-api-key": provider.key.trim(),
            "anthropic-version": "2023-06-01"
          };
          body = {
            model: provider.model,
            system: systemContent,
            messages: [{ role: "user", content: prompt }],
            max_tokens: 4096
          };
        } else {
          body = {
            model: provider.model,
            messages: [
              { role: "system", content: systemContent },
              { role: "user", content: prompt }
            ],
            temperature: 0.7
          };
        }

        const resp = await fetch(provider.url, {
          method: "POST",
          headers,
          body: JSON.stringify(body)
        });

        if (resp.ok) {
          const data = await resp.json();
          const resultText = provider.name === "Anthropic"
            ? data.content[0].text
            : data.choices[0].message.content;

          console.log(`[NeuralFailover] ✅ ${provider.name} SUCCESS! System integrity maintained.`);
          return resultText;
        } else {
          const err = await resp.text();
          console.warn(`[NeuralFailover] ${provider.name} failed: ${resp.status} - ${err.substring(0, 100)}`);
        }
      } catch (e: any) {
        console.error(`[NeuralFailover] ${provider.name} Runtime Error: ${e.message}`);
      }
    }
  }

  // ALL KEYS FAILED
  const recoveryGuide = `
  🛠️ HƯỚNG DẪN KHẮC PHỤC (DEVOPS GUIDE):
  1. Kiểm tra GEMINI_API_KEY trong file .env.local (Đảm bảo không có dấu cách thừa).
  2. Nếu dùng Proxy: Hãy cập nhật Cloudflare Worker với mã nguồn Antigravity mới nhất.
  3. Liên hệ Admin nếu tiếp tục lỗi ALL_KEYS_FAILED: ${lastError}`;

  throw new Error(`ALL_KEYS_FAILED. ${recoveryGuide}`);
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
  } catch (e: any) {
    console.error(`[MeetingFail] AI Failed: ${e.message}`);
    return { success: false, error: `${e.message} | V7 Failure: AI drafting failed.` };
  }
}

import { CurriculumService } from "../services/curriculum-service";

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

    // 🎯 ARCHITECTURE 18.2: SMART INPUT & AUTO-MAPPING
    // Triggered when file exists: Automatically enrich inputs from Database before AI
    if (f) {
      console.log('[GeminiServer] 🚀 Activating Smart Input & Data Mapping...');

      const cs = CurriculumService.getInstance();
      let themeInfo = null;
      let pedagogicalContext = null;

      // 1. Theme Identification (If t is generic, try to find in DB)
      // If "Chủ đề 7" is passed, look it up.
      // If file text contains theme name, look it up.
      const themeDetail = cs.getThemeDetail(Number(g), t); // Try matching input T first

      if (themeDetail) {
        themeInfo = themeDetail;
        console.log(`[SmartMap] Found Theme Match: ${themeInfo.ten}`);
      } else {
        // Fallback: Parse from File (Basic check handled inside chain, but can do here)
      }

      // 2. Pedagogical Context Retrieval
      if (themeInfo) {
        pedagogicalContext = cs.getPedagogicalContext(Number(g), themeInfo.ma);
      }

      // 3. Inject into Orchestrator (Pass as part of metadata)
      // The Orchestrator will now receive enriched "pre-mapped" data
    }

    // 🎯 ARCHITECTURE 18.1: ORCHESTRATED CHAINING
    // Automatically switch to Chained Workflow if file exists (Deep Dive Mode)
    if (f) {
      console.log('[GeminiServer] 🚀 Activating Automated Chain-of-Calls via PedagogicalOrchestrator...');
      const orchestrator = PedagogicalOrchestrator.getInstance();

      // Extract basic text from file first for context
      const fileSummary = f.data ? (await extractTextFromFile(f)).content || "" : "";

      // 4. SMART CONTEXT INJECTION
      // Append DB data to fileSummary so AI 'sees' it as part of the input
      let enrichedContext = fileSummary;

      // Re-fetch service instance locally if needed or reuse
      const cs = CurriculumService.getInstance();
      // (Repeat logic briefly to ensure scope access or just rely on Orchestrator's internal injection? 
      //  The Orchestrator ALREADY has injectCurriculumContext logic! 
      //  We just need to ensure `t` (topic) matches something the Orchestrator can find.
      //  So we don't need heavy code here if Orchestrator is doing its job.
      //  BUT, the user requested "Auto-Mapping" logic here.)

      // Let's explicitly look up and append to ensure it's forced:
      const smartTheme = cs.identifyThemeFromText(t, Number(g));
      if (smartTheme) {
        const pContext = cs.getPedagogicalContext(smartTheme.grade, smartTheme.theme.ma);
        enrichedContext += `\n\n--- [DỮ LIỆU CỐT LÕI TỪ DATABASE] ---\n`;
        enrichedContext += `- Chủ đề chuẩn: ${smartTheme.theme.ten}\n`;
        enrichedContext += `- Mục tiêu (DB): ${smartTheme.theme.muc_tieu.join('; ')}\n`;
        enrichedContext += `- Gợi ý tích hợp (DB): ${pContext?.tichHop?.ke_hoach_day_hoc.join(', ') || "Linh hoạt"}\n`;
      }

      const chainedData = await orchestrator.generateChainedLessonPlan({
        grade: g,
        topic: t,
        duration: d || "2 tiết",
        fileSummary: enrichedContext // Pass enriched context!
      }, model);

      // Map Chained Data to LessonResult
      // (Assuming chainedData.manualModules is populated)
      // We interpret the chained modules back into the LessonResult structure
      const modules = chainedData.manualModules;
      const data: LessonResult = {
        ten_bai: t,
        grade: g,
        hoat_dong_khoi_dong: modules.find((m: any) => m.type === 'khoi_dong')?.content || "",
        hoat_dong_kham_pha: modules.find((m: any) => m.type === 'kham_pha')?.content || "",
        hoat_dong_luyen_tap: modules.find((m: any) => m.type === 'luyen_tap')?.content || "",
        hoat_dong_van_dung: modules.find((m: any) => m.type === 'van_dung')?.content || "",

        // Setup metadata
        muc_tieu_kien_thuc: modules.find((m: any) => m.type === 'setup')?.content || "",
        ho_so_day_hoc: modules.find((m: any) => m.type === 'appendix')?.content || "",

        // Legacy fields
        shdc: "",
        shl: "",
        huong_dan_ve_nha: ""
      };

      return { success: true, data };
    }

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
    let data = parseLessonResult(text);

    // 🎯 ARCHITECTURE 18.0: REFLECTION LAYER (DISABLED FOR SPEED - HOTFIX)
    /*
    if (data && data.hoat_dong_day_hoc) {
      console.log('[GeminiServer] Applying 18.0 Reflection Layer...');
      const orchestrator = PedagogicalOrchestrator.getInstance();
      data = await orchestrator.reflectAndImprove(data);
    }
    */

    return { success: true, data };
  } catch (e: any) { return { success: false, error: e.message }; }
}

export async function generateEvent(g: string, t: string, i?: string, budget?: string, checklist?: string, evaluation?: string, model?: string): Promise<ActionResult<EventResult>> {
  try {
    const extra = `\n\nNGÂN SÁCH: ${budget || "Tối ưu hóa"}\nDANH MỤC CẦN CHUẨN BỊ: ${checklist || "Tự đề xuất"}\nTIÊU CHÍ ĐÁNH GIÁ: ${evaluation || "Tự đề xuất"}`;
    const text = await callAI(getEventPrompt(g, t, undefined) + (i ? `\n\nCHỈ DẪN BỔ SUNG:\n${i}` : "") + extra, model, undefined, JSON_SYSTEM_PROMPT);
    return { success: true, data: parseEventResult(text) };
  } catch (e: any) {
    return { success: false, error: `${e.message} | V7 Failure: Event draft failed.` };
  }
}

export async function generateNCBH(g: string, t: string, i?: string, m?: string): Promise<ActionResult<NCBHResult>> {
  try {
    const text = await callAI(`${NCBH_ROLE}\n${NCBH_TASK}\n${g}, ${t}, ${i || ""}`, m, undefined, JSON_SYSTEM_PROMPT);
    return { success: true, data: parseNCBHResult(text) };
  } catch (e: any) {
    return { success: false, error: `${e.message} | V7 Failure: NCBH draft failed.` };
  }
}

export async function generateAssessmentPlan(g: string, tr: string, ty: string, to: string, model?: string): Promise<ActionResult<AssessmentResult>> {
  try {
    const text = await callAI(getAssessmentPrompt(g, tr, ty, to), model, undefined, JSON_SYSTEM_PROMPT);
    return { success: true, data: parseAssessmentResult(text) };
  } catch (e: any) {
    return { success: false, error: `${e.message} | V7 Failure: Assessment draft failed.` };
  }
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
export async function onRefineSection(content: string, instruction: string, model: string = "gemini-1.5-flash-latest"): Promise<ActionResult> {
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
export async function generateDeepContent(prompt: string, model?: string): Promise<ActionResult<any>> {
  try {
    // For Phase 2 Deep Dive, we prefer Pro models for maximum intelligence
    const targetModel = model || "gemini-1.5-pro";
    console.log(`[DeepDive] Initiating expansion with model: ${targetModel}`);

    const text = await callAI(prompt, targetModel, undefined, JSON_SYSTEM_PROMPT);
    return { success: true, data: parseLessonResult(text) };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
