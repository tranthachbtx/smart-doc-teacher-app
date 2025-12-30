/**
 * CƠ SỞ DỮ LIỆU TOÀN DIỆN CHƯƠNG TRÌNH HOẠT ĐỘNG TRẢI NGHIỆM, HƯỚNG NGHIỆP
 * BỘ SÁCH: KẾT NỐI TRI THỨC VỚI CUỘC SỐNG
 * CẤP: THPT (Lớp 10, 11, 12)
 *
 * Nguồn: Phân tích chuyên sâu từ SGK, SGV và PPCT theo Chương trình GDPT 2018
 * Cập nhật: Bổ sung chi tiết nhiệm vụ, lưu ý sư phạm và gợi ý tích hợp
 */

// ============================================================================
// PHẦN 1: CẤU TRÚC DỮ LIỆU VÀ INTERFACES
// ============================================================================

export interface NhiemVu {
  ten: string;
  mo_ta: string;
  ky_nang_can_dat?: string[];
  san_pham_du_kien?: string;
  thoi_luong_de_xuat?: string;
  link_tai_lieu_tham_khao?: string[]; // Thêm trường link tài liệu thực tế
}

export interface HoatDong {
  so_thu_tu: number;
  ten: string;
  mo_ta: string;
  muc_tieu_cu_the?: string;
  nhiem_vu: NhiemVu[];
  san_pham?: string[];
  luu_y_su_pham?: string;
}

// Thêm interface mới cho lưu ý sư phạm và gợi ý tích hợp
export interface LuuYSuPham {
  trong_tam: string[];
  phuong_phap_hieu_qua: string[];
  loi_thuong_gap: string[];
  cach_khac_phuc: string[];
}

export interface GoiYTichHop {
  bien_ban_hop: string[];
  ke_hoach_day_hoc: string[];
  ngoai_khoa: string[];
  sinh_hoat_lop?: string[];
  sinh_hoat_duoi_co?: string[];
}

export interface ChuDe {
  ma: string;
  ten: string;
  mach_noi_dung: "ban_than" | "xa_hoi" | "tu_nhien" | "huong_nghiep";
  muc_tieu: string[];
  hoat_dong: HoatDong[];
  ket_qua_can_dat: string[];
  phuong_phap_goi_y: string[];
  so_tiet_de_xuat: number;
  thang_thuc_hien?: number[];
  // Thêm các trường mới
  luu_y_su_pham?: LuuYSuPham;
  goi_y_tich_hop?: GoiYTichHop;
  noi_dung_sgk_tham_khao?: string;
  tu_khoa_tim_kiem?: string[];
}

export interface ChuongTrinhKhoi {
  khoi: 10 | 11 | 12;
  chu_de_trong_tam: string;
  mo_ta_tong_quan: string;
  dac_diem_tam_ly_lua_tuoi: string[];
  muc_tieu_phat_trien_nang_luc: string[];
  chu_de: ChuDe[];
}

// ============================================================================
// PHẦN 2: TRIẾT LÝ VÀ CƠ SỞ LÝ LUẬN
// ============================================================================

export const TRIET_LY_CHUONG_TRINH = {
  ten_bo_sach: "Kết nối Tri thức với Cuộc sống",
  nha_xuat_ban: "Nhà xuất bản Giáo dục Việt Nam",
  chuong_trinh: "GDPT 2018",
  triet_ly: "Đưa bài học vào cuộc sống và đưa cuộc sống vào bài học",

  // Bổ sung triết lý giáo dục chi tiết
  nguyen_tac_cot_loi: {
    tiep_can_nang_luc:
      "Chuyển từ truyền thụ kiến thức sang phát triển năng lực toàn diện",
    hoc_di_doi_voi_hanh:
      "Học sinh phải được thực hành, trải nghiệm, không chỉ nghe giảng",
    ca_nhan_hoa:
      "Tôn trọng sự khác biệt, phát huy thế mạnh riêng của từng học sinh",
    ket_noi_thuc_te: "Nội dung gắn với đời sống, giải quyết vấn đề thực tế",
  },

  bon_mach_noi_dung: {
    ban_than: {
      ten: "Hoạt động hướng vào bản thân",
      mo_ta:
        "Tập trung vào khám phá giá trị cá nhân, rèn luyện phẩm chất và kỹ năng tự quản lý",
      tu_khoa: [
        "khám phá bản thân",
        "rèn luyện",
        "tự chủ",
        "tự tin",
        "quản lý cảm xúc",
      ],
      pham_chat_trong_tam: ["Tự chủ", "Tự tin", "Trách nhiệm"],
      nang_luc_trong_tam: ["Tự nhận thức", "Tự điều chỉnh", "Tự học"],
    },
    xa_hoi: {
      ten: "Hoạt động hướng đến xã hội",
      mo_ta:
        "Xây dựng mối quan hệ với gia đình, nhà trường và cộng đồng; thực hành trách nhiệm xã hội",
      tu_khoa: [
        "gia đình",
        "cộng đồng",
        "trách nhiệm",
        "quan hệ xã hội",
        "thiện nguyện",
      ],
      pham_chat_trong_tam: ["Nhân ái", "Trách nhiệm", "Yêu nước"],
      nang_luc_trong_tam: ["Giao tiếp", "Hợp tác", "Giải quyết vấn đề"],
    },
    tu_nhien: {
      ten: "Hoạt động hướng đến tự nhiên",
      mo_ta:
        "Hình thành ý thức và hành vi bảo vệ môi trường, cảnh quan thiên nhiên",
      tu_khoa: ["môi trường", "bảo tồn", "thiên nhiên", "phát triển bền vững"],
      pham_chat_trong_tam: ["Trách nhiệm", "Chăm chỉ"],
      nang_luc_trong_tam: ["Giải quyết vấn đề", "Sáng tạo", "Khoa học"],
    },
    huong_nghiep: {
      ten: "Hoạt động hướng nghiệp",
      mo_ta:
        "Tìm hiểu thế giới nghề nghiệp, thị trường lao động và rèn luyện năng lực phù hợp với định hướng nghề nghiệp",
      tu_khoa: [
        "nghề nghiệp",
        "thị trường lao động",
        "năng lực",
        "định hướng",
        "kế hoạch",
      ],
      pham_chat_trong_tam: ["Chăm chỉ", "Trách nhiệm", "Trung thực"],
      nang_luc_trong_tam: ["Tự chủ", "Định hướng nghề nghiệp", "Thích ứng"],
    },
  },

  // Thêm mô hình phát triển xoáy ốc
  mo_hinh_phat_trien: {
    lop_10: {
      giai_doan: "Thích ứng và Khám phá",
      trong_tam:
        "Giúp học sinh thích nghi với môi trường THPT, bắt đầu khám phá bản thân",
      muc_do_bloom: ["Nhớ", "Hiểu", "Áp dụng"],
      tu_khoa: ["Làm quen", "Nhận diện", "Tìm hiểu", "Thực hành cơ bản"],
    },
    lop_11: {
      giai_doan: "Phát triển và Bản sắc",
      trong_tam:
        "Nâng cao tính tự chủ, phát triển bản sắc cá nhân và kỹ năng xã hội phức tạp",
      muc_do_bloom: ["Áp dụng", "Phân tích", "Đánh giá"],
      tu_khoa: ["Phát triển", "Xây dựng", "Quản lý", "Phân tích"],
    },
    lop_12: {
      giai_doan: "Trưởng thành và Chuyển tiếp",
      trong_tam:
        "Chuẩn bị cho giai đoạn trưởng thành, đưa ra quyết định quan trọng về nghề nghiệp",
      muc_do_bloom: ["Phân tích", "Đánh giá", "Sáng tạo"],
      tu_khoa: ["Tổng hợp", "Đánh giá", "Ra quyết định", "Hành động độc lập"],
    },
  },

  nguyen_tac_phat_trien: {
    dong_tam:
      "Các nội dung được phát triển đồng tâm và nâng cao dần qua từng cấp lớp",
    thuc_hanh:
      "Yêu cầu học sinh phải thực hành, quan sát, thảo luận và báo cáo",
    tich_hop: "Tích hợp giáo dục năng lực số và đạo đức vào từng hoạt động",
  },
};

// ============================================================================
// PHẦN 3: CHƯƠNG TRÌNH LỚP 10 - THÍCH ỨNG VÀ KHÁM PHÁ
// ============================================================================

export const CHUONG_TRINH_LOP_10: ChuongTrinhKhoi = {
  khoi: 10,
  chu_de_trong_tam: "Thích ứng và Khám phá",
  mo_ta_tong_quan:
    "Lớp 10 là giai đoạn chuyển tiếp quan trọng từ THCS lên THPT. Trọng tâm là giúp học sinh thích nghi với môi trường học tập mới và bắt đầu hành trình khám phá bản thân ở chiều sâu tâm lý học.",

  dac_diem_tam_ly_lua_tuoi: [
    "Giai đoạn chuyển tiếp từ THCS lên THPT, nhiều bỡ ngỡ với môi trường mới",
    "Bắt đầu hình thành tư duy trừu tượng và phản biện",
    "Quan tâm đến hình ảnh bản thân trong mắt người khác",
    "Muốn được công nhận và tôn trọng như người lớn",
    "Dễ bị ảnh hưởng bởi bạn bè đồng trang lứa",
  ],

  muc_tieu_phat_trien_nang_luc: [
    "Năng lực tự nhận thức: Nhận diện tính cách, điểm mạnh, điểm yếu",
    "Năng lực thích ứng: Hòa nhập với môi trường THPT",
    "Năng lực giao tiếp cơ bản: Tự tin trong giao tiếp hàng ngày",
    "Năng lực hướng nghiệp sơ bộ: Bắt đầu tìm hiểu thế giới nghề nghiệp",
  ],

  chu_de: [
    {
      ma: "10.1",
      ten: "Phát huy truyền thống nhà trường",
      mach_noi_dung: "xa_hoi",
      muc_tieu: ["Giúp học sinh hiểu và thực hành văn hóa nhà trường, tự hào về lịch sử và truyền thống dạy tốt học tốt."],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Tìm hiểu nội quy trường lớp và quy định cộng đồng",
          mo_ta: "Nghiên cứu nội quy và các quy tắc ứng xử công cộng.",
          nhiem_vu: [
            {
              ten: "Chia sẻ hiểu biết về nội quy",
              mo_ta: "Thảo luận về: trang phục, thái độ, bảo vệ tài sản công.",
              thoi_luong_de_xuat: "15 phút"
            },
            {
              ten: "Thảo luận biện pháp thực hiện",
              mo_ta: "Đề xuất cách thực hiện hiệu quả nội quy cho cá nhân và tập thể.",
              thoi_luong_de_xuat: "15 phút"
            }
          ]
        },
        {
          so_thu_tu: 2,
          ten: "Tìm hiểu truyền thống nhà trường",
          mo_ta: "Khám phá lịch sử và các giá trị cốt lõi của trường.",
          nhiem_vu: [
            {
              ten: "Chia sẻ truyền thống tiêu biểu",
              mo_ta: "Nói về truyền thống: Dạy tốt - học tốt, Tôn sư trọng đạo.",
              thoi_luong_de_xuat: "20 phút"
            },
            {
              ten: "Việc làm phát huy truyền thống",
              mo_ta: "Đề xuất hành động cụ thể để giữ gìn truyền thống.",
              thoi_luong_de_xuat: "15 phút"
            }
          ]
        },
        {
          so_thu_tu: 3,
          ten: "Thực hiện nội quy và quy định cộng đồng",
          mo_ta: "Đánh giá việc thực hiện và đề xuất biện pháp cải thiện.",
          nhiem_vu: [
            {
              ten: "Xác định nguyên nhân việc làm chưa tốt",
              mo_ta: "Phân tích vì sao chưa thực hiện tốt nội quy và tìm cách khắc phục.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 4,
          ten: "Giáo dục truyền thống nhà trường",
          mo_ta: "Tổ chức hoạt động tuyên truyền về truyền thống.",
          nhiem_vu: [
            {
              ten: "Lập kế hoạch tổ chức giáo dục truyền thống",
              mo_ta: "Thiết kế kế hoạch: Mục tiêu, nội dung, hình thức, phân công.",
              thoi_luong_de_xuat: "25 phút"
            }
          ]
        },
        {
          so_thu_tu: 5,
          ten: "Biện pháp thu hút các bạn vào hoạt động chung",
          mo_ta: "Xây dựng kế hoạch truyền thông nội bộ.",
          nhiem_vu: [
            {
              ten: "Kế hoạch truyền thông 'Trường học hạnh phúc'",
              mo_ta: "Xác định thông điệp cốt lõi, kênh truyền thông (Fanpage, Poster, Loa trường) và đối tượng mục tiêu để thu hút bạn bè.",
              thoi_luong_de_xuat: "25 phút"
            }
          ]
        },
        {
          so_thu_tu: 6,
          ten: "Xây dựng và thực hiện kế hoạch tự rèn luyện",
          mo_ta: "Lập lộ trình cá nhân để thực hiện tốt quy định chung.",
          nhiem_vu: [
            {
              ten: "Kế hoạch tự rèn luyện bản thân",
              mo_ta: "Xác định rào cản và lập lộ trình rèn luyện cá nhân.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        }
      ],
      ket_qua_can_dat: ["Hiểu nội quy", "Tự hào truyền thống", "Biết lôi cuốn bạn bè"],
      phuong_phap_goi_y: ["Thảo luận", "Xử lý tình huống", "Kế hoạch rèn luyện"],
      tu_khoa_tim_kiem: ["nội quy", "truyền thống", "tự rèn luyện"],
      so_tiet_de_xuat: 3,
      thang_thuc_hien: [9]
    },
    {
      ma: "10.2",
      ten: "Khám phá bản thân",
      mach_noi_dung: "ban_than",
      muc_tieu: ["Nhận diện tính cách, điều chỉnh tư duy tích cực và định hình quan điểm sống."],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Xác định tính cách bản thân",
          mo_ta: "Nhận diện nét đặc trưng qua tự đánh giá và phản hồi.",
          nhiem_vu: [
            {
              ten: "Nhận diện nét tính cách",
              mo_ta: "Phân tích tính cách (sôi nổi, trầm tính...) qua phản hồi từ người khác.",
              thoi_luong_de_xuat: "15 phút"
            },
            {
              ten: "Chia sẻ điểm mạnh, điểm yếu",
              mo_ta: "Tự tin nói về thế mạnh và thừa nhận hạn chế để rèn luyện.",
              thoi_luong_de_xuat: "15 phút"
            }
          ]
        },
        {
          so_thu_tu: 2,
          ten: "Tìm hiểu về điều chỉnh tư duy theo hướng tích cực",
          mo_ta: "Học cách nhìn nhận vấn đề lạc quan.",
          nhiem_vu: [
            {
              ten: "Tìm hiểu điều chỉnh tư duy",
              mo_ta: "Phân tích tình huống so sánh tư duy tích cực và tiêu cực.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 3,
          ten: "Tìm hiểu về quan điểm sống",
          mo_ta: "Hình thành nhân sinh quan qua tranh biện.",
          nhiem_vu: [
            {
              ten: "Tìm hiểu về quan điểm sống",
              mo_ta: "Tranh biện về các câu tục ngữ/danh ngôn (VD: Thất bại là mẹ thành công).",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 4,
          ten: "Lập và thực hiện kế hoạch rèn luyện phát huy điểm mạnh, hạn chế điểm yếu",
          mo_ta: "Thiết kế lộ trình phát triển bản thân.",
          nhiem_vu: [
            {
              ten: "Lập kế hoạch phát huy điểm mạnh",
              mo_ta: "Xây dựng bảng kế hoạch chi tiết (Việc làm, thời gian).",
              thoi_luong_de_xuat: "25 phút"
            }
          ]
        },
        {
          so_thu_tu: 5,
          ten: "Điều chỉnh tư duy của bản thân theo hướng tích cực",
          mo_ta: "Thực hành thay đổi cách nhìn trong tình huống khó khăn.",
          nhiem_vu: [
            {
              ten: "Thực hành điều chỉnh tư duy",
              mo_ta: "Xử lý tình huống thực tế (Bố mẹ không cho đi chơi, thi trượt...).",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 6,
          ten: "Rèn luyện tính cách và tư duy tích cực",
          mo_ta: "Ổn định tâm lý và thói quen lạc quan.",
          nhiem_vu: [
            {
              ten: "Xây dựng thói quen tích cực",
              mo_ta: "Viết sổ ký ức tích cực mỗi ngày.",
              thoi_luong_de_xuat: "15 phút"
            }
          ]
        },
        {
          so_thu_tu: 7,
          ten: "Thể hiện quan điểm sống của bản thân",
          mo_ta: "Khẳng định giá trị cá nhân trước tập thể.",
          nhiem_vu: [
            {
              ten: "Trình bày lý tưởng sống",
              mo_ta: "Thuyết trình về phương châm sống 'Sống là cống hiến'.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        }
      ],
      ket_qua_can_dat: ["Hiểu rõ tính cách", "Có quan điểm sống tích cực", "Biết điều chỉnh tư duy"],
      phuong_phap_goi_y: ["Trắc nghiệm", "Tranh biện", "Đóng vai"],
      tu_khoa_tim_kiem: ["tính cách", "tư duy tích cực", "quan điểm sống"],
      so_tiet_de_xuat: 4,
      thang_thuc_hien: [10]
    },
    {
      ma: "10.3",
      ten: "Rèn luyện bản thân",
      mach_noi_dung: "ban_than",
      muc_tieu: ["Phát triển trách nhiệm, tự chủ và quản lý tài chính."],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Tìm hiểu biểu hiện của người có trách nhiệm",
          mo_ta: "Nhận diện thái độ và hành vi trách nhiệm trong cuộc sống.",
          nhiem_vu: [
            {
              ten: "Xác định biểu hiện trách nhiệm",
              mo_ta: "Thảo luận về: Hoàn thành nhiệm vụ, coi trọng thời gian, hỗ trợ người thân.",
              thoi_luong_de_xuat: "15 phút"
            }
          ]
        },
        {
          so_thu_tu: 2,
          ten: "Tìm hiểu sự tự chủ, lòng tự trọng và ý chí vượt khó",
          mo_ta: "Phân tích các tình huống rèn luyện nghị lực.",
          nhiem_vu: [
            {
              ten: "Nhận diện tự chủ và vượt khó",
              mo_ta: "Phân tích tình huống nhân vật Vinh tự lập hoặc các tấm gương vượt khó.",
              thoi_luong_de_xuat: "15 phút"
            }
          ]
        },
        {
          so_thu_tu: 3,
          ten: "Tìm hiểu biểu hiện của người có tư duy phản biện",
          mo_ta: "Học cách đặt câu hỏi và suy nghĩ đa chiều.",
          nhiem_vu: [
            {
              ten: "Đặc điểm người phản biện",
              mo_ta: "Nhận diện: Đặt câu hỏi chất vấn, tìm lỗi lập luận, suy nghĩ khách quan.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 4,
          ten: "Tìm hiểu về kế hoạch tài chính cá nhân",
          mo_ta: "Kiến thức cơ bản về quản lý tiền bạc.",
          nhiem_vu: [
            {
              ten: "Khái niệm kế hoạch tài chính",
              mo_ta: "Tìm hiểu quy trình: Xác định mục tiêu -> Ngân sách -> Theo dõi.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 5,
          ten: "Thực hành trách nhiệm, tự chủ, tự trọng, ý chí vượt khó",
          mo_ta: "Áp dụng các đức tính vào nhiệm vụ học tập.",
          nhiem_vu: [
            {
              ten: "Cam kết trách nhiệm",
              mo_ta: "Thực hiện nhiệm vụ trực nhật/học tập dù có trở ngại.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 6,
          ten: "Rèn luyện tư duy phản biện",
          mo_ta: "Quy trình phản biện 4 bước có cấu trúc.",
          nhiem_vu: [
            {
              ten: "Thực hành phản biện chuyên sâu",
              mo_ta: "Áp dụng quy trình: Lắng nghe chủ động -> Ghi chép ý kiến đối lập -> Phân tích logic -> Đưa ra phản hồi (Argument mapping).",
              thoi_luong_de_xuat: "25 phút"
            }
          ]
        },
        {
          so_thu_tu: 7,
          ten: "Xây dựng và thực hiện kế hoạch tài chính cá nhân",
          mo_ta: "Tạo bảng kế hoạch thu chi thực tế.",
          nhiem_vu: [
            {
              ten: "Lập bảng kế hoạch tài chính",
              mo_ta: "Xây dựng bảng chi tiêu cho 1 tháng hoặc cho mục tiêu lớn.",
              thoi_luong_de_xuat: "25 phút"
            }
          ]
        },
        {
          so_thu_tu: 8,
          ten: "Rèn luyện tính trách nhiệm trong thực hiện mục tiêu",
          mo_ta: "Củng cố thói quen kiên trì.",
          nhiem_vu: [
            {
              ten: "Đánh giá quá trình rèn luyện",
              mo_ta: "Tự nhận xét sự tiến bộ sau 1 tuần thực hiện mục tiêu.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        }
      ],
      ket_qua_can_dat: ["Sống trách nhiệm", "Biết quản lý tiền bạc", "Có tư duy phản biện"],
      phuong_phap_goi_y: ["Phân tích trường hợp", "Lập kế hoạch tài chính", "Tranh biện"],
      tu_khoa_tim_kiem: ["trách nhiệm", "tự chủ", "quản lý tài chính"],
      so_tiet_de_xuat: 4,
      thang_thuc_hien: [11]
    },
    {
      ma: "10.4",
      ten: "Chủ động, tự tin trong học tập và giao tiếp",
      mach_noi_dung: "ban_than",
      muc_tieu: ["Cải thiện kỹ năng giao tiếp và sự chủ động trong cuộc sống."],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Tìm hiểu biểu hiện của sự chủ động trong các môi trường",
          mo_ta: "Nhận diện hành vi tự giác trong học tập và sinh hoạt.",
          nhiem_vu: [
            {
              ten: "Nhận diện sự chủ động",
              mo_ta: "Thảo luận về: Tự giác học bài, chủ động hỏi thầy cô, tự tìm tài liệu.",
              thoi_luong_de_xuat: "15 phút"
            }
          ]
        },
        {
          so_thu_tu: 2,
          ten: "Tìm hiểu sự tự tin và thân thiện trong giao tiếp",
          mo_ta: "Kỹ năng phi ngôn ngữ và thái độ tích cực.",
          nhiem_vu: [
            {
              ten: "Biểu hiện của tự tin",
              mo_ta: "Thực hành: Ánh mắt, nụ cười, giọng nói rõ ràng, tư thế đĩnh đạc.",
              thoi_luong_de_xuat: "15 phút"
            }
          ]
        },
        {
          so_thu_tu: 3,
          ten: "Thể hiện sự chủ động trong học tập và giao tiếp",
          mo_ta: "Áp dụng tính chủ động vào môi trường lớp học.",
          nhiem_vu: [
            {
              ten: "Xây dựng kế hoạch học tập chủ động",
              mo_ta: "Lập các bước để hoàn thành mục tiêu học tập mà không cần nhắc nhở.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 4,
          ten: "Thực hành giao tiếp tự tin, thân thiện với bạn bè",
          mo_ta: "Xây dựng mối quan hệ đồng trang lứa tốt đẹp.",
          nhiem_vu: [
            {
              ten: "Đóng vai làm quen",
              mo_ta: "Cách bắt chuyện với bạn mới, cách giải quyết bất đồng nhẹ nhàng.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 5,
          ten: "Thực hành giao tiếp, ứng xử với thầy, cô giáo",
          mo_ta: "Văn hóa học đường và sự tôn sư trọng đạo.",
          nhiem_vu: [
            {
              ten: "Giao tiếp sư phạm",
              mo_ta: "Đóng vai: Hỏi bài sau giờ học, trình bày ý kiến đóng góp cho lớp.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 6,
          ten: "Thực hành ứng xử phù hợp trong giao tiếp ở gia đình",
          mo_ta: "Sự thấu hiểu và hiếu thảo với cha mẹ.",
          nhiem_vu: [
            {
              ten: "Giao tiếp thế hệ",
              mo_ta: "Lắng nghe cha mẹ chia sẻ, trình bày mong muốn cá nhân một cách lễ phép.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 7,
          ten: "Rèn luyện tính chủ động, tự tin trong cuộc sống",
          mo_ta: "Tổng kết và cam kết thay đổi.",
          nhiem_vu: [
            {
              ten: "Nhật ký rèn luyện tự tin",
              mo_ta: "Ghi lại 3 việc chủ động làm trong ngày.",
              thoi_luong_de_xuat: "15 phút"
            }
          ]
        }
      ],
      ket_qua_can_dat: ["Tự tin trước đám đông", "Giao tiếp lịch thiệp", "Chủ động học tập"],
      phuong_phap_goi_y: ["Đóng vai", "Thực hành giao tiếp", "Trải nghiệm thực tế"],
      tu_khoa_tim_kiem: ["tự tin", "chủ động", "giao tiếp"],
      so_tiet_de_xuat: 4,
      thang_thuc_hien: [12]
    },
    {
      ma: "10.5",
      ten: "Trách nhiệm với gia đình",
      mach_noi_dung: "xa_hoi",
      muc_tieu: ["Gắn kết gia đình và hỗ trợ kinh tế gia đình."],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Tìm hiểu về trách nhiệm với gia đình",
          mo_ta: "Nhận thức vai trò cá nhân trong tổ ấm.",
          nhiem_vu: [
            {
              ten: "Chia sẻ trách nhiệm",
              mo_ta: "Thảo luận: Chăm sóc người thân, nuôi dưỡng tình cảm, chia sẻ việc nhà.",
              thoi_luong_de_xuat: "15 phút"
            }
          ]
        },
        {
          so_thu_tu: 2,
          ten: "Thể hiện trách nhiệm với gia đình",
          mo_ta: "Thực hiện hành động quan tâm thường xuyên.",
          nhiem_vu: [
            {
              ten: "Hành động yêu thương",
              mo_ta: "Làm các việc cụ thể: Nấu cơm, dọn dẹp, hỏi han cha mẹ/ông bà.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 3,
          ten: "Xây dựng kế hoạch thực hiện hoạt động lao động trong gia đình",
          mo_ta: "Phân công và quản lý công việc nhà.",
          nhiem_vu: [
            {
              ten: "Bảng phân công việc nhà",
              mo_ta: "Lập bảng kế hoạch tuần: Việc làm - Thời gian - Hoàn thành.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 4,
          ten: "Đề xuất biện pháp phát triển kinh tế gia đình",
          mo_ta: "Kinh tế hộ gia đình bền vững.",
          nhiem_vu: [
            {
              ten: "Giải pháp gia tăng thu nhập và tiết kiệm",
              mo_ta: "Đề xuất ý tưởng kinh doanh nhỏ VÀ danh mục việc làm phi kinh doanh (Sửa chữa đồ dùng, tiết kiệm năng lượng, trồng rau sạch).",
              thoi_luong_de_xuat: "25 phút"
            }
          ]
        },
        {
          so_thu_tu: 5,
          ten: "Thực hiện trách nhiệm với gia đình và đánh giá",
          mo_ta: "Tổng kết kết quả thực hiện kế hoạch.",
          nhiem_vu: [
            {
              ten: "Đánh giá sự gắn kết",
              mo_ta: "Tự nhận xét thay đổi trong quan hệ với người thân.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        }
      ],
      ket_qua_can_dat: ["Gia đình hạnh phúc", "Biết quý trọng giá trị lao động", "Biết lập kế hoạch kinh tế"],
      phuong_phap_goi_y: ["Lập kế hoạch", "Brainstorming", "Trải nghiệm"],
      tu_khoa_tim_kiem: ["gia đình", "gắn kết", "kinh tế gia đình"],
      so_tiet_de_xuat: 3,
      thang_thuc_hien: [1]
    },

    {
      ma: "10.6",
      ten: "Tham gia xây dựng cộng đồng",
      mach_noi_dung: "xa_hoi",
      muc_tieu: ["Nâng cao ý thức trách nhiệm với cộng đồng và thực hiện dự án xã hội nhỏ."],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Tìm hiểu biện pháp mở rộng quan hệ và thu hút cộng đồng",
          mo_ta: "Kỹ năng vận động xã hội.",
          nhiem_vu: [
            {
              ten: "Biện pháp kết nối cộng đồng",
              mo_ta: "Thảo luận cách làm quen, gây quỹ, mời gọi bạn bè tham gia CLB thiện nguyện.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 2,
          ten: "Xác định nội dung tuyên truyền về văn hóa ứng xử nơi công cộng",
          mo_ta: "Xây dựng nếp sống văn minh.",
          nhiem_vu: [
            {
              ten: "Nội dung tuyên truyền văn minh",
              mo_ta: "Xác định các thông điệp: Không xả rác, xếp hàng, nói lời hay ý đẹp.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 3,
          ten: "Thực hiện biện pháp mở rộng quan hệ và thu hút cộng đồng",
          mo_ta: "Thực hành vận động mọi người tham gia hoạt động chung.",
          nhiem_vu: [
            {
              ten: "Vận động tham gia dự án",
              mo_ta: "Thực hành mời bạn tham gia một buổi dọn vệ sinh hoặc quyên góp sách.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 4,
          ten: "Lập kế hoạch tuyên truyền văn hóa ứng xử nơi công cộng",
          mo_ta: "Thiết kế dự án truyền thông nhỏ.",
          nhiem_vu: [
            {
              ten: "Kế hoạch truyền thông văn minh",
              mo_ta: "Xác định: Hình thức (poster, video), Kênh truyền tải, Phân công.",
              thoi_luong_de_xuat: "25 phút"
            }
          ]
        },
        {
          so_thu_tu: 5,
          ten: "Thực hiện kế hoạch tuyên truyền văn hóa ứng xử",
          mo_ta: "Triển khai các sản phẩm truyền thông thực tế.",
          nhiem_vu: [
            {
              ten: "Tổ chức sự kiện tuyên truyền",
              mo_ta: "Trình bày poster, phát clip hoặc tổ chức minigame về ứng xử văn minh.",
              thoi_luong_de_xuat: "25 phút"
            }
          ]
        },
        {
          so_thu_tu: 6,
          ten: "Tham gia kết nối cộng đồng và đánh giá",
          mo_ta: "Vận dụng biện pháp mở rộng quan hệ xã hội.",
          nhiem_vu: [
            {
              ten: "Đánh giá kết quả hoạt động xã hội",
              mo_ta: "Tự nhận xét sự đóng góp của bản thân cho cộng đồng địa phương.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        }
      ],
      ket_qua_can_dat: ["Sống có trách nhiệm", "Biết lập dự án xã hội", "Biết vận động cộng đồng"],
      phuong_phap_goi_y: ["Dự án", "Thảo luận nhóm", "Truyền thông"],
      tu_khoa_tim_kiem: ["cộng đồng", "thiện nguyện", "văn hóa ứng xử"],
      so_tiet_de_xuat: 4,
      thang_thuc_hien: [2]
    },
    {
      ma: "10.7",
      ten: "Bảo tồn cảnh quan thiên nhiên",
      mach_noi_dung: "tu_nhien",
      muc_tieu: ["Hiểu giá trị và tham gia bảo vệ danh lam thắng cảnh địa phương."],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Tìm hiểu hành vi, việc làm bảo tồn cảnh quan thiên nhiên",
          mo_ta: "Đánh giá các hành động của tổ chức và cá nhân.",
          nhiem_vu: [
            {
              ten: "Khảo sát hành vi bảo tồn",
              mo_ta: "Nghiên cứu cách các tổ chức bảo vệ rừng, biển, di tích tại địa phương.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 2,
          ten: "Tìm hiểu về hoạt động tuyên truyền bảo vệ cảnh quan thiên nhiên",
          mo_ta: "Kỹ năng truyền thông bảo vệ môi trường.",
          nhiem_vu: [
            {
              ten: "Các hình thức tuyên truyền",
              mo_ta: "Tìm hiểu: Triển lãm ảnh, tọa đàm, cuộc thi vẽ về thiên nhiên.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 3,
          ten: "Nhận xét, đánh giá việc bảo tồn cảnh quan ở địa phương",
          mo_ta: "Công cụ khảo sát thực địa.",
          nhiem_vu: [
            {
              ten: "Thiết kế Phiếu khảo sát (Checklist)",
              mo_ta: "Xây dựng biểu mẫu gồm các tiêu chí: Tên cảnh quan, Mức độ ô nhiễm, Tình trạng xâm lấn, Hệ thống biển báo, Ý thức người dân.",
              thoi_luong_de_xuat: "25 phút"
            }
          ]
        },
        {
          so_thu_tu: 4,
          ten: "Xây dựng và thực hiện kế hoạch tuyên truyền bảo vệ cảnh quan",
          mo_ta: "Hành động cụ thể của nhóm học sinh.",
          nhiem_vu: [
            {
              ten: "Kế hoạch sự kiện bảo tồn",
              mo_ta: "Lên ý tưởng cho buổi dọn vệ sinh hoặc buổi nói chuyện truyền cảm hứng.",
              thoi_luong_de_xuat: "25 phút"
            }
          ]
        },
        {
          so_thu_tu: 5,
          ten: "Tuyên truyền bảo vệ cảnh quan thiên nhiên và đánh giá",
          mo_ta: "Lan tỏa thông điệp tới cộng đồng.",
          nhiem_vu: [
            {
              ten: "Lan tỏa thông điệp xanh",
              mo_ta: "Chia sẻ hình ảnh đẹp và kêu gọi bảo vệ danh thắng lên mạng xã hội/trường học.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        }
      ],
      ket_qua_can_dat: ["Biết quý trọng thiên nhiên", "Có kỹ năng tuyên truyền", "Có ý thức bảo tồn"],
      phuong_phap_goi_y: ["Trực quan", "Thuyết trình", "Dự án"],
      tu_khoa_tim_kiem: ["cảnh quan", "bảo tồn", "thiên nhiên"],
      so_tiet_de_xuat: 3,
      thang_thuc_hien: [3]
    },
    {
      ma: "10.8",
      ten: "Bảo vệ môi trường tự nhiên",
      mach_noi_dung: "tu_nhien",
      muc_tieu: ["Hình thành lối sống xanh và giải quyết các vấn đề ô nhiễm."],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Phân tích, đánh giá thực trạng môi trường tự nhiên ở địa phương",
          mo_ta: "Đánh giá mức độ ô nhiễm và các nguồn gây hại.",
          nhiem_vu: [
            {
              ten: "Khảo sát ô nhiễm",
              mo_ta: "Đi thực địa ghi nhận tình hình rác thải, nguồn nước tại khu dân cư.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 2,
          ten: "Thuyết trình về ý nghĩa của việc bảo vệ môi trường tự nhiên",
          mo_ta: "Nâng cao nhận thức qua lý luận và hình ảnh.",
          nhiem_vu: [
            {
              ten: "Hùng biện về môi trường",
              mo_ta: "Thuyết trình về tác động của biến đổi khí hậu và vai trò của học sinh.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 3,
          ten: "Thực hiện các giải pháp bảo vệ môi trường tự nhiên",
          mo_ta: "Hành động theo danh mục gợi ý.",
          nhiem_vu: [
            {
              ten: "Chiến dịch Xanh địa phương",
              mo_ta: "Thực hiện giải pháp theo 3 nhóm: Giải pháp công nghệ (tái chế), Giải pháp sinh học (trồng cây), Giải pháp tuyên truyền.",
              thoi_luong_de_xuat: "25 phút"
            }
          ]
        },
        {
          so_thu_tu: 4,
          ten: "Thực hiện bảo vệ môi trường tự nhiên ở địa phương và đánh giá",
          mo_ta: "Tham gia các chiến dịch môi trường tập thể.",
          nhiem_vu: [
            {
              ten: "Ngày hội sống xanh",
              mo_ta: "Tổ chức dọn vệ sinh trường lớp hoặc trồng cây xanh.",
              thoi_luong_de_xuat: "25 phút"
            }
          ]
        }
      ],
      ket_qua_can_dat: ["Yêu môi trường", "Biết tái chế", "Có hành động bảo vệ thực tế"],
      phuong_phap_goi_y: ["Trải nghiệm", "Làm việc nhóm", "Thuyết trình"],
      tu_khoa_tim_kiem: ["môi trường", "tái chế", "biến đổi khí hậu"],
      so_tiet_de_xuat: 4,
      thang_thuc_hien: [4]
    },
    {
      ma: "10.9",
      ten: "Tìm hiểu nghề nghiệp",
      mach_noi_dung: "huong_nghiep",
      muc_tieu: ["Khám phá thế giới nghề nghiệp và yêu cầu của thị trường lao động."],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Tìm hiểu hoạt động sản xuất, kinh doanh, dịch vụ ở địa phương",
          mo_ta: "Bức tranh kinh tế khu vực.",
          nhiem_vu: [
            {
              ten: "Bản đồ nghề nghiệp địa phương",
              mo_ta: "Tìm hiểu: Các làng nghề, khu công nghiệp hoặc trung tâm dịch vụ tại nơi sinh sống.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 2,
          ten: "Xác định, tìm hiểu các thông tin về nghề em quan tâm ở địa phương",
          mo_ta: "Phân tích sâu một công việc cụ thể.",
          nhiem_vu: [
            {
              ten: "Hồ sơ nghề nghiệp",
              mo_ta: "Tìm hiểu: Công cụ làm việc, điều kiện lao động, mức thu nhập, yêu cầu năng lực.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 3,
          ten: "Lập kế hoạch và thực hiện trải nghiệm nghề",
          mo_ta: "Tiếp xúc thực tế với môi trường làm việc.",
          nhiem_vu: [
            {
              ten: "Một ngày làm...",
              mo_ta: "Phỏng vấn người trong nghề hoặc quan sát trực tiếp quy trình làm việc.",
              thoi_luong_de_xuat: "25 phút"
            }
          ]
        },
        {
          so_thu_tu: 4,
          ten: "Rèn luyện bản thân theo yêu cầu của nghề em quan tâm",
          mo_ta: "Bồi dưỡng phẩm chất cần thiết.",
          nhiem_vu: [
            {
              ten: "Cải thiện kỹ năng nghề",
              mo_ta: "Xác định 2 kỹ năng thiếu hụt và lập cách khắc phục ngay tại trường học.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        }
      ],
      ket_qua_can_dat: ["Hiểu thị trường lao động", "Tôn trọng các nghề", "Có ý thức rèn luyện nghề nghiệp"],
      phuong_phap_goi_y: ["Phỏng vấn", "Nghiên cứu tài liệu", "Tham quan"],
      tu_khoa_tim_kiem: ["nghề nghiệp", "lao động", "thị trường"],
      so_tiet_de_xuat: 3,
      thang_thuc_hien: [4]
    },
    {
      ma: "10.10",
      ten: "Hiểu bản thân để chọn nghề phù hợp",
      mach_noi_dung: "huong_nghiep",
      muc_tieu: ["Định hướng nghề nghiệp dựa trên năng lực và sở thích cá nhân."],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Tìm hiểu yêu cầu của việc chọn nghề phù hợp",
          mo_ta: "Lý thuyết chọn nghề khoa học (Sở thích - Năng lực - Nhu cầu xã hội).",
          nhiem_vu: [
            {
              ten: "Nguyên tắc chọn nghề",
              mo_ta: "Tìm hiểu các sai lầm phổ biến khi chọn nghề (Theo bạn bè, theo số đông).",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 2,
          ten: "Lựa chọn nghề nghiệp phù hợp với bản thân",
          mo_ta: "Sử dụng các bài test sở thích nghề nghiệp.",
          nhiem_vu: [
            {
              ten: "Thực hiện trắc nghiệm Holland",
              mo_ta: "Xác định 3 nhóm tính cách nghề nghiệp nổi trội: Kỹ thuật, Nghiên cứu, Nghệ thuật, Xã hội, Quản lý, Nghiệp vụ.",
              thoi_luong_de_xuat: "25 phút"
            }
          ]
        },
        {
          so_thu_tu: 3,
          ten: "Đánh giá sự phù hợp của bản thân với nghề định lựa chọn",
          mo_ta: "Đối soát thực tế.",
          nhiem_vu: [
            {
              ten: "Phân tích SWOT nghề nghiệp",
              mo_ta: "Đối chiếu điểm mạnh/yếu cá nhân với yêu cầu công việc cụ thể.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 4,
          ten: "Xây dựng kế hoạch rèn luyện bản thân theo định hướng nghề nghiệp",
          mo_ta: "Lập lộ trình phát triển phẩm chất nghề.",
          nhiem_vu: [
            {
              ten: "Kế hoạch phát triển năng lực",
              mo_ta: "Xác định các khóa học, kỹ năng cần bổ sung trong 3 năm THPT.",
              thoi_luong_de_xuat: "25 phút"
            }
          ]
        },
        {
          so_thu_tu: 5,
          ten: "Rèn luyện năng lực, phẩm chất theo kế hoạch",
          mo_ta: "Củng cố quyết tâm chọn nghề.",
          nhiem_vu: [
            {
              ten: "Cam kết hành động",
              mo_ta: "Bắt đầu thực hiện 1 việc nhỏ mỗi ngày để tiến gần đến nghề mơ ước.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        }
      ],
      ket_qua_can_dat: ["Định vị bản thân", "Chọn nghề khoa học", "Có kế hoạch rèn luyện rõ ràng"],
      phuong_phap_goi_y: ["Trắc nghiệm tâm lý", "Tư vấn hướng nghiệp", "Tự đánh giá"],
      tu_khoa_tim_kiem: ["Holland", "chọn nghề", "định vị"],
      so_tiet_de_xuat: 3,
      thang_thuc_hien: [5]
    },
    {
      ma: "10.11",
      ten: "Lập kế hoạch học tập, rèn luyện theo định hướng nghề nghiệp",
      mach_noi_dung: "huong_nghiep",
      muc_tieu: ["Xây dựng lộ trình cụ thể để đạt được mục tiêu nghề nghiệp."],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Tìm hiểu hệ thống trường đào tạo liên quan đến nghề định chọn",
          mo_ta: "Cơ sở vật chất và thông tin tuyển sinh.",
          nhiem_vu: [
            {
              ten: "Danh sách trường đào tạo",
              mo_ta: "Tìm hiểu: Trường đại học, cao đẳng, trung cấp nghề tại khu vực và toàn quốc.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 2,
          ten: "Tìm hiểu về tham vấn chọn nghề và định hướng học tập",
          mo_ta: "Nhận sự trợ giúp từ chuyên gia.",
          nhiem_vu: [
            {
              ten: "Kỹ năng tham vấn",
              mo_ta: "Biết cách đặt câu hỏi cho tư vấn viên, giáo viên hoặc cha mẹ về nghề nghiệp.",
              thoi_luong_de_xuat: "15 phút"
            }
          ]
        },
        {
          so_thu_tu: 3,
          ten: "Tìm hiểu cách lập kế hoạch học tập, rèn luyện theo nghề lựa chọn",
          mo_ta: "Lư thuyết lập kế hoạch.",
          nhiem_vu: [
            {
              ten: "Mẫu kế hoạch học tập",
              mo_ta: "Thiết kế kế hoạch học tập 3 năm THPT tập trung vào các môn chuyên sâu.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 4,
          ten: "Trình bày thông tin về hệ thống đào tạo nghề",
          mo_ta: "Chia sẻ kết quả tìm kiếm.",
          nhiem_vu: [
            {
              ten: "Thuyết trình về trường đại học mơ ước",
              mo_ta: "Nói về: Điểm chuẩn, tổ hợp môn, cơ hội việc làm sau khi ra trường.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 5,
          ten: "Thực hành tham vấn chọn nghề và định hướng học tập",
          mo_ta: "Đóng vai buổi tư vấn.",
          nhiem_vu: [
            {
              ten: "Tình huống tham vấn",
              mo_ta: "Đóng vai: Học sinh hỏi - Giáo viên tư vấn về việc chọn khối thi.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 6,
          ten: "Xây dựng kế hoạch học tập, rèn luyện bản thân theo nghề",
          mo_ta: "Bản kế hoạch chính thức.",
          nhiem_vu: [
            {
              ten: "Thiết kế bản đồ mục tiêu",
              mo_ta: "Vẽ lộ trình 3 năm với các cột mốc quan trọng (Điểm số, chứng chỉ).",
              thoi_luong_de_xuat: "25 phút"
            }
          ]
        },
        {
          so_thu_tu: 7,
          ten: "Học tập, rèn luyện theo định hướng nghề nghiệp và đánh giá",
          mo_ta: "Tổng kết năm học lớp 10.",
          nhiem_vu: [
            {
              ten: "Đánh giá sự sẵn sàng",
              mo_ta: "Tự nhận xét mức độ chuẩn bị tâm lý và kiến thức sau chủ đề.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        }
      ],
      ket_qua_can_dat: ["Có mục tiêu rõ ràng", "Quyết tâm rèn luyện", "Hiểu lộ trình đào tạo"],
      phuong_phap_goi_y: ["Lập kế hoạch", "Viết nhật ký mục tiêu", "Tham vấn"],
      tu_khoa_tim_kiem: ["kế hoạch", "khối thi", "đào tạo"],
      so_tiet_de_xuat: 3,
      thang_thuc_hien: [5]
    },
  ],
};

// ============================================================================
// PHẦN 4: CHƯƠNG TRÌNH LỚP 11 - PHÁT TRIỂN VÀ BẢN SẮC
// ============================================================================

export const CHUONG_TRINH_LOP_11: ChuongTrinhKhoi = {
  khoi: 11,
  chu_de_trong_tam: "Phát triển và Bản sắc",
  mo_ta_tong_quan:
    "Lớp 11 nâng cao yêu cầu về tính tự chủ và kỹ năng xã hội phức tạp. Học sinh không chỉ thích nghi mà phải chủ động kiến tạo các giá trị. Điểm nhấn là quản lý tài chính, kiểm soát quan hệ mạng xã hội và phân tích thị trường lao động.",

  dac_diem_tam_ly_lua_tuoi: [
    "Đã quen với môi trường THPT, bắt đầu khẳng định cái tôi",
    "Quan tâm nhiều hơn đến các vấn đề xã hội và tương lai",
    "Mong muốn được độc lập trong quyết định",
    "Bắt đầu hình thành quan điểm riêng về cuộc sống",
    "Áp lực từ việc chuẩn bị cho kỳ thi THPT QG",
  ],

  muc_tieu_phat_trien_nang_luc: [
    "Năng lực tự chủ nâng cao: Quản lý tài chính, thời gian, cảm xúc",
    "Năng lực xã hội: Lãnh đạo nhóm, tổ chức sự kiện, truyền thông",
    "Năng lực số: An toàn mạng, xây dựng hình ảnh số",
    "Năng lực hướng nghiệp: Phân tích thị trường lao động, rèn luyện phẩm chất nghề",
  ],

  chu_de: [
    {
      ma: "11.1",
      ten: "Xây dựng và phát triển nhà trường",
      mach_noi_dung: "xa_hoi",
      muc_tieu: ["Chủ động tham gia xây dựng và phát triển nhà trường", "Kiểm soát quan hệ trên không gian số"],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Tìm hiểu cách phát triển mối quan hệ tốt đẹp với thầy cô, bạn bè",
          mo_ta: "Xây dựng nền tảng giao tiếp học đường tích cực.",
          nhiem_vu: [
            {
              ten: "Khảo sát thực trạng quan hệ",
              mo_ta: "Đánh giá mức độ thân thiện và hỗ trợ giữa giáo viên - học sinh và học sinh - học sinh.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 2,
          ten: "Tìm hiểu cách làm chủ và kiểm soát các mối quan hệ với bạn bè ở trường, qua mạng xã hội",
          mo_ta: "Kỹ năng an toàn và văn minh số.",
          nhiem_vu: [
            {
              ten: "Phân tích rủi ro mạng",
              mo_ta: "Thảo luận về các tình huống mâu thuẫn trên mạng xã hội và cách xử lý trung lập.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 3,
          ten: "Xây dựng mối quan hệ tốt đẹp với thầy cô, bạn bè",
          mo_ta: "Thực hành gắn kết đời thực.",
          nhiem_vu: [
            {
              ten: "Sáng kiến gắn kết",
              mo_ta: "Đề xuất các hoạt động chung để tăng cường sự thấu hiểu giữa thầy và trò.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 4,
          ten: "Rèn luyện kỹ năng làm chủ và kiểm soát các mối quan hệ với bạn bè ở trường, qua mạng xã hội",
          mo_ta: "Áp dụng quy tắc ứng xử văn minh.",
          nhiem_vu: [
            {
              ten: "Kịch bản ứng xử",
              mo_ta: "Đóng vai giải quyết mâu thuẫn nhóm hoặc phản ứng với tin tiêu cực trên MXH.",
              thoi_luong_de_xuat: "25 phút"
            }
          ]
        },
        {
          so_thu_tu: 5,
          ten: "Lập kế hoạch đánh giá hiệu quả hoạt động xây dựng truyền thống nhà trường",
          mo_ta: "Tính chuyên nghiệp trong tổ chức.",
          nhiem_vu: [
            {
              ten: "Bộ tiêu chí đánh giá",
              mo_ta: "Xây dựng checklist để đo lường thành công của các hoạt động tập thể trường.",
              thoi_luong_de_xuat: "25 phút"
            }
          ]
        },
        {
          so_thu_tu: 6,
          ten: "Chủ động, tự tin làm quen và thiết lập mối quan hệ",
          mo_ta: "Phát triển kỹ năng mềm quan trọng.",
          nhiem_vu: [
            {
              ten: "Phá băng (Ice-breaking)",
              mo_ta: "Thực hành các kỹ thuật bắt chuyện và giới thiệu bản thân trước người lạ.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        }
      ],
      ket_qua_can_dat: ["Thấu cảm trong giao tiếp", "Sử dụng MXH an toàn"],
      phuong_phap_goi_y: ["Đóng vai", "Dự án truyền thông"],
      tu_khoa_tim_kiem: ["nhà trường", "quan hệ", "mạng xã hội"],
      so_tiet_de_xuat: 4,
      thang_thuc_hien: [9]
    },
    {
      ma: "11.2",
      ten: "Khám phá bản thân",
      mach_noi_dung: "ban_than",
      muc_tieu: ["Nhận diện bản sắc riêng và khả năng thích ứng sự thay đổi."],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Khám phá đặc điểm riêng của bản thân",
          mo_ta: "Định vị bản thể độc nhất.",
          nhiem_vu: [
            {
              ten: "Bân đồ đặc điểm",
              mo_ta: "Liệt kê các nét tính cách, sở thích và giá trị sống mà mình trân trọng.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 2,
          ten: "Tìm hiểu về cách thể hiện sự tự tin đối với những đặc điểm riêng của bản thân",
          mo_ta: "Xây dựng lòng tự trọng.",
          nhiem_vu: [
            {
              ten: "Tự tin tỏa sáng",
              mo_ta: "Thảo luận: Tại sao cần trân trọng sự khác biệt của bản thân so với người khác?",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 3,
          ten: "Tìm hiểu cách điều chỉnh bản thân để thích ứng với sự thay đổi",
          mo_ta: "Năng lực thích ứng linh hoạt.",
          nhiem_vu: [
            {
              ten: "Kịch bản thay đổi",
              mo_ta: "Phân tích các tình huống thay đổi môi trường học tập hoặc gia đình.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 4,
          ten: "Thiết kế và trình bày sản phẩm giới thiệu đặc điểm riêng của bản thân",
          mo_ta: "Sáng tạo để giới thiệu mình.",
          nhiem_vu: [
            {
              ten: "Triển lãm 'Tôi là ai?'",
              mo_ta: "Làm video ngắn, poster hoặc vẽ tranh giới thiệu bản ngã.",
              thoi_luong_de_xuat: "25 phút"
            }
          ]
        },
        {
          so_thu_tu: 5,
          ten: "Xây dựng kế hoạch phát triển sở trường liên quan đến định hướng nghề nghiệp",
          mo_ta: "Gắn sở thích với tương lai.",
          nhiem_vu: [
            {
              ten: "Lộ trình tài năng",
              mo_ta: "Xác định 1 năng khiếu và lập kế hoạch rèn luyện để trở thành chuyên gia.",
              thoi_luong_de_xuat: "25 phút"
            }
          ]
        },
        {
          so_thu_tu: 6,
          ten: "Thể hiện sự tự tin về đặc điểm riêng trong các tình huống thực tiễn",
          mo_ta: "Hành động thực tế.",
          nhiem_vu: [
            {
              ten: "Thử thách tự tin",
              mo_ta: "Thực hành trình bày quan điểm mang tính cá nhân trước đám đông.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        }
      ],
      ket_qua_can_dat: ["Tự tin thể hiện mình", "Thích ứng nhanh"],
      phuong_phap_goi_y: ["Trắc nghiệm", "Chia sẻ nhóm"],
      tu_khoa_tim_kiem: ["điểm mạnh", "bản sắc", "thích ứng"],
      so_tiet_de_xuat: 4,
      thang_thuc_hien: [10]
    },
    {
      ma: "11.3",
      ten: "Rèn luyện bản thân",
      mach_noi_dung: "ban_than",
      muc_tieu: ["Xây dựng tính kỷ luật, rèn luyện kỹ năng và hỗ trợ bạn bè."],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Tìm hiểu cách tuân thủ kỉ luật, quy định của nhóm, lớp, tập thể",
          mo_ta: "Văn hóa tổ chức.",
          nhiem_vu: [
            {
              ten: "Giá trị của kỷ luật",
              mo_ta: "Thảo luận về vai trò của việc chấp hành nội quy đối với sự phát triển chung.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 2,
          ten: "Tuân thủ những quy định chung của tổ, lớp, chi đoàn, trường, cộng đồng",
          mo_ta: "Thực hành kỷ luật tự giác.",
          nhiem_vu: [
            {
              ten: "Cam kết 5S tại lớp",
              mo_ta: "Thực hiện đúng giờ, đúng trang phục và giữ vệ sinh chung.",
              thoi_luong_de_xuat: "15 phút"
            }
          ]
        },
        {
          so_thu_tu: 3,
          ten: "Rèn luyện và phát triển các kĩ năng còn thiếu sót của bản thân",
          mo_ta: "Tư duy phát triển (Growth Mindset).",
          nhiem_vu: [
            {
              ten: "Bù đắp lỗ hổng kỹ năng",
              mo_ta: "Xác định 1 kỹ năng yếu (v.d: Thuyết trình) và tập luyện hàng ngày.",
              thoi_luong_de_xuat: "25 phút"
            }
          ]
        },
        {
          so_thu_tu: 4,
          ten: "Khích lệ, động viên bạn bè phát huy khả năng, cố gắng",
          mo_ta: "Trí tuệ cảm xúc (EQ) xã hội.",
          nhiem_vu: [
            {
              ten: "Người truyền cảm hứng",
              mo_ta: "Thực hành ghi nhận và khen ngợi sự tiến bộ của bạn bè.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 5,
          ten: "Giúp bạn bè xác định mục tiêu, xây dựng kế hoạch tự hoàn thiện",
          mo_ta: "Kỹ năng tư vấn và đồng hành.",
          nhiem_vu: [
            {
              ten: "Đôi bạn cùng tiến",
              mo_ta: "Hướng dẫn bạn lập kế hoạch SMART cho mục tiêu học tập/rèn luyện.",
              thoi_luong_de_xuat: "25 phút"
            }
          ]
        }
      ],
      ket_qua_can_dat: ["Sống kỉ luật", "Biết giúp đỡ bạn bè"],
      phuong_phap_goi_y: ["Lập kế hoạch", "Thảo luận"],
      tu_khoa_tim_kiem: ["kỉ luật", "kỹ năng", "hỗ trợ"],
      so_tiet_de_xuat: 4,
      thang_thuc_hien: [11]
    },
    {
      ma: "11.4",
      ten: "Trách nhiệm với gia đình",
      mach_noi_dung: "xa_hoi",
      muc_tieu: ["Thể hiện sự quan tâm, chăm sóc và quản lý tài chính gia đình."],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Tìm hiểu những việc cần làm thể hiện sự quan tâm, chăm sóc thường xuyên đến người thân",
          mo_ta: "Ngôn ngữ yêu thương trong gia đình.",
          nhiem_vu: [
            {
              ten: "Nhận thức nhu cầu người thân",
              mo_ta: "Quan sát và chia sẻ những mong muốn về tinh thần/sức khỏe của cha mẹ, ông bà.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 2,
          ten: "Biện pháp xây dựng và phát triển mối quan hệ với mọi người trong gia đình",
          mo_ta: "Kết nối đa thế hệ.",
          nhiem_vu: [
            {
              ten: "Gắn kết bằng đối thoại",
              mo_ta: "Thảo luận cách hóa giải bất đồng ý kiến giữa các thế hệ thường gặp.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 3,
          ten: "Chia sẻ những việc làm đã thể hiện sự quan tâm, chăm sóc người thân",
          mo_ta: "Lan tỏa giá trị hiếu thảo.",
          nhiem_vu: [
            {
              ten: "Nhật ký yêu thương",
              mo_ta: "Kể về một tình huống cụ thể bạn đã giúp đỡ hoặc động viên người thân.",
              thoi_luong_de_xuat: "15 phút"
            }
          ]
        },
        {
          so_thu_tu: 4,
          ten: "Thực hiện mục tiêu tiết kiệm tài chính của gia đình",
          mo_ta: "Trách nhiệm kinh tế.",
          nhiem_vu: [
            {
              ten: "Kế hoạch tiết kiệm hộ gia đình",
              mo_ta: "Đề xuất cắt giảm các chi phí lãng phí: Điện, nước, mua sắm không cần thiết.",
              thoi_luong_de_xuat: "25 phút"
            }
          ]
        }
      ],
      ket_qua_can_dat: ["Gắn kết gia đình", "Có trách nhiệm tài chính"],
      phuong_phap_goi_y: ["Đóng vai", "Viết nhật ký"],
      tu_khoa_tim_kiem: ["gia đình", "tài chính", "chăm sóc"],
      so_tiet_de_xuat: 3,
      thang_thuc_hien: [12]
    },
    {
      ma: "11.5",
      ten: "Phát triển cộng đồng",
      mach_noi_dung: "xa_hoi",
      muc_tieu: ["Xây dựng các mối quan hệ xã hội tích cực", "Ứng xử văn minh trên mạng xã hội", "Lập kế hoạch và thực hiện dự án cộng đồng theo chuẩn 5W1H"],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Tìm hiểu biện pháp xây dựng và phát triển cộng đồng",
          mo_ta: "Khảo sát các mô hình 'Ngày Chủ nhật xanh', 'Bếp ăn tình thương'.",
          nhiem_vu: [
            {
              ten: "Phân tích ý nghĩa liên kết xã hội",
              mo_ta: "Đánh giá tác động của các hoạt động tình nguyện đến sự gắn kết tại địa phương.",
              thoi_luong_de_xuat: "20 phút"
            },
            {
              ten: "Khảo sát nhu cầu cộng đồng nội khu",
              mo_ta: "Xác định các vấn đề cần hỗ trợ tại nơi sinh sống/trường học (Vệ sinh, an ninh, hỗ trợ người già).",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 2,
          ten: "Xây dựng văn hóa mạng xã hội văn minh",
          mo_ta: "Nhận diện hành vi ứng xử văn minh và an toàn số.",
          nhiem_vu: [
            {
              ten: "Xử lý bạo lực mạng (Anti-group)",
              mo_ta: "Thảo luận về tôn trọng bản quyền, tránh Body shaming/Hate speech và kiểm chứng thông tin.",
              thoi_luong_de_xuat: "25 phút"
            },
            {
              ten: "Thiết kế bộ quy tắc ứng xử Netiquette",
              mo_ta: "Lập danh sách các việc Nên và Không nên làm khi tham gia thảo luận công khai trên mạng.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 3,
          ten: "Lập và triển khai kế hoạch hoạt động cộng đồng (5W1H)",
          mo_ta: "Thiết kế dự án thực tế.",
          nhiem_vu: [
            {
              ten: "Thiết kế dự án 5W1H",
              mo_ta: "Lập kế hoạch chi tiết cho dự án 'Thu gom pin cũ' hoặc 'Tủ sách yêu thương'.",
              thoi_luong_de_xuat: "30 phút"
            },
            {
              ten: "Vận động và truyền thông dự án",
              mo_ta: "Tạo poster/clips ngắn để kêu gọi mọi người cùng tham gia dự án cộng đồng của nhóm.",
              thoi_luong_de_xuat: "25 phút"
            }
          ]
        }
      ],
      ket_qua_can_dat: ["Ứng xử văn minh trên mạng", "Thành thạo lập dự án 5W1H", "Có trách nhiệm với cộng đồng"],
      phuong_phap_goi_y: ["Dự án", "Thảo luận", "Làm việc nhóm"],
      tu_khoa_tim_kiem: ["cộng đồng", "5W1H", "văn hóa mạng", "tình nguyện"],
      so_tiet_de_xuat: 4,
      thang_thuc_hien: [1]
    },
    {
      ma: "11.6",
      ten: "Bảo tồn cảnh quan thiên nhiên",
      mach_noi_dung: "tu_nhien",
      muc_tieu: ["Đánh giá thực trạng bảo tồn danh thắng", "Phân tích mâu thuẫn giữa phát triển kinh tế và bảo tồn di sản"],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Lập kế hoạch đánh giá thực trạng bảo tồn",
          mo_ta: "Công cụ khảo sát: Trash-track, sự xâm lấn, biển báo.",
          nhiem_vu: [
            {
              ten: "Thiết kế phiếu đánh giá danh thắng",
              mo_ta: "Xây dựng checklist: Hiện trạng rác thải (Thấp/TB/Cao), Hệ thống biển báo, Mức độ xâm lấn của dịch vụ hàng quán.",
              thoi_luong_de_xuat: "25 phút"
            }
          ]
        },
        {
          so_thu_tu: 2,
          ten: "Tuyên truyền và thực hiện việc làm bảo tồn",
          mo_ta: "Kết nối du lịch với bảo vệ môi trường.",
          nhiem_vu: [
            {
              ten: "Kịch bản thuyết minh xanh",
              mo_ta: "Xây dựng bài thuyết minh du lịch (Guide script) lồng ghép thông điệp bảo vệ di sản văn hóa/thiên nhiên.",
              thoi_luong_de_xuat: "25 phút"
            }
          ]
        }
      ],
      ket_qua_can_dat: ["Có tư duy phản biện kinh tế-môi trường", "Biết lập báo cáo điều tra"],
      phuong_phap_goi_y: ["Điều tra", "Thuyết trình"],
      tu_khoa_tim_kiem: ["cảnh quan", "bảo tồn", "du lịch xanh"],
      so_tiet_de_xuat: 3,
      thang_thuc_hien: [2]
    },
    {
      ma: "11.7",
      ten: "Bảo vệ môi trường",
      mach_noi_dung: "tu_nhien",
      muc_tieu: ["Kiểm toán tài nguyên gia đình", "Phân tích tác động của sản xuất bền vững", "Đề xuất giải pháp bảo vệ môi trường toàn diện"],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Tìm hiểu thực trạng khai thác tài nguyên và ô nhiễm",
          mo_ta: "Dữ liệu suy giảm rừng và ô nhiễm nguồn nước.",
          nhiem_vu: [
            {
              ten: "Báo cáo tài nguyên địa phương",
              mo_ta: "Thu thập số liệu về sự sụt giảm nguồn nước ngầm hoặc diện tích cây xanh tại nơi sinh sống.",
              thoi_luong_de_xuat: "20 phút"
            },
            {
              ten: "Phân tích chuỗi cung ứng 'bẩn'",
              mo_ta: "Thảo luận về tác động của các ngành công nghiệp thời trang nhanh hoặc đồ nhựa dùng một lần.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 2,
          ten: "Sử dụng năng lượng tiết kiệm và hiệu quả",
          mo_ta: "Kiểm toán năng lượng tại gia đình.",
          nhiem_vu: [
            {
              ten: "Kết toán hóa đơn năng lượng",
              mo_ta: "Phân tích hóa đơn điện/nước gia đình trong 3 tháng và xác định nguyên nhân lãng phí.",
              thoi_luong_de_xuat: "25 phút"
            },
            {
              ten: "Thiết kế nhà thông minh/tiết kiệm",
              mo_ta: "Đề xuất các biện pháp lắp đặt hoặc thay đổi thói quen để giảm tiêu thụ năng lượng.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 3,
          ten: "Thực hiện các giải pháp bảo vệ môi trường",
          mo_ta: "Giải pháp công nghệ và sinh học.",
          nhiem_vu: [
            {
              ten: "Mô hình sản xuất sạch - Compost",
              mo_ta: "Thiết kế quy trình xử lý rác thải hữu cơ thành phân bón tại hộ gia đình/trường học.",
              thoi_luong_de_xuat: "25 phút"
            },
            {
              ten: "Chiến dịch truyền thông 'Sống Xanh'",
              mo_ta: "Tạo thông điệp hình ảnh/video về việc tái chế sáng tạo (Upcycling).",
              thoi_luong_de_xuat: "25 phút"
            }
          ]
        }
      ],
      ket_qua_can_dat: ["Biết kiểm toán năng lượng", "Có thói quen tiêu dùng bền vững", "Biết xử lý rác thải"],
      phuong_phap_goi_y: ["Kiểm toán", "Dự án", "Thực hành"],
      tu_khoa_tim_kiem: ["môi trường", "năng lượng", "tái chế", "bền vững"],
      so_tiet_de_xuat: 4,
      thang_thuc_hien: [3]
    },
    {
      ma: "11.8",
      ten: "Các nhóm nghề cơ bản và yêu cầu của thị trường lao động",
      mach_noi_dung: "huong_nghiep",
      muc_tieu: ["Phân loại các nhóm nghề theo chuẩn ISCO", "Đánh giá yêu cầu của nhà tuyển dụng và xu hướng việc làm 4.0"],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Phân loại các nhóm nghề cơ bản",
          mo_ta: "Hệ thống hóa thế giới nghề nghiệp.",
          nhiem_vu: [
            {
              ten: "Bản đồ nghề nghiệp ISCO",
              mo_ta: "Phân loại nghề theo các nhóm chuẩn Việt Nam và quốc tế.",
              thoi_luong_de_xuat: "25 phút"
            },
            {
              ten: "Trò chơi 'Giải mã nghề nghiệp'",
              mo_ta: "Đoán tên nghề và yêu cầu đặc thù của các nghề mới nổi.",
              thoi_luong_de_xuat: "15 phút"
            }
          ]
        },
        {
          so_thu_tu: 2,
          ten: "Yêu cầu của nhà tuyển dụng trong kỷ nguyên số",
          mo_ta: "Sự dịch chuyển từ lao động thủ công sang trí óc.",
          nhiem_vu: [
            {
              ten: "Phân tích mô tả công việc (JD)",
              mo_ta: "Đọc và bóc tách các yêu cầu về kỹ năng cứng và kỹ năng mềm của 1 vị trí cụ thể.",
              thoi_luong_de_xuat: "25 phút"
            },
            {
              ten: "Kỹ năng thích ứng 4.0",
              mo_ta: "Thảo luận về vai trò của tự học và khả năng sử dụng công nghệ (AI, Big Data) trong công việc.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 3,
          ten: "Khám phá thị trường lao động thực tế",
          mo_ta: "Tìm hiểu thông tin tuyển dụng thực tế.",
          nhiem_vu: [
            {
              ten: "Sưu tầm và phân loại tin tuyển dụng",
              mo_ta: "Tìm kiếm trên các trang uy tín và phân tích mức lương, chế độ đãi ngộ của ngành quan tâm.",
              thoi_luong_de_xuat: "30 phút"
            }
          ]
        }
      ],
      ket_qua_can_dat: ["Hiểu hệ thống nghề nghiệp", "Am hiểu yêu cầu thị trường", "Cập nhật xu hướng 4.0"],
      phuong_phap_goi_y: ["Nghiên cứu", "Phân tích JD", "Thảo luận"],
      tu_khoa_tim_kiem: ["nghề cơ bản", "thị trường lao động", "ISCO", "tuyển dụng"],
      so_tiet_de_xuat: 4,
      thang_thuc_hien: [4]
    },
    {
      ma: "11.9",
      ten: "Rèn luyện phẩm chất, năng lực phù hợp với nhóm nghề lựa chọn",
      mach_noi_dung: "huong_nghiep",
      muc_tieu: ["Sử dụng trắc nghiệm mật mã Holland (RIASEC)", "Tự đánh giá và xây dựng lộ trình rèn luyện chuyên sâu định hướng nghề"],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Tự đánh giá sự phù hợp với nhóm nghề",
          mo_ta: "Công cụ hướng nghiệp chuẩn quốc tế.",
          nhiem_vu: [
            {
              ten: "Thực hành trắc nghiệm RIASEC",
              mo_ta: "Đối chiếu mã RIASEC cá nhân với đặc thù nhóm nghề định chọn.",
              thoi_luong_de_xuat: "25 phút"
            },
            {
              ten: "Phân tích Profile chuyên gia",
              mo_ta: "Tìm hiểu tiểu sử và tố chất của một người thành đạt trong nghề để học tập.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 2,
          ten: "Thiết kế lộ trình phát triển năng lực nghề nghiệp",
          mo_ta: "Thiết kế lộ trình năng lực.",
          nhiem_vu: [
            {
              ten: "Bản đồ rèn luyện năng lực (Gap Analysis)",
              mo_ta: "Xác định khoảng cách giữa năng lực hiện tại and yêu cầu nghề nghiệp -> Đề xuất hành động.",
              thoi_luong_de_xuat: "30 phút"
            },
            {
              ten: "Thực hành kỹ năng chuyên biệt",
              mo_ta: "Tập dượt một kỹ năng cốt lõi của nghề (VD: Thiết kế đồ họa cơ bản, Kỹ năng thuyết phục khách hàng).",
              thoi_luong_de_xuat: "25 phút"
            }
          ]
        }
      ],
      ket_qua_can_dat: ["Hiểu rõ tố chất cá nhân", "Có bản kế hoạch rèn luyện khoa học"],
      phuong_phap_goi_y: ["Trắc nghiệm", "Lập kế hoạch", "Thực hành"],
      tu_khoa_tim_kiem: ["RIASEC", "năng lực nghề nghiệp", "kế hoạch cá nhân"],
      so_tiet_de_xuat: 4,
      thang_thuc_hien: [5]
    },
    {
      ma: "11.10",
      ten: "Xây dựng và thực hiện kế hoạch học tập theo định hướng nghề",
      mach_noi_dung: "huong_nghiep",
      muc_tieu: ["Tham vấn hướng nghiệp chuyên sâu", "Thiết lập lộ trình học tập tối ưu cho năm lớp 12"],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Phân tích hệ thống trường và cơ hội đào tạo",
          mo_ta: "Đại học, Cao đẳng, Du học và Đào tạo nghề.",
          nhiem_vu: [
            {
              ten: "So sánh các phương án đào tạo",
              mo_ta: "Phân tích ma trận: Độ khó xét tuyển - Chi phí - Cơ hội việc làm.",
              thoi_luong_de_xuat: "30 phút"
            },
            {
              ten: "Xác định khối thi/tổ hợp môn học",
              mo_ta: "Lựa chọn chiến thuật tập trung cho năm lớp 12 dựa trên thế mạnh cá nhân.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 2,
          ten: "Thực hành tham vấn hướng nghiệp",
          mo_ta: "Quy trình kết nối với chuyên gia/thầy cô.",
          nhiem_vu: [
            {
              ten: "Phiên tham vấn mô phỏng (Mock Coaching)",
              mo_ta: "Học sinh đóng vai người tư vấn và người cần tư vấn để hiểu cách giải quyết các nút thắt tâm lý chọn nghề.",
              thoi_luong_de_xuat: "25 phút"
            }
          ]
        },
        {
          so_thu_tu: 3,
          ten: "Thiết lập bản đồ mục tiêu lớp 12",
          mo_ta: "Lộ trình học tập chi tiết.",
          nhiem_vu: [
            {
              ten: "Xây dựng bảng tiến độ (Gantt chart cá nhân)",
              mo_ta: "Xác định các mốc học tập, ôn luyện và nộp hồ sơ cho năm học tới.",
              thoi_luong_de_xuat: "30 phút"
            }
          ]
        }
      ],
      ket_qua_can_dat: ["Quyết tâm cho năm cuối cấp", "Biết khai thác nguồn lực hỗ trợ"],
      phuong_phap_goi_y: ["Coaching", "Tư vấn", "Lập kế hoạch"],
      tu_khoa_tim_kiem: ["kế hoạch 12", "tham vấn", "định hướng chuyên sâu"],
      so_tiet_de_xuat: 3,
      thang_thuc_hien: [5]
    },
  ],
};

// ============================================================================
// PHẦN 5: CHƯƠNG TRÌNH LỚP 12 - TRƯỞNG THÀNH VÀ CHUYỂN TIẾP
// ============================================================================

export const CHUONG_TRINH_LOP_12: ChuongTrinhKhoi = {
  khoi: 12,
  chu_de_trong_tam: "Trưởng thành và Chuyển tiếp",
  mo_ta_tong_quan:
    "Lớp 12 là năm cuối cấp, đánh dấu sự chuyển tiếp từ học sinh phổ thông sang người trưởng thành. Trọng tâm là Career Adaptability - khả năng thích ứng nghề nghiệp và chuẩn bị cho cuộc sống tự lập.",

  dac_diem_tam_ly_lua_tuoi: [
    "Áp lực cao từ kỳ thi tốt nghiệp và xét tuyển đại học",
    "Phải đưa ra quyết định quan trọng về nghề nghiệp",
    "Chuẩn bị tâm lý cho cuộc sống tự lập sau tốt nghiệp",
    "Tâm lý vừa háo hức vừa lo lắng về tương lai",
    "Mong muốn được công nhận là người trưởng thành",
  ],

  muc_tieu_phat_trien_nang_luc: [
    "Career Adaptability: Thích ứng nghề nghiệp, chuẩn bị cho sự thay đổi",
    "Decision Making: Ra quyết định quan trọng về học tập, nghề nghiệp",
    "Life Skills: Kỹ năng sống độc lập - tài chính, nấu ăn, quản lý nhà",
    "Citizenship: Thực hiện quyền và nghĩa vụ công dân trưởng thành",
  ],

  chu_de: [
    {
      ma: "12.1",
      ten: "Phát triển các mối quan hệ tốt đẹp với thầy cô và các bạn",
      mach_noi_dung: "xa_hoi",
      muc_tieu: ["Nuôi dưỡng, mở rộng các mối quan hệ tích cực", "Hợp tác trong hoạt động chung", "Xây dựng truyền thống nhà trường"],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Tìm hiểu cách nuôi dưỡng, giữ gìn và mở rộng các mối quan hệ tốt đẹp với thầy cô và bạn bè",
          mo_ta: "Nghệ thuật giao tiếp và gắn kết bền vững.",
          nhiem_vu: [
            {
              ten: "Giá trị của sự chân thành",
              mo_ta: "Thảo luận về cách giữ lửa cho các tình bạn và sự tôn kính thầy cô sau khi ra trường.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 2,
          ten: "Tìm hiểu về cách hợp tác với mọi người trong hoạt động chung",
          mo_ta: "Kỹ năng làm việc nhóm đỉnh cao.",
          nhiem_vu: [
            {
              ten: "Hợp tác để thành công",
              mo_ta: "Phân tích các yếu tố: Lắng nghe, chia sẻ trách nhiệm, giải quyết mâu thuẫn nhóm.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 3,
          ten: "Thể hiện cách nuôi dưỡng, giữ gìn và mở rộng mối quan hệ tốt đẹp với thầy cô",
          mo_ta: "Chuẩn bị cho lễ ra trường.",
          nhiem_vu: [
            {
              ten: "Tri ân người lái đò",
              mo_ta: "Thực hành viết thư cảm ơn, tổ chức các buổi gặp mặt ấm cúng.",
              thoi_luong_de_xuat: "15 phút"
            }
          ]
        },
        {
          so_thu_tu: 4,
          ten: "Phân tích dư luận xã hội về quan hệ bạn bè trên mạng xã hội",
          mo_ta: "Tư duy phản biện trước dư luận.",
          nhiem_vu: [
            {
              ten: "Lập trường trước đám đông",
              mo_ta: "Thảo luận về các scandal bạn bè trên mạng và cách giữ lập trường đúng đắn.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 5,
          ten: "Thực hiện các hoạt động xây dựng truyền thống nhà trường",
          mo_ta: "Ghi dấu ấn khối 12.",
          nhiem_vu: [
            {
              ten: "Dự án tiếp nối truyền thống",
              mo_ta: "Lập kế hoạch tổ chức sự kiện chào đón khóa dưới hoặc tặng quà lưu niệm cho trường.",
              thoi_luong_de_xuat: "25 phút"
            }
          ]
        }
      ],
      ket_qua_can_dat: ["Thấu cảm sâu sắc", "Hợp tác hiệu quả", "Tự hào về trường"],
      phuong_phap_goi_y: ["Trải nghiệm", "Viết sáng tạo"],
      tu_khoa_tim_kiem: ["quan hệ", "tri ân", "nhà trường"],
      so_tiet_de_xuat: 4,
      thang_thuc_hien: [9]
    },
    {
      ma: "12.2",
      ten: "Tôi trưởng thành",
      mach_noi_dung: "ban_than",
      muc_tieu: ["Nhận diện sự trưởng thành qua 3 năm", "Bồi dưỡng phẩm chất ý chí và tư duy độc lập", "Khẳng định giá trị bản thân trước tương lai"],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Nhận diện sự trưởng thành cá nhân",
          mo_ta: "Soi chiếu sự thay đổi từ lớp 10 đến lớp 12.",
          nhiem_vu: [
            {
              ten: "Chân dung tuổi 18: Trước và Sau",
              mo_ta: "Viết bài luận ngắn hoặc làm sơ đồ tư duy so sánh quan điểm sống, cách ứng xử và trách nhiệm của bản thân qua 3 năm.",
              thoi_luong_de_xuat: "30 phút"
            }
          ]
        },
        {
          so_thu_tu: 2,
          ten: "Phẩm chất ý chí và Động lực nội tại",
          mo_ta: "Bồi đắp sức mạnh tinh thần cho giai đoạn vượt vũ môn.",
          nhiem_vu: [
            {
              ten: "Phân tích tấm gương nghị lực",
              mo_ta: "Kể về một nhân vật thực tế đã vượt qua nghịch cảnh để thành công, rút ra bộ từ khóa 'vượt khó' cho mình.",
              thoi_luong_de_xuat: "20 phút"
            },
            {
              ten: "Xây dựng hệ thống kỷ luật tự thân",
              mo_ta: "Thiết lập các thói quen tích cực để duy trì sự tập trung cao độ trong học tập.",
              thoi_luong_de_xuat: "25 phút"
            }
          ]
        },
        {
          so_thu_tu: 3,
          ten: "Tư duy độc lập và Bản lĩnh cá nhân",
          mo_ta: "Khẳng định cái tôi tỉnh táo trước đám đông.",
          nhiem_vu: [
            {
              ten: "Tranh luận: Áp lực đồng lứa (Peer Pressure)",
              mo_ta: "Thảo luận cách bảo vệ quan điểm cá nhân khi đa số bạn bè có xu hướng khác biệt.",
              thoi_luong_de_xuat: "25 phút"
            },
            {
              ten: "Ra quyết định dựa trên hệ giá trị",
              mo_ta: "Thực hành quy trình 5 bước để đưa ra một quyết định quan trọng (VD: Chọn trường, Chọn khối).",
              thoi_luong_de_xuat: "25 phút"
            }
          ]
        }
      ],
      ket_qua_can_dat: ["Sống trách nhiệm", "Có ý chí mạnh mẽ", "Tư duy độc lập"],
      phuong_phap_goi_y: ["Trắc nghiệm tâm lý", "Thảo luận", "Viết sáng tạo"],
      tu_khoa_tim_kiem: ["trưởng thành", "ý chí", "tư duy độc lập", "18 tuổi"],
      so_tiet_de_xuat: 4,
      thang_thuc_hien: [10]
    },
    {
      ma: "12.3",
      ten: "Hoàn thiện bản thân",
      mach_noi_dung: "ban_than",
      muc_tieu: ["Tự đánh giá và nâng cấp các kỹ năng sinh tồn", "Phát triển năng lực theo định hướng nghề nghiệp", "Xây dựng hình ảnh cá nhân chuyên nghiệp"],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Kỹ năng sinh tồn và Tự phục vụ nâng cao",
          mo_ta: "Sẵn sàng cho cuộc sống độc lập (Ra ở riêng/Ở ký túc xá).",
          nhiem_vu: [
            {
              ten: "Kiểm tra năng lực tự quản",
              mo_ta: "Đánh giá mức độ thành thạo về: Nấu ăn dinh dưỡng, Quản lý tài chính cá nhân, Sơ cứu y tế cơ bản.",
              thoi_luong_de_xuat: "30 phút"
            },
            {
              ten: "Quản lý thời gian và stress",
              mo_ta: "Áp dụng ma trận Eisenhower hoặc kỹ thuật Pomodoro để tối ưu hóa việc học tập và nghỉ ngơi.",
              thoi_luong_de_xuat: "25 phút"
            }
          ]
        },
        {
          so_thu_tu: 2,
          ten: "Nâng cấp năng lực nghề nghiệp tương lai",
          mo_ta: "Giai đoạn nước rút bồi đắp kiến thức chuyên ngành.",
          nhiem_vu: [
            {
              ten: "Dự án: '100 ngày thay đổi'",
              mo_ta: "Cam kết học một kỹ năng bổ trợ (VD: Tin học văn phòng, Ngoại ngữ chuyên ngành) và báo cáo kết quả theo tuần.",
              thoi_luong_de_xuat: "45 phút"
            },
            {
              ten: "Tìm kiếm cơ hội trải nghiệm nghề",
              mo_ta: "Lập danh sách các hoạt động ngoại khóa, câu lạc bộ liên quan đến ngành nghề mong muốn.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 3,
          ten: "Xây dựng hình ảnh cá nhân (Personal Branding)",
          mo_ta: "Định vị bản thân trên không gian mạng và đời thực.",
          nhiem_vu: [
            {
              ten: "Dọn dẹp dấu chân kỹ thuật số (Digital Footprint)",
              mo_ta: "Xây dựng profile mạng xã hội hướng tới sự chuyên nghiệp và tích cực.",
              thoi_luong_de_xuat: "30 phút"
            },
            {
              ten: "Thực hành phong thái và giao tiếp thuyết phục",
              mo_ta: "Rèn luyện ngôn ngữ cơ thể, cách chào hỏi và trình bày trước đám đông.",
              thoi_luong_de_xuat: "30 phút"
            }
          ]
        }
      ],
      ket_qua_can_dat: ["Thành thạo kỹ năng tự lập", "Nâng cao năng lực chuyên môn", "Có hình ảnh cá nhân uy tín"],
      phuong_phap_goi_y: ["Coaching", "Luyện tập", "Dự án cá nhân"],
      tu_khoa_tim_kiem: ["hoàn thiện", "tự lập", "kỹ năng", "thời gian"],
      so_tiet_de_xuat: 5,
      thang_thuc_hien: [11]
    },
    {
      ma: "12.4",
      ten: "Trách nhiệm với gia đình",
      mach_noi_dung: "xa_hoi",
      muc_tieu: [
        "Thực hiện trách nhiệm của người trưởng thành trong việc gánh vác công việc gia đình",
        "Chuẩn bị tâm lý và các kỹ năng sinh tồn cần thiết khi sinh sống xa nhà",
        "Xây dựng và duy trì nếp sống gia đình văn minh, hạnh phúc"
      ],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Thực hiện trách nhiệm của người trưởng thành trong gia đình",
          mo_ta: "Chuyển từ vai trò được chăm sóc sang vai trò gánh vác.",
          nhiem_vu: [
            {
              ten: "Gánh vác việc lớn trong gia đình",
              mo_ta: "Hỗ trợ cha mẹ quản lý chi tiêu định kỳ hoặc tham gia quyết định các công việc trọng đại của gia đình.",
              thoi_luong_de_xuat: "25 phút"
            }
          ]
        },
        {
          so_thu_tu: 2,
          ten: "Chuẩn bị tâm lý và kỹ năng khi sinh sống xa nhà",
          mo_ta: "Trang bị hành trang cho cuộc sống sinh viên tự lập.",
          nhiem_vu: [
            {
              ten: "Kỹ năng sống độc lập cơ bản",
              mo_ta: "Thực hành: Lên thực đơn tiết kiệm, cách xử lý sự cố điện nước đơn giản, an ninh phòng trọ.",
              thoi_luong_de_xuat: "20 phút"
            },
            {
              ten: "Quản lý tài chính cá nhân khi xa nhà",
              mo_ta: "Thiết lập ngân sách hàng tháng: Tiền nhà, tiền ăn, học phí và quỹ dự phòng.",
              thoi_luong_de_xuat: "25 phút"
            }
          ]
        },
        {
          so_thu_tu: 3,
          ten: "Dự án: 'Bữa cơm sum họp - Gắn kết yêu thương'",
          mo_ta: "Thực hành vai trò người tổ chức cuộc sống gia đình.",
          nhiem_vu: [
            {
              ten: "Thiết kế và tổ chức bữa cơm gia đình",
              mo_ta: "Tự lên kế hoạch, đi chợ và chuẩn bị một bữa tối cho gia đình, kết hợp đối thoại chia sẻ dự định tương lai.",
              thoi_luong_de_xuat: "45 phút"
            }
          ]
        },
        {
          so_thu_tu: 4,
          ten: "Xây dựng truyền thống gia đình hiện đại",
          mo_ta: "Giữ gìn giá trị cũ và kiến tạo giá trị mới.",
          nhiem_vu: [
            {
              ten: "Thiết kế 'Gia phả số' hoặc 'Album kỷ niệm số'",
              mo_ta: "Sử dụng công nghệ để lưu trữ lịch sử gia đình, tạo sự kết nối giữa các thế hệ.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        }
      ],
      ket_qua_can_dat: ["Biết gánh vác trách nhiệm", "Sẵn sàng cho cuộc sống xa nhà", "Thành thạo kỹ năng tự phục vụ"],
      phuong_phap_goi_y: ["Thảo luận", "Lập dự án", "Đóng vai"],
      tu_khoa_tim_kiem: ["gia đình", "tự lập", "kỹ năng sinh tồn", "quản lý tài chính"],
      so_tiet_de_xuat: 4,
      thang_thuc_hien: [12]
    },
    {
      ma: "12.5",
      ten: "Xây dựng cộng đồng và hội nhập quốc tế",
      mach_noi_dung: "xa_hoi",
      muc_tieu: ["Hợp tác quốc tế và xử lý 'Sốc văn hóa'", "Giải quyết vấn đề xã hội bằng dự án chuyên nghiệp", "Phát triển tư duy công dân toàn cầu"],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Hội nhập quốc tế và đa dạng văn hóa",
          mo_ta: "Tư duy công dân toàn cầu chân chính.",
          nhiem_vu: [
            {
              ten: "Thuyết trình văn hóa ASEAN",
              mo_ta: "Chọn 1 quốc gia ASEAN, giới thiệu nét văn hóa: Chào hỏi, ẩm thực, cấm kỵ.",
              thoi_luong_de_xuat: "25 phút"
            },
            {
              ten: "Kỹ năng xử lý 'Sốc văn hóa'",
              mo_ta: "Thực hành các tình huống giả định khi học tập/làm việc tại môi trường đa quốc gia.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 2,
          ten: "Dự án tình nguyện cộng đồng (Nâng cao)",
          mo_ta: "Kỹ năng quản trị dự án chuyên nghiệp.",
          nhiem_vu: [
            {
              ten: "Thiết kế dự án cộng đồng 12",
              mo_ta: "Lập kế hoạch với: Gantt chart (tiến độ), Quản lý rủi ro và Báo cáo tài chính minh bạch.",
              thoi_luong_de_xuat: "30 phút"
            },
            {
              ten: "Vận động nguồn lực (Fundraising)",
              mo_ta: "Xây dựng kế hoạch kêu gọi hỗ trợ từ các tổ chức xã hội hoặc cộng đồng.",
              thoi_luong_de_xuat: "25 phút"
            }
          ]
        }
      ],
      ket_qua_can_dat: ["Tôn trọng sự khác biệt", "Thành thạo quản lý dự án", "Tự tin hội nhập"],
      phuong_phap_goi_y: ["Lập dự án", "Nghiên cứu", "Case study"],
      tu_khoa_tim_kiem: ["cộng đồng", "hội nhập", "sốc văn hóa", "Gantt"],
      so_tiet_de_xuat: 4,
      thang_thuc_hien: [1]
    },
    {
      ma: "12.6",
      ten: "Chung tay gìn giữ, bảo tồn cảnh quan thiên nhiên",
      mach_noi_dung: "tu_nhien",
      muc_tieu: ["Thực hiện các giải pháp sáng tạo để bảo tồn danh thắng."],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Tìm hiểu các giải pháp tích cực, sáng tạo trong việc bảo tồn cảnh quan thiên nhiên",
          mo_ta: "Ứng dụng công nghệ và ý tưởng mới.",
          nhiem_vu: [
            {
              ten: "Bảo tồn 4.0",
              mo_ta: "Sử dụng mạng xã hội, VR/AR để quảng bá và giáo dục bảo tồn danh thắng.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 2,
          ten: "Tìm hiểu về hoạt động tuyên truyền trong cộng đồng",
          mo_ta: "Kỹ năng vận động xã hội.",
          nhiem_vu: [
            {
              ten: "Chiến dịch lan tỏa",
              mo_ta: "Thiết kế poster, video clip ngắn truyền cảm hứng bảo vệ thiên nhiên.",
              thoi_luong_de_xuat: "25 phút"
            }
          ]
        },
        {
          so_thu_tu: 3,
          ten: "Thực hiện giải pháp sáng tạo bảo tồn cảnh quan",
          mo_ta: "Hành động thực tế tại địa phương.",
          nhiem_vu: [
            {
              ten: "Ngày hội danh thắng xanh",
              mo_ta: "Tổ chức một buổi dọn dẹp hoặc trồng cây kết hợp tuyên truyền tại di tích.",
              thoi_luong_de_xuat: "25 phút"
            }
          ]
        }
      ],
      ket_qua_can_dat: ["Sáng tạo trong bảo tồn", "Tuyên truyền hiệu quả"],
      phuong_phap_goi_y: ["Dự án", "Truyền thông"],
      tu_khoa_tim_kiem: ["cảnh quan", "bảo tồn", "sáng tạo"],
      so_tiet_de_xuat: 3,
      thang_thuc_hien: [2]
    },
    {
      ma: "12.7",
      ten: "Bảo vệ thế giới tự nhiên",
      mach_noi_dung: "tu_nhien",
      muc_tieu: ["Hành động vì đa dạng sinh học", "Lan tỏa lối sống xanh và thích ứng biến đổi khí hậu"],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Tìm hiểu tác động của biến đổi khí hậu địa phương",
          mo_ta: "Kết nối hiện tượng toàn cầu với thực tế nơi sinh sống.",
          nhiem_vu: [
            {
              ten: "Xây dựng kịch bản ứng phó thời tiết cực đoan",
              mo_ta: "Phân tích tác động của hạn hán, lũ lụt hoặc ô nhiễm tại địa phương và đề xuất các biện pháp thích nghi.",
              thoi_luong_de_xuat: "25 phút"
            }
          ]
        },
        {
          so_thu_tu: 2,
          ten: "Bảo tồn đa dạng sinh học",
          mo_ta: "Hành động bảo vệ các giống loài quý hiếm.",
          nhiem_vu: [
            {
              ten: "Chiến dịch: 'Nói không với sản phẩm hoang dã'",
              mo_ta: "Ký cam kết và thực hành tuyên truyền thay đổi hành vi tiêu dùng cho người thân và cộng đồng.",
              thoi_luong_de_xuat: "25 phút"
            },
            {
              ten: "Khám phá danh sách Đỏ Việt Nam",
              mo_ta: "Tìm hiểu về 1 loài động/thực vật đặc hữu của vùng miền và các mối đe dọa chúng đang đối mặt.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 3,
          ten: "Duy trì lối sống thuận tự nhiên",
          mo_ta: "Thực hành sống xanh mỗi ngày.",
          nhiem_vu: [
            {
              ten: "Thử thách 7 ngày giảm thiểu rác nhựa",
              mo_ta: "Ghi nhật ký thay đổi thói quen sử dụng đồ nhựa trong sinh hoạt cá nhân.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        }
      ],
      ket_qua_can_dat: ["Am hiểu về môi trường", "Có kỹ năng thích ứng", "Biết bảo vệ đa dạng sinh học"],
      phuong_phap_goi_y: ["Case study", "Cam kết", "Dự án nhỏ"],
      tu_khoa_tim_kiem: ["thế giới tự nhiên", "biến đổi khí hậu", "đa dạng sinh học", "sống xanh"],
      so_tiet_de_xuat: 3,
      thang_thuc_hien: [2]
    },
    {
      ma: "12.8",
      ten: "Nghề nghiệp và yêu cầu của xã hội hiện đại",
      mach_noi_dung: "huong_nghiep",
      muc_tieu: ["Thích ứng với xu hướng CMCN 4.0", "Xây dựng chiến lược Reskilling và Upskilling cá nhân", "Am hiểu an toàn lao động và đạo đức nghề nghiệp"],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Thị trường lao động trong kỷ nguyên AI",
          mo_ta: "Sự dịch chuyển và thay thế nghề nghiệp.",
          nhiem_vu: [
            {
              ten: "Phân tích tác động của tự động hóa",
              mo_ta: "Thảo luận về các nhóm kỹ năng không thể bị thay thế bởi máy móc.",
              thoi_luong_de_xuat: "25 phút"
            },
            {
              ten: "Khám phá các nghề nghiệp xanh",
              mo_ta: "Tìm hiểu xu hướng chuyển dịch sang các ngành kinh tế tuần hoàn và năng lượng tái tạo.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 2,
          ten: "Chiến lược thích ứng và học tập suốt đời",
          mo_ta: "Xây dựng tư duy phát triển.",
          nhiem_vu: [
            {
              ten: "Lập kế hoạch Reskilling (Tái đào tạo)",
              mo_ta: "Thiết kế lộ trình học tập khi nghề nghiệp hiện tại bị đe dọa bởi công nghệ mới.",
              thoi_luong_de_xuat: "25 phút"
            }
          ]
        },
        {
          so_thu_tu: 3,
          ten: "An toàn lao động và Luật pháp chuyên sâu",
          mo_ta: "Bảo vệ bản thân trong môi trường làm việc chuyên nghiệp.",
          nhiem_vu: [
            {
              ten: "Giải mã Luật An toàn lao động 2015",
              mo_ta: "Phân tích quyền lợi, nghĩa vụ và quy trình bảo hộ khi làm việc thực tế.",
              thoi_luong_de_xuat: "25 phút"
            },
            {
              ten: "Đạo đức nghề nghiệp trong thế giới số",
              mo_ta: "Thảo luận về tính trung thực, bảo mật thông tin và đạo đức khi sử dụng AI trong công việc.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        }
      ],
      ket_qua_can_dat: ["Tự tin trước xu hướng 4.0", "Am hiểu luật pháp lao động", "Có tư duy đạo đức nghề nghiệp"],
      phuong_phap_goi_y: ["Thảo luận", "Case study", "Chuyên gia chia sẻ"],
      tu_khoa_tim_kiem: ["4.0", "AI", "Reskilling", "luật lao động", "đạo đức"],
      so_tiet_de_xuat: 3,
      thang_thuc_hien: [3]
    },
    {
      ma: "12.9",
      ten: "Định hướng học tập và nghề nghiệp",
      mach_noi_dung: "huong_nghiep",
      muc_tieu: ["Xác định chính xác hướng đi sau tốt nghiệp", "Hoàn thiện hồ sơ xét tuyển chuyên nghiệp", "Chuẩn bị tâm thế vững vàng cho kỳ thi quốc gia"],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Ra quyết định chọn hướng đi và trường đào tạo",
          mo_ta: "Lựa chọn chiến lược dựa trên dữ liệu thực tế.",
          nhiem_vu: [
            {
              ten: "Đối soát năng lực and nguyện vọng",
              mo_ta: "So sánh điểm học tập, điểm thi thử với điểm chuẩn các năm của trường đại học mục tiêu.",
              thoi_luong_de_xuat: "25 phút"
            },
            {
              ten: "Phân tích tài chính cho đại học",
              mo_ta: "Tính toán học phí, sinh hoạt phí và tìm kiếm các nguồn học bổng/hỗ trợ tài chính.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 2,
          ten: "Tham vấn chuyên gia và hướng dẫn thủ tục",
          mo_ta: "Gỡ rối các thắc mắc về quy chế.",
          nhiem_vu: [
            {
              ten: "Tư vấn chọn nghề 1-1",
              mo_ta: "Thực hành đặt câu hỏi chuyên sâu cho chuyên gia về triển vọng nghề nghiệp của các ngành 'hot'.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        },
        {
          so_thu_tu: 3,
          ten: "Kỹ năng lập hồ sơ and Quản trị mục tiêu",
          mo_ta: "Hành chính chuyên nghiệp.",
          nhiem_vu: [
            {
              ten: "Chuẩn bị túi hồ sơ vàng",
              mo_ta: "Checklist các giấy tờ cần thiết, kỹ năng scan and upload hồ sơ trực tuyến chuẩn xác.",
              thoi_luong_de_xuat: "25 phút"
            },
            {
              ten: "Chiến thuật ôn thi giai đoạn cuối",
              mo_ta: "Xây dựng lịch học tập khoa học và các bài tập giải tỏa áp lực tâm lý thi cử.",
              thoi_luong_de_xuat: "30 phút"
            }
          ]
        }
      ],
      ket_qua_can_dat: ["Quyết định hướng đi sáng suốt", "Hồ sơ xét tuyển hoàn chỉnh", "Tâm lý tự tin"],
      phuong_phap_goi_y: ["Tư vấn", "Thực hành thủ tục", "Workshops"],
      tu_khoa_tim_kiem: ["tốt nghiệp", "xét tuyển", "chọn ngành", "ôn thi"],
      so_tiet_de_xuat: 4,
      thang_thuc_hien: [4, 5]
    },
    {
      ma: "12.10",
      ten: "Chào đón tương lai (Bước vào thế giới nghề nghiệp)",
      mach_noi_dung: "huong_nghiep",
      muc_tieu: ["Chuẩn bị hồ sơ ứng tuyển và rèn luyện kỹ năng phỏng vấn thực tế."],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Chuẩn bị hồ sơ ứng tuyển (Portfolio/CV)",
          mo_ta: "Tạo dấu ấn chuyên nghiệp đầu đời.",
          nhiem_vu: [
            {
              ten: "Viết CV chuyên nghiệp",
              mo_ta: "Cấu trúc CV, từ khóa năng lực, lỗi cần tránh và viết Cover Letter.",
              thoi_luong_de_xuat: "45 phút",
              link_tai_lieu_tham_khao: ["https://topcv.vn/mau-cv", "https://canva.com/cv-templates"]
            }
          ]
        },
        {
          so_thu_tu: 2,
          ten: "Kỹ năng phỏng vấn",
          mo_ta: "Chinh phục nhà tuyển dụng.",
          nhiem_vu: [
            {
              ten: "Phỏng vấn thử (Mock Interview)",
              mo_ta: "Thực hành trả lời các câu hỏi thường gặp theo phương pháp STAR (Situation, Task, Action, Result).",
              thoi_luong_de_xuat: "45 phút",
              link_tai_lieu_tham_khao: ["https://youtube.com/results?search_query=STAR+method+interview"]
            }
          ]
        },
        {
          so_thu_tu: 3,
          ten: "Tìm hiểu quy chế tuyển sinh/tuyển dụng",
          mo_ta: "Nắm vững luật chơi.",
          nhiem_vu: [
            {
              ten: "Giải mã thông báo tuyển dụng/tuyển sinh",
              mo_ta: "Cách đọc JD (Job Description), hiểu các yêu cầu ẩn và chuẩn bị hồ sơ hành chính.",
              thoi_luong_de_xuat: "20 phút"
            }
          ]
        }
      ],
      ket_qua_can_dat: ["Có CV sẵn sàng", "Tự tin phỏng vấn", "Hiểu quy trình tuyển dụng"],
      phuong_phap_goi_y: ["Đóng vai", "Thực hành viết"],
      tu_khoa_tim_kiem: ["CV", "phỏng vấn", "STAR method", "tuyển dụng"],
      so_tiet_de_xuat: 3,
      thang_thuc_hien: [5]
    },
    {
      ma: "12.11",
      ten: "Xây dựng giá trị gia đình",
      mach_noi_dung: "xa_hoi",
      muc_tieu: [
        "Nhận diện và trân trọng các giá trị gia đình truyền thống và hiện đại",
        "Thực hiện trách nhiệm của người trưởng thành trong việc xây dựng nếp nhà",
        "Giải quyết xung đột thế hệ bằng đối thoại văn minh",
      ],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Hội nghị Gia đình",
          mo_ta: "Thực hành dân chủ và giải quyết mâu thuẫn trong gia đình",
          nhiem_vu: [
            {
              ten: "Sắm vai giải quyết xung đột",
              mo_ta: "Xử lý tình huống con chọn nghề khác ý cha mẹ dựa trên sự thấu cảm",
              ky_nang_can_dat: ["2.1", "2.2"],
            },
          ],
        },
        {
          so_thu_tu: 2,
          ten: "Người Quản gia Tập sự",
          mo_ta: "Chủ động gánh vác trách nhiệm tổ chức cuộc sống gia đình",
          nhiem_vu: [
            {
              ten: "Lập kế hoạch quản gia",
              mo_ta: "Quán xuyến nhà cửa khi cha mẹ vắng nhà, thể hiện sự trưởng thành",
              ky_nang_can_dat: ["1.3"],
            },
          ],
        },
      ],
      ket_qua_can_dat: [
        "Biết cách đối thoại để giữ gìn hòa khí điểm tựa gia đình",
        "Thể hiện được sự trưởng thành qua hành động gánh vác",
      ],
      phuong_phap_goi_y: ["Đóng vai", "Tranh biện", "Dự án cá nhân"],
      so_tiet_de_xuat: 4,
      thang_thuc_hien: [10, 11],
      goi_y_tich_hop: {
        bien_ban_hop: [
          "Thảo luận cách lồng ghép giá trị gia đình vào các môn học",
          "Chia sẻ kinh nghiệm xử lý tình huống xung đột thế hệ",
        ],
        ke_hoach_day_hoc: [
          "Tích hợp đạo đức: Lòng biết ơn và Trách nhiệm",
          "Hoạt động triển lãm ảnh 'Góc nhỏ yêu thương'",
          "Kết nối giá trị Hiếu thảo với truyền thống Uống nước nhớ nguồn (1.1)",
        ],
        ngoai_khoa: [
          "Ngày hội gia đình: 'Sợi dây kết nối thế hệ'",
          "Cuộc thi viết: 'Lá thư gửi tương lai của gia đình'",
        ],
      },
    },
  ],
};

// ============================================================================
// PHẦN 6: HÀM TRUY XUẤT DỮ LIỆU
// ============================================================================

/**
 * Lấy chủ đề theo tháng và khối
 */
export function getChuDeTheoThang(khoi: number, thang: number): ChuDe | null {
  const chuongTrinh =
    khoi === 10
      ? CHUONG_TRINH_LOP_10
      : khoi === 11
        ? CHUONG_TRINH_LOP_11
        : CHUONG_TRINH_LOP_12;

  return (
    chuongTrinh.chu_de.find((cd) => cd.thang_thuc_hien?.includes(thang)) || null
  );
}

/**
 * Tìm chủ đề theo tên hoặc từ khóa
 */
export function timChuDeTheoTen(
  khoi: number,
  tenHoacTuKhoa: string
): ChuDe | null {
  const chuongTrinh =
    khoi === 10
      ? CHUONG_TRINH_LOP_10
      : khoi === 11
        ? CHUONG_TRINH_LOP_11
        : CHUONG_TRINH_LOP_12;

  const searchLower = tenHoacTuKhoa.toLowerCase();

  return (
    chuongTrinh.chu_de.find(
      (cd) =>
        cd.ten.toLowerCase().includes(searchLower) ||
        (cd.tu_khoa_tim_kiem &&
          cd.tu_khoa_tim_kiem.some((tk) => searchLower.includes(tk)))
    ) || null
  );
}

/**
 * Lấy tất cả chủ đề của một khối
 */
export function getTatCaChuDe(khoi: number): ChuDe[] {
  const chuongTrinh =
    khoi === 10
      ? CHUONG_TRINH_LOP_10
      : khoi === 11
        ? CHUONG_TRINH_LOP_11
        : CHUONG_TRINH_LOP_12;

  return chuongTrinh.chu_de;
}

/**
 * Lấy thông tin tổng quan khối
 */
export function getThongTinKhoi(khoi: number): Omit<ChuongTrinhKhoi, "chu_de"> {
  const chuongTrinh =
    khoi === 10
      ? CHUONG_TRINH_LOP_10
      : khoi === 11
        ? CHUONG_TRINH_LOP_11
        : CHUONG_TRINH_LOP_12;

  const { chu_de, ...thongTin } = chuongTrinh;
  return thongTin;
}

/**
 * Tạo context cho AI prompt từ chủ đề
 */
export function taoPromptContextTuChuDe(chuDe: ChuDe, khoi: number): string {
  const thongTinKhoi = getThongTinKhoi(khoi);

  let context = `
## THÔNG TIN CHỦ ĐỀ CHI TIẾT TỪ CSDL CHƯƠNG TRÌNH (BẮT BUỘC PHẢI DÙNG DỮ LIỆU NÀY):

**Khối**: ${khoi} - ${thongTinKhoi.chu_de_trong_tam}
**Chủ đề**: ${chuDe.ma} - ${chuDe.ten}
**Mạch nội dung**: ${chuDe.mach_noi_dung}
**Tổng số tiết đề xuất**: ${chuDe.so_tiet_de_xuat}

### I. MỤC TIÊU CẦN ĐẠT:
${chuDe.muc_tieu.map((mt, i) => `${i + 1}. ${mt}`).join("\n")}

### II. CÁC HOẠT ĐỘNG VÀ NHIỆM VỤ CỤ THỂ (QUAN TRỌNG):
Dưới đây là danh sách các hoạt động và nhiệm vụ chi tiết đã được quy định. Bạn hãy sử dụng chính xác tên các nhiệm vụ và phân bổ thời gian dựa trên gợi ý này:

`;

  chuDe.hoat_dong.forEach((hd) => {
    context += `\n#### HOẠT ĐỘNG ${hd.so_thu_tu}: ${hd.ten.toUpperCase()}\n`;
    context += `   *Mục tiêu cụ thể*: ${hd.muc_tieu_cu_the || "Không có"}\n`;
    context += `   *Mô tả tổng quan*: ${hd.mo_ta}\n`;

    if (hd.nhiem_vu && hd.nhiem_vu.length > 0) {
      context += `   *Danh sách nhiệm vụ chi tiết:*\n`;
      hd.nhiem_vu.forEach((nv, i) => {
        context += `   ${i + 1}. **${nv.ten}**\n`;
        context += `      - Nội dung: ${nv.mo_ta}\n`;
        if (nv.thoi_luong_de_xuat)
          context += `      - Thời lượng gợi ý: ${nv.thoi_luong_de_xuat}\n`;
        if (nv.san_pham_du_kien)
          context += `      - Sản phẩm đầu ra: ${nv.san_pham_du_kien}\n`;
        if (nv.ky_nang_can_dat)
          context += `      - Kỹ năng mục tiêu: ${nv.ky_nang_can_dat.join(
            ", "
          )}\n`;
      });
    }

    if (hd.san_pham && hd.san_pham.length > 0) {
      context += `   *Sản phẩm hoạt động*: ${hd.san_pham.join(", ")}\n`;
    }
    if (hd.luu_y_su_pham) {
      context += `   *Lưu ý sư phạm*: ${hd.luu_y_su_pham}\n`;
    }
  });

  context += `\n### III. KẾT QUẢ ĐẦU RA YÊU CẦU:\n`;
  chuDe.ket_qua_can_dat.forEach((kq, i) => {
    context += `${i + 1}. ${kq}\n`;
  });

  context += `\n### IV. PHƯƠNG PHÁP & HÌNH THỨC TỔ CHỨC:\n${chuDe.phuong_phap_goi_y.join(
    ", "
  )}\n`;

  if (chuDe.luu_y_su_pham) {
    context += `\n### V. LƯU Ý SƯ PHẠM ĐẶC BIỆT:\n`;
    context += `- Trọng tâm: ${chuDe.luu_y_su_pham.trong_tam.join("; ")}\n`;
    context += `- Lỗi thường gặp: ${chuDe.luu_y_su_pham.loi_thuong_gap.join(
      "; "
    )}\n`;
  }

  if (chuDe.goi_y_tich_hop) {
    context += `\n### VI. GỢI Ý TÍCH HỢP:\n`;
    if (chuDe.goi_y_tich_hop.sinh_hoat_lop)
      context += `- Sinh hoạt lớp: ${chuDe.goi_y_tich_hop.sinh_hoat_lop.join(
        "; "
      )}\n`;
    if (chuDe.goi_y_tich_hop.sinh_hoat_duoi_co)
      context += `- Sinh hoạt dưới cờ: ${chuDe.goi_y_tich_hop.sinh_hoat_duoi_co.join(
        "; "
      )}\n`;
  }

  return context;
}

/**
 * Tạo context cho biên bản họp tổ
 */
export function taoContextBienBanHop(khoi: number, thang: number): string {
  const chuDe = getChuDeTheoThang(khoi, thang);
  const thongTinKhoi = getThongTinKhoi(khoi);

  if (!chuDe) {
    return `Không tìm thấy chủ đề cho khối ${khoi} tháng ${thang}`;
  }

  return `
## THÔNG TIN CHỦ ĐỀ THÁNG ${thang} - KHỐI ${khoi}

**Chủ đề**: ${chuDe.ten}
**Mạch nội dung**: ${chuDe.mach_noi_dung}
**Số tiết**: ${chuDe.so_tiet_de_xuat}

**Đặc điểm tâm lý HS khối ${khoi}**: ${thongTinKhoi.dac_diem_tam_ly_lua_tuoi
      .slice(0, 2)
      .join("; ")}

**Mục tiêu cần đạt**:
${chuDe.muc_tieu.map((mt, i) => `- ${mt}`).join("\n")}

**Hoạt động chính**:
${chuDe.hoat_dong.map((hd) => `- ${hd.ten}: ${hd.mo_ta}`).join("\n")}

**Phương pháp gợi ý**: ${chuDe.phuong_phap_goi_y.join(", ")}

**Lưu ý khi thảo luận**: Cần quan tâm đến ${thongTinKhoi.muc_tieu_phat_trien_nang_luc
      .slice(0, 2)
      .join(", ")}
`;
}

/**
 * Tạo context cho kế hoạch ngoại khóa
 */
export function taoContextNgoaiKhoa(khoi: number, tenChuDe: string): string {
  const chuDe = timChuDeTheoTen(khoi, tenChuDe);
  const thongTinKhoi = getThongTinKhoi(khoi);

  if (!chuDe) {
    return `Chưa tìm thấy chủ đề "${tenChuDe}" trong CSDL. AI sẽ tạo nội dung dựa trên tên chủ đề.`;
  }

  let context = `
## THÔNG TIN TỪ SGK CHO HOẠT ĐỘNG NGOẠI KHÓA

**Chủ đề SGK**: ${chuDe.ma} - ${chuDe.ten}
**Khối**: ${khoi} - ${thongTinKhoi.chu_de_trong_tam}
**Mạch nội dung**: ${chuDe.mach_noi_dung}

### MỤC TIÊU CẦN ĐẠT (theo SGK):
${chuDe.muc_tieu.map((mt, i) => `${i + 1}. ${mt}`).join("\n")}

### CÁC HOẠT ĐỘNG GỢI Ý TỪ SGK:
`;

  chuDe.hoat_dong.forEach((hd) => {
    context += `\n**${hd.ten}**\n`;
    context += `- Mô tả: ${hd.mo_ta}\n`;
    context += `- Nhiệm vụ gợi ý:\n`;
    hd.nhiem_vu.forEach((nv) => {
      context += `  + ${nv.ten}: ${nv.mo_ta}\n`;
    });
  });

  context += `\n### KẾT QUẢ CẦN ĐẠT:\n`;
  chuDe.ket_qua_can_dat.forEach((kq) => {
    context += `- ${kq}\n`;
  });

  context += `\n### PHƯƠNG PHÁP PHÙ HỢP: ${chuDe.phuong_phap_goi_y.join(
    ", "
  )}\n`;
  context += `\n### ĐẶC ĐIỂM TÂM LÝ HS KHỐI ${khoi}: ${thongTinKhoi.dac_diem_tam_ly_lua_tuoi.join(
    "; "
  )}\n`;

  return context;
}

// Export tất cả
export const KNTT_DATABASE = {
  trietLy: TRIET_LY_CHUONG_TRINH,
  lop10: CHUONG_TRINH_LOP_10,
  lop11: CHUONG_TRINH_LOP_11,
  lop12: CHUONG_TRINH_LOP_12,
  getChuDeTheoThang,
  timChuDeTheoTen,
  getTatCaChuDe,
  getThongTinKhoi,
  taoPromptContextTuChuDe,
  taoContextBienBanHop,
  taoContextNgoaiKhoa,
};
