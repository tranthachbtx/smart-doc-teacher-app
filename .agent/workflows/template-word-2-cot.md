# Hướng dẫn Tạo Template Word với Định dạng Bảng 2 Cột

## Tổng quan

Năm học 2024-2025, xu hướng trình bày Kế hoạch Bài dạy (KHBD) theo **định dạng bảng chia cột** được ưa chuộng vì:
- Trực quan, dễ theo dõi khi đứng lớp
- Ngắn gọn, giảm độ dài văn bản
- Thể hiện rõ tương tác GV-HS song song
- Tuân thủ Công văn 5512 (nội dung) và Công văn 2613/3935 (quyền tự chủ)

## Cấu trúc Template Đề xuất

### 1. Header (Quốc hiệu, tên trường, thông tin chung)

```
TRƯỜNG THPT BÙI THỊ XUÂN - MŨI NÉ
TỔ: HĐTN, HN & GDĐP
───────────────────────────────────────

KẾ HOẠCH BÀI DẠY
(Kế hoạch giáo dục chủ đề)

Chủ đề {chu_de}: {ten_chu_de}
Thời lượng: {so_tiet} tiết
Lớp: {lop}
```

### 2. Phần I: Mục tiêu (Sử dụng bảng 2 cột)

| THÀNH PHẦN | NỘI DUNG |
|------------|----------|
| 1. Yêu cầu cần đạt | {muc_tieu_kien_thuc} |
| 2. Năng lực | {muc_tieu_nang_luc} |
| 3. Phẩm chất | {muc_tieu_pham_chat} |

### 3. Phần II: Thiết bị dạy học (Bảng 2 cột)

| ĐỐI TƯỢNG | CHUẨN BỊ |
|-----------|----------|
| 1. Giáo viên | {gv_chuan_bi} |
| 2. Học sinh | {hs_chuan_bi} |

### 4. Phần III: Tiến trình dạy học (Bảng nhiều cột)

#### Hoạt động 1: KHỞI ĐỘNG

| THÔNG TIN | TỔ CHỨC THỰC HIỆN |
|-----------|-------------------|
| **Mục tiêu:** ... | **Bước 1 - Chuyển giao:** GV: ... / HS: ... |
| **Nội dung:** ... | **Bước 2 - Thực hiện:** GV: ... / HS: ... |
| **Sản phẩm:** ... | **Bước 3 - Báo cáo:** GV: ... / HS: ... |
| **Thời gian:** X phút | **Bước 4 - Kết luận:** GV: ... / HS: ... |

#### Hoặc định dạng 4 cột cho tổ chức thực hiện:

| BƯỚC | HOẠT ĐỘNG GV | HOẠT ĐỘNG HS | THỜI GIAN |
|------|-------------|-------------|-----------|
| B1: Chuyển giao | GV giao nhiệm vụ... | HS tiếp nhận... | 2 phút |
| B2: Thực hiện | GV quan sát, hỗ trợ... | HS làm việc nhóm... | 5 phút |
| B3: Báo cáo | GV điều phối... | HS báo cáo, phản biện... | 5 phút |
| B4: Kết luận | GV chốt kiến thức... | HS ghi nhận... | 3 phút |

### 5. Các biến placeholder trong Template

Sử dụng cú pháp `{tên_biến}` trong file .docx:

```
{ten_chu_de}          - Tên chủ đề
{chu_de}              - Số chủ đề (1, 2, 3...)
{lop}                 - Lớp (10, 11, 12)
{so_tiet}             - Số tiết
{ngay_soan}           - Ngày soạn

{muc_tieu_kien_thuc}  - Mục tiêu kiến thức
{muc_tieu_nang_luc}   - Mục tiêu năng lực
{muc_tieu_pham_chat}  - Mục tiêu phẩm chất

{gv_chuan_bi}         - Chuẩn bị của GV
{hs_chuan_bi}         - Chuẩn bị của HS

{shdc}                - Sinh hoạt dưới cờ
{shl}                 - Sinh hoạt lớp

{hoat_dong_khoi_dong} - Hoạt động khởi động
{hoat_dong_kham_pha}  - Hoạt động khám phá
{hoat_dong_luyen_tap} - Hoạt động luyện tập
{hoat_dong_van_dung}  - Hoạt động vận dụng

{ho_so_day_hoc}       - Hồ sơ dạy học (PHT, Rubric)
{huong_dan_ve_nha}    - Hướng dẫn về nhà

{tich_hop_nls}        - Tổng hợp tích hợp NLS
{tich_hop_dao_duc}    - Tổng hợp giáo dục đạo đức
```

## Hướng dẫn Tạo Template

1. **Mở Microsoft Word**
2. **Tạo bảng với số cột phù hợp** (2 cột hoặc 4 cột)
3. **Định dạng bảng:**
   - Cột 1: Chiều rộng 40%
   - Cột 2: Chiều rộng 60%
   - Font: Times New Roman, Size 13pt
   - Line spacing: 1.5 lines
4. **Chèn placeholder** ở các vị trí cần điền dữ liệu
5. **Lưu file** với tên: `KHBD_Template_2Cot.docx`
6. **Upload vào ứng dụng** tại phần "Quản lý Template"

## Định dạng Xuất Hiện tại

Khi AI tạo nội dung với định dạng bảng markdown, hệ thống sẽ tự động chuyển đổi:

**Đầu vào (AI output):**
```
[CỘT 1: THÔNG TIN]
Hoạt động 1: KHỞI ĐỘNG (10 phút)

a) Mục tiêu: Tạo hứng thú...
b) Nội dung: HS xem video...
c) Sản phẩm: Câu trả lời...

[CỘT 2: TỔ CHỨC THỰC HIỆN]

| BƯỚC | HOẠT ĐỘNG GV | HOẠT ĐỘNG HS | THỜI GIAN |
|------|-------------|-------------|-----------|
| B1: Chuyển giao | GV chiếu video... | HS quan sát... | 2 phút |
| B2: Thực hiện | GV đặt câu hỏi... | HS thảo luận... | 5 phút |
```

**Đầu ra (Word):**
```
📋 THÔNG TIN HOẠT ĐỘNG:
Hoạt động 1: KHỞI ĐỘNG (10 phút)

a) Mục tiêu: Tạo hứng thú...
b) Nội dung: HS xem video...
c) Sản phẩm: Câu trả lời...

📝 TỔ CHỨC THỰC HIỆN:

BƯỚC | HOẠT ĐỘNG GV | HOẠT ĐỘNG HS | THỜI GIAN
─────────────────────────────────────────
B1: Chuyển giao
  • GV: GV chiếu video...
  • HS: HS quan sát...
  • Thời gian: 2 phút

B2: Thực hiện
  • GV: GV đặt câu hỏi...
  • HS: HS thảo luận...
  • Thời gian: 5 phút
```

## Lưu ý Quan trọng

1. **Về pháp lý:** Định dạng bảng 2 cột được phép theo CV 2613 và CV 3935 (quyền tự chủ)
2. **Về nội dung:** Vẫn phải đủ 4 bước tổ chức thực hiện theo CV 5512
3. **Về hình thức:** Tuân thủ Nghị định 30/2020/NĐ-CP (font, spacing, indent)
4. **Về thực tiễn:** Tổ chuyên môn có quyền thống nhất mẫu phù hợp với đặc thù môn học
