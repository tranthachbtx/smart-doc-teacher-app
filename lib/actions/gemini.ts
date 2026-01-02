"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
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

// Quản lý trạng thái các Key bị chặn (Shadow Ban / Invalid)
const suspendedKeys = new Set<string>();

// BIẾN QUẢN LÝ THỜI GIAN (SLOW-COOKING)
let lastRequestTimestamp = 0;
const MIN_GAP_BETWEEN_REQUESTS = 30000; // Nghỉ 30 giây giữa các lần gọi thành công (Slow-Cooking)
const KEY_SWITCH_GAP = 30000;          // Nghỉ 30 giây nếu Key bị lỗi trước khi đổi Key khác
const BAN_SUSPENSION_TIME = 30 * 60000; // 30 phút cách ly nếu nghi ngờ Shadow Ban

function getApiKeys(): string[] {
  const keys: string[] = [];
  const primaryKey = process.env.GEMINI_API_KEY;
  const backupKey = process.env.GEMINI_API_KEY_2;
  const backupKey3 = process.env.GEMINI_API_KEY_3;

  if (primaryKey && primaryKey.trim() !== "") keys.push(primaryKey);
  if (backupKey && backupKey.trim() !== "") keys.push(backupKey);
  if (backupKey3 && backupKey3.trim() !== "") keys.push(backupKey3);

  return keys;
}

// KỸ THUẬT MINIFICATION (Tối ưu hóa token đầu vào)
function minifyPrompt(text: string): string {
  if (!text) return "";
  return text
    .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1') // Loại bỏ comment // và /* */
    .replace(/^\s*$(?:\r\n?|\n)/gm, '') // Loại bỏ dòng trống
    .replace(/\s+/g, ' ') // Gộp khoảng trắng
    .trim();
}

export async function checkApiKeyStatus(): Promise<{
  configured: boolean;
  primaryKey: boolean;
  backupKey: boolean;
  backupKey2: boolean;
  error?: string;
}> {
  const primaryKey = process.env.GEMINI_API_KEY;
  const backupKey = process.env.GEMINI_API_KEY_2;
  const backupKey3 = process.env.GEMINI_API_KEY_3;

  const hasPrimary = !!(primaryKey && primaryKey.trim() !== "");
  const hasBackup = !!(backupKey && backupKey.trim() !== "");
  const hasBackup3 = !!(backupKey3 && backupKey3.trim() !== "");

  if (!hasPrimary && !hasBackup && !hasBackup3) {
    return {
      configured: false,
      primaryKey: false,
      backupKey: false,
      backupKey2: false,
      error: "Chưa cấu hình API Key nào. Vui lòng thêm GEMINI_API_KEY vào Vars.",
    };
  }

  return {
    configured: true,
    primaryKey: hasPrimary,
    backupKey: hasBackup,
    backupKey2: hasBackup3,
  };
}

async function callGeminiWithRetry(
  prompt: string,
  preferredModel?: string,
  maxRetries = 2,
  images?: Array<{ mimeType: string; data: string }>
): Promise<string> {
  // Chỉ lấy những key không nằm trong danh sách tạm đình chỉ (Suspended)
  const apiKeys = getApiKeys()
    .filter(k => !suspendedKeys.has(k))
    .sort(() => Math.random() - 0.5);

  if (apiKeys.length === 0) {
    if (suspendedKeys.size > 0) {
      throw new Error("TẤT CẢ API KEY ĐÃ BỊ GOOGLE TẠM KHÓA (403/404). Hãy thử lại sau 15-30 phút để thoát khỏi Shadow Ban.");
    }
    throw new Error("Chưa cấu hình API Key. Vui lòng thêm GEMINI_API_KEY vào Vars.");
  }

  let lastError: Error | null = null;
  const modelsToTry = preferredModel
    ? [preferredModel, ...MODELS.filter((m) => m !== preferredModel)]
    : MODELS;

  // Chiến thuật: Thử từng Model -> Với mỗi Model thử từng Key -> Với mỗi Key thử đa phiên bản API (Negotiation)
  for (const modelName of modelsToTry) {
    KeyLoop:
    for (let keyIndex = 0; keyIndex < apiKeys.length; keyIndex++) {
      const apiKey = apiKeys[keyIndex];
      const genAI = new GoogleGenerativeAI(apiKey);
      const keyLabel = `Key ${keyIndex + 1}`;

      // SMART NEGOTIATION 6-LAYERS: Bao phủ mọi cấu hình API của Google
      const variants = [
        { model: modelName, apiVersion: undefined },
        { model: `${modelName}-latest`, apiVersion: "v1beta" as any },
        { model: modelName, apiVersion: "v1beta" as any },
        { model: `models/${modelName}`, apiVersion: "v1" as any },
        { model: `models/${modelName}`, apiVersion: "v1beta" as any },
        { model: "gemini-pro", apiVersion: undefined }, // Cánh cửa cuối cùng
      ];

      for (const variant of variants) {
        for (let attempt = 0; attempt < maxRetries; attempt++) {
          try {
            // KIỂM TRA KHOẢNG CÁCH AN TOÀN (Slow-Cooking)
            const timeSinceLast = Date.now() - lastRequestTimestamp;
            if (timeSinceLast < MIN_GAP_BETWEEN_REQUESTS) {
              const wait = MIN_GAP_BETWEEN_REQUESTS - timeSinceLast;
              console.log(`[Slow-Cooking] Đang nghỉ ngơi dưỡng sức ${Math.round(wait / 1000)}s để bảo vệ Quota...`);
              await new Promise(r => setTimeout(r, wait));
            }

            console.log(`[Diagnostic] [${keyLabel}] Thử ${variant.model} (Ver: ${variant.apiVersion || 'default'}) - Lần ${attempt + 1}`);

            const modelInstance = genAI.getGenerativeModel(
              { model: variant.model },
              variant.apiVersion ? { apiVersion: variant.apiVersion } : undefined
            );

            const contents: any[] = [{ text: prompt }];
            if (images && images.length > 0) {
              images.forEach((img) => {
                contents.push({ inlineData: { mimeType: img.mimeType, data: img.data } });
              });
            }

            const result = await modelInstance.generateContent({
              contents: [{ role: "user", parts: contents }],
              generationConfig: { maxOutputTokens: 8192, temperature: 0.7 },
            });

            const response = await result.response;
            const text = response.text();

            if (!text) throw new Error("API phản hồi rỗng.");

            // CẬP NHẬT THỜI GIAN GỌI THÀNH CÔNG ĐỂ ĐIỀU TIẾT NHỊP ĐỘ (Slow-Cooking)
            lastRequestTimestamp = Date.now();

            console.log(`[Slow-Cooking] [${keyLabel}] THÀNH CÔNG: ${variant.model}`);
            return text;

          } catch (error: any) {
            lastError = error;
            const errorMsg = error?.message || "";
            const status = error?.status || 0;

            // CHIẾN THUẬT: GIÃN CÁCH BIẾN THIÊN (Exponential Backoff + Jitter)
            const baseWait = Math.min(60000, Math.pow(2, attempt) * 2000);
            const jitter = Math.random() * 1500;
            const waitTime = baseWait + jitter;

            // Xử lý Lỗi 403/404: NGHI VẤN SHADOW BAN HOẶC KEY CHẾT
            if (status === 403 || status === 404 || errorMsg.includes("403") || errorMsg.includes("404")) {
              console.error(`[Autopilot] [${keyLabel}] Lỗi ${status} - Đang đình chỉ Key này ${BAN_SUSPENSION_TIME / 60000} phút.`);
              suspendedKeys.add(apiKey);

              setTimeout(() => suspendedKeys.delete(apiKey), BAN_SUSPENSION_TIME);

              if (keyIndex < apiKeys.length - 1) {
                console.log(`[Hệ thống Thở] Nghỉ ${KEY_SWITCH_GAP / 1000}s trước khi chuyển Key dự phòng...`);
                await new Promise(r => setTimeout(r, KEY_SWITCH_GAP));
                continue KeyLoop;
              }
              break;
            }

            // Xử lý Lỗi 429: QUÁ TẢI (QUOTA EXHAUSTED)
            if (status === 429 || errorMsg.includes("429") || errorMsg.includes("quota")) {
              if (keyIndex < apiKeys.length - 1) {
                console.warn(`[Autopilot] [${keyLabel}] Hết hạn mức. Đang chuyển Key...`);
                continue KeyLoop;
              }

              console.log(`[Autopilot] [Hệ thống Đợi] Đang lùi bước ${Math.round(waitTime)}ms...`);
              await new Promise(r => setTimeout(r, waitTime));
              continue;
            }

            console.error(`[Autopilot] Lỗi khác:`, errorMsg.substring(0, 120));
            await new Promise(r => setTimeout(r, 2000));
            break;
          }
        }
      }
    }
  }
}

// BÁO CÁO CHUYÊN GIA KHI THẤT BẠI TOÀN DIỆN
const finalErrorMsg = lastError?.message || "";
console.error(`[Autopilot] THẤT BẠI TOÀN DIỆN. Last Error: ${finalErrorMsg}`);

if (finalErrorMsg.includes("403") || finalErrorMsg.includes("404")) {
  throw new Error(
    `CẢNH BÁO SHADOW BAN (404/403):\n` +
    `Google đã tạm chặn dự án/IP của bạn do hành vi gọi AI quá dầy đặc.\n\n` +
    `HỆ THỐNG ĐÃ TỰ ĐỘNG LÙI BƯỚC:\n` +
    `- Đã thử 6 biến thể API (v1, v1beta, models/, latest).\n` +
    `- Đã xoay vòng toàn bộ Key dự phòng.\n\n` +
    `GIẢI PHÁP: Tạm dừng sử dụng 15-30 phút, hoặc đổi địa chỉ IP (dùng 4G/VPN) để thoát khỏi danh sách đen của Google Gateway.`
  );
}

if (finalErrorMsg.includes("429")) {
  throw new Error(`QUÁ TẢI (429): Bạn đã vượt quá giới hạn yêu cầu/phút của Google. Hãy tạm nghỉ 1-2 phút.`);
}

throw new Error(`KẾT NỐI AI THẤT BẠI: ${finalErrorMsg.substring(0, 150)}`);
}

function removeMarkdownBold(text: string): string {
  if (!text || typeof text !== 'string') return text ?? "";
  return text.replace(/\*\*/g, "").replace(/\*/g, "");
}

// BƯỚC 3: CONTEXT COMPRESSION (Nén ngữ cảnh để bảo vệ TPM)
async function summarizeContent(text: string, maxWords = 300): Promise<string> {
  if (!text || text.length < 1000) return text;

  const prompt = `BẠN LÀ MỘT CHUYÊN GIA TÓM TẮT SƯ PHẠM. 
  Hãy tóm tắt nội dung sau đây thành một bản súc tích khoảng ${maxWords} từ, 
  nhưng phải giữ lại toàn bộ: Các khái niệm cốt lõi, Các bước thực hiện chính, và Kết quả đầu ra dự kiến.
  
  NỘI DUNG CẦN TÓM TẮT:
  ${text.substring(0, 15000)} 
  
  CHỈ TRẢ VỀ VĂN BẢN TÓM TẮT, KHÔNG THÊM BẤT CỨ LỜI DẪN NÀO.`;

  try {
    // Dùng model mặc định để tóm tắt nhanh
    return await callGeminiWithRetry(prompt, "gemini-1.5-flash-8b");
  } catch (e) {
    return text.substring(0, 1500); // Fallback nếu lỗi
  }
}

// --- HYBRID PARSER (YAML-LIKE FRONTMATTER + MARKDOWN) ---
// As recommended in the research, this is more robust for long-form content.
function parseGeminiHybrid(text: string, expectedContentKey: string): any {
  const result: any = {};

  // 1. Try to extract YAML-like frontmatter (between --- or just at the top)
  // Lenient match: find the first occurrence of --- block
  const yamlMatch = text.match(/---\s*([\s\S]*?)\s*---/);
  let content = text;
  let metadataStr = "";

  if (yamlMatch) {
    metadataStr = yamlMatch[1];
    const matchStart = text.indexOf(yamlMatch[0]);
    content = (text.substring(0, matchStart) + text.substring(matchStart + yamlMatch[0].length)).trim();
  } else {
    // If no ---, try to look for key: value patterns at the very top before any headers
    const lines = text.split("\n");
    const metadataLines: string[] = [];
    let contentStartIdx = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.match(/^[a-zA-Z0-9_]+:\s*.*$/)) {
        metadataLines.push(line);
        contentStartIdx = i + 1;
      } else if (line === "") {
        contentStartIdx = i + 1;
        continue;
      } else {
        break;
      }
    }
    if (metadataLines.length > 0) {
      metadataStr = metadataLines.join("\n");
      content = lines.slice(contentStartIdx).join("\n").trim();
    }
  }

  // Parse simple YAML-like metadata (key: value or key: ["a", "b"])
  if (metadataStr) {
    const metaLines = metadataStr.split("\n");
    let currentKey = "";

    metaLines.forEach(line => {
      const colonIdx = line.indexOf(":");
      // If starts with whitespace, it might be a continuation of the previous key
      if (line.startsWith(" ") && currentKey) {
        result[currentKey] = (result[currentKey] || "") + "\n" + line.trim();
        return;
      }

      if (colonIdx !== -1) {
        const key = line.substring(0, colonIdx).trim();
        if (key.match(/^[a-zA-Z0-9_]+$/)) {
          currentKey = key;
          let val: any = line.substring(colonIdx + 1).trim();

          // Handle simple array and cleanup quotes
          if (val.startsWith("[") && val.endsWith("]")) {
            try {
              val = JSON.parse(val.replace(/'/g, '"'));
            } catch (e) {
              val = val.substring(1, val.length - 1).split(",").map((s: string) => s.trim().replace(/^["']|["']$/g, ""));
            }
          } else {
            // Remove wrapping quotes if AI adds them
            val = val.replace(/^["']|["']$/g, "");
          }
          result[key] = val;
          return;
        }
      }

      // If no colon and not starting with space, reset currentKey
      currentKey = "";
    });
  }

  // 2. Put the remaining content into the expected key
  // CRITICAL: Check if content is actually an "echo" of a large JSON (common hallucination)
  let cleanedContent = removeMarkdownBold(content);

  // If content starts with ```json and contains many keys, it might be an echo
  if (cleanedContent.trim().startsWith("```json") || (cleanedContent.trim().startsWith("{") && cleanedContent.includes(`"${expectedContentKey}"`))) {
    console.log("[v0] Hybrid content looks like a full JSON echo. Attempting to extract specifically...");
    const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const nested = JSON.parse(jsonMatch[0].replace(/```json|```/g, ""));
        if (nested[expectedContentKey]) {
          cleanedContent = nested[expectedContentKey];
        }
      } catch (e) { /* ignore */ }
    }
  }

  result[expectedContentKey] = cleanedContent;
  return result;
}

function parseGeminiJSON(text: string, expectedContentKey?: string): any {
  console.log("[v0] Raw response (first 500 chars):", (text || "").substring(0, 500));

  if (!text) {
    throw new Error("Không nhận được nội dung từ Gemini (Empty response)");
  }
  // --- Pre-process: Remove [THINKING] blocks if present ---
  // Improved: Remove EVERYTHING between [THINKING] and [/THINKING] or end of string if unclosed
  if (text.includes("[THINKING]")) {
    const startIdx = text.indexOf("[THINKING]");
    const endIdx = text.indexOf("[/THINKING]");
    if (endIdx !== -1) {
      text = (text.substring(0, startIdx) + text.substring(endIdx + 11)).trim();
    } else {
      // Unclosed thinking block at the end (rare) or beginning
      text = text.substring(0, startIdx).trim();
    }
  }

  // Also handle any other tags like [PROMPT], [TASK] if AI hallucinate them
  text = text.replace(/\[\/?(THINKING|PROMPT|TASK|STEP)\]/gi, "").trim();

  // --- 0. Try Hybrid Parsing first with smarter detection ---
  // Detect if text contains YAML markers (---) or common key: patterns within the first 500 chars
  const hasYamlMarker = text.substring(0, 500).includes("---");
  const hasKeyPattern = /^[a-z0-9_]+:\s/im.test(text.substring(0, 500));

  if (expectedContentKey && (hasYamlMarker || hasKeyPattern)) {
    try {
      console.log("[v0] Attempting Hybrid Parsing for key:", expectedContentKey);
      const hybrid = parseGeminiHybrid(text, expectedContentKey);
      if (Object.keys(hybrid).length > 1 || (hybrid[expectedContentKey] && hybrid[expectedContentKey].length > 50)) {
        return hybrid;
      }
    } catch (e) {
      console.log("[v0] Hybrid parsing fallback triggered.");
    }
  }

  // --- 1. Try extracting from Markdown Code Blocks ---
  const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/gi;
  const matches = [...text.matchAll(codeBlockRegex)];

  let candidates: string[] = [];

  if (matches.length > 0) {
    // Prioritize the last block as it usually contains the final result
    matches.forEach(m => candidates.push(m[1]));
  } else {
    // No code blocks, treat entire text as candidate
    candidates.push(text);
  }

  // --- 2. Iterate candidates and try to find valid JSON ---
  for (const candidate of candidates.reverse()) { // Try from end (most likely place)
    // Extract from first '{' to last '}'
    const startIdx = candidate.indexOf("{");
    const endIdx = candidate.lastIndexOf("}");

    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      const jsonStr = candidate.substring(startIdx, endIdx + 1);
      try {
        // Basic parse check
        const result = JSON.parse(jsonStr);
        // Safety check: ensure it has keys
        if (Object.keys(result).length > 0) {
          // Clean string values
          for (const key of Object.keys(result)) {
            if (typeof result[key] === "string") {
              result[key] = removeMarkdownBold(result[key]);
            }
          }
          return result;
        }
      } catch (e) {
        // Continue to next candidate or try fixing
        console.log("[v0] Candidate parse failed, trying fixes...", e);
      }
    }
  }

  // --- 3. Fallback: Aggressive Cleaning & Extraction on full text ---
  // If we are here, no clean code block worked.
  const cleaned = text
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  const startIdx = cleaned.indexOf("{");
  const endIdx = cleaned.lastIndexOf("}");

  if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
    console.log("[v0] No valid JSON brackets found in response:", text.substring(0, 100));
    throw new Error(`Không tìm thấy JSON trong response. Nội dung nhận được: ${text.substring(0, 50)}...`);
  }

  let jsonStr = cleaned.substring(startIdx, endIdx + 1);

  try {
    const result = JSON.parse(jsonStr);
    // Post-process string values (standard path)
    for (const key of Object.keys(result)) {
      if (typeof result[key] === "string") {
        result[key] = removeMarkdownBold(result[key]);
      }
    }
    return result;
  } catch (e) {
    console.log("[v0] Standard JSON parse failed, trying relaxed parsing...");

    // RELAXED PARSING STRATEGY
    // This handles:
    // 1. Keys without quotes
    // 2. Single quotes instead of double quotes
    // 3. Trailing commas
    try {
      // We wrap the content in parentheses to make it an expression
      // and use the Function constructor to safely evaluate it as a data object.
      // This is safer than 'eval' but still powerful enough for relaxed JSON.
      const relaxedParse = new Function("return (" + jsonStr + ")");
      const result = relaxedParse();

      // Verify it looks like an object
      if (result && typeof result === 'object') {
        // Post-process string values
        for (const key of Object.keys(result)) {
          if (typeof result[key] === "string") {
            result[key] = removeMarkdownBold(result[key]);
          }
        }
        return result;
      }
    } catch (relaxedErr) {
      console.log("[v0] Relaxed parsing also failed:", relaxedErr);
    }
  }

  // Common fix: Unescaped newlines in JSON strings
  // REMOVED DESTRUCTIVE GLOBAL NEWLINE REPLACE HERE
  // We only sanitize within quotes now using the block below

  // Dangerous regex loop removed.
  // We rely on the model's ability to produce valid JSON or the first-pass parser.
  // If parsing fails here, it falls through to the final catch.

  try {
    const result = JSON.parse(jsonStr);
    for (const key of Object.keys(result)) {
      if (typeof result[key] === "string") {
        result[key] = removeMarkdownBold(result[key]);
      }
    }
    return result;
  } catch (e) {
    console.log("[v0] Second parse failed, trying more aggressive fixes...");
  }

  jsonStr = jsonStr
    .replace(/,\s*}/g, "}")
    .replace(/,\s*]/g, "]")
    .replace(/[\x00-\x1F\x7F]/g, " ")
    .replace(/\s+/g, " ");

  try {
    const result = JSON.parse(jsonStr);
    for (const key of Object.keys(result)) {
      if (typeof result[key] === "string") {
        result[key] = removeMarkdownBold(result[key]);
      }
    }
    return result;
  } catch (e: any) {
    console.log("[v0] All parse attempts failed:", e.message);

    const result: any = {};
    const keys = [
      "tich_hop_nls",
      "tich_hop_dao_duc",
      "noi_dung_chinh",
      "uu_diem",
      "han_che",
      "y_kien_dong_gop",
      "ke_hoach_thang_toi",
      "ten_chu_de",
      "ten_bai",
      "nang_luc",
      "pham_chat",
      "muc_dich_yeu_cau",
      "kich_ban_chi_tiet",
      "thong_diep_ket_thuc",
      "muc_tieu_kien_thuc",
      "muc_tieu_nang_luc",
      "muc_tieu_pham_chat",
      "thiet_bi_day_hoc",
      "hoat_dong_khoi_dong",
      "hoat_dong_kham_pha",
      "hoat_dong_luyen_tap",
      "hoat_dong_van_dung",
      "ho_so_day_hoc",
      "huong_dan_ve_nha",
      "ma_chu_de",
      "gv_chuan_bi",
      "hs_chuan_bi",
      "hoat_dong_duoi_co",
      "ten_ke_hoach",
      "muc_tieu",
      "noi_dung_nhiem_vu",
      "hinh_thuc_to_chuc",
      "ma_tran_dac_ta",
      "bang_kiem_rubric",
      "loi_khuyen",
      "shdc",
      "shl",
      "noi_dung_chuan_bi"
    ];

    for (const key of keys) {
      const regex = new RegExp(
        `"${key}"\\s*:\\s*"([^"]*(?:\\\\.[^"]*)*)"`,
        "g"
      );
      const match = regex.exec(cleaned);
      if (match && match[1]) {
        result[key] = removeMarkdownBold(
          match[1].replace(/\\n/g, "\n").replace(/\\"/g, '"')
        );
      }
    }

    if (Object.keys(result).length > 0) {
      console.log("[v0] Manual extraction found keys:", Object.keys(result));
      return result;
    }

    throw new Error(`Lỗi parse JSON: ${e.message}`);
  }
}

function getThemesForMonth(month: string): string {
  const themes: string[] = [];
  for (const grade of ["10", "11", "12"]) {
    const theme = HDTN_CURRICULUM[grade]?.[month];
    if (theme) {
      themes.push(`Khối ${grade}: ${theme}`);
    }
  }
  return themes.join("\n");
}

export async function generateMeetingMinutes(
  month: string,
  session: string,
  keyContent: string,
  model?: string
): Promise<{
  success: boolean;
  data?: {
    noi_dung_chinh: string;
    uu_diem: string;
    han_che: string;
    y_kien_dong_gop: string;
    ke_hoach_thang_toi: string;
  };
  error?: string;
}> {
  const apiKeys = getApiKeys();

  if (apiKeys.length === 0) {
    return {
      success: false,
      error:
        "API Key không được cấu hình. Vui lòng thêm GEMINI_API_KEY vào Vars.",
    };
  }

  try {
    const currentThemes = getThemesForMonth(month);
    const nextMonth =
      month === "12" ? "1" : month === "5" ? "9" : String(Number(month) + 1);
    const nextThemes = getThemesForMonth(nextMonth);

    const prompt = getMeetingPrompt(
      month,
      session,
      keyContent,
      currentThemes,
      nextThemes,
      nextMonth
    );

    console.log("[v0] Calling Gemini API for meeting minutes...");

    const text = await callGeminiWithRetry(prompt, model || "gemini-1.5-flash");
    console.log("[v0] Meeting minutes response received, length:", text.length);

    const data = parseGeminiJSON(text);
    console.log("[v0] Meeting minutes JSON parsed successfully");

    return {
      success: true,
      data: {
        noi_dung_chinh: data.noi_dung_chinh || "",
        uu_diem: data.uu_diem || "",
        han_che: data.han_che || "",
        y_kien_dong_gop: data.y_kien_dong_gop || "",
        ke_hoach_thang_toi: data.ke_hoach_thang_toi || "",
      },
    };
  } catch (error: any) {
    console.error("[v0] Meeting minutes generation error:", error.message);
    return {
      success: false,
      error: error?.message || "Lỗi khi tạo biên bản họp",
    };
  }
}

export async function generateLessonPlan(
  grade: string,
  lessonTopic: string,
  fullPlan = false,
  duration?: string,
  customInstructions?: string,
  tasks?: Array<{ name: string; description: string }>,
  month?: number,
  activitySuggestions?: { shdc?: string; hdgd?: string; shl?: string },
  model?: string,
  lessonFile?: { mimeType: string; data: string; name: string }
): Promise<{
  success: boolean;
  data?: {
    tich_hop_nls: string;
    tich_hop_dao_duc: string;
    ma_chu_de?: string;
    ten_bai?: string;
    muc_tieu_kien_thuc?: string;
    muc_tieu_nang_luc?: string;
    muc_tieu_pham_chat?: string;
    gv_chuan_bi?: string;
    hs_chuan_bi?: string;
    hoat_dong_duoi_co?: string;
    shdc?: string;
    shl?: string;
    hoat_dong_khoi_dong?: string;
    hoat_dong_kham_pha?: string;
    hoat_dong_luyen_tap?: string;
    hoat_dong_van_dung?: string;
    ho_so_day_hoc?: string;
    huong_dan_ve_nha?: string;
  };
  error?: string;
}> {
  const apiKeys = getApiKeys();

  if (apiKeys.length === 0) {
    return {
      success: false,
      error:
        "API Key không được cấu hình. Vui lòng thêm GEMINI_API_KEY vào Vars.",
    };
  }

  try {
    let prompt = fullPlan
      ? getKHDHPrompt(
        grade,
        lessonTopic,
        duration || "2 tiết",
        customInstructions,
        tasks,
        month,
        activitySuggestions,
        !!lessonFile
      )
      : getLessonIntegrationPrompt(grade, lessonTopic);

    if (!fullPlan && customInstructions && customInstructions.trim()) {
      prompt += `\n\nYÊU CẦU BỔ SUNG TỪ GIÁO VIÊN:\n${customInstructions}\n\nLưu ý: Hãy tích hợp các yêu cầu trên vào nội dung một cách hợp lý và khoa học.`;
    }

    if (lessonFile) {
      prompt += `\n\nYÊU CẦU OCR & THIẾT KẾ GD:\nTôi đã gửi kèm tài liệu nội dung bài học (PDF/Ảnh). Hãy phân tích kỹ nội dung, hình ảnh, các câu hỏi và hoạt động trong tài liệu này để trích xuất kiến thức trọng tâm và thiết kế các hoạt động giáo dục (Khởi động, Khám phá, Luyện tập, Vận dụng) một cách sát thực tế nhất. Đảm bảo giáo án 2 cột phản ánh đúng tinh thần của tài liệu được cung cấp.`;
    }

    console.log(
      "[v0] Calling Gemini API for lesson plan...",
      fullPlan ? "(Full Plan)" : "(Integration Only)",
      lessonFile ? "(With File/OCR)" : ""
    );

    const text = await callGeminiWithRetry(
      prompt,
      model || "gemini-1.5-flash",
      2,
      lessonFile ? [lessonFile] : undefined
    );
    console.log("[v0] Lesson plan response received, length:", text.length);

    const data = parseGeminiJSON(text);
    console.log(
      "[v0] Lesson plan JSON parsed successfully, keys:",
      Object.keys(data)
    );

    if (fullPlan) {
      return {
        success: true,
        data: {
          tich_hop_nls: data.tich_hop_nls || "",
          tich_hop_dao_duc: data.tich_hop_dao_duc || "",
          ma_chu_de: data.ma_chu_de || "",
          ten_bai: data.ten_bai || lessonTopic,
          muc_tieu_kien_thuc: data.muc_tieu_kien_thuc || "",
          muc_tieu_nang_luc: data.muc_tieu_nang_luc || "",
          muc_tieu_pham_chat: data.muc_tieu_pham_chat || "",
          gv_chuan_bi: data.gv_chuan_bi || data.thiet_bi_day_hoc || "",
          hs_chuan_bi: data.hs_chuan_bi || "",
          hoat_dong_duoi_co: data.hoat_dong_duoi_co || "",
          shdc: data.shdc || "",
          shl: data.shl || "",
          hoat_dong_khoi_dong: data.hoat_dong_khoi_dong || "",
          hoat_dong_kham_pha: data.hoat_dong_kham_pha || "",
          hoat_dong_luyen_tap: data.hoat_dong_luyen_tap || "",
          hoat_dong_van_dung: data.hoat_dong_van_dung || "",
          ho_so_day_hoc: data.ho_so_day_hoc || "",
          huong_dan_ve_nha: data.huong_dan_ve_nha || "",
        },
      };
    }

    return {
      success: true,
      data: {
        tich_hop_nls: data.tich_hop_nls || "",
        tich_hop_dao_duc: data.tich_hop_dao_duc || "",
      },
    };
  } catch (error: any) {
    console.error("[v0] Lesson plan generation error:", error.message);
    return {
      success: false,
      error: error?.message || "Lỗi khi tạo nội dung tích hợp",
    };
  }
}

export async function generateLessonSection(
  grade: string,
  lessonTopic: string,
  section: "blueprint" | "setup" | "khởi động" | "khám phá" | "luyện tập" | "vận dụng" | "shdc_shl" | "final" | "preparation",
  context?: any,
  duration?: string,
  customInstructions?: string,
  tasks?: Array<{ name: string; description: string }>,
  month?: number,
  activitySuggestions?: { shdc?: string; hdgd?: string; shl?: string },
  model?: string,
  lessonFile?: { mimeType: string; data: string; name: string }
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    // TỐI ƯU HÓA PROMPT: Chỉ lấy context cần thiết cho từng phần để tiết kiệm Token/Quota
    const basePrompt = getKHDHPrompt(
      grade,
      lessonTopic,
      duration || "2 tiết",
      customInstructions,
      tasks,
      month,
      activitySuggestions,
      !!lessonFile
    );

    // Tinh chỉnh logic lọc để "sạch" hơn
    const extractBlock = (full: string, startMarker: string, endMarker?: string) => {
      const start = full.indexOf(startMarker);
      if (start === -1) return "";
      if (!endMarker) return full.substring(start);
      const end = full.indexOf(endMarker, start);
      return end === -1 ? full.substring(start) : full.substring(start, end);
    };

    let optimizedBasePrompt = basePrompt;

    if (section === "setup") {
      optimizedBasePrompt = extractBlock(basePrompt, "CHỈ DẪN", "HƯỚNG DẪN PHÂN BỔ THỜI GIAN") +
        extractBlock(basePrompt, "DỮ LIỆU ĐẦU VÀO (USER INPUT)");
    } else if (["khởi động", "khám phá", "luyện tập", "vận dụng"].includes(section)) {
      optimizedBasePrompt = extractBlock(basePrompt, "CHỈ DẪN", "MẪU SINH HOẠT DƯỚI CỜ") +
        extractBlock(basePrompt, "PHIẾU HỌC TẬP VÀ RUBRIC", "DỮ LIỆU ĐẦU VÀO") +
        extractBlock(basePrompt, "DỮ LIỆU ĐẦU VÀO (USER INPUT)");
    } else if (section === "shdc_shl") {
      optimizedBasePrompt = extractBlock(basePrompt, "CHỈ DẪN", "HƯỚNG DẪN TÍCH HỢP NĂNG LỰC SỐ") +
        extractBlock(basePrompt, "MẪU SINH HOẠT DƯỚI CỜ", "TIÊU CHÍ ĐÁNH GIÁ CUỐI CHỦ ĐỀ") +
        extractBlock(basePrompt, "DỮ LIỆU ĐẦU VÀO (USER INPUT)");
    } else if (section === "final" || section === "preparation") {
      optimizedBasePrompt = extractBlock(basePrompt, "CHỈ DẪN", "HƯỚNG DẪN TÍCH HỢP NĂNG LỰC SỐ") +
        extractBlock(basePrompt, "PHIẾU HỌC TẬP VÀ RUBRIC", "DỮ LIỆU ĐẦU VÀO") +
        extractBlock(basePrompt, "DỮ LIỆU ĐẦU VÀO (USER INPUT)");
    }

    // Áp dụng Minification trước khi gửi
    optimizedBasePrompt = minifyPrompt(optimizedBasePrompt);

    // KỸ THUẬT SLIDING WINDOW: Nếu context quá lớn, hãy nén nó lại
    if (context && JSON.stringify(context).length > 20000) {
      console.log("[v0] Context quá lớn, đang thực hiện nén ngữ cảnh...");
      if (context.hoat_dong_khoi_dong) context.hoat_dong_khoi_dong = await summarizeContent(context.hoat_dong_khoi_dong);
      if (context.hoat_dong_kham_pha) context.hoat_dong_kham_pha = await summarizeContent(context.hoat_dong_kham_pha);
    }

    if (!optimizedBasePrompt || optimizedBasePrompt.trim().length < 100) {
      console.warn(`[v0] Optimization block too small for ${section}, falling back to base prompt.`);
      optimizedBasePrompt = basePrompt;
    }

    let specificPrompt = "";
    let outputFormat = "";
    let expectedContentKey = "";

    switch (section) {
      case "blueprint":
        expectedContentKey = "blueprint";
        specificPrompt = `TASK: You are the ARCHITECT (Phase 1).
        Creates a high-level BLUEPRINT (Skeleton) for the entire lesson "${lessonTopic}".
        
        REQUIREMENTS:
        1. Define the exact name of all 4 Education Activities (Start, Explore, Practice, Apply).
        2. Set specific time allocation for each part (must sum up to ${duration || '90 mins'}).
        3. Outline ONE core "Cognitive Conflict", "Problem Statement" or "Situational Dilemma" that binds all activities together.
        4. Apply Kolb's Experiential Cycle logic (Experience -> Reflection -> Conceptualization -> Application).
        
        FORMAT (JSON preferred, but Hybrid OK):
        \`\`\`json
        {
           "blueprint": {
              "topic_name": "...",
              "core_problem": "...",
              "activities": [
                 {"id": 1, "name": "Start...", "time": "..."},
                 {"id": 2, "name": "Explore...", "time": "..."},
                 {"id": 3, "name": "Practice...", "time": "..."},
                 {"id": 4, "name": "Apply...", "time": "..."}
              ]
           }
        }
        \`\`\`
        
        OUTPUT LANGUAGE: VIETNAMESE`;
        break;

      case "setup":
        expectedContentKey = "muc_tieu_kien_thuc"; // Representative key
        specificPrompt = `TASK: Create the OBJECTIVES and PREPARATION section for Grade ${grade}.
        - Knowledge Objectives (muc_tieu_kien_thuc)
        - Competencies (muc_tieu_nang_luc)
        - Qualities (muc_tieu_pham_chat)
        - Teacher Preparation (gv_chuan_bi)
        - Student Preparation (hs_chuan_bi)
        
        FORMAT GUIDELINE (HYBRID):
        1. Write metadata first (Frontmatter):
        ma_chu_de: "..."
        ten_bai: "..."
        muc_tieu_nang_luc: "..."
        muc_tieu_pham_chat: "..."
        gv_chuan_bi: "..."
        hs_chuan_bi: "..."
        tich_hop_nls: "..."
        tich_hop_dao_duc: "..."
        
        2. Then write the MAIN CONTENT (muc_tieu_kien_thuc) as pure Markdown.
        
        OUTPUT LANGUAGE: VIETNAMESE`;
        break;

      case "khởi động":
      case "khám phá":
      case "luyện tập":
      case "vận dụng":
        const sectionMap = {
          "khởi động": "hoat_dong_khoi_dong",
          "khám phá": "hoat_dong_kham_pha",
          "luyện tập": "hoat_dong_luyen_tap",
          "vận dụng": "hoat_dong_van_dung"
        };
        const sectionKey = sectionMap[section];
        expectedContentKey = sectionKey;

        // CHIẾN LƯỢC 4.2: CHAIN OF DENSITY & ATOMIC DECOMPOSITION
        // Chia nhỏ thành 3-4 sub-tasks cho mỗi phần để đạt độ dài 60-80 trang
        let subTasks: string[] = [];
        if (section === "khám phá") {
          subTasks = [
            "GĐ 1: Dẫn dắt, đặt vấn đề & Khai phóng tư duy (Sincere Start)",
            "GĐ 2: Phân tích kiến thức trọng tâm & Hình thành khái niệm (Deep Content)",
            "GĐ 3: Mở rộng, liên hệ thực tế & Tích hợp liên môn (Expansion)",
            "GĐ 4: Tổng kết & Chuyản giao nhiệm vụ (Closure)"
          ];
        } else if (section === "luyện tập") {
          subTasks = [
            "GĐ 1: Hệ thống câu hỏi trắc nghiệm & Tự luận củng cố",
            "GĐ 2: Hướng dẫn giải chi tiết & Xử lý sai lầm thường gặp",
            "GĐ 3: Phiếu học tập & Công cụ đánh giá (Rubric/Checklist)"
          ];
        } else {
          subTasks = [`GĐ CHÍNH: ${section.toUpperCase()}`];
        }

        let combinedOutput = "";
        let metaData: any = {};
        const blueprint = context?.blueprint || "No blueprint";

        for (const [index, taskTitle] of subTasks.entries()) {
          console.log(`[ChainOfDensity] Step ${index + 1}/${subTasks.length}: ${taskTitle}`);

          const prevContext = combinedOutput.length > 2000
            ? `...${combinedOutput.substring(combinedOutput.length - 1500)}`
            : combinedOutput;

          const microPrompt = `BẠN LÀ CHUYÊN GIA SƯ PHẠM CAO CẤP. Hãy viết ${taskTitle}.
          - NỀN TẢNG (Blueprint): ${JSON.stringify(blueprint)}
          - TIẾP NỐI TỪ: ${prevContext}
          
          REQUIREMENTS: 
          1. Viết cực kỳ chi tiết, từng lời nói của giáo viên (GV: "...") và hành động của học sinh.
          2. Độ dài phần này phải đạt ít nhất 800-1000 từ.
          3. Sử dụng cấu trúc [COT_1]...[/COT_1] và [COT_2]...[/COT_2].
          
          OUTPUT LANGUAGE: VIETNAMESE`;

          const chunk = await callGeminiWithRetry(
            `${optimizedBasePrompt}\n\n${microPrompt}`,
            model || "gemini-1.5-flash-001"
          );

          combinedOutput += `\n<!-- Subtask: ${taskTitle} -->\n${chunk}`;

          if (index === 0) {
            try { metaData = parseGeminiJSON(chunk, sectionKey); } catch (e) { }
          }
        }

        return {
          success: true,
          data: {
            ...metaData,
            [sectionKey]: combinedOutput
          }
        };

      case "shdc_shl":
        expectedContentKey = "shdc_shl_combined";
        let calculatorWeeks = 4;
        try {
          const safeGrade = Number.parseInt(grade) || 10;
          const safeMonth = month || 9;
          const safeChuDe = MONTH_TO_CHU_DE[safeMonth] || 1;
          const ppctData = getPPCTChuDe(safeGrade as 10 | 11 | 12, safeChuDe);
          if (ppctData && ppctData.tong_tiet) {
            calculatorWeeks = Math.ceil(ppctData.tong_tiet / 3);
          }
        } catch (err) {
          calculatorWeeks = 4;
        }

        specificPrompt = `TASK: Design EXTREMELY DETAILED activities for FLAG SALUTE (SHDC) and CLASS MEETING (SHL) for ${calculatorWeeks} WEEKS.
        - **SHDC (Sinh hoạt dưới cờ):** Draft a complete 4-week program. Each week must have: 1. Specific Objectives, 2. Detailed Ceremony Script, 3. Educational Message (at least 300 words per week).
        - **SHL (Sinh hoạt lớp):** Draft a complete 4-week program. Each week must follow 4 pedagogical steps: 1. Review, 2. Main Topic Activity (with Teacher Script & Student Actions), 3. Situational Coaching, 4. Planning for next week.
        
        FORMAT GUIDELINE (ROBUST):
        I will parse this using markers [SHDC_DATA]...[/SHDC_DATA] and [SHL_DATA]...[/SHL_DATA].
        
        OUTPUT LANGUAGE: VIETNAMESE`;
        break;

      case "preparation":
        expectedContentKey = "noi_dung_chuan_bi";
        specificPrompt = `TASK: Draft the PREPARATION CONTENT FOR THE NEXT TOPIC. 
        Focus on: Homework, Research tasks, and Materials to prepare.`;
        break;

      case "final":
        expectedContentKey = "ho_so_day_hoc";
        // BƯỚC 7: MAP-REDUCE SUMMARIZATION
        console.log("[v0] Triển khai Map-Reduce cho Bước 7...");
        const summaries = [];
        if (context.hoat_dong_khoi_dong) summaries.push("Khởi động: " + await summarizeContent(context.hoat_dong_khoi_dong, 100));
        if (context.hoat_dong_kham_pha) summaries.push("Khám phá: " + await summarizeContent(context.hoat_dong_kham_pha, 150));
        if (context.hoat_dong_luyen_tap) summaries.push("Luyện tập: " + await summarizeContent(context.hoat_dong_luyen_tap, 150));

        specificPrompt = `TASK: Dựa trên tóm tắt bài dạy:
        ${summaries.join("\n")}
        
        Hãy tạo:
        1. Hồ sơ dạy học (ho_so_day_hoc): Danh mục tài liệu, link tham khảo, slide...
        2. Hướng dẫn về nhà (huong_dan_ve_nha): Nhiệm vụ cụ thể, linh hoạt.
        
        FORMAT: JSON {"ho_so_day_hoc": "...", "huong_dan_ve_nha": "..."}`;
        break;
    }

    const finalPrompt = `${optimizedBasePrompt}\n\n============================================================\n${specificPrompt}\n\nOUTPUT LANGUAGE: VIETNAMESE`;

    console.log(`[v0] Generating lesson section: ${section}...`);
    const text = await callGeminiWithRetry(
      finalPrompt,
      model || "gemini-1.5-flash", // Dùng 1.5-flash mặc định để đảm bảo ổn định
      2,
      lessonFile ? [lessonFile] : undefined
    );

    let data = parseGeminiJSON(text, expectedContentKey);

    // Special handling for shdc_shl split logic
    if (section === "shdc_shl") {
      const combined = text;
      const shdcMatch = combined.match(/\[SHDC_DATA\]([\s\S]*?)\[\/SHDC_DATA\]/);
      const shlMatch = combined.match(/\[SHL_DATA\]([\s\S]*?)\[\/SHL_DATA\]/);

      data = {
        shdc: shdcMatch ? removeMarkdownBold(shdcMatch[1].trim()) : (data.shdc || ""),
        shl: shlMatch ? removeMarkdownBold(shlMatch[1].trim()) : (data.shl || "")
      };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error(`[v0] Error generating ${section}:`, error.message);
    return { success: false, error: error.message };
  }
}

export async function generateAIContent(
  prompt: string
): Promise<{ success: boolean; content?: string; error?: string }> {
  const apiKeys = getApiKeys();

  if (apiKeys.length === 0) {
    return {
      success: false,
      error: "API Key chưa được cấu hình",
    };
  }

  try {
    console.log("[v0] Calling Gemini API...");

    const text = await callGeminiWithRetry(prompt);

    console.log("[v0] Gemini API response received, length:", text.length);

    return {
      success: true,
      content: removeMarkdownBold(text),
    };
  } catch (error: any) {
    console.error("[v0] Gemini generation error:", error);
    return {
      success: false,
      error: error?.message || "Lỗi khi gọi Gemini API",
    };
  }
}

export async function generateEventScript(
  grade: string,
  theme: string,
  customInstructions?: string
): Promise<{
  success: boolean;
  data?: {
    ten_chu_de: string;
    nang_luc: string;
    pham_chat: string;
    muc_dich_yeu_cau: string;
    kich_ban_chi_tiet: string;
    thong_diep_ket_thuc: string;
  };
  error?: string;
}> {
  const apiKeys = getApiKeys();

  if (apiKeys.length === 0) {
    return {
      success: false,
      error: "API Key chưa được cấu hình",
    };
  }

  try {
    let prompt = getEventPrompt(grade, theme);

    if (customInstructions && customInstructions.trim()) {
      prompt += `\n\nYÊU CẦU BỔ SUNG TỪ GIÁO VIÊN:\n${customInstructions}\n\nLưu ý: Hãy tích hợp các yêu cầu trên vào kịch bản một cách sáng tạo và phù hợp với đối tượng học sinh.`;
    }

    console.log("[v0] Calling Gemini API for event script...");

    const text = await callGeminiWithRetry(prompt);
    console.log("[v0] Event script response received, length:", text.length);

    const data = parseGeminiJSON(text);
    console.log("[v0] Event script JSON parsed successfully");

    return {
      success: true,
      data: {
        ten_chu_de: data.ten_chu_de || theme,
        nang_luc: data.nang_luc || "",
        pham_chat: data.pham_chat || "",
        muc_dich_yeu_cau: data.muc_dich_yeu_cau || "",
        kich_ban_chi_tiet: data.kich_ban_chi_tiet || "",
        thong_diep_ket_thuc: data.thong_diep_ket_thuc || "",
      },
    };
  } catch (error: any) {
    console.error("[v0] Event script generation error:", error.message);
    return {
      success: false,
      error: error?.message || "Lỗi khi tạo kịch bản sự kiện",
    };
  }
}

export async function auditLessonPlan(
  lessonData: any,
  grade: string,
  topic: string
): Promise<{ success: boolean; audit?: string; error?: string }> {
  const apiKeys = getApiKeys();

  if (apiKeys.length === 0) {
    return {
      success: false,
      error: "API Key chưa được cấu hình",
    };
  }

  try {
    const prompt = `
BẠN LÀ MỘT CHUYÊN GIA KIỂM ĐỊNH SƯ PHẠM CAO CẤP.
Nhiệm vụ: Đánh giá Kế hoạch bài dạy (KHBD) dưới đây dựa trên tiêu chuẩn Công văn 5512 và các mục tiêu phát triển năng lực của Bộ GD&ĐT.

THÔNG TIN KHBD:
- Khối: ${grade}
- Chủ đề: ${topic}
- Nội dung chi tiết: ${JSON.stringify(lessonData, null, 2)}

TIÊU CHÍ KIỂM ĐỊNH:
1. ĐÚNG CẤU TRÚC 5512: Các hoạt động đã đủ 4 bước (Chuyển giao, Thực hiện, Báo cáo, Kết luận) chưa?
2. TÍNH KHẢ THI: Các nhiệm vụ có phù hợp với thời lượng và đặc điểm tâm lý học sinh lớp ${grade} không?
3. SẢN PHẨM ĐẦU RA: Sản phẩm dự kiến có cụ thể và có thể đánh giá được không?
4. TÍCH HỢP (QUAN TRỌNG): Năng lực số và Giáo dục Đạo đức đã được lồng ghép một cách tự nhiên ("thẩm thấu tự nhiên") hay còn gượng ép?

HÃY ĐƯA RA BẢN ĐÁNH GIÁ CHI TIẾT THEO CẤU TRÚC:
- [ƯU ĐIỂM]: Những điểm tốt nhất.
- [HẠN CHẾ & LỖI]: Những điểm cần chỉnh sửa ngay.
- [ĐIỂM SƯ PHẠM]: Gợi ý để bài dạy "sáng tạo" và "bay bổng" hơn.
- [KẾT LUẬN]: ĐẠT hay CẦN CHỈNH SỬA?

Lưu ý: Viết bằng ngôn ngữ chuyên môn, khích lệ nhưng khắt khe về chất lượng. Không dùng Markdown đậm (**).
`;

    console.log("[v0] Calling Gemini API for pedagogical audit...");
    const text = await callGeminiWithRetry(prompt);

    return {
      success: true,
      audit: removeMarkdownBold(text),
    };
  } catch (error: any) {
    console.error("[v0] Audit generation error:", error.message);
    return {
      success: false,
      error: error?.message || "Lỗi khi kiểm định sư phạm",
    };
  }
}


export async function generateAssessmentPlan(
  grade: string,
  term: string,
  productType: string,
  topic: string,
  model?: string
): Promise<{
  success: boolean;
  data?: {
    ten_ke_hoach: string;
    muc_tieu: string[];
    noi_dung_nhiem_vu: string;
    hinh_thuc_to_chuc: string;
    ma_tran_dac_ta: Array<{ muc_do: string; mo_ta: string }>;
    bang_kiem_rubric: Array<{ tieu_chi: string; trong_so: string; muc_do: any }>;
    loi_khuyen: string;
  };
  error?: string;
}> {
  const apiKeys = getApiKeys();

  if (apiKeys.length === 0) {
    return {
      success: false,
      error: "API Key chưa được cấu hình",
    };
  }

  try {
    const prompt = getAssessmentPrompt(grade, term, productType, topic);
    console.log("[v0] Calling Gemini API for Assessment Plan...");

    const text = await callGeminiWithRetry(prompt, model || "gemini-1.5-flash");
    console.log("[v0] Assessment Plan response received, length:", text.length);

    const data = parseGeminiJSON(text);
    console.log("[v0] Assessment JSON parsed successfully");

    return {
      success: true,
      data: {
        ten_ke_hoach: data.ten_ke_hoach || `Kế hoạch kiểm tra ${term}`,
        muc_tieu: Array.isArray(data.muc_tieu) ? data.muc_tieu : [data.muc_tieu],
        noi_dung_nhiem_vu: data.noi_dung_nhiem_vu || "",
        hinh_thuc_to_chuc: data.hinh_thuc_to_chuc || "",
        ma_tran_dac_ta: Array.isArray(data.ma_tran_dac_ta) ? data.ma_tran_dac_ta : [],
        bang_kiem_rubric: Array.isArray(data.bang_kiem_rubric) ? data.bang_kiem_rubric : [],
        loi_khuyen: data.loi_khuyen || "",
      },
    };
  } catch (error: any) {
    console.error("[v0] Assessment generation error:", error.message);
    return {
      success: false,
      error: error?.message || "Lỗi khi tạo kế hoạch kiểm tra",
    };
  }
}

export async function generateNCBH(
  grade: string,
  topic: string,
  customInstructions?: string,
  model?: string
): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  const apiKeys = getApiKeys();

  if (apiKeys.length === 0) {
    return {
      success: false,
      error: "API Key chưa được cấu hình",
    };
  }

  try {
    let prompt = `${NCBH_ROLE}\n\n${NCBH_TASK}\n\nTHÔNG TIN ĐẦU VÀO:\n- Khối: ${grade}\n- Tên bài học nghiên cứu: ${topic}`;

    if (customInstructions && customInstructions.trim()) {
      prompt += `\n- Ghi chú/Tình huống quan sát thực tế: ${customInstructions}`;
    }

    console.log("[v0] Calling Gemini API for NCBH...");
    const text = await callGeminiWithRetry(prompt, model || "gemini-1.5-flash");
    console.log("[v0] NCBH response received, length:", text.length);

    const data = parseGeminiJSON(text);
    console.log("[v0] NCBH JSON parsed successfully");

    return {
      success: true,
      data: {
        ten_bai: data.ten_bai || topic,
        ly_do_chon: data.ly_do_chon || "",
        muc_tieu: data.muc_tieu || "",
        chuoi_hoat_dong: data.chuoi_hoat_dong || "",
        phuong_an_ho_tro: data.phuong_an_ho_tro || "",
        chia_se_nguoi_day: data.chia_se_nguoi_day || "",
        nhan_xet_nguoi_du: data.nhan_xet_nguoi_du || "",
        nguyen_nhan_giai_phap: data.nguyen_nhan_giai_phap || "",
        bai_hoc_kinh_nghiem: data.bai_hoc_kinh_nghiem || "",
      },
    };
  } catch (error: any) {
    console.error("[v0] NCBH generation error:", error.message);
    return {
      success: false,
      error: error?.message || "Lỗi khi tạo nội dung Nghiên cứu bài học",
    };
  }
}
