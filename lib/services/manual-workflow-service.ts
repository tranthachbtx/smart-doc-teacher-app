
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
        focus: "Phát triển toàn diện kiến thức và kỹ năng thực hành theo chuẩn 5512.",
        prompt_type: "STANDARD"
      });
    } else {
      // CHIẾN THUẬT "NHÂN BẢN" (ITERATION) CHO BÀI DÀI TIẾT
      phases.push({
        id: "phase_1",
        name: "Giai đoạn 1: Khám phá thực trạng & Giải pháp",
        range: `Tiết 1-2`,
        focus: "Tập trung vào Gamification (Khởi động) và Trạm thông tin (Khám phá). Yêu cầu AI viết chi tiết các phiếu khảo sát thực trạng, sơ đồ tư duy giải quyết vấn đề.",
        prompt_type: "SEGMENTED"
      });
      phases.push({
        id: "phase_2",
        name: "Giai đoạn 2: Tuyên truyền & Lan tỏa",
        range: `Tiết 3-4`,
        focus: "Tập trung vào nội dung 'Viral'. Thiết kế hoạt động làm Poster, Storyboard cho Video/Podcast. Yêu cầu AI viết chi tiết các thông điệp truyền thông và kịch bản thuyết trình.",
        prompt_type: "SEGMENTED"
      });
      phases.push({
        id: "phase_3",
        name: "Giai đoạn 3: Thực hành địa phương & Tổng kết",
        range: `Tiết 5-6`,
        focus: "Tập trung vào 'Social Action'. Thiết kế dự án ra quân thực tế (dọn dẹp, bảo tồn). Yêu cầu AI viết chi tiết timeline triển khai, bảng phân công nhiệm vụ và Rubric đánh giá dự án.",
        prompt_type: "SEGMENTED"
      });
    }
    return phases;
  },

  validateContext(context: PromptContext, pillarId: string) {
    const errors: string[] = [];
    if (!context.topic) errors.push("CRITICAL: Chủ đề bài học (Topic) đang trống.");
    if (!context.smartData || !context.smartData.objectives) errors.push("CRITICAL: Dữ liệu chuẩn (Database) không tồn tại.");

    // Fail Fast: Ensure phaseContext exists for Pillar 2 & 3 if lesson is long
    if ((pillarId === 'pillar_2' || pillarId === 'pillar_3') && !context.phaseContext) {
      errors.push("CRITICAL: Chưa xác định Giai đoạn (Phase). Vui lòng chạy 'Deep Trace PDF' hoặc kiểm tra lộ trình tiết.");
    }

    if (pillarId !== 'pillar_1' && (!context.fileSummary || context.fileSummary.length < 100)) {
      errors.push("CRITICAL: Dữ liệu PDF rỗng hoặc quá ngắn để thực hiện phẫu thuật chuyên sâu.");
    }

    if (errors.length > 0) {
      const errorMsg = `[FAIL-LOUD] 💥 VI PHẠM TOÀN VẸN DỮ LIỆU:\n- ${errors.join('\n- ')}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
  },

  /**
   * PROMPT 1: KHUNG & ĐỊNH HƯỚNG CHIẾN LƯỢC (v39.1 - FINAL - Chief Architect Mode)
   */
  async generatePillar1Prompt(context: PromptContext): Promise<string> {
    this.validateContext(context, 'pillar_1');
    const { smartData, auditAnalysis, phaseContext } = context;

    // Determine actual periods from phaseContext or smartData or context
    const actualPeriods = phaseContext ? phaseContext.range : "3 tiết";

    return `
# VAI TRÒ: Kiến trúc sư trưởng Chương trình Giáo dục (Liberal Arts & Digital Transformation - v39.1).

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
  "ten_truong": "Trường THPT [Tên trường trong PDF hoặc để trống]",
  "to_chuyen_mon": "[Tổ chuyên môn]",
  "ten_giao_vien": "[Tên giáo viên]",
  "ten_bai": "${smartData.topicName}",
  "so_tiet": "${actualPeriods}",
  "muc_tieu_kien_thuc": "...\\n...",
  "muc_tieu_nang_luc": "...\\n...",
  "muc_tieu_pham_chat": "...\\n...",
  "gv_chuan_bi": "...\\n...",
  "hs_chuan_bi": "...\\n...",
  "shdc": "**KỊCH BẢN MC CHI TIẾT (Phân vai MC1, MC2):**\\n...",
  "shl": "**KỊCH BẢN ĐIỀU HÀNH SINH HOẠT LỚP:**\\n..."
}
QUAN TRỌNG: Chỉ trả về JSON.
    `.trim();
  },

  /**
   * PROMPT 2: KIẾN TẠO TRI THỨC (v39.1 - FINAL - Active Learning Script)
   */
  async generatePillar2Prompt(context: PromptContext): Promise<string> {
    this.validateContext(context, 'pillar_2');
    const { smartData, auditAnalysis, phaseContext } = context;

    return `
# VAI TRÒ: Chuyên gia Phương pháp dạy học tích cực (Constructivism Scriptwriter - v39.1).

# 🎯 CHẾ ĐỘ PHÂN ĐOẠN (SEGMENTATION MODE - BẮT BUỘC):
Đây là GIAI ĐOẠN 1 của một chủ đề dài (${context.smartData.grade} - ${context.topic}).
- **PHẠM VI SOẠN THẢO:** Chỉ tập trung soạn nội dung cho **${phaseContext?.range || "Tiết 1-2"}**.
- **TRỌNG TÂM:** Tập trung hoàn toàn vào **Khởi động & Khám phá kiến thức mới**.
- **LƯU Ý:** Tuyệt đối chưa soạn Luyện tập hay Vận dụng. Hãy dành toàn bộ tài nguyên để viết thật sâu, thật chi tiết các nhiệm vụ khám phá, trạm thông tin và kịch bản dẫn dắt của GV cho đúng phạm số tiết này.

# 🏮 TRIẾT LÝ SƯ PHẠM:
- **Constructivism:** HS là trung tâm kiến tạo tri thức.
- **Fail-Safe:** Nếu dữ liệu PDF cũ không đủ sâu, bạn BẮT BUỘC phải tự sáng tạo nội dung dựa trên Database MOET để đảm bảo đủ dung lượng 15-20 trang cho giai đoạn này.

# DỮ LIỆU CỐT LÕI (CHỈ LẤY PHẦN KHÁM PHÁ):
- **Bản kế hoạch hiện tại (Từ Trụ cột 1):** """${JSON.stringify(context.optimizedFileSummary || {})}"""
- **Nhiệm vụ dạy học (Database):** """${JSON.stringify({
      khoi_dong: smartData.coreMissions.khoiDong,
      kham_pha: smartData.coreMissions.khamPha,
      notes: smartData.pedagogicalNotes,
      digital: smartData.digitalCompetency
    })}"""
- **Audit PDF cũ:** ${JSON.stringify(auditAnalysis?.phan_tich_chi_tiet?.filter((a: any) => a.tieu_chi === "Phương pháp" || a.tieu_chi === "Tiến trình"))}

# YÊU CẦU NÂNG CẤP "PERFECT MODE":
1. **Khởi động (Gamification):** Thiết kế trò chơi có luật chơi, cách tính điểm và lời dẫn bùng nổ.
2. **Khám phá (Station Rotation/Jigsaw):** 
   - Nếu là kỹ thuật Trạm: Hãy thiết kế nội dung cho 4 Trạm (Trạm Đọc, Trạm Xem, Trạm Viết, Trạm Thực hành).
   - Viết rõ nội dung trong "PHIẾU HỌC TẬP SỐ 1" phát cho HS tại trạm.
   - **Mô tả chi tiết tài liệu và nhiệm vụ tại từng trạm.** AI hãy viết cụ thể từng phiếu thông tin tại trạm.
3. **Kịch bản sư phạm (Pedagogical Script):** 
   - Không chỉ ghi "GV tổ chức", hãy viết lời thoại: **GV: '...' (Hành động, cử chỉ)**.
   - Viết câu trả lời dự kiến của HS theo 3 hướng: Đúng chuẩn - Sáng tạo - Sai lệch.

# CHỈ THỊ "BƠM" DUNG LƯỢNG (INFLATION DIRECTIVES):
- **Độ dày:** Bạn đang viết cho một giai đoạn quan trọng (15-20 trang). PHẢI diễn giải chi tiết mọi chỉ dẫn.
- **Micro-Actions:** Mô tả kỹ hành động của GV khi quan sát lớp (ví dụ: 'GV đứng ở trạm 1, quan sát nhóm A đang tranh luận về...').
- **Tâm lý học sinh:** Viết 1-2 câu về cảm xúc/tư duy của HS trong từng bước thực hiện.
- **Tài liệu tại trạm:** Mỗi trạm phải là một bản tóm tắt kiến thức/ngữ liệu ít nhất 300 chữ.

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
   * PROMPT 3: THỰC CHIẾN & ĐÁNH GIÁ (v39.1 - FINAL - Project & Assessment Expert)
   */
  async generatePillar3Prompt(context: PromptContext): Promise<string> {
    this.validateContext(context, 'pillar_3');
    const { smartData, phaseContext } = context;

    const isLuyenTap = phaseContext?.id === 'phase_2' || phaseContext?.name.includes("Luyện tập");

    return `
# VAI TRÒ: Chuyên gia Đánh giá & Dự án (Authentic Assessment specialist - v39.1).

# 🎯 CHẾ ĐỘ PHÂN ĐOẠN (SEGMENTATION MODE - BẮT BUỘC):
Đây là **${phaseContext?.name || "Giai đoạn Thực chiến"}** của chủ đề.
- **PHẠM VI SOẠN THẢO:** Chỉ tập trung soạn nội dung cho **${phaseContext?.range || "Các tiết thực hành"}**.
- **TRỌNG TÂM:** ${isLuyenTap ? "Hoạt động Luyện tập & Thực hành kỹ năng chuyên sâu" : "Hoạt động Dự án Vận dụng & Báo cáo thực địa"}.
- **YÊU CẦU ĐẶC BIỆT:** Tuyệt đối không viết tóm tắt. Hãy viết chi tiết mỗi bước như một kịch bản tổ chức sự kiện/dự án thực tế.

# DỮ LIỆU CỐT LÕI (CHỈ LẤY PHẦN LT/VD):
- **Bản kế hoạch hiện tại (Từ Trụ cột 1 & 2):** """${JSON.stringify(context.optimizedFileSummary || {})}"""
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

# CHỈ THỊ "BƠM" DUNG LƯỢNG (INFLATION DIRECTIVES):
- **Case Study:** Phải viết như một câu chuyện ngắn có bối cảnh, nhân vật và mâu thuẫn cao trào (ít nhất 200-300 chữ).
- **Dự án Social:** Chia nhỏ timeline thành từng ngày/tuần. Viết rõ GV hỗ trợ nhóm nào, ở đâu.
- **Chi tiết hóa:** Mọi bảng biểu phải có tiêu đề và hướng dẫn điền cụ thể.

# YÊU CẦU OUTPUT JSON (Tách biệt rõ ràng):
{
  "luyen_tap": { "cot_gv": "**CASE STUDY 200 CHỮ:**\\n...", "cot_hs": "..." },
  "van_dung": { "cot_gv": "**DỰ ÁN STEM/XÃ HỘI:**\\n...", "cot_hs": "..." },
  "phieu_hoc_tap": "**NỘI DUNG PHIẾU HỌC TẬP SỐ 1:**\\n...\\n**NỘI DUNG PHIẾU GIAO VIỆC SỐ 2:**\\n...",
  "rubric_danh_gia": "**RUBRIC ĐÁNH GIÁ DỰ ÁN (Thang điểm 10):**\\n...",
  "huong_dan_ve_nha": "..."
}
QUAN TRỌNG: Chỉ trả về JSON.
    `.trim();
  }
};

