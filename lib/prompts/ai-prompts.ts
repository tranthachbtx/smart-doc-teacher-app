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
  month?: number
): string {
  const gradeInfo =
    GRADE_PSYCHOLOGY[grade as keyof typeof GRADE_PSYCHOLOGY] ||
    GRADE_PSYCHOLOGY["10"];
  const gradeNumber = Number.parseInt(grade) || 10;
  const location = "Trường THPT Bùi Thị Xuân - Mũi Né";

  // 1. DATABASE INJECTION: Lấy dữ liệu chuyên môn từ Database
  const topicData = findTopicInCurriculum(grade, theme);
  const chuDeDuLieu = month ? getChuDeTheoThang(gradeNumber as 10 | 11 | 12, month) : null;

  // 2. CONTEXT CONSTRUCTION: Xây dựng bối cảnh sự kiện
  const contextNgoaiKhoa = taoContextNgoaiKhoaChiTiet(gradeNumber, theme);
  const administrativeContext = taoContextVanBanHanhChinh({
    ten_tinh: "Bình Thuận",
    ten_truong: "Bùi Thị Xuân - Mũi Né",
    ngay: new Date().getDate(),
    thang: new Date().getMonth() + 1,
    nam: new Date().getFullYear(),
    ten_chu_de: theme,
  });

  return `
# VAI TRÒ: Tổng đạo diễn Sự kiện Giáo dục (Event Director & Scriptwriter v40.0).

# NHIỆM VỤ:
Bạn đang soạn thảo KẾ HOẠCH NGOẠI KHÓA/SHDC cho ${location}. 
Mục tiêu là tạo ra một tài liệu "SỐNG ĐỘNG", "THỰC TẾ" và "CÓ LINH HỒN", không được phép trả về một bộ khung sơ sài.

# DỮ LIỆU ĐẦU VÀO (CONTEXT):
- **Khối lớp:** ${grade} (Tâm lý: ${gradeInfo.profile} - ${gradeInfo.focus}).
- **Chủ đề chính:** "${theme}".
- **Trọng tâm giáo dục:** ${gradeInfo.bookFocus}.
- **Dữ liệu Database:** ${topicData ? topicData.coreActivity : "Tự sáng tạo dựa trên bối cảnh địa phương"}.

# CHIẾN LƯỢC SÁNG TẠO - MÔ HÌNH 3 LỚP (BẮT BUỘC):

## LỚP 1: CONCEPT HÓA (EVENT CONCEPT)
- **Tên chương trình:** Không đặt tên khô khan. Hãy đặt tên theo kiểu Slogan/Brand (VD: "Community Z - Kiến tạo tương lai", "Mũi Né Xanh - Sóng trẻ vươn xa").
- **Mục tiêu (Event Goals):** Viết mục tiêu dưới dạng "Thông điệp truyền tải" và "Cảm xúc đọng lại" (Phải đo lường được sự thay đổi hành vi/cảm xúc).

## LỚP 2: KỊCH BẢN CHI TIẾT (SCRIPTING - TRỌNG TÂM CHIẾN LƯỢC)
- **Lời dẫn MC (Verbatim Script):** Không viết chỉ dẫn. Phải viết nguyên văn lời thoại MC (Chào mừng, dẫn dắt, đố vui). Giọng văn phải hào hứng, "bắt trend" Gen Z.
- **Nội dung Tranh biện/Tọa đàm (Professional Content):** 
  - Đừng chỉ ghi tên hoạt động. Phải đưa ra một **KIẾN NGHỊ (Motion)** cụ thể, gây tranh cãi và sát với thực tế địa phương.
  - Ví dụ: "Phát triển du lịch Mũi Né: Nên ưu tiên Resort cao cấp hay Bảo tồn làng chài?"
  - Phải viết tóm tắt **3 luận điểm cho phe Ủng hộ** và **3 luận điểm cho phe Phản đối**.
- **Tương tác (Interaction):** Thiết kế 3 câu hỏi trắc nghiệm/đố vui hóc búa kèm đáp án và gợi ý phần quà cụ thể.

## LỚP 3: TỔ CHỨC & LOGISTICS (REAL-WORLD PLANNING)
- **Phân công chi tiết:** Không ghi "phân công ai làm gì". Phải ghi rõ nhiệm vụ cho từng Ban (Nội dung, Hậu cần, Truyền thông) và gán cho các đơn vị chịu trách nhiệm (Lớp trực tuần, Đoàn trường).
- **Checklist:** Liệt kê các đầu việc cần làm trước 1 tuần, 1 ngày và trong sự kiện (Banner, Loa đài, Duyệt văn nghệ...).

# QUY TẮC HÀNH CHÍNH (COMPLIANCE):
- Tuân thủ cấu trúc văn bản hành chính Việt Nam mới nhất (Nghị định 187/2025/NĐ-CP).
- Không sử dụng dấu **. Sử dụng gạch đầu dòng (-) và In hoa tiêu đề.

# ĐỊNH DẠNG ĐẦU RA (JSON MAP):
{
  "ten_ke_hoach": "[TÊN CHƯƠNG TRÌNH SÁNG TẠO - VIẾT HOA]",
  "ten_chu_de": "${theme}",
  "thoi_gian": "7h00 - 7h45 (45 phút Chào cờ/HĐTN)",
  "dia_diem": "Sân trường THPT Bùi Thị Xuân - Mũi Né",
  "doi_tuong": "Học sinh khối ${grade}",
  "so_luong": "Toàn thể học sinh khối ${grade} (Khoảng ... em)",
  "muc_tieu": "- Thông điệp: [Viết thông điệp cảm xúc]\\n- Yêu cầu cần đạt: [Mục tiêu cụ thể]\\n- Năng lực: [NLS, Giao tiếp,...]\\n- Phẩm chất: [Trách nhiệm, Nhân ái,...]",
  "muc_dich_yeu_cau": "...",
  "nang_luc": "...",
  "pham_chat": "...",
  "kinh_phi": "[Bảng dự toán: Decor, Quà tặng, Thuê loa đài, Market...]",
  "du_toan_kinh_phi": ["Trang trí: 500.000đ", "Quà tặng: 300.000đ"],
  "checklist_chuan_bi": ["Duyệt kịch bản", "Thu âm nhạc nền", "In Banner/Backdrop"],
  "thanh_phan_tham_du": "Ban Giám hiệu, Toàn thể GV và HS khối ${grade}.",
  "to_chuc_thuc_hien_chuan_bi": "**1. Ban Nội dung (Chi đoàn 11A1):** Soạn lời dẫn, chuẩn bị tranh biện.\\n**2. Ban Hậu cần (Chi đoàn 11A2):** Kê ghế, loa đài.\\n**3. Ban Truyền thông:** Chụp ảnh, đưa tin lên Fanpage trường.",
  "noi_dung": "I. KHỞI ĐỘNG\\nII. HOẠT ĐỘNG CHÍNH\\nIII. TỔNG KẾT",
  "tien_trinh": [
    {"thoi_gian": "7h00 - 7h10", "hoat_dong": "Văn nghệ & Khởi động: [Tên tiết mục]"},
    {"thoi_gian": "7h10 - 7h35", "hoat_dong": "Trọng tâm: [Tên hoạt động - VD: Tọa đàm/Tranh biện]"},
    {"thoi_gian": "7h35 - 7h45", "hoat_dong": "Giao lưu - Thông điệp"}
  ],
  "kich_ban_chi_tiet": "
[VIẾT CỰC KỲ CHI TIẾT TẠI ĐÂY]
I. PHẦN LỄ & KHỞI ĐỘNG (10 phút):
- Lời dẫn MC: '[MC Minh Anh: Chào mừng các bạn... MC Quốc Bình: Hôm nay chúng ta sẽ...]'
- Trò chơi khởi động: '[Tên trò chơi + Luật chơi]'

II. HOẠT ĐỘNG CHÍNH: [TÊN CONCEPT] (25 phút):
1. Đặt vấn đề: [Mô tả tình huống/vở kịch ngắn]
2. Tranh biện/Tọa đàm:
   - Topic (Motion): [Ví dụ: 'Nên ưu tiên du lịch bền vững hơn là xây dựng ồ ạt tại Mũi Né']
   - Phe Ủng hộ (3 luận điểm): ...
   - Phe Phản đối (3 luận điểm): ...
   - Lời dẫn dẫn dắt nảy lửa của MC.

III. TƯƠNG TÁC KHÁN GIẢ (10 phút):
- Câu hỏi 1: [Nội dung] - Đáp án [X] - Quà: [Y]
- Câu hỏi 2: ...

IV. KẾT LUẬN & THÔNG ĐIỆP:
- Lời bình cuối của MC đọng lại cảm xúc.
  ",
  "thong_diep_ket_thuc": "[Một câu châm ngôn/Slogan chốt hạ]",
  "to_truong": "Trần Hoàng Thạch",
  "hieu_truong": "........................"
}`;
}
}

// ============================================================
// PHẦN 6: PROMPT PHẪU THUẬT VÀ NÂNG CẤP CHIẾN LƯỢC (EXPERB BRAIN)
// ============================================================

export const SURGICAL_UPGRADE_PROMPT = (fileSummary: string, topic: string) => `
BẠN LÀ: Chuyên gia Khai phá Dữ liệu Giáo dục (Educational Data Mining Expert) với sự ám ảnh về độ chính xác nguyên bản (verbatim accuracy).

MỤC TIÊU: Thực hiện "Content Surgery" (Phẫu thuật nội dung) trên tóm tắt giáo án cũ để trích xuất nguyên liệu thô trước khi tái cấu trúc theo chuẩn 5512.

NGUYÊN TẮC BẤT DI BẤT DỊCH (STRICT RULES):
1. KHÔNG TÓM TẮT (NO SUMMARIZATION): Tuyệt đối không rút gọn, cải biên. Nếu ví dụ dài, phải trích xuất đủ.
2. PHẬN TÁCH 2 CỘT (2-COLUMN STRUCTURE): Mọi hoạt động phải được định hướng theo cấu trúc GV - HS.
   - Sử dụng marker {{cot_1}} cho Hoạt động của Giáo viên.
   - Sử dụng marker {{cot_2}} cho Hoạt động của Học sinh.
3. INJECT HỆ THỐNG NLS & ĐẠO ĐỨC: Chèn các chỉ dẫn công cụ số (Canva, AI, Mentimeter) vào đúng các nhiệm vụ trích xuất.

VĂN BẢN CẦN PHẪU THUẬT:
---
${fileSummary}
---
CHỦ ĐỀ/BỐI CẢNH: ${topic}

QUY TRÌNH TƯ DUY (SURGICAL PROCESS):
1. Bước 1 [Quét]: Xác định ranh giới (Start/End) của tất cả Ví dụ, Hoạt động trò chơi, Câu hỏi dẫn dắt. Tìm các anchor keywords (Ví dụ, Xét, Cho, Trò chơi...).
2. Bước 2 [Trích xuất & Tái cấu trúc]: Sao chép nguyên văn nội dung, đồng thời phân bổ vào {{cot_1}} (GV) và {{cot_2}} (HS) cho phần Tổ chức thực hiện.
3. Bước 3 [Kiểm chứng]: Tự đối chiếu: "Mình có vừa tóm tắt nội dung này không?". "Đã dùng đúng marker {{cot_1}}, {{cot_2}} chưa?".

CẤU TRÚC PHẢN HỒI (BẮT BUỘC):

# 🔍 PHÂN TÍCH LỖI THỜI (Audit)
- Phân tích ngắn gọn tại sao giáo án cũ chưa đạt chuẩn Năng lực số 2025 (Thông tư 02).
- Chỉ ra các bước 5512 còn thiếu.

# 💾 TRÍ TUỆ CỐT LÕI (VERBATIM DATA & 2-COLUMN MAP)
[Danh sách tất cả ví dụ, câu hỏi, kịch bản trò chơi TRÍCH XUẤT NGUYÊN VĂN và gán marker]
- Ví dụ 1: {{cot_1}} GV giới thiệu... {{cot_2}} HS quan sát...
- Hoạt động 2: {{cot_1}} GV giao nhiệm vụ nhóm... {{cot_2}} HS thảo luận...

# 🚀 CHỈ THỊ PHẪU THUẬT (ACTIONABLE DIRECTIVES)
[Cung cấp 5-10 chỉ dẫn cụ thể cho AI thế hệ sau]
1. [Khởi động]: Sử dụng marker {{cot_1}} cho phần dẫn dắt của GV...
2. [Tổ chức]: Bắt buộc dùng {{cot_1}} và {{cot_2}} trong mục d) Tổ chức thực hiện của 4 hoạt động 5512.
3. [Năng lực số]: Sử dụng AI (Gemini/ChatGPT) để hỗ trợ học sinh ở phần...

LƯU Ý: Phản hồi này là nguyên liệu đầu vào cho Prompt AI sau. Hãy viết ngắn gọn ở phần Chỉ thị nhưng DÀI VÀ ĐẦY ĐỦ ở phần Trí tuệ cốt lõi.
`;
