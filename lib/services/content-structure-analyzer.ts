import { generateAIContent } from "@/lib/actions/gemini";

/**
 * 🔬 SMART PARSING PIPELINE v20.2
 * Tự động hóa khâu "Việc nhẹ" và Mổ xẻ dữ liệu "Việc nặng".
 */

// --- LEGACY COMPATIBILITY INTERFACES ---
export interface ContentSection {
    id: string;
    title: string;
    content: string;
    type: 'objective' | 'knowledge' | 'activity' | 'assessment' | 'resource' | 'other';
    relevance: Record<string, number>;
    confidence?: number;
    metadata: {
        wordCount: number;
        pageNumber?: number;
    };
}

export interface StructuredContent {
    sections: ContentSection[];
    metadata: {
        title: string;
        grade: string;
        subject: string;
        extractedAt: string;
        wordCount?: number;
    };
}
// --- END LEGACY ---

export interface CleanedStructure {
    // Dữ liệu cho ô Metadata (Auto-Fill)
    ten_bai: string;
    so_tiet: string;
    muc_tieu_kien_thuc: string;
    muc_tieu_nang_luc: string;
    muc_tieu_pham_chat: string;
    thiet_bi_gv: string;
    thiet_bi_hs: string;

    // Dữ liệu cho sinh hoạt (Auto-Fill)
    noi_dung_shdc: string;
    noi_dung_shl: string;

    // Dữ liệu gốc đã lọc (Cho Prompt Manual)
    raw_khoi_dong: string;
    raw_kham_pha: string;
    raw_luyen_tap: string;
    raw_van_dung: string;

    // 🏛️ MODULE 1: AI AUDIT INTEGRATION
    audit_analysis: {
        danh_gia_tong_quan: string;
        phan_tich_chi_tiet: Array<{
            tieu_chi: string;
            hien_trang: string;
            diem_yeu: string;
            giai_phap_goi_y: string;
        }>;
        goi_y_nang_cap_chien_luoc: string;
    };
}

export class ContentStructureAnalyzer {
    async analyzeAndPreFill(filePayload: { mimeType: string, data: string }, grade: string, theme: string): Promise<CleanedStructure> {
        const prompt = `
        Bạn là chuyên gia Thẩm định và Xử lý dữ liệu giáo dục 5512 (Modern 2025).
        Nhiệm vụ: Phân tích file bài dạy cũ và thực hiện 3 công việc trong 1 lần chạy:
        1. TRÍCH XUẤT sạch sẽ nội dung từng hoạt động (không tóm tắt).
        2. TỰ ĐỘNG SOẠN THẢO phần Mục tiêu và Sinh hoạt (SHDC/SHL) chuẩn 5512.
        3. THẨM ĐỊNH SƯ PHẠM (Audit): Phê bình khắc nghiệt file cũ để tìm lỗi (Pain Points).
        
        Bối cảnh ban đầu: Khối ${grade}, Bài học: ${theme}.
        LƯU Ý: Nếu nội dung file KHÁC với chủ đề bài học "${theme}", hãy ƯU TIÊN TUYỆT ĐỐI nội dung trong file.
        
        # ĐỊNH DẠNG JSON TRẢ VỀ (DUY NHẤT):
        {
          "ten_bai": "Tên bài học",
          "so_tiet": "Số tiết trích lọc (VD: 3)",
          "muc_tieu_kien_thuc": "Chuẩn 2018...",
          "muc_tieu_nang_luc": "Năng lực chung/đặc thù...",
          "muc_tieu_pham_chat": "Phẩm chất...",
          "thiet_bi_gv": "Chi tiết thiết bị...",
          "thiet_bi_hs": "Chi tiết thiết bị...",
          "noi_dung_shdc": "Kịch bản SHDC (150-200 từ)...",
          "noi_dung_shl": "Kịch bản SHL (150-200 từ)...",
          "raw_khoi_dong": "Trích xuất chi tiết nhất phần Khởi động...",
          "raw_kham_pha": "Trích xuất chi tiết nhất phần Khám phá...",
          "raw_luyen_tap": "Trích xuất chi tiết nhất phần Luyện tập...",
          "raw_van_dung": "Trích xuất chi tiết nhất phần Vận dụng...",
          "audit_analysis": {
            "danh_gia_tong_quan": "Nhận xét và điểm số (thang 10).",
            "phan_tich_chi_tiet": [
              { "tieu_chi": "Mục tiêu", "hien_trang": "...", "diem_yeu": "...", "giai_phap_goi_y": "..." },
              { "tieu_chi": "Phương pháp", "hien_trang": "...", "diem_yeu": "...", "giai_phap_goi_y": "..." },
              { "tieu_chi": "Tiến trình", "hien_trang": "...", "diem_yeu": "...", "giai_phap_goi_y": "..." },
              { "tieu_chi": "Công nghệ", "hien_trang": "...", "diem_yeu": "...", "giai_phap_goi_y": "..." },
              { "tieu_chi": "Đánh giá", "hien_trang": "...", "diem_yeu": "...", "giai_phap_goi_y": "..." }
            ],
            "goi_y_nang_cap_chien_luoc": "3 ý tưởng lột sắc bài dạy."
          }
        }
        `;

        try {
            // SỬ DỤNG CHẾ ĐỘ MULTIMODAL (Gửi file trực tiếp thay vì text trích xuất lỗi)
            const result = await generateAIContent(prompt, "gemini-2.0-flash", filePayload);

            if (!result.success) {
                console.error("[Analyzer] AI Error Response:", result.error);
                throw new Error(`AI Dissection failed: ${result.error}`);
            }

            if (!result.content) throw new Error("AI returned empty content.");

            // IMPROVED JSON EXTRACTION LOGIC
            // 1. Try to find the first '{' and the last '}'
            const start = result.content.indexOf('{');
            const end = result.content.lastIndexOf('}');

            let data = null;

            if (start !== -1 && end !== -1 && end > start) {
                const potentialJson = result.content.substring(start, end + 1);
                try {
                    data = JSON.parse(potentialJson);
                } catch (jsonError) {
                    console.warn("[Analyzer] Direct JSON extraction failed, trying cleanup...", jsonError);
                    // 2. Try cleaning up common AI markdown artifacts like ```json ... ```
                    const cleanJson = potentialJson.replace(/```json\s*|\s*```/g, "");
                    try {
                        data = JSON.parse(cleanJson);
                    } catch (cleanError) {
                        console.warn("[Analyzer] JSON cleanup failed.");
                    }
                }
            }

            if (!data) {
                // Last resort: check if content is valid JSON entirely
                try {
                    data = JSON.parse(result.content);
                } catch (e) {
                    console.error("[Analyzer] Raw Content dump:", result.content);
                }
            }

            if (!data) {
                console.warn("[Analyzer] AI Content was not valid JSON:", result.content);
                throw new Error("Invalid JSON format from AI.");
            }

            return data;
        } catch (e: any) {
            console.error("[Analyzer] Final Catch Error:", e.message);
            throw e;
        }
    }
}
