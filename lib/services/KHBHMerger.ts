"use server";

/**
 * 🧬 KHBH MERGER ENGINE - HYBRID INTELLIGENCE 18.0
 * Chuyên trách việc "phẫu thuật" và trộn các "Chỉ thị chiến lược" từ Gemini Pro vào giáo án hiện tại.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

export interface MergedResult {
    success: boolean;
    content: any;
    auditTrail: string;
    badge: "Expert Integrated" | "Standard";
}

export async function surgicalMerge(currentPlan: any, expertDirectives: string): Promise<MergedResult> {
    console.log("[KHBHMerger] Starting Surgical Fusion via Server Action...");

    const apiKey = process.env.GEMINI_API_KEY || "";
    if (!apiKey) {
        return {
            success: false,
            content: currentPlan,
            auditTrail: "Lỗi: Chưa cấu hình GEMINI_API_KEY trên server.",
            badge: "Standard"
        };
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const prompt = `
BẠN LÀ: Chuyên gia Phẫu thuật & Hợp nhất Giáo án Sư phạm (Pedagogical Merger Expert).
NHIỆM VỤ: Lồng ghép các CHỈ THỊ CHIẾN LƯỢC vào GIÁO ÁN HIỆN TẠI một cách thông minh.

GIÁO ÁN HIỆN TẠI (JSON):
${JSON.stringify(currentPlan, null, 2)}

CHỈ THỊ CHIẾN LƯỢC TỪ CHUYÊN GIA:
${expertDirectives}

YÊU CẦU NGHIÊM NGẶT:
1. TRÍ TUỆ CỐT LÕI: Giữ lại 100% các ví dụ hay, tình huống sư phạm thực tế từ giáo án cũ (nếu có trong JSON hiện tại).
2. PHẪU THUẬT (SURGICAL FUSION): 
   - Không ghi đè mù quáng. 
   - Nếu là môn HĐTN, phải đảm bảo tính "Vertical Entanglement": Nội dung của Sinh hoạt dưới cờ, Hoạt động giáo dục và Sinh hoạt lớp phải cùng phục vụ một mục tiêu chủ đề chung, không được rời rạc.
   - Sử dụng marker {{cot_1}} cho GV và {{cot_2}} cho HS trong các chuỗi văn bản hoạt động.
3. CHUẨN 5512: Nâng tầm chuyên gia cho nội dung nhưng giữ nguyên cấu trúc JSON ban đầu.
4. BADGE: Gắn badge "Expert Integrated" vào kết quả.

TRẢ VỀ: Một đối tượng JSON duy nhất là giáo án đã được hợp nhất. Trả về TRỰC TIẾP JSON, không thêm text giải thích.
`;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Extract JSON Safely
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("AI did not return valid JSON for merging");
        }

        const mergedContent = JSON.parse(jsonMatch[0]);

        return {
            success: true,
            content: mergedContent,
            auditTrail: "Đã thực hiện phẫu thuật nội dung và lồng ghép chỉ thị năng lực số 2025.",
            badge: "Expert Integrated"
        };
    } catch (error: any) {
        console.error("[KHBHMerger] Error:", error);
        return {
            success: false,
            content: currentPlan,
            auditTrail: `Lỗi hợp nhất: ${error.message}`,
            badge: "Standard"
        };
    }
}
