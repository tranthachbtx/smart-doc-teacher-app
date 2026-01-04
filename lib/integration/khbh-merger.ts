
import type { LessonResult } from "@/lib/types";

/**
 * KHBHMerger: Công cụ phẫu thuật và tích hợp trí tuệ nhân tạo (v1.0)
 * Chuyên trách việc trộn các gợi ý chiến lược từ Gemini Pro vào giáo án hiện tại.
 */
export class KHBHMerger {
    /**
     * Tích hợp các gợi ý vào giáo án cũ
     * @param currentPlan Giáo án hiện tại (đã được parse hoặc sinh ra)
     * @param suggestions Chuỗi văn bản gợi ý từ "Expert Brain Injection"
     */
    static merge(currentPlan: LessonResult, suggestions: string): LessonResult {
        const updated = { ...currentPlan };

        console.log("[Merger] 🛠️ Bắt đầu phẫu thuật giáo án với gợi ý chiến lược...");

        // 1. Phân tích các "Chỉ thị chiến lược" từ văn bản của Gemini Pro
        const directives = this.extractDirectives(suggestions);

        // 2. Tích hợp Năng lực số (NLS) - Ưu tiên hàng đầu theo Thông tư 02/2025
        if (directives.nls) {
            updated.tich_hop_nls = this.appendSmartly(updated.tich_hop_nls, directives.nls);
        }

        // 3. Cập nhật Mục tiêu kiến thức/năng lực/phẩm chất
        if (directives.mucTieu) {
            updated.muc_tieu_kien_thuc = this.appendSmartly(updated.muc_tieu_kien_thuc, directives.mucTieu);
        }

        // 4. Cải tiến Thiết bị dạy học
        if (directives.thietBi) {
            updated.gv_chuan_bi = this.appendSmartly(updated.gv_chuan_bi, directives.thietBi);
        }

        // 5. Nâng cấp các Hoạt động (Khởi động, Khám phá, Luyện tập, Vận dụng)
        if (directives.activities) {
            if (directives.activities.khoi_dong) {
                updated.hoat_dong_khoi_dong = this.patchActivity(updated.hoat_dong_khoi_dong || "", directives.activities.khoi_dong);
            }
            if (directives.activities.kham_pha) {
                updated.hoat_dong_kham_pha = this.patchActivity(updated.hoat_dong_kham_pha || "", directives.activities.kham_pha);
            }
            if (directives.activities.luyen_tap) {
                updated.hoat_dong_luyen_tap = this.patchActivity(updated.hoat_dong_luyen_tap || "", directives.activities.luyen_tap);
            }
            if (directives.activities.van_dung) {
                updated.hoat_dong_van_dung = this.patchActivity(updated.hoat_dong_van_dung || "", directives.activities.van_dung);
            }
        }

        // 6. Lưu trữ chỉ thị gốc vào metadata hoặc custom field nếu cần (dành cho AI phẫu thuật lớp sau)
        updated.expertGuidance = suggestions;
        updated.expert_instructions = suggestions; // Legacy compatibility

        return updated;
    }

    /**
     * Trích xuất các khối nội dung từ prompt response của Gemini
     */
    private static extractDirectives(text: string) {
        const sections: any = {
            nls: "",
            mucTieu: "",
            thietBi: "",
            activities: {}
        };

        // Regex thông minh để bắt các block [SECTION] hoặc các tiêu đề có dấu #
        const nlsMatch = text.match(/#*\s*(Năng lực số|NLS|Digital Competency)([\s\S]*?)(?=#|$)/i);
        if (nlsMatch) sections.nls = nlsMatch[2].trim();

        const mtMatch = text.match(/#*\s*(Mục tiêu|Kiến thức|Yêu cầu cần đạt)([\s\S]*?)(?=#|$)/i);
        if (mtMatch) sections.mucTieu = mtMatch[2].trim();

        const tbMatch = text.match(/#*\s*(Thiết bị|Học liệu|Công cụ)([\s\S]*?)(?=#|$)/i);
        if (tbMatch) sections.thietBi = tbMatch[2].trim();

        // Hoạt động
        const kdMatch = text.match(/#*\s*(Hoạt động 1|Khởi động)([\s\S]*?)(?=#|$)/i);
        if (kdMatch) sections.activities.khoi_dong = kdMatch[2].trim();

        const kpMatch = text.match(/#*\s*(Hoạt động 2|Khám phá)([\s\S]*?)(?=#|$)/i);
        if (kpMatch) sections.activities.kham_pha = kpMatch[2].trim();

        const ltMatch = text.match(/#*\s*(Hoạt động 3|Luyện tập)([\s\S]*?)(?=#|$)/i);
        if (ltMatch) sections.activities.luyen_tap = ltMatch[2].trim();

        const vdMatch = text.match(/#*\s*(Hoạt động 4|Vận dụng)([\s\S]*?)(?=#|$)/i);
        if (vdMatch) sections.activities.van_dung = vdMatch[2].trim();

        return sections;
    }

    private static appendSmartly(original: string | undefined, addition: string): string {
        if (!original) return addition;
        if (original.includes(addition)) return original;
        return `${original}\n\n[CẬP NHẬT CHIẾN LƯỢC]:\n${addition}`;
    }

    private static patchActivity(original: string, improvement: string): string {
        // Nếu hoạt động có cấu trúc [COT_1]...[COT_2], ta cố gắng nhét gợi ý vào phần phù hợp
        if (original.includes("[COT_2]")) {
            return original.replace("[COT_2]", `[COT_2]\n\n[GỢI Ý NÂNG CẤP]:\n${improvement}\n`);
        }
        return `${original}\n\n[GỢI Ý NÂNG CẤP]:\n${improvement}`;
    }
}
