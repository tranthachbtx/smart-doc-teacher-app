// Database PPCT (Phân phối chương trình) cho HĐTN, HN - Sách KNTT
// Cấu trúc: 105 tiết/năm = 3 tiết/tuần x 35 tuần

export interface PPCTChuDe {
  chu_de_so: number
  ten: string
  tong_tiet: number
  shdc: number // Sinh hoạt dưới cờ
  hdgd: number // Hoạt động giáo dục theo chủ đề
  shl: number // Sinh hoạt lớp
  tuan_bat_dau?: number
  tuan_ket_thuc?: number
  ghi_chu?: string
}

export interface PPCTKhoi {
  khoi: number
  tong_tiet: number
  chu_de: PPCTChuDe[]
}

// ============================================
// PPCT KHỐI 10
// ============================================
export const PPCT_KHOI_10: PPCTKhoi = {
  khoi: 10,
  tong_tiet: 105,
  chu_de: [
    {
      chu_de_so: 1,
      ten: "Phát huy truyền thống nhà trường",
      tong_tiet: 9,
      shdc: 3,
      hdgd: 3,
      shl: 3,
      tuan_bat_dau: 1,
      tuan_ket_thuc: 3,
    },
    {
      chu_de_so: 2,
      ten: "Khám phá bản thân",
      tong_tiet: 12,
      shdc: 4,
      hdgd: 4,
      shl: 4,
      tuan_bat_dau: 4,
      tuan_ket_thuc: 7,
    },
    {
      chu_de_so: 3,
      ten: "Rèn luyện bản thân",
      tong_tiet: 12,
      shdc: 4,
      hdgd: 4,
      shl: 4,
      tuan_bat_dau: 8,
      tuan_ket_thuc: 11,
    },
    {
      chu_de_so: 4,
      ten: "Trách nhiệm với gia đình",
      tong_tiet: 12,
      shdc: 4,
      hdgd: 4,
      shl: 4,
      tuan_bat_dau: 12,
      tuan_ket_thuc: 15,
    },
    {
      chu_de_so: 5,
      ten: "Xây dựng cộng đồng",
      tong_tiet: 12,
      shdc: 4,
      hdgd: 4,
      shl: 4,
      tuan_bat_dau: 19,
      tuan_ket_thuc: 22,
      ghi_chu: "Tuần 16-18: Kiểm tra HKI",
    },
    {
      chu_de_so: 6,
      ten: "Bảo tồn cảnh quan thiên nhiên",
      tong_tiet: 9,
      shdc: 3,
      hdgd: 3,
      shl: 3,
      tuan_bat_dau: 23,
      tuan_ket_thuc: 25,
    },
    {
      chu_de_so: 7,
      ten: "Bảo vệ môi trường",
      tong_tiet: 12,
      shdc: 4,
      hdgd: 4,
      shl: 4,
      tuan_bat_dau: 26,
      tuan_ket_thuc: 29,
    },
    {
      chu_de_so: 8,
      ten: "Tìm hiểu nghề nghiệp",
      tong_tiet: 9,
      shdc: 3,
      hdgd: 3,
      shl: 3,
      tuan_bat_dau: 30,
      tuan_ket_thuc: 32,
    },
    {
      chu_de_so: 9,
      ten: "Lập kế hoạch nghề nghiệp cá nhân",
      tong_tiet: 6,
      shdc: 2,
      hdgd: 2,
      shl: 2,
      tuan_bat_dau: 33,
      tuan_ket_thuc: 34,
    },
    {
      chu_de_so: 10,
      ten: "Tổng kết năm học",
      tong_tiet: 3,
      shdc: 1,
      hdgd: 1,
      shl: 1,
      tuan_bat_dau: 35,
      tuan_ket_thuc: 35,
      ghi_chu: "Sẽ cập nhật sau",
    },
  ],
}

// ============================================
// PPCT KHỐI 11
// ============================================
export const PPCT_KHOI_11: PPCTKhoi = {
  khoi: 11,
  tong_tiet: 105,
  chu_de: [
    {
      chu_de_so: 1,
      ten: "Xây dựng và phát triển nhà trường",
      tong_tiet: 9,
      shdc: 3,
      hdgd: 3,
      shl: 3,
      tuan_bat_dau: 1,
      tuan_ket_thuc: 3,
      ghi_chu: "Đóng góp cho sự phát triển nhà trường, quản lý quan hệ trên mạng xã hội",
    },
    {
      chu_de_so: 2,
      ten: "Khám phá bản thân",
      tong_tiet: 12,
      shdc: 4,
      hdgd: 4,
      shl: 4,
      tuan_bat_dau: 4,
      tuan_ket_thuc: 7,
      ghi_chu: "Quản lý cảm xúc, nhận diện giá trị cốt lõi",
    },
    {
      chu_de_so: 3,
      ten: "Rèn luyện bản thân",
      tong_tiet: 12,
      shdc: 4,
      hdgd: 4,
      shl: 4,
      tuan_bat_dau: 8,
      tuan_ket_thuc: 11,
      ghi_chu: "Kỷ luật tự giác, tổ chức cuộc sống cá nhân khoa học",
    },
    {
      chu_de_so: 4,
      ten: "Trách nhiệm với gia đình",
      tong_tiet: 9,
      shdc: 3,
      hdgd: 3,
      shl: 3,
      tuan_bat_dau: 12,
      tuan_ket_thuc: 14,
      ghi_chu: "Vai trò trụ cột trong gia đình, kỹ năng chăm sóc người thân",
    },
    {
      chu_de_so: 5,
      ten: "Phát triển cộng đồng",
      tong_tiet: 12,
      shdc: 4,
      hdgd: 4,
      shl: 4,
      tuan_bat_dau: 15,
      tuan_ket_thuc: 18,
      ghi_chu: "Kết thúc HKI. Thiết kế và thực hiện dự án an sinh xã hội",
    },
    {
      chu_de_so: 6,
      ten: "Bảo tồn cảnh quan thiên nhiên",
      tong_tiet: 6,
      shdc: 2,
      hdgd: 2,
      shl: 2,
      tuan_bat_dau: 19,
      tuan_ket_thuc: 20,
      ghi_chu: "Dự án nhanh hoặc tham quan thực tế",
    },
    {
      chu_de_so: 7,
      ten: "Bảo vệ môi trường",
      tong_tiet: 12,
      shdc: 4,
      hdgd: 4,
      shl: 4,
      tuan_bat_dau: 21,
      tuan_ket_thuc: 24,
      ghi_chu: "Quản lý tài nguyên, lối sống xanh bền vững",
    },
    {
      chu_de_so: 8,
      ten: "Các nhóm nghề cơ bản và yêu cầu thị trường lao động",
      tong_tiet: 12,
      shdc: 4,
      hdgd: 4,
      shl: 4,
      tuan_bat_dau: 25,
      tuan_ket_thuc: 28,
      ghi_chu: "Phân tích các nhóm nghề, đối chiếu yêu cầu thị trường lao động",
    },
    {
      chu_de_so: 9,
      ten: "Rèn luyện phẩm chất, năng lực phù hợp với nhóm nghề lựa chọn",
      tong_tiet: 12,
      shdc: 4,
      hdgd: 4,
      shl: 4,
      tuan_bat_dau: 29,
      tuan_ket_thuc: 32,
      ghi_chu: "Cá nhân hóa quá trình rèn luyện theo nhóm ngành đã chọn",
    },
    {
      chu_de_so: 10,
      ten: "Xây dựng và thực hiện kế hoạch học tập theo định hướng nghề",
      tong_tiet: 9,
      shdc: 3,
      hdgd: 3,
      shl: 3,
      tuan_bat_dau: 33,
      tuan_ket_thuc: 35,
      ghi_chu: "Chuẩn bị cho kỳ thi tốt nghiệp và đại học",
    },
  ],
}

// ============================================
// PPCT KHỐI 12
// ============================================
export const PPCT_KHOI_12: PPCTKhoi = {
  khoi: 12,
  tong_tiet: 105,
  chu_de: [
    {
      chu_de_so: 1,
      ten: "Phát triển các mối quan hệ tốt đẹp với thầy cô và bạn bè",
      tong_tiet: 12,
      shdc: 4,
      hdgd: 4,
      shl: 4,
      tuan_bat_dau: 1,
      tuan_ket_thuc: 4,
      ghi_chu: "Khởi động năm học cuối cấp. Làm chủ, kiểm soát quan hệ trên mạng xã hội",
    },
    {
      chu_de_so: 2,
      ten: "Tôi trưởng thành",
      tong_tiet: 12,
      shdc: 4,
      hdgd: 4,
      shl: 4,
      tuan_bat_dau: 5,
      tuan_ket_thuc: 8,
      ghi_chu: "Nhận diện sự trưởng thành, rèn luyện ý chí và đam mê",
    },
    {
      chu_de_so: 3,
      ten: "Hoàn thiện bản thân",
      tong_tiet: 15,
      shdc: 5,
      hdgd: 5,
      shl: 5,
      tuan_bat_dau: 9,
      tuan_ket_thuc: 13,
      ghi_chu: "Trọng tâm HKI. Tuân thủ kỷ luật, pháp luật. Kế hoạch tài chính cá nhân",
    },
    {
      chu_de_so: 4,
      ten: "Trách nhiệm với gia đình",
      tong_tiet: 12,
      shdc: 4,
      hdgd: 4,
      shl: 4,
      tuan_bat_dau: 14,
      tuan_ket_thuc: 17,
      ghi_chu: "Giải quyết mâu thuẫn gia đình, quản lý kinh tế gia đình",
    },
    {
      chu_de_so: 5,
      ten: "Xây dựng cộng đồng",
      tong_tiet: 9,
      shdc: 3,
      hdgd: 3,
      shl: 3,
      tuan_bat_dau: 19,
      tuan_ket_thuc: 21,
      ghi_chu: "Bắt đầu HKII. Hoạt động xã hội hóa, xây dựng văn hóa cộng đồng",
    },
    {
      chu_de_so: 6,
      ten: "Chung tay gìn giữ, bảo tồn cảnh quan thiên nhiên",
      tong_tiet: 9,
      shdc: 3,
      hdgd: 3,
      shl: 3,
      tuan_bat_dau: 22,
      tuan_ket_thuc: 24,
      ghi_chu: "Đánh giá thực trạng bảo tồn tại địa phương, đề xuất giải pháp",
    },
    {
      chu_de_so: 7,
      ten: "Bảo vệ thế giới tự nhiên",
      tong_tiet: 9,
      shdc: 3,
      hdgd: 3,
      shl: 3,
      tuan_bat_dau: 25,
      tuan_ket_thuc: 27,
      ghi_chu: "Nhận diện hành vi bảo vệ/xâm hại động vật hoang dã",
    },
    {
      chu_de_so: 8,
      ten: "Nghề nghiệp và những yêu cầu với người lao động hiện đại",
      tong_tiet: 9,
      shdc: 3,
      hdgd: 3,
      shl: 3,
      tuan_bat_dau: 28,
      tuan_ket_thuc: 30,
      ghi_chu: "Xu hướng phát triển nghề nghiệp, đạo đức nghề nghiệp",
    },
    {
      chu_de_so: 9,
      ten: "Rèn luyện phẩm chất, năng lực phù hợp định hướng nghề nghiệp",
      tong_tiet: 9,
      shdc: 3,
      hdgd: 3,
      shl: 3,
      tuan_bat_dau: 31,
      tuan_ket_thuc: 33,
      ghi_chu: "Rèn luyện theo kế hoạch nghề nghiệp cá nhân",
    },
    {
      chu_de_so: 10,
      ten: "Quyết định lựa chọn nghề phù hợp",
      tong_tiet: 9,
      shdc: 3,
      hdgd: 3,
      shl: 3,
      tuan_bat_dau: 33,
      tuan_ket_thuc: 35,
      ghi_chu: "Hoàn thiện kế hoạch nghề nghiệp, chuẩn bị tốt nghiệp",
    },
  ],
}

// ============================================
// HÀM TRUY XUẤT PPCT
// ============================================

/**
 * Lấy PPCT theo khối lớp
 */
export function getPPCTTheoKhoi(khoi: number): PPCTKhoi | null {
  switch (khoi) {
    case 10:
      return PPCT_KHOI_10
    case 11:
      return PPCT_KHOI_11
    case 12:
      return PPCT_KHOI_12
    default:
      return null
  }
}

/**
 * Lấy thông tin PPCT của một chủ đề cụ thể
 */
export function getPPCTChuDe(khoi: number, chuDeSo: number): PPCTChuDe | null {
  const ppct = getPPCTTheoKhoi(khoi)
  if (!ppct) return null
  return ppct.chu_de.find((cd) => cd.chu_de_so === chuDeSo) || null
}

/**
 * Lấy số tiết của chủ đề
 */
export function getSoTietChuDe(khoi: number, chuDeSo: number): number {
  const chuDe = getPPCTChuDe(khoi, chuDeSo)
  return chuDe?.tong_tiet || 9 // Mặc định 9 tiết nếu không tìm thấy
}

/**
 * Lấy phân bổ tiết theo loại hình
 */
export function getPhanBoTiet(khoi: number, chuDeSo: number): { shdc: number; hdgd: number; shl: number } {
  const chuDe = getPPCTChuDe(khoi, chuDeSo)
  return {
    shdc: chuDe?.shdc || 3,
    hdgd: chuDe?.hdgd || 3,
    shl: chuDe?.shl || 3,
  }
}

/**
 * Lấy danh sách số tiết có thể cho dropdown (dựa trên PPCT thực tế)
 */
export function getDanhSachSoTiet(): number[] {
  return [3, 6, 9, 12, 15]
}

/**
 * Tạo context PPCT cho AI
 */
export function taoContextPPCT(khoi: number, chuDeSo: number): string {
  const chuDe = getPPCTChuDe(khoi, chuDeSo)
  if (!chuDe) {
    return `Không tìm thấy PPCT cho Khối ${khoi}, Chủ đề ${chuDeSo}. Sử dụng mặc định 9 tiết (3 SHDC + 3 HĐGD + 3 SHL).`
  }

  return `
## THÔNG TIN PPCT CHỦ ĐỀ ${chuDeSo} - KHỐI ${khoi}

- **Tên chủ đề**: ${chuDe.ten}
- **Tổng số tiết**: ${chuDe.tong_tiet} tiết
- **Phân bổ theo loại hình**:
  + Sinh hoạt dưới cờ (SHDC): ${chuDe.shdc} tiết
  + Hoạt động giáo dục theo chủ đề (HĐGD): ${chuDe.hdgd} tiết
  + Sinh hoạt lớp (SHL): ${chuDe.shl} tiết
- **Tuần thực hiện**: Tuần ${chuDe.tuan_bat_dau || "?"} - ${chuDe.tuan_ket_thuc || "?"}
${chuDe.ghi_chu ? `- **Ghi chú**: ${chuDe.ghi_chu}` : ""}

### HƯỚNG DẪN PHÂN BỔ THỜI GIAN:
1. Mỗi tuần có 3 tiết: 1 SHDC + 1 HĐGD + 1 SHL
2. SHDC (15-20 phút): Hoạt động toàn trường, do nhà trường tổ chức
3. HĐGD (45 phút): Hoạt động theo chủ đề, 4 bước (Khởi động, Khám phá, Luyện tập, Vận dụng)
4. SHL (45 phút): Sinh hoạt theo lớp, do GVCN chủ trì
`
}

/**
 * Tạo context PPCT đầy đủ cho cả khối
 */
export function taoContextPPCTDayDu(khoi: number): string {
  const ppct = getPPCTTheoKhoi(khoi)
  if (!ppct) return `Không tìm thấy PPCT cho Khối ${khoi}`

  let result = `## PPCT HĐTN, HN - KHỐI ${khoi} (Tổng ${ppct.tong_tiet} tiết/năm)\n\n`
  result += `| CĐ | Tên chủ đề | Tổng tiết | SHDC | HĐGD | SHL | Tuần |\n`
  result += `|:--:|-----------|:---------:|:----:|:----:|:---:|:----:|\n`

  for (const cd of ppct.chu_de) {
    result += `| ${cd.chu_de_so} | ${cd.ten} | ${cd.tong_tiet} | ${cd.shdc} | ${cd.hdgd} | ${cd.shl} | ${cd.tuan_bat_dau || "?"}-${cd.tuan_ket_thuc || "?"} |\n`
  }

  return result
}

// ============================================
// HƯỚNG DẪN AI SỬ DỤNG PPCT
// ============================================
export const HUONG_DAN_AI_SU_DUNG_PPCT = `
## HƯỚNG DẪN PHÂN BỔ THỜI GIAN KHI TẠO KHBD

### 1. QUY TẮC CƠ BẢN
- 1 tiết = 45 phút
- Mỗi tuần có 3 tiết: 1 SHDC (15-20 phút toàn trường) + 1 HĐGD (45 phút) + 1 SHL (45 phút)
- Đọc database PPCT để lấy số tiết chính xác của chủ đề

### 2. PHÂN BỔ THỜI GIAN TRONG 1 TIẾT HĐGD (45 PHÚT)

| Hoạt động | Thời gian | Tỷ lệ |
|-----------|-----------|-------|
| **Khởi động** | 5-7 phút | ~10-15% |
| **Khám phá** (Hình thành kiến thức mới) | 15-20 phút | ~35-45% |
| **Luyện tập** | 10-15 phút | ~25-30% |
| **Vận dụng** | 5-8 phút | ~15-20% |

### 3. PHÂN BỔ NHIỆM VỤ THEO SỐ TIẾT HĐGD

| Số tiết HĐGD | Số nhiệm vụ | Cách phân bổ |
|--------------|-------------|--------------|
| 2 tiết | 2-3 NV | Tiết 1: NV1 (đầy đủ 4 HĐ), Tiết 2: NV2-3 |
| 3 tiết | 3-4 NV | Mỗi tiết 1-2 nhiệm vụ, ưu tiên thời gian thảo luận |
| 4 tiết | 4-6 NV | Tiết 1-2: NV khám phá, Tiết 3-4: NV luyện tập & vận dụng |
| 5 tiết | 5-7 NV | Phân bổ đều, có tiết dành cho dự án/sản phẩm |

### 4. PHÂN BỔ THỜI GIAN TRONG 1 TIẾT SHL (45 PHÚT)

| Nội dung | Thời gian |
|----------|-----------|
| Ổn định tổ chức, điểm danh | 3-5 phút |
| Nhận xét tuần qua (kết quả học tập, nề nếp) | 5-7 phút |
| **Sinh hoạt theo chủ đề** | 25-30 phút |
| Kế hoạch tuần tới, dặn dò | 5-8 phút |

### 5. PHÂN BỔ THỜI GIAN CHO SHDC (15-20 PHÚT)

| Nội dung | Thời gian |
|----------|-----------|
| Chào cờ, nghi thức | 3-5 phút |
| Nhận xét tuần qua | 3-5 phút |
| **Hoạt động theo chủ đề** | 7-10 phút |
| Dặn dò, kết thúc | 2-3 phút |

### 6. QUY TẮC ƯU TIÊN
1. **Ưu tiên nhiệm vụ từ database**: Đọc danh sách nhiệm vụ có sẵn trong curriculum
2. **Phân bổ hợp lý theo thời gian**: 
   - Nhiệm vụ nhỏ (5-10 phút): Câu hỏi nhanh, hoạt động cá nhân
   - Nhiệm vụ vừa (10-15 phút): Thảo luận nhóm, làm phiếu học tập
   - Nhiệm vụ lớn (15-20 phút): Dự án nhóm, đóng vai, tranh biện
3. **Đảm bảo tính liên kết**: Các nhiệm vụ phải nối tiếp logic, không rời rạc
4. **Ghi rõ thời gian**: Mỗi bước trong "Tổ chức thực hiện" PHẢI ghi thời gian cụ thể

### 7. VÍ DỤ PHÂN BỔ CHO CHỦ ĐỀ 12 TIẾT (4 SHDC + 4 HĐGD + 4 SHL)

**Tuần 1:**
- SHDC 1: Giới thiệu chủ đề, video khởi động (15 phút)
- HĐGD 1: NV1 - Tìm hiểu khái niệm (45 phút: KĐ 7' + KP 20' + LT 12' + VD 6')
- SHL 1: Thảo luận cảm nhận ban đầu, chia nhóm (45 phút)

**Tuần 2:**
- SHDC 2: Hoạt động tương tác toàn trường (15 phút)
- HĐGD 2: NV2 - Phân tích tình huống (45 phút)
- SHL 2: Báo cáo tiến độ nhóm, góp ý (45 phút)

**Tuần 3:**
- SHDC 3: Trình diễn sản phẩm nhóm xuất sắc (15 phút)
- HĐGD 3: NV3 - Luyện tập kỹ năng (45 phút)
- SHL 3: Đánh giá chéo, phản hồi (45 phút)

**Tuần 4:**
- SHDC 4: Tổng kết, trao giải (15 phút)
- HĐGD 4: NV4 - Vận dụng thực tế (45 phút)
- SHL 4: Cam kết hành động, kế hoạch cá nhân (45 phút)
`

export function taoContextPhanBoThoiGian(khoi: number, chuDeSo: number): string {
  const chuDe = getPPCTChuDe(khoi, chuDeSo)
  if (!chuDe) {
    return `Sử dụng mặc định: 9 tiết (3 SHDC + 3 HĐGD + 3 SHL)`
  }

  const soTuan = Math.ceil(chuDe.tong_tiet / 3)

  let result = `
## PHÂN BỔ THỜI GIAN CHỦ ĐỀ ${chuDeSo}: "${chuDe.ten}"

### TỔNG QUAN:
- **Tổng số tiết**: ${chuDe.tong_tiet} tiết
- **Số tuần thực hiện**: ${soTuan} tuần (Tuần ${chuDe.tuan_bat_dau || "?"} - ${chuDe.tuan_ket_thuc || "?"})
- **Phân bổ**:
  + SHDC: ${chuDe.shdc} tiết × 15-20 phút = ${chuDe.shdc * 15}-${chuDe.shdc * 20} phút tổng
  + HĐGD: ${chuDe.hdgd} tiết × 45 phút = ${chuDe.hdgd * 45} phút tổng
  + SHL: ${chuDe.shl} tiết × 45 phút = ${chuDe.shl * 45} phút tổng

### YÊU CẦU THIẾT KẾ:
`

  // Hướng dẫn theo số tiết HĐGD
  if (chuDe.hdgd <= 2) {
    result += `
- Với ${chuDe.hdgd} tiết HĐGD: Thiết kế ${chuDe.hdgd}-${chuDe.hdgd + 1} nhiệm vụ chính
- Mỗi tiết tập trung 1 nhiệm vụ với đầy đủ 4 hoạt động (Khởi động, Khám phá, Luyện tập, Vận dụng)
- Ưu tiên hoạt động trải nghiệm ngắn gọn, súc tích`
  } else if (chuDe.hdgd <= 4) {
    result += `
- Với ${chuDe.hdgd} tiết HĐGD: Thiết kế ${chuDe.hdgd}-${chuDe.hdgd + 2} nhiệm vụ
- Tiết 1-2: Nhiệm vụ khám phá kiến thức mới
- Tiết 3-${chuDe.hdgd}: Nhiệm vụ luyện tập và vận dụng
- Có thể kết hợp 2 nhiệm vụ nhỏ trong 1 tiết`
  } else {
    result += `
- Với ${chuDe.hdgd} tiết HĐGD: Thiết kế ${chuDe.hdgd}-${chuDe.hdgd + 3} nhiệm vụ
- Tiết 1-2: Nhiệm vụ khởi động và khám phá cơ bản
- Tiết 3-${Math.floor(chuDe.hdgd * 0.7)}: Nhiệm vụ khám phá nâng cao và luyện tập
- Tiết ${Math.floor(chuDe.hdgd * 0.7) + 1}-${chuDe.hdgd}: Dự án/sản phẩm và vận dụng thực tế
- Dành ít nhất 1 tiết cho hoạt động dự án nhóm`
  }

  result += `

### BẢNG PHÂN BỔ THEO TUẦN:
| Tuần | SHDC (15-20') | HĐGD (45') | SHL (45') |
|:----:|---------------|------------|-----------|
`

  for (let i = 1; i <= soTuan; i++) {
    const shdcTuan = i <= chuDe.shdc ? `SHDC ${i}` : "-"
    const hdgdTuan = i <= chuDe.hdgd ? `HĐGD ${i}` : "-"
    const shlTuan = i <= chuDe.shl ? `SHL ${i}` : "-"
    result += `| ${i} | ${shdcTuan} | ${hdgdTuan} | ${shlTuan} |\n`
  }

  return result
}
