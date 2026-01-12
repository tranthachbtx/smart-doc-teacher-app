/**
 * ðŸ§  AI Content Parser API
 * PhÃ¢n tÃ­ch ná»™i dung tá»« Gemini Pro vÃ  Ä‘iá»n vÃ o cÃ¡c textbox tÆ°Æ¡ng á»©ng
 */

import { NextRequest, NextResponse } from "next/server";
import { generateAIContent } from "@/lib/actions/gemini";

export async function POST(request: NextRequest) {
  try {
    const { content, context = "lesson_plan" } = await request.json();

    console.log("AI Parser API - Received content length:", content?.length);
    console.log("AI Parser API - Context:", context);

    if (!content) {
      return NextResponse.json(
        { error: "Vui lÃ²ng cung cáº¥p ná»™i dung cáº§n phÃ¢n tÃ­ch" },
        { status: 400 }
      );
    }

    // Prompt Ä‘á»ƒ phÃ¢n tÃ­ch ná»™i dung Gemini Pro
    const analysisPrompt = `Báº¡n lÃ  chuyÃªn gia phÃ¢n tÃ­ch giÃ¡o Ã¡n. HÃ£y phÃ¢n tÃ­ch ná»™i dung sau vÃ  trÃ­ch xuáº¥t cÃ¡c thÃ´ng tin theo Ä‘Ãºng cáº¥u trÃºc.

Ná»˜I DUNG Cáº¦N PHÃ‚N TÃCH:
${content}

YÃŠU Cáº¦U: Tráº£ vá» JSON vá»›i cÃ¡c trÆ°á»ng sau:
{
  "title": "TiÃªu Ä‘á» bÃ i há»c",
  "grade": "Khá»‘i lá»›p",
  "subject": "MÃ´n há»c",
  "duration": "Thá»i lÆ°á»£ng",
  "objectives": ["Má»¥c tiÃªu 1", "Má»¥c tiÃªu 2"],
  "preparation": ["Chuáº©n bá»‹ 1", "Chuáº©n bá»‹ 2"],
  "activities": [
    {
      "name": "TÃªn hoáº¡t Ä‘á»™ng 1",
      "content": "Ná»™i dung chi tiáº¿t hoáº¡t Ä‘á»™ng 1",
      "duration": "Thá»i lÆ°á»£ng"
    },
    {
      "name": "TÃªn hoáº¡t Ä‘á»™ng 2", 
      "content": "Ná»™i dung chi tiáº¿t hoáº¡t Ä‘á»™ng 2",
      "duration": "Thá»i lÆ°á»£ng"
    }
  ],
  "assessment": ["ÄÃ¡nh giÃ¡ 1", "ÄÃ¡nh giÃ¡ 2"],
  "homework": "BÃ i táº­p vá» nhÃ ",
  "notes": "Ghi chÃº thÃªm"
}

LÆ°u Ã½:
- Chá»‰ tráº£ vá» JSON, khÃ´ng cÃ³ text khÃ¡c
- Náº¿u khÃ´ng tÃ¬m tháº¥y thÃ´ng tin nÃ o, Ä‘á»ƒ trá»‘ng hoáº·c null
- PhÃ¢n tÃ­ch chÃ­nh xÃ¡c vÃ  Ä‘áº§y Ä‘á»§ nháº¥t cÃ³ thá»ƒ`;

    const result = await generateAIContent(analysisPrompt);

    console.log("AI Parser API - AI result success:", result.success);
    console.log("AI Parser API - AI content length:", result.content?.length);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Lá»—i khi phÃ¢n tÃ­ch ná»™i dung" },
        { status: 500 }
      );
    }

    // Parse JSON tá»« káº¿t quáº£
    let parsedData;
    try {
      // TÃ¬m JSON trong response
      const jsonMatch = result.content?.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
        console.log("AI Parser API - Parsed data keys:", Object.keys(parsedData || {}));
      } else {
        // Fallback: Tá»± táº¡o parsedData tá»« text náº¿u khÃ´ng tÃ¬m tháº¥y JSON
        console.log("AI Parser API - No JSON found, creating fallback structure");
        parsedData = {
          title: "Ná»™i dung tá»« Gemini Pro",
          objectives: [],
          preparation: [],
          activities: [],
          assessment: [],
          homework: "",
          notes: result.content?.substring(0, 500) || ""
        };
      }
    } catch (parseError) {
      console.error("AI Parser API - Parse error:", parseError);
      // Fallback khi parse lá»—i
      parsedData = {
        title: "Ná»™i dung tá»« Gemini Pro",
        objectives: [],
        preparation: [],
        activities: [],
        assessment: [],
        homework: "",
        notes: result.content?.substring(0, 500) || ""
      };
    }

    return NextResponse.json({
      success: true,
      data: parsedData,
      message: "PhÃ¢n tÃ­ch ná»™i dung thÃ nh cÃ´ng!"
    });

  } catch (error) {
    console.error("Parse error:", error);
    return NextResponse.json(
      { error: "Lá»—i server khi phÃ¢n tÃ­ch ná»™i dung" },
      { status: 500 }
    );
  }
}
