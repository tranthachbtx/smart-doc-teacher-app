
import { TextCleaningService } from "./text-cleaning-service";

export interface AuditAnalysisResult {
    danh_gia_tong_quan: string;
    phan_tich_chi_tiet: Array<{
        tieu_chi: string;
        hien_trang: string;
        diem_yeu: string;
        giai_phap_goi_y: string;
    }>;
    goi_y_nang_cap_chien_luoc: string;
}

/**
 * 🏛️ MODULE 1: AI AUDITOR SERVICE v35.6
 * Chuyên trách việc "Đọc hiểu - Phân tích - Phê bình" file PDF cũ.
 */
export const AIAuditorService = {
    async analyzePDFContent(rawText: string, model: string = "gemini-2.0-flash"): Promise<AuditAnalysisResult> {
        console.log("[AIAuditor] 🔍 Initiating Deep Content Audit...");

        const cleaner = TextCleaningService.getInstance();
        const cleanedText = cleaner.clean(rawText);

        const prompt = `
# VAI TRÒ: Chuyên gia Thẩm định Chương trình Giáo dục (Chuẩn 5512 - Modern 2025).

# NHIỆM VỤ:
Bạn sẽ nhận được nội dung của một Kế hoạch bài dạy (KHBH) cũ. Hãy phân tích nó dưới góc độ phê bình sư phạm khắc nghiệt để tìm ra các điểm yếu cần nâng cấp.

# DỮ LIỆU ĐẦU VÀO:
"""${cleanedText.substring(0, 50000)}"""

# TIÊU CHÍ PHÂN TÍCH (5 Pain Points):
1. **Mục tiêu:** Động từ có đo lường được không? Có gắn với biểu hiện hành vi cụ thể không?
2. **Tiến trình:** Các hoạt động có bị sơ sài không? (Ví dụ: Luyện tập chỉ là trắc nghiệm, Vận dụng chỉ là bài tập về nhà).
3. **Phương pháp:** Có sử dụng kỹ thuật dạy học tích cực (Mảnh ghép, Khăn trải bàn, Trạm...) không hay chỉ là "Hỏi - Đáp"?
4. **Công nghệ (EdTech):** Có sử dụng công cụ số (Padlet, Canva, Quizizz, AI) không hay chỉ là Powerpoint/Video cũ?
5. **Đánh giá:** Có Rubric chấm điểm 4 mức độ không?

# YÊU CẦU OUTPUT JSON:
Trả về DUY NHẤT JSON với cấu trúc:
{
  "danh_gia_tong_quan": "Điểm số ước lượng (thang 10) và nhận xét chung.",
  "phan_tich_chi_tiet": [
    { "tieu_chi": "Mục tiêu", "hien_trang": "...", "diem_yeu": "...", "giai_phap_goi_y": "..." },
    { "tieu_chi": "Phương pháp", "hien_trang": "...", "diem_yeu": "...", "giai_phap_goi_y": "..." },
    { "tieu_chi": "Tiến trình", "hien_trang": "...", "diem_yeu": "...", "giai_phap_goi_y": "..." },
    { "tieu_chi": "Công nghệ", "hien_trang": "...", "diem_yeu": "...", "giai_phap_goi_y": "..." },
    { "tieu_chi": "Đánh giá", "hien_trang": "...", "diem_yeu": "...", "giai_phap_goi_y": "..." }
  ],
  "goi_y_nang_cap_chien_luoc": "Đề xuất 3 ý tưởng lớn để lột xác bài này (VD: Gamification, Dự án thực tế...)"
}
        `.trim();

        try {
            const { generateAIContent } = await import("../actions/gemini");
            const response = await generateAIContent(prompt, model);

            if (response.success && response.content) {
                const sanitizedJson = cleaner.sanitizeAIResponse(response.content);
                return JSON.parse(sanitizedJson);
            }
            throw new Error(response.error || "Không thể thực hiện thẩm định AI.");
        } catch (error: any) {
            console.error("[AIAuditor] 💥 Audit Failed:", error.message);
            throw error;
        }
    }
};
