
import { ProcessingModule } from "@/lib/store/use-app-store";
import { SmartPromptData } from "./smart-prompt-service";

export interface PromptContext {
  topic: string;
  grade: string;
  fileSummary: string;
  optimizedFileSummary?: any;
  smartData: SmartPromptData;
}

/**
 * 🛠️ MANUAL WORKFLOW SERVICE v32.0 (ASSEMBLY STRATEGY)
 * Chuyên dụng cho môn HĐTN, HN với quy trình Mapping 1:1 vào Template Word 2 cột.
 */
export const ManualWorkflowService = {
  async analyzeStructure(text: string, analyzedJson?: string): Promise<ProcessingModule[]> {
    return [
      { id: "pillar_1", title: "Trụ cột 1: Khung & Vệ tinh (Metadata)", type: "setup", prompt: "", content: "", isCompleted: false },
      { id: "pillar_2", title: "Trụ cột 2: Kiến tạo Tri thức (HĐ 1+2)", type: "khac", prompt: "", content: "", isCompleted: false },
      { id: "pillar_3", title: "Trụ cột 3: Thực chiến (HĐ 3+4)", type: "khac", prompt: "", content: "", isCompleted: false },
    ];
  },

  /**
   * PROMPT 1: KHUNG & VỆ TINH (RAG: Audit & Upgrade - Database Standard)
   */
  async generatePillar1Prompt(context: PromptContext): Promise<string> {
    const data = context.optimizedFileSummary || {};
    const smartData = context.smartData;

    return `
# VAI TRÒ: Chuyên gia thẩm định và phát triển chương trình HĐTN, HN 12 (v32.3).

# DỮ LIỆU THAM KHẢO (INPUT):
1. **Nội dung từ KHBH cũ (PDF Input):**
"""${JSON.stringify(data.thong_tin_chung || data)}"""
- Dòng SHDC cũ: """${JSON.stringify(data.shdc || data.shdc_cot_1 || "")}"""
- Dòng SHL cũ: """${JSON.stringify(data.shl || data.shl_cot_1 || "")}"""
- Toàn bộ nội dung thô (Tham khảo): """${context.fileSummary}"""

2. **Dữ liệu chuẩn từ Hệ thống (Database Standard):**
- **Yêu cầu cần đạt (YCCĐ) & Mục tiêu chuẩn:** """${smartData.objectives || ""}"""
- **Đặc điểm học sinh:** """${smartData.studentCharacteristics || ""}"""
- **Gợi ý SHDC & SHL chuẩn:** """${smartData.shdc_shl_suggestions || ""}"""

# NHIỆM VỤ (AUDIT & UPGRADE):
Hãy phân tích phần "Mục tiêu" và "Thiết bị" từ file cũ, đối chiếu với Database.
1. **Kiểm tra & Sửa lỗi (Audit):** So sánh với YCCĐ chuẩn. Nếu file cũ viết mục tiêu sai (dùng từ "Hiểu", "Biết"), hãy sửa lại bằng các động từ hành động (Action Verbs) như "Trình bày", "Phân tích", "Thực hiện".
2. **Bổ sung (Upgrade):** Nếu thiếu thiết bị dạy học số (theo xu hướng mới), hãy tự động đề xuất thêm dựa trên đặc điểm học sinh.
3. **SHDC & SHL (Enrich):** Nếu file cũ sơ sài, hãy dùng kiến thức chuyên môn và gợi ý từ Database để viết lại kịch bản chi tiết, hấp dẫn.

# YÊU CẦU OUTPUT JSON (Chuẩn Template):
Hãy trả về JSON duy nhất:
{
  "ten_bai": "${context.topic}",
  "so_tiet": "03",
  "muc_tieu_kien_thuc": "- [Đã chuẩn hóa theo YCCĐ] ...",
  "muc_tieu_nang_luc": "- [Đã chuẩn hóa] ...",
  "muc_tieu_pham_chat": "- [Đã chuẩn hóa] ...",
  "gv_chuan_bi": "...",
  "hs_chuan_bi": "...",
  "shdc": "Kịch bản SHDC (viết thành đoạn văn mô tả ngắn gọn, hấp dẫn)...",
  "shl": "Kịch bản SHL (viết thành đoạn văn mô tả ngắn gọn, gắn kết chủ đề)..."
}
QUAN TRỌNG: Bạn chỉ được trả về DUY NHẤT một khối mã JSON hợp lệ. Không được viết thêm lời dẫn như "Đây là kết quả...", "Dưới đây là JSON...". Bắt đầu ngay bằng ký tự { và kết thúc bằng }.
    `.trim();
  },

  /**
   * PROMPT 2: KIẾN TẠO TRI THỨC (RAG: Rewrite & Enrich - Digital Integration)
   */
  async generatePillar2Prompt(context: PromptContext): Promise<string> {
    const data = context.optimizedFileSummary || {};
    const smartData = context.smartData;

    return `
# VAI TRÒ: Kiến trúc sư sư phạm HĐTN, HN (Digital Native - v32.3).

# DỮ LIỆU THAM KHẢO (INPUT):
1. **Nội dung cũ (PDF Input):**
- Khởi động: """${JSON.stringify(data.hoat_dong_khoi_dong || data.khoi_dong || "")}"""
- Khám phá: """${JSON.stringify(data.hoat_dong_kham_pha || data.kham_pha || "")}"""
- Nội dung gốc toàn văn (Dùng nếu các mục trên trống): """${context.fileSummary}"""

2. **Chỉ dẫn phương pháp chuẩn (Database Standard):**
- **Năng lực số cần tích hợp (TT 02/2025):** """${smartData.digitalCompetency || ""}"""
- **Lưu ý sư phạm & Phương pháp:** """${smartData.pedagogicalNotes || ""}"""
- **Nhiệm vụ cốt lõi:** 
   + KĐ: """${smartData.coreMissions?.khoiDong || ""}"""
   + KP: """${smartData.coreMissions?.khamPha || ""}"""

# NHIỆM VỤ (REWRITE & ENRICH):
Hãy thiết kế lại HĐ Khởi động và Khám phá.
- **Nếu nội dung cũ hay:** Hãy giữ lại ý tưởng cốt lõi nhưng viết chi tiết lời thoại và diễn biến tâm lý (Deep Dive).
- **Nếu nội dung cũ sơ sài/nhàm chán:** Hãy SÁNG TẠO MỚI hoàn toàn dựa trên chỉ dẫn phương pháp và nhiệm vụ cốt lõi. Thêm các trò chơi, video, tình huống giả định.
- **Yêu cầu bắt buộc (Gap Filling):** Phải lồng ghép việc sử dụng công cụ số (Năng lực số từ Database) vào hoạt động của HS nếu file cũ chưa có.

# YÊU CẦU OUTPUT JSON (Cấu trúc 2 cột phẳng cho Template):
{
  "khoi_dong": {
    "cot_gv": "**Phương pháp:** ...\n- GV chiếu video/tranh ảnh...\n- Câu hỏi gợi mở: ...",
    "cot_hs": "- HS quan sát...\n- Trả lời: ..."
  },
  "kham_pha": {
    "cot_gv": "**Chuyển giao nhiệm vụ:** ...\n**Hỗ trợ/Gợi mở:** ...",
    "cot_hs": "- Thảo luận nhóm...\n- Sản phẩm dự kiến: ..."
  }
}
QUAN TRỌNG: Bạn chỉ được trả về DUY NHẤT một khối mã JSON hợp lệ. Không được viết thêm lời dẫn như "Đây là kết quả...", "Dưới đây là JSON...". Bắt đầu ngay bằng ký tự { và kết thúc bằng }.
    `.trim();
  },

  /**
   * PROMPT 3: THỰC CHIẾN (RAG: Optimize & Fill Gaps - Authentic Assessment)
   */
  async generatePillar3Prompt(context: PromptContext): Promise<string> {
    const data = context.optimizedFileSummary || {};
    const smartData = context.smartData;

    return `
# VAI TRÒ: Chuyên gia đánh giá và thực tiễn (v32.3).

# DỮ LIỆU THAM KHẢO (INPUT):
1. **Nội dung cũ (PDF Input):**
- Luyện tập: """${JSON.stringify(data.hoat_dong_luyen_tap || data.luyen_tap || "")}"""
- Vận dụng: """${JSON.stringify(data.hoat_dong_van_dung || data.van_dung || "")}"""
- Nội dung gốc toàn văn (Dùng nếu các mục trên trống): """${context.fileSummary}"""

2. **Kho dữ liệu chuẩn (Database Standard):**
- **Nhiệm vụ cốt lõi (Gợi ý sản phẩm):** 
   + LT: """${smartData.coreMissions?.luyenTap || ""}"""
   + VD: """${smartData.coreMissions?.vanDung || ""}"""
- **Tiêu chí đánh giá & Rubric chuẩn:** """${smartData.assessmentTools || ""}"""

# NHIỆM VỤ (OPTIMIZE & FILL GAPS):
Thiết kế HĐ Luyện tập và Vận dụng.
1. **Luyện tập (Authenticity):** Nếu bài tập cũ quá lý thuyết, hãy chuyển thể thành tình huống thực tế (Role-play) hoặc Trò chơi hóa (Gamification).
2. **Vận dụng (Project-based):** Xây dựng một Dự án nhỏ (Project) ở nhà cho HS, dựa trên gợi ý cốt lõi từ Database.
3. **Đánh giá (Rubric):** BẮT BUỘC phải tạo ra một Phụ lục chứa Phiếu học tập hoặc Rubric chấm điểm chi tiết (dựa trên dữ liệu Rubric từ Database).

# YÊU CẦU OUTPUT JSON (Cấu trúc 2 cột phẳng cho Template):
{
  "luyen_tap": {
    "cot_gv": "**Tổ chức:** ...\n- Quy luật chơi: ...",
    "cot_hs": "- Tham gia trò chơi...\n- Rút ra bài học..."
  },
  "van_dung": {
    "cot_gv": "**Giao dự án:** ...\n- Tiêu chí đánh giá: ...",
    "cot_hs": "- Lập kế hoạch thực hiện...\n- Cam kết hoàn thành..."
  },
  "ho_so_day_hoc": "- **Phiếu học tập số 1:** ...\n\n- **Rubric đánh giá:** ...",
  "huong_dan_ve_nha": "Dặn dò cụ thể và chi tiết..."
}
QUAN TRỌNG: Bạn chỉ được trả về DUY NHẤT một khối mã JSON hợp lệ. Không được viết thêm lời dẫn như "Đây là kết quả...", "Dưới đây là JSON...". Bắt đầu ngay bằng ký tự { và kết thúc bằng }.
    `.trim();
  }
};
