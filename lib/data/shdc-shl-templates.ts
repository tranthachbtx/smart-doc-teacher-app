/**
 * DATABASE MẪU SINH HOẠT DƯỚI CỜ (SHDC) VÀ SINH HOẠT LỚP (SHL)
 */

// ========================================
// INTERFACE DEFINITIONS
// ========================================

export interface MauSHDC {
  tuan: number
  ten_hoat_dong: string
  hinh_thuc: "giao_luu" | "dien_dan" | "tranh_bien" | "tro_choi" | "van_nghe" | "thi_tim_hieu"
  muc_tieu: string[]
  noi_dung_chinh: string
  kich_ban: {
    mo_dau: string
    phan_chinh: string[]
    ket_thuc: string
  }
  cau_hoi_tuong_tac: string[]
  san_pham_du_kien: string
  thoi_luong: string
}

export interface MauSHL {
  tuan: number
  chu_de: string
  muc_tieu: string[]
  noi_dung: {
    on_dinh_to_chuc: string
    sinh_hoat_theo_chu_de: string[]
    ke_hoach_tuan_toi: string
  }
  hoat_dong_goi_y: string[]
  san_pham: string
}

export interface TieuChiDanhGiaCuoiChuDe {
  chu_de: string
  khoi: number
  tieu_chi: {
    ten: string
    mo_ta: string
    muc_do: {
      tot: string
      dat: string
      chua_dat: string
    }
  }[]
}

export interface MauBangBieuThucHanh {
  ten: string
  chu_de_phu_hop: string[]
  muc_dich: string
  cot: string[]
  huong_dan_su_dung: string
  vi_du_noi_dung: Record<string, string>[]
}

export interface TroChoiKhoiDong {
  ten: string
  loai_chu_de: string[]
  thoi_luong: string
  so_nguoi: string
  muc_tieu: string
  luat_choi: string
  chuan_bi: string
  vi_du_cau_hoi?: string[]
  bai_hat_goi_y?: string[]
}

// ========================================
// MẪU SHDC THEO CHỦ ĐỀ
// ========================================

export const MAU_SHDC_THEO_CHU_DE: Record<string, MauSHDC[]> = {
  "10.3": [
    {
      tuan: 1,
      ten_hoat_dong: "Giao lưu 'Tuổi 16'",
      hinh_thuc: "giao_luu",
      muc_tieu: ["HS nhận ra khó khăn khi bước vào lớp 10", "HS chia sẻ cảm xúc và kinh nghiệm vượt khó"],
      noi_dung_chinh: "Đối thoại giữa HS lớp 10 và anh chị lớp 11, 12 về những khó khăn và cách vượt qua",
      kich_ban: {
        mo_dau: "MC giới thiệu chủ đề, mời đại diện các khối lên sân khấu",
        phan_chinh: ["Vòng 1: HS lớp 10 chia sẻ khó khăn", "Vòng 2: Anh chị lớp 11, 12 chia sẻ kinh nghiệm"],
        ket_thuc: "TPT tổng kết, trao quà lưu niệm",
      },
      cau_hoi_tuong_tac: ["Điều gì khiến bạn lo lắng nhất khi bước vào lớp 10?"],
      san_pham_du_kien: "Bức thư cam kết của HS lớp 10",
      thoi_luong: "45 phút",
    },
  ],
}

// ========================================
// MẪU SHL THEO CHỦ ĐỀ
// ========================================

export const MAU_SHL_THEO_CHU_DE: Record<string, MauSHL[]> = {
  "10.3": [
    {
      tuan: 1,
      chu_de: "Nhận diện điểm mạnh, điểm yếu bản thân",
      muc_tieu: ["HS tự nhận diện điểm mạnh, điểm yếu của mình"],
      noi_dung: {
        on_dinh_to_chuc: "Điểm danh, nhận xét tuần qua",
        sinh_hoat_theo_chu_de: ["Hoạt động cá nhân: Viết 3 điểm mạnh, 3 điểm yếu của bản thân"],
        ke_hoach_tuan_toi: "Thực hiện 1 hành động khắc phục điểm yếu",
      },
      hoat_dong_goi_y: ["Viết nhật ký tự đánh giá", "Lập bảng SWOT cá nhân"],
      san_pham: "Bảng tự đánh giá cá nhân",
    },
  ],
}

// ========================================
// TIÊU CHÍ ĐÁNH GIÁ CUỐI CHỦ ĐỀ
// ========================================

export const TIEU_CHI_DANH_GIA_CUOI_CHU_DE: TieuChiDanhGiaCuoiChuDe[] = [
  {
    chu_de: "Rèn luyện bản thân",
    khoi: 10,
    tieu_chi: [
      {
        ten: "Nhận diện bản thân",
        mo_ta: "Khả năng nhận ra điểm mạnh, điểm yếu của bản thân",
        muc_do: {
          tot: "Nhận diện chính xác 3+ điểm mạnh, 3+ điểm yếu với minh chứng cụ thể",
          dat: "Nhận diện được 2-3 điểm mạnh, điểm yếu",
          chua_dat: "Chưa nhận diện được hoặc nhận diện sai",
        },
      },
    ],
  },
]

// ========================================
// MẪU BẢNG BIỂU THỰC HÀNH
// ========================================

export const MAU_BANG_BIEU_THUC_HANH: MauBangBieuThucHanh[] = [
  {
    ten: "Bảng kế hoạch tài chính cá nhân",
    chu_de_phu_hop: ["Rèn luyện bản thân", "Quản lý tài chính"],
    muc_dich: "Giúp HS lập kế hoạch chi tiêu và tiết kiệm",
    cot: ["Khoản mục", "Dự kiến (VNĐ)", "Thực tế (VNĐ)", "Chênh lệch", "Ghi chú"],
    huong_dan_su_dung: "HS điền dự kiến đầu tháng, cập nhật thực tế hàng tuần",
    vi_du_noi_dung: [
      { "Khoản mục": "THU NHẬP", "Dự kiến (VNĐ)": "", "Thực tế (VNĐ)": "", "Chênh lệch": "", "Ghi chú": "" },
    ],
  },
  {
    ten: "Bảng phân tích SWOT cá nhân",
    chu_de_phu_hop: ["Khám phá bản thân", "Rèn luyện bản thân"],
    muc_dich: "Giúp HS tự phân tích điểm mạnh, điểm yếu, cơ hội, thách thức",
    cot: ["Điểm mạnh (S)", "Điểm yếu (W)", "Cơ hội (O)", "Thách thức (T)"],
    huong_dan_su_dung: "HS tự phân tích, có thể nhờ bạn bè góp ý bổ sung",
    vi_du_noi_dung: [
      {
        "Điểm mạnh (S)": "Chăm chỉ",
        "Điểm yếu (W)": "Hay trì hoãn",
        "Cơ hội (O)": "Nhiều khóa học online",
        "Thách thức (T)": "Áp lực thi cử",
      },
    ],
  },
]

export const MAU_BANG_BIEU_BO_SUNG: MauBangBieuThucHanh[] = []
export const MAU_BANG_BIEU_BO_SUNG_2: MauBangBieuThucHanh[] = []

// ========================================
// KỸ THUẬT DẠY HỌC
// ========================================

export const KY_THUAT_DAY_HOC_NANG_CAO = {
  ky_thuat_nhom: [
    {
      ten: "Khăn trải bàn",
      mo_ta: "4 HS ngồi 4 góc bàn, mỗi người viết ý kiến riêng vào góc của mình, sau đó tổng hợp vào ô giữa",
      buoc_thuc_hien: ["Chia nhóm 4 người", "Mỗi HS viết ý kiến cá nhân", "Thảo luận nhóm, chọn ý kiến chung"],
      phu_hop_cho: ["Hoạt động khám phá", "Brainstorm ý tưởng"],
      luu_y: "Đảm bảo mỗi HS đều có cơ hội viết ý kiến riêng",
    },
  ],
  ky_thuat_ca_nhan: [
    {
      ten: "Nhật ký phản tư",
      mo_ta: "HS viết nhật ký về những gì đã học, cảm nhận và dự định áp dụng",
      cau_hoi_goi_y: ["Hôm nay em đã học được điều gì mới?", "Em sẽ áp dụng như thế nào?"],
      phu_hop_cho: ["Kết thúc bài học", "Sinh hoạt lớp"],
    },
  ],
}

// ========================================
// GỢI Ý BÀI HÁT VIDEO
// ========================================

export const GOI_Y_BAI_HAT_VIDEO = {
  loai_chu_de: {
    truong_thanh_ban_than: {
      mo_ta: "Chủ đề về trưởng thành, khám phá bản thân",
      bai_hat_goi_y: ["Follow your dream - Thanh Duy", "Con đường tôi - Trọng Hiếu"],
      su_dung_cho: ["Khởi động", "Kết thúc hoạt động"],
    },
    gia_dinh_yeu_thuong: {
      mo_ta: "Chủ đề về gia đình",
      bai_hat_goi_y: ["Đi về nhà - Đen Vâu", "Chưa bao giờ mẹ kể - MIN"],
      su_dung_cho: ["Khởi động chủ đề gia đình"],
    },
    thay_co_ban_be: {
      mo_ta: "Chủ đề về mối quan hệ với thầy cô, bạn bè",
      bai_hat_goi_y: ["Tạm biệt nhé - Lynk Lee", "Nhớ ơn thầy cô - Cao Minh"],
      su_dung_cho: ["Tri ân thầy cô", "Tình bạn"],
    },
    dam_me_nghe_nghiep: {
      mo_ta: "Chủ đề về đam mê, định hướng nghề nghiệp",
      bai_hat_goi_y: ["Nơi ước mơ tôi đến - Ngọc Anh"],
      su_dung_cho: ["Khởi động chủ đề nghề nghiệp"],
    },
    cong_dong_xa_hoi: {
      mo_ta: "Chủ đề về cộng đồng, trách nhiệm xã hội",
      bai_hat_goi_y: ["Việt Nam ơi - Rap Việt"],
      su_dung_cho: ["Hoạt động cộng đồng"],
    },
  },
  huong_dan_su_dung: ["Sử dụng bài hát ở phần khởi động để tạo không khí hào hứng"],
}

// ========================================
// MÃ TÍCH HỢP ĐẠO ĐỨC
// ========================================

export const MA_TICH_HOP_DAO_DUC = {
  danh_sach_ma: [
    {
      ma: "1.1",
      ten: "Lòng yêu nước, tự hào dân tộc",
      mo_ta: "Truyền thống lịch sử dân tộc",
      cach_tich_hop: ["Lồng ghép qua câu chuyện nhân vật lịch sử"],
      chu_de_phu_hop: ["Phát huy truyền thống"],
    },
    {
      ma: "1.3",
      ten: "Trách nhiệm với gia đình, tập thể",
      mo_ta: "Ý thức trách nhiệm",
      cach_tich_hop: ["Phân tích vai trò và trách nhiệm"],
      chu_de_phu_hop: ["Gia đình", "Cộng đồng"],
    },
    {
      ma: "2.1",
      ten: "Kính trọng cha mẹ, thầy cô",
      mo_ta: "Thái độ và hành vi",
      cach_tich_hop: ["Đóng vai xử lý tình huống"],
      chu_de_phu_hop: ["Phát triển mối quan hệ"],
    },
  ],
  huong_dan_tich_hop: ["Mỗi bài học nên tích hợp 1-2 mã đạo đức phù hợp"],
}

// ========================================
// GỢI Ý SHDC SHL THEO LOẠI
// ========================================

export const GOI_Y_SHDC_SHL_THEO_LOAI = {
  truong_thanh_kham_pha_ban_than: {
    shdc: ["Tọa đàm 'Hoài bão tuổi thanh niên'", "Giao lưu với người vượt khó thành công"],
    shl: ["Thực hành tự đánh giá điểm mạnh, điểm yếu", "Lập bảng SWOT cá nhân"],
  },
  gia_dinh_gia_tri: {
    shdc: ["Tọa đàm 'Vai trò và trách nhiệm trong gia đình'"],
    shl: ["Thảo luận việc làm chăm sóc gia đình"],
  },
  thay_co_ban_be: {
    shdc: ["Tọa đàm 'Nuôi dưỡng và mở rộng mối quan hệ'"],
    shl: ["Thực hành hợp tác với bạn trong hoạt động nhóm"],
  },
  tai_chinh_ke_hoach: {
    shdc: ["Tọa đàm 'Quản lý tài chính cá nhân cho học sinh'"],
    shl: ["Lập kế hoạch tài chính cá nhân 1 tháng"],
  },
  nghe_nghiep_huong_nghiep: {
    shdc: ["Ngày hội hướng nghiệp"],
    shl: ["Tìm hiểu yêu cầu nghề nghiệp em quan tâm"],
  },
  moi_truong_tu_nhien: {
    shdc: ["Chiến dịch 'Trường học không rác thải nhựa'", "Tọa đàm 'Bảo vệ cảnh quan địa phương'"],
    shl: ["Thực hành phân loại rác tại lớp", "Lập kế hoạch bảo vệ cây xanh trong trường"],
  },
}

// ========================================
// TRÒ CHƠI KHỞI ĐỘNG
// ========================================

export const TRO_CHOI_KHOI_DONG_BO_SUNG = {
  chay_tiep_suc_cong_dong: {
    ten: "Chạy tiếp sức hoạt động cộng đồng",
    chu_de_phu_hop: ["xa_hoi", "Cộng đồng", "Xã hội"],
    so_nguoi: "Cả lớp chia 2 đội",
    thoi_gian: "5-7 phút",
    chuan_bi: ["Bảng/giấy A0", "Bút dạ"],
    luat_choi: ["Mỗi đội cử lần lượt 1 HS lên bảng viết 1 hoạt động"],
    vi_du_dap_an: ["Hiến máu nhân đạo", "Dọn vệ sinh môi trường"],
    luu_y: "GV có thể thay đổi chủ đề",
  },
  ai_la_trieu_phu_career: {
    ten: "Ai là triệu phú Career",
    chu_de_phu_hop: ["huong_nghiep", "Nghề nghiệp"],
    so_nguoi: "Cả lớp",
    thoi_gian: "5-7 phút",
    chuan_bi: ["Câu hỏi trắc nghiệm về nghề nghiệp"],
    luat_choi: ["HS giơ tay trả lời các câu hỏi về kỹ năng và yêu cầu nghề nghiệp"],
    vi_du_dap_an: ["Kỹ năng mềm là gì?", "Nghề AI cần học môn gì?"],
    luu_y: "Cập nhật các nghề mới 4.0",
  },
  manh_ghep_thien_nhien: {
    ten: "Mảnh ghép thiên nhiên",
    chu_de_phu_hop: ["tu_nhien", "Môi trường"],
    so_nguoi: "Nhóm 4-5 HS",
    thoi_gian: "5-7 phút",
    chuan_bi: ["Hình ảnh bị cắt rời về cảnh quan"],
    luat_choi: ["Các nhóm thi nhau ghép hình và gọi tên cảnh quan/vấn đề môi trường"],
    vi_du_dap_an: ["Vịnh Hạ Long", "Rừng bị tàn phá"],
    luu_y: "Gắn với thực trạng địa phương",
  },
  guong_mat_than_quen: {
    ten: "Gương mặt thân quen (Thấu cảm)",
    chu_de_phu_hop: ["ban_than", "Bản thân"],
    so_nguoi: "Cả lớp",
    thoi_gian: "5-7 phút",
    chuan_bi: ["Thẻ ghi cảm xúc"],
    luat_choi: ["1 HS diễn tả cảm xúc qua nét mặt, các HS khác đoán tên cảm xúc"],
    vi_du_dap_an: ["Tự hào", "Lo lắng", "Bỡ ngỡ"],
    luu_y: "Giúp HS nhận diện cảm xúc cá nhân",
  },
}

export const TRO_CHOI_KHOI_DONG_LOP_10: TroChoiKhoiDong[] = [
  {
    ten: "Nếu - Thì",
    loai_chu_de: ["ban_than", "pham_chat"],
    thoi_luong: "5-7 phút",
    so_nguoi: "Cả lớp",
    muc_tieu: "Khơi gợi suy nghĩ về giá trị sống",
    luat_choi: "GV đưa ra các câu 'Nếu... thì...' chưa hoàn chỉnh, HS hoàn thành",
    chuan_bi: "Danh sách câu Nếu-Thì theo chủ đề",
    vi_du_cau_hoi: ["Nếu tôi là người trung thực, tôi sẽ..."],
  },
]

export const GOI_Y_SHDC_SHL_THEO_LOAI_CHU_DE_BO_SUNG = {
  truong_thanh_kham_pha_ban_than: {
    ten: "Trưởng thành & Khám phá bản thân",
    shdc: ["Tọa đàm 'Hoài bão tuổi thanh niên'"],
    shl: ["Thực hành tự đánh giá điểm mạnh, điểm yếu"],
  },
}

export const HUONG_DAN_AI_CHON_MAU = {
  quy_tac_chon_tro_choi: ["Chọn trò chơi phù hợp với loại chủ đề"],
  quy_tac_tao_shdc: ["SHDC là hoạt động toàn trường, quy mô lớn"],
  quy_tac_tao_shl: ["SHL là hoạt động theo lớp, quy mô nhỏ"],
  cach_dieu_chinh_theo_khoi: {
    khoi_10: "Mức độ cơ bản, nhiều hướng dẫn",
    khoi_11: "Mức độ nâng cao hơn",
    khoi_12: "Mức độ cao nhất",
  },
}

// ========================================
// HÀM TRUY XUẤT (DUY NHẤT)
// ========================================

export function getMauSHDC(khoi: number, chuDeSo: number): MauSHDC[] | null {
  const key = `${khoi}.${chuDeSo}`
  return MAU_SHDC_THEO_CHU_DE[key] || null
}

export function getMauSHL(khoi: number, chuDeSo: number): MauSHL[] | null {
  const key = `${khoi}.${chuDeSo}`
  return MAU_SHL_THEO_CHU_DE[key] || null
}

export function getTieuChiDanhGia(tenChuDe: string, khoi: number): TieuChiDanhGiaCuoiChuDe | null {
  return (
    TIEU_CHI_DANH_GIA_CUOI_CHU_DE.find(
      (tc) => tc.chu_de.toLowerCase().includes(tenChuDe.toLowerCase()) && tc.khoi === khoi,
    ) || null
  )
}

export function getMauBangBieu(tenChuDe: string): MauBangBieuThucHanh[] {
  return [...MAU_BANG_BIEU_THUC_HANH, ...MAU_BANG_BIEU_BO_SUNG, ...MAU_BANG_BIEU_BO_SUNG_2].filter((bb) =>
    bb.chu_de_phu_hop.some((cd) => cd.toLowerCase().includes(tenChuDe.toLowerCase())),
  )
}

export function getTroChoiTheoLoaiChuDe(loaiChuDe: string): TroChoiKhoiDong[] {
  return TRO_CHOI_KHOI_DONG_LOP_10.filter((tc) => tc.loai_chu_de.includes(loaiChuDe))
}

export function getGoiYSHDC_SHL(loaiChuDe: string) {
  const loaiMap: Record<string, keyof typeof GOI_Y_SHDC_SHL_THEO_LOAI_CHU_DE_BO_SUNG> = {
    truong_thanh: "truong_thanh_kham_pha_ban_than",
    ban_than: "truong_thanh_kham_pha_ban_than",
  }
  const key = loaiMap[loaiChuDe] || "truong_thanh_kham_pha_ban_than"
  return GOI_Y_SHDC_SHL_THEO_LOAI_CHU_DE_BO_SUNG[key] || null
}

export function getKyThuatDayHocTheoLoai(loai: "nhom" | "ca_nhan") {
  return loai === "nhom" ? KY_THUAT_DAY_HOC_NANG_CAO.ky_thuat_nhom : KY_THUAT_DAY_HOC_NANG_CAO.ky_thuat_ca_nhan
}

export function getBaiHatTheoLoaiChuDe(loaiChuDe: string) {
  const mapping: Record<string, keyof typeof GOI_Y_BAI_HAT_VIDEO.loai_chu_de> = {
    truong_thanh: "truong_thanh_ban_than",
    gia_dinh: "gia_dinh_yeu_thuong",
    ban_be: "thay_co_ban_be",
    nghe_nghiep: "dam_me_nghe_nghiep",
    cong_dong: "cong_dong_xa_hoi",
  }
  const key = mapping[loaiChuDe] || "truong_thanh_ban_than"
  return GOI_Y_BAI_HAT_VIDEO.loai_chu_de[key]
}

export function getMaTichHopDaoDuc(maCodes: string[]) {
  return MA_TICH_HOP_DAO_DUC.danh_sach_ma.filter((ma) => maCodes.includes(ma.ma))
}

export function getGoiYSHDC_SHL_TheoLoai(loaiChuDe: string) {
  const loaiMap: Record<string, keyof typeof GOI_Y_SHDC_SHL_THEO_LOAI> = {
    // Mapping từ mach_noi_dung (kntt-curriculum-database)
    ban_than: "truong_thanh_kham_pha_ban_than",
    xa_hoi: "gia_dinh_gia_tri",
    huong_nghiep: "nghe_nghiep_huong_nghiep",
    tu_nhien: "moi_truong_tu_nhien",

    // Mapping cũ để tương thích
    truong_thanh: "truong_thanh_kham_pha_ban_than",
    gia_dinh: "gia_dinh_gia_tri",
    ban_be: "thay_co_ban_be",
    tai_chinh: "tai_chinh_ke_hoach",
    nghe_nghiep: "nghe_nghiep_huong_nghiep",
  }
  const key = loaiMap[loaiChuDe] || "truong_thanh_kham_pha_ban_than"
  return GOI_Y_SHDC_SHL_THEO_LOAI[key]
}

// ========================================
// HÀM TẠO CONTEXT (DUY NHẤT)
// ========================================

export function taoContextSHDC_SHL(khoi: number, chuDeSo: number, machNoiDung?: string): string {
  const key = `${khoi}.${chuDeSo}`
  let context = `## GỢI Ý SINH HOẠT DƯỚI CỜ (SHDC) VÀ SINH HOẠT LỚP (SHL)\n\n`

  // 1. Lấy mẫu cụ thể nếu có
  const hasSample = MAU_SHDC_THEO_CHU_DE[key] || MAU_SHL_THEO_CHU_DE[key];

  if (MAU_SHDC_THEO_CHU_DE[key]) {
    context += `### Mẫu SHDC cho chủ đề ${key}:\n`
    MAU_SHDC_THEO_CHU_DE[key].forEach((shdc) => {
      context += `- Tuần ${shdc.tuan}: ${shdc.ten_hoat_dong} (${shdc.hinh_thuc})\n`
    })
    context += "\n"
  }

  if (MAU_SHL_THEO_CHU_DE[key]) {
    context += `### Mẫu SHL cho chủ đề ${key}:\n`
    MAU_SHL_THEO_CHU_DE[key].forEach((shl) => {
      context += `- Tuần ${shl.tuan}: ${shl.chu_de}\n`
    })
    context += "\n"
  }

  // 2. Nếu không có mẫu, dùng AI gợi ý dựa trên machNoiDung
  if (!hasSample && machNoiDung) {
    const goiY = getGoiYSHDC_SHL_TheoLoai(machNoiDung);
    if (goiY) {
      context += `### Gợi ý định hướng (Do chưa có mẫu chi tiết):\n`
      context += `- Định hướng SHDC: ${goiY.shdc.join(", ")}\n`
      context += `- Định hướng SHL: ${goiY.shl.join(", ")}\n\n`
      context += `* Yêu cầu AI: Đây là khung định hướng. Hãy dùng trí tuệ nhân tạo để thiết kế các hoạt động chi tiết, sáng tạo, đúng chuẩn sư phạm cho SHDC và SHL dựa trên khung này.\n\n`
    }
  }

  // 3. Trò chơi khởi động (Lọc theo chủ đề)
  context += `### Trò chơi khởi động gợi ý:\n`
  const relevantGames = Object.values(TRO_CHOI_KHOI_DONG_BO_SUNG).filter(tc =>
    !machNoiDung || tc.chu_de_phu_hop.some(cd => cd.toLowerCase() === machNoiDung.toLowerCase() || cd === machNoiDung)
  );

  if (relevantGames.length > 0) {
    relevantGames.forEach((tc) => {
      context += `- ${tc.ten} (${tc.thoi_gian}): ${tc.luat_choi}\n`
    })
  } else {
    // Fallback nếu không có trò chơi nào khớp
    context += `- Trò chơi 'Nếu - Thì' (5-7 phút): GV đưa ra tình huống giả định liên quan đến chủ đề để học sinh ứng biến.\n`
  }

  return context
}

export function taoContextTieuChiDanhGia(tenChuDe: string, khoi: number): string {
  const tieuChi = getTieuChiDanhGia(tenChuDe, khoi)
  if (!tieuChi) {
    return `\n=== TIÊU CHÍ ĐÁNH GIÁ CUỐI CHỦ ĐỀ ===\nChưa có tiêu chí mẫu cho chủ đề này.\n`
  }

  let context = `\n=== TIÊU CHÍ ĐÁNH GIÁ CUỐI CHỦ ĐỀ: ${tieuChi.chu_de} ===\n`
  tieuChi.tieu_chi.forEach((tc, i) => {
    context += `\n${i + 1}. ${tc.ten}: ${tc.mo_ta}\n`
    context += `   - Tốt: ${tc.muc_do.tot}\n`
    context += `   - Đạt: ${tc.muc_do.dat}\n`
    context += `   - Chưa đạt: ${tc.muc_do.chua_dat}\n`
  })
  return context
}

export function taoContextBangBieu(tenChuDe: string): string {
  const bangBieu = getMauBangBieu(tenChuDe)
  if (bangBieu.length === 0) {
    return `\n=== BẢNG BIỂU THỰC HÀNH ===\nChưa có mẫu bảng biểu cho chủ đề này.\n`
  }

  let context = `\n=== MẪU BẢNG BIỂU THỰC HÀNH PHÙ HỢP ===\n`
  bangBieu.forEach((bb) => {
    context += `\n${bb.ten}:\n- Mục đích: ${bb.muc_dich}\n- Cột: ${bb.cot.join(" | ")}\n`
  })
  return context
}

export function taoContextKyThuatDayHoc() {
  const kyThuatNhom = KY_THUAT_DAY_HOC_NANG_CAO.ky_thuat_nhom.map((kt) => `- ${kt.ten}: ${kt.mo_ta}`).join("\n")

  return `## KỸ THUẬT DẠY HỌC NÂNG CAO\n\n### Kỹ thuật nhóm:\n${kyThuatNhom}`
}

export function taoContextTichHopDaoDucVaBaiHat(loaiChuDe: string) {
  const baiHat = getBaiHatTheoLoaiChuDe(loaiChuDe)
  const goiYSHDC_SHL = getGoiYSHDC_SHL_TheoLoai(loaiChuDe)

  return `
## GỢI Ý BÀI HÁT/VIDEO
${baiHat?.bai_hat_goi_y?.slice(0, 3).join(", ") || "Chọn bài hát phù hợp"}

## GỢI Ý SHDC
${goiYSHDC_SHL?.shdc?.slice(0, 3).join("\n- ") || "Tùy chỉnh theo chủ đề"}

## GỢI Ý SHL  
${goiYSHDC_SHL?.shl?.slice(0, 3).join("\n- ") || "Tùy chỉnh theo chủ đề"}`
}

export function taoContextTroChoiVaGoiY(loaiChuDe: string, khoi: number): string {
  const troChoi = getTroChoiTheoLoaiChuDe(loaiChuDe)
  const goiY = getGoiYSHDC_SHL(loaiChuDe)
  const huongDan = HUONG_DAN_AI_CHON_MAU

  let context = `## TRÒ CHƠI KHỞI ĐỘNG PHÙ HỢP\n`
  if (troChoi.length > 0) {
    context += troChoi.map((tc) => `- ${tc.ten} (${tc.thoi_luong})`).join("\n") + "\n"
  }

  context += `\n## ĐIỀU CHỈNH THEO KHỐI ${khoi}\n`
  context += `- ${huongDan.cach_dieu_chinh_theo_khoi[`khoi_${khoi}` as keyof typeof huongDan.cach_dieu_chinh_theo_khoi] || huongDan.cach_dieu_chinh_theo_khoi.khoi_10}`

  return context
}
