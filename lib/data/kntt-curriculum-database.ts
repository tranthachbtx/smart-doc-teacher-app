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

  // Thêm đặc điểm tâm lý lứa tuổi
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
      muc_tieu: [
        "Giúp học sinh chuyển từ trạng thái 'người lạ' thành thành viên tích cực của nhà trường",
        "Hiểu và tự hào về nơi mình đang học",
        "Xây dựng văn hóa ứng xử học đường văn minh",
      ],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Nghiên cứu lịch sử nhà trường",
          mo_ta:
            "Tìm hiểu lịch sử hình thành, các thành tựu nổi bật của nhà trường",
          muc_tieu_cu_the:
            "Học sinh biết được các mốc lịch sử quan trọng và thành tựu của trường",
          nhiem_vu: [
            {
              ten: "Tham quan phòng truyền thống",
              mo_ta:
                "Ghi chép các mốc lịch sử quan trọng: năm thành lập, các thế hệ lãnh đạo, thành tích nổi bật",
              san_pham_du_kien: "Sổ tay ghi chép thông tin về trường",
              thoi_luong_de_xuat: "1 tiết",
            },
            {
              ten: "Phỏng vấn thầy cô",
              mo_ta:
                "Thu thập câu chuyện về truyền thống nhà trường từ các thầy cô lâu năm",
              san_pham_du_kien: "Bài phỏng vấn dạng văn bản hoặc video",
              thoi_luong_de_xuat: "1 tiết",
            },
          ],
          san_pham: [
            "Sổ tay ghi chép",
            "Bài phỏng vấn",
            "Infographic về lịch sử trường",
          ],
          luu_y_su_pham:
            "Cần liên hệ trước với phòng truyền thống, chuẩn bị câu hỏi phỏng vấn sẵn",
        },
        {
          so_thu_tu: 2,
          ten: "Quảng bá hình ảnh nhà trường",
          mo_ta:
            "Thiết kế các sản phẩm truyền thông để giới thiệu về truyền thống nhà trường",
          muc_tieu_cu_the:
            "Học sinh tạo được sản phẩm truyền thông sáng tạo về trường",
          nhiem_vu: [
            {
              ten: "Thiết kế poster/video",
              mo_ta: "Tạo sản phẩm truyền thông sáng tạo giới thiệu về trường",
              san_pham_du_kien: "Poster hoặc video 2-3 phút",
              thoi_luong_de_xuat: "1 tiết",
              ky_nang_can_dat: [
                "NLS 1.2 - Sử dụng công cụ số",
                "NLS 2.3 - Sáng tạo nội dung số",
              ],
            },
            {
              ten: "Viết bài giới thiệu",
              mo_ta: "Viết bài cho website/fanpage trường",
              san_pham_du_kien: "Bài viết 300-500 từ kèm hình ảnh",
              thoi_luong_de_xuat: "0.5 tiết",
            },
          ],
          san_pham: ["Poster", "Video ngắn", "Bài viết fanpage"],
          luu_y_su_pham:
            "Hướng dẫn HS sử dụng Canva, CapCut hoặc các công cụ thiết kế đơn giản",
        },
        {
          so_thu_tu: 3,
          ten: "Thực hành nội quy",
          mo_ta: "Tìm hiểu và cam kết thực hiện nội quy trường, lớp",
          muc_tieu_cu_the: "Học sinh hiểu và cam kết thực hiện nội quy",
          nhiem_vu: [
            {
              ten: "Học nội quy",
              mo_ta:
                "Nghiên cứu và thảo luận về nội quy trường học: đồng phục, giờ giấc, ứng xử",
              san_pham_du_kien: "Bảng tóm tắt nội quy theo sơ đồ tư duy",
              thoi_luong_de_xuat: "0.5 tiết",
            },
            {
              ten: "Cam kết thực hiện",
              mo_ta: "Ký cam kết và thực hành văn hóa ứng xử trong tuần đầu",
              san_pham_du_kien: "Bản cam kết cá nhân",
              thoi_luong_de_xuat: "0.5 tiết",
            },
          ],
          san_pham: ["Sơ đồ tư duy nội quy", "Bản cam kết"],
          luu_y_su_pham:
            "Tránh biến hoạt động thành buổi đọc nội quy khô khan, cần tạo tình huống thảo luận",
        },
      ],
      ket_qua_can_dat: [
        "Hiểu biết về lịch sử và truyền thống nhà trường",
        "Có ý thức giữ gìn và phát huy truyền thống",
        "Thực hiện tốt nội quy trường học",
      ],
      phuong_phap_goi_y: [
        "Tham quan",
        "Phỏng vấn",
        "Thiết kế sản phẩm",
        "Thảo luận nhóm",
      ],
      so_tiet_de_xuat: 4,
      thang_thuc_hien: [9],
      tu_khoa_tim_kiem: [
        "truyền thống",
        "nhà trường",
        "nội quy",
        "văn hóa học đường",
      ],

      // Thêm lưu ý sư phạm chi tiết
      luu_y_su_pham: {
        trong_tam: [
          "Tạo cảm giác thuộc về (sense of belonging) cho HS lớp 10 mới",
          "Kết nối quá khứ - hiện tại - tương lai của nhà trường",
          "Biến kiến thức về trường thành niềm tự hào",
        ],
        phuong_phap_hieu_qua: [
          "Sử dụng storytelling kể chuyện về các thế hệ cựu học sinh thành công",
          "Cho HS tự khám phá thay vì thuyết trình một chiều",
          "Tạo sản phẩm để HS ghi nhớ lâu hơn",
        ],
        loi_thuong_gap: [
          "Biến thành buổi đọc lịch sử trường khô khan",
          "Chỉ nói về thành tích mà không kết nối với HS",
          "Không cho HS cơ hội thể hiện",
        ],
        cach_khac_phuc: [
          "Tổ chức dạng trò chơi tìm hiểu, đố vui",
          "Mời cựu học sinh về chia sẻ",
          "Cho HS tự thiết kế sản phẩm truyền thông",
        ],
      },

      // Thêm gợi ý tích hợp
      goi_y_tich_hop: {
        bien_ban_hop: [
          "Thảo luận về kế hoạch tổ chức hoạt động đầu năm cho HS lớp 10",
          "Phân công GV hướng dẫn tham quan phòng truyền thống",
          "Đánh giá hiệu quả hoạt động hội nhập của HS mới",
        ],
        ke_hoach_day_hoc: [
          "Tích hợp NLS 1.2, 2.3 khi cho HS thiết kế poster/video",
          "Tích hợp giáo dục đạo đức về lòng biết ơn, tự hào truyền thống",
          "Rèn kỹ năng phỏng vấn, thu thập thông tin",
        ],
        ngoai_khoa: [
          "Tổ chức cuộc thi thiết kế logo/slogan về trường",
          "Chương trình giao lưu với cựu học sinh thành công",
          "Triển lãm ảnh về lịch sử nhà trường",
        ],
      },
      noi_dung_sgk_tham_khao:
        "SGK HĐTN 10 - Kết nối Tri thức, Chủ đề 1: Phát huy truyền thống nhà trường (Trang 6-15)",
    },
    {
      ma: "10.2",
      ten: "Khám phá bản thân",
      mach_noi_dung: "ban_than",
      muc_tieu: [
        "Chuyển biến từ việc mô tả bản thân bên ngoài sang phân tích tâm lý bên trong",
        "Nhận diện tính cách, điểm mạnh, điểm hạn chế",
        "Xác định giá trị sống cá nhân",
      ],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Nhận diện tính cách",
          mo_ta:
            "Thực hiện các bài trắc nghiệm hoặc hoạt động trải nghiệm để xác định nhóm tính cách",
          muc_tieu_cu_the: "HS xác định được mình thuộc nhóm tính cách nào",
          nhiem_vu: [
            {
              ten: "Làm trắc nghiệm MBTI/DISC",
              mo_ta:
                "Thực hiện bài trắc nghiệm để xác định nhóm tính cách: hướng nội/hướng ngoại, tư duy/cảm xúc",
              san_pham_du_kien: "Kết quả trắc nghiệm và phân tích cá nhân",
              thoi_luong_de_xuat: "1 tiết",
              ky_nang_can_dat: ["NLS 1.1 - Sử dụng công cụ trực tuyến"],
            },
            {
              ten: "Phân tích kết quả",
              mo_ta:
                "Thảo luận nhóm về ý nghĩa của từng nhóm tính cách, so sánh với bản thân",
              san_pham_du_kien: "Bài chia sẻ về tính cách của mình",
              thoi_luong_de_xuat: "1 tiết",
            },
          ],
          san_pham: ["Kết quả trắc nghiệm", "Bài phân tích tính cách cá nhân"],
          luu_y_su_pham:
            "Nhấn mạnh không có tính cách tốt/xấu, chỉ có phù hợp hay không phù hợp với từng ngữ cảnh",
        },
        {
          so_thu_tu: 2,
          ten: "Phân tích SWOT cá nhân",
          mo_ta:
            "Xác định Điểm mạnh (Strengths), Điểm yếu (Weaknesses), Cơ hội (Opportunities), Thách thức (Threats)",
          muc_tieu_cu_the: "HS lập được bảng SWOT cá nhân",
          nhiem_vu: [
            {
              ten: "Liệt kê điểm mạnh/yếu",
              mo_ta:
                "Tự đánh giá và nhờ bạn bè, gia đình nhận xét về điểm mạnh, điểm cần cải thiện",
              san_pham_du_kien: "Bảng SWOT cá nhân",
              thoi_luong_de_xuat: "1 tiết",
            },
            {
              ten: "Phân tích ảnh hưởng",
              mo_ta:
                "Đánh giá ảnh hưởng của điểm mạnh/yếu đến học tập, quan hệ và tương lai",
              san_pham_du_kien: "Bài viết phân tích 200-300 từ",
              thoi_luong_de_xuat: "0.5 tiết",
            },
          ],
          san_pham: ["Bảng SWOT", "Bài phân tích ảnh hưởng"],
          luu_y_su_pham:
            "Tạo môi trường an toàn để HS chia sẻ điểm yếu mà không bị đánh giá",
        },
        {
          so_thu_tu: 3,
          ten: "Định vị giá trị sống",
          mo_ta: "Xác định các giá trị sống mà bản thân theo đuổi",
          muc_tieu_cu_the:
            "HS xác định được 3-5 giá trị sống quan trọng nhất với mình",
          nhiem_vu: [
            {
              ten: "Khám phá giá trị",
              mo_ta:
                "Từ danh sách giá trị (trung thực, trách nhiệm, sáng tạo, yêu thương...), chọn 5 giá trị quan trọng nhất",
              san_pham_du_kien: "Danh sách 5 giá trị cốt lõi cá nhân",
              thoi_luong_de_xuat: "0.5 tiết",
            },
            {
              ten: "Xếp hạng ưu tiên",
              mo_ta:
                "Sắp xếp các giá trị theo thứ tự quan trọng và giải thích lý do",
              san_pham_du_kien: "Bảng xếp hạng giá trị kèm giải thích",
              thoi_luong_de_xuat: "0.5 tiết",
            },
          ],
          san_pham: [
            "Kim tự tháp giá trị cá nhân",
            "Bài chia sẻ về giá trị sống",
          ],
          luu_y_su_pham:
            "Giúp HS hiểu giá trị là la bàn định hướng hành vi, không phải khẩu hiệu suông",
        },
      ],
      ket_qua_can_dat: [
        "Nhận biết được đặc điểm tính cách của bản thân",
        "Xác định được điểm mạnh và điểm cần cải thiện",
        "Định hình được hệ giá trị cá nhân",
      ],
      phuong_phap_goi_y: [
        "Trắc nghiệm tâm lý",
        "Phân tích SWOT",
        "Thảo luận nhóm",
        "Viết nhật ký phản tư",
      ],
      so_tiet_de_xuat: 4,
      thang_thuc_hien: [9, 10],
      tu_khoa_tim_kiem: [
        "khám phá bản thân",
        "tính cách",
        "MBTI",
        "SWOT",
        "giá trị sống",
      ],

      luu_y_su_pham: {
        trong_tam: [
          "Đây là chủ đề nền tảng cho cả 3 năm THPT",
          "Giúp HS nhìn nhận bản thân khách quan, không tự ti hay tự cao",
          "Tạo thói quen tự phản tư (self-reflection)",
        ],
        phuong_phap_hieu_qua: [
          "Sử dụng các công cụ trắc nghiệm trực tuyến miễn phí",
          "Cho HS viết nhật ký và chia sẻ theo cặp/nhóm nhỏ",
          "Mời chuyên gia tâm lý nói chuyện (nếu có điều kiện)",
        ],
        loi_thuong_gap: [
          "HS ngại chia sẻ điểm yếu trước lớp",
          "Kết quả trắc nghiệm bị hiểu sai là 'nhãn dán' cố định",
          "Hoạt động quá hàn lâm, thiếu tính trải nghiệm",
        ],
        cach_khac_phuc: [
          "Cho chia sẻ theo cặp hoặc nhóm nhỏ thay vì cả lớp",
          "Nhấn mạnh tính cách có thể phát triển theo thời gian",
          "Sử dụng game, hoạt động tương tác thay vì thuyết giảng",
        ],
      },

      goi_y_tich_hop: {
        bien_ban_hop: [
          "Thảo luận về cách hỗ trợ HS nhận diện điểm mạnh/yếu",
          "Chia sẻ kinh nghiệm sử dụng công cụ trắc nghiệm tâm lý",
          "Đánh giá mức độ tự nhận thức của HS qua các bài viết phản tư",
        ],
        ke_hoach_day_hoc: [
          "Tích hợp NLS 1.1 khi cho HS làm trắc nghiệm trực tuyến",
          "Tích hợp giáo dục đạo đức về sự trung thực với chính mình",
          "Rèn kỹ năng tự đánh giá, phản tư (metacognition)",
        ],
        ngoai_khoa: [
          "Tổ chức workshop 'Khám phá bản thân qua MBTI'",
          "Cuộc thi viết 'Tôi là ai?' với giải thưởng",
          "Chương trình giao lưu với chuyên gia tâm lý",
        ],
      },
      noi_dung_sgk_tham_khao:
        "SGK HĐTN 10 - Kết nối Tri thức, Chủ đề 2: Khám phá bản thân (Trang 16-27)",
    },

    // Tiếp tục thêm các chủ đề còn lại với cấu trúc tương tự...
    {
      ma: "10.3",
      ten: "Rèn luyện bản thân",
      mach_noi_dung: "ban_than",
      muc_tieu: [
        "Quản lý cảm xúc trong các tình huống căng thẳng",
        "Xây dựng và duy trì thói quen tốt",
        "Phát triển tư duy phản biện",
      ],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Quản lý cảm xúc",
          mo_ta:
            "Nhận diện các cảm xúc tiêu cực và thực hành kỹ thuật điều chỉnh",
          muc_tieu_cu_the:
            "HS biết cách nhận diện và điều chỉnh cảm xúc tiêu cực",
          nhiem_vu: [
            {
              ten: "Nhận diện cảm xúc",
              mo_ta:
                "Ghi nhật ký cảm xúc hàng ngày trong 1 tuần, xác định triggers (nguyên nhân kích hoạt)",
              san_pham_du_kien: "Nhật ký cảm xúc 7 ngày",
              thoi_luong_de_xuat: "0.5 tiết hướng dẫn + 1 tuần thực hành",
            },
            {
              ten: "Thực hành kỹ thuật điều chỉnh",
              mo_ta:
                "Áp dụng các kỹ thuật: hít thở sâu 4-7-8, thiền 5 phút, viết nhật ký giải tỏa",
              san_pham_du_kien: "Báo cáo trải nghiệm các kỹ thuật",
              thoi_luong_de_xuat: "1 tiết",
            },
          ],
          san_pham: [
            "Nhật ký cảm xúc",
            "Báo cáo thực hành kỹ thuật quản lý cảm xúc",
          ],
          luu_y_su_pham:
            "Cần tạo không gian an toàn, tôn trọng sự riêng tư của HS",
        },
        {
          so_thu_tu: 2,
          ten: "Xây dựng thói quen",
          mo_ta:
            "Lập kế hoạch rèn luyện thói quen tốt và loại bỏ thói quen xấu",
          muc_tieu_cu_the: "HS xây dựng được ít nhất 1 thói quen tốt mới",
          nhiem_vu: [
            {
              ten: "Lập danh sách thói quen",
              mo_ta:
                "Liệt kê thói quen cần xây dựng (dậy sớm, đọc sách, tập thể dục) và cần loại bỏ (ngủ muộn, lướt điện thoại)",
              san_pham_du_kien: "Danh sách thói quen với mục tiêu cụ thể",
              thoi_luong_de_xuat: "0.5 tiết",
            },
            {
              ten: "Theo dõi tiến độ 21 ngày",
              mo_ta:
                "Sử dụng bảng theo dõi thói quen (habit tracker) trong 21 ngày",
              san_pham_du_kien: "Bảng theo dõi thói quen và báo cáo kết quả",
              thoi_luong_de_xuat: "0.5 tiết hướng dẫn + 3 tuần thực hành",
              ky_nang_can_dat: ["NLS 1.3 - Sử dụng ứng dụng quản lý"],
            },
          ],
          san_pham: ["Habit tracker", "Báo cáo hành trình 21 ngày"],
          luu_y_su_pham:
            "Giải thích nguyên lý 21 ngày hình thành thói quen, động viên khi HS gặp khó khăn",
        },
        {
          so_thu_tu: 3,
          ten: "Tư duy phản biện",
          mo_ta: "Rèn luyện cách nhìn nhận vấn đề từ nhiều góc độ",
          muc_tieu_cu_the:
            "HS có khả năng đặt câu hỏi và phân tích vấn đề đa chiều",
          nhiem_vu: [
            {
              ten: "Phân tích tình huống",
              mo_ta:
                "Đọc một bài báo/video về vấn đề xã hội, đặt câu hỏi 5W1H và tìm nhiều góc nhìn khác nhau",
              san_pham_du_kien: "Bảng phân tích đa chiều",
              thoi_luong_de_xuat: "1 tiết",
            },
            {
              ten: "Tranh biện",
              mo_ta:
                "Tham gia tranh biện về các chủ đề: 'Mạng xã hội có hại hơn có lợi?', 'Nên học trường công hay trường tư?'",
              san_pham_du_kien: "Bài tranh biện với luận điểm rõ ràng",
              thoi_luong_de_xuat: "1 tiết",
            },
          ],
          san_pham: ["Bảng phân tích vấn đề", "Video/văn bản tranh biện"],
          luu_y_su_pham:
            "Dạy HS phân biệt giữa tranh biện và cãi nhau, tôn trọng quan điểm khác biệt",
        },
      ],
      ket_qua_can_dat: [
        "Biết cách kiểm soát cảm xúc tiêu cực",
        "Hình thành được ít nhất 2-3 thói quen tốt mới",
        "Có khả năng phân tích vấn đề đa chiều",
      ],
      phuong_phap_goi_y: [
        "Thực hành cá nhân",
        "Nhật ký",
        "Tranh biện",
        "Đóng vai",
        "Coaching",
      ],
      so_tiet_de_xuat: 4,
      thang_thuc_hien: [10, 11],
      tu_khoa_tim_kiem: [
        "quản lý cảm xúc",
        "thói quen",
        "tư duy phản biện",
        "21 ngày",
      ],

      luu_y_su_pham: {
        trong_tam: [
          "Chuyển từ 'biết' sang 'làm được' - cần thời gian thực hành",
          "Mỗi HS có xuất phát điểm khác nhau, không so sánh",
          "Động viên sự tiến bộ nhỏ, không kỳ vọng thay đổi ngay",
        ],
        phuong_phap_hieu_qua: [
          "Sử dụng ứng dụng theo dõi thói quen (Habitica, Streaks)",
          "Tạo nhóm buddy để HS hỗ trợ nhau",
          "Chia sẻ câu chuyện thành công của người nổi tiếng",
        ],
        loi_thuong_gap: [
          "Đặt mục tiêu quá cao, dễ nản",
          "Thiếu theo dõi, đánh giá tiến độ",
          "Chỉ nói lý thuyết, ít thực hành",
        ],
        cach_khac_phuc: [
          "Bắt đầu với mục tiêu nhỏ, tăng dần",
          "Check-in hàng tuần trong giờ SHCN",
          "Dành thời gian thực hành ngay tại lớp",
        ],
      },

      goi_y_tich_hop: {
        bien_ban_hop: [
          "Thảo luận về phương pháp hỗ trợ HS quản lý stress mùa thi",
          "Chia sẻ kinh nghiệm tổ chức hoạt động tranh biện trong lớp",
          "Đánh giá sự thay đổi thói quen của HS qua theo dõi",
        ],
        ke_hoach_day_hoc: [
          "Tích hợp NLS 1.3 khi cho HS sử dụng app theo dõi thói quen",
          "Tích hợp giáo dục đạo đức về tính kiên trì, tự giác",
          "Rèn kỹ năng tự kỷ luật, quản lý bản thân",
        ],
        ngoai_khoa: [
          "Thử thách 21 ngày toàn trường với hashtag riêng",
          "Cuộc thi tranh biện cấp trường",
          "Workshop 'Quản lý stress cho học sinh'",
        ],
      },
      noi_dung_sgk_tham_khao:
        "SGK HĐTN 10 - Kết nối Tri thức, Chủ đề 3: Rèn luyện bản thân (Trang 28-39)",
    },

    // ... Tiếp tục các chủ đề 10.4 đến 10.11 với cấu trúc tương tự
    {
      ma: "10.4",
      ten: "Chủ động, tự tin trong học tập và giao tiếp",
      mach_noi_dung: "ban_than",
      muc_tieu: [
        "Áp dụng các phương pháp học tập mới ở bậc THPT",
        "Rèn luyện kỹ năng giao tiếp tự tin",
        "Phát triển kỹ năng thuyết trình",
      ],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Phương pháp học tập THPT",
          mo_ta: "Chia sẻ và áp dụng các phương pháp học tập mới",
          nhiem_vu: [
            {
              ten: "Tìm hiểu phương pháp",
              mo_ta:
                "Nghiên cứu: tự học, làm việc nhóm, sơ đồ tư duy, Cornell notes",
            },
            {
              ten: "Áp dụng thực hành",
              mo_ta: "Thử nghiệm với 1-2 môn học và đánh giá hiệu quả",
            },
          ],
        },
        {
          so_thu_tu: 2,
          ten: "Giao tiếp tự tin",
          mo_ta: "Thực hành đóng vai các tình huống giao tiếp xã hội",
          nhiem_vu: [
            {
              ten: "Đóng vai (role-play)",
              mo_ta:
                "Thực hành: giới thiệu bản thân, hỏi thầy cô, làm quen bạn mới",
            },
            {
              ten: "Thuyết trình mini",
              mo_ta: "Trình bày 3-5 phút trước lớp về một chủ đề yêu thích",
            },
          ],
        },
      ],
      ket_qua_can_dat: [
        "Có phương pháp học tập phù hợp với bản thân",
        "Tự tin hơn trong giao tiếp với thầy cô, bạn bè",
        "Có thể thuyết trình trước đám đông",
      ],
      phuong_phap_goi_y: [
        "Học tập nhóm",
        "Đóng vai",
        "Thuyết trình",
        "Sơ đồ tư duy",
      ],
      so_tiet_de_xuat: 3,
      thang_thuc_hien: [11],
      tu_khoa_tim_kiem: [
        "phương pháp học tập",
        "giao tiếp",
        "thuyết trình",
        "tự tin",
      ],

      goi_y_tich_hop: {
        bien_ban_hop: [
          "Chia sẻ phương pháp dạy học hiệu quả cho HS lớp 10",
          "Thảo luận cách tạo cơ hội cho HS thuyết trình trong giờ học",
        ],
        ke_hoach_day_hoc: [
          "Tích hợp NLS 2.1 khi cho HS tạo sơ đồ tư duy bằng công cụ số",
          "Rèn kỹ năng trình bày, lập luận logic",
        ],
        ngoai_khoa: [
          "Cuộc thi thuyết trình 'TED Talk học đường'",
          "Workshop kỹ năng giao tiếp với chuyên gia",
        ],
      },
    },

    {
      ma: "10.5",
      ten: "Trách nhiệm với gia đình",
      mach_noi_dung: "xa_hoi",
      muc_tieu: [
        "Nhận thức sự thay đổi vai trò của học sinh lớp 10 trong gia đình",
        "Biết cách giải quyết xung đột thế hệ",
        "Thể hiện tình yêu thương với người thân",
      ],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Nhận diện vai trò trong gia đình",
          mo_ta: "Thảo luận về sự thay đổi vai trò khi lên lớp 10",
          nhiem_vu: [
            {
              ten: "Thảo luận vai trò",
              mo_ta:
                "Chia sẻ về trách nhiệm mới: tự lập hơn, chia sẻ công việc nhà",
            },
            {
              ten: "Lập kế hoạch đóng góp",
              mo_ta: "Xác định việc cụ thể có thể giúp đỡ gia đình hàng ngày",
            },
          ],
        },
        {
          so_thu_tu: 2,
          ten: "Giải quyết xung đột thế hệ",
          mo_ta: "Đóng vai xử lý các tình huống mâu thuẫn với cha mẹ",
          nhiem_vu: [
            {
              ten: "Phân tích tình huống",
              mo_ta:
                "Case study: mâu thuẫn về giờ giấc, sử dụng điện thoại, học thêm",
            },
            {
              ten: "Đóng vai giải quyết",
              mo_ta: "Thực hành kỹ năng đàm phán, lắng nghe, thỏa hiệp",
            },
          ],
        },
        {
          so_thu_tu: 3,
          ten: "Thể hiện yêu thương",
          mo_ta: "Lập kế hoạch và thực hiện hành động chăm sóc người thân",
          nhiem_vu: [
            {
              ten: "Lập kế hoạch",
              mo_ta:
                "Lên kế hoạch: nấu bữa cơm, viết thư, làm việc nhà, tặng quà handmade",
            },
            {
              ten: "Thực hiện và chia sẻ",
              mo_ta: "Thực hiện và báo cáo kết quả trước lớp",
            },
          ],
        },
      ],
      ket_qua_can_dat: [
        "Nhận thức được trách nhiệm của bản thân trong gia đình",
        "Có kỹ năng giải quyết mâu thuẫn gia đình",
        "Thể hiện được tình yêu thương qua hành động cụ thể",
      ],
      phuong_phap_goi_y: [
        "Thảo luận",
        "Đóng vai",
        "Dự án cá nhân",
        "Chia sẻ kinh nghiệm",
      ],
      so_tiet_de_xuat: 3,
      thang_thuc_hien: [11, 12],
      tu_khoa_tim_kiem: [
        "gia đình",
        "trách nhiệm",
        "xung đột thế hệ",
        "yêu thương",
      ],

      goi_y_tich_hop: {
        bien_ban_hop: [
          "Thảo luận cách phối hợp với phụ huynh trong giáo dục HS",
          "Chia sẻ kinh nghiệm xử lý khi HS có vấn đề gia đình",
        ],
        ke_hoach_day_hoc: [
          "Tích hợp giáo dục đạo đức về lòng hiếu thảo, biết ơn",
          "Rèn kỹ năng giao tiếp trong gia đình",
        ],
        ngoai_khoa: [
          "Chương trình tri ân cha mẹ nhân ngày lễ",
          "Cuộc thi viết 'Gia đình tôi'",
        ],
      },
    },

    {
      ma: "10.6",
      ten: "Tham gia xây dựng cộng đồng",
      mach_noi_dung: "xa_hoi",
      muc_tieu: [
        "Nhận biết các vấn đề xã hội tại địa phương",
        "Lập và thực hiện dự án thiện nguyện",
        "Rèn luyện ý thức công dân",
      ],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Khảo sát thực trạng cộng đồng",
          mo_ta: "Tìm hiểu các vấn đề xã hội tại địa phương",
          nhiem_vu: [
            {
              ten: "Khảo sát thực địa",
              mo_ta:
                "Điều tra về: an toàn giao thông, vệ sinh môi trường, người có hoàn cảnh khó khăn",
            },
            {
              ten: "Phân tích dữ liệu",
              mo_ta: "Tổng hợp kết quả khảo sát, xác định vấn đề ưu tiên",
            },
          ],
        },
        {
          so_thu_tu: 2,
          ten: "Lập và thực hiện dự án cộng đồng",
          mo_ta:
            "Xây dựng kế hoạch và thực hiện hoạt động thiện nguyện/tuyên truyền",
          nhiem_vu: [
            {
              ten: "Lập kế hoạch dự án",
              mo_ta:
                "Thiết kế dự án mini: mục tiêu, hoạt động, nguồn lực, timeline",
            },
            {
              ten: "Triển khai",
              mo_ta:
                "Thực hiện hoạt động: tuyên truyền, thiện nguyện, dọn dẹp...",
            },
            { ten: "Đánh giá", mo_ta: "Tổng kết kết quả và rút kinh nghiệm" },
          ],
        },
      ],
      ket_qua_can_dat: [
        "Hiểu biết về các vấn đề xã hội địa phương",
        "Có kinh nghiệm thực hiện dự án cộng đồng",
        "Hình thành ý thức trách nhiệm công dân",
      ],
      phuong_phap_goi_y: ["Khảo sát", "Dự án", "Thiện nguyện", "Tuyên truyền"],
      so_tiet_de_xuat: 4,
      thang_thuc_hien: [12, 1],
      tu_khoa_tim_kiem: [
        "cộng đồng",
        "thiện nguyện",
        "dự án xã hội",
        "trách nhiệm công dân",
      ],

      goi_y_tich_hop: {
        bien_ban_hop: [
          "Thảo luận kế hoạch tổ chức hoạt động thiện nguyện cấp tổ/trường",
          "Phân công hướng dẫn các nhóm dự án của HS",
        ],
        ke_hoach_day_hoc: [
          "Tích hợp NLS 2.4 khi cho HS làm khảo sát online",
          "Tích hợp giáo dục đạo đức về tinh thần tương thân tương ái",
        ],
        ngoai_khoa: [
          "Chương trình tình nguyện mùa hè xanh",
          "Ngày hội thiện nguyện toàn trường",
          "Gây quỹ ủng hộ đồng bào khó khăn",
        ],
      },
    },

    {
      ma: "10.7",
      ten: "Bảo tồn cảnh quan thiên nhiên",
      mach_noi_dung: "tu_nhien",
      muc_tieu: [
        "Tìm hiểu về các cảnh quan thiên nhiên, di tích lịch sử địa phương",
        "Xây dựng ý thức bảo tồn",
        "Tuyên truyền bảo vệ cảnh quan",
      ],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Tìm hiểu danh thắng địa phương",
          mo_ta:
            "Nghiên cứu về các cảnh quan thiên nhiên, di tích lịch sử tại địa phương",
          nhiem_vu: [
            {
              ten: "Nghiên cứu tài liệu",
              mo_ta: "Tìm hiểu lịch sử, giá trị, thực trạng của các danh thắng",
            },
            {
              ten: "Tham quan thực tế",
              mo_ta: "Đi thực địa quan sát, ghi chép, chụp ảnh",
            },
          ],
        },
        {
          so_thu_tu: 2,
          ten: "Tuyên truyền bảo tồn",
          mo_ta: "Xây dựng các ấn phẩm tuyên truyền ý thức bảo vệ cảnh quan",
          nhiem_vu: [
            {
              ten: "Thiết kế ấn phẩm",
              mo_ta: "Làm poster, tờ rơi, video tuyên truyền",
              ky_nang_can_dat: ["NLS 2.3"],
            },
            {
              ten: "Phân phát/đăng tải",
              mo_ta: "Tuyên truyền cho du khách, người dân, trên mạng xã hội",
            },
          ],
        },
      ],
      ket_qua_can_dat: [
        "Hiểu biết về cảnh quan thiên nhiên địa phương",
        "Có ý thức bảo tồn di sản",
        "Tạo được sản phẩm tuyên truyền",
      ],
      phuong_phap_goi_y: [
        "Tham quan",
        "Nghiên cứu",
        "Thiết kế sản phẩm",
        "Tuyên truyền",
      ],
      so_tiet_de_xuat: 3,
      thang_thuc_hien: [1, 2],
      tu_khoa_tim_kiem: ["bảo tồn", "cảnh quan", "di tích", "thiên nhiên"],
    },

    {
      ma: "10.8",
      ten: "Bảo vệ môi trường tự nhiên",
      mach_noi_dung: "tu_nhien",
      muc_tieu: [
        "Phân tích, đánh giá thực trạng môi trường địa phương",
        "Thuyết trình về ý nghĩa bảo vệ môi trường",
        "Thực hiện các giải pháp bảo vệ môi trường",
      ],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Phân tích thực trạng môi trường",
          mo_ta: "Đi thực tế, quan sát và ghi chép các vấn đề ô nhiễm",
          nhiem_vu: [
            {
              ten: "Khảo sát thực địa",
              mo_ta:
                "Quan sát ô nhiễm nước, không khí, rác thải tại địa phương",
            },
            {
              ten: "Lập báo cáo",
              mo_ta: "Viết báo cáo phân tích thực trạng với số liệu, hình ảnh",
            },
          ],
        },
        {
          so_thu_tu: 2,
          ten: "Thuyết trình về BVMT",
          mo_ta: "Rèn luyện kỹ năng nói và tư duy lập luận",
          nhiem_vu: [
            {
              ten: "Chuẩn bị bài thuyết trình",
              mo_ta: "Nghiên cứu và soạn slide/poster",
            },
            {
              ten: "Trình bày",
              mo_ta: "Thuyết trình 5-7 phút trước lớp về vấn đề môi trường",
            },
          ],
        },
        {
          so_thu_tu: 3,
          ten: "Đề xuất và thực hiện giải pháp",
          mo_ta: "Đề xuất giải pháp khả thi và ra quân thực hiện",
          nhiem_vu: [
            {
              ten: "Brainstorm giải pháp",
              mo_ta: "Đề xuất: phân loại rác, hạn chế nhựa, trồng cây...",
            },
            {
              ten: "Ra quân thực hiện",
              mo_ta: "Dọn dẹp vệ sinh, trồng cây xanh tại trường/địa phương",
            },
          ],
        },
      ],
      ket_qua_can_dat: [
        "Có kỹ năng nghiên cứu khoa học cơ bản",
        "Thuyết trình được về vấn đề môi trường",
        "Thực hiện được hoạt động bảo vệ môi trường cụ thể",
      ],
      phuong_phap_goi_y: [
        "Nghiên cứu thực địa",
        "Thuyết trình",
        "Dự án",
        "Hoạt động tập thể",
      ],
      so_tiet_de_xuat: 4,
      thang_thuc_hien: [2, 3],
      tu_khoa_tim_kiem: ["bảo vệ môi trường", "ô nhiễm", "rác thải", "xanh"],
    },

    {
      ma: "10.9",
      ten: "Tìm hiểu nghề nghiệp",
      mach_noi_dung: "huong_nghiep",
      muc_tieu: [
        "Hiểu cách phân loại các nhóm nghề trong xã hội",
        "Nắm được đặc điểm, yêu cầu của một số nghề phổ biến",
        "Bắt đầu hình thành nhận thức về thế giới nghề nghiệp",
      ],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Phân loại nghề nghiệp",
          mo_ta: "Tìm hiểu cách phân loại các nhóm nghề trong xã hội",
          nhiem_vu: [
            {
              ten: "Nghiên cứu phân loại",
              mo_ta:
                "Tìm hiểu các nhóm nghề: kỹ thuật, xã hội, nghệ thuật, kinh doanh...",
            },
            {
              ten: "Lập sơ đồ",
              mo_ta: "Vẽ sơ đồ tư duy về các nhóm nghề và ví dụ cụ thể",
            },
          ],
        },
        {
          so_thu_tu: 2,
          ten: "Tìm hiểu đặc điểm nghề nghiệp",
          mo_ta: "Nghiên cứu yêu cầu về phẩm chất, năng lực của một số nghề",
          nhiem_vu: [
            {
              ten: "Nghiên cứu 3-5 nghề",
              mo_ta:
                "Tìm hiểu chi tiết: công việc, yêu cầu, thu nhập, triển vọng",
            },
            {
              ten: "Phỏng vấn người làm nghề",
              mo_ta: "Hỏi về công việc thực tế, áp lực, niềm vui trong nghề",
            },
          ],
        },
      ],
      ket_qua_can_dat: [
        "Biết cách phân loại nghề nghiệp",
        "Hiểu đặc điểm của một số nghề phổ biến",
        "Có hứng thú tìm hiểu về nghề nghiệp",
      ],
      phuong_phap_goi_y: [
        "Nghiên cứu",
        "Sơ đồ tư duy",
        "Phỏng vấn",
        "Tham quan",
      ],
      so_tiet_de_xuat: 3,
      thang_thuc_hien: [3, 4],
      tu_khoa_tim_kiem: [
        "nghề nghiệp",
        "hướng nghiệp",
        "việc làm",
        "nhóm nghề",
      ],

      goi_y_tich_hop: {
        bien_ban_hop: [
          "Thảo luận kế hoạch tổ chức ngày hội hướng nghiệp",
          "Mời doanh nghiệp/cựu HS về chia sẻ kinh nghiệm",
        ],
        ke_hoach_day_hoc: [
          "Tích hợp NLS 1.1, 1.2 khi cho HS tìm kiếm thông tin nghề online",
          "Rèn kỹ năng phỏng vấn, thu thập thông tin",
        ],
        ngoai_khoa: [
          "Ngày hội hướng nghiệp với các gian hàng nghề nghiệp",
          "Tham quan doanh nghiệp, nhà máy, công ty",
          "Chương trình 'Một ngày làm...' (bác sĩ, kỹ sư, nhà báo...)",
        ],
      },
    },

    {
      ma: "10.10",
      ten: "Hiểu bản thân để chọn nghề phù hợp",
      mach_noi_dung: "huong_nghiep",
      muc_tieu: [
        "Đối chiếu đặc điểm bản thân với yêu cầu nghề nghiệp",
        "Sử dụng công cụ trắc nghiệm Holland",
        "Xác định nhóm nghề phù hợp sơ bộ",
      ],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Đối chiếu bản thân - nghề nghiệp",
          mo_ta: "So sánh đặc điểm tính cách, sở thích với yêu cầu nghề",
          nhiem_vu: [
            {
              ten: "Lập bảng đối chiếu",
              mo_ta:
                "So sánh điểm mạnh/yếu của mình với yêu cầu của 3-5 nghề quan tâm",
            },
            {
              ten: "Phân tích độ phù hợp",
              mo_ta:
                "Đánh giá mức độ phù hợp, xác định khoảng cách cần bổ sung",
            },
          ],
        },
        {
          so_thu_tu: 2,
          ten: "Trắc nghiệm Holland",
          mo_ta: "Sử dụng công cụ trắc nghiệm Holland RIASEC",
          nhiem_vu: [
            {
              ten: "Làm trắc nghiệm",
              mo_ta: "Thực hiện bài trắc nghiệm Holland online",
              ky_nang_can_dat: ["NLS 1.1"],
            },
            {
              ten: "Phân tích kết quả",
              mo_ta:
                "Xác định nhóm nghề phù hợp: R-I-A-S-E-C và nghề tương ứng",
            },
          ],
        },
      ],
      ket_qua_can_dat: [
        "Nhận biết được sự phù hợp giữa bản thân và nghề nghiệp",
        "Xác định được nhóm nghề phù hợp với bản thân",
        "Có định hướng sơ bộ về nghề nghiệp tương lai",
      ],
      phuong_phap_goi_y: [
        "Trắc nghiệm",
        "Phân tích",
        "Tư vấn",
        "Thảo luận nhóm",
      ],
      so_tiet_de_xuat: 3,
      thang_thuc_hien: [4],
      tu_khoa_tim_kiem: [
        "Holland",
        "RIASEC",
        "trắc nghiệm nghề",
        "phù hợp nghề",
      ],
    },

    {
      ma: "10.11",
      ten: "Lập kế hoạch học tập, rèn luyện theo định hướng nghề nghiệp",
      mach_noi_dung: "huong_nghiep",
      muc_tieu: [
        "Xây dựng kế hoạch học tập các môn liên quan đến khối thi",
        "Lên kế hoạch bổ sung kỹ năng mềm cần thiết",
        "Hình thành thói quen theo đuổi mục tiêu nghề nghiệp",
      ],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Lập lộ trình học tập",
          mo_ta: "Xây dựng kế hoạch học tập theo định hướng nghề nghiệp",
          nhiem_vu: [
            {
              ten: "Xác định khối thi/tổ hợp",
              mo_ta: "Chọn tổ hợp môn phù hợp với ngành nghề mong muốn",
            },
            {
              ten: "Lập kế hoạch",
              mo_ta: "Xây dựng lịch học, mục tiêu điểm số cho từng môn",
            },
          ],
        },
        {
          so_thu_tu: 2,
          ten: "Rèn luyện kỹ năng bổ sung",
          mo_ta: "Lên kế hoạch phát triển kỹ năng cần thiết cho nghề",
          nhiem_vu: [
            {
              ten: "Xác định kỹ năng cần",
              mo_ta:
                "Liệt kê kỹ năng cần cho nghề: ngoại ngữ, tin học, giao tiếp...",
            },
            {
              ten: "Lập kế hoạch rèn luyện",
              mo_ta: "Xây dựng lộ trình học kỹ năng trong 1-2 năm",
            },
          ],
        },
      ],
      ket_qua_can_dat: [
        "Có kế hoạch học tập rõ ràng theo định hướng nghề nghiệp",
        "Biết được các kỹ năng cần bổ sung",
        "Bắt đầu thực hiện kế hoạch phát triển bản thân",
      ],
      phuong_phap_goi_y: [
        "Lập kế hoạch",
        "Tư vấn",
        "Theo dõi tiến độ",
        "Đánh giá định kỳ",
      ],
      so_tiet_de_xuat: 3,
      thang_thuc_hien: [5],
      tu_khoa_tim_kiem: [
        "kế hoạch học tập",
        "khối thi",
        "tổ hợp",
        "định hướng nghề",
      ],
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
      muc_tieu: [
        "Chủ động tham gia xây dựng và phát triển nhà trường",
        "Xây dựng mối quan hệ tốt đẹp với thầy cô, bạn bè",
        "Kiểm soát quan hệ trên mạng xã hội",
        "Hợp tác phát triển nhà trường",
      ],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Tham gia chiến lược phát triển trường",
          mo_ta:
            "Nghiên cứu và đóng góp vào chiến lược phát triển của nhà trường",
          nhiem_vu: [
            {
              ten: "Nghiên cứu chiến lược",
              mo_ta: "Tìm hiểu kế hoạch phát triển 5 năm của trường",
            },
            {
              ten: "Đề xuất sáng kiến",
              mo_ta:
                "Đưa ra ý tưởng cải thiện: cơ sở vật chất, hoạt động, văn hóa",
            },
          ],
        },
        {
          so_thu_tu: 2,
          ten: "Tổ chức sự kiện trường",
          mo_ta: "Trực tiếp tham gia tổ chức các sự kiện lớn",
          nhiem_vu: [
            {
              ten: "Lập kế hoạch sự kiện",
              mo_ta: "Thiết kế chương trình chi tiết, phân công nhiệm vụ",
            },
            {
              ten: "Điều phối thực hiện",
              mo_ta: "Dẫn chương trình, quản lý hậu cần, xử lý sự cố",
            },
          ],
        },
        {
          so_thu_tu: 3,
          ten: "Xây dựng quan hệ tin cậy",
          mo_ta: "Phát triển từ làm quen sang xây dựng lòng tin và hỗ trợ",
          nhiem_vu: [
            {
              ten: "Hỗ trợ bạn học",
              mo_ta: "Tham gia nhóm học tập, tutoring cho bạn yếu hơn",
            },
            {
              ten: "Kết nối với thầy cô",
              mo_ta: "Chủ động trao đổi, xin tư vấn về học tập và hướng nghiệp",
            },
          ],
        },
        {
          so_thu_tu: 4,
          ten: "An toàn trên mạng xã hội",
          mo_ta: "Giải quyết vấn đề cyberbullying, ứng xử trên không gian ảo",
          nhiem_vu: [
            {
              ten: "Nhận diện rủi ro",
              mo_ta: "Tìm hiểu các hình thức bắt nạt qua mạng, lừa đảo online",
            },
            {
              ten: "Xây dựng hình ảnh số",
              mo_ta: "Quản lý digital footprint, bảo vệ thông tin cá nhân",
              ky_nang_can_dat: ["NLS 3.1", "NLS 3.2"],
            },
          ],
        },
      ],
      ket_qua_can_dat: [
        "Có vai trò tích cực trong phát triển nhà trường",
        "Xây dựng được mối quan hệ tin cậy",
        "Biết cách ứng xử an toàn trên mạng xã hội",
      ],
      phuong_phap_goi_y: ["Dự án", "Tổ chức sự kiện", "Case study", "Workshop"],
      so_tiet_de_xuat: 5,
      thang_thuc_hien: [9],
      tu_khoa_tim_kiem: [
        "phát triển trường",
        "mạng xã hội",
        "an toàn số",
        "cyberbullying",
      ],

      goi_y_tich_hop: {
        bien_ban_hop: [
          "Thảo luận vai trò của HS lớp 11 trong các hoạt động trường",
          "Kế hoạch tổ chức tập huấn an toàn mạng cho HS",
        ],
        ke_hoach_day_hoc: [
          "Tích hợp NLS 3.1, 3.2 về an toàn thông tin",
          "Tích hợp giáo dục đạo đức về trách nhiệm trên không gian số",
        ],
        ngoai_khoa: [
          "Workshop 'Digital Citizen - Công dân số có trách nhiệm'",
          "Cuộc thi ý tưởng phát triển trường",
        ],
      },
    },

    {
      ma: "11.2",
      ten: "Khám phá bản thân",
      mach_noi_dung: "ban_than",
      muc_tieu: [
        "Khám phá đặc điểm riêng (unique selling points) của cá nhân",
        "Rèn luyện bản lĩnh, sự tự tin",
        "Phát triển khả năng thích ứng với thay đổi (Adaptability)",
      ],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Khám phá Unique Selling Points",
          mo_ta: "Nhận diện những nét độc đáo của cá nhân",
          nhiem_vu: [
            {
              ten: "Tự phân tích",
              mo_ta: "Xác định điểm khác biệt của mình so với người khác",
            },
            {
              ten: "Thu thập phản hồi 360 độ",
              mo_ta: "Hỏi ý kiến từ gia đình, bạn bè, thầy cô về điểm nổi bật",
            },
          ],
        },
        {
          so_thu_tu: 2,
          ten: "Thể hiện sự tự tin",
          mo_ta: "Rèn luyện bản lĩnh để không bị hòa tan vào đám đông",
          nhiem_vu: [
            {
              ten: "Xác định giá trị cốt lõi",
              mo_ta: "Khẳng định những giá trị không thỏa hiệp dù bị áp lực",
            },
            {
              ten: "Thực hành assertiveness",
              mo_ta: "Bày tỏ quan điểm một cách tôn trọng nhưng kiên định",
            },
          ],
        },
        {
          so_thu_tu: 3,
          ten: "Phát triển Adaptability",
          mo_ta: "Rèn luyện chỉ số vượt khó (AQ) và khả năng thích nghi",
          nhiem_vu: [
            {
              ten: "Phân tích tình huống khó",
              mo_ta: "Chia sẻ cách vượt qua khó khăn đã gặp",
            },
            {
              ten: "Lập chiến lược thích ứng",
              mo_ta: "Xây dựng kế hoạch đối phó với các thay đổi bất ngờ",
            },
          ],
        },
      ],
      ket_qua_can_dat: [
        "Nhận biết được điểm độc đáo của bản thân",
        "Tự tin thể hiện quan điểm",
        "Có khả năng thích ứng với thay đổi",
      ],
      phuong_phap_goi_y: [
        "Tự phân tích",
        "Phản hồi 360 độ",
        "Case study",
        "Coaching",
      ],
      so_tiet_de_xuat: 4,
      thang_thuc_hien: [9, 10],
      tu_khoa_tim_kiem: ["bản sắc", "tự tin", "adaptability", "unique"],
    },

    {
      ma: "11.3",
      ten: "Rèn luyện bản thân",
      mach_noi_dung: "ban_than",
      muc_tieu: [
        "Quản lý thời gian nâng cao",
        "Cân bằng học tập và cuộc sống",
        "Rèn luyện tư duy tích cực",
      ],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Quản lý thời gian nâng cao",
          mo_ta: "Áp dụng các phương pháp quản lý thời gian hiệu quả",
          nhiem_vu: [
            {
              ten: "Học phương pháp",
              mo_ta: "Tìm hiểu Pomodoro, Eisenhower Matrix, Time Blocking, GTD",
            },
            {
              ten: "Áp dụng và đánh giá",
              mo_ta: "Thực hành trong 2 tuần và đánh giá hiệu quả",
            },
          ],
        },
        {
          so_thu_tu: 2,
          ten: "Work-Life Balance",
          mo_ta: "Cân bằng giữa học tập căng thẳng và cuộc sống cá nhân",
          nhiem_vu: [
            {
              ten: "Phân tích thời gian",
              mo_ta: "Ghi chép cách sử dụng thời gian trong 1 tuần",
            },
            {
              ten: "Điều chỉnh",
              mo_ta: "Lập lịch cân bằng: học, nghỉ ngơi, giải trí, gia đình",
            },
          ],
        },
        {
          so_thu_tu: 3,
          ten: "Growth Mindset",
          mo_ta: "Rèn luyện tư duy phát triển",
          nhiem_vu: [
            {
              ten: "Nhận diện fixed mindset",
              mo_ta: "Ghi nhận những lúc có suy nghĩ tiêu cực, giới hạn",
            },
            {
              ten: "Reframing",
              mo_ta:
                "Thực hành chuyển từ 'Tôi không thể' sang 'Tôi chưa biết cách'",
            },
          ],
        },
      ],
      ket_qua_can_dat: [
        "Quản lý thời gian hiệu quả hơn",
        "Có cuộc sống cân bằng",
        "Phát triển growth mindset",
      ],
      phuong_phap_goi_y: ["Thực hành", "Nhật ký", "Coaching", "Peer sharing"],
      so_tiet_de_xuat: 3,
      thang_thuc_hien: [10, 11],
      tu_khoa_tim_kiem: [
        "quản lý thời gian",
        "cân bằng",
        "growth mindset",
        "tư duy tích cực",
      ],
    },

    {
      ma: "11.4",
      ten: "Trách nhiệm với gia đình",
      mach_noi_dung: "xa_hoi",
      muc_tieu: [
        "Hiểu và thực hành quản lý tài chính gia đình",
        "Thực hiện mục tiêu tiết kiệm",
        "Xây dựng văn hóa ứng xử trong gia đình",
      ],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Quản lý tài chính cá nhân",
          mo_ta: "Thảo luận về kế hoạch chi tiêu phù hợp với thu nhập",
          nhiem_vu: [
            {
              ten: "Tìm hiểu thu-chi",
              mo_ta: "Nghiên cứu cơ cấu thu nhập và chi tiêu của gia đình",
            },
            {
              ten: "Lập ngân sách cá nhân",
              mo_ta: "Thực hành lập ngân sách chi tiêu hàng tháng",
            },
          ],
        },
        {
          so_thu_tu: 2,
          ten: "Thực hành tiết kiệm",
          mo_ta: "Đặt và thực hiện mục tiêu tiết kiệm",
          nhiem_vu: [
            {
              ten: "Đặt mục tiêu SMART",
              mo_ta: "VD: Tiết kiệm 500k/tháng trong 6 tháng để mua...",
            },
            {
              ten: "Theo dõi tiến độ",
              mo_ta: "Ghi chép và báo cáo tiến độ tiết kiệm",
            },
          ],
        },
        {
          so_thu_tu: 3,
          ten: "Văn hóa gia đình",
          mo_ta: "Xây dựng văn hóa ứng xử tích cực trong gia đình",
          nhiem_vu: [
            {
              ten: "Trao đổi với chuyên gia",
              mo_ta: "Mời chuyên gia tâm lý nói chuyện về quan hệ gia đình",
            },
            {
              ten: "Thảo luận case study",
              mo_ta: "Giải quyết các tình huống mâu thuẫn thế hệ",
            },
          ],
        },
      ],
      ket_qua_can_dat: [
        "Hiểu biết về quản lý tài chính cá nhân",
        "Có thói quen tiết kiệm",
        "Biết cách xây dựng văn hóa gia đình tích cực",
      ],
      phuong_phap_goi_y: [
        "Thực hành",
        "Mời chuyên gia",
        "Thảo luận",
        "Dự án cá nhân",
      ],
      so_tiet_de_xuat: 4,
      thang_thuc_hien: [11, 12],
      tu_khoa_tim_kiem: [
        "tài chính cá nhân",
        "tiết kiệm",
        "ngân sách",
        "gia đình",
      ],

      goi_y_tich_hop: {
        bien_ban_hop: [
          "Thảo luận cách lồng ghép giáo dục tài chính vào giảng dạy",
          "Phối hợp với phụ huynh trong giáo dục quản lý tiền bạc",
        ],
        ke_hoach_day_hoc: [
          "Tích hợp NLS 1.3 khi cho HS sử dụng app quản lý tài chính",
          "Tích hợp giáo dục đạo đức về tiết kiệm, trách nhiệm",
        ],
        ngoai_khoa: [
          "Workshop 'Quản lý tài chính cho Gen Z'",
          "Cuộc thi lập kế hoạch tài chính cá nhân",
        ],
      },
    },

    {
      ma: "11.5",
      ten: "Phát triển cộng đồng",
      mach_noi_dung: "xa_hoi",
      muc_tieu: [
        "Xây dựng và thực hiện kế hoạch truyền thông cộng đồng",
        "Đóng vai trò khởi xướng các dự án nhỏ",
        "Phát triển kỹ năng lãnh đạo",
      ],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Thiết kế chiến dịch truyền thông",
          mo_ta: "Xây dựng kế hoạch truyền thông cho vấn đề cộng đồng",
          nhiem_vu: [
            {
              ten: "Chọn chủ đề",
              mo_ta: "Xác định vấn đề cộng đồng cần truyền thông",
            },
            {
              ten: "Lập kế hoạch IMC",
              mo_ta:
                "Thiết kế chiến dịch: mục tiêu, đối tượng, thông điệp, kênh",
            },
          ],
        },
        {
          so_thu_tu: 2,
          ten: "Khởi xướng dự án an sinh",
          mo_ta: "Đóng vai trò người khởi xướng các dự án xã hội",
          nhiem_vu: [
            {
              ten: "Viết đề xuất dự án",
              mo_ta: "Đề xuất: mục tiêu, hoạt động, ngân sách, đánh giá",
            },
            {
              ten: "Huy động nguồn lực",
              mo_ta: "Kêu gọi sự tham gia, quyên góp từ cộng đồng",
            },
          ],
        },
        {
          so_thu_tu: 3,
          ten: "Triển khai và đánh giá tác động",
          mo_ta: "Thực hiện dự án và đo lường kết quả",
          nhiem_vu: [
            {
              ten: "Triển khai",
              mo_ta: "Thực hiện các hoạt động theo kế hoạch",
            },
            {
              ten: "Đánh giá tác động",
              mo_ta: "Đo lường kết quả, viết báo cáo tổng kết",
            },
          ],
        },
      ],
      ket_qua_can_dat: [
        "Có kỹ năng thiết kế chiến dịch truyền thông",
        "Có kinh nghiệm khởi xướng và quản lý dự án",
        "Phát triển năng lực lãnh đạo",
      ],
      phuong_phap_goi_y: [
        "Dự án",
        "Truyền thông",
        "Lãnh đạo nhóm",
        "Đánh giá tác động",
      ],
      so_tiet_de_xuat: 4,
      thang_thuc_hien: [12, 1],
      tu_khoa_tim_kiem: [
        "truyền thông",
        "dự án xã hội",
        "lãnh đạo",
        "khởi xướng",
      ],
    },

    {
      ma: "11.6",
      ten: "Bảo tồn cảnh quan thiên nhiên",
      mach_noi_dung: "tu_nhien",
      muc_tieu: [
        "Đánh giá thực trạng bảo tồn tại các di tích, danh lam thắng cảnh",
        "Đề xuất giải pháp bảo tồn gắn với phát triển du lịch bền vững",
      ],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Đánh giá thực trạng bảo tồn",
          mo_ta: "Khảo sát và đánh giá tình trạng bảo tồn di tích",
          nhiem_vu: [
            {
              ten: "Khảo sát thực địa",
              mo_ta: "Đi thực tế đánh giá tình trạng bảo tồn",
            },
            {
              ten: "Phỏng vấn stakeholders",
              mo_ta: "Trao đổi với người quản lý, người dân, du khách",
            },
          ],
        },
        {
          so_thu_tu: 2,
          ten: "Đề xuất giải pháp bền vững",
          mo_ta: "Xây dựng đề xuất bảo tồn gắn với phát triển du lịch",
          nhiem_vu: [
            {
              ten: "Nghiên cứu mô hình",
              mo_ta:
                "Tìm hiểu các mô hình du lịch bền vững trong và ngoài nước",
            },
            {
              ten: "Viết đề xuất",
              mo_ta: "Đề xuất giải pháp phù hợp với điều kiện địa phương",
            },
          ],
        },
      ],
      ket_qua_can_dat: [
        "Có khả năng đánh giá thực trạng bảo tồn",
        "Đề xuất được giải pháp phát triển bền vững",
      ],
      phuong_phap_goi_y: ["Khảo sát", "Nghiên cứu", "Đề xuất", "Thuyết trình"],
      so_tiet_de_xuat: 3,
      thang_thuc_hien: [1, 2],
      tu_khoa_tim_kiem: [
        "bảo tồn",
        "du lịch bền vững",
        "di tích",
        "danh thắng",
      ],
    },

    {
      ma: "11.7",
      ten: "Bảo vệ môi trường",
      mach_noi_dung: "tu_nhien",
      muc_tieu: [
        "Thực hiện các dự án môi trường có tính khoa học kỹ thuật",
        "Tái chế rác thải thành vật phẩm có ích",
        "Tổ chức chiến dịch truyền thông đa phương tiện",
      ],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Dự án tái chế sáng tạo",
          mo_ta: "Tái chế rác thải thành vật phẩm có ích",
          nhiem_vu: [
            {
              ten: "Nghiên cứu kỹ thuật",
              mo_ta: "Tìm hiểu cách tái chế: nhựa, giấy, vải, điện tử",
            },
            {
              ten: "Tạo sản phẩm",
              mo_ta: "Làm sản phẩm tái chế: túi vải, chậu cây, đồ trang trí",
            },
          ],
        },
        {
          so_thu_tu: 2,
          ten: "Chiến dịch truyền thông số",
          mo_ta: "Tổ chức chiến dịch truyền thông đa phương tiện về BVMT",
          nhiem_vu: [
            {
              ten: "Sản xuất nội dung",
              mo_ta: "Làm video, podcast, infographic về môi trường",
              ky_nang_can_dat: ["NLS 1.2", "NLS 2.3"],
            },
            {
              ten: "Lan tỏa trên MXH",
              mo_ta: "Đăng tải và quảng bá trên các nền tảng số",
            },
          ],
        },
      ],
      ket_qua_can_dat: [
        "Tạo được sản phẩm tái chế",
        "Tổ chức được chiến dịch truyền thông số",
      ],
      phuong_phap_goi_y: [
        "Dự án STEM",
        "Truyền thông số",
        "Workshop",
        "Triển lãm",
      ],
      so_tiet_de_xuat: 4,
      thang_thuc_hien: [2, 3],
      tu_khoa_tim_kiem: ["tái chế", "môi trường", "truyền thông", "STEM"],
    },

    {
      ma: "11.8",
      ten: "Các nhóm nghề cơ bản và yêu cầu của thị trường lao động",
      mach_noi_dung: "huong_nghiep",
      muc_tieu: [
        "Tìm hiểu các nhóm nghề cơ bản trong xã hội hiện đại",
        "Phân tích xu hướng phát triển của các nghề",
        "Hiểu yêu cầu của thị trường lao động",
      ],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Nghiên cứu thị trường lao động",
          mo_ta: "Tìm hiểu các nhóm nghề và xu hướng phát triển",
          nhiem_vu: [
            {
              ten: "Phân loại nhóm nghề",
              mo_ta:
                "Nghiên cứu: công nghệ, y tế, giáo dục, tài chính, sáng tạo...",
            },
            {
              ten: "Phân tích xu hướng",
              mo_ta:
                "Xác định nghề hot, nghề có nguy cơ biến mất do AI/automation",
            },
          ],
        },
        {
          so_thu_tu: 2,
          ten: "Phân tích yêu cầu tuyển dụng",
          mo_ta: "Tìm hiểu yêu cầu của thị trường",
          nhiem_vu: [
            {
              ten: "Nghiên cứu tin tuyển dụng",
              mo_ta: "Phân tích: bằng cấp, kỹ năng, kinh nghiệm yêu cầu",
            },
            {
              ten: "Phỏng vấn HR",
              mo_ta: "Trao đổi với nhà tuyển dụng về tiêu chí tuyển dụng",
            },
          ],
        },
      ],
      ket_qua_can_dat: [
        "Hiểu biết về các nhóm nghề",
        "Nắm được xu hướng phát triển nghề nghiệp",
        "Biết được yêu cầu của thị trường lao động",
      ],
      phuong_phap_goi_y: [
        "Nghiên cứu",
        "Phỏng vấn",
        "Tham quan doanh nghiệp",
        "Mời chuyên gia",
      ],
      so_tiet_de_xuat: 4,
      thang_thuc_hien: [3, 4],
      tu_khoa_tim_kiem: [
        "thị trường lao động",
        "xu hướng nghề",
        "tuyển dụng",
        "nhóm nghề",
      ],
    },

    {
      ma: "11.9",
      ten: "Rèn luyện phẩm chất, năng lực phù hợp với nhóm nghề lựa chọn",
      mach_noi_dung: "huong_nghiep",
      muc_tieu: [
        "Xác định phẩm chất đặc thù cần có cho nghề đã chọn",
        "Lập kế hoạch rèn luyện các phẩm chất, năng lực",
      ],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Xác định phẩm chất cần thiết",
          mo_ta: "Nghiên cứu các phẩm chất đặc thù của nghề",
          nhiem_vu: [
            {
              ten: "Nghiên cứu yêu cầu nghề",
              mo_ta:
                "VD: Y - cẩn trọng, y đức; IT - logic, sáng tạo; Giáo dục - kiên nhẫn",
            },
            {
              ten: "Tự đánh giá",
              mo_ta: "So sánh phẩm chất bản thân với yêu cầu nghề",
            },
          ],
        },
        {
          so_thu_tu: 2,
          ten: "Lập kế hoạch rèn luyện",
          mo_ta: "Xây dựng kế hoạch phát triển phẩm chất còn thiếu",
          nhiem_vu: [
            {
              ten: "Xác định khoảng cách",
              mo_ta: "Liệt kê những gì còn thiếu so với yêu cầu",
            },
            {
              ten: "Lập kế hoạch",
              mo_ta: "Xây dựng lộ trình rèn luyện trong 1-2 năm",
            },
          ],
        },
      ],
      ket_qua_can_dat: [
        "Xác định được các phẩm chất cần rèn luyện",
        "Có kế hoạch phát triển cụ thể",
      ],
      phuong_phap_goi_y: ["Tự đánh giá", "Lập kế hoạch", "Tư vấn", "Thực hành"],
      so_tiet_de_xuat: 3,
      thang_thuc_hien: [4],
      tu_khoa_tim_kiem: [
        "phẩm chất nghề",
        "năng lực",
        "rèn luyện",
        "khoảng cách",
      ],
    },

    {
      ma: "11.10",
      ten: "Xây dựng và thực hiện kế hoạch học tập theo hướng ngành, nghề lựa chọn",
      mach_noi_dung: "huong_nghiep",
      muc_tieu: [
        "Xác định các môn học thế mạnh để xét tuyển đại học",
        "Xây dựng thời gian biểu học tập chi tiết",
      ],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Chọn tổ hợp xét tuyển",
          mo_ta: "Xác định các môn học cần tập trung",
          nhiem_vu: [
            {
              ten: "Nghiên cứu phương thức",
              mo_ta: "Tìm hiểu các trường, ngành và phương thức xét tuyển",
            },
            { ten: "Chọn tổ hợp", mo_ta: "Xác định khối thi/tổ hợp phù hợp" },
          ],
        },
        {
          so_thu_tu: 2,
          ten: "Lập lộ trình ôn tập",
          mo_ta: "Xây dựng kế hoạch học tập chi tiết",
          nhiem_vu: [
            {
              ten: "Đánh giá hiện trạng",
              mo_ta: "Xác định điểm mạnh/yếu của từng môn",
            },
            {
              ten: "Lập kế hoạch",
              mo_ta: "Xây dựng lịch học chi tiết theo tuần/tháng",
            },
          ],
        },
      ],
      ket_qua_can_dat: [
        "Xác định được tổ hợp xét tuyển phù hợp",
        "Có kế hoạch học tập chi tiết",
      ],
      phuong_phap_goi_y: [
        "Lập kế hoạch",
        "Tư vấn hướng nghiệp",
        "Theo dõi tiến độ",
      ],
      so_tiet_de_xuat: 3,
      thang_thuc_hien: [5],
      tu_khoa_tim_kiem: [
        "kế hoạch học tập",
        "xét tuyển",
        "tổ hợp môn",
        "ôn tập",
      ],
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
      ten: "Xây dựng và phát triển nhà trường",
      mach_noi_dung: "xa_hoi",
      muc_tieu: [
        "Phản hồi góp ý xây dựng cho nhà trường dựa trên 3 năm học tập",
        "Truyền lửa cho thế hệ đàn em",
        "Tổng kết và tri ân những gì nhận được",
      ],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Phản hồi góp ý xây dựng",
          mo_ta: "Đóng góp ý kiến cải thiện dựa trên trải nghiệm 3 năm",
          nhiem_vu: [
            {
              ten: "Viết góp ý",
              mo_ta:
                "Tổng hợp các điểm cần cải thiện: chương trình, cơ sở vật chất, hoạt động",
            },
            {
              ten: "Đề xuất giải pháp",
              mo_ta: "Đưa ra giải pháp khả thi từ góc nhìn học sinh",
            },
          ],
        },
        {
          so_thu_tu: 2,
          ten: "Mentoring đàn em",
          mo_ta: "Chia sẻ kinh nghiệm với học sinh lớp dưới",
          nhiem_vu: [
            {
              ten: "Tổ chức chia sẻ",
              mo_ta: "Talk về kinh nghiệm học tập, hoạt động, hướng nghiệp",
            },
            {
              ten: "Mentoring 1-1",
              mo_ta: "Hướng dẫn trực tiếp cho 1-2 em lớp dưới",
            },
          ],
        },
        {
          so_thu_tu: 3,
          ten: "Tri ân và tổng kết",
          mo_ta: "Tri ân thầy cô, bạn bè và tổng kết hành trình 3 năm",
          nhiem_vu: [
            {
              ten: "Viết thư tri ân",
              mo_ta: "Viết thư cảm ơn thầy cô, bạn bè đã đồng hành",
            },
            {
              ten: "Tổ chức lễ tri ân",
              mo_ta: "Tham gia tổ chức lễ tri ân cuối khóa",
            },
          ],
        },
      ],
      ket_qua_can_dat: [
        "Đóng góp ý kiến xây dựng cho nhà trường",
        "Truyền cảm hứng cho thế hệ tiếp nối",
        "Có ý thức biết ơn",
      ],
      phuong_phap_goi_y: [
        "Chia sẻ kinh nghiệm",
        "Mentoring",
        "Viết phản hồi",
        "Tổ chức sự kiện",
      ],
      so_tiet_de_xuat: 4,
      thang_thuc_hien: [9],
      tu_khoa_tim_kiem: ["tri ân", "góp ý", "mentoring", "lớp 12"],
    },

    {
      ma: "12.2",
      ten: "Khám phá bản thân",
      mach_noi_dung: "ban_than",
      muc_tieu: [
        "Tổng kết hành trình phát triển bản thân qua 12 năm học",
        "Khẳng định bản sắc cá nhân",
        "Chuẩn bị tâm lý cho giai đoạn trưởng thành",
      ],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Tổng kết hành trình bản thân",
          mo_ta: "Nhìn lại sự thay đổi và trưởng thành qua 12 năm",
          nhiem_vu: [
            {
              ten: "Viết tự truyện mini",
              mo_ta:
                "Viết về hành trình trưởng thành: thay đổi, bài học, thành tựu",
            },
            {
              ten: "Timeline cá nhân",
              mo_ta: "Tạo timeline các mốc quan trọng trong cuộc đời",
            },
          ],
        },
        {
          so_thu_tu: 2,
          ten: "Khẳng định bản sắc",
          mo_ta:
            "Định hình rõ bản sắc cá nhân trước khi bước vào cuộc sống mới",
          nhiem_vu: [
            {
              ten: "Personal branding",
              mo_ta: "Xây dựng hình ảnh cá nhân: CV, LinkedIn, portfolio",
            },
            {
              ten: "Elevator pitch",
              mo_ta: "Chuẩn bị bài giới thiệu bản thân 60 giây",
            },
          ],
        },
      ],
      ket_qua_can_dat: [
        "Có cái nhìn tổng quan về hành trình phát triển",
        "Khẳng định được bản sắc cá nhân",
        "Sẵn sàng cho giai đoạn mới",
      ],
      phuong_phap_goi_y: ["Viết tự truyện", "Personal branding", "Chia sẻ"],
      so_tiet_de_xuat: 3,
      thang_thuc_hien: [9, 10],
      tu_khoa_tim_kiem: ["bản sắc", "personal branding", "trưởng thành", "CV"],
    },

    {
      ma: "12.3",
      ten: "Rèn luyện bản thân",
      mach_noi_dung: "ban_than",
      muc_tieu: [
        "Quản lý stress trong giai đoạn cao điểm",
        "Duy trì động lực học tập và phấn đấu",
        "Xây dựng sức khỏe tinh thần",
      ],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Quản lý stress mùa thi",
          mo_ta: "Học cách đối phó với áp lực thi cử",
          nhiem_vu: [
            {
              ten: "Nhận diện stress",
              mo_ta:
                "Hiểu các biểu hiện stress và ngưỡng chịu đựng của bản thân",
            },
            {
              ten: "Kỹ thuật giảm stress",
              mo_ta: "Thực hành: thiền, yoga, thể dục, sở thích cá nhân",
            },
          ],
        },
        {
          so_thu_tu: 2,
          ten: "Duy trì động lực",
          mo_ta: "Giữ vững tinh thần trong suốt năm học cuối",
          nhiem_vu: [
            {
              ten: "Xác định Why",
              mo_ta: "Nhắc nhở bản thân về mục tiêu, lý do phấn đấu",
            },
            {
              ten: "Hệ thống hỗ trợ",
              mo_ta: "Xây dựng nhóm bạn, mentor hỗ trợ lẫn nhau",
            },
          ],
        },
        {
          so_thu_tu: 3,
          ten: "Sức khỏe tinh thần",
          mo_ta: "Chăm sóc sức khỏe tinh thần trong giai đoạn áp lực",
          nhiem_vu: [
            {
              ten: "Self-care routine",
              mo_ta: "Xây dựng thói quen chăm sóc bản thân mỗi ngày",
            },
            {
              ten: "Nhận diện cần hỗ trợ",
              mo_ta: "Biết khi nào cần tìm kiếm sự giúp đỡ từ chuyên gia",
            },
          ],
        },
      ],
      ket_qua_can_dat: [
        "Có kỹ năng quản lý stress hiệu quả",
        "Duy trì được động lực học tập",
        "Chăm sóc được sức khỏe tinh thần",
      ],
      phuong_phap_goi_y: ["Thực hành cá nhân", "Nhóm hỗ trợ", "Chia sẻ"],
      so_tiet_de_xuat: 4,
      thang_thuc_hien: [10, 11],
      tu_khoa_tim_kiem: ["stress", "động lực", "sức khỏe tinh thần", "mùa thi"],
    },

    {
      ma: "12.4",
      ten: "Đánh giá và điều chỉnh kế hoạch nghề nghiệp",
      mach_noi_dung: "huong_nghiep",
      muc_tieu: [
        "Đánh giá lại kế hoạch nghề nghiệp đã lập từ lớp 10, 11",
        "Điều chỉnh phù hợp với tình hình thực tế",
        "Chuẩn bị hồ sơ xét tuyển",
      ],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Rà soát kế hoạch",
          mo_ta: "Đánh giá mức độ thực hiện kế hoạch nghề nghiệp từ trước",
          nhiem_vu: [
            {
              ten: "So sánh kế hoạch vs thực tế",
              mo_ta: "Xem lại mục tiêu đã đặt, những gì đã làm được",
            },
            {
              ten: "Phân tích gap",
              mo_ta: "Xác định khoảng cách giữa mong muốn và thực tế",
            },
          ],
        },
        {
          so_thu_tu: 2,
          ten: "Điều chỉnh kế hoạch",
          mo_ta: "Cập nhật kế hoạch theo tình hình mới",
          nhiem_vu: [
            {
              ten: "Cập nhật Plan B, C",
              mo_ta: "Điều chỉnh các phương án dự phòng cho phù hợp",
            },
            {
              ten: "Xác định lộ trình mới",
              mo_ta: "Lập lộ trình chi tiết cho 6-12 tháng tới",
            },
          ],
        },
        {
          so_thu_tu: 3,
          ten: "Chuẩn bị hồ sơ",
          mo_ta: "Hoàn thiện hồ sơ xét tuyển đại học/cao đẳng/du học",
          nhiem_vu: [
            {
              ten: "CV và thư động lực",
              mo_ta: "Viết CV và motivation letter",
            },
            {
              ten: "Portfolio",
              mo_ta: "Tổng hợp sản phẩm, thành tích 3 năm THPT",
            },
          ],
        },
      ],
      ket_qua_can_dat: [
        "Có kế hoạch nghề nghiệp được cập nhật",
        "Hồ sơ xét tuyển hoàn chỉnh",
        "Sẵn sàng cho các kỳ thi, phỏng vấn",
      ],
      phuong_phap_goi_y: ["Phân tích SWOT", "Viết CV", "Thực hành phỏng vấn"],
      so_tiet_de_xuat: 5,
      thang_thuc_hien: [11, 12],
      tu_khoa_tim_kiem: ["kế hoạch nghề nghiệp", "CV", "xét tuyển", "hồ sơ"],
    },

    {
      ma: "12.5",
      ten: "Xây dựng và bảo vệ Tổ quốc",
      mach_noi_dung: "xa_hoi",
      muc_tieu: [
        "Hiểu sâu về quyền và nghĩa vụ công dân trưởng thành",
        "Sẵn sàng thực hiện nghĩa vụ quân sự/công dân",
        "Có ý thức bảo vệ chủ quyền quốc gia",
      ],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Công dân trưởng thành",
          mo_ta: "Tìm hiểu quyền và nghĩa vụ khi đủ 18 tuổi",
          nhiem_vu: [
            { ten: "Quyền bầu cử", mo_ta: "Tìm hiểu về quyền bầu cử, ứng cử" },
            {
              ten: "Nghĩa vụ pháp lý",
              mo_ta: "Hiểu về trách nhiệm pháp lý khi trưởng thành",
            },
          ],
        },
        {
          so_thu_tu: 2,
          ten: "Nghĩa vụ quân sự",
          mo_ta:
            "Tìm hiểu về nghĩa vụ quân sự và các hình thức phục vụ tổ quốc",
          nhiem_vu: [
            {
              ten: "Luật nghĩa vụ quân sự",
              mo_ta: "Tìm hiểu quy định về đăng ký, tạm hoãn, miễn",
            },
            {
              ten: "Các hình thức phục vụ",
              mo_ta: "Nghĩa vụ quân sự, dân quân tự vệ, dự bị động viên",
            },
          ],
        },
        {
          so_thu_tu: 3,
          ten: "Bảo vệ chủ quyền",
          mo_ta: "Ý thức về chủ quyền quốc gia trong thời đại mới",
          nhiem_vu: [
            {
              ten: "Chủ quyền biển đảo",
              mo_ta: "Tìm hiểu về Biển Đông, Hoàng Sa, Trường Sa",
            },
            {
              ten: "An ninh mạng",
              mo_ta: "Bảo vệ chủ quyền trên không gian mạng",
            },
          ],
        },
      ],
      ket_qua_can_dat: [
        "Sẵn sàng thực hiện quyền và nghĩa vụ công dân",
        "Có ý thức bảo vệ tổ quốc",
        "Hiểu biết về an ninh quốc gia",
      ],
      phuong_phap_goi_y: ["Thảo luận", "Nghiên cứu luật", "Gặp gỡ bộ đội"],
      so_tiet_de_xuat: 4,
      thang_thuc_hien: [12],
      tu_khoa_tim_kiem: ["nghĩa vụ quân sự", "công dân", "bầu cử", "chủ quyền"],
    },

    {
      ma: "12.6",
      ten: "Giữ gìn và phát huy di sản văn hóa, danh lam thắng cảnh",
      mach_noi_dung: "tu_nhien",
      muc_tieu: [
        "Trở thành người bảo vệ và quảng bá di sản văn hóa",
        "Có kỹ năng làm du lịch cộng đồng",
        "Ý thức gìn giữ cho thế hệ sau",
      ],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Ambassador văn hóa",
          mo_ta: "Trở thành đại sứ quảng bá di sản địa phương",
          nhiem_vu: [
            {
              ten: "Tạo content",
              mo_ta: "Viết blog, làm video giới thiệu di sản địa phương",
            },
            {
              ten: "Tour guide",
              mo_ta: "Thực hành làm hướng dẫn viên cho khách tham quan",
            },
          ],
        },
        {
          so_thu_tu: 2,
          ten: "Du lịch cộng đồng",
          mo_ta: "Tìm hiểu và tham gia mô hình du lịch bền vững",
          nhiem_vu: [
            {
              ten: "Nghiên cứu mô hình",
              mo_ta: "Tìm hiểu các mô hình du lịch cộng đồng thành công",
            },
            {
              ten: "Đề xuất sản phẩm",
              mo_ta: "Đề xuất sản phẩm du lịch cho địa phương",
            },
          ],
        },
      ],
      ket_qua_can_dat: [
        "Có khả năng quảng bá di sản",
        "Hiểu về du lịch bền vững",
        "Có sản phẩm du lịch sáng tạo",
      ],
      phuong_phap_goi_y: ["Làm content", "Thực địa", "Dự án nhóm"],
      so_tiet_de_xuat: 4,
      thang_thuc_hien: [1],
      tu_khoa_tim_kiem: ["di sản", "du lịch", "văn hóa", "ambassador"],
    },

    {
      ma: "12.7",
      ten: "Tham gia xây dựng cộng đồng",
      mach_noi_dung: "xa_hoi",
      muc_tieu: [
        "Đóng góp thực sự cho cộng đồng trước khi rời đi",
        "Để lại di sản cho thế hệ sau",
        "Xây dựng network và uy tín cá nhân",
      ],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Legacy project",
          mo_ta: "Thực hiện dự án để lại cho cộng đồng/trường",
          nhiem_vu: [
            {
              ten: "Xác định legacy",
              mo_ta:
                "Chọn dự án có ý nghĩa: thư viện, vườn trường, quỹ học bổng...",
            },
            {
              ten: "Thực hiện",
              mo_ta: "Triển khai và bàn giao cho thế hệ sau",
            },
          ],
        },
        {
          so_thu_tu: 2,
          ten: "Networking",
          mo_ta: "Xây dựng mạng lưới quan hệ cho tương lai",
          nhiem_vu: [
            {
              ten: "Alumni network",
              mo_ta: "Kết nối với cựu học sinh thành đạt",
            },
            {
              ten: "Mentor network",
              mo_ta: "Tìm kiếm mentor trong lĩnh vực quan tâm",
            },
          ],
        },
      ],
      ket_qua_can_dat: [
        "Hoàn thành dự án di sản",
        "Có mạng lưới quan hệ",
        "Để lại dấu ấn tích cực",
      ],
      phuong_phap_goi_y: ["PBL", "Networking", "Mentoring"],
      so_tiet_de_xuat: 4,
      thang_thuc_hien: [2],
      tu_khoa_tim_kiem: ["cộng đồng", "legacy", "networking", "dự án"],
    },

    {
      ma: "12.8",
      ten: "Bảo vệ cảnh quan, môi trường tự nhiên",
      mach_noi_dung: "tu_nhien",
      muc_tieu: [
        "Cam kết lối sống bền vững lâu dài",
        "Có khả năng advocacy môi trường",
        "Tạo ảnh hưởng đến người khác",
      ],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Sustainable lifestyle",
          mo_ta: "Xây dựng lối sống bền vững cá nhân",
          nhiem_vu: [
            {
              ten: "Carbon footprint",
              mo_ta: "Tính toán và cam kết giảm dấu chân carbon",
            },
            {
              ten: "Zero-waste challenge",
              mo_ta: "Thử thách 30 ngày giảm rác thải",
            },
          ],
        },
        {
          so_thu_tu: 2,
          ten: "Environmental advocacy",
          mo_ta: "Vận động người khác bảo vệ môi trường",
          nhiem_vu: [
            {
              ten: "Chiến dịch truyền thông",
              mo_ta: "Tổ chức chiến dịch về vấn đề môi trường cụ thể",
            },
            {
              ten: "Petition/Đề xuất",
              mo_ta: "Gửi đề xuất chính sách cho cơ quan chức năng",
            },
          ],
        },
      ],
      ket_qua_can_dat: [
        "Có lối sống bền vững",
        "Tạo ảnh hưởng đến người xung quanh",
        "Có sản phẩm vận động môi trường",
      ],
      phuong_phap_goi_y: ["Challenge cá nhân", "Vận động", "Truyền thông"],
      so_tiet_de_xuat: 3,
      thang_thuc_hien: [3],
      tu_khoa_tim_kiem: ["môi trường", "bền vững", "carbon", "zero-waste"],
    },

    {
      ma: "12.9",
      ten: "Kỹ năng sống tự lập",
      mach_noi_dung: "ban_than",
      muc_tieu: [
        "Có đầy đủ kỹ năng sống độc lập",
        "Sẵn sàng cho cuộc sống xa nhà",
        "Quản lý được cuộc sống cá nhân",
      ],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Quản lý tài chính cá nhân nâng cao",
          mo_ta: "Kỹ năng tài chính cho người trưởng thành",
          nhiem_vu: [
            {
              ten: "Budgeting thực tế",
              mo_ta: "Lập ngân sách sinh hoạt thực tế cho sinh viên",
            },
            {
              ten: "Mở tài khoản",
              mo_ta: "Thực hành mở tài khoản ngân hàng, ví điện tử",
            },
          ],
        },
        {
          so_thu_tu: 2,
          ten: "Kỹ năng sinh hoạt",
          mo_ta: "Các kỹ năng cần thiết khi sống xa nhà",
          nhiem_vu: [
            {
              ten: "Nấu ăn cơ bản",
              mo_ta: "Học 10 món ăn cơ bản, dinh dưỡng cho sinh viên",
            },
            {
              ten: "Quản lý nhà cửa",
              mo_ta: "Dọn dẹp, giặt giũ, bảo quản đồ đạc",
            },
          ],
        },
        {
          so_thu_tu: 3,
          ten: "Thuê và ở trọ",
          mo_ta: "Kỹ năng tìm và thuê phòng trọ an toàn",
          nhiem_vu: [
            {
              ten: "Tìm phòng trọ",
              mo_ta: "Cách tìm, đánh giá phòng trọ an toàn",
            },
            { ten: "Hợp đồng thuê", mo_ta: "Đọc hiểu và ký hợp đồng thuê nhà" },
          ],
        },
      ],
      ket_qua_can_dat: [
        "Có kỹ năng quản lý tài chính",
        "Biết các kỹ năng sinh hoạt cơ bản",
        "Biết cách tìm và thuê phòng trọ",
      ],
      phuong_phap_goi_y: ["Thực hành", "Simulation", "Học từ người đi trước"],
      so_tiet_de_xuat: 5,
      thang_thuc_hien: [3, 4],
      tu_khoa_tim_kiem: [
        "tự lập",
        "sinh viên",
        "phòng trọ",
        "nấu ăn",
        "ngân sách",
      ],
    },

    {
      ma: "12.10",
      ten: "Thực hiện kế hoạch nghề nghiệp",
      mach_noi_dung: "huong_nghiep",
      muc_tieu: [
        "Hoàn tất các bước chuẩn bị cho con đường đã chọn",
        "Có kế hoạch hành động 1 năm đầu sau tốt nghiệp",
        "Sẵn sàng bước vào giai đoạn mới",
      ],
      hoat_dong: [
        {
          so_thu_tu: 1,
          ten: "Finalize quyết định",
          mo_ta: "Chốt lựa chọn nghề nghiệp/học tập",
          nhiem_vu: [
            {
              ten: "Quyết định cuối cùng",
              mo_ta: "Chọn trường/ngành/công việc sau tốt nghiệp",
            },
            {
              ten: "Kế hoạch B, C",
              mo_ta: "Chuẩn bị phương án dự phòng nếu không đạt kế hoạch A",
            },
          ],
        },
        {
          so_thu_tu: 2,
          ten: "Gap year planning",
          mo_ta: "Lập kế hoạch nếu chọn gap year",
          nhiem_vu: [
            {
              ten: "Mục tiêu gap year",
              mo_ta:
                "Xác định mục tiêu cụ thể: làm việc, tình nguyện, học thêm...",
            },
            {
              ten: "Lịch trình gap year",
              mo_ta: "Lập kế hoạch chi tiết cho 1 năm",
            },
          ],
        },
        {
          so_thu_tu: 3,
          ten: "First 100 days plan",
          mo_ta: "Kế hoạch 100 ngày đầu sau tốt nghiệp",
          nhiem_vu: [
            {
              ten: "Onboarding plan",
              mo_ta: "Kế hoạch hòa nhập môi trường mới (đại học/công việc)",
            },
            {
              ten: "Quick wins",
              mo_ta: "Các mục tiêu ngắn hạn để tạo đà thành công",
            },
          ],
        },
      ],
      ket_qua_can_dat: [
        "Có quyết định rõ ràng về hướng đi",
        "Có kế hoạch 100 ngày đầu",
        "Sẵn sàng cho giai đoạn mới",
      ],
      phuong_phap_goi_y: ["Lập kế hoạch", "Coaching", "Chia sẻ"],
      so_tiet_de_xuat: 4,
      thang_thuc_hien: [4, 5],
      tu_khoa_tim_kiem: [
        "kế hoạch nghề nghiệp",
        "gap year",
        "100 ngày đầu",
        "tốt nghiệp",
      ],
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
    chuongTrinh.chu_de.find((cd) => cd.thang_thuc_hien.includes(thang)) || null
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
