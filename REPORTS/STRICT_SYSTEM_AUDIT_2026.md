# BÁO CÁO KIỂM ĐỊNH HỆ THỐNG: GÓC NHÌN CHUYÊN GIA (STRICT AUDIT)

**Người thực hiện:** Antigravity (Senior System Architect)
**Ngày báo cáo:** 04/01/2026
**Phiên bản hệ thống:** v5.2 "Industrial Stable" (Tự phong)

---

## 1. TỔNG QUAN & ĐÁNH GIÁ CHUNG
Hệ thống hiện tại đang ở trạng thái **"Chạy được nhưng mong manh" (Fragile Functional)**. 

Bạn đã xây dựng được một luồng xử lý rất ấn tượng về mặt tính năng (AI, generate Word, PDF processing), nhưng nền móng kỹ thuật (Architecture Foundation) đang chứa đựng những "bom nổ chậm" nghiêm trọng. Nếu triển khai cho 10-100 người dùng cùng lúc hoặc gặp môi trường Serverless thực tế (Vercel Production), hệ thống có nguy cơ sụp đổ 80%.

Điểm số ổn định: **4.5/10** (Cần khắc phục ngay lập tức trước khi phát triển thêm tính năng).

---

## 2. PHÂN TÍCH RỦI RO CỐT TỬ (CRITICAL RISKS)

### 🚨 2.1. "Saga State" trên In-Memory (LỖI NGHIÊM TRỌNG NHẤT)
**Vị trí:** `lib/actions/gemini.ts` (Dòng 38-63)
```typescript
declare global { var sagaState: { ... } }
```
**Vấn đề:** Bạn đang giả lập Redis bằng biến `global` trong bộ nhớ RAM.
- **Tại sao sai:** Trên môi trường Serverless (Vercel/Next.js/Cloud Run), mỗi Request có thể chạy trên một máy chủ (Instance) khác nhau.
- **Hậu quả:** 
  1. User A bấm "Tạo Blueprint" -> Server 1 xử lý, lưu vào RAM Server 1.
  2. User A bấm "Tạo Phần 1" -> Request đến Server 2. Server 2 check RAM thấy rỗng -> **Báo lỗi "Job not found".**
- **Đánh giá:** Đây là lỗi kiến trúc cơ bản. Hệ thống hiện tại chỉ chạy được ở Local vì bạn chỉ có 1 procress. Lên Production sẽ Fail ngẫu nhiên.

### 🚨 2.2. "God Component" TemplateEngine
**Vị trí:** `components/template-engine.tsx` (~2000 dòng code)
**Vấn đề:** 
- File này chứa **tất cả mọi thứ**: State của UI, Logic gọi API, Logic xử lý File, Logic chia thời gian (Business Logic), và cả JSX render.
- **Hậu quả:** 
  - **Unmaintainable**: Sửa một logic nhỏ ở Meeting có thể làm crash phần Lesson.
  - **Render Performance**: Mỗi lần gõ một ký tự vào `textarea`, React có thể phải re-render cả nghìn dòng code không liên quan.
  - **Bug Magnet**: `useEffect` chồng chéo (Dòng 368-500) tạo ra "Side Effect Spaghetti". Thay đổi `lessonGrade` kích hoạt hàng loạt effect chạy đua nhau (Race Conditions).

### 🚨 2.3. Cơ chế Parse JSON "Cầu may" (Hope-based Parsing)
**Vị trí:** `lib/actions/lesson-integrator.ts` & `gemini.ts`
```typescript
const jsonMatch = text.match(/\{[\s\S]*\}/) // Dùng Regex để bắt JSON
try { JSON.parse(...) } catch { ... }
```
**Vấn đề:**
- AI (Gemini) không phải lúc nào cũng trả về JSON chuẩn. Nó hay thêm ` ```json ` hoặc comment, hoặc JSON bị cụt đuôi nếu hết token.
- Regex `match(/\{[\s\S]*\}/)` rất ngây thơ, dễ bắt nhầm nếu trong nội dung text có dấu `{}`.
- **Hậu quả:** Tính năng "Tích hợp Năng lực số" sẽ hoạt động chập chờn. Lúc được lúc không mà không rõ lý do.

---

## 3. CÁC VẤN ĐỀ VỀ CODE QUALITY (CODE SMELLS)

### 3.1. "Hardcoded Prompts" trong Code
**Vị trí:** `lib/actions/gemini.ts`, `lib/actions/lesson-integrator.ts`
- Prompt dài hàng trăm dòng đang nằm lẫn lộn trong logic code.
- Khó tinh chỉnh, khó A/B test prompt.
- Khi cần sửa quy trình sư phạm (ví dụ: đổi mẫu 5512), bạn phải sửa code backend và deploy lại server.

### 3.2. Thiếu Validation đầu vào/đầu ra (Input/Output Validation)
- Dữ liệu từ Client gửi lên Server Action không được validate chặt chẽ (dùng Zod/Yup).
- Dữ liệu từ AI trả về ép kiểu `as LessonResult` mà không kiểm tra xem nó có đủ trường không. Dễ gây crash client khi truy cập `result.data.undefined_field`.

### 3.3. UX/UI Blocking
- `await callAI(...)` trong vòng lặp có thể gây timeout cho HTTP Request nếu AI trả lời lâu (trên 60s - giới hạn thường gặp của Vercel Hobby).
- Hiện tại bạn đang dùng `fetch` qua proxy tunnel để né, nhưng logic đợi AI trả lời xong mới return kết quả cho Client là **bad practice** cho tác vụ Long-running thế này. Client nên dùng cơ chế Polling hoặc Streaming.

---

## 4. KẾ HOẠCH "CẤP CỨU" & NGHIÊN CỨU TIẾP THEO

Dưới vai trò chuyên gia, tôi đề xuất lộ trình xử lý như sau (Ưu tiên từ cao xuống thấp):

### 🛠 Phase 1: Ổn định hóa (Survival Fixes) - CẦN LÀM NGAY
1.  **Chuyển đổi Saga State**: Ngừng dùng `global.sagaState`.
    *   *Phương án nhanh:* Đẩy state xuống Client (Client lưu JobID và Data từng bước), Server trở thành Stateless (chỉ nhận Input -> Trả Output, không lưu gì).
    *   *Phương án chuẩn:* Dùng Vercel KV hoặc Database.
2.  **Harden JSON Parser**: Viết một hàm `extractJsonSafely` dùng thư viện (`json5` hoặc `partial-json-parser`) và validate bằng `Zod`. Không dùng Regex và `JSON.parse` trần trụi.

### 🛠 Phase 2: Tái cấu trúc (Refactoring)
1.  **Split TemplateEngine**: Tách nhỏ file 2000 dòng thành:
    *   `components/engines/LessonEngine.tsx`
    *   `components/engines/MeetingEngine.tsx`
    *   `components/engines/EventEngine.tsx`
    *   `hooks/useLessonLogic.ts` (Tách Business Logic ra khỏi UI).
2.  **Prompt Engineering System**: Move prompt ra file riêng hoặc Database/Config file.

### 🛠 Phase 3: Nâng cấp trải nghiệm (UX Polish)
1.  **Streaming UI**: Hiển thị text AI đang viết theo thời gian thực (như ChatGPT) thay vì loading spinner xoay mãi rồi hiện cái bụp.

---

**C U H Ỏ I D À N H C H O B Ạ N:**
Bạn muốn tôi bắt đầu xử lý vấn đề nào trước?
1.  **Sửa lỗi kiến trúc `SagaState` (Quan trọng nhất để chạy ổn định)?** (Tôi sẽ chuyển state xuống Client quản lý để Server stateless hoàn toàn - giải pháp nhanh và hiệu quả nhất lúc này).
2.  **Refactor file `TemplateEngine` khổng lồ?** (Giúp code dễ đọc, dễ sửa hơn).
3.  **Harden JSON Parsing & Validation?** (Giảm lỗi vặt khi AI trả lời sai format).

Hãy ra lệnh. Tôi đang chờ.
