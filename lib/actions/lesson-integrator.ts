"use server"

import { GoogleGenAI } from "@google/genai"

const PRIMARY_MODEL = "gemini-1.5-flash"
const FALLBACK_MODEL = "gemini-1.5-pro"

async function callGeminiWithRetry(genAI: GoogleGenAI, prompt: string, maxRetries = 2): Promise<string> {
  const models = [PRIMARY_MODEL, FALLBACK_MODEL]

  for (const model of models) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        console.log(`[v0] Trying model: ${model}, attempt: ${attempt + 1}`)
        const response = await genAI.models.generateContent({
          model,
          contents: prompt,
        })
        return response.text || ""
      } catch (error: any) {
        const isQuotaError =
          error?.message?.includes("429") ||
          error?.message?.includes("quota") ||
          error?.message?.includes("RESOURCE_EXHAUSTED")

        if (isQuotaError && attempt < maxRetries - 1) {
          const delay = (attempt + 1) * 5000
          console.log(`[v0] Quota error, waiting ${delay}ms before retry...`)
          await new Promise((resolve) => setTimeout(resolve, delay))
          continue
        }

        if (isQuotaError) {
          console.log(`[v0] Model ${model} quota exhausted, trying fallback...`)
          break
        }

        throw error
      }
    }
  }

  throw new Error("Đã hết quota API. Vui lòng đợi 1 phút rồi thử lại, hoặc kiểm tra billing tại https://ai.google.dev")
}

export async function processLessonPlanWithSmartInjection(
  fileBuffer: ArrayBuffer,
  grade: string,
  theme: string,
  reviewMode = false,
): Promise<{
  success: boolean
  data?: ArrayBuffer
  logs?: string[]
  error?: string
  generatedContent?: {
    tich_hop_nls?: string
    tich_hop_dao_duc?: string
  }
}> {
  const apiKey = process.env.GEMINI_API_KEY
  const logs: string[] = []

  if (!apiKey || apiKey.trim() === "") {
    return {
      success: false,
      error: "API Key không được cấu hình. Vui lòng thêm GEMINI_API_KEY vào Vars.",
      logs: ["Lỗi: API Key không được cấu hình"],
    }
  }

  try {
    logs.push("Bắt đầu xử lý file giáo án...")

    // Import mammoth for reading docx
    const mammoth = await import("mammoth")

    // Convert ArrayBuffer to Buffer for mammoth
    const buffer = Buffer.from(fileBuffer)

    logs.push("Đang đọc nội dung file Word...")
    const result = await mammoth.extractRawText({ buffer })
    const documentText = result.value

    logs.push(`Đã đọc được ${documentText.length} ký tự từ file`)
    logs.push(`Chủ đề: ${theme} - Khối: ${grade}`)

    // Call Gemini to analyze and generate content
    const genAI = new GoogleGenAI({ apiKey })

    const prompt = `Bạn là Chuyên gia Tái cấu trúc Giáo án (Pedagogical Surgeon).
    
THÔNG TIN: Khối ${grade}, Chủ đề "${theme}".

NỘI DUNG GIÁO ÁN CỦA GIÁO VIÊN:
---
${documentText.substring(0, 10000)}
---

NHIỆM VỤ: KHÔNG CHỈ LÀ TÍCH HỢP, HÃY "NÂNG CẤP" GIÁO ÁN QUA 2 NỘI DUNG SAU:

1. TÁI CẤU TRÚC NĂNG LỰC SỐ (tich_hop_nls):
   - Phân tích hoạt động cũ, tìm chỗ có thể đưa công cụ số vào để HS thực hành (Canva, AI, Mentimeter...).
   - Viết kịch bản chi tiết: GV hướng dẫn gì? HS thao tác gì? Sản phẩm số là gì?
   - Đảm bảo theo chuẩn Thông tư 02/2025.

2. NÂNG TẦM ĐẠO ĐỨC & GIÁ TRỊ (tich_hop_dao_duc):
   - Tìm các tình huống trong giáo án cũ và lồng ghép phản biện đạo đức.
   - Xây dựng thông điệp sống và cam kết hành động cụ thể cho HS khối ${grade}.
   - Viết dưới dạng kịch bản đối thoại hoặc bài tập tình huống chi tiết.

OUTPUT JSON:
{
  "tich_hop_nls": "Nội dung nâng cấp năng lực số chi tiết...",
  "tich_hop_dao_duc": "Nội dung nâng cấp đạo đức chi tiết..."
}`

    logs.push("Đang gọi AI để phân tích giáo án...")

    const text = await callGeminiWithRetry(genAI, prompt)

    logs.push("Đã nhận được phản hồi từ AI")

    // Extract JSON from response
    let jsonStr = text
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      jsonStr = jsonMatch[0]
    }

    // Clean and parse JSON
    jsonStr = jsonStr
      .replace(/[\x00-\x1F\x7F]/g, " ")
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "")
      .replace(/\t/g, " ")

    let aiData: { tich_hop_nls: string; tich_hop_dao_duc: string }
    try {
      aiData = JSON.parse(jsonStr)
    } catch {
      // Manual extraction fallback
      const nlsMatch = text.match(/tich_hop_nls["\s:]+["']([\s\S]+?)["']/)
      const ddMatch = text.match(/tich_hop_dao_duc["\s:]+["']([\s\S]+?)["']/)
      aiData = {
        tich_hop_nls: nlsMatch?.[1] || "Chưa có nội dung",
        tich_hop_dao_duc: ddMatch?.[1] || "Chưa có nội dung",
      }
    }

    logs.push("Đã parse nội dung AI thành công")

    // Process the document using docxtemplater
    const PizZip = (await import("pizzip")).default
    const Docxtemplater = (await import("docxtemplater")).default

    let zip
    try {
      zip = new PizZip(buffer)
    } catch {
      // If template can't be parsed, return content without modifying file
      logs.push("Không thể xử lý file template, trả về nội dung AI")
      return {
        success: true,
        logs,
        generatedContent: {
          tich_hop_nls: reviewMode ? `[AI GENERATED] ${aiData.tich_hop_nls}` : aiData.tich_hop_nls,
          tich_hop_dao_duc: reviewMode ? `[AI GENERATED] ${aiData.tich_hop_dao_duc}` : aiData.tich_hop_dao_duc,
        },
      }
    }

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      nullGetter: () => "",
    })

    // Prepare injection content
    let nlsContent = aiData.tich_hop_nls || ""
    let gdddContent = aiData.tich_hop_dao_duc || ""

    if (reviewMode) {
      nlsContent = `[AI GENERATED - REVIEW] ${nlsContent}`
      gdddContent = `[AI GENERATED - REVIEW] ${gdddContent}`
    }

    // Try to set data for common placeholders
    try {
      doc.setData({
        tich_hop_nls: nlsContent,
        tich_hop_dao_duc: gdddContent,
        nang_luc_so: nlsContent,
        giao_duc_dao_duc: gdddContent,
        NLS: nlsContent,
        GDDD: gdddContent,
        chu_de: theme,
        khoi: grade,
      })
      doc.render()
      logs.push("Đã inject nội dung vào template")
    } catch (renderError) {
      logs.push("Template không có placeholder chuẩn, trả về nội dung AI riêng")
      return {
        success: true,
        logs,
        generatedContent: {
          tich_hop_nls: nlsContent,
          tich_hop_dao_duc: gdddContent,
        },
      }
    }

    const outputBuffer = doc.getZip().generate({
      type: "nodebuffer",
      compression: "DEFLATE",
    });

    // Definitively convert Node Buffer to a clean, standard ArrayBuffer
    // We use Uint8Array to copy the data, ensuring it's not a SharedArrayBuffer
    const finalArrayBuffer = new Uint8Array(outputBuffer).buffer as ArrayBuffer;

    logs.push("Hoàn thành xử lý file!");

    return {
      success: true,
      data: finalArrayBuffer,
      logs,
      generatedContent: {
        tich_hop_nls: nlsContent,
        tich_hop_dao_duc: gdddContent,
      },
    }
  } catch (error: any) {
    console.error("[v0] Lesson integrator error:", error)
    logs.push(`Lỗi: ${error.message}`)
    return {
      success: false,
      error: error?.message || "Lỗi khi xử lý giáo án",
      logs,
    }
  }
}

// Keep old function for backward compatibility
export async function processLessonPlan(
  fileBuffer: ArrayBuffer,
  reviewMode = false,
): Promise<{
  success: boolean
  data?: ArrayBuffer
  logs?: string[]
  error?: string
}> {
  return processLessonPlanWithSmartInjection(fileBuffer, "10", "Chủ đề chung", reviewMode)
}
