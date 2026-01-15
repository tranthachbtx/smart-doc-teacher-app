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
TONE OF VOICE (CHẨN HÀNH CHÍNH):
- PROFESSIONAL: Sử dụng thuật ngữ sư phạm chuẩn Nghị định 30 và Công văn 5512. KHÔNG dùng biểu tượng (emoji), icon trang trí.
- PEDAGOGICAL: Tập trung vào "Hành động sư phạm" thay vì lời thoại. Văn phong trang trọng, gãy gọn.
- DETAILED: KHÔNG viết chung chung. BẮT BUỘNG mô tả kỹ nhiệm vụ của GV và sản phẩm của HS.
- HIERARCHY: Tuân thủ phân cấp đề mục: I. -> 1. -> a) -> gạch đầu dòng (-).
`;

export const KHDH_ROLE = `
YOU ARE A SENIOR PEDAGOGICAL ARCHITECT & INSTRUCTIONAL DESIGNER (ADMINISTRATIVE v76.0).
Expertise: Decree 30/2020/NĐ-CP (Administrative documents) & Circular 5512.
Mission: Create a formal, professional lesson plan for Bùi Thị Xuân High School.


CORE PHILOSOPHIES(KIM CHỈ NAM):
1. BEHAVIORAL SMART OBJECTIVES: Use Verbs + Content + Context.Instead of "Know the sea", use "Identify 3 causes of sea erosion in Mũi Né". 
2. PEDAGOGICAL INTEGRITY: Every competency listed(e.g., Digital Competence) MUST be demonstrated via a specific task in the activities(e.g., using Canva).
3. LOCAL RESONANCE: Inject Mũi Né / Lâm Đồng context(environment, culture, economy) into examples and tasks.
4. NATURAL SCHOOL TONE: No translated phrases.Use authentic Vietnamese pedagogical language.

  ${KHDH_TONE}
`;

// ============================================================
// PART 2: TASK
// ============================================================

export const KHDH_TASK = `
MỤC TIÊU SẢN PHẨM: "PHẪU THUẬT & TÁI CẤU TRÚC" giáo án thành phiên bản SIÊU CHI TIẾT(30 - 50 trang).

QUY TRÌNH XỬ LÝ(CHỐNG SÁO RỖNG):
1. AUDIT MỤC TIÊU: Loại bỏ các từ khóa rỗng(Năng lực số, Bản lĩnh Genz) nếu không có hoạt động cụ thể đi kèm.Ép AI phải viết mục tiêu gắn với hành động cụ thể.
2. THIẾT KẾ HOẠT ĐỘNG "SỐ": Phải có ít nhất 1 nhiệm vụ sử dụng công nghệ(Padlet, Canva, AI, Quizizz) để phục vụ hình thành Năng lực số.
3. LOGIC SƯ PHẠM: Các tình huống tranh biện / thảo luận phải có tính biện chứng, không được phản giáo dục.
4. CHI TIẾT SẢN PHẨM: Sản phẩm của HS phải được mô tả cực kỳ chi tiết(VD: Nội dung bài viết trên Padlet, Sơ đồ tư duy cụ thể thay vì chỉ ghi 'Sơ đồ tư duy').

TRIẾT LÝ: "NẾU KHÔNG CÓ HÀNH ĐỘNG CỤ THỂ - KHÔNG ĐƯỢC GHI NĂNG LỰC ĐÓ VÀO MỤC TIÊU".
`;

// ============================================================
// PART 3: INTEGRATION RULES (NLS & ETHICS)
// ============================================================

export const INTEGRATION_RULES = `
INTEGRATION FRAMEWORKS:

1. DIGITAL LITERACY(NLS) - CIRCULAR 02 / 2025 / TT - BGDĐT:
- Focus on: Digital Content Creation(3.1), Search / Eval(1.1, 1.2), and Netiquette(2.5).
   - Use tools: Canva(design), CapCut(video), Padlet(collab), VR / AR apps(visualizing).

2. DESIGN THINKING(DT) INTEGRATION:
- Phase 1(Empathize / Define): Use SWOT, Fishbone, or PESTEL in Exploration.
   - Phase 2(Ideate / Prototype): Design creative solutions in Practice / Apply.

3. SERVICE LEARNING(SL) & ETHICS:
- Connect lessons to community "Service"(e.g., "Cleaning the beach", "Donating books").
   - Qualities formed through ACTION: Responsibility is shown by doing, not just knowing.
`;

// ============================================================
// PART 4: ACTIVITY STRUCTURE (2-COLUMN FORMAT)
// ============================================================

export const ACTIVITY_STRUCTURE = `
CẤU TRÚC HOẠT ĐỘNG(ĐỊNH DẠNG BẢNG 2 CỘT - CHUẨN MÔN HĐTN, HN):

*** QUAN TRỌNG: TUÂN THỦ ĐÚNG FORMAT ĐỂ HỆ THỐNG TỰ ĐỘNG ĐIỀN VÀO FILE WORD ***

  Mỗi hoạt động(hoat_dong_khoi_dong, hoat_dong_kham_pha, ...) PHẢI được định dạng như sau:

{ { cot_1 } }
a) Mục tiêu:
-[Ghi rõ Yêu cầu cần đạt về kiến thức / kỹ năng, tối thiểu 3 ý].
- [Ý nghĩa thực tiễn đối với học sinh].

    b) Nội dung(Kịch bản thực hiện):
-[Mô tả ngắn gọn nhiệm vụ trọng tâm].
- [Danh sách học liệu / thiết bị cần dùng].

    c) Sản phẩm:
-[Kết quả cụ thể: Nội dung phiếu học tập, kết quả thảo luận, hoặc sản phẩm số].
- [Mô tả tiêu chí đạt được của sản phẩm].

    d) Tổ chức thực hiện:
{ { cot_2 } }
Bước 1: CHUYỂN GIAO NHIỆM VỤ
• GV thực hiện: [Mô tả kỹ thuật dạy học sử dụng: Trạm, Mảnh ghép, KWL...và các bước chỉ dẫn của GV].
• Lệnh bài tập / Câu hỏi định hướng:
+[Câu hỏi 1: Kích thích tư duy].
  + [Câu hỏi 2: Đào sâu vấn đề].

    Bước 2: THỰC HIỆN NHIỆM VỤ([X] phút)
• HS thực hiện: [Mô tả chi tiết HS làm gì: Đọc tài liệu, thảo luận nhóm 4, tìm kiếm thông tin trên internet, hoàn thiện Phiếu học tập].
• SẢN PHẨM / ĐÁP ÁN DỰ KIẾN:
+[Liệt kê chi tiết các câu trả lời đúng, nội dung kiến thức chuẩn HS cần trình bày được].
  + [Mô tả hình thức sản phẩm: Sơ đồ tư duy, bài trình thuyết trình Canva...].
• Hỗ trợ(Scaffolding): [GV quan sát và định hướng cho các nhóm gặp khó khăn ra sao ?].

  Bước 3: BÁO CÁO, THẢO LUẬN([X] phút)
• GV điều phối: [Cách thức tổ chức báo cáo: Phòng tranh, Thuyết trình quay vòng, Bình chọn trực tuyến...].
• HS báo cáo: [Nội dung báo cáo, cách thức phản biện và đặt câu hỏi giữa các nhóm].

  Bước 4: KẾT LUẬN, NHẬN ĐỊNH
• GV chốt kiến thức: [Tóm tắt nội dung cốt lõi, khoa học].
• Giáo dục tích hợp: [Bài học về Đạo đức / Năng lực số rút ra từ hoạt động].
{ {/cot_2 } }
{ {/cot_1 } }

=== LƯU Ý ===
  - KHÔNG thêm tiêu đề "HOẠT ĐỘNG 1:...".
- BẮT BUỘC giữ marker { { cot_1 } } và { { cot_2 } }.
- Nội dung GV / HS phải CỤ THỂ, TRỰC QUAN, không viết chung chung.
`;

// ============================================================
// PART 5: FORMAT RULES
// ============================================================

export const FORMAT_RULES = `
QUY TẮC ĐỊNH DẠNG HÀNH CHÍNH(NGHỊ ĐỊNH 30 / 2020 / NĐ - CP):
1. VĂN PHONG: Tuyệt đối không lời thoại "GV:...", không dùng từ lóng, không emoji.
2. KHÔNG dùng dấu ** (Markdown) trong nội dung văn bản.
3. PHÂN CẤP: Sử dụng hệ thống I. -> 1. -> a) -> - (Gạch đầu dòng).
4. CANH LỀ: Căn lề đều hai bên(Justified), thụt đầu dòng đoạn văn 1.25cm.
5. DANH SÁCH: Chỉ dùng duy nhất dấu gạch đầu dòng(-) cho các liệt kê.
6. SẢN PHẨM: Mô tả chi tiết, dài và đầy đủ các nội dung HS cần hoàn thành.
7. NGÔN NGỮ: Tiếng Việt chuẩn mực sư phạm.
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

  // TỐI ƯU HÓA TÌM KIẾM CHỦ ĐỀ (DEEP TRACE LOGIC)
  // Ưu tiên 1: Tìm theo Tên chủ đề (Chính xác nhất với Input người dùng)
  // Ưu tiên 2: Tìm theo Tháng (Nếu người dùng chọn tháng nhưng chưa nhập tên chuẩn)

  let foundChuDe = null;
  let machNoiDung = "ban_than";
  let chuDeSo = 1;

  // 1. Tìm theo tên
  if (topic && topic.trim().length > 0) {
    foundChuDe = timChuDeTheoTen(gradeNumber, topic);
  }

  // 2. Fallback tìm theo tháng
  if (!foundChuDe && month) {
    foundChuDe = getChuDeTheoThang(gradeNumber, month);
  }

  // 3. Fallback mặc định theo tháng nếu có (để tính PPCT)
  if (!foundChuDe && month) {
    chuDeSo = MONTH_TO_CHU_DE[month] || 1;
  }

  // Nếu tìm thấy chủ đề trong DB, cập nhật các thông số
  let chuDeContext = "";
  let tenChuDe = topic;

  if (foundChuDe) {
    tenChuDe = foundChuDe.ten;
    chuDeContext = taoPromptContextTuChuDe(foundChuDe, gradeNumber);
    if (foundChuDe.mach_noi_dung) machNoiDung = foundChuDe.mach_noi_dung;

    const match = foundChuDe.ma.match(/\d+\.(\d+)/);
    if (match) chuDeSo = Number.parseInt(match[1]);
  }

  // Tính toán PPCT và Thời lượng dựa trên Chủ đề số đã xác định
  let ppctContext = "";
  let phanBoThoiGianContext = "";
  let ppctInfo = null;

  ppctInfo = getPPCTChuDe(gradeNumber, chuDeSo);
  if (ppctInfo) {
    ppctContext = taoContextPPCT(gradeNumber, chuDeSo);
    phanBoThoiGianContext = taoContextPhanBoThoiGian(gradeNumber, chuDeSo);
  }

  if (month && !ppctInfo && !foundChuDe) {
    // Logic cũ: Nếu vẫn không tìm được gì thì dùng map tháng mặc định
    chuDeSo = MONTH_TO_CHU_DE[month] || 1;
    ppctInfo = getPPCTChuDe(gradeNumber, chuDeSo);
    if (ppctInfo) {
      ppctContext = taoContextPPCT(gradeNumber, chuDeSo);
      phanBoThoiGianContext = taoContextPhanBoThoiGian(gradeNumber, chuDeSo);
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

  // NLS Suggestions
  const nlsSuggestions = goiYNLSTheoChuDe(topic);
  const nlsSuggestionText = nlsSuggestions.length > 0
    ? nlsSuggestions.map(nl => `- ${nl.ma} (${nl.ten}): ${nl.vi_du_tich_hop.join(", ")}`).join("\n")
    : "Tự đề xuất 1-2 năng lực số phù hợp (Tra cứu, Tạo nội dung, hoặc An toàn số).";


  return `
# VAI TRÒ: Chuyên gia thẩm định và phát triển chương trình HĐTN, HN 12 (Chương trình 2018).

# DỮ LIỆU THAM KHẢO (INPUT):

1. **Nội dung thực tế từ KHBH cũ (PDF Input):**
${hasFile ? `
   (HỆ THỐNG ĐÃ GỬI KÈM TÀI LIỆU PDF/ẢNH)
   - Nhiệm vụ của bạn là ĐỌC KỸ tài liệu đính kèm này.
   - Trích xuất toàn bộ: Tên bài, Mục tiêu, Tiến trình hoạt động cũ.
   - Nhận diện các điểm yếu: Mục tiêu thụ động (Biết, Hiểu...), Hoạt động sơ sài, Thiếu công nghệ.
` : `
   (KHÔNG CÓ TÀI LIỆU ĐÍNH KÈM)
   - Giả định: Giáo viên cần xây dựng bài mới hoàn toàn từ con số 0.
   - Hãy sử dụng 100% dữ liệu chuẩn từ hệ thống dưới đây.
`}

2. **Dữ liệu chuẩn từ Kho dữ liệu Hệ thống (Database Injection):**

   a) **Thông tin chủ đề (Tra cứu từ Database Chương trình):**
   - Tên chủ đề chuẩn: "${tenChuDe}"
   - Mạch nội dung: ${machNoiDung}
   - **Yêu cầu cần đạt (YCCĐ) & Mục tiêu chuẩn:**
${chuDeContext}

   b) **Gợi ý hoạt động chuẩn của SGK (Tham khảo):**
${hoatDongContext || "   - (Chưa có dữ liệu chi tiết, hãy bám sát tên chủ đề)"}

   c) **Định hướng Năng lực số (Theo Thông tư 02/2025):**
   - Hệ thống gợi ý các năng lực sau là phù hợp nhất cho chủ đề này:
${nlsSuggestionText}

   d) **Hướng dẫn phân bổ thời gian (PPCT):**
${phanBoThoiGianContext || HUONG_DAN_AI_SU_DUNG_PPCT}

${activitySuggestionsContext ? `
   e) **Yêu cầu đặc biệt từ Giáo viên (User Custom):**
${activitySuggestionsContext}
` : ""}

# NHIỆM VỤ (AUDIT & UPGRADE):
Hãy phân tích dữ liệu cũ (nếu có) và tái cấu trúc lại thành Kế hoạch dạy học (KHBD) chuẩn 5512.

1. **Mục tiêu (Audit & Standardize):**
   - RÀ SOÁT: Nếu file cũ dùng động từ thụ động (Hiểu, Biết), hãy *GẠCH BỎ* và thay bằng động từ hành động thang Bloom (Phân tích, Thiết kế, Thực hiện, Đánh giá) dựa trên mục "Yêu cầu cần đạt" ở trên.

2. **Thiết bị & Học liệu (Digital Upgrade):**
   - CẬP NHẬT: Bắt buộc bổ sung công cụ số (NLS) đã gợi ý ở mục 2c vào phần "Thiết bị dạy học" và "Tiến trình".
   - Ví dụ: Thay vì "Máy chiếu", hãy ghi "Máy chiếu, Padlet (thảo luận), Canva (thiết kế)".

3. **Tiến trình Hoạt động (Enrich & Deepen):**
   - SO SÁNH: Đối chiếu hoạt động trong file cũ với "Gợi ý hoạt động chuẩn" (Mục 2b).
   - NÂNG CẤP: Nếu hoạt động cũ sơ sài, hãy VIẾT LẠI HOÀN TOÀN dựa trên gợi ý chuẩn, thêm chi tiết các bước thực hiện (GV làm gì, HS làm gì).
   - ĐỊNH DẠNG: Sử dụng triệt để cấu trúc **{{cot_1}}** và **{{cot_2}}** cho phần "Tổ chức thực hiện".

# YÊU CẦU OUTPUT JSON (QUAN TRỌNG - BẮT BUỘC):
- Trả về **DUY NHẤT** một khối JSON hợp lệ.
- Không viết lời dẫn. Không Markdown dư thừa ngoài block JSON.
- **Quy tắc văn bản:** Mọi ký tự xuống dòng trong nội dung JSON phải chuyển thành \`\\n\`.

\`\`\`json
{
  "ma_chu_de": "${grade}.${chuDeSo}",
  "ten_bai": "${tenChuDe}",
  "so_tiet": "${duration}",
  "muc_tieu_kien_thuc": "- [Động từ hành động] ... (Bám sát YCCĐ)\\n- [Động từ hành động] ...",
  "muc_tieu_nang_luc": "a) Năng lực chung:\\n- Tự chủ và tự học: ...\\n- Giao tiếp và hợp tác: ...\\n\\nb) Năng lực đặc thù:\\n- Thích ứng...: ...\\n- Thiết kế...: ...",
  "muc_tieu_pham_chat": "- Trách nhiệm: ...\\n- Nhân ái: ...",
  "gv_chuan_bi": "- Máy tính, Tivi\\n- [Công cụ số từ mục 2c]...\\n- Phiếu học tập...",
  "hs_chuan_bi": "- SGK, Smartphone (hỗ trợ học tập)...",
  "shdc": "Tên hoạt động: [Tên từ gợi ý].\\nHình thức: [Sân khấu hóa/Diễn đàn].\\nMô tả: [Tóm tắt kịch bản hấp dẫn].",
  "shl": "Tên hoạt động: [Tên từ gợi ý].\\nHình thức: [Thảo luận/Sơ kết].\\nMô tả: [Tóm tắt kịch bản hấp dẫn].",
  "hoat_dong_khoi_dong": "a) Mục tiêu: ...\\nb) Nội dung: ...\\nc) Sản phẩm: ...\\nd) Tổ chức thực hiện: {{cot_1}} GV: ... {{cot_2}} HS: ...",
  "hoat_dong_kham_pha": "a) Mục tiêu: ...\\nb) Nội dung: ...\\nc) Sản phẩm: ...\\nd) Tổ chức thực hiện: {{cot_1}} GV: ... {{cot_2}} HS: ...",
  "hoat_dong_luyen_tap": "a) Mục tiêu: ...\\nb) Nội dung: ...\\nc) Sản phẩm: ...\\nd) Tổ chức thực hiện: {{cot_1}} GV: ... {{cot_2}} HS: ...",
  "hoat_dong_van_dung": "a) Mục tiêu: ...\\nb) Nội dung: ...\\nc) Sản phẩm: ...\\nd) Tổ chức thực hiện: {{cot_1}} GV: ... {{cot_2}} HS: ...",
  "ho_so_day_hoc": "PHIẾU HỌC TẬP:\\n...\\nRUBRIC ĐÁNH GIÁ:\\n...",
  "tich_hop_nls": "- [Hoạt động]: Sử dụng [Công cụ] để [Mục đích]...",
  "tich_hop_dao_duc": "- [Hoạt động]: Giáo dục phẩm chất [Tên] qua tình huống...",
  "huong_dan_ve_nha": "..."
}
\`\`\`
QUAN TRỌNG: Bạn chỉ được trả về DUY NHẤT một khối mã JSON hợp lệ. Không được viết thêm lời dẫn như "Đây là kết quả...", "Dưới đây là JSON...". Bắt đầu ngay bằng ký tự { và kết thúc bằng }.
`;
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
