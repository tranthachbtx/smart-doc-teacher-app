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

  throw new Error("ÄÃ£ háº¿t quota API. Vui lÃ²ng Ä‘á»£i 1 phÃºt rá»“i thá»­ láº¡i, hoáº·c kiá»ƒm tra billing táº¡i https://ai.google.dev")
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
      error: "API Key khÃ´ng Ä‘Æ°á»£c cáº¥u hÃ¬nh. Vui lÃ²ng thÃªm GEMINI_API_KEY vÃ o Vars.",
      logs: ["Lá»—i: API Key khÃ´ng Ä‘Æ°á»£c cáº¥u hÃ¬nh"],
    }
  }

  try {
    logs.push("Báº¯t Ä‘áº§u xá»­ lÃ½ file giÃ¡o Ã¡n...")

    // Import mammoth for reading docx
    const mammoth = await import("mammoth")

    // Convert ArrayBuffer to Buffer for mammoth
    const buffer = Buffer.from(fileBuffer)

    logs.push("Äang Ä‘á»c ná»™i dung file Word...")
    const result = await mammoth.extractRawText({ buffer })
    const documentText = result.value

    logs.push(`ÄÃ£ Ä‘á»c Ä‘Æ°á»£c ${documentText.length} kÃ½ tá»± tá»« file`)
    logs.push(`Chá»§ Ä‘á»: ${theme} - Khá»‘i: ${grade}`)

    // Call Gemini to analyze and generate content
    const genAI = new GoogleGenAI({ apiKey })

    const prompt = `Báº¡n lÃ  ChuyÃªn gia TÃ¡i cáº¥u trÃºc GiÃ¡o Ã¡n (Pedagogical Surgeon).
    
THÃ”NG TIN: Khá»‘i ${grade}, Chá»§ Ä‘á» "${theme}".

Ná»˜I DUNG GIÃO ÃN Cá»¦A GIÃO VIÃŠN:
---
${documentText.substring(0, 10000)}
---

NHIá»†M Vá»¤: KHÃ”NG CHá»ˆ LÃ€ TÃCH Há»¢P, HÃƒY "NÃ‚NG Cáº¤P" GIÃO ÃN QUA 2 Ná»˜I DUNG SAU:

1. TÃI Cáº¤U TRÃšC NÄ‚NG Lá»°C Sá» (tich_hop_nls):
   - PhÃ¢n tÃ­ch hoáº¡t Ä‘á»™ng cÅ©, tÃ¬m chá»— cÃ³ thá»ƒ Ä‘Æ°a cÃ´ng cá»¥ sá»‘ vÃ o Ä‘á»ƒ HS thá»±c hÃ nh (Canva, AI, Mentimeter...).
   - Viáº¿t ká»‹ch báº£n chi tiáº¿t: GV hÆ°á»›ng dáº«n gÃ¬? HS thao tÃ¡c gÃ¬? Sáº£n pháº©m sá»‘ lÃ  gÃ¬?
   - Äáº£m báº£o theo chuáº©n ThÃ´ng tÆ° 02/2025.

2. NÃ‚NG Táº¦M Äáº O Äá»¨C & GIÃ TRá»Š (tich_hop_dao_duc):
   - TÃ¬m cÃ¡c tÃ¬nh huá»‘ng trong giÃ¡o Ã¡n cÅ© vÃ  lá»“ng ghÃ©p pháº£n biá»‡n Ä‘áº¡o Ä‘á»©c.
   - XÃ¢y dá»±ng thÃ´ng Ä‘iá»‡p sá»‘ng vÃ  cam káº¿t hÃ nh Ä‘á»™ng cá»¥ thá»ƒ cho HS khá»‘i ${grade}.
   - Viáº¿t dÆ°á»›i dáº¡ng ká»‹ch báº£n Ä‘á»‘i thoáº¡i hoáº·c bÃ i táº­p tÃ¬nh huá»‘ng chi tiáº¿t.

OUTPUT JSON:
{
  "tich_hop_nls": "Ná»™i dung nÃ¢ng cáº¥p nÄƒng lá»±c sá»‘ chi tiáº¿t...",
  "tich_hop_dao_duc": "Ná»™i dung nÃ¢ng cáº¥p Ä‘áº¡o Ä‘á»©c chi tiáº¿t..."
}`

    logs.push("Äang gá»i AI Ä‘á»ƒ phÃ¢n tÃ­ch giÃ¡o Ã¡n...")

    const text = await callGeminiWithRetry(genAI, prompt)

    logs.push("ÄÃ£ nháº­n Ä‘Æ°á»£c pháº£n há»“i tá»« AI")

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
        tich_hop_nls: nlsMatch?.[1] || "ChÆ°a cÃ³ ná»™i dung",
        tich_hop_dao_duc: ddMatch?.[1] || "ChÆ°a cÃ³ ná»™i dung",
      }
    }

    logs.push("ÄÃ£ parse ná»™i dung AI thÃ nh cÃ´ng")

    // Process the document using docxtemplater
    const PizZip = (await import("pizzip")).default
    const Docxtemplater = (await import("docxtemplater")).default

    let zip
    try {
      zip = new PizZip(buffer)
    } catch {
      // If template can't be parsed, return content without modifying file
      logs.push("KhÃ´ng thá»ƒ xá»­ lÃ½ file template, tráº£ vá» ná»™i dung AI")
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
      logs.push("ÄÃ£ inject ná»™i dung vÃ o template")
    } catch (renderError) {
      logs.push("Template khÃ´ng cÃ³ placeholder chuáº©n, tráº£ vá» ná»™i dung AI riÃªng")
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

    logs.push("HoÃ n thÃ nh xá»­ lÃ½ file!");

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
    logs.push(`Lá»—i: ${error.message}`)
    return {
      success: false,
      error: error?.message || "Lá»—i khi xá»­ lÃ½ giÃ¡o Ã¡n",
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
  return processLessonPlanWithSmartInjection(fileBuffer, "10", "Chá»§ Ä‘á» chung", reviewMode)
}
