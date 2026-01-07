
import { NCBHResult } from "../types";

/**
 * 🛠️ NCBH ANALYZER (OFFLINE MODE)
 * Kiến trúc 22.0 - Hệ thống phân tích quy pháp cho Nghiên cứu Bài học
 */
export class NCBHAnalyzer {
    static analyze(grade: string, topic: string, instructions: string): NCBHResult {
        const objectives = `
- Phân tích chu trình sư phạm của bài dạy: ${topic}.
- Đánh giá sự tương tác giữa giáo viên và học sinh.
- Đề xuất các phương án cải tiến bài dạy dựa trên minh chứng học tập.
        `;
        const methodology = `
- Quan sát lớp học tập trung vào việc học của học sinh.
- Ghi chép diễn biến hoạt động sư phạm.
- Phân tích video/hình ảnh sau tiết dạy.
        `;

        return {
            title: `Kế hoạch NCBH: ${topic}`,
            ten_bai: topic,
            ly_do_chon: `Nâng cao chất lượng dạy học bài ${topic} thông qua phân tích hoạt động học của học sinh.`,
            muc_tieu: objectives,
            chuoi_hoat_dong: methodology,
            chia_se_nguoi_day: `Giáo viên bám sát kế hoạch bài dạy, tuy nhiên cần chú ý hơn đến các nhóm học sinh yếu.`,
            nhan_xet_nguoi_du: `Học sinh tích cực tham gia hoạt động, hiểu bài tốt. Có sự tương tác hiệu quả giữa GV và HS.`,
            nguyen_nhan_giai_phap: `Nguyên nhân: Một số học sinh còn rụt rè. Giải pháp: Tăng cường khen ngợi và động viên.`,
            bai_hoc_kinh_nghiem: `Cần chuẩn bị học liệu trực quan sinh động hơn để thu hút học sinh ngay từ bước khởi động.`,
            objectives: objectives,
            methodology: methodology,
            observationFocus: `
- Học sinh có thực sự tham gia vào hoạt động ${topic} không?
- Những khó khăn học sinh gặp phải trong quá trình hình thành kiến thức.
- Hiệu quả của các câu hỏi gợi mở từ giáo viên.
            `,
            analysisPoints: `
- Mức độ đạt được yêu cầu cần đạt (YCCĐ).
- Sự phù hợp của thiết bị dạy học.
- Đề xuất: Cần tăng cường ${instructions || "tương tác nhóm"} trong tiết dạy tiếp theo.
            `,
            metadata: {
                processedAt: new Date().toISOString(),
                isAIGenerated: false,
                source: "offline_ncbh_analyzer_v22.0"
            }
        };
    }
}
