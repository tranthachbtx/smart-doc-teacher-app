# 📘 HƯỚNG DẪN QUY TRÌNH HỢP TÁC VỚI AI THỦ CÔNG (SMART MANUAL WORKFLOW)

## 📌 Giới thiệu
"Chế độ Chuyên gia" (Smart Manual Workflow) là giải pháp đột phá giúp Giáo viên tạo ra giáo án chất lượng cực cao (trên 60 trang) mà không bị giới hạn bởi bộ nhớ hay hạn ngạch của AI.

Quy trình hoạt động theo nguyên tắc **"Chia để trị" (Divide & Conquer)**:
1.  **AI Hệ thống:** Phân tích cấu trúc bài học.
2.  **Gemini Pro (Web):** Sáng tạo nội dung chi tiết cho từng phần.
3.  **App:** Đóng gói và xuất file chuẩn 5512.

---

## 🚀 Hướng dấn sử dụng (Từng bước)

### Bước 1: Kích hoạt Chế độ
1.  Mở ứng dụng Smart Doc Teacher.
2.  Chọn tab **"Bài dạy" (Lesson Plan)**.
3.  Gạt công tắc sang **"🧠 Chế độ Chuyên gia (Copy-Paste)"**.

### Bước 2: Phân tích & Chuẩn bị
1.  Nhập tên bài học và khối lớp (ví dụ: "Hàm số mũ - Lớp 11").
2.  **Quan trọng:** Bấm nút **"Phân tích tài liệu PDF"** (Biểu tượng Upload) trong khung màu xanh.
    *   Tải lên file Sách Giáo Khoa (PDF) hoặc giáo án cũ.
    *   Hệ thống AI sẽ đọc và trích xuất cấu trúc bài học.
3.  Hệ thống sẽ hiển thị danh sách 4 Module tiêu chuẩn (hoặc nhiều hơn tùy nội dung file):
    *   HĐ1: Khởi động.
    *   HĐ2: Hình thành kiến thức.
    *   HĐ3: Luyện tập.
    *   HĐ4: Vận dụng.

### Bước 3: Quy trình Copy-Paste (Lặp lại cho mỗi Module)
1.  Tại thẻ của Module (ví dụ: "Khởi động"), bấm nút **"Copy Prompt"**.
    *   *Prompt này đã được gắn Context của phần trước và yêu cầu định dạng JSON.*
2.  Mở **Gemini Pro Chat** (hoặc ChatGPT) trên trình duyệt.
3.  **Dán Prompt** và chờ kết quả.
    *   *Lưu ý: AI sẽ trả về một khối mã JSON (bắt đầu bằng `{` hoặc `[` ).*
4.  Nhấn nút **Copy** ở góc khối mã JSON trên Gemini.
5.  Quay lại App, **Dán (Paste)** vào ô nhập liệu của Module tương ứng.
6.  Nếu dán đúng định dạng JSON, thẻ sẽ hiện dấu tích xanh ✅.

### Bước 4: Xuất bản
1.  Sau khi hoàn thành cả 4 module (hoặc ít hơn tùy ý).
2.  Bấm nút **"Tổng hợp & Xuất Word"**.
3.  Hệ thống sẽ ghép nối và tải xuống file `.docx` chuẩn mẫu 5512.

---

## ⚠️ Quy chuẩn JSON (Dành cho Gemini/Power User)
Để đảm bảo cột Giáo viên và Học sinh không bị trộn lẫn, dữ liệu phải tuân thủ định dạng JSON sau:

```json
{
  "module_title": "Tên hoạt động",
  "steps": [
    {
      "step_type": "transfer", 
      "teacher_action": "- GV nêu câu hỏi: ...\n- GV chiếu slide...",
      "student_action": "- HS lắng nghe...\n- HS ghi chép..."
    },
    {
      "step_type": "perform",
      "teacher_action": "...",
      "student_action": "..."
    }
  ]
}
```

*Lưu ý: Các ký tự xuống dòng trong `teacher_action` nên dùng `\n`.*

---

## ❓ Câu hỏi thường gặp (FAQ)

**Q: Tôi có thể dán văn bản thường (không phải JSON) được không?**
A: Được, nhưng không khuyến khích.
*   Nếu dán text thường: Hệ thống sẽ cố gắng tìm thẻ `{{cot_1}}` và `{{cot_2}}` để tách cột. Nếu không có, toàn bộ nội dung sẽ vào cột GV.
*   Nếu dán JSON: Nội dung sẽ vào đúng 2 cột 100%.

**Q: Tại sao Prompt của Module 2, 3 lại có thêm phần "Context"?**
A: Hệ thống tự động lấy nội dung của Module trước để "nhắc" AI. Ví dụ: Module 1 làm về "Hàm số", thì Module 2 sẽ biết để không nói sang bài "Hình học".

**Q: File xuất ra có hỗ trợ công thức Toán ($LaTeX$) không?**
A: Hiện tại hỗ trợ text thuần. Word sẽ hiển thị công thức dưới dạng text (ví dụ: `$y = x^2$`). Bạn cần dùng MathType hoặc Equation Editor của Word để convert lại nếu cần đẹp hơn. Chúng tôi đang nghiên cứu tính năng Auto-Convert MathML.
