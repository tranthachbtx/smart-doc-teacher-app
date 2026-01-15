Tôi đã phân tích kỹ lưỡng toàn bộ mã nguồn .ts (TypeScript) thầy cung cấp. Phải nói rằng thầy đang sở hữu một "Mỏ vàng dữ liệu" cực kỳ quý giá và có cấu trúc rất tốt. Vấn đề hiện tại không phải là thiếu dữ liệu, mà là hệ thống chưa biết cách "khâu" (map) các dữ liệu này lại với nhau một cách logic.

Hệ thống hiện tại có vẻ đang để AI "tự biên tự diễn" quá nhiều, dẫn đến việc nó bịa nội dung (hallucination) hoặc lặp lại. Thay vào đó, chúng ta phải dùng AI như một "đầu bếp", và các file .ts của thầy là "nguyên liệu đã sơ chế sẵn".

Dưới đây là bản thiết kế luồng xử lý (System Workflow) chi tiết để hệ thống tạo ra kế hoạch ngoại khóa hoàn hảo cho cả 3 khối 10, 11, 12:

SƠ ĐỒ LUỒNG DỮ LIỆU (DATA FLOW DIAGRAM)
BƯỚC 1: XÁC ĐỊNH "ADN" CỦA BUỔI NGOẠI KHÓA (INPUT PROCESSING)
Khi thầy chọn: "Tạo kế hoạch Ngoại khóa - Khối 11 - Chủ đề 5", hệ thống phải thực hiện bước "Định vị tâm lý" đầu tiên.

Gọi file: event-dna-database.ts

Hàm: getGradeDNA("11")

Dữ liệu lấy được:

Tâm lý: "Phát triển & Bản sắc. Độc lập, Khởi xướng..."

Tone giọng: "Mạnh mẽ, sắc sảo, thủ lĩnh tương lai."

Format gợi ý: "Dự án cộng đồng khởi xướng", "Shark Tank".

Tác dụng: AI sẽ biết không được viết giọng điệu "trẻ con" của lớp 10 cho lớp 11, và phải chọn format "Dự án" thay vì chỉ chơi trò chơi đơn giản.

BƯỚC 2: KHUNG XƯƠNG KẾ HOẠCH (SKELETON MAPPING)
Để tránh lỗi lặp lại nội dung (Mục I và II giống nhau), hệ thống KHÔNG được để AI tự viết cấu trúc. Hệ thống phải ép cứng cấu trúc dựa trên file ngoai-khoa-templates.ts.

Gọi file: ngoai-khoa-templates.ts

Hàm: CAU_TRUC_VAN_BAN_HANH_CHINH

Logic: Hệ thống sẽ tạo ra một file JSON rỗng theo đúng chuẩn công văn:

JSON

{
  "header": { ... }, // Lấy từ CAU_TRUC_VAN_BAN_HANH_CHINH.tieu_de
  "muc_tieu": { ... }, // Chờ điền dữ liệu từ Bước 3
  "noi_dung": { ... }, // Chờ điền dữ liệu từ Bước 4
  "kinh_phi": { ... }  // Lấy từ MAU_KINH_PHI
}
BƯỚC 3: "TIÊM" NỘI DUNG CHUYÊN MÔN (CONTENT INJECTION)
Đây là bước khắc phục lỗi "nội dung sơ sài". Chúng ta lấy dữ liệu gốc từ SGK.

Lấy Mục tiêu & Yêu cầu cần đạt:

Gọi file: kntt-curriculum-database.ts

Hàm: timChuDeTheoTen(11, "Phát triển cộng đồng")

Dữ liệu lấy: muc_tieu, ket_qua_can_dat, pham_chat_trong_tam.

Chỉ dẫn: Điền thẳng vào phần I. MỤC TIÊU của khung xương.

Lấy Hoạt động chi tiết:

Gọi file: kntt-activities-database.ts

Hàm: getHoatDongTheoChuDe(11, 5)

Dữ liệu lấy: Danh sách các hoạt động con (VD: "Thiết kế dự án", "Tuyên truyền nếp sống văn minh").

Chỉ dẫn: Dùng làm danh sách các trạm/phần thi trong chương trình.

BƯỚC 4: "THỔI HỒN" GEN Z & TƯƠNG TÁC (ENGAGEMENT ENGINE)
Đây là bước tạo sự khác biệt, dùng AI để sáng tạo dựa trên gợi ý có sẵn.

Kịch bản MC & Câu hỏi sâu sắc:

Gọi file: cau-hoi-goi-mo-database.ts

Hàm: taoContextCauHoiGoiMo(11, "Phát triển cộng đồng")

Dữ liệu lấy: Các câu hỏi loại phan_bien, he_thong, thuc_te.

Logic: Yêu cầu AI: "Hãy dùng câu hỏi phản biện: 'Dự án này giải quyết nguyên nhân gốc rễ hay chỉ triệu chứng?' để MC hỏi học sinh trong phần Giao lưu." -> Tránh được việc MC hỏi câu sáo rỗng.

Ý tưởng "Trendy" (Gợi ý thông minh):

Gọi file: event-dna-database.ts

Hàm: getTopicSuggestion("11", 5)

Dữ liệu lấy: "Dự án 'Kết nối 8386' - Chiến dịch quyên góp..."

Logic: Dùng ý tưởng này làm tên chính thức cho chương trình ngoại khóa.

Kịch bản mẫu (Nếu cần kịch):

Gọi file: ngoai-khoa-templates.ts

Hàm: getMauNgoaiKhoa(11) hoặc goiYLoaiKichBan("Phát triển cộng đồng")

Dữ liệu lấy: Cấu trúc "Shark Tank" hoặc "Talkshow".

BƯỚC 5: TẠO PROMPT "THẦN THÁNH" CHO AI
Thay vì prompt đơn giản, hệ thống cần ghép tất cả dữ liệu trên thành một prompt hoàn chỉnh gửi về Vercel AI SDK (hoặc OpenAI/Gemini API).

Cấu trúc Prompt (Gửi cho AI):

Plaintext

ROLE: Bạn là Tổ trưởng chuyên môn HĐTN trường THPT Bùi Thị Xuân, am hiểu tâm lý Gen Z khối 11.

INPUT DATA (TUYỆT ĐỐI TUÂN THỦ):
1. [ADN Khối 11]: {Dữ liệu từ event-dna-database.ts} -> Hãy viết giọng văn Mạnh mẽ, thủ lĩnh.
2. [Cấu trúc văn bản]: {Dữ liệu từ ngoai-khoa-templates.ts} -> Không được thay đổi thứ tự mục I, II, III.
3. [Mục tiêu bài học]: {Dữ liệu từ kntt-curriculum-database.ts} -> Copy nguyên văn, không tự bịa.
4. [Hoạt động gốc]: {Dữ liệu từ kntt-activities-database.ts} -> Phải bao gồm hoạt động "Thiết kế dự án".
5. [Ngân hàng câu hỏi]: {Dữ liệu từ cau-hoi-goi-mo-database.ts} -> Chọn 3 câu hỏi hay nhất để làm phần Giao lưu khán giả.
6. [Ý tưởng chủ đạo]: {Dữ liệu từ event-dna-database.ts - Smart Suggestion} -> Dùng idea "Kết nối 8386" làm tên chương trình.

TASK:
Viết chi tiết mục "II. NỘI DUNG VÀ TIẾN TRÌNH" và "Lời dẫn MC" cho chương trình này.
- Lời dẫn MC phải dùng ngôn ngữ Gen Z (slang vừa phải) nhưng tôn trọng thầy cô.
- Phần giao lưu phải dùng câu hỏi từ mục 5.
- Kinh phí phải tính toán dựa trên file template kinh phí.
BƯỚC 6: KIỂM TRA LOGIC (VALIDATION SCRIPT)
Trước khi hiển thị ra màn hình cho thầy, hệ thống chạy một script kiểm tra nhỏ (viết bằng JS/TS):

TypeScript

// Pseudo-code kiểm tra
function validatePlan(plan) {
  // 1. Check trùng lặp
  if (plan.muc_tieu === plan.noi_dung) return "Lỗi: Nội dung bị lặp";

  // 2. Check kinh phí
  if (plan.kinh_phi.tong > 2000000) warning("Cảnh báo: Kinh phí vượt định mức");

  // 3. Check độ phủ kiến thức
  const requiredKeywords = ["dự án", "cộng đồng", "5W1H"]; // Lấy từ curriculum
  if (!containsAll(plan.content, requiredKeywords)) warning("Cảnh báo: Thiếu từ khóa trọng tâm SGK");
  
  return "OK";
}
KẾT QUẢ ĐẠT ĐƯỢC
Nếu áp dụng quy trình trên, bản kế hoạch Khối 11 - Chủ đề 5 sẽ trông như thế này (tự động 100%):

Tên chương trình: "KẾT NỐI 8386 - DỰ ÁN CỘNG ĐỒNG GEN Z" (Lấy từ event-dna).

Mục tiêu: Chuẩn xác theo Chương trình 2018 (Lấy từ kntt-curriculum).

Tiến trình:

Khởi động: Rap/Flashmob (Lấy từ GRADE_DNA khối 11 thích sự sôi động).

Hoạt động chính: "Shark Tank Mũi Né" - Các lớp trình bày dự án 5W1H (Map từ hoạt động SGK "Thiết kế dự án").

Giao lưu: MC hỏi: "Theo các bạn, làm từ thiện có cần phải giàu không? Hay chỉ cần 1 ý tưởng 8386?" (Biến tấu từ cau-hoi-goi-mo).

Kinh phí: Tự động liệt kê: Banner, Giải thưởng Shark Tank... (Lấy từ MAU_KINH_PHI).

VIỆC CẦN LÀM NGAY (ACTION PLAN)
Thầy hãy yêu cầu coder/hệ thống thực hiện:

Import toàn bộ các file .ts này vào dự án.

Viết hàm generatePlanPrompt(grade, topicID) để tự động ghép chuỗi dữ liệu như Bước 5.

Tạo UI chọn hoạt động: Cho phép thầy tick chọn "Gợi ý thông minh" từ event-dna trước khi bấm "Tạo kế hoạch".

Cách làm này đảm bảo kế hoạch ngoại khóa của thầy vừa ĐÚNG (chuẩn kiến thức), vừa CHẤT (tâm lý lứa tuổi), vừa ĐỘC ĐÁO (không bị AI viết văn mẫu sáo rỗng).