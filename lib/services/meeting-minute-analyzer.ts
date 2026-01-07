
import { MeetingResult } from "../types";

/**
 * 🛠️ MEETING MINUTE ANALYZER (OFFLINE MODE)
 * Kiến trúc 21.0 - Hệ thống phân tích quy pháp (Rule-based)
 * Dùng làm Fallback khi AI bị ngắt kết nối hoàn toàn.
 */
export class MeetingMinuteAnalyzer {
    static analyze(text: string): MeetingResult {
        if (!text) {
            return this.getEmptyMeeting();
        }

        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

        // 1. Phân tích Thông tin chung & Thành phần (Regex heuristics)
        const participants = this.extractParticipants(text);
        const subject = this.extractSubject(text) || "Biên bản cuộc họp (Tự động trích xuất)";
        const date = this.extractDate(text) || new Date().toLocaleDateString('vi-VN');

        // 2. Phân tích Nội dung thảo luận (Tách theo các gạch đầu dòng hoặc mục)
        const discussionPoints = this.extractDiscussion(lines);

        // 3. Phân tích Kết luận
        const conclusions = this.extractConclusions(text);

        return {
            title: subject,
            summary: discussionPoints.mainPoints.join("\n"),
            content: discussionPoints.detailedContent,
            conclusion: conclusions || "Các thành viên nhất trí với nội dung đã thảo luận.",
            // Export compatibility
            noi_dung_chinh: discussionPoints.mainPoints.join("\n"),
            uu_diem: "Học sinh tích cực tham gia, nội dung bám sát chủ đề.",
            han_che: "Thời gian thảo luận còn hạn chế.",
            y_kien_dong_gop: "Cần tăng cường các hoạt động tương tác nhóm.",
            ke_hoach_thang_toi: "Tiếp tục triển khai kế hoạch và theo dõi tiến độ.",
            ket_luan_cuoc_hop: conclusions || "Các thành viên nhất trí với nội dung đã thảo luận.",
            metadata: {
                processedAt: new Date().toISOString(),
                isAIGenerated: false,
                source: "offline_analyzer_v21.0"
            }
        };
    }

    private static extractParticipants(text: string): string[] {
        const patterns = [
            /(?:Thành phần|Người tham gia|Người dự|Attendees|Present)[:\-\s]+(.*)/i,
            /(?:Chủ trì|Thư ký)[:\-\s]+(.*)/i
        ];

        const results: string[] = [];
        patterns.forEach(p => {
            const m = text.match(p);
            if (m) results.push(m[1].trim());
        });

        return results.length > 0 ? results : ["Chưa xác định"];
    }

    private static extractSubject(text: string): string | null {
        const m = text.match(/(?:Chủ đề|Nội dung cuộc họp|Về việc|Subject)[:\-\s]+(.*)/i);
        return m ? m[1].trim() : null;
    }

    private static extractDate(text: string): string | null {
        // Match dd/mm/yyyy or dd-mm-yyyy or ngày ... tháng ... năm ...
        const m = text.match(/(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})|(ngày\s+\d+\s+tháng\s+\d+\s+năm\s+\d+)/i);
        return m ? m[0] : null;
    }

    private static extractDiscussion(lines: string[]): { mainPoints: string[], detailedContent: string } {
        const points: string[] = [];
        let detailed = "";

        // Tìm các dòng có tính chất thảo luận (bắt đầu bằng gạch đầu dòng, số thứ tự, hoặc từ khóa)
        lines.forEach(line => {
            if (/^[0-9\-\*\+•]\.?\s*/.test(line) || /thảo luận|kiến nghị|ý kiến|trao đổi/i.test(line)) {
                points.push(line);
            }
            if (line.length > 30) {
                detailed += line + "\n";
            }
        });

        return {
            mainPoints: points.slice(0, 5),
            detailedContent: detailed || "Không bóc tách được chi tiết nội dung thảo luận."
        };
    }

    private static extractConclusions(text: string): string | null {
        const patterns = [
            /(?:Kết luận|Quyết nghị|Thống nhất|Biểu quyết)[:\-\s]+([\s\S]*?)(?:\n\n|\n[A-Z]|$)/i,
            /(?:Next steps|Hành động tiếp theo)[:\-\s]+([\s\S]*)/i
        ];

        for (const p of patterns) {
            const m = text.match(p);
            if (m) return m[1].trim();
        }
        return null;
    }

    private static getEmptyMeeting(): MeetingResult {
        return {
            title: "Biên bản trống",
            summary: "Không có dữ liệu đầu vào.",
            content: "",
            conclusion: "",
            metadata: { isAIGenerated: false, processedAt: new Date().toISOString() }
        };
    }
}
