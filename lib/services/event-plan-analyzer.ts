
import { EventResult } from "../types";

/**
 * 🛠️ EVENT PLAN ANALYZER (OFFLINE MODE)
 * Kiến trúc 22.0 - Hệ thống phân tích quy pháp cho Kế hoạch Ngoại khóa
 */
export class EventPlanAnalyzer {
    static analyze(grade: string, topic: string, instructions: string, budget: string, checklist: string, evaluation: string): EventResult {
        const content = `
## 1. MỤC ĐÍCH - YÊU CẦU
- Giúp học sinh hiểu sâu hơn về kiến thức: ${topic}.
- Rèn luyện kỹ năng làm việc nhóm và giao tiếp.
- Giáo dục thái độ tích cực thông qua các hoạt động trải nghiệm.

## 2. NỘI DUNG CHƯƠNG TRÌNH (DỰ KIẾN)
- **Khai mạc**: Giới thiệu mục đích buổi ngoại khóa.
- **Hoạt động chính**: Tổ chức trò chơi/cuộc thi về ${topic}.
- **Tổng kết**: Trao giải và rút kinh nghiệm.

## 3. DANH MỤC CHUẨN BỊ
${checklist || "- Giấy mời, băng rôn.\n- Phần thưởng cho học sinh.\n- Tài liệu học tập liên quan."}

## 4. DỰ TOÁN KINH PHÍ
${budget || "- Thuê địa điểm: 0đ (Tại trường)\n- Nước uống: Tự túc\n- Quà tặng: Dự kiến 500.000đ"}

## 5. TIÊU CHÍ ĐÁNH GIÁ
${evaluation || "- Sự hào hứng tham gia của học sinh.\n- Độ chính xác của các câu trả lời/sản phẩm.\n- Tính kỷ luật trong suốt buổi ngoại khóa."}
        `;

        return {
            title: `Kế hoạch Ngoại khóa: ${topic}`,
            ten_chu_de: topic,
            thoi_gian: "Theo kế hoạch nhà trường",
            dia_diem: "Sân trường / Hội trường",
            doi_tuong: `Học sinh khối ${grade}`,
            muc_tieu: `Giúp học sinh hiểu sâu hơn về kiến thức: ${topic}.\nRèn luyện kỹ năng làm việc nhóm và giao tiếp.\nGiáo dục thái độ tích cực thông qua các hoạt động trải nghiệm.`,
            summary: `Hoạt động bổ trợ giáo dục dành cho học sinh khối ${grade} với chủ đề ${topic}.`,
            content: content,
            kich_ban_chi_tiet: content,
            noi_dung: content,
            conclusion: "Chương trình được thiết kế nhằm tối ưu hóa trải nghiệm học tập của học sinh.",
            metadata: {
                processedAt: new Date().toISOString(),
                isAIGenerated: false,
                source: "offline_event_analyzer_v22.0"
            }
        };
    }
}
