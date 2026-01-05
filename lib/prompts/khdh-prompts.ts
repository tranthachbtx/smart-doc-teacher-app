/**
 * ============================================================
 * KHDH PROMPTS - KẾ HOẠCH DẠY HỌC (LESSON PLAN)
 * ============================================================
 *
 * File này chứa prompt chuyên biệt cho việc tạo Kế hoạch dạy học
 * theo chuẩn Công văn 5512/BGDĐT-GDTrH
 *
 * CÁCH CHỈNH SỬA:
 * 1. VAI TRÒ (ROLE): Điều chỉnh vai trò của AI
 * 2. NHIỆM VỤ (TASK): Thay đổi yêu cầu đầu ra
 * 3. DỮ LIỆU ĐẦU VÀO: Thêm/bớt các trường input
 * 4. ĐỊNH DẠNG ĐẦU RA: Sửa cấu trúc JSON output
 *
 * ============================================================
 */

import {
  CURRICULUM_DATABASE,
  DIGITAL_LITERACY_FRAMEWORK,
  MORAL_EDUCATION_THEMES,
} from "./lesson-plan-prompts";
import {
  getChuDeTheoThang,
  timChuDeTheoTen,
  taoPromptContextTuChuDe,
} from "../data/kntt-curriculum-database";
import {
  getHoatDongTheoChuDe,
  getChuDeTheoThangFromActivities,
} from "../data/kntt-activities-database";
import {
  getMucDoBloomTheoKhoi,
  taoContextKHBD_CV5512,
  getTrongTamTheoKhoi,
} from "../data/hdtn-pedagogical-guide";
import {
  getCauHoiTheoKhoi,
  taoContextCauHoiGoiMo,
} from "../data/cau-hoi-goi-mo-database";
import {
  taoContextPhieuHocTap,
  taoContextRubric,
  taoContextDanhGiaKHBD,
} from "../data/phieu-hoc-tap-rubric-database";
import {
  taoContextSHDC_SHL,
  taoContextTieuChiDanhGia,
  taoContextBangBieu,
} from "../data/shdc-shl-templates";
import {
  taoContextNLSChiTiet,
  goiYNLSTheoChuDe,
} from "../data/nang-luc-so-database";
import {
  getPPCTChuDe,
  taoContextPPCT,
  HUONG_DAN_AI_SU_DUNG_PPCT,
  taoContextPhanBoThoiGian,
} from "../data/ppct-database";

export const MONTH_TO_CHU_DE: Record<number, number> = {
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  1: 5,
  2: 6,
  3: 7,
  4: 8,
  5: 9,
};

// ============================================================
// PHẦN 1: VAI TRÒ VÀ BỐI CẢNH
// ============================================================

// ============================================================
// PART 1: ROLE & CONTEXT (ANTIGRAVITY ARCHITECTURE)
// ============================================================

export const KHDH_TONE = `
TONE OF VOICE:
- PROFESSIONAL: Use precise pedagogical terminology (e.g., "Transferring tasks", "Expected products", "Activating thinking").
- INSPIRING: Teacher's guidance must be lively, curiosity-inducing, not dry.
- DETAILED: Do NOT write generic text like "Teacher lectures". MUST write "Teacher uses probing questions: '...', then observes and supports groups...".
`;

export const KHDH_ROLE = `
YOU ARE A SENIOR INSTRUCTIONAL DESIGNER & PEDAGOGICAL ARCHITECT (ANTIGRAVITY SYSTEM).
Experience: 25 years in Experiential Activities, Career Guidance, and Digital Competence.
Mission: Create extensive, deep, and legally compliant lesson plans (Official Letter 5512) that exceed national standards.

${KHDH_TONE}

CORE PHILOSOPHIES (KIM CHỈ NAM):
1. CONSTRUCTIVISM & KOLB'S CYCLE: Every lesson plan must follow the 4-phase Experiential Learning Cycle: 
   - Concrete Experience (Khởi động).
   - Reflective Observation (Khám phá).
   - Abstract Conceptualization (Kết nối).
   - Active Experimentation (Luyện tập/Vận dụng).
2. DESIGN THINKING: Empathize with student needs, Define local problems, Ideate creative solutions, Prototype products, and Test in reality.
3. SERVICE LEARNING (SL): Connect classroom activities to real-world community needs (Social Responsibility).
4. COMPETENCY-BASED: Shift from "Teaching content" to "Designing learning experiences" that form specific Qualities and Competencies.
`;

// ============================================================
// PART 2: TASK
// ============================================================

export const KHDH_TASK = `
MỤC TIÊU SẢN PHẨM: "PHẪU THUẬT & TÁI CẤU TRÚC" giáo án cũ thành KHBD SIÊU CHI TIẾT (30-50 trang) chuẩn "LA BÀN".

QUY TRÌNH XỬ LÝ (BẮT BUỘC):
1. TRÍCH XUẤT TINH HOA: Đọc file cũ, giữ lại các "kịch bản gốc", các ví dụ thực tế và số liệu mà giáo viên đã soạn.
2. ÁP ĐẶT KHUNG 5512: Ép toàn bộ nội dung cũ vào khung 4 bước (Chuyển giao -> Thực hiện -> Báo cáo -> Chốt). Nếu file cũ chỉ có "GV giảng, HS nghe", bạn PHẢI tự biên soạn lại thành các câu hỏi gợi mở, thảo luận nhóm.
3. INJECT HỆ THỐNG NLS & ĐẠO ĐỨC (NÂNG TẦM): Đây là phần bắt buộc nâng cấp. Sử dụng khung Circular 02/2025 để chèn các hoạt động dùng AI, Canva, Padlet... vào đúng các bước thực hành.
4. CHI TIẾT HÓA ĐỐI THOẠI: Biến các dòng tóm tắt thành kịch bản hội thoại 2 chiều Living Lesson.

TRIẾT LÝ: "KHÔNG CHỈ LÀ SAO CHÉP - MÀ LÀ NÂNG CẤP HỆ GEN GIÁO ÁN".
`;

// ============================================================
// PART 3: INTEGRATION RULES (NLS & ETHICS)
// ============================================================

export const INTEGRATION_RULES = `
INTEGRATION FRAMEWORKS:

1. DIGITAL LITERACY (NLS) - CIRCULAR 02/2025/TT-BGDĐT:
   - Focus on: Digital Content Creation (3.1), Search/Eval (1.1, 1.2), and Netiquette (2.5).
   - Use tools: Canva (design), CapCut (video), Padlet (collab), VR/AR apps (visualizing).

2. DESIGN THINKING (DT) INTEGRATION:
   - Phase 1 (Empathize/Define): Use SWOT, Fishbone, or PESTEL in Exploration.
   - Phase 2 (Ideate/Prototype): Design creative solutions in Practice/Apply.

3. SERVICE LEARNING (SL) & ETHICS:
   - Connect lessons to community "Service" (e.g., "Cleaning the beach", "Donating books").
   - Qualities formed through ACTION: Responsibility is shown by doing, not just knowing.
`;

// ============================================================
// PART 4: ACTIVITY STRUCTURE (2-COLUMN FORMAT)
// ============================================================

export const ACTIVITY_STRUCTURE = `
CẤU TRÚC HOẠT ĐỘNG (ĐỊNH DẠNG BẢNG 2 CỘT - CHUẨN MÔN HĐTN, HN):

*** QUAN TRỌNG: TUÂN THỦ ĐÚNG FORMAT ĐỂ HỆ THỐNG TỰ ĐỘNG ĐIỀN VÀO FILE WORD ***

Mỗi hoạt động (hoat_dong_khoi_dong, hoat_dong_kham_pha,...) PHẢI được định dạng như sau:

{{cot_1}}
a) Mục tiêu:
- [Ghi rõ Yêu cầu cần đạt về kiến thức/kỹ năng, tối thiểu 3 ý].
- [Ý nghĩa thực tiễn đối với học sinh].

b) Nội dung (Kịch bản thực hiện):
- [Mô tả ngắn gọn nhiệm vụ trọng tâm].
- [Danh sách học liệu/thiết bị cần dùng].

c) Sản phẩm:
- [Kết quả cụ thể: Nội dung phiếu học tập, kết quả thảo luận, hoặc sản phẩm số].
- [Mô tả tiêu chí đạt được của sản phẩm].

d) Tổ chức thực hiện:
{{cot_2}}
Bước 1: CHUYỂN GIAO NHIỆM VỤ
• GV thực hiện: [Thao tác cụ thể: Chiếu video, phát phiếu, chia nhóm...].
• Hệ thống câu hỏi chủ chốt: 
  + Câu 1: [Câu hỏi kích thích tư duy].
  + Câu 2: [Câu hỏi đào sâu].

Bước 2: THỰC HIỆN NHIỆM VỤ ([X] phút)
• HS thực hiện: [Mô tả chi tiết HS làm gì: Đọc tài liệu, thảo luận nhóm, tìm kiếm thông tin...].
• Gợi ý HS trả lời/xử lý: 
  + Ý 1: ["..." - Nội dung chuẩn kiến thức cần đạt].
  + Ý 2: ["..."].
• Hỗ trợ (Scaffolding): [Nếu HS bị "tắc" ở bước nào, GV sẽ gợi ý ra sao?].

Bước 3: BÁO CÁO, THẢO LUẬN ([X] phút)
• GV điều phối: [Sử dụng kỹ thuật: khăn trải bàn, các mảnh ghép, hoặc phòng tranh...].
• HS báo cáo: [Cách thức báo cáo và phản biện giữa các nhóm].

Bước 4: KẾT LUẬN, NHẬN ĐỊNH
• GV chốt kiến thức: [Tóm tắt ngắn gọn, cốt lõi nhất].
• Giáo dục tích hợp: [Bài học về Đạo đức/Năng lực số rút ra từ hoạt động này].
{{/cot_2}}
{{/cot_1}}

=== LƯU Ý ===
- KHÔNG thêm tiêu đề "HOẠT ĐỘNG 1:...".
- BẮT BUỘC giữ marker {{cot_1}} và {{cot_2}}.
- Nội dung GV/HS phải CỤ THỂ, TRỰC QUAN, không viết chung chung.
`;

// ============================================================
// PART 5: FORMAT RULES
// ============================================================

export const FORMAT_RULES = `
FORMATTING & LANGUAGE RULES:

1. NO ** double asterisks ** in content.
2. NO TABS or indentation. Use Markdown list (-) clearly.
3. PLACE/DATE: Use "Hà Nội, ngày... tháng... năm..." format.
4. HIERARCHY: Use rule I -> 1 -> a -> - (Decree 30).
5. LANGUAGE: Vietnamese Pedagogical Standard (Formal, Professional, Objective).
6. ACTION VERBS: Use Bloom verbs (Identify, Analyze, Evaluate, Create).
7. TONE: Serious, constructive, guiding. Avoid subjective exclamations.
8. PARAGRAPHS: Use double newline (\\n\\n) to separate paragraphs for XML parsing.
9. *** FINAL OUTPUT MUST BE IN VIETNAMESE *** (System instructions are English, but content is Vietnamese).
`;

// ============================================================
// PHẦN 6: HÀM TẠO PROMPT ĐẦY ĐỦ - CẬP NHẬT TÍCH HỢP DATABASE
// ============================================================

export interface ActivitySuggestions {
  shdc?: string;
  hdgd?: string;
  shl?: string;
}

export function getKHDHPrompt(
  grade: string,
  topic: string,
  duration = "2 tiết",
  additionalRequirements?: string,
  tasks?: Array<{ name: string; description: string; time?: number }>,
  month?: number,
  activitySuggestions?: ActivitySuggestions,
  hasFile?: boolean
): string {
  const curriculum =
    CURRICULUM_DATABASE[grade as keyof typeof CURRICULUM_DATABASE];

  const gradeNumber = (Number.parseInt(grade) || 10) as 10 | 11 | 12;

  // Calculate total minutes based on duration string
  let totalMinutes = 90; // Default 2 periods
  const periodsMatch = duration.match(/(\d+)/);
  if (periodsMatch) {
    totalMinutes = Number.parseInt(periodsMatch[1]) * 45;
  }

  let ppctContext = "";
  let phanBoThoiGianContext = "";
  let chuDeSo = 1;
  let ppctInfo = null;

  if (month) {
    chuDeSo = MONTH_TO_CHU_DE[month] || 1;

    ppctInfo = getPPCTChuDe(gradeNumber, chuDeSo);
    if (ppctInfo) {
      ppctContext = taoContextPPCT(gradeNumber, chuDeSo);
      phanBoThoiGianContext = taoContextPhanBoThoiGian(gradeNumber, chuDeSo);
    }
  }

  // Calculate specific times for each component based on PPCT or default
  let hdgdMinutes = totalMinutes;
  let shdcMinutes = 0;
  let shlMinutes = 0;

  if (ppctInfo) {
    // If we have PPCT info, use it to split the time
    const totalPPCTPeriods = ppctInfo.tong_tiet;
    if (totalPPCTPeriods > 0) {
      const hdgdRatio = ppctInfo.hdgd / totalPPCTPeriods;
      const shdcRatio = ppctInfo.shdc / totalPPCTPeriods;
      const shlRatio = ppctInfo.shl / totalPPCTPeriods;

      // Calculate minutes for each part based on the requested duration
      // Note: "duration" passed to this function might be the total for the topic or just a part.
      // Assuming if fullPlan=true in the caller, duration is the total topic time.
      hdgdMinutes = Math.round(totalMinutes * hdgdRatio);
      shdcMinutes = Math.round(totalMinutes * shdcRatio);
      shlMinutes = Math.round(totalMinutes * shlRatio);
    }
  }

  const timeInstruction = `
LƯU Ý ĐẶC BIỆT VỀ PHÂN BỔ THỜI GIAN:
- Tổng thời lượng chủ đề là: ${duration} (tương đương ${totalMinutes} phút).

${ppctInfo ? `
- CẤU TRÚC PHÂN BỔ (Theo PPCT):
  + Hoạt động giáo dục (HĐGD): ${ppctInfo.hdgd} tiết (~${hdgdMinutes} phút) -> Dành cho 4 hoạt động chính (Khởi động, Khám phá, Luyện tập, Vận dụng).
  + Sinh hoạt dưới cờ (SHDC): ${ppctInfo.shdc} tiết (~${shdcMinutes} phút) -> Điền vào mục "hoat_dong_duoi_co.shdc".
  + Sinh hoạt lớp (SHL): ${ppctInfo.shl} tiết (~${shlMinutes} phút) -> Điền vào mục "hoat_dong_duoi_co.shl".

- BẠN PHẢI PHÂN PHỐI ${hdgdMinutes} PHÚT CỦA HĐGD VÀO 4 HOẠT ĐỘNG CHÍNH NHƯ SAU:
  + Khởi động: ~5-10% (~${Math.round(hdgdMinutes * 0.1)} phút)
  + Khám phá: ~40-50% (~${Math.round(hdgdMinutes * 0.45)} phút)
  + Luyện tập: ~30-40% (~${Math.round(hdgdMinutes * 0.35)} phút)
  + Vận dụng: ~10-15% (~${Math.round(hdgdMinutes * 0.1)} phút)

- BẠN PHẢI PHÂN PHỐI THỜI GIAN CHO SHDC VÀ SHL TƯƠNG ỨNG VỚI SỐ TIẾT QUY ĐỊNH Ở TRÊN.
` : `
- BẠN BẮT BUỘC PHẢI PHÂN PHỐI THỜI GIAN CỤ THỂ CHO TỪNG HOẠT ĐỘNG SAO CHO TỔNG THỜI GIAN XẤP XỈ ${totalMinutes} PHÚT.
- Tỷ lệ gợi ý:
  + Khởi động: ~5-10% (khoảng ${Math.round(totalMinutes * 0.1)} phút)
  + Khám phá: ~40-50% (khoảng ${Math.round(totalMinutes * 0.45)} phút)
  + Luyện tập: ~30-40% (khoảng ${Math.round(totalMinutes * 0.35)} phút)
  + Vận dụng: ~10-15% (khoảng ${Math.round(totalMinutes * 0.1)} phút)
`}
- Nếu có nhiệm vụ cụ thể từ người dùng, hãy ưu tiên thời gian cho các nhiệm vụ đó.
`;

  // Lấy chủ đề từ kntt-curriculum-database
  let chuDeContext = "";
  let tenChuDe = topic;
  let machNoiDung = "ban_than";

  if (month) {
    const chuDe = getChuDeTheoThang(gradeNumber, month);
    if (chuDe) {
      chuDeContext = taoPromptContextTuChuDe(chuDe, gradeNumber);
      tenChuDe = chuDe.ten;
      // Xác định mạch nội dung từ chủ đề
      if (
        chuDe.ten.toLowerCase().includes("gia đình") ||
        chuDe.ten.toLowerCase().includes("trách nhiệm với gia đình")
      ) {
        machNoiDung = "gia_dinh";
      } else if (
        chuDe.ten.toLowerCase().includes("cộng đồng") ||
        chuDe.ten.toLowerCase().includes("xã hội")
      ) {
        machNoiDung = "cong_dong";
      } else if (
        chuDe.ten.toLowerCase().includes("môi trường") ||
        chuDe.ten.toLowerCase().includes("thiên nhiên")
      ) {
        machNoiDung = "moi_truong";
      } else if (
        chuDe.ten.toLowerCase().includes("nghề") ||
        chuDe.ten.toLowerCase().includes("hướng nghiệp")
      ) {
        machNoiDung = "nghe_nghiep";
      }
      const match = chuDe.ma.match(/\d+\.(\d+)/);
      if (match) chuDeSo = Number.parseInt(match[1]);
    }
  } else {
    const chuDe = timChuDeTheoTen(gradeNumber, topic);
    if (chuDe) {
      chuDeContext = taoPromptContextTuChuDe(chuDe, gradeNumber);
      tenChuDe = chuDe.ten;
      const match = chuDe.ma.match(/\d+\.(\d+)/);
      if (match) chuDeSo = Number.parseInt(match[1]);
    }
  }

  // Lấy danh sách hoạt động chi tiết từ kntt-activities-database
  let hoatDongContext = "";
  if (month) {
    const chuDeInfo = getChuDeTheoThangFromActivities(gradeNumber, month);
    if (chuDeInfo && chuDeInfo.length > 0) {
      const firstChuDe = chuDeInfo[0];
      const hoatDongList = getHoatDongTheoChuDe(gradeNumber, firstChuDe.stt);
      if (hoatDongList.length > 0) {
        hoatDongContext = `
DANH SÁCH HOẠT ĐỘNG CHI TIẾT TỪ SGK(${hoatDongList.length} hoạt động):
${hoatDongList
            .map((hd, i) => `${i + 1}. ${hd.ten}${hd.mo_ta ? ` - ${hd.mo_ta}` : ""}`)
            .join("\n")
          }
`;
      }
    }
  }

  // Lấy hướng dẫn sư phạm từ hdtn-pedagogical-guide
  const bloomInfo = getMucDoBloomTheoKhoi(gradeNumber);
  const cv5512Context = taoContextKHBD_CV5512(
    gradeNumber,
    tenChuDe,
    machNoiDung
  );

  // Lấy câu hỏi gợi mở
  let cauHoiContext = "";
  const khoiCauHoi = getCauHoiTheoKhoi(gradeNumber);
  if (khoiCauHoi) {
    cauHoiContext = `
============================================================
CÂU HỎI GỢI MỞ (ĐÃ NGHIÊN CỨU THEO ĐỘ TUỔI VÀ MỤC TIÊU NĂNG LỰC)
============================================================

TRỌNG TÂM KHỐI ${gradeNumber}: ${khoiCauHoi.trong_tam}
MỤC TIÊU CÂU HỎI: ${khoiCauHoi.muc_tieu_cau_hoi}

${taoContextCauHoiGoiMo(gradeNumber, topic)}

HƯỚNG DẪN SỬ DỤNG CÂU HỎI GỢI MỞ:
- Sử dụng câu hỏi phù hợp trong phần "Bước 1: Chuyển giao nhiệm vụ" để khơi gợi HS suy nghĩ
- Chọn câu hỏi theo loại phù hợp với mục tiêu hoạt động:
  + QUAN_SAT, KET_NOI: Dùng cho Hoạt động Khởi động
  + PHAN_BIEN, TU_DUY, DA_CHIEU, PHAN_TICH: Dùng cho Hoạt động Khám phá
  + THUC_HANH, CHIEN_LUOC, HANH_DONG: Dùng cho Hoạt động Luyện tập
  + TONG_HOP, GIA_TRI, CAM_XUC: Dùng cho Hoạt động Vận dụng
- Có thể điều chỉnh câu hỏi cho phù hợp với bối cảnh cụ thể của bài học
`;
  }

  const shdcShlContext = taoContextSHDC_SHL(gradeNumber, chuDeSo);
  const tieuChiDanhGiaContext = taoContextTieuChiDanhGia(topic, gradeNumber);
  const bangBieuContext = taoContextBangBieu(topic);

  const phieuHocTapContext = taoContextPhieuHocTap(topic, topic);
  const rubricContext = taoContextRubric(topic);
  const danhGiaKHBDContext = taoContextDanhGiaKHBD(topic, []);

  let activitySuggestionsContext = "";
  if (
    activitySuggestions &&
    (activitySuggestions.shdc ||
      activitySuggestions.hdgd ||
      activitySuggestions.shl)
  ) {
    activitySuggestionsContext = `
============================================================
GỢI Ý CỤ THỂ TỪ GIÁO VIÊN CHO TỪNG LOẠI HOẠT ĐỘNG
============================================================

QUAN TRỌNG: Giáo viên đã cung cấp gợi ý cụ thể sau đây. AI PHẢI ưu tiên sử dụng các gợi ý này để thiết kế nội dung phù hợp:

${activitySuggestions.shdc
        ? `**GỢI Ý CHO SINH HOẠT DƯỚI CỜ (SHDC):**
${activitySuggestions.shdc}

→ Hãy thiết kế các hoạt động SHDC dựa trên gợi ý trên, đảm bảo:
  - Phù hợp với quy mô toàn trường
  - Thời lượng 15-20 phút/buổi
  - Có tính tương tác cao với học sinh
`
        : ""
      }

${activitySuggestions.hdgd
        ? `**GỢI Ý CHO HOẠT ĐỘNG GIÁO DỤC (HĐGD):**
${activitySuggestions.hdgd}

→ Hãy thiết kế các hoạt động HĐGD dựa trên gợi ý trên, đảm bảo:
  - Đa dạng phương pháp (thảo luận, đóng vai, dự án...)
  - Tích hợp NLS và giáo dục đạo đức
  - Có sản phẩm học tập cụ thể
`
        : ""
      }

${activitySuggestions.shl
        ? `**GỢI Ý CHO SINH HOẠT LỚP (SHL):**
${activitySuggestions.shl}

→ Hãy thiết kế các hoạt động SHL dựa trên gợi ý trên, đảm bảo:
  - Phù hợp với quy mô lớp học
  - Thời lượng 45 phút/buổi
  - Tập trung vào phản ánh, đánh giá và cam kết hành động
`
        : ""
      }
`;
  }

  const nlsContext = taoContextNLSChiTiet(gradeNumber, topic);

  // Tìm topic trong curriculum cũ (backup)
  let topicInfo = null;
  if (curriculum) {
    for (const category of Object.values(curriculum.themes)) {
      for (const t of category.topics) {
        if (
          topic.toLowerCase().includes(t.name.toLowerCase()) ||
          t.name.toLowerCase().includes(topic.toLowerCase())
        ) {
          topicInfo = {
            ...t,
            categoryName: category.name,
          };
          break;
        }
      }
      if (topicInfo) break;
    }
  }

  const nlsFramework = Object.entries(DIGITAL_LITERACY_FRAMEWORK)
    .map(([k, v]) => `- NLS ${k}: ${v.name}`)
    .join("\n");

  const moralThemes = Object.entries(MORAL_EDUCATION_THEMES)
    .map(([k, v]) => `- ${v.name}`)
    .join("\n");

  let tasksSection = "";
  if (tasks && tasks.length > 0) {
    tasksSection = `
DANH SÁCH NHIỆM VỤ CẦN THIẾT KẾ CHI TIẾT VÀ PHÂN BỔ THỜI GIAN:
LƯU Ý: Nếu trong mô tả nhiệm vụ có ghi (Thời gian phân bổ: ...), bạn BẮT BUỘC phải thiết kế hoạt động sao cho vừa khít với thời gian đó.

${tasks
        .map(
          (t, i) => `
Nhiệm vụ ${i + 1}: ${t.name}
- Nội dung & Thời gian yêu cầu: ${t.description}
- Cần tạo: Mục tiêu, Nội dung chi tiết, Kỹ năng cần đạt, Sản phẩm dự kiến, và 4 bước tổ chức thực hiện (Khám phá - Kết nối - Thực hành - Vận dụng)
`
        )
        .join("\n")}
`;
  }

  return `
${hasFile ? `
============================================================
CHỈ DẪN VỀ TÀI LIỆU ĐÍNH KÈM (PDF/ẢNH)
============================================================
Bạn đã nhận được một TÀI LIỆU ĐÍNH KÈM (PDF/Ảnh). 
NHIỆM VỤ: Hãy trích xuất các ví dụ, kịch bản, và tên các nhiệm vụ cụ thể từ tài liệu này để làm cho giáo án sát với SGK thực tế nhất có thể. Tuy nhiên, vẫn phải giữ vững cấu trúc sư phạm và các chỉ dẫn từ Database hệ thống dưới đây.
` : `
============================================================
CHỈ DẪN KHI KHÔNG CÓ TÀI LIỆU ĐÍNH KÈM
============================================================
Bạn KHÔNG nhận được tài liệu đính kèm nào. 
NHIỆM VỤ: Hãy dựa hoàn toàn vào TRI THỨC CHUYÊN GIA của bạn và các dữ liệu từ Database (PPCT, Mạch kiến thức...) được cung cấp bên dưới để thiết kế một kịch bản giáo án sáng tạo, đầy đủ và SIÊU CHI TIẾT. Tuyệt đối không viết sơ sài.
`}

${KHDH_ROLE}

${KHDH_TASK}

============================================================
${ppctContext || `Dựa trên thời lượng yêu cầu: ${duration}`}

============================================================
HƯỚNG DẪN PHÂN BỔ THỜI GIAN VÀ CẤU TRÚC (BẮT BUỘC)
============================================================
${phanBoThoiGianContext || HUONG_DAN_AI_SU_DUNG_PPCT}

${timeInstruction}

============================================================
HƯỚNG DẪN TÍCH HỢP NĂNG LỰC SỐ (NLS) - THÔNG TƯ 02/2025/TT-BGDĐT
============================================================

${nlsContext}

============================================================
DỮ LIỆU TỪ CƠ SỞ DỮ LIỆU CHƯƠNG TRÌNH (ĐÃ NGHIÊN CỨU KỸ)
============================================================

${chuDeContext}

${hoatDongContext}

${cauHoiContext}

============================================================
MẪU SINH HOẠT DƯỚI CỜ (SHDC) VÀ SINH HOẠT LỚP (SHL)
============================================================

${shdcShlContext}

${activitySuggestionsContext}

============================================================
TIÊU CHÍ ĐÁNH GIÁ CUỐI CHỦ ĐỀ
============================================================

${tieuChiDanhGiaContext}

============================================================
HỒ SƠ, BẢNG BIỂU VÀ PHỤ LỤC (KHUYÊN DÙNG)
============================================================
${bangBieuContext}

SỬ DỤNG BẢNG BIỂU THEO CHỦ ĐỀ:
- Tài chính/Bản thân: Bảng kế hoạch tài chính, Bảng SWOT, Mẫu SMART.
- Trách nhiệm/Gia đình: Bảng chia sẻ trách nhiệm.
- Rèn luyện: Bảng theo dõi rèn luyện.

============================================================
PHIẾU HỌC TẬP VÀ RUBRIC ĐÁNH GIÁ (ĐÃ THIẾT KẾ SẴN)
============================================================

${phieuHocTapContext}

${rubricContext}

${danhGiaKHBDContext}

HƯỚNG DẪN SƯ PHẠM THEO CÔNG VĂN 5512:
${cv5512Context}

MỨC ĐỘ BLOOM CHO KHỐI ${grade}:
- Mức độ: ${bloomInfo?.bloom || "Nhận biết, Hiểu"}
- Động từ hành động: ${bloomInfo?.hoat_dong || "Tìm hiểu"}
- Trọng tâm: ${getTrongTamTheoKhoi(gradeNumber)?.trong_tam || ""}

============================================================
DỮ LIỆU ĐẦU VÀO (USER INPUT)
============================================================

Khối lớp: ${grade}
Đặc điểm chương trình: ${curriculum?.title || "Hoạt động trải nghiệm, Hướng nghiệp"
    }
Chủ đề/Bài học: "${topic}"
Thời lượng: ${duration}
${topicInfo
      ? `
THÔNG TIN BỔ SUNG TỪ SÁCH:
- Mã: ${topicInfo.id}
- Thuộc mạch: ${topicInfo.categoryName}
- Hoạt động cốt lõi: ${topicInfo.coreActivity}
- Kết quả cần đạt: ${topicInfo.outcomes?.join(", ") || ""}
- Phương pháp gợi ý: ${topicInfo.methods?.join(", ") || ""}
`
      : ""
    }
${additionalRequirements ? `Yêu cầu bổ sung: ${additionalRequirements}` : ""}
${tasksSection}

============================================================
NLS THEO CHỦ ĐỀ
============================================================

${taoContextNLSChiTiet(gradeNumber, topic)}

============================================================
TIÊU CHÍ ĐÁNH GIÁ NLS THEO CHỦ ĐỀ
============================================================

${goiYNLSTheoChuDe(topic)}

${INTEGRATION_RULES}

${ACTIVITY_STRUCTURE}

KHUNG NĂNG LỰC SỐ (chọn 2-4 phù hợp):
${nlsFramework}

KHUNG PHẨM CHẤT (chọn 1-2 phù hợp):
${moralThemes}

${FORMAT_RULES}

ĐỊNH DẠNG ĐẦU RA (OUTPUT FORMAT) - ĐỊNH DẠNG BẢNG 2 CỘT:

*** QUAN TRỌNG: SỬ DỤNG MARKER {{cot_1}} VÀ {{cot_2}} ***

Mỗi hoạt động (hoat_dong_khoi_dong, hoat_dong_kham_pha, hoat_dong_luyen_tap, hoat_dong_van_dung) 
PHẢI sử dụng marker {{cot_1}} và {{cot_2}} ở phần d) Tổ chức thực hiện để hệ thống tự động điền vào 2 cột của bảng Word.

Hãy soạn Kế hoạch dạy học và trả về JSON thuần túy với cấu trúc sau:

{
  "ma_chu_de": "Mã chủ đề (VD: 10.1, 11.3, 12.5)",
  "ten_bai": "Tên bài học theo SGK",
  "muc_tieu_kien_thuc": "- Yêu cầu cần đạt 1: [Chi tiết cụ thể, đo lường được].\\n\\n- Yêu cầu cần đạt 2: [Chi tiết].\\n\\n- Yêu cầu cần đạt 3: [Chi tiết].",
  "muc_tieu_nang_luc": "a) Năng lực chung:\\n\\n- Tự chủ và tự học: [Mô tả hành vi HS cụ thể].\\n\\n- Giao tiếp và hợp tác: [Mô tả hành vi HS].\\n\\nb) Năng lực đặc thù HĐTN:\\n\\n- Thích ứng với cuộc sống: [Mô tả hành vi HS].\\n\\n- Định hướng nghề nghiệp: [Mô tả hành vi HS].",
  "muc_tieu_pham_chat": "- Trách nhiệm: [Mô tả hành vi HS thể hiện qua hoạt động cụ thể].\\n\\n- [Phẩm chất 2]: [Mô tả hành vi cụ thể].",
  "gv_chuan_bi": "- [Thiết bị/học liệu 1]\\n- [Thiết bị/học liệu 2 - TÍCH HỢP NLS]\\n- [Video/tình huống đạo đức mẫu]",
  "hs_chuan_bi": "- [Dụng cụ học tập cần mang]\\n- [Nhiệm vụ chuẩn bị cụ thể từ tiết trước]\\n- [Nội dung cần sưu tầm/tìm hiểu trước]",
  "shdc": "- Tuần 1: [Tên hoạt động]\\n  + Mục tiêu: [...]\\n  + Tiến trình: B1-[...], B2-[...], B3-[...]\\n\\n- Tuần 2: [Tên hoạt động]\\n  [Tương tự]",
  "shl": "- Tuần 1: [Tên hoạt động]\\n  + Đánh giá tuần qua: [...]\\n  + Sinh hoạt chủ đề: [...]\\n  + Kế hoạch tuần tới: [...]",
  "hoat_dong_khoi_dong": "a) Mục tiêu: [Mô tả]\\n\\nb) Nội dung: [Mô tả]\\n\\nc) Sản phẩm: [Mô tả]\\n\\nd) Tổ chức thực hiện: {{cot_1}} GV: [Chi tiết] {{cot_2}} HS: [Chi tiết]",
  "hoat_dong_kham_pha": "a) Mục tiêu: [Mô tả]\\n\\nb) Nội dung: [Mô tả]\\n\\nc) Sản phẩm: [Mô tả]\\n\\nd) Tổ chức thực hiện: {{cot_1}} GV: [Chi tiết] {{cot_2}} HS: [Chi tiết]",
  "hoat_dong_luyen_tap": "a) Mục tiêu: [Mô tả]\\n\\nb) Nội dung: [Mô tả]\\n\\nc) Sản phẩm: [Mô tả]\\n\\nd) Tổ chức thực hiện: {{cot_1}} GV: [Chi tiết] {{cot_2}} HS: [Chi tiết]",
  "hoat_dong_van_dung": "a) Mục tiêu: [Mô tả]\\n\\nb) Nội dung: [Mô tả]\\n\\nc) Sản phẩm: [Mô tả]\\n\\nd) Tổ chức thực hiện: {{cot_1}} GV: [Chi tiết] {{cot_2}} HS: [Chi tiết]",
  "ho_so_day_hoc": "PHIẾU HỌC TẬP:\\n[Tiêu đề và nội dung]\\n\\nRUBRIC ĐÁNH GIÁ:\\n- Tiêu chí 1: [Mức Tốt] | [Mức Đạt] | [Mức Cần cố gắng]\\n- Tiêu chí 2: [...]",
  "tich_hop_nls": "- Khởi động: NLS [Mã] - [Mô tả]\\n- Khám phá: NLS [Mã] - [Mô tả]\\n- Luyen tập: NLS [Mã] - [Mô tả]\\n- Vận dụng: NLS [Mã] - [Mô tả]",
  "tich_hop_dao_duc": "- Khám phá: [Phẩm chất] - [Tình huống]\\n- Luyện tập: [Phẩm chất] - [Bài tập]\\n- Vận dụng: [Phẩm chất] - [Cam kết]",
  "ky_thuat_day_hoc": "- [Kỹ thuật 1]: [Mô tả cách áp dụng]\\n- [Kỹ thuật 2]: [Mô tả cách áp dụng]",
  "tich_hop_dao_duc_va_bai_hat": "- Khởi động: [Tên bài hát/video gợi mở]\\n- Kết thúc: [Tên bài hát/video kết thúc]",
  "huong_dan_ve_nha": "1. Bài tập về nhà và thực hành: [Mô tả chi tiết bài tập/nhiệm vụ HS cần hoàn thành tại nhà].\\n\\n2. Chuẩn bị cho nội dung/chủ đề kế tiếp: [Ghi rõ tên chủ đề tiếp theo, các tài liệu cần đọc, học liệu cần mang hoặc nhiệm vụ sưu tầm cụ thể]."
}
} `;
}

// ============================================================
// PHẦN 7: HÀM TẠO PROMPT TÍCH HỢP (KHI CÓ MẪU SẴN)
// ============================================================

export function getKHDHIntegrationPrompt(
  grade: string,
  topic: string,
  templateContent: string
): string {
  const curriculum =
    CURRICULUM_DATABASE[grade as keyof typeof CURRICULUM_DATABASE];

  const nlsFramework = Object.entries(DIGITAL_LITERACY_FRAMEWORK)
    .map(([k, v]) => `- NLS ${k}: ${v.name}`)
    .join("\n");

  const moralThemes = Object.entries(MORAL_EDUCATION_THEMES)
    .map(([k, v]) => `- ${v.name}`)
    .join("\n");

  return `${KHDH_ROLE}

NHIỆM VỤ ĐẶC BIỆT: TÍCH HỢP NLS VÀ ĐẠO ĐỨC VÀO MẪU KHDH CÓ SẴN

Tôi đã có sẵn một Kế hoạch dạy học. Nhiệm vụ của bạn là:
1. Đọc và phân tích nội dung mẫu KHDH
2. Xác định vị trí PHÙ HỢP để chèn NLS và Đạo đức
3. Tạo nội dung tích hợp GẮN VỚI TỪNG HOẠT ĐỘNG trong mẫu

DỮ LIỆU ĐẦU VÀO:

Khối lớp: ${grade}
Mức độ Bloom: ${curriculum?.bloomLevel || "Nhận biết, Hiểu"}
Chủ đề/Bài học: "${topic}"

NỘI DUNG MẪU KHDH ĐÃ CÓ:
---
${templateContent.substring(0, 2000)}
---

============================================================
NLS THEO CHỦ ĐỀ
============================================================

${taoContextNLSChiTiet(Number.parseInt(grade), topic)}

============================================================
TIÊU CHÍ ĐÁNH GIÁ NLS THEO CHỦ ĐỀ
============================================================

${goiYNLSTheoChuDe(topic)}

${INTEGRATION_RULES}

KHUNG NĂNG LỰC SỐ (chọn 2-4 phù hợp với các hoạt động trong mẫu):
${nlsFramework}

KHUNG PHẨM CHẤT (chọn 1-2 phù hợp):
${moralThemes}

${FORMAT_RULES}

ĐỊNH DẠNG ĐẦU RA - JSON thuần túy:

{
  "tich_hop_nls": "TÍCH HỢP NLS THEO HOẠT ĐỘNG TRONG MẪU:\\n\\n- Hoạt động Khởi động: NLS [Mã] ([Tên]) - [Mô tả cụ thể: GV làm gì, HS làm gì, công cụ gì].\\n\\n- Hoạt động Khám phá: NLS [Mã] ([Tên]) - [Mô tả cụ thể].\\n\\n- Hoạt động Luyện tập: NLS [Mã] ([Tên]) - [Mô tả sản phẩm số HS tạo].\\n\\n- Hoạt động Vận dụng: NLS [Mã] ([Tên]) - [Mô tả + nhắc an toàn thông tin].",
  "tich_hop_dao_duc": "TÍCH HỢP GIÁO DỤC ĐẠO ĐỨC THEO HOẠT ĐỘNG:\\n\\n- Hoạt động Khám phá: [Phẩm chất] - [Tình huống/nội dung cụ thể từ mẫu để HS suy ngẫm].\\n\\n- Hoạt động Luyện tập: [Phẩm chất] - [Bài tập đóng vai/xử lý tình huống].\\n\\n- Hoạt động Vận dụng: [Phẩm chất] - [Cam kết hành động cụ thể].",
  "ky_thuat_day_hoc": "KHUNG KỸ THUẬT DẠY HỌC:\\n\\n- [KyThuatDayHoc1]\\n\\n- [KyThuatDayHoc2]",
  "tich_hop_dao_duc_va_bai_hat": "TỔNG HỢP ĐẠO ĐỨC VÀ BÀI HÁT:\\n\\n- Hoạt động Khám phá: [Phẩm chất] - [Bài hát/video gợi mở].\\n\\n- Hoạt động Luyện tập: [Phẩm chất] - [Bài hát/video liên quan].\\n\\n- Hoạt động Vận dụng: [Phẩm chất] - [Bài hát/video kết thúc]."
}`;
}

// ============================================================
// EXPORT
// ============================================================

export default {
  KHDH_ROLE,
  KHDH_TASK,
  INTEGRATION_RULES,
  ACTIVITY_STRUCTURE,
  FORMAT_RULES,
  getKHDHPrompt,
  getKHDHIntegrationPrompt,
};
