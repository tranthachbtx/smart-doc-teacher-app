
import { ProcessingModule } from "@/lib/store/use-app-store";
import { SmartPromptData } from "./smart-prompt-service";

export interface PromptContext {
  topic: string;
  grade: string;
  fileSummary: string;
  optimizedFileSummary?: any; // Chứa object cleanData từ bước mổ xẻ
  smartData?: SmartPromptData;
}

/**
 * 🛠️ MANUAL WORKFLOW SERVICE v20.2 (Chế độ 3 Bước - 2 Lần Copy)
 * Tập trung vào việc gộp các hoạt động và tự động hóa phần thủ tục.
 */
export const ManualWorkflowService = {
  /**
   * Khởi tạo cấu trúc module (3 Cụm lớn)
   */
  async analyzeStructure(text: string, analyzedJson?: string): Promise<ProcessingModule[]> {
    // Nếu có dữ liệu đã mổ xẻ từ ContentStructureAnalyzer
    const struct = analyzedJson ? JSON.parse(analyzedJson) : null;

    return [
      {
        id: "mod_setup_sh",
        title: "Cụm 1: Thông tin chung & Sinh hoạt (Tự động)",
        type: "setup",
        prompt: "",
        content: struct ? `Đã mổ xẻ: ${struct.ten_bai}` : "Đang chờ mổ xẻ...",
        isCompleted: !!struct
      },
      {
        id: "mod_main_1",
        title: "Cụm 2: Khởi động & Khám phá (Copy 1)",
        type: "khac",
        prompt: "",
        content: struct ? `Nguồn PDF - Khởi động: ${struct.raw_khoi_dong?.substring(0, 150)}...\n\nNguồn PDF - Khám phá: ${struct.raw_kham_pha?.substring(0, 150)}...` : "Tự động trích xuất nội dung...",
        isCompleted: !!struct
      },
      {
        id: "mod_main_2",
        title: "Cụm 3: Luyện tập & Vận dụng (Copy 2)",
        type: "khac",
        prompt: "",
        content: struct ? `Nguồn PDF - Luyện tập: ${struct.raw_luyen_tap?.substring(0, 150)}...\n\nNguồn PDF - Vận dụng: ${struct.raw_van_dung?.substring(0, 150)}...` : "Tự động trích xuất nội dung...",
        isCompleted: !!struct
      },
    ];
  },

  /**
   * TẠO SIÊU PROMPT GỘP (Khởi động + Khám phá)
   * Chế độ "CHUẨN SƯ PHẠM 5512" (Action-Oriented)
   */
  async generateMergedPrompt1(context: PromptContext): Promise<string> {
    const cleanData = context.optimizedFileSummary || {};

    return `
# VAI TRÒ: CHUYÊN GIA THIẾT KẾ PHƯƠNG PHÁP VÀ TIẾN TRÌNH SƯ PHẠM (Pedagogical Process Designer).
# NHIỆM VỤ: Thiết kế Kế hoạch bài dạy (KHBD) PHẦN 1 (Khởi động & Khám phá) chuẩn 5512.

# 1. DỮ LIỆU ĐẦU VÀO (Đã lọc sạch từ file PDF):
- Nội dung Khởi động: """${cleanData.raw_khoi_dong || "Dựa vào chủ đề để sáng tạo"}"""
- Nội dung Khám phá: """${cleanData.raw_kham_pha || "Dựa vào chủ đề để sáng tạo"}"""
- Năng lực số (NLS) cần tích hợp: ${context.smartData?.digitalCompetency || "Tự chọn NLS phù hợp"}

# 2. QUY TẮC "CHUẨN SƯ PHẠM" (STRICT RULES):
1. **KHÔNG VIẾT LỜI THOẠI HỘI THOẠI**: Tuyệt đối không viết kiểu "GV nói...", "HS chào...". Hãy viết dưới dạng mô tả hành động hành chính.
2. **CỘT GIÁO VIÊN (teacher_action)**: 
   - Mô tả Kỹ thuật dạy học (VD: KWL, Trạm, Mảnh ghép, Động não).
   - Mô tả cụ thể hành động: Giao nhiệm vụ, Chiếu clip, Phát phiếu học tập, Quan sát, Hỗ trợ.
   - Ghi rõ các Câu hỏi định hướng/lệnh bài tập (VD: Yêu cầu HS phân tích..., Câu hỏi: "Em hãy cho biết...").
3. **CỘT HỌC SINH (student_action)**: 
   - Mô tả hành động cụ thể của HS: Thảo luận nhóm 4 người, Ghi kết quả vào Phiếu học tập số 1, Trình bày trên Canva.
   - **SẢN PHẨM CẦN ĐẠT (CỰC KỲ CHI TIẾT)**: Liệt kê các câu trả lời dự kiến, các ý tưởng, nội dung bảng biểu hoàn thiện. Đây là phần trọng tâm để tăng độ dài và chất lượng bài dạy.
4. **TÍCH HỢP NĂNG LỰC SỐ (NLS)**: Lồng ghép việc sử dụng AI, Canva, Padlet hoặc tìm kiếm internet vào các nhiệm vụ khám phá kiến thức.

# 3. ĐỊNH DẠNG JSON OUTPUT (Mảng 2 phần tử):
[
  {
    "id": "hoat_dong_khoi_dong",
    "module_title": "HOẠT ĐỘNG 1: KHỞI ĐỘNG - [Tên sáng tạo]",
    "steps": [
      { "step_type": "transfer", "teacher_action": "Markdown (Mô tả GV giao nv...)", "student_action": "Markdown (Mô tả HS thực hiện & SP dự kiến...)" },
      { "step_type": "perform", ... },
      { "step_type": "report", ... },
      { "step_type": "conclude", ... }
    ]
  },
  {
    "id": "hoat_dong_kham_pha",
    "module_title": "HOẠT ĐỘNG 2: KHÁM PHÁ - [Tên sáng tạo]",
    "steps": [ ... ]
  }
]
        `.trim();
  },

  /**
   * TẠO SIÊU PROMPT GỘP (Luyện tập + Vận dụng)
   */
  async generateMergedPrompt2(context: PromptContext): Promise<string> {
    const cleanData = context.optimizedFileSummary || {};

    return `
# VAI TRÒ: CHUYÊN GIA THIẾT KẾ PHƯƠNG PHÁP SƯ PHẠM.
# NHIỆM VỤ: Thiết kế KHBD PHẦN 2 (Luyện tập & Vận dụng) chuẩn 5512.

# 1. DỮ LIỆU ĐẦU VÀO:
- Nội dung Luyện tập: """${cleanData.raw_luyen_tap || "Sáng tạo bài tập"}"""
- Nội dung Vận dụng: """${cleanData.raw_van_dung || "Sáng tạo dự án thực tế"}"""

# 2. YÊU CẦU THỰC HIỆN:
1. **LUYỆN TẬP (HĐ3)**: Thiết kế các bài tập/trò chơi có tính phân hóa. Mô tả rõ cách giáo viên hướng dẫn học sinh sửa các lỗi sai thường gặp. Ghi chi tiết ĐÁP ÁN DỰ KIẾN (Sản phẩm HS).
2. **VẬN DỤNG (HĐ4)**: Thiết kế một nhiệm vụ/dự án thực tế (trải nghiệm). 
   - Yêu cầu AI viết chi tiết nội dung một **"PHIẾU HƯỚNG DẪN TỰ HÀNH ĐỘNG"** cho HS.
   - Xây dựng một **BẢNG RUBRIC ĐÁNH GIÁ** chi tiết (ít nhất 3 tiêu chí, 4 mức độ) ngay trong phần student_action.
3. **ĐỊNH DẠNG**: Tuyệt đối không dùng lời thoại. Sử dụng gạch đầu dòng và bảng biểu (Markdown) để nội dung khoa học, chuyên nghiệp.

# 3. ĐỊNH DẠNG JSON OUTPUT (Mảng 2 phần tử):
[
  {
    "id": "hoat_dong_luyen_tap",
    "module_title": "HOẠT ĐỘNG 3: LUYỆN TẬP - [Tên]",
    "steps": [ ... ]
  },
  {
    "id": "hoat_dong_van_dung",
    "module_title": "HOẠT ĐỘNG 4: VẬN DỤNG - [Tên]",
    "steps": [ ... ]
  }
]
        `.trim();
  }
};
