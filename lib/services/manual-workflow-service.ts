
import { ProcessingModule } from "@/lib/store/use-app-store";
import { SmartPromptData } from "./smart-prompt-service";

export interface PromptContext {
  topic: string;
  grade: string;
  fileSummary: string;
  optimizedFileSummary?: any;
  pdfReference?: any;
  smartData: SmartPromptData;
  auditAnalysis?: any;
  phaseContext?: any;
  duration?: string;
}

export const ManualWorkflowService = {
  async analyzeStructure(text: string, analyzedJson?: string): Promise<ProcessingModule[]> {
    return [
      { id: "pillar_1", title: "Trụ cột 1: Khung & Vệ tinh (Audit Mode)", type: "setup", prompt: "", content: "", isCompleted: false },
      { id: "pillar_2", title: "Trụ cột 2: Kiến tạo & Khám phá (Deep)", type: "khac", prompt: "", content: "", isCompleted: false },
      { id: "pillar_3", title: "Trụ cột 3: Thực chiến & Đánh giá (Premium)", type: "khac", prompt: "", content: "", isCompleted: false },
    ];
  },

  generateExecutionPlan(so_tiet: string) {
    const totalPeriods = parseInt(so_tiet.replace(/\D/g, '')) || 3;
    let phases = [];

    if (totalPeriods < 6) {
      phases.push({
        id: "single",
        name: "Toàn bộ bài học",
        range: `Tiết 1 - ${totalPeriods}`,
        focus: "Phát triển toàn diện kiến thức và kỹ năng thực hành theo chuẩn 5512.",
        prompt_type: "STANDARD"
      });
    } else {
      phases.push({
        id: "phase_1",
        name: "Giai đoạn 1: Khám phá thực trạng & Giải pháp",
        range: "Tiết 1-2",
        focus: "Tập trung vào Gamification (Khởi động) và Trạm thông tin (Khám phá).",
        prompt_type: "SEGMENTED"
      });
      phases.push({
        id: "phase_2",
        name: "Giai đoạn 2: Tuyên truyền & Lan tỏa",
        range: "Tiết 3-4",
        focus: "Tập trung vào nội dung 'Viral'. Thiết kế hoạt động làm Poster, Storyboard.",
        prompt_type: "SEGMENTED"
      });
      phases.push({
        id: "phase_3",
        name: "Giai đoạn 3: Thực hành địa phương & Tổng kết",
        range: "Tiết 5-6",
        focus: "Tập trung vào 'Social Action'. Thiết kế dự án ra quân thực tế.",
        prompt_type: "SEGMENTED"
      });
    }
    return phases;
  },

  validateContext(context: PromptContext, pillarId: string) {
    const errors: string[] = [];
    if (!context.topic) errors.push("CRITICAL: Topic is empty.");
    if (!context.smartData || !context.smartData.objectives) errors.push("CRITICAL: Database missing.");

    if (pillarId !== 'pillar_1') {
      const hasRawPDF = context.fileSummary && context.fileSummary.length >= 100;
      const hasPillarResult = context.optimizedFileSummary && Object.keys(context.optimizedFileSummary).length > 0;

      if (!hasRawPDF && !hasPillarResult) {
        errors.push("CRITICAL: Missing foundation data. Upload PDF or complete Pillar 1.");
      }
    }

    if (errors.length > 0) {
      console.error(errors.join('\n'));
      throw new Error(`[FAIL-LOUD] DATA INTEGRITY VIOLATION: ${errors.join(', ')}`);
    }
  },

  async generatePillar1Prompt(context: PromptContext): Promise<string> {
    this.validateContext(context, 'pillar_1');
    const { smartData, auditAnalysis } = context;
    // Ensure "so_tiet" is available if not in context.duration
    const totalPeriods = context.duration || smartData.duration || "3 tiết";

    return `
# VAI TRÒ: Kiến trúc sư trưởng Chương trình Giáo dục (Liberal Arts - v39.2).
# NHIỆM VỤ: Thiết lập "KHUNG XƯƠNG SỐNG" cho toàn bộ chủ đề (${context.topic}) trong ${totalPeriods}.

# DỮ LIỆU ĐẦU VÀO:
1. **Thông tin:** Khối ${context.grade}, Chủ đề: ${context.topic}.
2. **Database chuẩn MOET:** """${JSON.stringify({
      objectives: smartData.objectives,
      characteristics: smartData.studentCharacteristics,
      shdc_shl: smartData.shdc_shl_suggestions,
      notes: smartData.pedagogicalNotes
    })}"""
3. **Audit (Phê bình):** """${auditAnalysis ? JSON.stringify(auditAnalysis) : "None"}"""

# YÊU CẦU CHIẾN LƯỢC:
1. **Mục tiêu SMART:** Viết lại mục tiêu theo tư duy Khai phóng, gắn với hành vi cụ thể.
2. **Thiết bị:** Padlet, Canva, Mentimeter, Google Forms.
3. **Script MC:** Viết chi tiết lời dẫn và phân công nhiệm vụ.

# YÊU CẦU OUTPUT JSON:
{
  "ten_truong": "Trường THPT [Tên trường]",
  "to_chuyen_mon": "[Tổ chuyên môn]",
  "ten_giao_vien": "[Giáo viên]",
  "ten_bai": "${context.topic}",
  "so_tiet": "${totalPeriods}",
  "muc_tieu_kien_thuc": "...",
  "muc_tieu_nang_luc": "...",
  "muc_tieu_pham_chat": "...",
  "gv_chuan_bi": "...",
  "hs_chuan_bi": "...",
  "shdc": "**KỊCH BẢN MC CHI TIẾT:**\\n...",
  "shl": "**KỊCH BẢN SINH HOẠT LỚP:**\\n..."
}

QUAN TRỌNG: Chỉ trả về JSON.
    `.trim();
  },

  async generatePillar2Prompt(context: PromptContext): Promise<string> {
    this.validateContext(context, 'pillar_2');
    const { smartData, phaseContext } = context;

    return `
# VAI TRÒ: Kiến trúc sư Sư phạm (Constructivism - v39.2).

# 🎯 CHẾ ĐỘ PHÂN ĐOẠN:
Đây là GIAI ĐOẠN 1 của chủ đề ${context.topic}.
- **PHẠM VI:** ${phaseContext?.range || "Tiết 1 - 2"}.
- **TRỌNG TÂM:** Khởi động & Khám phá kiến thức mới.

# DỮ LIỆU ĐẦU VÀO:
1. **Mục tiêu bài học (Đã chốt):** """${JSON.stringify({
      kien_thuc: context.optimizedFileSummary?.muc_tieu_kien_thuc,
      nang_luc: context.optimizedFileSummary?.muc_tieu_nang_luc,
      pham_chat: context.optimizedFileSummary?.muc_tieu_pham_chat
    })}"""
2. **Database:** """${JSON.stringify({
      khoi_dong: smartData.coreMissions.khoiDong,
      kham_pha: smartData.coreMissions.khamPha
    })}"""

# YÊU CẦU "MAX CONTENT":
1. **Gamification (Khởi động):** Thiết kế trò chơi có luật chơi, cách tính điểm, phần thưởng. Viết lời dẫn dắt (Script) của GV.
2. **Station Rotation (Khám phá):** Thiết kế 4 Trạm học tập.
   - **Quan trọng:** Mô tả chi tiết tài liệu/phiếu thông tin tại từng trạm (AI tự biên soạn nội dung chuyên môn nếu thiếu).
3. **Script:** Viết lời thoại GV và 3 phương án trả lời của HS (Đúng/Sáng tạo/Sai lệch).

# YÊU CẦU OUTPUT JSON:
{
  "hoat_dong_khoi_dong_cot_1": "...",
  "hoat_dong_khoi_dong_cot_2": "...",
  "hoat_dong_kham_pha_cot_1": "...",
  "hoat_dong_kham_pha_cot_2": "..."
}

QUAN TRỌNG: Chỉ trả về JSON.
    `.trim();
  },

  async generatePillar3Prompt(context: PromptContext): Promise<string> {
    this.validateContext(context, 'pillar_3');
    const { smartData, phaseContext } = context;
    const isLuyenTap = phaseContext?.id === 'phase_2' || phaseContext?.name?.includes("Luyện tập");

    return `
# VAI TRÒ: Chuyên gia Đánh giá & Thực chiến (v39.2).

# 🎯 CHẾ ĐỘ PHÂN ĐOẠN:
- **PHẠM VI:** ${phaseContext?.range || "Tiết 3"}.
- **TRỌNG TÂM:** Luyện tập & Vận dụng.

# DỮ LIỆU ĐẦU VÀO:
1. **Mục tiêu bài học:** """${JSON.stringify({
      kien_thuc: context.optimizedFileSummary?.muc_tieu_kien_thuc,
      nang_luc: context.optimizedFileSummary?.muc_tieu_nang_luc,
      pham_chat: context.optimizedFileSummary?.muc_tieu_pham_chat
    })}"""
2. **Database:** """${JSON.stringify({
      luyen_tap: smartData.coreMissions.luyenTap,
      van_dung: smartData.coreMissions.vanDung
    })}"""

# YÊU CẦU NÂNG CẤP (QUAN TRỌNG):
1. **Luyện tập (Fail-Safe):**
   - Kiểm tra dữ liệu Database phần Luyện tập.
   - **Nếu có dữ liệu:** Hãy phát triển nó thành kịch bản chi tiết.
   - **Nếu dữ liệu TRỐNG hoặc sơ sài:** Bạn BẮT BUỘC phải sáng tạo một **Tình huống giả định (Case Study)** dài 300 chữ liên quan đến chủ đề để HS đóng vai xử lý.
2. **Vận dụng (PBL):** Thiết kế Phiếu giao Dự án thực tế (Project-based) với timeline cụ thể.
3. **Đánh giá:** Tạo Rubric 4 mức độ và nội dung các Phiếu học tập/Phiếu giao việc.

# YÊU CẦU OUTPUT JSON:
{
  "luyen_tap": { "cot_gv": "**CASE STUDY / TÌNH HUỐNG (300 chữ):**\\n...", "cot_hs": "..." },
  "van_dung": { "cot_gv": "**DỰ ÁN STEM/XÃ HỘI:**\\n...", "cot_hs": "..." },
  "phieu_hoc_tap": "**NỘI DUNG PHIẾU HỌC TẬP:**\\n...",
  "rubric_danh_gia": "**RUBRIC ĐÁNH GIÁ (Thang điểm 10):**\\n...",
  "huong_dan_ve_nha": "..."
}

QUAN TRỌNG: Chỉ trả về JSON.
    `.trim();
  }
};
