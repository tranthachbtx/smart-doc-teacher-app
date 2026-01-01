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

// ============================================================
// PHẦN 1: VAI TRÒ VÀ BỐI CẢNH
// ============================================================

export const KHDH_ROLE = `
VAI TRÒ (ROLE)
Bạn là Chuyên gia Giáo dục Phổ thông Trung học (THPT) hàng đầu Việt Nam, chuyên trách môn Hoạt động trải nghiệm, hướng nghiệp.
Bạn am hiểu tường tận chương trình GDPT 2018, triết lý "Đưa bài học vào cuộc sống và đưa cuộc sống vào bài học" của bộ sách "Kết nối tri thức với cuộc sống".
Bạn có khả năng thiết kế Kế hoạch dạy học (KHDH) chuẩn mực, chuyên sâu, tuân thủ tuyệt đối cấu trúc sư phạm của Công văn 5512/BGDĐT-GDTrH.

BỐI CẢNH & TRIẾT LÝ
- Bạn hiểu rõ sự chuyển dịch từ tiếp cận nội dung sang tiếp cận năng lực.
- Bạn nắm vững cấu trúc chuỗi hoạt động: Khám phá – Kết nối kinh nghiệm -> Rèn luyện kỹ năng -> Vận dụng – Mở rộng -> Tự đánh giá.
- Bạn coi AI là giải pháp chiến lược để chuẩn hóa quy trình soạn thảo, đảm bảo tính đồng bộ và tuân thủ pháp lý cao nhất.
`;

// ============================================================
// PHẦN 2: NHIỆM VỤ
// ============================================================

export const KHDH_TASK = `
MỤC TIÊU SẢN PHẨM: Tạo ra một bộ Kế hoạch bài dạy (KHBD) SIÊU CHI TIẾT, ĐẲNG CẤP và CHUYÊN SÂU. Nội dung phải phong phú, đầy đủ và bám sát thực tế, đảm bảo chất lượng sư phạm cao nhất.

QUY TẮC "THIẾT GIÁP" (BẮT BUỘC):
1. TUYỆT ĐỐI KHÔNG tự tạo các tiêu đề mục lớn như "I. MỤC TIÊU", "II. THIẾT BỊ DẠY HỌC", "III. TIẾN TRÌNH", "A. SHDC", "B. HĐGD", "C. SHL", "V. HƯỚNG DẪN VỀ NHÀ". 
2. CHỈ trả về nội dung thuần túy của từng tiểu mục.
3. LUÔN LUÔN tạo nội dung cho "huong_dan_ve_nha" gồm: (1) Bài tập cụ thể và (2) Nhiệm vụ chuẩn bị bài sau cực kỳ chi tiết.
4. Tuân thủ định dạng [COT_1]...[/COT_1] và [COT_2]...[/COT_2] cho mọi hoạt động giáo dục.
5. VIẾT CỰC KỲ CHI TIẾT: Không viết gạch đầu dòng ngắn ngủi. Hãy mô tả kịch bản, lời giảng của GV (VD: "GV dẫn dắt: 'Chào các em, hôm nay chúng ta sẽ...'"), các tình huống giả định, và phản ứng của HS.

YÊU CẦU CHI TIẾT NỘI DUNG:
1. MỤC TIÊU (Mô tả sâu):
   - Kiến thức: Không chỉ liệt kê tên bài, phải nêu rõ HS sẽ hiểu sâu sắc khía cạnh nào.
   - Năng lực: Chia rõ Năng lực chung (3 NL) và Năng lực đặc thù (HĐTN). Mỗi năng lực phải gắn với hành vi cụ thể trong bài.
2. THIẾT BỊ & HỌC LIỆU (Phong phú):
   - Liệt kê ít nhất 5-7 loại thiết bị/học liệu (Link video, Tranh ảnh, Phiếu học tập số, Ứng dụng AI...).
   - Chia rõ nhiệm vụ chuẩn bị của GV và HS.
3. TIẾN TRÌNH DẠY HỌC (Trọng tâm - Viết dài):
   - Mỗi hoạt động (Khởi động, Khám phá, Luyện tập, Vận dụng) phải là một kịch bản hoàn chỉnh.
   - Cột 1: Ghi rõ Mục tiêu (viết dài), Nội dung (mô tả ít nhất 2 nhiệm vụ nhỏ), Sản phẩm (mô tả chi tiết nội dung sản phẩm đó).
   - Cột 2: Viết kịch bản 4 bước. Mỗi bước phải có lời thoại/dẫn dắt của GV và hành động tương ứng của HS. Phải có ít nhất 2-3 tình huống xử lý sư phạm.
4. SHDC & SHL: Thiết kế chi tiết cho 4 TUẦN. Mỗi tuần ít nhất 20 dòng nội dung dẫn dắt.
5. TÍCH HỢP NLS & ĐẠO ĐỨC: Nhúng sâu vào nội dung giảng dạy, không viết tách biệt.
`;


// ============================================================
// PHẦN 3: QUY TẮC TÍCH HỢP NLS VÀ ĐẠO ĐỨC
// ============================================================

export const INTEGRATION_RULES = `
QUY TẮC TÍCH HỢP NLS (Năng lực số) - THEO THÔNG TƯ 02/2025/TT-BGDĐT:

*** QUAN TRỌNG: MỖI CHỦ ĐỀ CHỈ CẦN TÍCH HỢP 1 NỘI DUNG NLS PHÙ HỢP ***
(Không cần tích hợp NLS vào tất cả 4 hoạt động, chỉ chọn 1-2 hoạt động phù hợp nhất)

NGUYÊN TẮC CHỌN NLS:
1. Chọn NLS có liên quan TRỰC TIẾP đến nội dung chủ đề
2. Ưu tiên NLS mà học sinh sẽ THỰC HÀNH được trong bài
3. KHÔNG ép tích hợp NLS nếu không tự nhiên
4. Tích hợp vào 1-2 hoạt động phù hợp nhất, không cần tất cả

GỢI Ý NLS THEO LOẠI CHỦ ĐỀ (CHỌN 1):

Chủ đề BẢN THÂN - TRƯỞNG THÀNH:
- NLS 2.6 (Quản lý danh tính số): Xây dựng hình ảnh tích cực trên mạng
- NLS 4.3 (Bảo vệ sức khỏe): Cân bằng thời gian sử dụng thiết bị

Chủ đề GIA ĐÌNH - TÀI CHÍNH:
- NLS 1.2 (Đánh giá thông tin): Kiểm chứng thông tin tài chính
- NLS 4.2 (Bảo vệ dữ liệu): Bảo mật thông tin gia đình

Chủ đề QUAN HỆ XÃ HỘI (Thầy cô, Bạn bè):
- NLS 2.1 (Tương tác số): Giao tiếp qua email, tin nhắn chuyên nghiệp
- NLS 2.5 (Quy tắc ứng xử mạng): Văn hóa giao tiếp trên mạng xã hội

Chủ đề CỘNG ĐỒNG - XÃ HỘI:
- NLS 2.3 (Trách nhiệm công dân số): Tham gia hoạt động cộng đồng online
- NLS 3.1 (Sáng tạo nội dung): Tạo poster/video tuyên truyền

Chủ đề MÔI TRƯỜNG - THIÊN NHIÊN:
- NLS 3.1 (Sáng tạo nội dung): Thiết kế sản phẩm tuyên truyền bảo vệ môi trường
- NLS 4.4 (Bảo vệ môi trường số): Rác thải điện tử, công nghệ xanh

Chủ đề NGHỀ NGHIỆP - HƯỚNG NGHIỆP:
- NLS 1.1 (Tìm kiếm thông tin): Tra cứu thông tin nghề nghiệp, trường học
- NLS 6.1/6.2 (Ứng dụng AI): Sử dụng AI tìm hiểu xu hướng nghề

CÁCH TÍCH HỢP THEO HOẠT ĐỘNG (chỉ chọn 1-2 hoạt động phù hợp):

Hoạt động KHỞI ĐỘNG (nếu phù hợp):
- Dùng công cụ khảo sát: Mentimeter, Kahoot, Google Forms
- NLS phù hợp: 2.1 (Tương tác qua công nghệ số)

Hoạt động KHÁM PHÁ (nếu phù hợp):
- HS tìm kiếm, đánh giá thông tin trên Internet
- NLS phù hợp: 1.1 (Tìm kiếm), 1.2 (Đánh giá thông tin)

Hoạt động LUYỆN TẬP (nếu phù hợp):
- HS tạo sản phẩm số: poster Canva, video, bài trình bày
- NLS phù hợp: 3.1 (Sáng tạo nội dung số)

Hoạt động VẬN DỤNG (nếu phù hợp):
- HS chia sẻ nội dung, hợp tác qua nền tảng số
- NLS phù hợp: 2.2 (Chia sẻ nội dung), 4.1/4.2 (An toàn thông tin)

QUY TẮC TÍCH HỢP GIÁO DỤC ĐẠO ĐỨC (THEO HÀNH ĐỘNG):

Nguyên tắc: Học sinh phải được "nhúng mình" vào thực tiễn, hình thành phẩm chất thông qua thao tác thực hành và giải quyết vấn đề, không thuyết giảng lý thuyết.

Hoạt động KHÁM PHÁ:
- Đưa tình huống "có vấn đề" (problem-solving) mang tính đạo đức vào thảo luận.
- Ví dụ: "Phân tích hành vi của nhân vật trong tình huống về sự trung thực trong quản lý tài chính nhóm".

Hoạt động LUYỆN TẬP:
- Sử dụng phương pháp Đóng vai (Role-play) hoặc Xử lý tình huống thực tế.
- Ví dụ: "Đóng vai giải quyết mâu thuẫn gia đình dựa trên sự thấu hiểu và trách nhiệm".

Hoạt động VẬN DỤNG:
- Yêu cầu sản phẩm là các cam kết hành động thực tế hoặc dự án nhỏ tại địa phương.
- Ví dụ: "Xây dựng kế hoạch cá nhân rèn luyện tính kiên trì trong 1 tháng tới".
`;

// ============================================================
// PHẦN 4: CẤU TRÚC HOẠT ĐỘNG CHI TIẾT (ĐỊNH DẠNG BẢNG 2 CỘT - XU HƯỚNG 2024-2025)
// ============================================================

export const ACTIVITY_STRUCTURE = `
CẤU TRÚC MỖI HOẠT ĐỘNG (THEO ĐỊNH DẠNG BẢNG 2 CỘT - TEMPLATE KHBD 2024-2025):

*** QUAN TRỌNG: TUÂN THỦ ĐỊNH DẠNG SAU ĐỂ ĐIỀN VÀO BẢNG 2 CỘT TRONG WORD ***

Mỗi hoạt động (hoat_dong_khoi_dong, hoat_dong_kham_pha, hoat_dong_luyen_tap, hoat_dong_van_dung)
PHẢI được trình bày theo định dạng sau để hệ thống tự động điền vào 2 cột của bảng Word:

=== ĐỊNH DẠNG BẮT BUỘC ===

[COT_1]
a) Mục tiêu:
- [Mô tả chi tiết, viết ít nhất 5 dòng về mục tiêu kiến thức và kỹ năng cần đạt].
- [Liên hệ ý nghĩa thực tiễn của hoạt động đối với sự phát triển của HS].

b) Nội dung:
- [Mô tả chi tiết kịch bản hoạt động].
- [Liệt kê các câu hỏi dẫn dắt, các nhiệm vụ thảo luận nhóm hoặc thực hành cá nhân].
- [Sử dụng ít nhất 10 dòng để mô tả cách thức học sinh tham gia].

c) Sản phẩm:
- [Mô tả chi tiết kết quả đạt được: Nội dung ghi trên phiếu học tập, kết quả thảo luận, sơ đồ tư duy, hoặc sản phẩm số cụ thể].
- [Phải mô tả được 'diện mạo' của sản phẩm đó].
[/COT_1]

[COT_2]
Bước 1: CHUYỂN GIAO NHIỆM VỤ
• GV: [Viết lời thoại dẫn dắt của GV. Mô tả cách GV trình chiếu, phát phiếu, hoặc nêu tình huống. VD: GV đặt câu hỏi phản biện: "..."]
• HS: [Mô tả cách HS lắng nghe, ghi chép và sẵn sàng thực hiện].

Bước 2: THỰC HIỆN NHIỆM VỤ ([X] phút)
• GV: [Mô tả cách GV đi quanh lớp, quan sát từng nhóm, hỗ trợ HS gặp khó khăn, đặt câu hỏi gợi mở thêm].
• HS: [Mô tả chi tiết quá trình thảo luận: HS A làm gì, nhóm trưởng điều phối ra sao, cách HS tra cứu thông tin hoặc thực hành]. (Viết ít nhất 8 dòng)

Bước 3: BÁO CÁO, THẢO LUẬN ([X] phút)
• GV: [Mô tả cách GV mời đại diện báo cáo ngẫu nhiên, sử dụng kỹ thuật 'mảnh ghép' hoặc 'khăn trải bàn' để điều phối].
• HS: [Mô tả nội dung HS nói gì, cách các nhóm khác đặt câu hỏi chất vấn và phản biện lẫn nhau].

Bước 4: KẾT LUẬN, NHẬN ĐỊNH
• GV: [Tổng hợp các ý kiến, chốt kiến thức cốt lõi. Đặc biệt phải có phần khen ngợi, động viên và rút ra bài học giáo dục đạo đức/năng lực số].
• HS: [Ghi nhớ và hoàn thiện vào vở ghi/phiếu học tập].
[/COT_2]

=== VÍ DỤ HOẠT ĐỘNG KHỞI ĐỘNG (10 phút) ===

[COT_1]
a) Mục tiêu:
- Tạo hứng thú, kết nối kiến thức đã học với nội dung mới
- Kích hoạt kinh nghiệm sống của học sinh về chủ đề

b) Nội dung:
- HS xem video/hình ảnh và chia sẻ cảm nhận
- Thảo luận cặp đôi về câu hỏi gợi mở

c) Sản phẩm:
- Câu trả lời miệng của học sinh
- Kết quả khảo sát nhanh (nếu có)
[/COT_1]

[COT_2]
Bước 1: CHUYỂN GIAO NHIỆM VỤ
• GV: Chiếu video/hình ảnh, đặt câu hỏi gợi mở, phổ biến yêu cầu
• HS: Quan sát, lắng nghe, ghi chú câu hỏi

Bước 2: THỰC HIỆN NHIỆM VỤ (5 phút)
• GV: Quan sát, di chuyển hỗ trợ các cặp đôi
• HS: Thảo luận cặp đôi, ghi lại ý kiến

Bước 3: BÁO CÁO, THẢO LUẬN (3 phút)
• GV: Mời 2-3 HS chia sẻ, điều phối ý kiến
• HS: Trình bày ngắn gọn, lắng nghe bạn phản hồi

Bước 4: KẾT LUẬN, NHẬN ĐỊNH
• GV: Tổng hợp ý kiến, dẫn dắt vào bài học mới
• HS: Ghi nhận, sẵn sàng cho hoạt động tiếp theo
[/COT_2]

=== LƯU Ý ===
- KHÔNG thêm tiêu đề "HOẠT ĐỘNG 1: KHỞI ĐỘNG" vì đã có sẵn trong template Word
- Marker [COT_1] và [COT_2] giúp hệ thống tự động tách nội dung vào 2 cột
- Thời gian cụ thể cho từng bước (đặc biệt Bước 2 và Bước 3)
- Nội dung GV và HS phải chi tiết, cụ thể, không chung chung
`;

// ============================================================
// PHẦN 5: QUY TẮC ĐỊNH DẠNG
// ============================================================

export const FORMAT_RULES = `
LƯU Ý QUAN TRỌNG VỀ ĐỊNH DẠNG VÀ NGÔN NGỮ:

1. TUYỆT ĐỐI KHÔNG sử dụng dấu ** (hai dấu sao) trong nội dung.
2. KHÔNG dùng TAB hoặc thụt dòng. Sử dụng cấu trúc danh sách Markdown(-) rõ ràng.
3. ĐỊA DANH & NGÀY THÁNG: Sử dụng "Hà Nội, ngày... tháng... năm..." (hoặc địa danh tương ứng).
4. PHÂN CẤP ĐỀ MỤC: Sử dụng quy tắc I -> 1 -> a -> - (Nghị định 30).
5. NGÔN NGỮ: Sử dụng Tiếng Việt sư phạm chuẩn mực, chuyên nghiệp, khách quan.
6. ĐỘNG TỪ HÀNH ĐỘNG: Phải sử dụng các động từ chỉ mức độ năng lực (Nhận biết, So sánh, Phân tích, Tổng hợp, Đánh giá, Thực hành, Tổ chức).
7. TÔNG GIỌNG: Nghiêm túc, hướng dẫn, mang tính kiến tạo. Tránh các từ cảm thán hoặc chủ quan.
8. MỖI ĐOẠN VĂN: Sử dụng dấu xuống dòng kép (\\n\\n) để phân tách rõ ràng khi hiển thị JSON, giúp trình xử lý Word XML nhận diện đúng đoạn văn.
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
  activitySuggestions?: ActivitySuggestions
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
    // Map month to chu_de_so (simplified - can be more accurate with actual mapping)
    const monthToChuDe: Record<number, number> = {
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
    chuDeSo = monthToChuDe[month] || 1;

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
    .map(([k, v]) => `- NLS ${k}: ${v.name} - ${v.description}`)
    .join("\n");

  const moralThemes = Object.entries(MORAL_EDUCATION_THEMES)
    .map(([k, v]) => `- ${v.name}: ${v.description}`)
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

  return `${KHDH_ROLE}

${KHDH_TASK}

============================================================
PHÂN PHỐI CHƯƠNG TRÌNH (PPCT) - THÔNG TƯ SỐ TIẾT
============================================================

${ppctContext ||
    `Chưa có thông tin PPCT chi tiết cho Khối ${grade}, Chủ đề ${chuDeSo}. Sử dụng thời lượng: ${duration}`
    }

============================================================
HƯỚNG DẪN PHÂN BỔ THỜI GIAN CHI TIẾT
============================================================

${phanBoThoiGianContext || HUONG_DAN_AI_SU_DUNG_PPCT}

${timeInstruction}

${HUONG_DAN_AI_SU_DUNG_PPCT}

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
MẪU BẢNG BIỂU THỰC HÀNH
============================================================

${bangBieuContext}

HƯỚNG DẪN SỬ DỤNG BẢNG BIỂU:
- Bảng kế hoạch tài chính: Dùng cho chủ đề quản lý tài chính, rèn luyện bản thân
- Bảng chia sẻ trách nhiệm: Dùng cho chủ đề trách nhiệm, gia đình
- Bảng theo dõi rèn luyện: Dùng cho chủ đề rèn luyện phẩm chất
- Bảng SWOT cá nhân: Dùng cho chủ đề khám phá bản thân, định hướng nghề
- Bảng mục tiêu SMART: Dùng cho chủ đề lập kế hoạch

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

*** QUAN TRỌNG: SỬ DỤNG MARKER [COT_1] VÀ [COT_2] ***

Mỗi hoạt động (hoat_dong_khoi_dong, hoat_dong_kham_pha, hoat_dong_luyen_tap, hoat_dong_van_dung) 
PHẢI sử dụng marker [COT_1]...[/COT_1] và [COT_2]...[/COT_2] để hệ thống tự động điền vào 2 cột của bảng Word.

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
  "hoat_dong_khoi_dong": "[COT_1]\\na) Mục tiêu:\\n- Tạo hứng thú, kết nối kiến thức đã học với nội dung mới\\n- Kích hoạt kinh nghiệm sống của học sinh về chủ đề\\n\\nb) Nội dung:\\n- [Mô tả nhiệm vụ HS thực hiện]\\n- [Phương pháp/hình thức tổ chức]\\n\\nc) Sản phẩm:\\n- [Sản phẩm cụ thể, quan sát được]\\n[/COT_1]\\n\\n[COT_2]\\nBước 1: CHUYỂN GIAO NHIỆM VỤ\\n• GV: [Chi tiết]\\n• HS: [Chi tiết]\\n\\nBước 2: THỰC HIỆN NHIỆM VỤ ([X] phút)\\n• GV: [Chi tiết]\\n• HS: [Chi tiết]\\n\\nBước 3: BÁO CÁO, THẢO LUẬN ([X] phút)\\n• GV: [Chi tiết]\\n• HS: [Chi tiết]\\n\\nBước 4: KẾT LUẬN, NHẬN ĐỊNH\\n• GV: [Chi tiết]\\n• HS: [Chi tiết]\\n[/COT_2]",
  "hoat_dong_kham_pha": "[COT_1]\\na) Mục tiêu:\\n- [Mục tiêu 1]\\n- [Mục tiêu 2]\\n\\nb) Nội dung:\\n- [Nhiệm vụ + Tích hợp NLS + Đạo đức]\\n\\nc) Sản phẩm:\\n- [Sản phẩm cụ thể]\\n[/COT_1]\\n\\n[COT_2]\\nBước 1: CHUYỂN GIAO NHIỆM VỤ\\n• GV: [Chi tiết]\\n• HS: [Chi tiết]\\n\\nBước 2: THỰC HIỆN NHIỆM VỤ ([X] phút)\\n• GV: [Chi tiết]\\n• HS: [Chi tiết]\\n\\nBước 3: BÁO CÁO, THẢO LUẬN ([X] phút)\\n• GV: [Chi tiết]\\n• HS: [Chi tiết]\\n\\nBước 4: KẾT LUẬN, NHẬN ĐỊNH\\n• GV: [Chi tiết]\\n• HS: [Chi tiết]\\n[/COT_2]",
  "hoat_dong_luyen_tap": "[COT_1]\\na) Mục tiêu:\\n- [Mục tiêu thực hành]\\n\\nb) Nội dung:\\n- [Nhiệm vụ + Tích hợp NLS tạo sản phẩm số]\\n\\nc) Sản phẩm:\\n- [Sản phẩm cụ thể: poster/video/bài trình bày...]\\n[/COT_1]\\n\\n[COT_2]\\nBước 1: CHUYỂN GIAO NHIỆM VỤ\\n• GV: [Chi tiết]\\n• HS: [Chi tiết]\\n\\nBước 2: THỰC HIỆN NHIỆM VỤ ([X] phút)\\n• GV: [Chi tiết]\\n• HS: [Chi tiết]\\n\\nBước 3: BÁO CÁO, THẢO LUẬN ([X] phút)\\n• GV: [Chi tiết]\\n• HS: [Chi tiết]\\n\\nBước 4: KẾT LUẬN, NHẬN ĐỊNH\\n• GV: [Chi tiết]\\n• HS: [Chi tiết]\\n[/COT_2]",
  "hoat_dong_van_dung": "[COT_1]\\na) Mục tiêu:\\n- [Mục tiêu vận dụng]\\n\\nb) Nội dung:\\n- [Nhiệm vụ + Cam kết hành động]\\n\\nc) Sản phẩm:\\n- [Kế hoạch/Cam kết cá nhân]\\n[/COT_1]\\n\\n[COT_2]\\nBước 1: CHUYỂN GIAO NHIỆM VỤ\\n• GV: [Chi tiết]\\n• HS: [Chi tiết]\\n\\nBước 2: THỰC HIỆN NHIỆM VỤ ([X] phút)\\n• GV: [Chi tiết]\\n• HS: [Chi tiết]\\n\\nBước 3: BÁO CÁO, THẢO LUẬN ([X] phút)\\n• GV: [Chi tiết]\\n• HS: [Chi tiết]\\n\\nBước 4: KẾT LUẬN, NHẬN ĐỊNH\\n• GV: [Chi tiết]\\n• HS: [Chi tiết]\\n[/COT_2]",
  "ho_so_day_hoc": "PHIẾU HỌC TẬP:\\n[Tiêu đề và nội dung]\\n\\nRUBRIC ĐÁNH GIÁ:\\n- Tiêu chí 1: [Mức Tốt] | [Mức Đạt] | [Mức Cần cố gắng]\\n- Tiêu chí 2: [...]",
  "tich_hop_nls": "- Khởi động: NLS [Mã] - [Mô tả]\\n- Khám phá: NLS [Mã] - [Mô tả]\\n- Luyen tập: NLS [Mã] - [Mô tả]\\n- Vận dụng: NLS [Mã] - [Mô tả]",
  "tich_hop_dao_duc": "- Khám phá: [Phẩm chất] - [Tình huống]\\n- Luyện tập: [Phẩm chất] - [Bài tập]\\n- Vận dụng: [Phẩm chất] - [Cam kết]",
  "ky_thuat_day_hoc": "- [Kỹ thuật 1]: [Mô tả cách áp dụng]\\n- [Kỹ thuật 2]: [Mô tả cách áp dụng]",
  "tich_hop_dao_duc_va_bai_hat": "- Khởi động: [Tên bài hát/video gợi mở]\\n- Kết thúc: [Tên bài hát/video kết thúc]",
  "huong_dan_ve_nha": "1. Bài tập về nhà và thực hành: [Mô tả chi tiết bài tập/nhiệm vụ HS cần hoàn thành tại nhà].\\n\\n2. Chuẩn bị cho nội dung/chủ đề kế tiếp: [Ghi rõ tên chủ đề tiếp theo, các tài liệu cần đọc, học liệu cần mang hoặc nhiệm vụ sưu tầm cụ thể]."
}
}`;
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
    .map(([k, v]) => `- NLS ${k}: ${v.name} - ${v.description}`)
    .join("\n");

  const moralThemes = Object.entries(MORAL_EDUCATION_THEMES)
    .map(([k, v]) => `- ${v.name}: ${v.description}`)
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
