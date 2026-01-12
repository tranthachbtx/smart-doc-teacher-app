/**
 * 📝 GỢI Ý PRE-FILL CHO GEMINI PRO
 * Giảm áp lực AI bằng cách cung cấp nội dung mẫu
 */

export const PRE_FILL_TEMPLATES = {
  shdc: {
    title: "Gợi ý nội dung sinh hoạt dưới cờ",
    content: `Dựa trên chủ đề [CHỦ ĐỀ BÀI HỌC], hãy xây dựng kịch bản sinh hoạt dưới cờ với các phần:
1. Nghi lễ chào cờ (5 phút)
2. Nội dung chính (15 phút) - [gợi ý hoạt động]
3. Tổng kết và hướng dẫn (5 phút)

Yêu cầu:
- Thời lượng: 25 phút
- Số lượng: Toàn trường
- Tính giáo dục: [gợi ý giá trị giáo dục]
- Sáng tạo: [gợi ý hoạt động sáng tạo]`
  },
  
  shl: {
    title: "Gợi ý nội dung sinh hoạt lớp",
    content: `Dựa trên chủ đề [CHỦ ĐỀ BÀI HỌC], xây dựng sinh hoạt lớp 15 phút:
1. Ổn định tổ chức (3 phút)
2. Sinh hoạt theo chủ đề (7 phút) - [gợi ý hoạt động]
3. Công tác học tập (3 phút)
4. Kế hoạch tuần tới (2 phút)

Yêu cầu:
- Tập trung vào nề nếp và học tập
- Gắn với nội dung bài học
- Có hoạt động tương tác`
  },
  
  ho_so_day_hoc: {
    title: "Gợi ý hồ sơ dạy học",
    content: `Xây dựng hồ sơ dạy học cho bài [TÊN BÀI] với:
1. Phiếu học tập số 1 - Khám phá (15 phút)
   - [gợi ý 3 câu hỏi]
2. Phiếu học tập số 2 - Luyện tập (20 phút)
   - [gợi ý 2 bài tập]
3. Bảng Rubric đánh giá
   - [gợi ý tiêu chí]
4. Tài liệu tham khảo số

Yêu cầu:
- CV 5512 compliant
- Có đánh giá năng lực số
- Có đạo đức giáo dục`
  },
  
  hoat_dong_van_dung: {
    title: "Gợi ý hoạt động vận dụng",
    content: `Thiết kế hoạt động vận dụng cho bài [TÊN BÀI]:
1. Dự án thực tế: [gợi ý tên dự án]
2. Phân nhóm và vai trò
3. Quy trình thực hiện
4. Sản phẩm cuối cùng
5. Tiêu chí đánh giá

Yêu cầu:
- Áp dụng kiến thức thực tế
- Phát triển kỹ năng mềm
- Có sản phẩm cụ thể`
  },
  
  global: {
    title: "Gợi ý Global AI Directives",
    content: `Yêu cầu AI tạo giáo án theo chuẩn CV 5512 với các mục sau:

1. MỤC TIÊU
   - Kiến thức: [chủ đề bài học]
   - Năng lực: tư duy phản biện, hợp tác, giao tiếp
   - Phẩm chất: trách nhiệm, lòng yêu nước

2. CHUẨN BỊ
   - GV: slide, video, phiếu học tập
   - HS: tài liệu, thiết bị học tập

3. TIẾN TRÌNH DẠY HỌC
   - Khởi động: tình huống, vấn đề
   - Khám phá: thảo luận nhóm, thực hành
   - Luyện tập: bài tập tăng dần
   - Vận dụng: dự án thực tế

4. TÍCH HỢP
   - Năng lực số: sử dụng công cụ
   - Giáo dục đạo đức: giá trị sống

5. HỒ SƠ
   - Phiếu học tập
   - Rubric đánh giá

Yêu cầu chất lượng:
- Độ dài: tối thiểu 12 trang A4
- Chi tiết: kịch bản GV, câu hỏi gợi mở
- Thực tế: tình huống dạy học`
  }
};

export function getPreFillPrompt(section: string, topic: string): string {
  const template = PRE_FILL_TEMPLATES[section as keyof typeof PRE_FILL_TEMPLATES];
  if (template) {
    return template.content.replace(/\[.*?\]/g, topic);
  }
  return "";
}
