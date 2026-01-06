import { StructuredContent, ContentSection } from "./content-structure-analyzer";
import { SmartPromptData } from "./smart-prompt-service";
import { ActivityType } from "./intelligent-context-engine";

export interface TargetLength {
    pages: number;
    words: number;
}

export interface AggregatedContent {
    pdfContent: ContentSection[];
    databaseInsights: SmartPromptData;
    scalingInstructions: string;
    metadata: {
        targetLength: TargetLength;
        estimatedPages: number;
    };
}

/**
 * Architecture 4.0: Quy trình tích hợp dữ liệu thông minh để tạo KHBH quy mô lớn (30-50 trang)
 */
export class UnifiedContentAggregator {
    private static instance: UnifiedContentAggregator;

    private constructor() { }

    static getInstance(): UnifiedContentAggregator {
        if (!this.instance) {
            this.instance = new UnifiedContentAggregator();
        }
        return this.instance;
    }

    /**
     * Hợp nhất dữ liệu từ PDF và Database chuyên môn
     */
    aggregate(
        pdfData: StructuredContent,
        dbData: SmartPromptData,
        activityType: ActivityType,
        targetPages: number = 40
    ): AggregatedContent {
        // 1. Lọc các phần PDF có độ liên quan cao nhất
        const relevantSections = pdfData.sections
            .filter(s => (s.relevance[activityType] || 0) > 40)
            .sort((a, b) => (b.relevance[activityType] || 0) - (a.relevance[activityType] || 0))
            .slice(0, 6); // Lấy top 6 phần để tránh quá tải ngữ cảnh

        // 2. Tạo chỉ dẫn mở rộng (Scaling Instructions) để đạt 30-50 trang
        const targetWords = targetPages * 350; // Ước tính 350 từ/trang
        const scalingInstructions = this.generateScalingInstructions(targetPages, targetWords, activityType);

        return {
            pdfContent: relevantSections,
            databaseInsights: dbData,
            scalingInstructions,
            metadata: {
                targetLength: { pages: targetPages, words: targetWords },
                estimatedPages: targetPages
            }
        };
    }

    private generateScalingInstructions(pages: number, words: number, type: ActivityType): string {
        const perModulePages = Math.ceil(pages / 4); // Chia cho 4 hoạt động chính

        return `
## 📏 CHIẾN LƯỢC MỞ RỘNG NỘI DUNG (SCALING STRATEGY)
**Mục tiêu tổng thể:** Kế hoạch bài dạy đạt ${pages} trang (${words} từ).
**Yêu cầu riêng cho Hoạt động này:** Viết chi tiết khoảng ${perModulePages} - ${perModulePages + 2} trang Word.

**Để đạt độ dài này, bạn PHẢI:**
1. **Mô tả kịch bản chi tiết:** Viết rõ lời thoại của giáo viên (GV), các câu hỏi gợi mở cụ thể, và các phương án trả lời dự kiến của học sinh (HS).
2. **Chi tiết hóa tổ chức thực hiện:** Thay vì viết "GV chia nhóm", hãy viết rõ cách chia nhóm, quy tắc thảo luận, thời gian cho từng bước nhỏ (Micro-timing).
3. **Mở rộng ngữ liệu:** Sử dụng tối đa các ví dụ từ Tài liệu gốc (PDF) kết hợp với các tình huống thực tế đời thường (Trend Gen Z).
4. **Bổ sung Phụ lục:** Thiết kế chi tiết các Phiếu học tập (Worksheets), Rubrics đánh giá, và bảng kiểm ngay trong nội dung hoạt động.
5. **Ghi chú sư phạm:** Thêm các đoạn "Lưu ý" về cách xử lý tình huống phát sinh, cách hỗ trợ học sinh yếu, và cách thúc đẩy học sinh giỏi.
`;
    }
}
