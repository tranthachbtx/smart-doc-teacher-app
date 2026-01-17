
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
      { id: "pillar_1", title: "Trụ cột 1: Thiết lập Khung Xương sống (Audit & Framework)", type: "setup", prompt: "", content: "", isCompleted: false },
      { id: "pillar_2", title: "Trụ cột 2: Kiến tạo & Khám phá (Deep Discovery)", type: "khac", prompt: "", content: "", isCompleted: false },
      { id: "pillar_3", title: "Trụ cột 3: Thực chiến & Đánh giá (Premium Assessment)", type: "khac", prompt: "", content: "", isCompleted: false },
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
        focus: "Tập trung vào Mô hình Công sở giả định và Station Rotation.",
        prompt_type: "SEGMENTED"
      });
      phases.push({
        id: "phase_2",
        name: "Giai đoạn 2: Luyện tập & Phản biện",
        range: "Tiết 3-4",
        focus: "Tập trung vào Case Study thực chiến và Tranh biện (Debate).",
        prompt_type: "SEGMENTED"
      });
      phases.push({
        id: "phase_3",
        name: "Giai đoạn 3: Thực hành địa phương & Vận dụng",
        range: "Tiết 5-6",
        focus: "Tổ chức 'Đấu thầu dự án' và Chiến dịch truyền thông số.",
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
    const totalPeriods = context.duration || smartData.duration || "3 tiết";

    return `
# VAI TRÒ: Kiến trúc sư trưởng Chương trình Giáo dục (Liberal Arts - v40.1).
# NHIỆM VỤ: Thiết lập "FILE CẤU HÌNH CỐT LÕI" cho chủ đề (${context.topic}) - Khối ${context.grade}.

# DỮ LIỆU CỨNG (TIÊM TRỰC TIẾP):
1. **Trọng tâm Khối 12:** Tư duy phản biện cấp cao, Giải quyết xung đột lợi ích "Kinh tế vs Môi trường", Định hướng nghề nghiệp xanh (Green Jobs).
2. **Yêu cầu 5512:** Phân rã mục tiêu thành Kiến thức (Luật/Quy định), Năng lực (Thiết kế/Vận động), Phẩm chất (Trách nhiệm công dân toàn cầu).

# DỮ LIỆU ĐẦU VÀO:
- Chủ đề: ${context.topic} (${totalPeriods}).
- Smart Data: """${JSON.stringify({
      objectives: smartData.objectives,
      characteristics: smartData.studentCharacteristics,
      shdc_shl: smartData.shdc_shl_suggestions
    })}"""
- Audit: """${auditAnalysis ? JSON.stringify(auditAnalysis) : "None"}"""

# YÊU CẦU CHIẾN LƯỢC:
1. **Mục tiêu SMART:** Sử dụng động từ mạnh (Bloom bậc cao): "Phân tích", "Phản biện", "Vận hành", "Thiết kế".
2. **Thiết bị:** Ưu tiên Padlet, Canva, Web-based tools.
3. **Agenda (Thay cho Kịch bản):** Thiết kế SHDC/SHL dưới dạng "Lộ trình hành động" có tính tương tác cao (Student Agency), tập trung vào vai trò chủ trì của HS.

# YÊU CẦU OUTPUT JSON (CHẶT CHẼ):
{
  "metadata": { "school": "THPT [Tên trường]", "grade": "${context.grade}", "duration": "${totalPeriods}" },
  "objectives": {
    "knowledge": "...",
    "competence": "...",
    "quality": "..."
  },
  "shdc_outline": {
    "theme": "...",
    "key_message": "...",
    "agenda_steps": ["Bước 1: ...", "Bước 2: ..."],
    "student_roles": "..."
  },
  "shl_outline": {
    "theme": "...",
    "agenda_steps": ["...", "..."],
    "interaction_method": "..."
  },
  "gv_hs_preparation": { "gv": "...", "hs": "..." }
}

QUAN TRỌNG: Chỉ trả về JSON. Không chit-chat.
    `.trim();
  },

  async generatePillar2Prompt(context: PromptContext): Promise<string> {
    this.validateContext(context, 'pillar_2');
    const { smartData, phaseContext, optimizedFileSummary } = context;

    return `
# VAI TRÒ: Kiến trúc sư Sư phạm & Chuyên gia Hướng nghiệp (Constructivism - v40.1).
# CHIẾN LƯỢC: Mô phỏng Môi trường Công sở (Office Simulation) để tăng tính thực tế cho Khối 12.

# 🎯 NGỮ CẢNH (CONTEXT BRIDGE):
- Mục tiêu chính: ${optimizedFileSummary?.objectives?.knowledge || context.topic}.
- Giai đoạn: ${phaseContext?.range || "Tiết 1-2"}.

# YÊU CẦU "MAX CONTENT" (NHIỆM VỤ CÔNG SỞ):
1. **Gamification (Khởi động):** Thiết kế "Đấu thầu dự án" hoặc "Sàn giao dịch ý tưởng".
2. **Mô hình 4 Phòng ban (Trạm):**
   - Trạm 1: Phòng Giải pháp Số (Digital Solutions). Nhiệm vụ: Thiết kế Prototype/Storyboard cho App/Web bảo tồn.
   - Trạm 2: Phòng PR & Marketing. Nhiệm vụ: Lên chiến dịch Viral (TikTok/Hashtag).
   - Trạm 3: Phòng Pháp chế (Legal Dept). Nhiệm vụ: Phân tích Luật (Di sản/Môi trường) liên quan chủ đề.
   - Trạm 4: Phòng R&D. Nhiệm vụ: Sáng tạo mô hình sản phẩm xanh.
3. **Role GV:** Đóng vai "Giám đốc Dự án" hoặc "Cố vấn chuyên môn".

# DỮ LIỆU ĐẦU VÀO:
- Smart Data: """${JSON.stringify({
      khoi_dong: smartData.coreMissions.khoiDong,
      kham_pha: smartData.coreMissions.khamPha
    })}"""

# YÊU CẦU OUTPUT JSON:
{
  "warm_up": { "name": "...", "simulation_goal": "...", "procedure": "...", "facilitator_script": "..." },
  "discovery_stations": [
    { "dept_name": "Phòng Giải pháp Số", "task": "...", "deliverable": "..." },
    { "dept_name": "Phòng PR & Marketing", "task": "...", "deliverable": "..." },
    { "dept_name": "Phòng Pháp chế", "task": "...", "deliverable": "..." },
    { "dept_name": "Phòng R&D", "task": "...", "deliverable": "..." }
  ],
  "facilitator_notes": "..."
}
    `.trim();
  },

  async generatePillar3Prompt(context: PromptContext): Promise<string> {
    this.validateContext(context, 'pillar_3');
    const { smartData, phaseContext, optimizedFileSummary } = context;

    return `
# VAI TRÒ: Chuyên gia Đánh giá & Thực chiến (Circular 22 Standard - v40.1).
# CHIẾN LƯỢC: Tích hợp Bối cảnh địa phương & Đánh giá định lượng.

# 🎯 NGỮ CẢNH ĐỊA PHƯƠNG (INJECTION):
- Sử dụng bối cảnh: Xung đột lợi ích tại một địa danh cụ thể (Mũi Né/Lâm Đồng/Hạ Long).
- Trọng tâm: Xử lý mâu thuẫn giữa Phồn vinh kinh tế và Bảo tồn danh thắng.

# YÊU CẦU NÂNG CẤP (QUAN TRỌNG):
1. **Case Study (Signature):** Xây dựng tình huống "Đối đầu quan điểm". HS đóng vai: Chính quyền, Chủ đầu tư, Người dân địa phương, Nhà khoa học. Yêu cầu Tranh biện (Role-play Debate).
2. **Dự án Vận dụng (RFP):** Thiết kế "Bản mời thầu dự án Đại sứ Số". HS nộp hồ sơ giải pháp truyền thông số.
3. **Rubric (Chuẩn Thông tư 22):** Tạo Rubric định lượng 4 mức độ biểu hiện cho các tiêu chí: Giải pháp sáng tạo, Năng lực phản biện, Thái độ trách nhiệm.

# DỮ LIỆU ĐẦU VÀO:
- Mục tiêu: """${JSON.stringify(optimizedFileSummary?.objectives)}"""
- Smart Data: """${JSON.stringify({
      luyen_tap: smartData.coreMissions.luyenTap,
      van_dung: smartData.coreMissions.vanDung
    })}"""

# YÊU CẦU OUTPUT JSON:
{
  "practice_scenario": {
    "title": "Case Study: ...",
    "context": "...",
    "roles": ["...", "..."],
    "debate_questions": ["?", "?"]
  },
  "project_proposal": {
    "title": "RFP: ...",
    "timeline": "Micro-project (72h)",
    "requirements": "...",
    "submission_format": "Digital Portfolio"
  },
  "assessment_matrix": {
    "criteria": [
      { "name": "Giải pháp sáng tạo", "levels": { "excellent": "...", "good": "...", "pass": "...", "fail": "..." } },
      { "name": "Năng lực phản biện", "levels": { "excellent": "...", "good": "...", "pass": "...", "fail": "..." } }
    ],
    "grading_guide": "Cách quy đổi sang thang điểm 10"
  }
}
    `.trim();
  }
};
