# 🛰️ BÁO CÁO PHÂN TÍCH HỆ THỐNG PROMPT CHIẾN LƯỢC (v2.0)
## Quy trình Tối ưu hóa Thủ công (Manual Workflow Optimization)

Báo cáo này giải trình chi tiết cơ chế hoạt động của hệ thống khi người dùng nhấn nút **"Prompt"** trong quy trình **Consult** (Tư vấn chuyên sâu).

---

### 1. Phân tích: Tốc độ tức thì (Sub-millisecond Response)

Trong các phiên bản trước, khi nhấn "Prompt", hệ thống sẽ rơi vào trạng thái "chờ" (Loading) vì nó thực hiện một cuộc gọi AI ngầm (Neural Pass) để phân tích độ liên quan sư phạm. 

**Cải tiến hiện tại:**
- **Loại bỏ Network Latency:** Toàn bộ tiến trình gọi API Gemini hệ thống đã được gỡ bỏ khỏi bước này.
- **Xử lý tại chỗ (Local Processing):** Hệ thống chuyển sang sử dụng bộ lọc **REGEN_PATTERN** (Regex) để phân tách nội dung. Việc này diễn ra ngay trên trình duyệt/máy chủ nội bộ với tốc độ tính bằng mili giây.
- **Kết quả:** Bạn sẽ thấy Prompt xuất hiện hoặc được sao chép ngay lập tức mà không gặp bất kỳ lỗi `403`, `429` hay `ALL_KEYS_FAILED` nào từ phía hệ thống.

---

### 2. Phân tích: Bảo toàn Dữ liệu (100% Data Preservation)

Dù không gọi AI để "xử lý ngầm", hệ thống vẫn thực hiện việc trích lọc và đóng gói dữ liệu cực kỳ khôn ngoan dựa trên 2 nguồn chính:

#### A. Dữ liệu trích lọc từ PDF (FILE_CONTEXT)
Hệ thống sử dụng tầng `ProfessionalContentProcessor` để thực hiện "phẫu thuật" tệp PDF bạn đã tải lên:
- **Lọc theo hoạt động:** Nếu bạn nhấn Prompt của "Khởi động", hệ thống sẽ chỉ lấy những đoạn văn bản trong PDF có chứa từ khóa liên quan đến mục tiêu, trò chơi, và đặt vấn đề của phần mở đầu.
- **Làm sạch văn bản:** Loại bỏ các ký tự rác, định dạng thừa từ PDF để tạo ra một ngữ liệu sạch (Scientific Text) giúp Gemini Pro bên ngoài không bị nhiễu.
- **Giữ lại 100%:** Nội dung chính của bài học trong tệp cũ được đưa vào mục `## 🎯 DỮ LIỆU ĐÃ TỐI ƯU TỪ HỆ THỐNG`.

#### B. Chỉ dẫn từ Database chuyên môn (SMART_DATA_ADVICE)
Hệ thống truy vấn kho dữ liệu nội bộ (`SmartPromptService`) và đính kèm các "vũ khí" sư phạm sau vào Prompt:
1. **Đặc điểm tâm lý học sinh:** (Ví dụ: Khối 12 đang ở giai đoạn tư duy phản biện cao).
2. **Nhiệm vụ cốt lõi (Core Missions):** Các yêu cầu bắt buộc của chương trình GDPT 2018 cho chủ đề đó (Ví dụ: Với bài bảo vệ môi trường, nhiệm vụ là hình thành hành vi bảo vệ tự nhiên).
3. **Năng lực số (TT 02/2025):** Các mã năng lực số phù hợp (Ví dụ: NLS1.1 - Tìm kiếm dữ liệu).
4. **Công cụ đánh giá:** Gợi ý các loại Rubric, phiếu học tập dành riêng cho chủ đề đó.
5. **Lưu ý sư phạm MoET:** Các chỉ dẫn về phương pháp dạy học tích cực.

---

### 3. Quy trình thực thi khi nhấn nút "Prompt"

Khi bạn nhấn nút, hệ thống thực hiện tuần tự các bước sau (trong tích tắc):

1. **Bước 1 - Trích xuất:** Lấy nội dung PDF hiện có trong bộ nhớ (`expertGuidance`).
2. **Bước 2 - Lọc thông minh:** Chạy bộ lọc Pattern Matching để nhặt ra các đoạn văn bản khớp với mục tiêu của Module hiện tại (ví dụ: Module Khám phá).
3. **Bước 3 - Tra cứu Database:** Tìm kiếm dữ liệu chuyên môn cho Khối/Lớp và Tên bài tương ứng.
4. **Bước 4 - Đóng gói Prompt:** Lồng ghép toàn bộ dữ liệu trên vào một "Siêu Prompt" đã được cấu trúc sẵn theo chuẩn Công văn 5512.
5. **Bước 5 - Trả kết quả:** Sao chép thẳng vào Clipboard của bạn hoặc hiển thị thông báo.

### 4. Nội dung cụ thể được gửi sang Gemini Pro bên ngoài

Prompt cuối cùng bạn cầm trên tay sẽ bao gồm:
- **Vai trò:** Chuyên gia thiết kế giáo dục cao cấp.
- **Mục tiêu:** Yêu cầu Gemini Pro soạn bài theo triết lý "Giáo án La bàn".
- **Dữ liệu Input:**
    - Toàn bộ nội dung liên quan từ PDF cũ của bạn.
    - Toàn bộ chỉ dẫn sư phạm từ Database hệ thống.
- **Ràng buộc đầu ra:** Yêu cầu trả về **đúng định dạng JSON** để bạn có thể dán ngược lại vào hệ thống.

---
**Kết luận:** Hệ thống hiện tại đóng vai trò là một **"Người đóng gói dữ liệu tinh lọc"**. Nó giúp bạn không phải tự tay tóm tắt PDF hay tự tra cứu chương trình 2018, mà chuẩn bị sẵn một "bữa ăn đã sơ chế" để bạn mang sang "nấu" tại bếp của Gemini Pro.
