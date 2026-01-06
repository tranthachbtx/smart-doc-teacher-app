import { LessonResult } from "../types";

export interface ScalingPlan {
    targetPages: number;
    currentEstimatedPages: number;
    needsExpansion: boolean;
    expansionGaps: string[];
}

/**
 * Architecture 4.0: Dịch vụ kiểm soát độ dài và mở rộng nội dung tự động
 * Đảm bảo KHBH đạt ngưỡng 30-50 trang theo yêu cầu.
 */
export class ContentScalingService {
    private static WORDS_PER_PAGE = 350;

    /**
     * Ước tính số trang dựa trên tổng số từ
     */
    static estimatePageCount(result: LessonResult): number {
        let totalWords = 0;

        // Count words in main sections
        const sections = [
            result.muc_tieu_kien_thuc,
            result.muc_tieu_nang_luc,
            result.muc_tieu_pham_chat,
            result.thiet_bi_day_hoc,
            result.hoat_dong_khoi_dong,
            result.hoat_dong_kham_pha,
            result.hoat_dong_luyen_tap,
            result.hoat_dong_van_dung,
            result.ho_so_day_hoc,
            result.huong_dan_ve_nha
        ];

        sections.forEach(s => {
            if (s) totalWords += s.split(/\s+/).length;
        });

        // Loop through activities array if exists
        if (Array.isArray(result.activities)) {
            result.activities.forEach((act: any) => {
                if (act.content) totalWords += act.content.split(/\s+/).length;
                if (act.full_content) totalWords += act.full_content.split(/\s+/).length;
            });
        }

        return Math.max(1, Math.round(totalWords / this.WORDS_PER_PAGE));
    }

    /**
     * Phân tích các khoảng trống nội dung cần bù đắp để đạt mục tiêu
     */
    static analyzeScalingNeeds(result: LessonResult, targetPages: number = 40): ScalingPlan {
        const currentPages = this.estimatePageCount(result);
        const gaps: string[] = [];

        if (currentPages < targetPages * 0.8) {
            if (!result.ho_so_day_hoc || result.ho_so_day_hoc.length < 500) {
                gaps.push("Thiếu Phụ lục/Phiếu học tập chi tiết");
            }
            if (!result.hoat_dong_kham_pha || result.hoat_dong_kham_pha.length < 2000) {
                gaps.push("Hoạt động Khám phá cần mô tả kịch bản dạy học chi tiết hơn (Lời thoại GV/HS)");
            }
            if (!result.tich_hop_nls || result.tich_hop_nls.length < 200) {
                gaps.push("Cần mở rộng phần tích hợp Năng lực số và Đạo đức");
            }
        }

        return {
            targetPages,
            currentEstimatedPages: currentPages,
            needsExpansion: currentPages < targetPages,
            expansionGaps: gaps
        };
    }

    /**
     * Tạo thêm nội dung "Paddings" thông minh (Phụ lục, Rubrics)
     * Đây là giải pháp "cứu cánh" khi AI sinh nội dung quá ngắn
     */
    static generateIntelligentPaddings(result: LessonResult): Record<string, string> {
        return {
            pedagogical_appendix: `
### PHỤ LỤC: CƠ SỞ LÝ LUẬN VÀ PHƯƠNG PHÁP CỦA BÀI DẠY
(Nội dung này được hệ thống tự động tối ưu để đảm bảo tính chuyên môn sâu)

1. **Vận dụng thuyết kiến tạo (Constructivism):** 
Bài dạy được thiết kế để học sinh tự xây dựng kiến thức thông qua trải nghiệm thực tế. GV đóng vai trò là người dẫn dắt (Facilitator).

2. **Kỹ thuật dạy học tích cực:**
- Kỹ thuật "Mảnh ghép": Áp dụng trong phần Khám phá kiến thức mới.
- Kỹ thuật "Phòng tranh": Áp dụng khi báo cáo sản phẩm nhóm.
- Kỹ thuật "KWS": Giúp học sinh tự theo dõi tiến trình học tập.

3. **Hướng dẫn phân hóa (Differentiation):**
- Nhóm cần hỗ trợ: Cung cấp các gợi ý (scaffolding) bằng thẻ từ khóa.
- Nhóm xuất sắc: Yêu cầu mở rộng liên hệ thực tế địa phương.
            `,
            assessment_rubric: `
### BẢNG RUBRIC ĐÁNH GIÁ NĂNG LỰC HỌC SINH
(Dành cho giáo viên đánh giá cuối buổi học)

| Tiêu chí | Mức 1 (Cần cố gắng) | Mức 2 (Đạt) | Mức 3 (Tốt) |
|----------|-------------------|------------|------------|
| Sự chủ động | Chờ đợi nhắc nhở | Tham gia khi được gọi | Tích cực xung phong |
| Kỹ năng nhóm | Chưa hợp tác | Hợp tác cơ bản | Lãnh đạo/Hỗ trợ tốt |
| Sản phẩm | Sơ sài, chưa đúng | Đầy đủ, rõ ràng | Sáng tạo, xuất sắc |
| Thuyết trình | Nói nhỏ, ngắc ngứ | Rõ ràng, tự tin | Thuyết phục, cuốn hút |
            `
        };
    }
}
