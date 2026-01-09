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
}

export class ContentStructureAnalyzer {
    async analyzeAndPreFill(filePayload: { mimeType: string, data: string }, grade: string, theme: string): Promise<CleanedStructure> {
        const prompt = `
        Bạn là chuyên gia xử lý dữ liệu giáo dục 5512.
        Nhiệm vụ: Phân tích file bài dạy cũ này và thực hiện 2 việc:
        1. TRÍCH XUẤT sạch sẽ nội dung từng hoạt động (không tóm tắt).
        2. TỰ ĐỘNG SOẠN THẢO phần Mục tiêu và Sinh hoạt (SHDC/SHL) dựa trên bối cảnh bài học.
        
        Bối cảnh: Khối ${grade}, Bài học: ${theme}.
        
        # ĐỊNH DẠNG JSON TRẢ VỀ (DUY NHẤT):
        {
          "ten_bai": "Tên bài học chuẩn",
          "muc_tieu_kien_thuc": "Soạn thảo chi tiết chuẩn 2018...",
          "muc_tieu_nang_luc": "Soạn thảo chi tiết năng lực chung & đặc thù...",
          "muc_tieu_pham_chat": "Soạn thảo chi tiết phẩm chất...",
          "thiet_bi_gv": "Liệt kê chi tiết thiết bị cho GV...",
          "thiet_bi_hs": "Liệt kê chi tiết thiết bị cho HS...",
          "noi_dung_shdc": "Soạn kịch bản Sinh hoạt dưới cờ (150-200 từ)...",
          "noi_dung_shl": "Soạn kịch bản Sinh hoạt lớp (150-200 từ)...",
          "raw_khoi_dong": "Trích xuất nguyên văn/chi tiết nhất phần Khởi động từ file...",
          "raw_kham_pha": "Trích xuất nguyên văn/chi tiết nhất phần Khám phá/Hình thành kiến thức...",
          "raw_luyen_tap": "Trích xuất nguyên văn/chi tiết nhất phần Luyện tập...",
          "raw_van_dung": "Trích xuất nguyên văn/chi tiết nhất phần Vận dụng..."
        }
        `;

        try {
            // SỬ DỤNG CHẾ ĐỘ MULTIMODAL (Gửi file trực tiếp thay vì text trích xuất lỗi)
            const result = await generateAIContent(prompt, "gemini-1.5-flash", filePayload);

            if (!result.success) {
                console.error("[Analyzer] AI Error Response:", result.error);
                throw new Error(`AI Dissection failed: ${result.error}`);
            }

            if (!result.content) throw new Error("AI returned empty content.");

            const jsonMatch = result.content.match(/\{[\s\S]*\}/);
            const data = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
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
