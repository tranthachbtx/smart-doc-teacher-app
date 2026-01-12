
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
    const totalPeriods = smartData.duration || context.duration || "03 tiết";

    return `
# VAI TRÒ: Kiến trúc sư trưởng Chương trình Giáo dục (Liberal Arts & Digital Transformation - v39.2).

# NHIỆM VỤ: Thiết lập "KHUNG XƯƠNG SỐNG" cho toàn bộ chủ đề (${context.topic}) trong ${totalPeriods}.

# DỮ LIỆU ĐẦU VÀO:
1. **Thông tin bài dạy:** Khối ${context.grade}, Chủ đề: ${context.topic}.
2. **Database chuẩn MOET:** """${JSON.stringify({
      objectives: smartData.objectives,
      characteristics: smartData.studentCharacteristics,
      shdc_shl: smartData.shdc_shl_suggestions,
      notes: smartData.pedagogicalNotes
    })}"""
3. **Audit:** """${auditAnalysis ? JSON.stringify(auditAnalysis) : "None"}"""

# YÊU CẦU CHIẾN LƯỢC:
1. **Mục tiêu SMART:** Viết lại mục tiêu theo tư duy Khai phóng cho TOÀN BỘ CHỦ ĐỀ.
2. **Thiết bị:** Padlet, Canva, Mentimeter, Google Forms.
3. **Script MC:** Viết chi tiết lời dẫn và phân công nhiệm vụ.

# YÊU CẦU OUTPUT JSON:
{
  "ten_truong": "Trường THPT [Name]",
  "to_chuyen_mon": "[Tổ chuyên môn]",
  "ten_giao_vien": "[Giáo viên]",
  "ten_bai": "${context.topic}",
  "so_tiet": "${totalPeriods}",
  "muc_tieu_kien_thuc": "...",
  "muc_tieu_nang_luc": "...",
  "muc_tieu_pham_chat": "...",
  "gv_chuan_bi": "...",
  "hs_chuan_bi": "...",
  "shdc": "MC Script...",
  "shl": "Class meeting script..."
}

QUAN TRỌNG: Chỉ trả về JSON.
    `.trim();
  },

  async generatePillar2Prompt(context: PromptContext): Promise<string> {
    this.validateContext(context, 'pillar_2');
    const { smartData, phaseContext } = context;

    return `
# VAI TRÒ: Kiến trúc sư Sư phạm (Constructivism - v39.2).

# 🎯 CHẾ ĐỘ PHÂN ĐOẠN (SEGMENTATION MODE):
Đây là GIAI ĐOẠN 1 của chủ đề ${context.topic}.
- **PHẠM VI:** ${phaseContext?.range || "Tiết 1-2"}.
- **TRỌNG TÂM:** Khởi động & Khám phá.

# DỮ LIỆU:
1. **Mục tiêu Trụ cột 1:** """${JSON.stringify({
      kien_thuc: context.optimizedFileSummary?.muc_tieu_kien_thuc,
      nang_luc: context.optimizedFileSummary?.muc_tieu_nang_luc,
      pham_chat: context.optimizedFileSummary?.muc_tieu_pham_chat
    })}"""
2. **Database:** """${JSON.stringify({
      khoi_dong: smartData.coreMissions.khoiDong,
      kham_pha: smartData.coreMissions.khamPha
    })}"""

# YÊU CẦU:
1. **Gamification:** Trò chơi khởi động.
2. **Station Rotation:** 4 trạm học tập.
3. **Script:** Lời thoại GV và câu trả lời dự kiến của HS.

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
# VAI TRÒ: Chuyên gia Đánh giá (v39.2).

# 🎯 CHẾ ĐỘ PHÂN ĐOẠN:
- **PHẠM VI:** ${phaseContext?.range || "Tiết cuối"}.
- **TRỌNG TÂM:** ${isLuyenTap ? "Luyện tập" : "Vận dụng"}.

# DỮ LIỆU:
1. **Mục tiêu:** """${JSON.stringify({
      kien_thuc: context.optimizedFileSummary?.muc_tieu_kien_thuc,
      nang_luc: context.optimizedFileSummary?.muc_tieu_nang_luc,
      pham_chat: context.optimizedFileSummary?.muc_tieu_pham_chat
    })}"""
2. **Database:** """${JSON.stringify({
      luyen_tap: smartData.coreMissions.luyenTap,
      van_dung: smartData.coreMissions.vanDung
    })}"""

# YÊU CẦU:
1. **Case Study:** Tình huống giả định 300 chữ.
2. **PBL:** Dự án thực tế.
3. **Rubric:** Đánh giá 4 mức độ.

# YÊU CẦU OUTPUT JSON:
{
  "luyen_tap": { "cot_gv": "...", "cot_hs": "..." },
  "van_dung": { "cot_gv": "...", "cot_hs": "..." },
  "phieu_hoc_tap": "...",
  "rubric_danh_gia": "...",
  "huong_dan_ve_nha": "..."
}

QUAN TRỌNG: Chỉ trả về JSON.
    `.trim();
  }
};
