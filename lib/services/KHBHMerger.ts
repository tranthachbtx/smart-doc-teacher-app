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
BẠN LÀ: Chuyên gia Phẫu thuật & Hợp nhất Giáo án Sư phạm CAO CẤP.
NHIỆM VỤ: Lồng ghép các CHỈ THỊ CHIẾN LƯỢC vào GIÁO ÁN HIỆN TẠI một cách thông minh, chuẩn xác 5512.

GIÁO ÁN HIỆN TẠI (JSON):
${JSON.stringify(currentPlan, null, 2)}

CHỈ THỊ CHIẾN LƯỢC TỪ CHUYÊN GIA (PROMPT NGỮ CẢNH):
${expertDirectives}

YÊU CẦU NGHIÊM NGẶT (STRICT RULES):
1. **CHUẨN HÀNH CHÍNH (NO DIALOGUE)**: Tuyệt đối bỏ các lời thoại "GV nói", "HS thưa". Thay thế bằng mô tả Hành động sư phạm (Teacher Action) và Sản phẩm đạt được (Student Product).
2. **CHI TIẾT HÓA SẢN PHẨM**: Viết CỰC KỲ CHI TIẾT các đáp án dự kiến, nội dung phiếu học tập, kết quả phản tư của HS (để tăng độ dài và tính chuyên môn).
3. **FUSION (HỢP NHẤT)**: GIỮ LẠI các ví dụ hay từ giáo án cũ nhưng NÂNG CẤP cách tổ chức theo 4 bước chuẩn 5512 (Chuyển giao -> Thực hiện -> Báo cáo -> Chốt).
4. **VERTICAL ENTANGLEMENT**: Đảm bảo sự kết nối chặt chẽ giữa Sinh hoạt dưới cờ -> Hoạt động giáo dục -> Sinh hoạt lớp.
5. **FORMAT**: Duy trì marker {{cot_1}} cho GV và {{cot_2}} cho HS trong các cột tổ chức thực hiện.
6. **BADGE**: Gắn badge "Expert Integrated" vào kết quả.

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
