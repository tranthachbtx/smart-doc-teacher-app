/**
 * 🧠 AI Content Parser API
 * Phân tích nội dung từ Gemini Pro và điền vào các textbox tương ứng
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
        { error: "Vui lòng cung cấp nội dung cần phân tích" },
        { status: 400 }
      );
    }

    // Prompt để phân tích nội dung Gemini Pro
    const analysisPrompt = `Bạn là chuyên gia phân tích giáo án. Hãy phân tích nội dung sau và trích xuất các thông tin theo đúng cấu trúc.

NỘI DUNG CẦN PHÂN TÍCH:
${content}

YÊU CẦU: Trả về JSON với các trường sau:
{
  "title": "Tiêu đề bài học",
  "grade": "Khối lớp",
  "subject": "Môn học",
  "duration": "Thời lượng",
  "objectives": ["Mục tiêu 1", "Mục tiêu 2"],
  "preparation": ["Chuẩn bị 1", "Chuẩn bị 2"],
  "activities": [
    {
      "name": "Tên hoạt động 1",
      "content": "Nội dung chi tiết hoạt động 1",
      "duration": "Thời lượng"
    },
    {
      "name": "Tên hoạt động 2", 
      "content": "Nội dung chi tiết hoạt động 2",
      "duration": "Thời lượng"
    }
  ],
  "assessment": ["Đánh giá 1", "Đánh giá 2"],
  "homework": "Bài tập về nhà",
  "notes": "Ghi chú thêm"
}

Lưu ý:
- Chỉ trả về JSON, không có text khác
- Nếu không tìm thấy thông tin nào, để trống hoặc null
- Phân tích chính xác và đầy đủ nhất có thể`;

    const result = await generateAIContent(analysisPrompt);

    console.log("AI Parser API - AI result success:", result.success);
    console.log("AI Parser API - AI content length:", result.content?.length);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Lỗi khi phân tích nội dung" },
        { status: 500 }
      );
    }

    // Parse JSON từ kết quả
    let parsedData;
    try {
      // Tìm JSON trong response
      const jsonMatch = result.content?.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
        console.log("AI Parser API - Parsed data keys:", Object.keys(parsedData || {}));
      } else {
        // Fallback: Tự tạo parsedData từ text nếu không tìm thấy JSON
        console.log("AI Parser API - No JSON found, creating fallback structure");
        parsedData = {
          title: "Nội dung từ Gemini Pro",
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
      // Fallback khi parse lỗi
      parsedData = {
        title: "Nội dung từ Gemini Pro",
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
      message: "Phân tích nội dung thành công!"
    });

  } catch (error) {
    console.error("Parse error:", error);
    return NextResponse.json(
      { error: "Lỗi server khi phân tích nội dung" },
      { status: 500 }
    );
  }
}
