
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
# VAI TRÒ: CHUYÊN GIA SƯ PHẠM & KIẾN TRÚC SƯ CHƯƠNG TRÌNH (BẢN PHAN THIẾT - LÂM ĐỒNG MỚI)
Hệ thống: Antigravity Deep-Dive v5.0.
Nhiệm vụ: Xây dựng "KHUNG NỘI DUNG NỀN TẢNG" (Synthetic Knowledge Base - SKB).

# 1. BỘ KHUNG KIẾN THỨC GIẢ LẬP (SKB) - DỮ LIỆU ĐỊA PHƯƠNG CỨNG:
Hãy sử dụng các thực thể sau làm ngữ liệu (material), tuyệt đối không dùng ví dụ chung chung:
- VĂN HÓA: Tháp Chăm Poshanư (Kiến trúc Hòa Lai, gạch mài chập, mẫu hệ), Trường Dục Thanh (Thầy giáo Nguyễn Tất Thành).
- ĐỊA LÝ: Đồi Cát Bay & Bàu Trắng (Cát di động, hồ nước ngọt giữa sa mạc), Gió mùa Đông Bắc/Tây Nam.
- KINH TẾ: Nước mắm Phan Thiết (Tỷ lệ 3 cá : 1 muối, thùng lều gỗ Bằng Lăng, kỹ thuật gài nén), Du lịch lướt ván diều Mũi Né.
- STEM: Thanh long Bình Thuận kết hợp nông nghiệp công nghệ cao Lâm Đồng.

# 2. RÀNG BUỘC PHÁP LÝ & SƯ PHẠM (RULE-BASED):
- Cấu trúc 5512: Phải đủ 4 hoạt động (Mở đầu, Hình thành, Luyện tập, Vận dụng).
- Kỹ thuật Sư phạm Địa phương: Tích hợp "Audio Scenography" (Âm thanh định hình không gian: tiếng sóng, tiếng chiêng, tiếng gió).
- Năng lực Số (TT 02/2025): Ánh xạ hành vi học sinh với mã NC1 (Ví dụ: 2.4.NC1.a - Hợp tác số).

# 3. YÊU CẦU ĐẦU RA (SYNTHETIC OUTPUT):
Hãy tổng hợp và trả về bản Markdown có cấu trúc:
[KEY_KNOWLEDGE]: (Tóm tắt lý thuyết chuyên sâu bám sát YCCĐ của bài ${topic}).
[LOCAL_TOUCHPOINTS]: (Phân tích ít nhất 3 điểm chạm giữa bài học và bối cảnh Phan Thiết).
[DIGITAL_GREEN_TAGS]: (Danh sách năng lực số NC1 và Kỹ năng xanh sẽ hình thành).
[PEDAGOGICAL_CONCEPT]: (Ý tưởng chủ đạo xuyên suốt cho bài dạy này dưới dạng một câu chuyện/tình huống).

DỮ LIỆU ĐỊNH HƯỚNG:
- Lớp: ${grade} | Bài: ${topic} | Thời lượng: ${totalPeriods}
- Mục tiêu MOET: """${smartData.objectives}"""
`.trim();
  },

  async generatePillar1Prompt(context: any): Promise<string> {
    this.validateContext(context, 'pillar_1');
    const { topic, grade, fileSummary, smartData } = context;

    return `
# VAI TRÒ: KIẾN TRÚC SƯ SƯ PHẠM (STAGE 1: IDEATION & SKELETON)
Nhiệm vụ: Xây dựng Khung xương giáo án dựa trên SKB.

# DỮ LIỆU NỀN TẢNG (SKB):
"""
${fileSummary}
"""

# YÊU CẦU THIẾT KẾ:
1. Xác định Mục tiêu bài học (Học sinh sẽ LÀM ĐƯỢC GÌ). Gán mã NC1 vào từng mục tiêu cụ thể.
2. Đề xuất Ý tưởng chủ đạo (Key Concept) gắn bối cảnh Phan Thiết (Ví dụ: Dùng Nước mắm dạy Tỉ lệ/Câu lệnh If-Else).
3. Phác thảo khung 4 hoạt động với thời lượng (30% Lý thuyết - 70% Thực hành).

# JSON SCHEMA OUTPUT:
{
  "type": "framework",
  "data": {
    "ten_bai": "Tên bài học kết hợp bối cảnh địa phương",
    "muc_tieu": { "kien_thuc": "...", "nang_luc": "...", "pham_chat": "..." },
    "y_tuong_chu_dao": "Mô tả kịch bản xuyên suốt (Ví dụ: Hệ thống kiểm soát mẻ cá mắm)",
    "ma_nang_luc_so": ["Mã 1.1.NC1.a...", "Mã 2.3.NC1.b..."],
    "phan_bo_thoi_gian": "Chi tiết từng phút cho 4 hoạt động"
  }
}
`.trim();
  },

  async generatePillar2Prompt(context: any): Promise<string> {
    this.validateContext(context, 'pillar_2');
    const { topic, grade, fileSummary, optimizedFileSummary, phaseContext } = context;

    return `
# VAI TRÒ: CHUYÊN GIA BIÊN SOẠN KỊCH BẢN (STAGE 2: SCRIPTING)
Nhiệm vụ: Viết chi tiết Tiến trình dạy học theo chuẩn 4 Bước của Công văn 5512.

# DỮ LIỆU ĐÃ CHỐT:
- Khung bài dạy: """${JSON.stringify(optimizedFileSummary)}"""
- Dòng chảy tri thức: """${fileSummary}"""
${phaseContext ? `- PHÂN ĐOẠN HIỆN TẠI: ${JSON.stringify(phaseContext)}` : ""}

# YÊU CẦU CHI TIẾT (ANTI-VAGUE):
1. Mỗi hoạt động phải mô tả hành vi GV và HS qua 4 bước: (1) Chuyển giao, (2) Thực hiện, (3) Báo cáo, (4) Kết luận.
2. AUDIO SCENOGRAPHY: Tại Hoạt động 1 (Mở đầu), GHI RÕ cột "Audio Cue" (Ví dụ: Tiếng sóng biển Mũi Né, tiếng chuông đồng, tiếng gió cát) để tạo bối cảnh sống động.
3. NGỮ LIỆU THỰC TẾ: Sử dụng các thông số thật từ SKB (Ví dụ: Tỷ lệ cá muối 3:1, gạch nung Poshanư, 18 màu cát Bàu Trắng) vào lời dẫn và bài tập.

# JSON SCHEMA OUTPUT:
{
  "type": "script",
  "hoat_dong_chi_tiet": {
    "ten_hoat_dong": "...",
    "audio_cue": "Gợi ý âm thanh dẫn dắt không gian bản địa",
    "b1_chuyen_giao": "Lời dẫn truyền cảm hứng và yêu cầu cụ thể của GV",
    "b2_thuc_hien": "Hành động cụ thể của HS (Cá nhân/Nhóm). Dùng công cụ số gì?",
    "b3_bao_cao": "Cách thức trình bày/triển lãm sản phẩm (số hoặc thực thể)",
    "b4_ket_luan": "Chốt kiến thức, giải mã nguyên nhân và hướng dẫn mở mở"
  }
}
`.trim();
  },

  async generatePillar3Prompt(context: any): Promise<string> {
    this.validateContext(context, 'pillar_3');
    const { topic, grade, fileSummary, optimizedFileSummary } = context;

    return `
# VAI TRÒ: CHUYÊN GIA KIỂM TRA ĐÁNH GIÁ (STAGE 3: ASSESSMENT & OPTIMIZATION)
Nhiệm vụ: Xây dựng công cụ đo lường và ánh xạ năng lực số NC1.

# DỮ LIỆU ĐÃ SOẠN:
- Nội dung giáo án: """${JSON.stringify(optimizedFileSummary)}"""
- Nền tảng tri thức: """${fileSummary}"""

# YÊU CẦU:
1. Xây dựng RUBRIC ĐÁNH GIÁ: Thang điểm 10, chia làm 4 mức độ hành vi: Nhận biết - Thông hiểu - Vận dụng - Vận dụng cao (Theo TT 22).
2. TÓM TẮT CƠ HỘI NĂNG LỰC SỐ: Liệt kê các hành vi học tập trong bài dạy tương ứng với mã NC1 (Ví dụ: Làm việc nhóm trên Padlet -> 2.4.NC1.a).
3. Đề xuất ít nhất 2 công cụ số hỗ trợ (AI, Canva, Replit, Google Forms...) để tối ưu hóa việc đánh giá thường xuyên.

# JSON SCHEMA OUTPUT:
{
  "type": "assessment",
  "data": {
    "ten_ke_hoach_dg": "Tên kế hoạch đánh giá chuyên nghiệp",
    "rubric_chi_tiet": [
      { 
        "tieu_chi": "...", 
        "trong_so": "...", 
        "muc_do": {
          "xuat_sac": "...",
          "tot": "...",
          "dat": "...",
          "chua_dat": "..."
        }
      }
    ],
    "mapping_nc1": "Bảng đối soát: Hoạt động -> Mã Năng lực số NC1",
    "loi_khuyen_su_pham": "Lời khuyên thực tế để triển khai bài dạy này hiệu quả nhất"
  }
}
`.trim();
  }
};
