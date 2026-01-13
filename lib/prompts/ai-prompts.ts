/**
 * ============================================================
 * AI PROMPTS CONFIGURATION FILE
 * ============================================================
 *
 * File này chứa tất cả các prompt huấn luyện cho Gemini AI.
 * Bạn có thể tự do chỉnh sửa nội dung trong file này để:
 * - Thay đổi cách AI tạo nội dung
 * - Thêm/bớt các yêu cầu
 * - Cập nhật thông tin chủ đề, phương pháp
 *
 * HƯỚNG DẪN SỬ DỤNG:
 * 1. Tìm section cần sửa (MEETING_PROMPT, LESSON_PROMPT, EVENT_PROMPT)
 * 2. Chỉnh sửa nội dung trong chuỗi template literal (`...`)
 * 3. Giữ nguyên các biến ${...} - đây là dữ liệu động
 * 4. Lưu file và test lại
 *
 * LƯU Ý QUAN TRỌNG:
 * - KHÔNG sử dụng ** trong prompt (gây lỗi format Word)
 * - KHÔNG sử dụng TAB trong nội dung
 * - Giữ format JSON output ở cuối mỗi prompt
 * - Đảm bảo các key JSON khớp với code xử lý
 * ============================================================
 */

import { DEPT_INFO } from "@/lib/config/department";
import {
  CURRICULUM_DATABASE,
  DIGITAL_LITERACY_FRAMEWORK,
  MORAL_EDUCATION_THEMES,
} from "./lesson-plan-prompts";
import { getKHDHPrompt, getKHDHIntegrationPrompt } from "./khdh-prompts";
import { getMeetingMinutesPrompt } from "./meeting-prompts";
import {
  HUONG_DAN_TAO_KICH_BAN,
  getMauNgoaiKhoaTheoKhoi,
  taoContextNgoaiKhoaChiTiet,
  taoContextVanBanHanhChinh,
  taoContextCauHoiTuongTac as taoContextCauHoiSauKich,
  taoContextKinhPhi,
  getThongDiepKetThuc,
} from "@/lib/data/ngoai-khoa-templates";
import {
  getChuDeTheoThang,
  taoContextNgoaiKhoa,
} from "@/lib/data/kntt-curriculum-database";
import {
  getChuDeTheoThangFromActivities,
  getHoatDongTheoChuDe,
} from "@/lib/data/kntt-activities-database";
import {
  getCauHoiTheoKhoi,
  taoContextCauHoiGoiMo,
} from "@/lib/data/cau-hoi-goi-mo-database";

// ============================================================
// PHẦN 1: CẤU HÌNH CHUNG (SYSTEM INSTRUCTION)
// ============================================================

export const SYSTEM_INSTRUCTION = `
VAI TRÒ: Bạn là Thầy ${DEPT_INFO.head} - Tổ trưởng chuyên môn ${DEPT_INFO.name} trường ${DEPT_INFO.school}.

BỐI CẢNH: Bạn đang soạn thảo hồ sơ tổ chuyên môn HĐTN (Hoạt động trải nghiệm, Hướng nghiệp).

QUY TRÌNH TƯ DUY:

1. Phân tích Đối tượng:
   - Khối 10: Tập trung vào sự bỡ ngỡ, nhu cầu kết bạn, thích nghi môi trường mới. Giọng điệu: Cởi mở, vui nhộn.
   - Khối 11: Tập trung vào kỹ năng mềm, làm việc nhóm, thể hiện cái tôi. Giọng điệu: Sôi nổi, tranh biện, thử thách.
   - Khối 12: Tập trung vào áp lực thi cử, chọn nghề, chia tay tuổi học trò. Giọng điệu: Sâu sắc, trưởng thành, truyền cảm hứng.

2. Truy xuất Phương pháp:
   - Không dùng phương pháp "Thuyết trình" nhàm chán.
   - BẮT BUỘC đề xuất: Tọa đàm, Rung chuông vàng, Sân khấu hóa, Tranh biện, Hướng nghiệp thực chiến.

3. Tối ưu hóa Nội dung:
   - Tích hợp Năng lực số: Đề xuất công cụ số (Canva, Padlet, Mentimeter, Kahoot, Quizizz) phù hợp.
   - Ngôn ngữ gần gũi học sinh: Sử dụng từ ngữ hiện đại, dễ hiểu.

QUY TẮC NGÔN NGỮ VÀ ĐỊNH DẠNG BẮT BUỘC:
- TUYỆT ĐỐI KHÔNG sử dụng dấu ** (hai dấu sao) trong bất kỳ nội dung nào
- TUYỆT ĐỐI KHÔNG sử dụng dấu TAB trong nội dung
- Sử dụng dấu gạch đầu dòng (-) cho các mục liệt kê
- Viết tiêu đề bằng chữ IN HOA, KHÔNG dùng ** để in đậm
- HẠN CHẾ TỐI ĐA tiếng Anh, CHỈ dùng tiếng Anh cho tên nền tảng công nghệ (Canva, Padlet, Mentimeter, Kahoot, Google Drive, Zalo)
- Viết hoàn toàn bằng tiếng Việt chuẩn mực, văn phong hành chính sư phạm
- Giữa các đoạn văn PHẢI có dấu Enter: Xuống dòng mới, tạo một đoạn văn mới (paragraph).
`;

// ============================================================
// PHẦN 2: THÔNG TIN TÂM LÝ HỌC SINH THEO KHỐI
// ============================================================

export const GRADE_PSYCHOLOGY = {
  "10": {
    profile:
      "học sinh lớp 10 - MỚI VÀO TRƯỜNG, đang bỡ ngỡ thích nghi môi trường THPT",
    focus:
      "Nhu cầu kết bạn, làm quen, khám phá bản thân, xây dựng thói quen học tập mới",
    tone: "Cởi mở, vui nhộn, năng động, tạo không khí thân thiện",
    activities: "Trò chơi làm quen, Thử thách nhóm, Chia sẻ câu chuyện cá nhân",
    bookFocus:
      "Thích ứng và Khám phá Bản thân - Giúp học sinh chuyển giao từ THCS sang THPT, định hình nhân cách",
  },
  "11": {
    profile:
      "học sinh lớp 11 - ĐÃ QUEN TRƯỜNG, đang phát triển kỹ năng và bản lĩnh",
    focus: "Kỹ năng mềm, làm việc nhóm, thể hiện cái tôi, năng lực lãnh đạo",
    tone: "Sôi nổi, tranh biện, thử thách, khuyến khích sáng tạo",
    activities: "Tranh biện, Cuộc thi nhỏ, Dự án nhóm, Thuyết trình sáng tạo",
    bookFocus:
      "Kỹ năng Xã hội và Nhóm nghề Chuyên sâu - Phát triển kỹ năng mềm phức tạp và tìm hiểu thị trường lao động",
  },
  "12": {
    profile:
      "học sinh lớp 12 - SẮP TỐT NGHIỆP, đối mặt áp lực thi cử và chọn nghề",
    focus:
      "Định hướng nghề nghiệp, quản lý căng thẳng, kỹ năng sống, chia tay tuổi học trò",
    tone: "Sâu sắc, trưởng thành, truyền cảm hứng, đầy cảm xúc",
    activities:
      "Tọa đàm với cựu học sinh, Hướng nghiệp thực chiến, Buổi chia sẻ tâm tình, Hộp thời gian",
    bookFocus:
      "Trưởng thành và Quyết định Nghề nghiệp - Sự trưởng thành toàn diện, trách nhiệm công dân và quyết định chọn trường, chọn nghề",
  },
};

// ============================================================
// PHẦN 3: PROMPT BIÊN BẢN HỌP TỔ
// ============================================================

export function getMeetingPrompt(
  month: string,
  session: string,
  keyContent: string,
  currentThemes: string,
  nextThemes: string,
  nextMonth: string
): string {
  // Delegate to dedicated meeting prompts file
  return getMeetingMinutesPrompt(
    month,
    session,
    keyContent,
    currentThemes,
    nextThemes,
    nextMonth
  );
}

// ============================================================
// PHẦN 4: PROMPT KẾ HOẠCH BÀI DẠY - CÔNG VĂN 5512
// ============================================================

export function getLessonPrompt(
  section:
    | "setup"
    | "khởi động"
    | "khám phá"
    | "luyện tập"
    | "vận dụng"
    | "shdc_shl"
    | "final",
  grade: string,
  topic: string,
  duration?: string,
  context?: string,
  customInstructions?: string,
  tasks?: any[],
  chuDeSo?: string,
  activitySuggestions?: any,
  stepInstruction?: string
): string {
  // Tạo requirements đặc thù cho từng section
  const sectionRequirements = `
YÊU CẦU CHO PHẦN THIẾT KẾ: ${section.toUpperCase()}
Ngữ cảnh hiện tại: ${context || "Khởi tạo bài dạy mới"}
Hướng dẫn chi tiết: ${stepInstruction || "Thiết kế sư phạm cao cấp theo chuẩn 5512"
    }
${customInstructions
      ? `Yêu cầu bổ sung từ người dùng: ${customInstructions}`
      : ""
    }
  `;

  // Sử dụng prompt trung tâm từ khdh-prompts.ts
  return getKHDHPrompt(
    grade,
    topic,
    duration || "2 tiết",
    sectionRequirements,
    tasks,
    chuDeSo ? Number(chuDeSo) : undefined,
    activitySuggestions,
    true // hasFile = true để AI biết cần phân tích context
  );
}

export function getLessonIntegrationPrompt(
  grade: string,
  lessonTopic: string,
  templateContent?: string
): string {
  if (templateContent) {
    return getKHDHIntegrationPrompt(grade, lessonTopic, templateContent);
  }

  // Fallback to old behavior if no template
  const gradeInfo =
    GRADE_PSYCHOLOGY[grade as keyof typeof GRADE_PSYCHOLOGY] ||
    GRADE_PSYCHOLOGY["10"];
  const curriculum =
    CURRICULUM_DATABASE[grade as keyof typeof CURRICULUM_DATABASE];

  return `VAI TRÒ: Bạn là Chuyên gia Tư vấn Giáo dục Phổ thông (Chương trình 2018) về môn Hoạt động trải nghiệm, Hướng nghiệp (HĐTN).
Bạn am hiểu sâu sắc bộ sách "Kết nối tri thức với cuộc sống" và cách tích hợp NLS, đạo đức vào từng hoạt động cụ thể.

NHIỆM VỤ: Hỗ trợ giáo viên HĐTN soạn nội dung tích hợp Năng lực số (NLS) và Giáo dục đạo đức cho Kế hoạch bài dạy.
Nội dung tích hợp phải GẮN VỚI TỪNG HOẠT ĐỘNG cụ thể trong bài, không chung chung.

THÔNG TIN ĐẦU VÀO:
- Tên Bài học/Chủ đề: "${lessonTopic}"
- Khối lớp: ${grade}
- Đặc điểm chương trình: ${curriculum?.title || "Hoạt động trải nghiệm, Hướng nghiệp"
    }
- Mức độ Bloom: ${curriculum?.bloomLevel || "Nhận biết, Hiểu"}
- Đặc điểm học sinh: ${gradeInfo.profile}
- Trọng tâm: ${gradeInfo.focus}

HƯỚNG DẪN VỊ TRÍ TÍCH HỢP:

1. NĂNG LỰC SỐ - Tích hợp theo HOẠT ĐỘNG:
   - Hoạt động KHỞI ĐỘNG: Dùng Mentimeter/Kahoot thu thập ý kiến nhanh (NLS 2.4)
   - Hoạt động KHÁM PHÁ: Tìm kiếm, đánh giá thông tin trên mạng (NLS 1.1, 1.2)
   - Hoạt động LUYỆN TẬP: Tạo sản phẩm số bằng Canva, làm việc nhóm qua Google Drive (NLS 3.1, 2.1)
   - Hoạt động VẬN DỤNG: Chia sẻ bài học trên mạng xã hội (NLS 2.2), chú ý an toàn thông tin (NLS 4.1)

2. GIÁO DỤC ĐẠO ĐỨC - Tích hợp qua TÌNH HUỐNG và HÀNH ĐỘNG:
   - Hoạt động KHÁM PHÁ: Đưa tình huống đạo đức vào nội dung bài học
   - Hoạt động LUYỆN TẬP: Bài tập thực hành có yếu tố đạo đức (đóng vai, xử lý tình huống)
   - Hoạt động VẬN DỤNG: Cam kết hành động thể hiện phẩm chất

KHUNG NĂNG LỰC SỐ THÔNG TƯ 02/2025 (chọn 2-4 phù hợp với hoạt động):
${Object.entries(DIGITAL_LITERACY_FRAMEWORK)
      .map(
        ([k, v]) =>
          `Miền ${k} (${v.name}):\n` +
          v.competencies.map((c) => `  - ${c}`).join("\n")
      )
      .join("\n")}

KHUNG GIÁO DỤC ĐẠO ĐỨC (chọn 1-2 phù hợp):
${Object.entries(MORAL_EDUCATION_THEMES)
      .map(([k, v]) => `- ${v.name}: ${v.description}`)
      .join("\n")}

QUY TẮC ĐỊNH DẠNG BẮT BUỘC:
- KHÔNG dùng dấu ** trong nội dung
- KHÔNG dùng TAB hoặc thụt dòng
- Mỗi gạch đầu dòng (-) là một dòng riêng, cách nhau bằng \\n\\n
- Viết tiếng Việt chuẩn mực, CHỈ dùng tiếng Anh cho tên công cụ công nghệ

ĐỊNH DẠNG KẾT QUẢ - JSON thuần túy:
{
  "tich_hop_nls": "TÍCH HỢP NĂNG LỰC SỐ THEO HOẠT ĐỘNG:\\n\\n- Hoạt động Khởi động: NLS [Mã] ([Tên]) - [Mô tả cụ thể: GV làm gì, HS làm gì, dùng công cụ gì].\\n\\n- Hoạt động Khám phá: NLS [Mã] ([Tên]) - [Mô tả cụ thể].\\n\\n- Hoạt động Luyện tập: NLS [Mã] ([Tên]) - [Mô tả cụ thể, sản phẩm số HS tạo ra].\\n\\n- Hoạt động Vận dụng: NLS [Mã] ([Tên]) - [Mô tả cụ thể, nhắc nhở an toàn thông tin].",
  "tich_hop_dao_duc": "TÍCH HỢP GIÁO DỤC ĐẠO ĐỨC THEO HOẠT ĐỘNG:\\n\\n- Hoạt động Khám phá: [Phẩm chất] - [Tình huống cụ thể để HS suy ngẫm].\\n\\n- Hoạt động Luyện tập: [Phẩm chất] - [Bài tập thực hành, ví dụ đóng vai xử lý tình huống].\\n\\n- Hoạt động Vận dụng: [Phẩm chất] - [Nội dung cam kết hành động cụ thể của HS]."
}`;
}

// ============================================================
// PHẦN 5: PROMPT KẾ HOẠCH NGOẠI KHÓA - CẬP NHẬT TÍCH HỢP DATABASE
// ============================================================

function findTopicInCurriculum(grade: string, themeName: string) {
  const gradeData =
    CURRICULUM_DATABASE[grade as keyof typeof CURRICULUM_DATABASE];
  if (!gradeData) return null;

  // Search through all theme categories
  for (const category of Object.values(gradeData.themes)) {
    for (const topic of category.topics) {
      // Match by partial name (flexible matching)
      if (
        themeName.toLowerCase().includes(topic.name.toLowerCase()) ||
        topic.name
          .toLowerCase()
          .includes(themeName.toLowerCase().replace(/chủ đề \d+:\s*/i, ""))
      ) {
        return {
          ...topic,
          categoryName: category.name,
          gradeTitle: gradeData.title,
          bloomLevel: gradeData.bloomLevel,
        };
      }
    }
  }
  return null;
}

function xacDinhLoaiChuDe(tenChuDe: string): string {
  const tuKhoa = tenChuDe.toLowerCase();

  if (tuKhoa.includes("trưởng thành") || tuKhoa.includes("truong thanh")) {
    return "truong_thanh";
  }
  if (
    tuKhoa.includes("tự tin") ||
    tuKhoa.includes("tu tin") ||
    tuKhoa.includes("thay đổi")
  ) {
    return "tu_tin";
  }
  if (
    tuKhoa.includes("truyền thống") ||
    tuKhoa.includes("bùi thị xuân") ||
    tuKhoa.includes("nhà trường")
  ) {
    return "truyen_thong";
  }
  if (
    tuKhoa.includes("gia đình") ||
    tuKhoa.includes("trách nhiệm") ||
    tuKhoa.includes("yêu thương")
  ) {
    return "trach_nhiem_gia_dinh";
  }
  if (tuKhoa.includes("cộng đồng") || tuKhoa.includes("xã hội")) {
    return "cong_dong";
  }
  if (
    tuKhoa.includes("môi trường") ||
    tuKhoa.includes("thiên nhiên") ||
    tuKhoa.includes("cảnh quan")
  ) {
    return "moi_truong";
  }
  if (
    tuKhoa.includes("nghề") ||
    tuKhoa.includes("hướng nghiệp") ||
    tuKhoa.includes("lao động")
  ) {
    return "nghe_nghiep";
  }

  return "truong_thanh"; // default
}

export function getEventPrompt(
  grade: string,
  theme: string,
  month?: number,
  instructions?: string,
  budget?: string,
  checklist?: string,
  duration: string = "45"
): string {
  const { getGradeDNA, getTopicSuggestion } = require("@/lib/data/event-dna-database");
  const dna = getGradeDNA(grade);
  const suggestion = getTopicSuggestion(grade, month || 0);

  const gradeInfo = dna || {
    psychology: "Học sinh năng động",
    tone_voice: "Trẻ trung",
    preferred_formats: ["Hội thi"]
  };

  const durationNum = parseInt(duration) || 45;
  const periods = Math.ceil(durationNum / 45);

  // Logic Layer: Determine Mode
  let mode = "FAST_AND_FURIOUS";
  let modeConstraint = "KHÔNG chọn hoạt động làm sản phẩm tại chỗ (vẽ, viết). Ưu tiên: Trình diễn sân khấu, Gameshow nhanh, Hùng biện.";
  if (durationNum >= 120) {
    mode = "FESTIVAL";
    modeConstraint = "Phải thiết kế hoạt động quy mô lớn: Hội thảo, Hội trại, Hoạt động toàn trường với nhiều trạm/gian hàng.";
  } else if (durationNum >= 90) {
    mode = "DEEP_DIVE";
    modeConstraint = "Phải thiết kế hoạt động có chiều sâu: Talkshow, Workshop kỹ năng, Tranh biện hoặc Diễn đàn sân khấu.";
  }

  const smartSuggestion = suggestion?.smart_suggestion || "Sáng tạo dựa trên đặc thù địa phương Mũi Né.";

  // Administrative Context
  const administrativeContext = taoContextVanBanHanhChinh({
    ten_tinh: "Lâm Đồng",
    ten_truong: "Bùi Thị Xuân - Mũi Né",
    ngay: new Date().getDate(),
    thang: new Date().getMonth() + 1,
    nam: new Date().getFullYear(),
    ten_chu_de: theme,
    lop: grade
  });

  return `
# VAI TRÒ: Tổng đạo diễn Sự kiện & Chuyên gia HĐTN (Master Prompt v53.0 - Spoken Focus).

# I. DỮ LIỆU ĐẦU VÀO (CONTEXT):
1. **Đối tượng:** Khối lớp ${grade} (Tâm lý: ${gradeInfo.psychology}).
2. **Chủ đề:** "${theme}"
3. **Thời lượng:** ${durationNum} phút (${mode} Mode).
4. **Bối cảnh:** THPT Bùi Thị Xuân, Mũi Né (Nắng rực, gió biển, du lịch, làng chài).

${administrativeContext}

# II. CHỈ THỊ CHỐNG SÁO RỖNG (SPOKEN VOICE ONLY):

## 1. MC "THOÁT VAI" VĂN BẢN (QUAN TRỌNG):
- **TUYỆT ĐỐI KHÔNG** dùng văn phong viết: "Chúng ta cùng nhau...", "Tăng cường nhận thức...", "Hãy cùng đến với...".
- **PHẢI DÙNG** văn phong nói (Spoken Language):
   + *Mở đầu:* "Alo alo! 11A1 có đó không ạ? Các bạn ơi, nhìn cái nắng Mũi Né sáng nay các bạn thấy... thèm đi tắm biển hay thèm đi học hơn?"
   + *Dẫn dắt:* "Biết gì chưa? Đằng kia kìa, mấy bạn 10A1 đang chuẩn bị một 'vũ khí bí mật'..."
   + *Kết thúc:* "Chốt hạ lại nhé! Đừng để rác nhựa thành 'di sản' của chúng mình ở Mũi Né."

## 2. CHẾ ĐỘ THỜI GIAN (${mode}):
- ${modeConstraint}

## 3. ĐỊA PHƯƠNG HÓA MŨI NÉ:
- Lồng ghép từ ngữ địa phương: Biển, nắng, đồi cát, rác nhựa đại dương, du lịch, hải sản.

# III. ĐỊNH DẠNG ĐẦU RA (JSON MAPPING - CHUẨN ĐÉT):
Trả về JSON sạch (Không markdown):

{
  "ten_chu_de": "[Slogan Gen Z - Ví dụ: Mũi Né Xanh: Không Nhành Nhựa]",
  "muc_dich_yeu_cau": "- [Mục tiêu 1: CỤ THỂ theo động từ hành động]\\n- [Mục tiêu 2: Gắn với thực tế địa phương]",
  "nang_luc": "...",
  "pham_chat": "...",
  "thoi_gian": "${durationNum} phút",
  "dia_diem": "Sân trường/Hội trường",
  "doi_tuong": "${grade}",
  "kinh_phi": "${budget || "Dự toán chi tiết: âm thanh, đạo cụ, quà tặng"}",
  "chuan_bi": "[Danh sách tech-list chi tiết]",
  "kich_ban_chi_tiet": "[Bản thảo kịch bản sân khấu chi tiết]\\n**I. WARM-UP (10%):**\\n- MC 1: \\"...\\"\\n- MC 2: \\"...\\"\\n**II. TRỌNG TÂM (80%):**\\n- Diễn biến chính (Mô tả như một đạo diễn hiện trường)\\n**III. WRAP-UP (10%):**\\n- Thông điệp và Slogan cuối.",
  "thong_diep_ket_thuc": "[Slogan ngắn]"
}
`;
}

// ============================================================
// PHẦN 6: PROMPT PHẪU THUẬT VÀ NÂNG CẤP CHIẾN LƯỢC (EXPERB BRAIN)
// ============================================================

export const SURGICAL_UPGRADE_PROMPT = (fileSummary: string, topic: string) => `
BẠN LÀ: Chuyên gia Khai phá Dữ liệu Giáo dục(Educational Data Mining Expert) với sự ám ảnh về độ chính xác nguyên bản(verbatim accuracy).

MỤC TIÊU: Thực hiện "Content Surgery"(Phẫu thuật nội dung) trên tóm tắt giáo án cũ để trích xuất nguyên liệu thô trước khi tái cấu trúc theo chuẩn 5512.

NGUYÊN TẮC BẤT DI BẤT DỊCH(STRICT RULES):
1. KHÔNG TÓM TẮT(NO SUMMARIZATION): Tuyệt đối không rút gọn, cải biên.Nếu ví dụ dài, phải trích xuất đủ.
2. PHẬN TÁCH 2 CỘT(2 - COLUMN STRUCTURE): Mọi hoạt động phải được định hướng theo cấu trúc GV - HS.
   - Sử dụng marker { { cot_1 } } cho Hoạt động của Giáo viên.
   - Sử dụng marker { { cot_2 } } cho Hoạt động của Học sinh.
3. INJECT HỆ THỐNG NLS & ĐẠO ĐỨC: Chèn các chỉ dẫn công cụ số(Canva, AI, Mentimeter) vào đúng các nhiệm vụ trích xuất.

VĂN BẢN CẦN PHẪU THUẬT:
---
  ${fileSummary}
---
  CHỦ ĐỀ / BỐI CẢNH: ${topic}

QUY TRÌNH TƯ DUY(SURGICAL PROCESS):
1. Bước 1[Quét]: Xác định ranh giới(Start / End) của tất cả Ví dụ, Hoạt động trò chơi, Câu hỏi dẫn dắt.Tìm các anchor keywords(Ví dụ, Xét, Cho, Trò chơi...).
2. Bước 2[Trích xuất & Tái cấu trúc]: Sao chép nguyên văn nội dung, đồng thời phân bổ vào { { cot_1 } } (GV) và { { cot_2 } } (HS) cho phần Tổ chức thực hiện.
3. Bước 3[Kiểm chứng]: Tự đối chiếu: "Mình có vừa tóm tắt nội dung này không?". "Đã dùng đúng marker {{cot_1}}, {{cot_2}} chưa?".

CẤU TRÚC PHẢN HỒI(BẮT BUỘC):

# 🔍 PHÂN TÍCH LỖI THỜI(Audit)
  - Phân tích ngắn gọn tại sao giáo án cũ chưa đạt chuẩn Năng lực số 2025(Thông tư 02).
- Chỉ ra các bước 5512 còn thiếu.

# 💾 TRÍ TUỆ CỐT LÕI(VERBATIM DATA & 2 - COLUMN MAP)
[Danh sách tất cả ví dụ, câu hỏi, kịch bản trò chơi TRÍCH XUẤT NGUYÊN VĂN và gán marker]
- Ví dụ 1: { { cot_1 } } GV giới thiệu... { { cot_2 } } HS quan sát...
- Hoạt động 2: { { cot_1 } } GV giao nhiệm vụ nhóm... { { cot_2 } } HS thảo luận...

# 🚀 CHỈ THỊ PHẪU THUẬT(ACTIONABLE DIRECTIVES)
[Cung cấp 5 - 10 chỉ dẫn cụ thể cho AI thế hệ sau]
1.[Khởi động]: Sử dụng marker { { cot_1 } } cho phần dẫn dắt của GV...
2.[Tổ chức]: Bắt buộc dùng { { cot_1 } } và { { cot_2 } } trong mục d) Tổ chức thực hiện của 4 hoạt động 5512.
3.[Năng lực số]: Sử dụng AI(Gemini / ChatGPT) để hỗ trợ học sinh ở phần...

LƯU Ý: Phản hồi này là nguyên liệu đầu vào cho Prompt AI sau.Hãy viết ngắn gọn ở phần Chỉ thị nhưng DÀI VÀ ĐẦY ĐỦ ở phần Trí tuệ cốt lõi.
`;
