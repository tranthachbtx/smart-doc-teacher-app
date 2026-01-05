
# 📚 BÁO CÁO NÂNG CẤP HỆ THỐNG THÔNG MINH (HYBRID INTELLIGENCE)

Hệ thống đã được nâng cấp toàn diện dựa trên 8 yêu cầu nghiên cứu chuyên sâu và mô hình "Human-in-the-loop".

## 1. PHÁP LÝ & DỮ LIỆU (Circular 02/2025)
- **Tệp dữ liệu mới**: `lib/data/digital-competency-2025.ts` đã cập nhật đầy đủ 6 miền năng lực và 24 năng lực thành phần theo Thông tư 02/2025/TT-BGDĐT.
- **Tích hợp AI**: Bổ sung Miền 6 (Ứng dụng Trí tuệ nhân tạo) vào khung năng lực số để giáo viên lồng ghép vào hoạt động dạy học lớp 10-12.

## 2. ENGINE TRỘN NỘI DUNG (Auto-Merge Engine)
- **Công nghệ**: Triển khai `KHBHMerger.ts` - một engine chuyên trách việc "phẫu thuật" và trộn các "Chỉ thị chiến lược" từ Gemini Pro vào giáo án hiện tại.
- **Tính năng**: 
  - Tự động phát hiện các block nội dung (NLS, Hoạt động, Mục tiêu).
  - Trộn thông minh (không ghi đè hoàn toàn, chỉ bổ sung và "nâng tầm").
  - Gắn badge **"Expert Integrated"** để xác nhận bản thảo đã được tối ưu bởi trí tuệ chuyên gia.

## 3. COMPLIANCE AUDITOR (Chain-of-Thought)
- **Prompt Engineering**: Áp dụng kỹ thuật Chain-of-Thought (CoT) vào `compliance-checker.ts`.
- **Logic mới**: AI giờ đây thực hiện 4 bước quét logic trước khi đưa ra điểm số, giúp giảm thiểu sai sót và tăng tính thuyết phục cho báo cáo kiểm định.

## 4. GIẢI PHÁP XML CHO GIÁO ÁN LỚN (OpenXML Intervention)
- **Vấn đề**: Các giáo án dài 50 trang thường bị lỗi vỡ bảng hoặc nhảy trang khi xuất tệp .docx.
- **Giải pháp**: can thiệp trực tiếp vào cấu trúc XML của tệp Document:
  - Inject `cantSplit` vào toàn bộ hàng bảng (`w:trPr`) để ngăn chặn việc ngắt hàng giữa chừng.
  - Cấu hình `trHeight` với quy tắc `atLeast` (300 twips) để đảm bảo hàng không bị bẹp.
  - Tối ưu hóa `tblOverlap` và `tblW` để bảng tự thích ứng với các trang dài.

## 5. PROMPT PHẪU THUẬT (Surgical Prompt)
- **Vị trí**: `SURGICAL_UPGRADE_PROMPT` trong `lib/prompts/ai-prompts.ts`.
- **Đặc tính**: Thiết kế với các hướng dẫn nghiêm ngặt để trích xuất 100% "Trí tuệ cốt lõi" (ví dụ, tình huống hay) từ file cũ, đảm bảo không bỏ sót di sản sư phạm của giáo viên.

## 6. SMART EXPORT ENGINE (Template Injection)
- **Công nghệ**: Thay thế hoàn toàn code sinh Word cũ bằng `ExportService` mới: **Direct XML Template Injection**.
- **Tính năng**:
  - Hỗ trợ xuất file lên tới 100 trang.
  - Tách cột GV/HS triệt để (không bao giờ bị trộn nội dung).
  - Giữ nguyên 100% định dạng file mẫu của nhà trường.
  - Tự động parse JSON arrays thành bảng 2 cột.

## 7. MANUAL WORKFLOW HUB (Smart Copy-Paste)
- **Giao diện**: Tab "Chế độ Chuyên gia".
- **Tính năng**:
  - Quy trình "Module-based": Chia nhỏ giáo án thành 4 phần để xử lý từng phần.
  - **Context-Aware Prompt**: Tự động sinh prompt kèm bối cảnh module trước.
  - **Strict JSON Protocol**: Ép buộc AI trả về JSON để đảm bảo cấu trúc dữ liệu chính xác tuyệt đối.

## 🚀 HƯỚNG DẪN SỬ DỤNG LỒNG GHÉP:
1. **Upload**: Nạp giáo án cũ vào hệ thống.
2. **Consult**: Nhấn "Copy Prompt" -> Chạy Gemini Pro bên ngoài.
3. **Inject**: Dán phân tích của Gemini Pro vào "Expert Brain Center".
4. **Surgical Apply**: Nhấn **"PHẪU THUẬT & TRỘN NỘI DUNG"**.
5. **Verify**: Kiểm tra báo cáo Compliance với điểm số 2025.
6. **Export**: Tải xuống tệp Word "hoàn mỹ" không lỗi định dạng.
