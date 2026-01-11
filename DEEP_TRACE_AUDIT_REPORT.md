# DEEP TRACE AUDIT REPORT: Lesson Generation Pipeline v35.5
**Date:** 2026-01-11
**Status:** PROCESSED & HARDENED

## 1. TRACE INPUT (Đầu vào)
### [BREAKING POINT 1.1]: Truncation at Source & Topic Overwrite
- **Phát hiện**: 
  1. Truncation: Chỉ trích xuất 15k ký tự (Đã sửa -> 100k).
  2. **Topic Overwrite**: Hệ thống tự động ghi đè "Chủ đề bài học" bằng tên file PDF hoặc kết quả nhận diện từ AI, ngay cả khi người dùng đã chọn chủ đề khác trong Database.
- **Root Cause**: Giả định sai rằng file PDF luôn là nguồn sự thật duy nhất. 
- **Giải pháp**: Triển khai **"Topic Guardian"**. Nếu AI nhận diện chủ đề khác với UI, hệ thống sẽ cảnh báo (Conflict Alert) và giữ nguyên lựa chọn của người dùng để tra cứu Database chuẩn.

### [BREAKING POINT 1.2]: Empty/Corrupted Payload
- **Phát hiện**: Khi người dùng bấm nút Generation mà không upload file, hoặc file PDF scan không có chữ (OCR failed).
- **Fail Fast Strategy**: Đã thêm log `[ManualHub] 1. INPUT TRACE`. Nếu `fullText.length < 500`, hệ thống sẽ cảnh báo "Empty Context" ngay tại Client thay vì gửi payload rỗng lên Server.

---

## 2. TRACE FLOW (Luồng đi)
### [BREAKING POINT 2.1]: Character Poisoning (Poison Pill)
- **Luồng**: Client (Base64) -> API (callAI) -> Gemini.
- **Phát hiện**: Các ký tự đặc biệt trong giáo án cũ như `"""`, `\r`, hoặc các mã điều khiển Windows làm hỏng cấu trúc Prompt gửi sang Gemini (phá vỡ HEREDOC blocks).
- **Giải pháp**: Đã triển khai bộ lọc **Sanitization** (sanitizeFullText) tại `ManualProcessingHub.tsx` trước khi đóng gói Prompt.

### [BREAKING POINT 2.2]: Silent Timeout
- **Luồng**: Server action `generateAIContent` gọi `callAI`.
- **Phát hiện**: AI mất ~30s để viết "Max Content". Next.js Server Actions có timeout mặc định (thường 15-30s). Nếu timeout, API trả về `NULL` hoặc `undefined`.
- **Logic Nghiệp vụ**: Hệ thống hiện tại đã nâng `AbortSignal.timeout` lên 25s cho từng provider và sử dụng chiến lược **Provider Rotation** (Gemini Key 1 -> Key 2 -> OpenAI ...).

---

## 3. VERIFY LOGIC (Kiểm tra Logic)
### [BREAKING POINT 3.1]: Context Mismatch (The Deadly Conflict) & Fuzzy Matching
- **Logic Sai**: 
  1. AI hòa trộn bài "Môi trường" vào bài "Tình bạn".
  2. `timChuDeTheoTen` sử dụng thuật toán fuzzy quá lỏng lẻo, khiến các từ khóa phổ thông (Môi trường, Bản thân) bị gán nhầm vào các chủ đề không liên quan.
- **Giải pháp Logic**: 
  1. Thiết lập **"Tường lửa dữ liệu" (Context Firewall)**.
  2. Nâng cấp **Identification Hardening**: Ưu tiên Exact Match, lọc bỏ "Noise words" (Bài, Tiết, Hoạt động) và chỉ cho phép Fuzzy Match nếu độ dài chuỗi đủ lớn (> 4 ký tự).

### [BREAKING POINT 3.2]: "Silent Failure" on Paste
- **Phát hiện**: Dán kết quả AI bị lỗi JSON. Store không cập nhật nhưng UI không báo lỗi.
- **Fail Loud Strategy**: Đã sửa `handleSmartPaste`. Mọi lỗi Parsing hiện tại đều bắn **Toast Alert** màu đỏ kèm log `BREAKING POINT: JSON Parse Error`.

---

## 4. BÁO CÁO KẾT LUẬN
Hệ thống đã chuyển từ trạng thái "Cố gắng chạy thoát lỗi" sang trạng thái **"Bám sát luồng và Báo động sớm"**. 

**Verify Points:**
- [x] Input Logged: `console.log` tại Client Hub.
- [x] Flow Protected: Sanitization & Context Firewall.
- [x] Logic Integrity: "Fail Fast, Fail Loud" active.

**Khuyến nghị**: Luôn theo dõi Console để xem `[ManualHub] TRACE` nhằm xác định chính xác giai đoạn gãy dữ liệu nếu có sự cố xảy ra.
