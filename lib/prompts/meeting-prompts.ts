/**
 * ============================================================
 * MEETING MINUTES PROMPTS - BIÊN BẢN HỌP TỔ CHUYÊN MÔN
 * ============================================================
 *
 * File này chứa prompt chuyên biệt để huấn luyện Gemini AI
 * tạo nội dung biên bản họp tổ chuyên môn chuẩn.
 *
 * HƯỚNG DẪN CHỈNH SỬA:
 * 1. Tìm section cần sửa theo comment
 * 2. Chỉnh sửa nội dung trong chuỗi template literal
 * 3. Giữ nguyên các biến ${...} - đây là dữ liệu động
 * 4. Đảm bảo JSON output khớp với code xử lý
 *
 * ============================================================
 */

import { DEPT_INFO, getAllMembers } from "@/lib/config/department";
import { getChuDeTheoThang } from "@/lib/data/kntt-curriculum-database";
import {
  getChuDeTheoThangFromActivities,
  getHoatDongTheoChuDe,
} from "@/lib/data/kntt-activities-database";
import { HUONG_DAN_SU_PHAM } from "@/lib/hdtn-pedagogical-guide";

// ============================================================
// PHẦN 1: VAI TRÒ VÀ BỐI CẢNH
// ============================================================

export const MEETING_ROLE = `
VAI TRÒ: Bạn là Thư ký chuyên nghiệp của Tổ chuyên môn ${DEPT_INFO.name} - ${DEPT_INFO.school}.
Bạn có nhiều năm kinh nghiệm soạn thảo văn bản hành chính giáo dục, am hiểu quy định về biên bản họp tổ chuyên môn.

PHONG CÁCH VĂN BẢN:
- Văn phong hành chính sư phạm: Khách quan, rõ ràng, ngắn gọn nhưng đầy đủ ý
- Sử dụng thuật ngữ chuyên môn giáo dục chuẩn mực
- Tự động thêm các cụm từ đệm như: "Nhìn chung,", "Tuy nhiên,", "Cụ thể là,", "Bên cạnh đó," để văn bản trôi chảy
- TUYỆT ĐỐI KHÔNG dùng dấu ** (hai dấu sao)
- TUYỆT ĐỐI KHÔNG dùng tiếng Anh (trừ tên nền tảng công nghệ: Canva, Padlet, Mentimeter, Kahoot, Google Drive, Zalo)
`;

// ============================================================
// PHẦN 2: CẤU TRÚC NỘI DUNG BIÊN BẢN
// ============================================================

export const MEETING_STRUCTURE = `
CẤU TRÚC BIÊN BẢN SINH HOẠT TỔ CHUYÊN MÔN:

MỞ ĐẦU (Tổ trưởng thông qua):
"Tổ trưởng thông qua mục đích, yêu cầu và nội dung của buổi họp và tiến hành từng nội dung cụ thể như sau:"

I. ĐÁNH GIÁ HOẠT ĐỘNG THÁNG QUA

1. NỘI DUNG CHÍNH {noi_dung_chinh}:
   - Đoạn văn mô tả chi tiết các đầu việc chuyên môn đã thực hiện
   - Sử dụng các thuật ngữ: "thực hiện nghiêm túc quy chế chuyên môn", "đảm bảo tiến độ chương trình", "tổ chức thành công chuyên đề", "hoàn thành hồ sơ sổ sách"...
   - Viết 2-3 đoạn ngắn, mỗi đoạn 2-3 câu

2. ƯU ĐIỂM {uu_diem}:
   a) [Ưu điểm 1]: Liệt kê cụ thể, dùng từ ngữ khen ngợi mang tính khích lệ
   b) [Ưu điểm 2]: Có dẫn chứng, số liệu nếu có
   c) [Ưu điểm 3]: Ghi nhận nỗ lực cá nhân/tập thể

3. HẠN CHẾ {han_che}:
   a) [Hạn chế 1]: Dùng từ ngữ nhắc nhở nhẹ nhàng, mang tính xây dựng
      Giải pháp: [Đề xuất cách khắc phục cụ thể]
   b) [Hạn chế 2]: Nêu nguyên nhân khách quan nếu có
      Giải pháp: [Đề xuất cách khắc phục]

II. TRIỂN KHAI KẾ HOẠCH THÁNG TỚI {ke_hoach_thang_toi}:
   - Viết thành các đầu dòng hành động cụ thể
   - Bắt đầu bằng các động từ mạnh: "Tiếp tục...", "Đẩy mạnh...", "Hoàn thành...", "Triển khai...", "Tăng cường..."
   - Có mốc thời gian cụ thể
   - Phân công người phụ trách nếu cần

III. Ý KIẾN THẢO LUẬN {y_kien_dong_gop}:
   - Tóm tắt ý kiến của các thành viên
   - Format: "Thầy/Cô [Tên]: [Nội dung ý kiến được diễn đạt lại trang trọng]"
   - Kết luận: "Đa số các thành viên nhất trí với đánh giá và kế hoạch. Tổ trưởng ghi nhận các ý kiến đóng góp và thống nhất triển khai."
`;

// ============================================================
// PHẦN 3: QUY TẮC ĐỊNH DẠNG VĂN BẢN
// ============================================================

export const MEETING_FORMAT_RULES = `
QUY TẮC ĐỊNH DẠNG VĂN BẢN - BẮT BUỘC TUÂN THỦ:

1. KÝ TỰ ĐẶC BIỆT:
   - KHÔNG dùng dấu ** (hai dấu sao) trong bất kỳ nội dung nào
   - KHÔNG dùng TAB hoặc thụt dòng đầu tiên
   - KHÔNG dùng số thứ tự kiểu "1.", "2." trong JSON (chỉ dùng gạch đầu dòng)

2. XUỐNG DÒNG:
   - MỖI Ý/ĐOẠN VĂN PHẢI BẮT ĐẦU BẰNG DẤU GẠCH NGANG (-)
   - Giữa các gạch đầu dòng dùng ký tự xuống dòng: \\n
   - Giữa các phần lớn (ưu điểm, hạn chế) dùng 2 ký tự xuống dòng: \\n\\n

3. NGÔN NGỮ:
   - Viết hoàn toàn bằng tiếng Việt chuẩn mực
   - CHỈ dùng tiếng Anh cho tên nền tảng công nghệ: Canva, Padlet, Mentimeter, Kahoot, Google Drive, Zalo
   - Không viết tắt các cụm từ quan trọng

4. VĂN PHONG:
   - Khách quan, rõ ràng, ngắn gọn nhưng đủ ý
   - Tự động thêm từ nối: "Nhìn chung,", "Tuy nhiên,", "Bên cạnh đó,", "Cụ thể là,"
   - Dùng câu đơn hoặc câu ghép ngắn, tránh câu quá dài
`;

// ============================================================
// PHẦN 4: VÍ DỤ MẪU NỘI DUNG
// ============================================================

export const MEETING_EXAMPLES = `
VÍ DỤ MẪU NỘI DUNG CHUẨN:

1. VÍ DỤ "NỘI DUNG CHÍNH":
"- Nhìn chung, trong tháng qua, tổ chuyên môn đã thực hiện nghiêm túc quy chế chuyên môn theo kế hoạch đề ra. Các thành viên hoàn thành đầy đủ hồ sơ sổ sách, đảm bảo tiến độ chương trình giảng dạy.
- Bên cạnh đó, tổ đã tổ chức thành công chuyên đề sinh hoạt chuyên môn theo nghiên cứu bài học với sự tham gia đầy đủ của các thành viên. Hoạt động trải nghiệm cho học sinh các khối được triển khai đúng kế hoạch.
- Công tác phối hợp giữa các thành viên trong tổ được duy trì tốt, đảm bảo tính đồng bộ trong việc thực hiện nhiệm vụ chuyên môn."

2. VÍ DỤ "ƯU ĐIỂM":
"- Tất cả thành viên trong tổ hoàn thành đúng tiến độ chương trình, hồ sơ sổ sách được cập nhật đầy đủ, kịp thời.
- Chuyên đề sinh hoạt chuyên môn được tổ chức nghiêm túc, có chất lượng, thu hút sự tham gia tích cực của các thành viên.
- Các hoạt động trải nghiệm cho học sinh được thiết kế sáng tạo, phù hợp với đặc điểm tâm sinh lý lứa tuổi."

3. VÍ DỤ "HẠN CHẾ":
"- Việc ứng dụng công nghệ thông tin vào giảng dạy còn chưa đồng đều giữa các thành viên. Giải pháp: Tổ chức buổi chia sẻ kinh nghiệm sử dụng các công cụ số như Canva, Kahoot trong thiết kế bài giảng.
- Một số hoạt động trải nghiệm chưa thu hút được sự tham gia tích cực của toàn bộ học sinh. Giải pháp: Đa dạng hóa hình thức tổ chức, tăng cường yếu tố tương tác và trò chơi."

4. VÍ DỤ "Ý KIẾN ĐÓNG GÓP":
"- Thầy Trần Văn Tạ: Đề xuất tăng cường các hoạt động hướng nghiệp cho học sinh khối 12 trong giai đoạn chuẩn bị thi tốt nghiệp và xét tuyển đại học.
- Cô Nguyễn Thị Hương: Góp ý nên đa dạng hóa các hình thức đánh giá học sinh trong môn Hoạt động trải nghiệm để phù hợp với đặc thù môn học.
- Đa số thành viên nhất trí với đánh giá và kế hoạch. Tổ trưởng ghi nhận các ý kiến đóng góp và sẽ điều chỉnh kế hoạch phù hợp."

5. VÍ DỤ "KẾ HOẠCH THÁNG TỚI":
"- Tiếp tục thực hiện chương trình giảng dạy theo kế hoạch, đảm bảo tiến độ và chất lượng.
- Triển khai chủ đề tháng: [Tên chủ đề] cho học sinh các khối theo phân công.
- Hoàn thành hồ sơ đánh giá giữa kỳ trước ngày [ngày cụ thể].
- Tổ chức sinh hoạt chuyên môn theo cụm trường vào tuần [số tuần].
- Đẩy mạnh ứng dụng công nghệ thông tin, khuyến khích sử dụng Canva, Padlet trong thiết kế hoạt động."
`;

// ============================================================
// PHẦN 5: HÀM TẠO PROMPT ĐẦY ĐỦ - CẬP NHẬT TÍCH HỢP DATABASE
// ============================================================

export function getMeetingMinutesPrompt(
  month: string,
  session: string,
  keyContent: string,
  currentThemes: string,
  nextThemes: string,
  nextMonth: string
): string {
  const allMembers = getAllMembers();
  const shuffled = [...allMembers].sort(() => 0.5 - Math.random());
  const selectedMembers = shuffled.slice(0, Math.min(3, shuffled.length));

  const monthNumber = Number.parseInt(month) || 9;
  const nextMonthNumber = Number.parseInt(nextMonth) || (monthNumber % 12) + 1;

  let chuDeThangNayContext = "";
  let chuDeThangSauContext = "";

  // Lấy thông tin chủ đề tháng này cho cả 3 khối
  const grades: (10 | 11 | 12)[] = [10, 11, 12];

  chuDeThangNayContext = `
THÔNG TIN CHỦ ĐỀ THÁNG ${month} TỪ SGK (để đánh giá):
${grades
  .map((g) => {
    const chuDe = getChuDeTheoThang(g, monthNumber);
    if (chuDe) {
      return `- Khối ${g}: ${chuDe.ten} (${
        chuDe.ma
      }) - Mục tiêu: ${chuDe.muc_tieu.slice(0, 2).join("; ")}`;
    }
    return `- Khối ${g}: Theo kế hoạch`;
  })
  .join("\n")}
`;

  chuDeThangSauContext = `
THÔNG TIN CHỦ ĐỀ THÁNG ${nextMonth} TỪ SGK (để lập kế hoạch):
${grades
  .map((g) => {
    const chuDe = getChuDeTheoThang(g, nextMonthNumber);
    if (chuDe) {
      const hoatDongInfo = getChuDeTheoThangFromActivities(g, nextMonthNumber);
      const soHoatDong = hoatDongInfo
        ? getHoatDongTheoChuDe(g, hoatDongInfo.so_chu_de).length
        : 0;
      return `- Khối ${g}: ${chuDe.ten} (${soHoatDong} hoạt động) - Trọng tâm: ${chuDe.muc_tieu[0]}`;
    }
    return `- Khối ${g}: Theo kế hoạch`;
  })
  .join("\n")}
`;

  return `${MEETING_ROLE}

${MEETING_STRUCTURE}

${MEETING_FORMAT_RULES}

============================================================
DỮ LIỆU TỪ CƠ SỞ DỮ LIỆU CHƯƠNG TRÌNH (ĐÃ NGHIÊN CỨU KỸ)
============================================================

${chuDeThangNayContext}

${chuDeThangSauContext}

HƯỚNG DẪN SƯ PHẠM (Tham khảo khi viết đánh giá và kế hoạch):
- Triết lý: ${HUONG_DAN_SU_PHAM.triet_ly.muc_tieu_cot_loi}
- Cấu trúc thời lượng: ${
    HUONG_DAN_SU_PHAM.cau_truc_thoi_luong.tong_tiet_nam
  } tiết/năm
- Phương pháp khuyến khích: ${HUONG_DAN_SU_PHAM.phuong_phap.nguyen_tac
    .slice(0, 3)
    .join(", ")}

============================================================
THÔNG TIN CUỘC HỌP
============================================================

THÔNG TIN TỔ CHUYÊN MÔN:
- Tên tổ: ${DEPT_INFO.name}
- Trường: ${DEPT_INFO.school}
- Tổ trưởng (Chủ trì): ${DEPT_INFO.head}
- Thư ký: ${DEPT_INFO.secretary}
- Thành viên: ${DEPT_INFO.members.join(", ")}
- Sĩ số: ${DEPT_INFO.autoFill.si_so} | Vắng: ${DEPT_INFO.autoFill.vang}

THÔNG TIN CUỘC HỌP:
- Tháng: ${month}
- Lần họp: ${session}
- Nội dung trọng tâm: ${keyContent || "Sinh hoạt chuyên môn định kỳ"}

CHỦ ĐỀ THÁNG ${month} (Đánh giá hoạt động đã thực hiện):
${currentThemes}

CHỦ ĐỀ THÁNG ${nextMonth} (Kế hoạch triển khai):
${nextThemes}

THÀNH VIÊN ĐÓNG GÓP Ý KIẾN (chọn ngẫu nhiên):
${selectedMembers.map((m) => `- Thầy/Cô ${m}`).join("\n")}

${MEETING_EXAMPLES}

YÊU CẦU XUẤT RA - MỖI PHẦN PHẢI:
1. "noi_dung_chinh": 2-3 đoạn văn, tích hợp thông tin từ SGK về chủ đề đã thực hiện
2. "uu_diem": 3 gạch đầu dòng cụ thể, có dẫn chứng từ hoạt động thực tế
3. "han_che": 2 gạch đầu dòng, mỗi gạch có "Giải pháp:" kèm theo
4. "y_kien_dong_gop": 2-3 ý kiến + câu kết luận
5. "ke_hoach_thang_toi": 4-5 gạch đầu dòng, gắn với chủ đề tháng sau từ SGK

ĐỊNH DẠNG KẾT QUẢ - JSON thuần túy (không có markdown):
{
  "noi_dung_chinh": "- Đoạn 1: [Mô tả tổng quan hoạt động tháng qua, gắn với chủ đề SGK].\\n- Đoạn 2: [Chi tiết các hoạt động đã thực hiện].\\n- Đoạn 3: [Đánh giá chung và nhận định].",
  "uu_diem": "- [Ưu điểm 1 cụ thể, có dẫn chứng].\\n- [Ưu điểm 2 cụ thể].\\n- [Ưu điểm 3 cụ thể].",
  "han_che": "- [Hạn chế 1]: [Mô tả]. Giải pháp: [Cách khắc phục cụ thể].\\n- [Hạn chế 2]: [Mô tả]. Giải pháp: [Cách khắc phục cụ thể].",
  "y_kien_dong_gop": "- Thầy/Cô ${
    selectedMembers[0] || "A"
  }: [Ý kiến về tháng qua và đề xuất tháng tới].\\n- Thầy/Cô ${
    selectedMembers[1] || "B"
  }: [Ý kiến và đề xuất].\\n- Đa số thành viên nhất trí với đánh giá và kế hoạch. Tổ trưởng ghi nhận các ý kiến và thống nhất triển khai.",
  "ke_hoach_thang_toi": "- Tiếp tục [hoạt động cụ thể].\\n- Triển khai chủ đề tháng ${nextMonth}: [Nội dung từ SGK].\\n- Hoàn thành [nhiệm vụ] trước ngày [deadline].\\n- Phân công: [Tên] phụ trách [nhiệm vụ].\\n- Đẩy mạnh [hoạt động cải tiến]."
}`;
}
