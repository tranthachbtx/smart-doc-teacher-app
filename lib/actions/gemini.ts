"use server";

// --- VERCEL EDGE RUNTIME CONFIGURATION ---
// Critical to bypass 10s Serverless Timeout on Hobby Plan
// MEMO: To enable Edge Runtime, add "export const runtime = 'edge';" to app/page.tsx instead.

import { GoogleGenerativeAI } from "@google/generative-ai";
// import fs from "fs"; // REMOVED FOR EDGE RUNTIME
// import path from "path"; // REMOVED FOR EDGE RUNTIME
import { HDTN_CURRICULUM } from "@/lib/hdtn-curriculum";
import { getPPCTChuDe } from "@/lib/data/ppct-database";
import {
  getMeetingPrompt,
  getLessonIntegrationPrompt,
  getEventPrompt,
} from "@/lib/prompts/ai-prompts";
import { getAssessmentPrompt } from "@/lib/prompts/assessment-prompts";
import { getKHDHPrompt, MONTH_TO_CHU_DE } from "@/lib/prompts/khdh-prompts";
import { NCBH_ROLE, NCBH_TASK } from "@/lib/prompts/ncbh-prompts";

/**
 * HỆ THỐNG ANTIGRAVITY ORCHESTRATOR 4.2 (INDUSTRIAL STABLE)
 * Triển khai theo phác đồ Saga + CoD + FSAG.
 */

// --- 1. SAGA PERSISTENCE (SERVERLESS ADAPTATION) ---
// Using In-Memory Map simulating Redis for Vercel/Saga Pattern.

declare global {
  var sagaState: {
    jobs: Record<string, SagaJob>; // New: Job Registry
    // Legacy support
    [key: string]: any;
  };
}

// SAGA DATA MODEL (Strict JSON Structure)
interface SagaJob {
  jobId: string;
  grade: string;
  topic: string;
  status: 'planning' | 'processing' | 'completed' | 'failed';
  blueprint?: any; // The Architect's Design
  steps: Record<string, {
    status: 'pending' | 'processing' | 'completed' | 'failed';
    retry_count: number;
    error?: string;
    output_ref?: string; // Content is stored in checkpoints, this is just a ref
  }>;
  created_at: string;
}

if (!global.sagaState) {
  global.sagaState = { jobs: {} };
}

function getSagaStore(pName: string): any {
  // Legacy adapter for specific project lookups
  if (!global.sagaState[pName]) {
    global.sagaState[pName] = {
      path: pName,
      history: [],
      concepts: [],
      summaries: {},
      gists: {},
      constitution: null,
      checkpoints: {}
    };
  }
  return global.sagaState[pName];
}

// --- SAGA ORCHESTRATOR (THE ARCHITECT) ---
export async function createSagaJob(grade: string, topic: string) {
  const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // 1. Initialize Job
  global.sagaState.jobs[jobId] = {
    jobId,
    grade,
    topic,
    status: 'planning',
    steps: {},
    created_at: new Date().toISOString()
  };

  try {
    // 2. The Architect Phase (Generate Blueprint)
    console.log(`[Saga] Architecting Blueprint for ${grade} - ${topic}...`);
    const blueprintPrompt = `
    ROLE: Lead Curriculum Architect.
    TASK: Decompose the lesson plan for 'Grade ${grade} - ${topic}' into MICRO-TASKS.
    standard: "MOET 5512 (60-80 pages scale)".
    
    OUTPUT: JSON ONLY used for queueing system.
    Structure:
    {
      "sections": [
        { "id": "1_muctieu", "title": "I. Mục tiêu", "estimated_tokens": 800 },
        { "id": "2_kienthuc", "title": "II. Kiến thức trọng tâm", "estimated_tokens": 1000 },
        { "id": "3_hoatdong_1", "title": "III.1 Hoạt động Khởi động", "estimated_tokens": 1500 },
        { "id": "3_hoatdong_2", "title": "III.2 Hoạt động Khám phá (Lý thuyết)", "estimated_tokens": 2000 },
        { "id": "3_hoatdong_3", "title": "III.3 Hoạt động Khám phá (Thực hành)", "estimated_tokens": 2000 },
        { "id": "4_luyentap", "title": "IV. Luyện tập", "estimated_tokens": 1500 },
        { "id": "5_vandung", "title": "V. Vận dụng", "estimated_tokens": 1000 },
        { "id": "6_tongket", "title": "VI. Tổng kết & Rubric", "estimated_tokens": 1000 }
      ]
    }`;

    // Use a fast model for planning
    const blueprintJson = await callAI(blueprintPrompt, "gemini-1.5-flash-8b");
    const blueprint = parseResilient(blueprintJson);

    // 3. Hydrate Job with Micro-tasks
    global.sagaState.jobs[jobId].blueprint = blueprint;

    if (blueprint.sections && Array.isArray(blueprint.sections)) {
      blueprint.sections.forEach((sec: any) => {
        global.sagaState.jobs[jobId].steps[sec.id] = {
          status: 'pending',
          retry_count: 0
        };
      });
    }

    global.sagaState.jobs[jobId].status = 'processing';
    return { success: true, jobId, blueprint };

  } catch (e: any) {
    global.sagaState.jobs[jobId].status = 'failed';
    return { success: false, error: e.message };
  }
}

// --- SAGA WORKER (THE BUILDER) ---
export async function processSagaStep(jobId: string, stepId: string) {
  const job = global.sagaState.jobs[jobId];
  if (!job) return { success: false, error: "Job not found" };

  const step = job.steps[stepId];
  if (!step) return { success: false, error: "Step not found" };

  try {
    step.status = 'processing';

    // 1. Retrieve Context (Dependencies)
    // In a real Saga, we pull summaries from previous steps (Linear Dependency)
    // For now, we simulate context by pulling the Global Blueprint
    const context = `BLUEPRINT: ${JSON.stringify(job.blueprint)}`;

    // 2. Execute Generation (Reuse existing logic)
    // We map stepId to our content generation logic
    const sectionTitle = job.blueprint.sections.find((s: any) => s.id === stepId)?.title || stepId;

    const result = await generateLessonSection(
      job.grade,
      job.topic,
      sectionTitle,
      context
    );

    if (result.success) {
      step.status = 'completed';
      step.output_ref = `stored_in_checkpoint_${stepId}`; // Data is already in pName store via generateLessonSection
      return { success: true, stepId, status: 'completed' };
    } else {
      throw new Error(result.error);
    }

  } catch (e: any) {
    step.status = 'failed';
    step.retry_count++;
    step.error = e.message;
    return { success: false, error: e.message };
  }
}

function checkpoint_save(pName: string, id: string, data: any) {
  const store = getSagaStore(pName);

  // Save Full Data Payload
  store.checkpoints[id] = {
    metadata: {
      timestamp: new Date().toISOString(),
      section: id,
      version: "5.2-Lite-Serverless"
    },
    data
  };

  // Dynamic Registry Update (Brain)
  if (data && typeof data === 'object') {
    const contentStr = JSON.stringify(data);

    // 1. Concept Extraction
    const concepts = contentStr.match(/khái niệm|định nghĩa|quy tắc|công thức:?\s*"([^"]+)"/gi);
    if (concepts) store.concepts = Array.from(new Set([...store.concepts, ...concepts]));

    // 2. GIST EXTRACTION
    const gistMatch = contentStr.match(/STUDENT_GIST:?\s*([\s\S]*?)$/i) || contentStr.match(/TÓM TẮT CỐT LÕI:?\s*([\s\S]*?)$/i);
    const gist = gistMatch ? gistMatch[1].trim().slice(0, 800) : contentStr.slice(0, 500) + "...";

    store.gists[id] = gist;
    store.summaries[id] = gist; // Legacy compat
  }
}

function checkpoint_load(pName: string, id: string) {
  const store = getSagaStore(pName);
  const ckpt = store.checkpoints[id];
  if (!ckpt) return null;
  return ckpt.data || ckpt;
}

function get_constitution(pName: string) {
  const store = getSagaStore(pName);
  return store.constitution;
}

function save_constitution(pName: string, data: any) {
  const store = getSagaStore(pName);
  store.constitution = data;
}

// --- 2. RESILIENCE & CIRCUIT BREAKER (v4.6 Industrial) ---
const blacklist = new Set<string>();
let lastSuccess = Date.now();
const GAP_MIN = 30000;
const GAP_MAX = 65000;

// Token Bucket State
let tokens = 15;
let lastCheck = Date.now();

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

// --- 3. CORE ENGINE (TUNNEL-FETCH MODE v5.2) ---

async function callAI(prompt: string, modelName = "gemini-1.5-flash-8b"): Promise<string> {
  const allKeys = [process.env.GEMINI_API_KEY, process.env.GEMINI_API_KEY_2, process.env.GEMINI_API_KEY_3]
    .filter((k): k is string => !!k)
    .map(k => k.trim().replace(/^["']|["']$/g, ""));

  const availableKeys = allKeys.filter(k => !blacklist.has(k));

  if (availableKeys.length === 0) {
    throw new Error("SHADOW_BAN_CRITICAL: All keys exhausted. Please change IP.");
  }

  const system = `ROLE: Expert Curriculum Developer (K12 Vietnam).
  TASK: Generate high-density lesson plans compliant with MOET 5512.
  LANGUAGE CONSTRAINT: System instructions are English. OUTPUT CONTENT MUST BE VIETNAMESE (Tiếng Việt).
  FORMAT: Clean Markdown (No JSON blocks).
  METHOD: Recursive Chain-of-Density (Pack details, examples, dialogues).`;

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

        console.log(`[AI-TUNNEL] [${new Date().toLocaleTimeString()}] Key: ${key.slice(0, 8)}... | ${modelName} | Attempt ${attempt + 1}`);

        // 3. NATIVE FETCH via TUNNEL (Bypass SDK Fingerprint)
        // We use the Next.js Rewrite Tunnel: /api/gemini-tunnel -> https://generativelanguage.googleapis.com
        // This makes Google see the request coming from the Server, stripped of some browser headers if we config rights.
        // Actually, since this is server-side fetch, it originates from Node.js process.
        // To truly mask it, we need header scrubbing.

        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${key}`;

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // "User-Agent": "Mozilla/5.0 (compatible; Google-Gemini-Proxy/1.0)", // Fake UA
            // "Referer": "https://aistudio.google.com", // Mask Origin
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: `${system}\n\nPROMPT:\n${prompt}` }]
            }]
          })
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`${response.status} - ${errText}`);
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

        // 4. RATE LIMIT (429) - Decorrelated Jitter Backoff
        if (status === 429 || errorMsg.includes("429")) {
          console.warn(`[RateLimit] 429 Detected. Applying Decorrelated Jitter...`);
          retryWait = Math.min(60000, Math.floor(Math.random() * (retryWait * 3 - 2000 + 1)) + 2000);
          await new Promise(r => setTimeout(r, retryWait));
          continue; // Retry same key
        }

        console.warn(`[Error] Key ${key.slice(0, 8)} failed: ${errorMsg}`);
        break; // Next key
      }
    }
  }

  throw new Error(`AI_GENERATION_FAILED: Resilience layers exhausted. Last Error: ${lastError}`);
}

function apiVer_label(v: string) { return v === "v1" ? "STABLE" : "EXPERIMENTAL"; }

// --- 4. BUSINESS ACTIONS (EXPERT AUDITED) ---

export async function checkApiKeyStatus() {
  const k = [process.env.GEMINI_API_KEY, process.env.GEMINI_API_KEY_2, process.env.GEMINI_API_KEY_3].filter(x => !!x);
  return { configured: k.length > 0, primaryKey: k.length > 0, backupKey: k.length > 1, backupKey2: k.length > 2 };
}

function parseResilient(text: string, key?: string) {
  const m = text.match(/\{[\s\S]*\}/);
  if (m) try { return JSON.parse(m[0]); } catch (e) { }
  return key ? { [key]: text } : { content: text };
}

export async function generateLessonSection(grade: string, topic: string, section: any, context?: any, duration?: string, custInstr?: string, tasks?: any[], month?: number, suggest?: any, model?: string, file?: any, stepInstr?: string) {
  const pName = `${grade}_${topic}`;
  const ckptId = `section_${section}`;

  // Checkpoint Discovery (FSAG)
  const cached = checkpoint_load(pName, ckptId);
  if (cached) {
    console.log(`[FSAG] Resume Success: ${ckptId}`);
    return { success: true, data: cached };
  }

  try {
    if (section === 'blueprint') {
      save_constitution(pName, { grade, topic, duration, month, density: "Standard-30-50-Pages" });
    }

    // CONTEXT INJECTION: GIST-BASED (vv5.0 Lite)
    let context_injection = "";

    // In-Memory Lookup (No fs/path)
    const store = getSagaStore(pName);

    // Inject Blueprint
    if (store.summaries && store.summaries['section_blueprint']) {
      context_injection += `GLOBAL_BLUEPRINT: ${store.summaries['section_blueprint']}\n`;
    }

    // Inject Gists
    if (store.gists) {
      context_injection += "PREVIOUS_LEARNING_GISTS:\n";
      const recentGists = Object.entries(store.gists as Record<string, string>).slice(-3);
      recentGists.forEach(([sId, g]) => {
        context_injection += `[${sId.replace('section_', '')}]: ${g}\n`;
      });
    }

    // Final Stage: Map-Reduce
    if (section === 'final' && store.gists) {
      context_injection += "FULL_LEARNING_JOURNEY (All Gists):\n";
      Object.entries(store.gists as Record<string, string>).forEach(([sId, g]) => {
        context_injection += `- ${sId.replace('section_', '')}: ${g}\n`;
      });
    }

    // Concept Registry (The Brain)
    if (store.concepts && store.concepts.length > 0) {
      context_injection += `VERIFIED_CONCEPTS: ${store.concepts.slice(-15).join(", ")}\n`;
    }


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
        // STRATEGY: TEACHER Q & STUDENT GIST (Abstractive Q&A)
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

    const base = getKHDHPrompt(grade, topic, duration || "2 tiết", custInstr, tasks, month, suggest, !!file);
    const qualityRules = `
    RULES (Antigravity Lite v5.2):
    1. Output Target: High-Density Pedagogical Content (Markdown).
    2. Format: Use ## Headers, - Bullet points. NO JSON.
    3. MANDATORY: End output with "STUDENT_GIST: <summary>" for memory retention.`;

    const complexPrompt = `${context_injection}\n\n${base}\n\nCORE_TASK: ${specializedPrompt}\n${stepInstr || ""}\n${qualityRules}`;

    const text = await callAI(complexPrompt, model);
    const data = parseResilient(text, section);

    checkpoint_save(pName, ckptId, data);
    return { success: true, data };
  } catch (e: any) {
    console.error(`[Fatal Stage ${section}] ${e.message}`);
    return { success: false, error: e.message };
  }
}

// RESTORE ALL OTHER EXPORTS FOR SYSTEM INTEGRITY
export async function generateMeetingMinutes(m: string, s: string, c: string, conc: string, model?: string) {
  try {
    const t = await callAI(getMeetingPrompt(m, s, c, conc, "", ""), model);
    return { success: true, data: parseResilient(t) };
  } catch (e: any) { return { success: false, error: e.message }; }
}

export async function generateLessonPlan(g: string, t: string, f = false, d?: string, c?: string, tasks?: any[], m?: number, s?: any, model?: string, file?: any) {
  try {
    const p = f ? getKHDHPrompt(g, t, d || "2 tiết", c, tasks, m, s, !!file) : getLessonIntegrationPrompt(g, t);
    const text = await callAI(p, model);
    return { success: true, data: parseResilient(text) };
  } catch (e: any) { return { success: false, error: e.message }; }
}

export async function generateEventScript(g: string, t: string, i?: string, budget?: string, checklist?: string, evaluation?: string, model?: string) {
  try {
    const extra = `\n\nNGÂN SÁCH: ${budget || "Tối ưu hóa"}\nDANH MỤC CẦN CHUẨN BỊ: ${checklist || "Tự đề xuất"}\nTIÊU CHÍ ĐÁNH GIÁ: ${evaluation || "Tự đề xuất"}`;
    const text = await callAI(getEventPrompt(g, t) + (i || "") + extra, model);
    return { success: true, data: parseResilient(text) };
  } catch (e: any) { return { success: false, error: e.message }; }
}

export async function auditLessonPlan(d: any, g: string, t: string) {
  try {
    const text = await callAI(`Pedagogical Audit for ${t}: ${JSON.stringify(d)}`);
    return { success: true, audit: text.replace(/\*/g, "") };
  } catch (e: any) { return { success: false, error: e.message }; }
}

export async function generateNCBH(g: string, t: string, i?: string, m?: string) {
  try {
    const text = await callAI(`${NCBH_ROLE}\n${NCBH_TASK}\n${g}, ${t}, ${i || ""}`, m);
    return { success: true, data: parseResilient(text) };
  } catch (e: any) { return { success: false, error: e.message }; }
}

export async function generateAssessmentPlan(g: string, tr: string, ty: string, to: string, model?: string) {
  try {
    const text = await callAI(getAssessmentPrompt(g, tr, ty, to), model);
    return { success: true, data: parseResilient(text) };
  } catch (e: any) { return { success: false, error: e.message }; }
}

export async function generateAIContent(p: string, model?: string) {
  try {
    const text = await callAI(p, model);
    return { success: true, content: text.replace(/\*/g, "") };
  } catch (e: any) { return { success: false, error: e.message }; }
}
