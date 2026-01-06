# 📘 HƯỚNG DẪN QUY TRÌNH BIÊN SOẠN GIÁO ÁN THÔNG MINH (SMART WORKFLOW)

## 📌 Giới thiệu
Ứng dụng cung cấp 2 phương thức biên soạn giáo án chất lượng cao (chuẩn MOET 5512), giúp giáo viên tiết kiệm tới 90% thời gian chuẩn bị:
1.  **🚀 Chế độ Tự động (AI Orchestrator):** Một chạm để tạo toàn bộ giáo án 50 trang.
2.  **🧠 Chế độ Chuyên gia (Copy-Paste):** Kiểm soát tuyệt đối nội dung bằng cách phối hợp với Gemini ngoài trình duyệt.

---

## 🚀 Quy trình 1: Tự động hoàn toàn (AI Orchestrator) - NEW
Đây là tính năng mạnh mẽ nhất của phiên bản **Architecture 6.5**.

1.  **Tải tài liệu:** Nhấn biểu tượng Upload (trong khung xanh) để tải sách giáo khoa PDF hoặc giáo án mẫu.
    *   *Ưu điểm:* Hệ thống tự động lọc rác (số trang, ký tự thừa) và bóc tách cấu trúc sư phạm chuẩn xác.
    *   *Tốc độ:* Nếu file đã từng tải lên, kết quả sẽ hiện ra **tức thì (Instant Cache)**.
2.  **Nhập Chủ đề:** Điền tên bài học vào ô "Chủ đề bài dạy".
3.  **Kích hoạt:** Nhấn nút màu xanh **"Tự động tạo toàn bộ (AI Orchestrator)"**.
4.  **Theo dõi:** Hệ thống sẽ tự động gọi AI cho từng bước (Khởi động -> Hình thành kiến thức -> Luyện tập -> Vận dụng). Mỗi bước sẽ tự lấy ngữ cảnh của bước trước để đảm bảo tính logic xuyên suốt.
5.  **Xuất bản:** Sau khi AI hoàn thành 4 bước, nhấn **"Tổng hợp & Xuất Word"**.

---

## 🧠 Quy trình 2: Chế độ Chuyên gia (Copy-Paste)
Dành cho giáo viên muốn tinh chỉnh từng câu chữ bằng cách dùng Gemini Pro trên web.

### Bước 1: Kích hoạt & Phân tích
1.  Gạt công tắc sang **"Chế độ Chuyên gia"**.
2.  Tải file PDF lên để AI bóc tách các "Hoạt động chính".
3.  Hệ thống sẽ gợi ý danh sách các Module (HĐ1, HĐ2...).

### Bước 2: Quy trình phối hợp (Lặp lại cho mỗi Module)
1.  Tại thẻ của Module, bấm nút **"Copy Prompt"**.
    *   *Prompt này đã được gắn ngữ cảnh (Context) của các phần trước đó.*
2.  Mở **Gemini Pro Chat** trên trình duyệt, **Dán Prompt** và chờ kết quả.
3.  Nhấn nút **Copy** khối mã JSON trên Gemini và **Dán (Paste)** vào ô nhập liệu của Module tương ứng trong App.
4.  Dấu tích xanh ✅ xuất hiện báo hiệu nội dung đã được nạp thành công.

---

## 🛠️ Các tính năng Tối ưu cao cấp

*   **⚡ Siêu tốc độ:** Nhờ cơ chế Gap Jitter, AI phản hồi nhanh gấp 10 lần so với phiên bản cũ.
*   **🧹 Sạch sẽ:** Tự động xóa bỏ "--- Page X ---" và các mảnh văn bản thừa từ PDF.
*   **💾 Bộ nhớ vĩnh cửu:** Kết quả bóc tách PDF được lưu lại. Thầy cô có thể tắt máy, mở lại vẫn thấy kết quả cũ mà không cần chờ đợi.
*   **🩺 Chống lỗi:** Timeout được nâng lên 60 giây và có cơ chế dự phòng (Regex Fallback) khi AI quá tải.

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
