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

import { CURRICULUM_DATABASE, DIGITAL_LITERACY_FRAMEWORK, MORAL_EDUCATION_THEMES } from "./lesson-plan-prompts"
import { getChuDeTheoThang, timChuDeTheoTen, taoPromptContextTuChuDe } from "./kntt-curriculum-database"
import { getHoatDongTheoChuDe, getChuDeTheoThangFromActivities } from "./kntt-activities-database"
import { getMucDoBloomTheoKhoi, taoContextKHBD_CV5512, getTrongTamTheoKhoi } from "./hdtn-pedagogical-guide"
import { getCauHoiTheoKhoi, taoContextCauHoiGoiMo } from "./cau-hoi-goi-mo-database"
import { taoContextPhieuHocTap, taoContextRubric, taoContextDanhGiaKHBD } from "./phieu-hoc-tap-rubric-database"
import { taoContextSHDC_SHL, taoContextTieuChiDanhGia, taoContextBangBieu } from "./shdc-shl-templates"
import { taoContextNLSChiTiet, goiYNLSTheoChuDe } from "./nang-luc-so-database"
import { getPPCTChuDe, taoContextPPCT, HUONG_DAN_AI_SU_DUNG_PPCT, taoContextPhanBoThoiGian } from "./ppct-database"

// ============================================================
// PHẦN 1: VAI TRÒ VÀ BỐI CẢNH
// ============================================================

export const KHDH_ROLE = `
VAI TRÒ (ROLE)
Bạn là Chuyên gia Sư phạm - Tổ phó chuyên môn xuất sắc tại một trường THPT.
Bạn có khả năng thiết kế Kế hoạch dạy học (KHDH) chuẩn mực theo Công văn 5512/BGDĐT-GDTrH,
với năng lực tích hợp Năng lực số (NLS) và Giáo dục đạo đức vào đúng vị trí trong từng hoạt động.

BỐI CẢNH
- Bạn am hiểu sâu sắc bộ sách "Kết nối tri thức với cuộc sống"
- Bạn nắm vững cấu trúc 4 hoạt động: Khởi động - Khám phá - Luyện tập - Vận dụng
- Bạn biết cách tích hợp NLS và đạo đức một cách tự nhiên, không gượng ép
`

// ============================================================
// PHẦN 2: NHIỆM VỤ
// ============================================================

export const KHDH_TASK = `
NHIỆM VỤ (TASK)
Tôi sẽ cung cấp thông tin về chủ đề/bài học cần soạn.
Nhiệm vụ của bạn là thiết kế Kế hoạch dạy học đầy đủ với:

1. MỤC TIÊU: Kiến thức, Năng lực, Phẩm chất (theo Bloom phù hợp khối lớp)
2. THIẾT BỊ DẠY HỌC: Chuẩn bị của GV và HS
3. TIẾN TRÌNH DẠY HỌC: 4 hoạt động theo chuẩn CV5512
4. TÍCH HỢP: NLS và Đạo đức được chèn VÀO TỪNG HOẠT ĐỘNG cụ thể
5. HỒ SƠ DẠY HỌC: Phiếu học tập, bảng kiểm đánh giá
`

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

QUY TẮC TÍCH HỢP GIÁO DỤC ĐẠO ĐỨC:

Nguyên tắc: Giáo dục qua HÀNH ĐỘNG và TÌNH HUỐNG, không thuyết giáo

Hoạt động KHÁM PHÁ:
- Đưa tình huống đạo đức vào nội dung bài học
- Ví dụ: "Đọc tình huống về bạn A không giữ lời hứa, thảo luận về phẩm chất Trung thực"

Hoạt động LUYỆN TẬP:
- Bài tập thực hành có yếu tố đạo đức (đóng vai, xử lý tình huống)
- Ví dụ: "Đóng vai xử lý tình huống mâu thuẫn với bạn, thể hiện phẩm chất Nhân ái"

Hoạt động VẬN DỤNG:
- Cam kết hành động cụ thể thể hiện phẩm chất
- Ví dụ: "Viết 3 cam kết cụ thể để rèn luyện phẩm chất Trách nhiệm trong tuần tới"
`

// ============================================================
// PHẦN 4: CẤU TRÚC HOẠT ĐỘNG CHI TIẾT (CHUẨN CV5512)
// ============================================================

export const ACTIVITY_STRUCTURE = `
CẤU TRÚC MỖI HOẠT ĐỘNG (theo CV5512 - BẮT BUỘC TUÂN THỦ):

Mỗi hoạt động PHẢI có đủ 4 phần a), b), c), d) như sau:

a) Mục tiêu: 
   - Hoạt động này nhằm đạt mục tiêu gì?
   - Viết cụ thể, đo lường được
   - Gắn với năng lực/phẩm chất cần hình thành

b) Nội dung:
   - GV giao nhiệm vụ gì cho HS?
   - HS thực hiện như thế nào? (Chơi trò chơi, xem video, trả lời câu hỏi, thảo luận nhóm, đóng vai...)
   - **TÍCH HỢP NLS** (nếu phù hợp): Ghi rõ mã NLS và công cụ số sử dụng
     + VD: "Tích hợp NLS 2.4: GV tạo khảo sát Mentimeter, HS quét mã QR trả lời"
   - **TÍCH HỢP ĐẠO ĐỨC** (nếu phù hợp): Ghi rõ phẩm chất và tình huống
     + VD: "Tích hợp đạo đức - Phẩm chất Trung thực: Thảo luận tình huống bạn A không giữ lời hứa"

c) Sản phẩm:
   - MÔ TẢ CỤ THỂ sản phẩm đầu ra của HS
   - Ví dụ: "Câu trả lời đúng về 3 đặc điểm của người học sinh tích cực"
   - Ví dụ: "Tinh thần hào hứng, sẵn sàng vào bài mới"
   - Ví dụ: "Phiếu học tập số 1 đã hoàn thiện với đầy đủ 5 ý kiến của nhóm"
   - Ví dụ: "Poster trình bày trên Canva về chủ đề..."
   - Ví dụ: "Bảng so sánh 3 phương án giải quyết tình huống"
   - Ví dụ: "Bản cam kết 3 hành động cụ thể thể hiện phẩm chất Trách nhiệm"

d) Tổ chức thực hiện (4 bước):
   
   - Bước 1: CHUYỂN GIAO NHIỆM VỤ
     + GV nêu luật chơi/câu hỏi/yêu cầu cụ thể
     + Hướng dẫn sử dụng công cụ số (nếu có tích hợp NLS)
     + Phân nhóm, phân công (nếu cần)
     + Nêu rõ thời gian thực hiện
   
   - Bước 2: THỰC HIỆN NHIỆM VỤ
     + HS tham gia chơi/thảo luận/làm việc cá nhân/nhóm
     + HS sử dụng công cụ số (nếu có): Mentimeter, Canva, Google Drive...
     + Mô tả cụ thể hoạt động của HS
     + GV quan sát, hỗ trợ khi cần
     + Ghi rõ thời gian dự kiến (... phút)
   
   - Bước 3: BÁO CÁO, THẢO LUẬN
     + HS trả lời/trình bày kết quả
     + Hình thức báo cáo: miệng, poster, slide, bảng phụ, chia sẻ màn hình...
     + Các nhóm/cá nhân khác nhận xét, bổ sung
     + GV điều phối thảo luận, liên hệ phẩm chất đạo đức (nếu có)
   
   - Bước 4: KẾT LUẬN, NHẬN ĐỊNH
     + GV nhận xét quá trình thực hiện
     + GV chốt kiến thức trọng tâm
     + GV nhấn mạnh bài học đạo đức/phẩm chất rút ra (nếu có)
     + Nhắc nhở an toàn thông tin khi sử dụng công cụ số (nếu có)
     + Đánh giá, khen ngợi HS
     + Dẫn dắt vào phần tiếp theo (nếu cần)

HƯỚNG DẪN TÍCH HỢP THEO TỪNG HOẠT ĐỘNG:

1. HOẠT ĐỘNG KHỞI ĐỘNG:
   - NLS phù hợp: 2.1 (Tương tác qua công nghệ số) - dùng Mentimeter, Kahoot, Quizizz
   - Đạo đức: Thường không tích hợp ở hoạt động này

2. HOẠT ĐỘNG KHÁM PHÁ:
   - NLS phù hợp: 1.1 (Tìm kiếm thông tin), 1.2 (Đánh giá thông tin) - HS tra cứu thông tin
   - Đạo đức: Đưa tình huống có vấn đề đạo đức vào nội dung thảo luận

3. HOẠT ĐỘNG LUYỆN TẬP:
   - NLS phù hợp: 3.1 (Sáng tạo nội dung số) - HS tạo poster Canva, video, bài trình bày
   - Đạo đức: Bài tập đóng vai, xử lý tình huống thể hiện phẩm chất

4. HOẠT ĐỘNG VẬN DỤNG:
   - NLS phù hợp: 2.2 (Chia sẻ nội dung số), 4.1 (Bảo vệ thiết bị và dữ liệu) - HS chia sẻ bài học lên Padlet, Class Dojo
   - Đạo đức: Cam kết hành động cụ thể thể hiện phẩm chất đã học
`

// ============================================================
// PHẦN 5: QUY TẮC ĐỊNH DẠNG
// ============================================================

export const FORMAT_RULES = `
LƯU Ý QUAN TRỌNG VỀ ĐỊNH DẠNG:

1. TUYỆT ĐỐI KHÔNG sử dụng dấu ** (hai dấu sao) trong nội dung
2. KHÔNG dùng TAB hoặc thụt dòng
3. Mỗi phần cách nhau bằng 2 dấu xuống dòng (\\n\\n)
4. Sử dụng gạch đầu dòng (-) cho các mục liệt kê
5. Viết tiếng Việt chuẩn mực, văn phong hành chính sư phạm
6. CHỈ dùng tiếng Anh cho tên công cụ công nghệ (Canva, Mentimeter, Kahoot, Google Drive, Padlet)
7. Giữ nguyên cấu trúc đề mục a), b), c), d)
8. Tự động thêm các cụm từ chuyển tiếp để văn bản trôi chảy
`

// ============================================================
// PHẦN 6: HÀM TẠO PROMPT ĐẦY ĐỦ - CẬP NHẬT TÍCH HỢP DATABASE
// ============================================================

export interface ActivitySuggestions {
  shdc?: string
  hdgd?: string
  shl?: string
}

export function getKHDHPrompt(
  grade: string,
  topic: string,
  duration = "2 tiết",
  additionalRequirements?: string,
  tasks?: Array<{ name: string; description: string; time?: number }>,
  month?: number,
  activitySuggestions?: ActivitySuggestions,
): string {
  const curriculum = CURRICULUM_DATABASE[grade as keyof typeof CURRICULUM_DATABASE]

  const gradeNumber = Number.parseInt(grade) || 10

  let ppctContext = ""
  let phanBoThoiGianContext = ""
  let chuDeSo = 1
  if (month) {
    // Map month to chu_de_so (simplified - can be more accurate with actual mapping)
    const monthToChuDe: Record<number, number> = { 9: 1, 10: 2, 11: 3, 12: 4, 1: 5, 2: 6, 3: 7, 4: 8, 5: 9 }
    chuDeSo = monthToChuDe[month] || 1

    const ppctInfo = getPPCTChuDe(gradeNumber, chuDeSo)
    if (ppctInfo) {
      ppctContext = taoContextPPCT(gradeNumber, chuDeSo)
      phanBoThoiGianContext = taoContextPhanBoThoiGian(gradeNumber, chuDeSo)
    }
  }

  // Lấy chủ đề từ kntt-curriculum-database
  let chuDeContext = ""
  let tenChuDe = topic
  let machNoiDung = "ban_than"

  if (month) {
    const chuDe = getChuDeTheoThang(gradeNumber, month)
    if (chuDe) {
      chuDeContext = taoPromptContextTuChuDe(chuDe)
      tenChuDe = chuDe.ten
      // Xác định mạch nội dung từ chủ đề
      if (
        chuDe.ten.toLowerCase().includes("gia đình") ||
        chuDe.ten.toLowerCase().includes("trách nhiệm với gia đình")
      ) {
        machNoiDung = "gia_dinh"
      } else if (chuDe.ten.toLowerCase().includes("cộng đồng") || chuDe.ten.toLowerCase().includes("xã hội")) {
        machNoiDung = "cong_dong"
      } else if (chuDe.ten.toLowerCase().includes("môi trường") || chuDe.ten.toLowerCase().includes("thiên nhiên")) {
        machNoiDung = "moi_truong"
      } else if (chuDe.ten.toLowerCase().includes("nghề") || chuDe.ten.toLowerCase().includes("hướng nghiệp")) {
        machNoiDung = "nghe_nghiep"
      }
      const match = chuDe.ma.match(/\d+\.(\d+)/)
      if (match) chuDeSo = Number.parseInt(match[1])
    }
  } else {
    const chuDe = timChuDeTheoTen(gradeNumber, topic)
    if (chuDe) {
      chuDeContext = taoPromptContextTuChuDe(chuDe)
      tenChuDe = chuDe.ten
      const match = chuDe.ma.match(/\d+\.(\d+)/)
      if (match) chuDeSo = Number.parseInt(match[1])
    }
  }

  // Lấy danh sách hoạt động chi tiết từ kntt-activities-database
  let hoatDongContext = ""
  if (month) {
    const chuDeInfo = getChuDeTheoThangFromActivities(gradeNumber, month)
    if (chuDeInfo && chuDeInfo.length > 0) {
      const firstChuDe = chuDeInfo[0]
      const hoatDongList = getHoatDongTheoChuDe(gradeNumber, firstChuDe.so_chu_de)
      if (hoatDongList.length > 0) {
        hoatDongContext = `
DANH SÁCH HOẠT ĐỘNG CHI TIẾT TỪ SGK (${hoatDongList.length} hoạt động):
${hoatDongList.map((hd, i) => `${i + 1}. ${hd.ten}${hd.mo_ta ? ` - ${hd.mo_ta}` : ""}`).join("\n")}
`
      }
    }
  }

  // Lấy hướng dẫn sư phạm từ hdtn-pedagogical-guide
  const bloomInfo = getMucDoBloomTheoKhoi(gradeNumber)
  const cv5512Context = taoContextKHBD_CV5512(gradeNumber, tenChuDe, machNoiDung)

  // Lấy câu hỏi gợi mở
  let cauHoiContext = ""
  const khoiCauHoi = getCauHoiTheoKhoi(gradeNumber)
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
  + PHAN_BIEN, TU_DUY, DA_CHIEU: Dùng cho Hoạt động Khám phá  
  + THUC_HANH, CHIEN_LUOC, HANH_DONG: Dùng cho Hoạt động Luyện tập
  + TONG_HOP, GIA_TRI, CAM_XUC: Dùng cho Hoạt động Vận dụng
- Có thể điều chỉnh câu hỏi cho phù hợp với bối cảnh cụ thể của bài học
`
  }

  const shdcShlContext = taoContextSHDC_SHL(gradeNumber, chuDeSo)
  const tieuChiDanhGiaContext = taoContextTieuChiDanhGia(topic, gradeNumber)
  const bangBieuContext = taoContextBangBieu(topic)

  const phieuHocTapContext = taoContextPhieuHocTap(topic, topic)
  const rubricContext = taoContextRubric(topic)
  const danhGiaKHBDContext = taoContextDanhGiaKHBD()

  let activitySuggestionsContext = ""
  if (activitySuggestions && (activitySuggestions.shdc || activitySuggestions.hdgd || activitySuggestions.shl)) {
    activitySuggestionsContext = `
============================================================
GỢI Ý CỤ THỂ TỪ GIÁO VIÊN CHO TỪNG LOẠI HOẠT ĐỘNG
============================================================

QUAN TRỌNG: Giáo viên đã cung cấp gợi ý cụ thể sau đây. AI PHẢI ưu tiên sử dụng các gợi ý này để thiết kế nội dung phù hợp:

${
  activitySuggestions.shdc
    ? `**GỢI Ý CHO SINH HOẠT DƯỚI CỜ (SHDC):**
${activitySuggestions.shdc}

→ Hãy thiết kế các hoạt động SHDC dựa trên gợi ý trên, đảm bảo:
  - Phù hợp với quy mô toàn trường
  - Thời lượng 15-20 phút/buổi
  - Có tính tương tác cao với học sinh
`
    : ""
}

${
  activitySuggestions.hdgd
    ? `**GỢI Ý CHO HOẠT ĐỘNG GIÁO DỤC (HĐGD):**
${activitySuggestions.hdgd}

→ Hãy thiết kế các hoạt động HĐGD dựa trên gợi ý trên, đảm bảo:
  - Đa dạng phương pháp (thảo luận, đóng vai, dự án...)
  - Tích hợp NLS và giáo dục đạo đức
  - Có sản phẩm học tập cụ thể
`
    : ""
}

${
  activitySuggestions.shl
    ? `**GỢI Ý CHO SINH HOẠT LỚP (SHL):**
${activitySuggestions.shl}

→ Hãy thiết kế các hoạt động SHL dựa trên gợi ý trên, đảm bảo:
  - Phù hợp với quy mô lớp học
  - Thời lượng 45 phút/buổi
  - Tập trung vào phản ánh, đánh giá và cam kết hành động
`
    : ""
}
`
  }

  const nlsContext = taoContextNLSChiTiet(gradeNumber, topic)

  // Tìm topic trong curriculum cũ (backup)
  let topicInfo = null
  if (curriculum) {
    for (const category of Object.values(curriculum.themes)) {
      for (const t of category.topics) {
        if (topic.toLowerCase().includes(t.name.toLowerCase()) || t.name.toLowerCase().includes(topic.toLowerCase())) {
          topicInfo = {
            ...t,
            categoryName: category.name,
          }
          break
        }
      }
      if (topicInfo) break
    }
  }

  const nlsFramework = Object.entries(DIGITAL_LITERACY_FRAMEWORK)
    .map(([k, v]) => `- NLS ${k}: ${v.name} - ${v.description}`)
    .join("\n")

  const moralThemes = Object.entries(MORAL_EDUCATION_THEMES)
    .map(([k, v]) => `- ${v.name}: ${v.description}`)
    .join("\n")

  let tasksSection = ""
  if (tasks && tasks.length > 0) {
    tasksSection = `
DANH SÁCH NHIỆM VỤ CẦN THIẾT KẾ CHI TIẾT:
${tasks
  .map(
    (t, i) => `
Nhiệm vụ ${i + 1}: ${t.name}
- Nội dung yêu cầu: ${t.description}
- Thời lượng: ${t.time || "N/A"}
- Cần tạo: Mục tiêu, Nội dung chi tiết, Kỹ năng cần đạt, Sản phẩm dự kiến, và 4 bước tổ chức thực hiện
`,
  )
  .join("\n")}
`
  }

  return `${KHDH_ROLE}

${KHDH_TASK}

============================================================
PHÂN PHỐI CHƯƠNG TRÌNH (PPCT) - THÔNG TƯ SỐ TIẾT
============================================================

${ppctContext || `Chưa có thông tin PPCT chi tiết cho Khối ${grade}, Chủ đề ${chuDeSo}. Sử dụng thời lượng: ${duration}`}

============================================================
HƯỚNG DẪN PHÂN BỔ THỜI GIAN CHI TIẾT
============================================================

${phanBoThoiGianContext || HUONG_DAN_AI_SU_DUNG_PPCT}

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
Đặc điểm chương trình: ${curriculum?.title || "Hoạt động trải nghiệm, Hướng nghiệp"}
Chủ đề/Bài học: "${topic}"
Thời lượng: ${duration}
${
  topicInfo
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

ĐỊNH DẠNG ĐẦU RA (OUTPUT FORMAT) - THEO MẪU KẾ HOẠCH GIÁO DỤC CHỦ ĐỀ:

Hãy soạn Kế hoạch dạy học và trả về JSON thuần túy với cấu trúc sau:

{
  "ma_chu_de": "Mã chủ đề (VD: 10.1, 11.3, 12.5)",
  "ten_bai": "Tên bài học theo SGK",
  "muc_tieu_kien_thuc": "- Yêu cầu cần đạt 1: [Chi tiết cụ thể, đo lường được].\\n\\n- Yêu cầu cần đạt 2: [Chi tiết].\\n\\n- Yêu cầu cần đạt 3: [Chi tiết].",
  "muc_tieu_nang_luc": "a) Năng lực chung:\\n\\n- Tự chủ và tự học: [Mô tả hành vi HS cụ thể].\\n\\n- Giao tiếp và hợp tác: [Mô tả hành vi HS].\\n\\nb) Năng lực đặc thù HĐTN:\\n\\n- Thích ứng với cuộc sống: [Mô tả hành vi HS].\\n\\n- Định hướng nghề nghiệp: [Mô tả hành vi HS].",
  "muc_tieu_pham_chat": "- Trách nhiệm: [Mô tả hành vi HS thể hiện qua hoạt động cụ thể].\\n\\n- [Phẩm chất 2]: [Mô tả hành vi cụ thể].",
  "gv_chuan_bi": "- Máy chiếu, laptop có kết nối Internet.\\n\\n- [Công cụ số cụ thể: Tài khoản Mentimeter, Canva...].\\n\\n- Phiếu học tập in sẵn (số lượng...).\\n\\n- SGK, SGV môn HĐTN lớp ${grade}.",
  "hs_chuan_bi": "- Điện thoại thông minh có kết nối Internet.\\n\\n- Vở ghi, bút màu.\\n\\n- SGK môn HĐTN lớp ${grade}.\\n\\n- [Chuẩn bị khác nếu có].",
  "hoat_dong_duoi_co": {
    "shdc": [
      {
        "tuan": 1,
        "ten_hoat_dong": "Tên hoạt động SHDC tuần 1 phù hợp với chủ đề",
        "hinh_thuc": "giao_luu | dien_dan | tranh_bien | cuoc_thi | van_nghe",
        "thoi_luong": "15-20 phút",
        "muc_tieu": ["Mục tiêu 1", "Mục tiêu 2"],
        "noi_dung_chinh": "Mô tả ngắn gọn nội dung hoạt động",
        "kich_ban": {
          "mo_dau": "Cách mở đầu (1-2 phút)",
          "phan_chinh": ["Bước 1", "Bước 2", "Bước 3"],
          "ket_thuc": "Thông điệp kết thúc"
        },
        "cau_hoi_tuong_tac": ["Câu hỏi 1?", "Câu hỏi 2?"]
      }
    ],
    "shl": [
      {
        "tuan": 1,
        "chu_de": "Chủ đề SHL tuần 1 liên quan đến chủ đề chính",
        "thoi_luong": "45 phút",
        "muc_tieu": ["Mục tiêu 1", "Mục tiêu 2"],
        "noi_dung": {
          "on_dinh_to_chuc": "Điểm danh, nhận xét tuần qua (5 phút)",
          "sinh_hoat_theo_chu_de": ["Hoạt động 1", "Hoạt động 2", "Hoạt động 3"],
          "ke_hoach_tuan_toi": "Nội dung triển khai tuần sau"
        },
        "san_pham": "Sản phẩm học sinh cần hoàn thành"
      }
    ]
  },
  "hoat_dong_khoi_dong": "a) Mục tiêu: [Hoạt động này nhằm đạt mục tiêu gì?].\\n\\nb) Nội dung: [GV giao nhiệm vụ gì? HS thực hiện như thế nào? + Tích hợp NLS nếu có].\\n\\nc) Sản phẩm: [MÔ TẢ CỤ THỂ sản phẩm đầu ra].\\n\\nd) Tổ chức thực hiện:\\n\\n- Bước 1: Chuyển giao nhiệm vụ - GV [chi tiết].\\n\\n- Bước 2: Thực hiện nhiệm vụ - HS [chi tiết, ... phút].\\n\\n- Bước 3: Báo cáo, thảo luận - HS [chi tiết].\\n\\n- Bước 4: Kết luận, nhận định - GV [chi tiết].",
  "hoat_dong_kham_pha": "NHIỆM VỤ 1: [Tên nhiệm vụ 1]\\n\\na) Mục tiêu: [Mục tiêu nhiệm vụ 1].\\n\\nb) Nội dung: [Chi tiết + Tích hợp NLS + Tích hợp đạo đức].\\n\\nc) Sản phẩm: [MÔ TẢ CỤ THỂ].\\n\\nd) Tổ chức thực hiện:\\n\\n- Bước 1: Chuyển giao nhiệm vụ - [chi tiết].\\n\\n- Bước 2: Thực hiện nhiệm vụ - [chi tiết, ... phút].\\n\\n- Bước 3: Báo cáo, thảo luận - [chi tiết].\\n\\n- Bước 4: Kết luận, nhận định - [chi tiết].\\n\\nNHIỆM VỤ 2: [Tên nhiệm vụ 2]\\n\\n[Tương tự cấu trúc nhiệm vụ 1]",
  "hoat_dong_luyen_tap": "NHIỆM VỤ 1: [Tên nhiệm vụ]\\n\\na) Mục tiêu: [Chi tiết].\\n\\nb) Nội dung: [Chi tiết + Tích hợp NLS tạo sản phẩm số].\\n\\nc) Sản phẩm: [MÔ TẢ CỤ THỂ].\\n\\nd) Tổ chức thực hiện: [4 bước chi tiết].",
  "hoat_dong_van_dung": "NHIỆM VỤ 1: [Tên nhiệm vụ]\\n\\na) Mục tiêu: [Chi tiết].\\n\\nb) Nội dung: [Chi tiết + Tích hợp NLS chia sẻ + cam kết đạo đức].\\n\\nc) Sản phẩm: [MÔ TẢ CỤ THỂ].\\n\\nd) Tổ chức thực hiện: [4 bước chi tiết].",
  "ho_so_day_hoc": "PHIẾU HỌC TẬP (sử dụng mẫu PHT phù hợp):\\n\\n[Tiêu đề và nội dung chi tiết dựa trên mẫu PHT-01/02/03/04]\\n\\nRUBRIC ĐÁNH GIÁ (sử dụng mẫu RB phù hợp):\\n\\n[Tiêu chí và mức độ dựa trên mẫu RB-01/02/03/04]",
  "tich_hop_nls": "TỔNG HỢP TÍCH HỢP NLS THEO HOẠT ĐỘNG:\\n\\n- Hoạt động Khởi động: NLS [Mã] - [Mô tả].\\n\\n- Hoạt động Khám phá: NLS [Mã] - [Mô tả].\\n\\n- Hoạt động Luyện tập: NLS [Mã] - [Mô tả].\\n\\n- Hoạt động Vận dụng: NLS [Mã] - [Mô tả + an toàn thông tin].",
  "tich_hop_dao_duc": "TỔNG HỢP GIÁO DỤC ĐẠO ĐỨC THEO HOẠT ĐỘNG:\\n\\n- Hoạt động Khám phá: [Phẩm chất] - [Tình huống].\\n\\n- Hoạt động Luyện tập: [Phẩm chất] - [Bài tập].\\n\\n- Hoạt động Vận dụng: [Phẩm chất] - [Cam kết].",
  "ky_thuat_day_hoc": "KHUNG KỸ THUẬT DẠY HỌC:\\n\\n- [KyThuatDayHoc1]\\n\\n- [KyThuatDayHoc2]",
  "tich_hop_dao_duc_va_bai_hat": "TỔNG HỢP ĐẠO ĐỨC VÀ BÀI HÁT:\\n\\n- Hoạt động Khám phá: [Phẩm chất] - [Bài hát/video gợi mở].\\n\\n- Hoạt động Luyện tập: [Phẩm chất] - [Bài hát/video liên quan].\\n\\n- Hoạt động Vận dụng: [Phẩm chất] - [Bài hát/video kết thúc].",
  "huong_dan_ve_nha": "- [Yêu cầu 1: Ôn tập/chuẩn bị gì?].\\n\\n- [Yêu cầu 2: Thực hành gì ở nhà?].\\n\\n- [Yêu cầu 3: Chuẩn bị cho bài tiếp theo]."
}`
}

// ============================================================
// PHẦN 7: HÀM TẠO PROMPT TÍCH HỢP (KHI CÓ MẪU SẴN)
// ============================================================

export function getKHDHIntegrationPrompt(grade: string, topic: string, templateContent: string): string {
  const curriculum = CURRICULUM_DATABASE[grade as keyof typeof CURRICULUM_DATABASE]

  const nlsFramework = Object.entries(DIGITAL_LITERACY_FRAMEWORK)
    .map(([k, v]) => `- NLS ${k}: ${v.name} - ${v.description}`)
    .join("\n")

  const moralThemes = Object.entries(MORAL_EDUCATION_THEMES)
    .map(([k, v]) => `- ${v.name}: ${v.description}`)
    .join("\n")

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
}`
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
}
