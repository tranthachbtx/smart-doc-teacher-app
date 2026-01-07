
import { AssessmentResult } from "../types";

/**
 * 🛠️ ASSESSMENT PLAN ANALYZER (OFFLINE MODE)
 * Kiến trúc 22.0 - Hệ thống phân tích quy pháp cho Kế hoạch Kiểm tra Đánh giá
 */
export class AssessmentPlanAnalyzer {
    static analyze(grade: string, term: string, type: string, topic: string): AssessmentResult {
        const purpose = `Đánh giá mức độ đạt được yêu cầu cần đạt (YCCĐ) của học sinh sau khi học bài: ${topic}.`;
        const structure = `
## CẤU TRÚC ĐỀ (${type})
1. **Phần I: Trắc nghiệm khách quan (6 câu)**: Kiểm tra nhận biết và thông hiểu cơ bản về ${topic}.
2. **Phần II: Tự luận (2 câu)**:
   - Câu 1: Phân tích/Giải thích một khía cạnh của bài học.
   - Câu 2: Vận dụng kiến thức bài học vào tình huống thực tiễn.
        `;

        return {
            title: `Kế hoạch Đánh giá: ${topic} (${term})`,
            ten_ke_hoach: `Kế hoạch Đánh giá: ${topic} (${term})`,
            muc_tieu: purpose,
            noi_dung_nhiem_vu: structure,
            loi_khuyen: `Hãy đảm bảo học sinh được ôn tập kỹ các kiến thức trọng tâm trước khi thực hiện bài đánh giá này.`,
            purpose: purpose,
            matrix: `
## MA TRẬN ĐỀ KIỂM TRA
| Mức độ | Biết | Hiểu | Vận dụng |
| :--- | :---: | :---: | :---: |
| Trắc nghiệm | 4 câu | 2 câu | 0 câu |
| Tự luận | 0 câu | 1 câu | 1 câu |
| **Tổng điểm** | **4.0** | **3.0** | **3.0** |
            `,
            structure: structure,
            rubric_text: `
## RUBRIC ĐÁNH GIÁ (GỢI Ý)
- **Hoàn thành tốt (8-10)**: Trả lời chính xác >80%, lập luận logic, sáng tạo.
- **Hoàn thành (5-7)**: Trả lời đúng >50%, nắm được kiến thức nền tảng.
- **Chưa hoàn thành (<5)**: Hổng kiến thức cơ bản, trình bày sơ sài.
            `,
            metadata: {
                processedAt: new Date().toISOString(),
                isAIGenerated: false,
                source: "offline_assessment_analyzer_v22.0"
            }
        };
    }
}
