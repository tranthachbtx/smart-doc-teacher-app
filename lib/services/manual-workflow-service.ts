
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
    // Nếu có dữ liệu đã mổ xẻ từ ContentStructureAnalyzer hoặc ProfessionalContentProcessor
    const struct = analyzedJson ? JSON.parse(analyzedJson) : null;

    // Helper để lấy text preview từ cấu trúc Arch 19.0 hoặc Arch 20.0
    const getPreview = (key: string, data: any) => {
      if (!data) return "Đang chờ mổ xẻ...";

      // Case 1: Cấu trúc Arch 19.0 (ProfessionalContentProcessor)
      if (data[key] && typeof data[key] === 'object' && data[key].hoatDong) {
        return `[MỤC TIÊU]: ${data[key].mucTieu?.[0] || ""}\n[HÀNH ĐỘNG]: ${data[key].hoatDong?.[0] || ""}`.substring(0, 150) + "...";
      }

      // Case 2: Cấu trúc Arch 20.0 (ContentStructureAnalyzer / AI)
      const rawKey = `raw_${key}`;
      if (data[rawKey]) return data[rawKey].substring(0, 150) + "...";

      return "Dữ liệu không xác định...";
    };

    return [
      {
        id: "mod_setup_sh",
        title: "Cụm 1: Thông tin chung & Sinh hoạt (Tự động)",
        type: "setup",
        prompt: "",
        content: struct ? `Đã mổ xẻ: ${struct.ten_bai || "Sẵn sàng"}` : "Đang chờ mổ xẻ...",
        isCompleted: !!struct
      },
      {
        id: "mod_main_1",
        title: "Cụm 2: Khởi động & Khám phá (Copy 1)",
        type: "khac",
        prompt: "",
        content: `Khởi động: ${getPreview('khoi_dong', struct)}\n\nKhám phá: ${getPreview('kham_pha', struct)}`,
        isCompleted: !!struct
      },
      {
        id: "mod_main_2",
        title: "Cụm 3: Luyện tập & Vận dụng (Copy 2)",
        type: "khac",
        prompt: "",
        content: `Luyện tập: ${getPreview('luyen_tap', struct)}\n\nVận dụng: ${getPreview('van_dung', struct)}`,
        isCompleted: !!struct
      },
    ];
  },

  /**
   * TẠO SIÊU PROMPT GỘP (Khởi động + Khám phá)
   */
  async generateMergedPrompt1(context: PromptContext): Promise<string> {
    const data = context.optimizedFileSummary || {};

    // Hàm trích xuất nội dung mạnh mẽ nhất có thể
    const getContent = (key: string) => {
      if (data[key] && typeof data[key] === 'object' && data[key].hoatDong) {
        return `MỤC TIÊU: ${data[key].mucTieu?.join('; ')}\nNỘI DUNG: ${data[key].hoatDong?.join('\n')}`;
      }
      return data[`raw_${key}`] || "Dựa vào chủ đề để sáng tạo";
    };

    const khoiDong = getContent('khoi_dong');
    const khamPha = getContent('kham_pha');

    return `
# VAI TRÒ: SIÊU TRÍ TUỆ SƯ PHẠM & KIẾN TRÚC SƯ GIÁO DỤC (Pedagogical Architect).
# NHIỆM VỤ: Thiết kế KHBD PHẦN 1 (Khởi động & Khám phá). 

## 🏮 TRIẾT LÝ THIẾT KẾ "LA BÀN" (COMPASS PHILOSOPHY):
- **Độ dày tri thức**: Để đạt 30-50 trang, bạn PHẢI diễn giải cực kỳ chi tiết các bước.
- **Không kịch bản**: Viết dưới dạng chỉ dẫn hành động sư phạm chuyên sâu, không viết lời thoại.

# 1. DỮ LIỆU NGUỒN (Đã mổ xẻ từ PDF):
- NỘI DUNG KHỞI ĐỘNG: """${khoiDong}"""
- NỘI DUNG KHÁM PHÁ: """${khamPha}"""
- NĂNG LỰC SỐ (NLS): ${context.smartData?.digitalCompetency || "Tự chọn NLS phù hợp"}

# 2. QUY TẮC "BÀI DẠY CHUYÊN SÂU":
1. **teacher_action**: Mô tả Kỹ thuật dạy học (Mảnh ghép, Trạm, KWL). Diễn giải chi tiết cách GV điều phối, quan sát và xử lý tình huống sư phạm. Đưa ra các câu hỏi gợi mở "đắt giá".
2. **student_action & SẢN PHẨM**: Đây là trọng tâm. Mô tả CHI TIẾT kết quả học sinh cần đạt. Nếu là thảo luận, hãy viết ra các ý tưởng dự kiến. Nếu là bài tập, hãy viết ĐÁP ÁN CHI TIẾT.

# 3. ĐỊNH DẠNG JSON OUTPUT (Mảng 2 phần tử):
[
  {
    "id": "hoat_dong_khoi_dong",
    "module_title": "HOẠT ĐỘNG 1: KHỞI ĐỘNG - [Tên sáng tạo]",
    "steps": [
      { "step_type": "transfer", "teacher_action": "Markdown (Siêu chi tiết...)", "student_action": "Markdown (Kết quả dự kiến...)" }
    ]
  },
  {
    "id": "hoat_dong_kham_pha",
    "module_title": "HOẠT ĐỘNG 2: KHÁM PHÁ - [Tên]",
    "steps": [ ... ]
  }
]
        `.trim();
  },

  /**
   * TẠO SIÊU PROMPT GỘP (Luyện tập + Vận dụng)
   */
  async generateMergedPrompt2(context: PromptContext): Promise<string> {
    const data = context.optimizedFileSummary || {};

    const getContent = (key: string) => {
      if (data[key] && typeof data[key] === 'object' && data[key].hoatDong) {
        return `MỤC TIÊU: ${data[key].mucTieu?.join('; ')}\nNỘI DUNG: ${data[key].hoatDong?.join('\n')}`;
      }
      return data[`raw_${key}`] || "Dựa vào chủ đề để sáng tạo";
    };

    const luyenTap = getContent('luyen_tap');
    const vanDung = getContent('van_dung');

    return `
# VAI TRÒ: CHUYÊN GIA PHƯƠNG PHÁP SƯ PHẠM.
# NHIỆM VỤ: Thiết kế KHBD PHẦN 2 (Luyện tập & Vận dụng) chuẩn 5512.

## 🏮 CHIẾN LƯỢC NÂNG CẤP "CỰC ĐẠI" (MAXIMIZE CONTENT):
1. **LUYỆN TẬP**: Xây dựng hệ thống bài tập phân hóa. Viết chi tiết đề bài và ĐÁP ÁN CHI TIẾT từng câu.
2. **VẬN DỤNG**: Thiết kế dự án thực tế. Phải bao gồm: **HƯỚNG DẪN TỰ HÀNH ĐỘNG** và **BẢNG RUBRIC ĐÁNH GIÁ** (ít nhất 4 tiêu chí) ngay trong cột student_action.

# 1. DỮ LIỆU NGUỒN:
- NỘI DUNG LUYỆN TẬP: """${luyenTap}"""
- NỘI DUNG VẬN DỤNG: """${vanDung}"""

# 2. ĐỊNH DẠNG JSON OUTPUT (Mảng 2 phần tử):
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
