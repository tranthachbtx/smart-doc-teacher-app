"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { HDTN_CURRICULUM } from "@/lib/hdtn-curriculum";
import {
  getMeetingPrompt,
  getLessonIntegrationPrompt,
  getEventPrompt,
} from "@/lib/prompts/ai-prompts";
import { getAssessmentPrompt } from "@/lib/prompts/assessment-prompts";
import { getKHDHPrompt } from "@/lib/prompts/khdh-prompts";
import { NCBH_ROLE, NCBH_TASK } from "@/lib/prompts/ncbh-prompts";

const MODELS = [
  "gemini-2.0-flash-exp",
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
  "gemini-1.5-pro",
];

function getApiKeys(): string[] {
  const keys: string[] = [];
  const primaryKey = process.env.GEMINI_API_KEY;
  const backupKey = process.env.GEMINI_API_KEY_2;
  const backupKey3 = process.env.GEMINI_API_KEY_3;

  if (primaryKey && primaryKey.trim() !== "") {
    keys.push(primaryKey);
  }
  if (backupKey && backupKey.trim() !== "") {
    keys.push(backupKey);
  }
  if (backupKey3 && backupKey3.trim() !== "") {
    keys.push(backupKey3);
  }

  return keys;
}

async function callGeminiWithRetry(
  prompt: string,
  preferredModel?: string,
  maxRetries = 2,
  images?: Array<{ mimeType: string; data: string }>
): Promise<string> {
  // Get and shuffle API keys to distribute load during parallel calls
  const apiKeys = getApiKeys().sort(() => Math.random() - 0.5);

  if (apiKeys.length === 0) {
    throw new Error(
      "Chưa cấu hình API Key. Vui lòng thêm GEMINI_API_KEY vào Vars."
    );
  }

  let lastError: Error | null = null;
  const modelsToTry = preferredModel
    ? [preferredModel, ...MODELS.filter((m) => m !== preferredModel)]
    : MODELS;

  // Try each API key
  keyLoop: for (let keyIndex = 0; keyIndex < apiKeys.length; keyIndex++) {
    const apiKey = apiKeys[keyIndex];
    const genAI = new GoogleGenerativeAI(apiKey);
    const keyLabel = keyIndex === 0 ? "Primary" : "Backup";

    console.log(`[v0] Using ${keyLabel} API Key...`);

    // Try each model with current API key
    for (const model of modelsToTry) {
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          console.log(
            `[v0] [${keyLabel}] Trying model: ${model}, attempt: ${attempt + 1}`
          );

          // Build contents array for multimodal support
          const contents: any[] = [{ text: prompt }];
          if (images && images.length > 0) {
            images.forEach((img) => {
              contents.push({
                inlineData: {
                  mimeType: img.mimeType,
                  data: img.data,
                },
              });
            });
          }

          const modelInstance = genAI.getGenerativeModel({ model });
          const result = await modelInstance.generateContent({
            contents: [{ role: "user", parts: contents }],
            generationConfig: {
              maxOutputTokens: 8192,
              temperature: 0.7,
            }
          });
          const response = await result.response;

          // Extract text from response - SDK uses getter property
          let text: string = "";
          try {
            const rawText = response.text;
            text = typeof rawText === 'string' ? rawText : "";
          } catch (e) {
            console.log(`[v0] [${keyLabel}] Error extracting text:`, e);
            text = "";
          }

          if (!text) {
            throw new Error("Empty response from Gemini API");
          }

          console.log(`[v0] [${keyLabel}] Success with model: ${model}`);
          return text;
        } catch (error: any) {
          lastError = error;
          const errorMsg = error?.message || "";
          const isQuotaError =
            errorMsg.includes("429") ||
            errorMsg.includes("quota") ||
            errorMsg.includes("RESOURCE_EXHAUSTED") ||
            error.status === 429;

          const isModelNotFound =
            errorMsg.includes("404") ||
            errorMsg.includes("not found") ||
            error.status === 404;

          if (isModelNotFound) {
            console.log(
              `[v0] [${keyLabel}] Model ${model} not available on this key, trying next model...`
            );
            break;
          }

          if (isQuotaError) {
            // If we have more keys to try, skip this key entirely for now
            if (keyIndex < apiKeys.length - 1) {
              console.log(`[v0] [${keyLabel}] Quota exhausted, switching to NEXT API KEY...`);
              continue keyLoop;
            }

            const retryMatch = errorMsg.match(/retry in (\d+)/i);
            const retryDelay = retryMatch
              ? Number.parseInt(retryMatch[1]) * 1000
              : (attempt + 1) * 5000;

            if (attempt < maxRetries - 1) {
              console.log(
                `[v0] [${keyLabel}] Quota limit hit (last key), waiting ${retryDelay / 1000
                }s before retry...`
              );
              await new Promise((resolve) => setTimeout(resolve, retryDelay));
              continue;
            } else {
              console.log(
                `[v0] [${keyLabel}] Model ${model} quota exhausted, trying next model...`
              );
              break;
            }
          }

          // For other errors, try next model
          console.log(
            `[v0] [${keyLabel}] Error with model ${model}:`,
            errorMsg.substring(0, 100)
          );
          break;
        }
      }
    }

    // All models failed with current key, try next key
    if (keyIndex < apiKeys.length - 1) {
      console.log(
        `[v0] ${keyLabel} API Key exhausted all models, switching to next key...`
      );
    }
  }

  throw new Error(
    `Đã hết quota API cho tất cả các key và model. ` +
    `Vui lòng đợi 1-2 phút rồi thử lại. ` +
    `Hoặc thêm GEMINI_API_KEY_3 dự phòng vào Vars.`
  );
}

function removeMarkdownBold(text: string): string {
  if (!text || typeof text !== 'string') return text ?? "";
  return text.replace(/\*\*/g, "").replace(/\*/g, "");
}

function parseGeminiJSON(text: string): any {
  console.log("[v0] Raw response (first 500 chars):", (text || "").substring(0, 500));

  if (!text) {
    throw new Error("Không nhận được nội dung từ Gemini (Empty response)");
  }

  const cleaned = text
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  const startIdx = cleaned.indexOf("{");
  const endIdx = cleaned.lastIndexOf("}");

  if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
    console.log("[v0] No valid JSON brackets found");
    throw new Error("Không tìm thấy JSON trong response");
  }

  let jsonStr = cleaned.substring(startIdx, endIdx + 1);

  try {
    const result = JSON.parse(jsonStr);
    for (const key of Object.keys(result)) {
      if (typeof result[key] === "string") {
        result[key] = removeMarkdownBold(result[key]);
      }
    }
    return result;
  } catch (e) {
    console.log("[v0] Direct parse failed, attempting fixes...");
  }

  // Common fix: Unescaped newlines in JSON strings
  // This is a naive heuristic but often helps with LLM output
  // We try to escape newlines that are NOT followed by a control character or key start
  jsonStr = jsonStr.replace(/(?<!\\)\n/g, "\\n");

  jsonStr = jsonStr.replace(/"([^"]*?)"/g, (match, content) => {
    const fixed = content
      .replace(/\\/g, "\\\\")
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/\t/g, "\\t")
      .replace(/"/g, '\\"');
    return `"${fixed}"`;
  });

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
      "loi_khuyen"
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
  image?: { mimeType: string; data: string }
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
        activitySuggestions
      )
      : getLessonIntegrationPrompt(grade, lessonTopic);

    if (!fullPlan && customInstructions && customInstructions.trim()) {
      prompt += `\n\nYÊU CẦU BỔ SUNG TỪ GIÁO VIÊN:\n${customInstructions}\n\nLưu ý: Hãy tích hợp các yêu cầu trên vào nội dung một cách hợp lý và khoa học.`;
    }

    if (image) {
      prompt += `\n\nYÊU CẦU OCR & THIẾT KẾ GD:\nTôi đã gửi kèm hình ảnh nội dung bài học từ Sách giáo khoa (SGK). Hãy phân tích kỹ nội dung, hình ảnh, các câu hỏi và hoạt động trong trang sách này để trích xuất kiến thức trọng tâm và thiết kế các hoạt động giáo dục (Khởi động, Khám phá, Luyện tập, Vận dụng) một cách sát thực tế nhất. Đảm bảo giáo án 2 cột phản ánh đúng tinh thần của bài học trong SGK.`;
    }

    console.log(
      "[v0] Calling Gemini API for lesson plan...",
      fullPlan ? "(Full Plan)" : "(Integration Only)",
      image ? "(With Image/OCR)" : ""
    );

    const text = await callGeminiWithRetry(
      prompt,
      model || "gemini-2.0-flash-exp",
      2,
      image ? [image] : undefined
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
  section: "setup" | "khởi động" | "khám phá" | "luyện tập" | "vận dụng" | "shdc_shl" | "final",
  context?: any,
  duration?: string,
  customInstructions?: string,
  tasks?: Array<{ name: string; description: string }>,
  month?: number,
  activitySuggestions?: { shdc?: string; hdgd?: string; shl?: string },
  model?: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const basePrompt = getKHDHPrompt(
      grade,
      lessonTopic,
      duration || "2 tiết",
      customInstructions,
      tasks,
      month,
      activitySuggestions
    );

    let specificPrompt = "";
    let outputFormat = "";

    switch (section) {
      case "setup":
        specificPrompt = `NHIỆM VỤ: Hãy tạo phần MỤC TIÊU và CHUẨN BỊ cho bài học này.`;
        outputFormat = `{
          "ma_chu_de": "...",
          "ten_bai": "...",
          "muc_tieu_kien_thuc": "...",
          "muc_tieu_nang_luc": "...",
          "muc_tieu_pham_chat": "...",
          "gv_chuan_bi": "...",
          "hs_chuan_bi": "...",
          "tich_hop_nls": "...",
          "tich_hop_dao_duc": "..."
        }`;
        break;
      case "khởi động":
      case "khám phá":
      case "luyện tập":
      case "vận dụng":
        const sectionKey = section === "khởi động" ? "hoat_dong_khoi_dong" :
          section === "khám phá" ? "hoat_dong_kham_pha" :
            section === "luyện tập" ? "hoat_dong_luyen_tap" : "hoat_dong_van_dung";

        specificPrompt = `NHIỆM VỤ: Hãy thiết kế CHI TIẾT hoạt động [${section.toUpperCase()}].
        Lưu ý: Dựa trên Mục tiêu bài học: ${context?.muc_tieu_kien_thuc || ""}.
        Bắt buộc sử dụng định dạng [COT_1]...[/COT_1] và [COT_2]...[/COT_2].`;

        outputFormat = `{
          "${sectionKey}": "[COT_1]...[/COT_1]\\n\\n[COT_2]...[/COT_2]"
        }`;
        break;
      case "shdc_shl":
        specificPrompt = `NHIỆM VỤ: Hãy thiết kế phần SINH HOẠT DƯỚI CỜ (SHDC) và SINH HOẠT LỚP (SHL) chi tiết cho 4 tuần của chủ đề này.`;
        outputFormat = `{
          "shdc": "...",
          "shl": "..."
        }`;
        break;
      case "final":
        specificPrompt = `NHIỆM VỤ: Hãy tạo phần HỒ SƠ DẠY HỌC (Phụ lục, Phiếu học tập, Rubric) và HƯỚNG DẪN VỀ NHÀ.`;
        outputFormat = `{
          "ho_so_day_hoc": "...",
          "huong_dan_ve_nha": "..."
        }`;
        break;
    }

    const finalPrompt = `${basePrompt}\n\n============================================================\nYÊU CẦU RIÊNG CHO GIAI ĐOẠN NÀY:\n${specificPrompt}\n\nCHỈ TRẢ VỀ JSON THEO CẤU TRÚC SAU:\n${outputFormat}`;

    console.log(`[v0] Generating lesson section: ${section}...`);
    const text = await callGeminiWithRetry(finalPrompt, model || "gemini-2.0-flash-exp");
    const data = parseGeminiJSON(text);

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
      error:
        "Chưa cấu hình API Key nào. Vui lòng thêm GEMINI_API_KEY vào Vars.",
    };
  }

  return {
    configured: true,
    primaryKey: hasPrimary,
    backupKey: hasBackup,
    backupKey2: hasBackup3,
  };
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
    const text = await callGeminiWithRetry(prompt, model || "gemini-2.0-flash-exp");
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
