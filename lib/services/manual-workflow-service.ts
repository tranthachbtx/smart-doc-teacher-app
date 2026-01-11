
import { ProcessingModule } from "@/lib/store/use-app-store";
import { SmartPromptData } from "./smart-prompt-service";

export interface PromptContext {
  topic: string;
  grade: string;
  fileSummary: string;
  optimizedFileSummary?: any;
  pdfReference?: any;
  smartData: SmartPromptData;
  auditAnalysis?: any;       // New: Result from AIAuditorService
  phaseContext?: any;        // New: Segmented phase info
}

/**
 * 🛠️ MANUAL WORKFLOW SERVICE v35.1 (SEGMENTATION ARCHITECTURE)
 * Chuyên dụng cho môn HĐTN, HN với quy trình "Chia để trị" và "Phê bình sư phạm".
 */
export const ManualWorkflowService = {
  async analyzeStructure(text: string, analyzedJson?: string): Promise<ProcessingModule[]> {
    return [
      { id: "pillar_1", title: "Trụ cột 1: Khung & Vệ tinh (Audit Mode)", type: "setup", prompt: "", content: "", isCompleted: false },
      { id: "pillar_2", title: "Trụ cột 2: Kiến tạo & Khám phá (Deep)", type: "khac", prompt: "", content: "", isCompleted: false },
      { id: "pillar_3", title: "Trụ cột 3: Thực chiến & Đánh giá (Premium)", type: "khac", prompt: "", content: "", isCompleted: false },
    ];
  },

  /**
   * 💻 MODULE 2: SEGMENTATION ENGINE
   * Chia nhỏ bài học dựa trên số tiết để đạt độ dài 60 trang.
   */
  generateExecutionPlan(so_tiet: string) {
    const totalPeriods = parseInt(so_tiet.replace(/\D/g, '')) || 3;
    let phases = [];

    if (totalPeriods < 6) {
      phases.push({
        id: "single",
        name: "Toàn bộ bài học",
        range: `Tiết 1 - ${totalPeriods}`,
        focus: "Phát triển toàn diện kiến thức và kỹ năng thực hành.",
        prompt_type: "STANDARD"
      });
    } else {
      phases.push({
        id: "phase_1",
        name: "Giai đoạn 1: Khơi gợi & Khám phá",
        range: `Tiết 1 - ${Math.ceil(totalPeriods * 0.3)}`,
        focus: "Tập trung vào Gamification (Khởi động) và Trạm thông tin/Mảnh ghép (Khám phá kiến thức).",
        prompt_type: "SEGMENTED"
      });
      phases.push({
        id: "phase_2",
        name: "Giai đoạn 2: Luyện tập & Kỹ năng",
        range: `Tiết ${Math.ceil(totalPeriods * 0.3) + 1} - ${Math.floor(totalPeriods * 0.7)}`,
        focus: "Tập trung vào Tình huống giả định (Case Study) và Đóng vai xử lý mâu thuẫn chuyên sâu.",
        prompt_type: "SEGMENTED"
      });
      phases.push({
        id: "phase_3",
        name: "Giai đoạn 3: Vận dụng & Đánh giá",
        range: `Tiết ${Math.floor(totalPeriods * 0.7) + 1} - ${totalPeriods}`,
        focus: "Tập trung vào Dự án thực tế (Project-based), Tổ chức sự kiện và Rubric đánh giá 4 mức độ.",
        prompt_type: "SEGMENTED"
      });
    }
    return phases;
  },

  validateContext(context: PromptContext, pillarId: string) {
    const errors: string[] = [];
    if (!context.topic) errors.push("Chủ đề bài học (Topic) đang trống.");
    if (!context.smartData || !context.smartData.objectives) errors.push("Dữ liệu chuẩn (Database) không tồn tại.");

    if (pillarId !== 'pillar_1' && (!context.pdfReference || Object.keys(context.pdfReference).length === 0)) {
      errors.push("Không tìm thấy dữ liệu phân tích từ PDF.");
    }

    if (errors.length > 0) {
      throw new Error(`[FAIL-LOUD] 💥 Vi phạm toàn vẹn dữ liệu:\n- ${errors.join('\n- ')}`);
    }
  },

  /**
   * PROMPT 1: KHUNG & ĐỊNH HƯỚNG CHIẾN LƯỢC (v39.0 - Chief Architect Mode)
   */
  async generatePillar1Prompt(context: PromptContext): Promise<string> {
    this.validateContext(context, 'pillar_1');
    const { smartData, auditAnalysis } = context;

    return `
# VAI TRÒ: Kiến trúc sư trưởng Chương trình Giáo dục (Liberal Arts & Digital Transformation - v39.0).
# NHIỆM VỤ: Thiết lập "Bộ não trung tâm" cho giáo án, lột xác hoàn toàn file PDF cũ.

# DỮ LIỆU ĐẦU VÀO:
1. **Thông tin bài dạy:** Khối ${context.grade}, Chủ đề: ${context.topic}.
2. **Database chuẩn MOET:** """${JSON.stringify({
      objectives: smartData.objectives,
      characteristics: smartData.studentCharacteristics,
      shdc_shl: smartData.shdc_shl_suggestions
    })}"""
3. **KẾT QUẢ ĐỐI SOÁT & PHÊ BÌNH (Audit):** 
"""${auditAnalysis ? JSON.stringify(auditAnalysis) : "Chưa có dữ liệu phê bình."}"""

# YÊU CẦU CHIẾN LƯỢC (CRITICAL):
1. **Phê bình mạnh mẽ:** Đóng vai Hiệu trưởng khó tính, rà soát PDF cũ và trích thẳng các điểm "lạc hậu", "sơ sài".
2. **Learning Path (Mạch truyện):** Xác định mô hình sư phạm chủ đạo (VD: Giải quyết vấn đề hoặc 5E).
3. **Mục tiêu SMART:** Viết lại mục tiêu theo tư duy Khai phóng, tập trung vào Năng lực số và thích ứng xã hội.
4. **Kịch bản Vệ tinh (SHDC/SHL):** Viết chi tiết Lời dẫn MC truyền cảm hứng (Script), phân công nhiệm vụ cụ thể cho từng lớp/tổ.

# YÊU CẦU OUTPUT JSON:
{
  "ten_truong": "[Tên trường]",
  "to_chuyen_mon": "[Tổ chuyên môn]",
  "ten_giao_vien": "[Tên giáo viên]",
  "ten_bai": "${smartData.topicName}",
  "so_tiet": "${context.phaseContext ? "Segmented" : "Full"}",
  "muc_tieu_kien_thuc": "...\\n...",
  "muc_tieu_nang_luc": "...\\n...",
  "muc_tieu_pham_chat": "...\\n...",
  "gv_chuan_bi": "...\\n...",
  "hs_chuan_bi": "...\\n...",
  "shdc": "**KỊCH BẢN MC CHI TIẾT:**\\n...",
  "shl": "**KỊCH BẢN SINH HOẠT LỚP:**\\n..."
}
QUAN TRỌNG: Chỉ trả về JSON.
    `.trim();
  },

  /**
   * PROMPT 2: KIẾN TẠO TRI THỨC (v39.0 - Active Learning Script)
   */
  async generatePillar2Prompt(context: PromptContext): Promise<string> {
    this.validateContext(context, 'pillar_2');
    const { smartData, auditAnalysis, phaseContext } = context;

    return `
# VAI TRÒ: Chuyên gia Phương pháp dạy học tích cực (Constructivism Scriptwriter - v39.0).

# 🎯 PHẠM VI & TRỌNG TÂM:
- **Giai đoạn:** ${phaseContext ? phaseContext.name : "Khởi động & Khám phá"}
- **Kỹ thuật bắt buộc:** Gamification (Khởi động) và Kỹ thuật Trạm/Mảnh ghép (Khám phá).

# DỮ LIỆU CỐT LÕI (CHỈ LẤY PHẦN KHÁM PHÁ):
- **Nghiệm vụ dạy học (Database):** """${JSON.stringify({
      khoi_dong: smartData.coreMissions.khoiDong,
      kham_pha: smartData.coreMissions.khamPha,
      notes: smartData.pedagogicalNotes,
      digital: smartData.digitalCompetency
    })}"""
- **Audit PDF cũ:** ${JSON.stringify(auditAnalysis?.phan_tich_chi_tiet?.filter((a: any) => a.tieu_chi === "Phương pháp" || a.tieu_chi === "Tiến trình"))}

# YÊU CẦU NÂNG CẤP "PERFECT MODE":
1. **Khởi động (Gamification):** Thiết kế trò chơi có luật chơi, cách tính điểm và lời dẫn bùng nổ.
2. **Khám phá (Station Rotation/Jigsaw):** 
   - Chia lớp thành 4 trạm/nhóm. 
   - **Mô tả chi tiết tài liệu và nhiệm vụ tại từng trạm.** AI hãy viết cụ thể từng phiếu thông tin tại trạm.
3. **Kịch bản sư phạm (Pedagogical Script):** 
   - Không chỉ ghi "GV tổ chức", hãy viết lời thoại: **GV: '...' (Hành động, cử chỉ)**.
   - Viết câu trả lời dự kiến của HS theo 3 hướng: Đúng chuẩn - Sáng tạo - Sai lệch.

# YÊU CẦU OUTPUT JSON:
{
  "hoat_dong_khoi_dong_cot_1": "...",
  "hoat_dong_khoi_dong_cot_2": "...",
  "hoat_dong_kham_pha_cot_1": "**KỸ THUẬT TRẠM/MẢNH GHÉP CHI TIẾT:**\\n...",
  "hoat_dong_kham_pha_cot_2": "**SẢN PHẨM HS TỪNG TRẠM:**\\n..."
}
QUAN TRỌNG: Chỉ trả về JSON.
    `.trim();
  },

  /**
   * PROMPT 3: THỰC CHIẾN & ĐÁNH GIÁ (v39.0 - Project & Assessment Expert)
   */
  async generatePillar3Prompt(context: PromptContext): Promise<string> {
    this.validateContext(context, 'pillar_3');
    const { smartData, phaseContext } = context;

    return `
# VAI TRÒ: Chuyên gia Đánh giá & Dự án (Authentic Assessment specialist - v39.0).

# 🎯 PHẠM VI: 
- **Trọng tâm:** ${phaseContext ? phaseContext.focus : "Luyện tập & Vận dụng dự án"}

# DỮ LIỆU CỐT LÕI (CHỈ LẤY PHẦN LT/VD):
- **Database LT/VD:** """${JSON.stringify({
      luyen_tap: smartData.coreMissions.luyenTap,
      van_dung: smartData.coreMissions.vanDung,
      rubrics: smartData.assessmentTools
    })}"""

# NHIỆM VỤ CỐT LÕI (UPGRADE):
1. **Luyện tập (Case Study):** Bắt buộc sáng tác một **Tình huống giả định đầy kịch tính (200+ chữ)** để HS tranh luận/đóng vai.
2. **Vận dụng (Project STEM/Social):** Thiết kế dự án thực tế với timeline tuần 1, tuần 2 rõ ràng.
3. **Phiếu học tập:** Tạo nội dung mẫu cho "Phiếu học tập số 1" và "Phiếu giao việc số 2" ngay trong nội dung.
4. **Đánh giá:** Tạo Rubric 4 mức độ (A, B, C, D) sắc bén cho bài dạy này.

# YÊU CẦU OUTPUT JSON:
{
  "luyen_tap": { "cot_gv": "**CASE STUDY 200 CHỮ:**\\n...", "cot_hs": "..." },
  "van_dung": { "cot_gv": "**DỰ ÁN STEM/XÃ HỘI:**\\n...", "cot_hs": "..." },
  "ho_so_day_hoc": "**RUBRIC & PHIẾU HỌC TẬP:**\\n...",
  "huong_dan_ve_nha": "..."
}
QUAN TRỌNG: Chỉ trả về JSON.
    `.trim();
  }
};

