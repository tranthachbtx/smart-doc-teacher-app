
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
    if (!context.topic) errors.push("TOPIC_MISSING: Chủ đề không được để trống.");
    if (!context.smartData || !context.smartData.objectives) errors.push("DATABASE_DISCONNECTED: Không thể kết nối cơ sở dữ liệu MOET.");

    // Pillar 0 không cần dữ liệu nền vì nó là người tạo ra dữ liệu nền
    if (pillarId !== 'pillar_0') {
      const hasContent = context.fileSummary && context.fileSummary.length > 200;
      const hasPillarResults = context.optimizedFileSummary && Object.keys(context.optimizedFileSummary).length > 5;

      if (!hasContent) {
        errors.push("SYNTHETIC_BASE_MISSING: Chưa có 'Khung nội dung nền tảng' từ Trụ cột 0 hoặc file PDF.");
      }

      // Pillar 2 & 3 cần kết quả từ Pillar 1
      if ((pillarId === 'pillar_2' || pillarId === 'pillar_3') && !hasPillarResults) {
        errors.push("FRAMEWORK_MISSING: Bạn phải hoàn thành và dán JSON từ Trụ cột 1 vào hệ thống trước.");
      }
    }

    if (errors.length > 0) {
      const errorMsg = `[FAIL-LOUD] HÀNH ĐỘNG BỊ CHẶN: \n${errors.join('\n')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
  },

  async generatePillar0Prompt(context: any): Promise<string> {
    const { topic, grade, smartData } = context;
    const totalPeriods = context.duration || smartData.duration || "3 tiết";

    return `
# VAI TRÒ: Chuyên gia Phân tích Dữ liệu Văn hóa & Giáo dục học (The Creator - v40.1).
# NHIỆM VỤ: Xây dựng "KHUNG NỘI DUNG NỀN TẢNG" (Synthetic Knowledge Base) cho chủ đề ${topic}.

# YÊU CẦU TỔNG HỢP (SYNTHETIC STRATEGY):
1. **Lý thuyết chuẩn SGK:** Tóm tắt các kiến thức cốt lõi theo chương trình GDPT 2018 (Chân trời/Kết nối).
2. **Bối cảnh địa phương (Grounding):** Tích hợp sâu dữ liệu văn hóa, địa lý vùng miền (Ví dụ: Phan Thiết, Tháp Poshanư, Bàu Trắng, Mũi Né hoặc Lâm Đồng tùy chủ đề).
3. **Ẩn dụ sư phạm (Pedagogical Hooks):** Sáng tạo ít nhất 3 câu chuyện mồi hoặc ẩn dụ kết nối địa danh với bài học.
4. **Năng lực số & Kỹ năng xanh 2025:** Gán nhãn các hoạt động với chỉ số năng lực số cụ thể.

# DỮ LIỆU ĐỊNH HƯỚNG:
- Khối: ${grade}
- Chủ đề: ${topic}
- Thời lượng: ${totalPeriods}
- Trọng tâm MOET: """${smartData.objectives}"""

# YÊU CẦU OUTPUT MỚI (PHÂN TÁCH MARKDOWN):
Hãy trả về kết quả theo cấu trúc sau:
[KEY_KNOWLEDGE]: (Tóm tắt lý thuyết chuyên sâu)
[LOCAL_DATA]: (Dữ liệu địa phương dùng làm học liệu)
[PEDAGOGICAL_PROMPTS]: (Các tình huống/ẩn dụ để mở đầu hoặc dẫn dắt)
[DIGITAL_GREEN_TAGS]: (Các kỹ năng số/xanh cần tích hợp)

QUAN TRỌNG: Đây là tài liệu nguồn để các AI sau này "neo giữ" (Grounding) kiến thức. Hãy viết cực kỳ chi tiết và chính xác.
    `.trim();
  },

  async generatePillar1Prompt(context: PromptContext): Promise<string> {
    this.validateContext(context, 'pillar_1');
    const { smartData, auditAnalysis } = context;
    const totalPeriods = context.duration || smartData.duration || "3 tiết";

    return `
# VAI TRÒ: Kiến trúc sư trưởng Chương trình Giáo dục (Liberal Arts - v40.1).
# NHIỆM VỤ: Thiết lập "FILE CẤU HÌNH CỐT LÕI" cho chủ đề (${context.topic}) - Khối ${context.grade}.

# NGUỒN DỮ LIỆU (SYNTHETIC KNOWLEDGE BASE):
Sử dụng dữ liệu sau đây làm "Single Source of Truth":
"""${context.fileSummary}"""

# DỮ LIỆU CỨNG & CHIẾN LƯỢC:
1. **Trọng tâm Khối 12:** Tư duy phản biện cấp cao, Giải quyết xung đột lợi ích "Kinh tế vs Môi trường", Định hướng nghề nghiệp xanh (Green Jobs).
2. **Yêu cầu 5512:** Phân rã mục tiêu thành Kiến thức (Luật/Quy định), Năng lực (Thiết kế/Vận động), Phẩm chất (Trách nhiệm công dân toàn cầu).

# YÊU CẦU CHIẾN LƯỢC:
1. **Mục tiêu SMART:** Sử dụng động từ mạnh (Bloom bậc cao): "Phân tích", "Phản biện", "Vận hành", "Thiết kế".
2. **Thiết bị:** Ưu tiên Padlet, Canva, Web-based tools.
3. **Agenda (Flowchart):** Thiết kế SHDC/SHL tập trung vào tính tương tác và vai trò chủ trì của HS.

# YÊU CẦU OUTPUT JSON:
{
  "metadata": { "school": "THPT [Tên trường]", "grade": "${context.grade}", "duration": "${totalPeriods}" },
  "objectives": { "knowledge": "...", "competence": "...", "quality": "..." },
  "shdc_outline": { "theme": "...", "key_message": "...", "agenda_steps": [], "student_roles": "..." },
  "shl_outline": { "theme": "...", "agenda_steps": [], "interaction_method": "..." },
  "gv_hs_preparation": { "gv": "...", "hs": "..." }
}

QUAN TRỌNG: Chỉ trả về JSON.
    `.trim();
  },

  async generatePillar2Prompt(context: PromptContext): Promise<string> {
    this.validateContext(context, 'pillar_2');
    const { smartData, phaseContext, optimizedFileSummary } = context;

    return `
# VAI TRÒ: Kiến trúc sư Sư phạm & Chuyên gia Hướng nghiệp (Constructivism - v40.1).
# CHIẾN LƯỢC: Mô phỏng Môi trường Công sở (Office Simulation).

# 🎯 NGỮ CẢNH ĐƯỢC NEO GIỮ (GROUNDING):
- Dữ liệu nền: """${context.fileSummary.substring(0, 3000)}"""
- Mục tiêu bài học (Đã chốt): """${JSON.stringify(optimizedFileSummary?.objectives)}"""

# YÊU CẦU "MAX CONTENT" (NHIỆM VỤ CÔNG SỞ):
1. **Gamification (Khởi động):** Thiết kế "Đấu thầu dự án" hoặc "Sàn giao dịch ý tưởng" dựa trên mục [PEDAGOGICAL_PROMPTS].
2. **Mô hình 4 Phòng ban (Trạm):** Tận dụng dữ liệu [DIGITAL_GREEN_TAGS].
   - Trạm 1: Phòng Giải pháp Số (Digital Solutions).
   - Trạm 2: Phòng PR & Marketing.
   - Trạm 3: Phòng Pháp chế (Legal Dept).
   - Trạm 4: Phòng R&D.
3. **Tài liệu học liệu:** Mô tả chi tiết các phiếu thông tin dựa trên dữ liệu [LOCAL_DATA].

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
Sử dụng dữ liệu [LOCAL_DATA] và [KEY_KNOWLEDGE] từ base:
"""${context.fileSummary.substring(0, 3000)}"""

# YÊU CẦU NÂNG CẤP (QUAN TRỌNG):
1. **Case Study (Signature):** Xây dựng tình huống "Đối đầu quan điểm" dựa trên các mâu thuẫn thực tế đã nêu trong khung nội dung.
2. **Dự án Vận dụng (RFP):** Thiết kế dự án "Đại sứ Số" kết hợp với [DIGITAL_GREEN_TAGS].
3. **Rubric (Chuẩn Thông tư 22):** Định lượng 4 mức độ cho các tiêu chí sáng tạo, phản biện và trách nhiệm.

# YÊU CẦU OUTPUT JSON:
{
  "practice_scenario": { "title": "...", "context": "...", "roles": [], "debate_questions": [] },
  "project_proposal": { "title": "...", "timeline": "Micro-project (72h)", "requirements": "...", "submission_format": "..." },
  "assessment_matrix": {
    "criteria": [
      { "name": "Giải pháp sáng tạo", "levels": { "excellent": "...", "good": "...", "pass": "...", "fail": "..." } }
    ],
    "grading_guide": "..."
  }
}
    `.trim();
  }
};
