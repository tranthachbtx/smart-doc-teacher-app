import { generateAIContent } from "../actions/gemini";
import { LessonResult } from "../types";
import { ContentScalingService } from "./content-scaling-service";

export interface ScaledContent {
    content: any;
    scalingApplied: boolean;
    quality: 'optimal' | 'expanded' | 'compressed';
    actualPages: number;
}

/**
 * Architecture 5.0: Dịch vụ nâng cấp nội dung thông minh bằng AI
 * Tự động mở rộng các phần nội dung ngắn để đạt mục tiêu 30-50 trang.
 */
export class IntelligentContentScaler {
    private static instance: IntelligentContentScaler;

    private constructor() { }

    static getInstance(): IntelligentContentScaler {
        if (!this.instance) {
            this.instance = new IntelligentContentScaler();
        }
        return this.instance;
    }

    /**
     * Mở rộng một module cụ thể bằng AI nếu nội dung quá sơ sài
     */
    async expandModule(
        moduleTitle: string,
        currentContent: string,
        targetWords: number = 1500
    ): Promise<string> {
        const prompt = `
Bạn là một chuyên gia soạn giáo án trình độ cao. Tôi có một hoạt động dạy học đang bị quá ngắn, cần được mở rộng để đạt độ chi tiết sư phạm xuất sắc (khoảng ${targetWords} từ).

**Tên hoạt động:** ${moduleTitle}
**Nội dung hiện tại:**
"${currentContent}"

**YÊU CẦU MỞ RỘNG NGHIÊM NGẶT:**
1. **Lời thoại chi tiết:** Viết rõ GV nói gì (Dẫn dắt, đặt câu hỏi), HS trả lời ra sao.
2. **Kịch bản tình huống:** Thêm các tình huống giả định phát sinh trong lớp và cách xử lý.
3. **Chi tiết hóa các bước:** Thay vì viết "Thảo luận", hãy viết rõ: Chia nhóm thế nào, nhiệm vụ từng thành viên, tiêu chí chấm điểm sản phẩm nhóm.
4. **Ví dụ thực tế:** Thêm ít nhất 3 ví dụ thực tế đời thường (phù hợp Gen Z) để minh họa cho kiến thức.
5. **Định dạng:** Sử dụng Markdown rõ ràng, in đậm các từ khóa quan trọng.
6. **Dung lượng:** Phải mở rộng ít nhất gấp 3-4 lần nội dung cũ về độ chi tiết.

Hãy trả về nội dung đã được nâng cấp hoàn chỉnh.
`;

        try {
            const response = await generateAIContent(prompt, "gemini-1.5-flash");
            if (response.success && response.content) {
                return response.content;
            }
            return currentContent; // Fallback
        } catch (error) {
            console.error("Scaling error:", error);
            return currentContent;
        }
    }

    /**
     * Kiểm tra và tự động đề xuất mở rộng cho toàn bộ bài dạy
     */
    async scaleLessonPlan(lesson: LessonResult, targetPages: number = 40): Promise<ScaledContent> {
        const currentPages = ContentScalingService.estimatePageCount(lesson);

        if (currentPages >= targetPages * 0.9) {
            return {
                content: lesson,
                scalingApplied: false,
                quality: 'optimal',
                actualPages: currentPages
            };
        }

        // Nếu quá ngắn, có thể thực hiện mở rộng tự động cho các phần quan trọng nhất (như Khám phá)
        // Tuy nhiên trong bản Manual Workflow, ta nên để người dùng nhấn nút "Expand" từng module
        // để kiểm soát chất lượng tốt hơn.

        return {
            content: lesson,
            scalingApplied: false,
            quality: currentPages < targetPages ? 'compressed' : 'optimal',
            actualPages: currentPages
        };
    }
}
