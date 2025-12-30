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
  grade: string,
  lessonTopic: string,
  duration?: string
): string {
  // Sử dụng prompt mới từ khdh-prompts.ts
  return getKHDHPrompt(grade, lessonTopic, duration || "2 tiết");
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

KHUNG NĂNG LỰC SỐ (chọn 2-4 phù hợp với hoạt động):
${Object.entries(DIGITAL_LITERACY_FRAMEWORK)
      .map(([k, v]) => `- NLS ${k}: ${v.name} - ${v.description}`)
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

  const topicData = findTopicInCurriculum(grade, theme);

  let chuDeContext = "";
  let hoatDongContext = "";
  let mauKichBanContext = "";
  let cauHoiContext = "";
  let vanBanHanhChinhContext = "";
  let kinhPhiContext = "";
  let cauHoiSauKichContext = "";
  let thongDiepContext = "";

  // Lấy thông tin chủ đề từ kntt-curriculum-database
  if (month) {
    const chuDe = getChuDeTheoThang(gradeNumber as 10 | 11 | 12, month);
    if (chuDe) {
      chuDeContext = taoContextNgoaiKhoa(chuDe);
    }

    // Lấy danh sách hoạt động chi tiết
    const chuDeInfo = getChuDeTheoThangFromActivities(
      gradeNumber as 10 | 11 | 12,
      month
    );
    if (chuDeInfo) {
      const hoatDongList = getHoatDongTheoChuDe(
        gradeNumber as 10 | 11 | 12,
        chuDeInfo.so_chu_de
      );
      if (hoatDongList.length > 0) {
        hoatDongContext = `
DANH SÁCH HOẠT ĐỘNG CÓ THỂ TỔ CHỨC NGOẠI KHÓA (${hoatDongList.length
          } hoạt động):
${hoatDongList
            .map((hd, i) => `${i + 1}. ${hd.ten}${hd.mo_ta ? ` - ${hd.mo_ta}` : ""}`)
            .join("\n")}
`;
      }
    }
  }

  const khoiCauHoi = getCauHoiTheoKhoi(gradeNumber);
  if (khoiCauHoi) {
    cauHoiContext = `
============================================================
CÂU HỎI GỢI MỞ CHO HOẠT ĐỘNG NGOẠI KHÓA (ĐÃ NGHIÊN CỨU THEO ĐỘ TUỔI)
============================================================

TRỌNG TÂM KHỐI ${gradeNumber}: ${khoiCauHoi.trong_tam}
MỤC TIÊU CÂU HỎI: ${khoiCauHoi.muc_tieu_cau_hoi}

${taoContextCauHoiGoiMo(gradeNumber, theme)}

HƯỚNG DẪN SỬ DỤNG CÂU HỎI TRONG NGOẠI KHÓA:
- Sử dụng câu hỏi QUAN_SAT, KET_NOI trong phần MỞ ĐẦU để khơi gợi cảm xúc
- Sử dụng câu hỏi PHAN_BIEN, DA_CHIEU trong phần HOẠT ĐỘNG CHÍNH để thúc đẩy thảo luận
- Sử dụng câu hỏi GIA_TRI, CAM_XUC, TONG_HOP trong phần KẾT THÚC để đúc kết bài học
- Có thể điều chỉnh câu hỏi để người dẫn chương trình sử dụng hoặc đưa vào kịch bản
`;
  }

  // Lấy mẫu kịch bản từ ngoai-khoa-templates
  const mauTheoKhoi = getMauNgoaiKhoaTheoKhoi(gradeNumber);
  if (mauTheoKhoi.length > 0) {
    mauKichBanContext = taoContextNgoaiKhoaChiTiet(gradeNumber, theme);
  }

  vanBanHanhChinhContext = taoContextVanBanHanhChinh({
    ten_tinh: "Bình Thuận",
    ten_truong: "Bùi Thị Xuân - Mũi Né",
    ngay: new Date().getDate(),
    thang: new Date().getMonth() + 1,
    nam: new Date().getFullYear(),
    ten_chu_de: theme,
  });

  kinhPhiContext = taoContextKinhPhi();

  const loaiChuDe = xacDinhLoaiChuDe(theme);
  cauHoiSauKichContext = taoContextCauHoiSauKich(loaiChuDe);

  const thongDiepList = getThongDiepKetThuc(loaiChuDe);
  thongDiepContext = `
=== THÔNG ĐIỆP KẾT THÚC GỢI Ý ===
${thongDiepList.map((td, i) => `${i + 1}. "${td}"`).join("\n")}
`;

  // Hướng dẫn tạo kịch bản
  const huongDanKichBan = `
HƯỚNG DẪN TẠO KỊCH BẢN NGOẠI KHÓA (ĐÃ NGHIÊN CỨU TỪ CÁC HOẠT ĐỘNG THÀNH CÔNG):

1. NGUYÊN TẮC CHUNG:
${HUONG_DAN_TAO_KICH_BAN.nguyen_tac_chung.map((n) => `- ${n}`).join("\n")}

2. CẤU TRÚC TIÊU CHUẨN (45 phút):
- Tổng thời gian: ${HUONG_DAN_TAO_KICH_BAN.cau_truc_tieu_chuan.tong_thoi_gian}
- Khởi động: ${HUONG_DAN_TAO_KICH_BAN.cau_truc_tieu_chuan.khoi_dong.thoi_gian
    } - ${HUONG_DAN_TAO_KICH_BAN.cau_truc_tieu_chuan.khoi_dong.muc_dich}
- Phần chính: ${HUONG_DAN_TAO_KICH_BAN.cau_truc_tieu_chuan.phan_chinh.thoi_gian}
- Kết thúc: ${HUONG_DAN_TAO_KICH_BAN.cau_truc_tieu_chuan.ket_thuc.thoi_gian}

3. CÁC LOẠI KỊCH BẢN HIỆU QUẢ:
${HUONG_DAN_TAO_KICH_BAN.loai_kich_ban_hieu_qua
      .map(
        (kb, i) =>
          `${i + 1}. ${kb.ten}: ${kb.mo_ta} (Phù hợp: ${kb.phu_hop_voi.join(", ")})`
      )
      .join("\n")}

4. KỸ THUẬT SÂN KHẤU:
- Âm thanh: ${HUONG_DAN_TAO_KICH_BAN.ky_thuat_kich_san_khau.am_thanh.join(", ")}
- Sân khấu: ${HUONG_DAN_TAO_KICH_BAN.ky_thuat_kich_san_khau.san_khau.join(", ")}
- Diễn viên: ${HUONG_DAN_TAO_KICH_BAN.ky_thuat_kich_san_khau.dien_vien.join(
        ", "
      )}
`;

  // Build curriculum context string (giữ nguyên logic cũ)
  let curriculumContext = "";
  if (topicData) {
    curriculumContext = `
THÔNG TIN CHỦ ĐỀ TỪ CHƯƠNG TRÌNH SÁCH "KẾT NỐI TRI THỨC":
- Mã chủ đề: ${topicData.id}
- Tên chủ đề: ${topicData.name}
- Thuộc mạch: ${topicData.categoryName}
- Hoạt động cốt lõi: ${topicData.coreActivity}
- Kết quả cần đạt: 
${topicData.outcomes.map((o: string) => `  + ${o}`).join("\n")}
- Phương pháp gợi ý từ sách:
${topicData.methods.map((m: string) => `  + ${m}`).join("\n")}
- Mức độ Bloom: ${topicData.bloomLevel}
`;
  }

  return `${SYSTEM_INSTRUCTION}

VAI TRÒ NÂNG CAO: Bạn là Tổng phụ trách Đội/Bí thư Đoàn trường THPT năng động, sáng tạo - chuyên gia tổ chức sự kiện trường học.
Bạn am hiểu sâu sắc chương trình HĐTN theo bộ sách "Kết nối tri thức với cuộc sống" và biết cách thiết kế hoạt động ngoại khóa phù hợp với mục tiêu, nội dung từng chủ đề.

============================================================
DỮ LIỆU TỪ CƠ SỞ DỮ LIỆU CHƯƠNG TRÌNH (ĐÃ NGHIÊN CỨU KỸ)
============================================================

${chuDeContext}

${hoatDongContext}

${cauHoiContext}

${huongDanKichBan}

${mauKichBanContext
      ? `
MẪU KỊCH BẢN THAM KHẢO (ĐÃ TỔ CHỨC THÀNH CÔNG):
${mauKichBanContext}
`
      : ""
    }

${cauHoiSauKichContext}

${thongDiepContext}

${vanBanHanhChinhContext}

${kinhPhiContext}

============================================================
THÔNG TIN ĐẦU VÀO
============================================================

- Khối: ${grade}
- Đối tượng: ${gradeInfo.profile}
- Trọng tâm tâm lý: ${gradeInfo.focus}
- Giọng điệu phù hợp: ${gradeInfo.tone}
- Hoạt động gợi ý: ${gradeInfo.activities}
- Chủ đề: ${theme}
- Trọng tâm sách: ${gradeInfo.bookFocus}
${curriculumContext}

YÊU CẦU CHI TIẾT:

1. CHỌN HÌNH THỨC TỔ CHỨC phù hợp với HOẠT ĐỘNG CỐT LÕI của chủ đề (chọn 1-2):
   - Tọa đàm (chia sẻ sâu, có khách mời) - phù hợp chủ đề hướng nghiệp, chia sẻ kinh nghiệm
   - Rung chuông vàng (thi kiến thức) - phù hợp chủ đề tìm hiểu, nhận biết
   - Sân khấu hóa (cảm xúc, kể chuyện) - phù hợp chủ đề đạo đức, gia đình, quan hệ
   - Tranh biện (nhiều góc nhìn) - phù hợp chủ đề xây dựng quan điểm, phản biện
   - Hội thảo thực hành (kỹ năng cụ thể) - phù hợp chủ đề kỹ năng sống, tài chính
   - Flashmob, Hội chợ (sôi động, năng lượng) - phù hợp chủ đề cộng đồng, môi trường

2. NĂNG LỰC (Chương trình GDPT 2018) - Chọn 3-4 năng lực PHÙ HỢP VỚI KẾT QUẢ CẦN ĐẠT:
   - Năng lực tự chủ và tự học
   - Năng lực giao tiếp và hợp tác
   - Năng lực giải quyết vấn đề và sáng tạo
   - Năng lực thích ứng với cuộc sống
   - Năng lực thiết kế và tổ chức hoạt động
   - Năng lực định hướng nghề nghiệp

3. PHẨM CHẤT (Chương trình GDPT 2018) - Chọn 2-3 phẩm chất:
   - Yêu nước: Tự hào truyền thống, xây dựng quê hương
   - Nhân ái: Yêu thương, tôn trọng, giúp đỡ người khác
   - Chăm chỉ: Chịu khó, ham học, nỗ lực vượt khó
   - Trung thực: Thật thà, ngay thẳng, có trách nhiệm
   - Trách nhiệm: Ý thức với bản thân, gia đình, cộng đồng

4. MỤC ĐÍCH YÊU CẦU - PHẢI TƯƠNG ĐỒNG VỚI KẾT QUẢ CẦN ĐẠT CỦA CHỦ ĐỀ

5. KỊCH BẢN CHI TIẾT - PHẢI trình bày theo văn phong hành chính nghiệp vụ:
   - I. MỤC ĐÍCH, Ý NGHĨA: Nêu rõ tầm quan trọng của hoạt động.
   - II. NỘI DUNG VÀ HÌNH THỨC: Mô tả chi tiết kịch bản sân khấu, các phân cảnh, lời thoại MC and các hoạt động tương tác (Sử dụng câu hỏi gợi mở từ database).
   - III. TỔ CHỨC THỰC HIỆN: Phân công nhiệm vụ cụ thể cho các tổ/nhóm học sinh.

6. THÔNG ĐIỆP KẾT THÚC: Sâu sắc, truyền cảm hứng, gắn với giá trị cốt lõi của chủ đề.

QUY TẮC ĐỊNH DẠNG VĂN BẢN - CỰC KỲ QUAN TRỌNG:
- KHÔNG dùng dấu ** trong nội dung.
- KHÔNG dùng TAB hoặc thụt dòng.
- Sử dụng hệ thống đề mục chuẩn (I, II, III -> 1, 2, 3 -> a, b, c).
- Mỗi đoạn văn PHẢI cách nhau bằng DÒNG TRỐNG (dùng \\n\\n).

ĐỊNH DẠNG KẾT QUẢ - JSON thuần túy:
{
  "ten_chu_de": "Tên chủ đề sáng tạo bằng tiếng Việt (IN HOA)",
  "nang_luc": "- Năng lực tự chủ và tự học: [Mô tả cụ thể gắn với hoạt động].\\n\\n- Năng lực giao tiếp và hợp tác: [Mô tả].\\n\\n- Năng lực thích ứng với cuộc sống: [Mô tả].",
  "pham_chat": "- Trách nhiệm: [Mô tả cụ thể].\\n\\n- Nhân ái/Trung thực: [Mô tả].",
  "muc_dich_yeu_cau": "- [Yêu cầu cần đạt 1: chuyển hóa từ khung chương trình].\\n\\n- [Yêu cầu cần đạt 2].",
  "kich_ban_chi_tiet": "I. MỤC ĐÍCH, Ý NGHĨA\\n\\n[Nội dung]\\n\\nII. NỘI DUNG VÀ HÌNH THỨC TỔ CHỨC\\n\\n1. Khởi động (5-7 phút): [Chi tiết]\\n\\n2. Hoạt động chính - Tiểu phẩm/Talkshow (20-25 phút): [Kịch bản chi tiết gồm Phân cảnh, Nhân vật, Lời thoại MC và Diễn viên]\\n\\n3. Hoạt động tương tác (10 phút): [Sử dụng bộ câu hỏi gợi mở để giao lưu]\\n\\nIII. TỔ CHỨC THỰC HIỆN\\n\\n[Phân công cụ thể]",
  "thong_diep_ket_thuc": "Thông điệp truyền cảm hứng (2-3 câu) đúc kết giá trị của toàn bộ hoạt động."
}`;
}
