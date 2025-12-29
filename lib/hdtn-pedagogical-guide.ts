/**
 * HƯỚNG DẪN SƯ PHẠM CHƯƠNG TRÌNH HOẠT ĐỘNG TRẢI NGHIỆM, HƯỚNG NGHIỆP
 * BỘ SÁCH: KẾT NỐI TRI THỨC VỚI CUỘC SỐNG
 * CẤP: THPT (Lớp 10, 11, 12)
 *
 * File này chứa các hướng dẫn chi tiết để AI tạo KHBD và Ngoại khóa chính xác
 */

// ============================================
// 1. TRIẾT LÝ VÀ MỤC TIÊU CHƯƠNG TRÌNH
// ============================================

export const TRIET_LY_CHUONG_TRINH = {
  ten: "Kết nối tri thức với cuộc sống",
  triet_ly_cot_loi: "Mang cuộc sống vào bài học và đưa bài học vào cuộc sống",
  mo_hinh_giao_duc: "Chuyển đổi từ trang bị kiến thức sang phát triển toàn diện phẩm chất và năng lực",

  muc_tieu_cot_loi: {
    nang_luc_dac_thu: [
      "Năng lực thích ứng với cuộc sống",
      "Năng lực thiết kế và tổ chức hoạt động",
      "Năng lực định hướng nghề nghiệp",
    ],
    nguyen_tac_thiet_ke:
      "Đồng tâm và phát triển - đảm bảo tính liên thông nhưng có sự phân hóa sâu sắc về yêu cầu cần đạt theo từng độ tuổi",
  },

  trong_tam_theo_khoi: {
    khoi_10: {
      chu_de_chinh: "Thích ứng và Khám phá",
      trong_tam: "Sự thích ứng và khám phá bản thân",
      tu_khoa: ["thích ứng", "khám phá", "tìm hiểu bản thân", "làm quen môi trường mới"],
    },
    khoi_11: {
      chu_de_chinh: "Phát triển và Bản sắc",
      trong_tam: "Mở rộng kỹ năng xã hội và tìm hiểu nhóm nghề",
      tu_khoa: ["kỹ năng xã hội", "nhóm nghề", "phát triển bản thân", "quan hệ xã hội"],
    },
    khoi_12: {
      chu_de_chinh: "Trưởng thành và Chuyển tiếp",
      trong_tam: "Bản lĩnh trưởng thành và ra quyết định nghề nghiệp",
      tu_khoa: ["trưởng thành", "ra quyết định", "lựa chọn nghề", "kế hoạch tương lai"],
    },
  },
}

// ============================================
// 2. CẤU TRÚC THỜI LƯỢNG VÀ LOẠI HÌNH HOẠT ĐỘNG
// ============================================

export const CAU_TRUC_THOI_LUONG = {
  tong_tiet_nam: 105,
  so_tiet_tuan: 3,
  so_tuan_thuc_hoc: 35,

  loai_hinh_hoat_dong: {
    sinh_hoat_duoi_co: {
      viet_tat: "SHDC",
      mo_ta: "Hoạt động quy mô lớn toàn trường",
      thoi_luong: "1 tiết/tuần (35 tiết/năm)",
      quy_mo: "Toàn trường",
      muc_dich: [
        "Tạo không gian chung cho học sinh toàn trường",
        "Triển khai các chủ đề giáo dục theo tháng",
        "Tổ chức các sự kiện, lễ kỷ niệm",
        "Phát động phong trào thi đua",
      ],
      goi_y_hoat_dong: [
        "Lễ chào cờ đầu tuần với chủ đề giáo dục",
        "Diễn đàn học sinh",
        "Tuyên dương, khen thưởng",
        "Văn nghệ, thể thao tập thể",
        "Phát động các cuộc thi, phong trào",
      ],
    },

    sinh_hoat_lop: {
      viet_tat: "SHL",
      mo_ta: "Hoạt động quy mô lớp học",
      thoi_luong: "1 tiết/tuần (35 tiết/năm)",
      quy_mo: "Lớp học",
      muc_dich: [
        "Xây dựng tập thể lớp đoàn kết",
        "Giải quyết các vấn đề của lớp",
        "Rèn luyện kỹ năng tự quản",
        "Thảo luận các chủ đề giáo dục",
      ],
      goi_y_hoat_dong: [
        "Sinh hoạt chủ nhiệm theo chủ đề tháng",
        "Đánh giá hoạt động tuần/tháng",
        "Thảo luận, giải quyết vấn đề lớp",
        "Xây dựng kế hoạch hoạt động",
        "Hoạt động teambuilding lớp",
      ],
    },

    hoat_dong_giao_duc_theo_chu_de: {
      viet_tat: "HĐGD",
      mo_ta: "Hoạt động giáo dục theo chủ đề trong SGK",
      thoi_luong: "1 tiết/tuần (35 tiết/năm)",
      quy_mo: "Lớp học hoặc nhóm",
      muc_dich: [
        "Thực hiện các chủ đề trong sách giáo khoa",
        "Phát triển năng lực đặc thù",
        "Trải nghiệm thực tế theo chủ đề",
        "Hình thành kỹ năng và thái độ",
      ],
      goi_y_hoat_dong: [
        "Thảo luận nhóm theo chủ đề",
        "Dự án học tập",
        "Trải nghiệm thực tế",
        "Nghiên cứu, tìm hiểu",
        "Thực hành kỹ năng",
      ],
    },
  },
}

// ============================================
// 3. PHƯƠNG PHÁP SƯ PHẠM
// ============================================

export const PHUONG_PHAP_SU_PHAM = {
  nguyen_tac_to_chuc: {
    lay_hoc_sinh_lam_trung_tam: {
      mo_ta: "Học sinh là chủ thể của hoạt động, giáo viên là người hướng dẫn, hỗ trợ",
      thuc_hien: [
        "Tạo cơ hội cho HS tự khám phá, trải nghiệm",
        "Khuyến khích HS đề xuất ý tưởng",
        "Tôn trọng sự khác biệt cá nhân",
        "Đánh giá quá trình, không chỉ kết quả",
      ],
    },

    hoc_qua_trai_nghiem: {
      mo_ta: "Kiến thức được hình thành từ trải nghiệm thực tế",
      chu_trinh: ["Trải nghiệm cụ thể", "Quan sát, phản ánh", "Khái quát hóa", "Thử nghiệm tích cực"],
      thuc_hien: [
        "Thiết kế hoạt động gắn với thực tiễn",
        "Tạo tình huống để HS giải quyết vấn đề",
        "Kết nối bài học với cuộc sống",
        "Khuyến khích HS chia sẻ trải nghiệm cá nhân",
      ],
    },

    phan_hoa_ca_nhan: {
      mo_ta: "Điều chỉnh hoạt động phù hợp với đặc điểm, nhu cầu từng học sinh",
      thuc_hien: [
        "Đa dạng hình thức hoạt động",
        "Giao nhiệm vụ phù hợp năng lực",
        "Tạo không gian cho sáng tạo cá nhân",
        "Hỗ trợ riêng cho HS gặp khó khăn",
      ],
    },
  },

  phuong_phap_cu_the: {
    thao_luan_nhom: {
      mo_ta: "Học sinh làm việc theo nhóm để giải quyết vấn đề",
      uu_diem: ["Phát triển kỹ năng hợp tác", "Học hỏi lẫn nhau", "Đa dạng góc nhìn"],
      luu_y: ["Phân công rõ ràng", "Quy mô nhóm 4-6 HS", "Có sản phẩm cụ thể"],
    },

    dong_vai: {
      mo_ta: "Học sinh đóng vai các nhân vật trong tình huống giả định",
      uu_diem: ["Trải nghiệm đa chiều", "Phát triển kỹ năng giao tiếp", "Hiểu góc nhìn khác"],
      luu_y: ["Tình huống sát thực tế", "Không ép buộc", "Thảo luận rút kinh nghiệm"],
    },

    du_an: {
      mo_ta: "Học sinh thực hiện dự án trong thời gian dài",
      uu_diem: ["Phát triển năng lực tổng hợp", "Gắn với thực tiễn", "Sản phẩm cụ thể"],
      luu_y: ["Hướng dẫn rõ ràng", "Theo dõi tiến độ", "Đánh giá quá trình"],
    },

    trai_nghiem_thuc_te: {
      mo_ta: "Học sinh tham gia hoạt động thực tế ngoài lớp học",
      uu_diem: ["Học từ thực tế", "Mở rộng hiểu biết", "Tạo động lực học tập"],
      luu_y: ["Đảm bảo an toàn", "Chuẩn bị kỹ", "Rút kinh nghiệm sau hoạt động"],
    },

    tro_choi: {
      mo_ta: "Sử dụng trò chơi để truyền tải nội dung giáo dục",
      uu_diem: ["Tạo hứng thú", "Học mà chơi", "Phát triển kỹ năng mềm"],
      luu_y: ["Phù hợp lứa tuổi", "Có mục tiêu giáo dục rõ", "Tổng kết sau trò chơi"],
    },
  },
}

// ============================================
// 4. CẤU TRÚC BÀI HỌC CHUẨN
// ============================================

export const CAU_TRUC_BAI_HOC = {
  cac_hoat_dong: {
    hoat_dong_khoi_dong: {
      ten: "Hoạt động khởi động",
      ty_le_thoi_gian: 10, // 10% tổng thời gian
      muc_dich: [
        "Tạo tâm thế học tập tích cực",
        "Kết nối với kiến thức/trải nghiệm đã có",
        "Giới thiệu chủ đề bài học",
        "Khơi gợi hứng thú, tò mò",
      ],
      hinh_thuc_goi_y: [
        "Trò chơi ngắn (2-3 phút)",
        "Xem video clip ngắn",
        "Câu hỏi khởi động",
        "Chia sẻ trải nghiệm cá nhân",
        "Tình huống mở đầu",
      ],
      luu_y: ["Ngắn gọn, hấp dẫn", "Liên quan trực tiếp đến nội dung bài", "Tạo không khí vui vẻ, thoải mái"],
    },

    hoat_dong_kham_pha: {
      ten: "Hoạt động khám phá/Hình thành kiến thức",
      ty_le_thoi_gian: 50, // 50% tổng thời gian
      muc_dich: [
        "Học sinh tự khám phá, tìm hiểu kiến thức mới",
        "Hình thành khái niệm, kỹ năng cốt lõi",
        "Trải nghiệm để hiểu sâu vấn đề",
      ],
      hinh_thuc_goi_y: [
        "Thảo luận nhóm với phiếu học tập",
        "Nghiên cứu tài liệu, xem video",
        "Đóng vai, mô phỏng tình huống",
        "Phân tích case study",
        "Thực hành kỹ năng theo hướng dẫn",
      ],
      luu_y: [
        "Chia nhỏ thành các nhiệm vụ cụ thể",
        "Có sản phẩm cho mỗi nhiệm vụ",
        "GV quan sát, hỗ trợ kịp thời",
        "Đảm bảo tất cả HS được tham gia",
      ],
    },

    hoat_dong_luyen_tap: {
      ten: "Hoạt động luyện tập",
      ty_le_thoi_gian: 25, // 25% tổng thời gian
      muc_dich: [
        "Củng cố kiến thức, kỹ năng vừa học",
        "Áp dụng vào tình huống cụ thể",
        "Phát hiện và điều chỉnh sai sót",
      ],
      hinh_thuc_goi_y: [
        "Bài tập thực hành",
        "Xử lý tình huống giả định",
        "Trò chơi củng cố kiến thức",
        "Thảo luận nhóm mở rộng",
        "Đánh giá chéo giữa các nhóm",
      ],
      luu_y: ["Tình huống đa dạng, phong phú", "Tăng dần độ khó", "Khuyến khích sáng tạo", "Phản hồi kịp thời"],
    },

    hoat_dong_van_dung: {
      ten: "Hoạt động vận dụng/Mở rộng",
      ty_le_thoi_gian: 15, // 15% tổng thời gian
      muc_dich: [
        "Kết nối bài học với cuộc sống thực",
        "Giao nhiệm vụ thực hành tại nhà/cộng đồng",
        "Mở rộng, nâng cao kiến thức",
      ],
      hinh_thuc_goi_y: [
        "Giao dự án cá nhân/nhóm",
        "Nhiệm vụ thực hành tại gia đình",
        "Tìm hiểu thực tế tại địa phương",
        "Chia sẻ với người thân",
        "Viết nhật ký trải nghiệm",
      ],
      luu_y: ["Cụ thể, khả thi", "Phù hợp điều kiện HS", "Có hướng dẫn rõ ràng", "Theo dõi, đánh giá kết quả"],
    },
  },

  to_chuc_thuc_hien_4_buoc: {
    buoc_1_chuyen_giao_nhiem_vu: {
      ten: "Chuyển giao nhiệm vụ",
      noi_dung: [
        "GV nêu rõ nhiệm vụ, yêu cầu",
        "Giải thích cách thức thực hiện",
        "Phân công nhóm/cá nhân",
        "Quy định thời gian",
        "Kiểm tra HS đã hiểu nhiệm vụ",
      ],
      cau_hoi_kiem_tra: ["Các em đã rõ nhiệm vụ chưa?", "Còn thắc mắc gì không?", "Ai có thể nhắc lại nhiệm vụ?"],
    },

    buoc_2_thuc_hien_nhiem_vu: {
      ten: "Thực hiện nhiệm vụ",
      noi_dung: [
        "HS làm việc cá nhân/nhóm",
        "GV quan sát, theo dõi",
        "Hỗ trợ khi cần thiết",
        "Ghi nhận các ý tưởng hay",
        "Nhắc nhở thời gian",
      ],
      vai_tro_gv: [
        "Quan sát, không can thiệp quá sâu",
        "Hỗ trợ nhóm gặp khó khăn",
        "Khuyến khích HS tự giải quyết",
        "Ghi chép để đánh giá",
      ],
    },

    buoc_3_bao_cao_thao_luan: {
      ten: "Báo cáo, thảo luận",
      noi_dung: [
        "HS/nhóm trình bày kết quả",
        "Các nhóm khác nhận xét, bổ sung",
        "GV đặt câu hỏi gợi mở",
        "Thảo luận chung cả lớp",
        "Giải quyết các thắc mắc",
      ],
      ky_thuat_dieu_hanh: [
        "Gọi ngẫu nhiên hoặc xung phong",
        "Khuyến khích phản biện lành mạnh",
        "Tôn trọng các ý kiến khác biệt",
        "Dẫn dắt về trọng tâm",
      ],
    },

    buoc_4_ket_luan_nhan_dinh: {
      ten: "Kết luận, nhận định",
      noi_dung: [
        "GV tổng kết nội dung chính",
        "Chốt kiến thức, kỹ năng cần nhớ",
        "Đánh giá quá trình hoạt động",
        "Khen ngợi, động viên HS",
        "Rút ra bài học, thông điệp",
      ],
      luu_y: ["Ngắn gọn, súc tích", "Nhấn mạnh điểm quan trọng", "Liên hệ thực tiễn", "Tạo cảm xúc tích cực"],
    },
  },
}

// ============================================
// 5. HƯỚNG DẪN TÍCH HỢP NĂNG LỰC SỐ
// ============================================

export const TICH_HOP_NANG_LUC_SO = {
  nguyen_tac: [
    "Sử dụng công nghệ như công cụ hỗ trợ, không phải mục đích",
    "Đảm bảo an toàn thông tin cá nhân",
    "Phát triển tư duy phản biện với thông tin số",
    "Cân bằng giữa trực tuyến và trực tiếp",
  ],

  ung_dung_theo_hoat_dong: {
    khoi_dong: [
      "Sử dụng Kahoot, Quizizz để khởi động",
      "Chiếu video ngắn từ YouTube",
      "Sử dụng Mentimeter để thu thập ý kiến",
      "QR code dẫn đến tài liệu",
    ],
    kham_pha: [
      "Tìm kiếm thông tin trên Google Scholar",
      "Sử dụng Google Docs để cộng tác",
      "Tạo mindmap online (Canva, Miro)",
      "Xem video hướng dẫn trên YouTube",
    ],
    luyen_tap: [
      "Làm bài tập trực tuyến",
      "Tham gia diễn đàn thảo luận",
      "Tạo infographic bằng Canva",
      "Quay video thực hành",
    ],
    van_dung: [
      "Tạo blog/vlog chia sẻ trải nghiệm",
      "Khảo sát online bằng Google Forms",
      "Tạo portfolio điện tử",
      "Kết nối với chuyên gia qua video call",
    ],
  },

  an_toan_thong_tin: [
    "Không chia sẻ thông tin cá nhân nhạy cảm",
    "Kiểm tra nguồn thông tin trước khi sử dụng",
    "Sử dụng mật khẩu mạnh",
    "Báo cáo nội dung không phù hợp",
    "Tôn trọng bản quyền",
  ],
}

// ============================================
// 6. ĐÁNH GIÁ KẾT QUẢ HỌC TẬP
// ============================================

export const DANH_GIA_KET_QUA = {
  nguyen_tac: [
    "Đánh giá quá trình kết hợp đánh giá kết quả",
    "Đa dạng hình thức đánh giá",
    "HS tham gia tự đánh giá và đánh giá lẫn nhau",
    "Đánh giá để phát triển, không chỉ để xếp loại",
  ],

  hinh_thuc_danh_gia: {
    quan_sat: {
      mo_ta: "GV quan sát HS trong quá trình hoạt động",
      cong_cu: ["Sổ ghi chép", "Bảng kiểm", "Thang đánh giá"],
      noi_dung_quan_sat: ["Thái độ tham gia", "Kỹ năng hợp tác", "Sự sáng tạo", "Tinh thần trách nhiệm"],
    },
    san_pham: {
      mo_ta: "Đánh giá qua sản phẩm học tập của HS",
      loai_san_pham: ["Bài viết", "Poster", "Video", "Dự án", "Bài thuyết trình", "Portfolio"],
      tieu_chi: ["Nội dung", "Hình thức", "Sáng tạo", "Thực tiễn"],
    },
    ho_so: {
      mo_ta: "Đánh giá qua hồ sơ học tập tích lũy",
      thanh_phan: ["Nhật ký trải nghiệm", "Sản phẩm tiêu biểu", "Phiếu tự đánh giá", "Nhận xét của GV/bạn bè"],
    },
  },

  rubric_mau: {
    muc_tot: "Hoàn thành xuất sắc nhiệm vụ, thể hiện sự sáng tạo và chủ động cao",
    muc_kha: "Hoàn thành tốt nhiệm vụ, có sự cố gắng và tiến bộ rõ rệt",
    muc_dat: "Hoàn thành nhiệm vụ cơ bản, cần cải thiện một số kỹ năng",
    muc_chua_dat: "Chưa hoàn thành nhiệm vụ, cần hỗ trợ thêm",
  },
}

// ============================================
// 7. GỢI Ý HOẠT ĐỘNG NGOẠI KHÓA THEO CHỦ ĐỀ
// ============================================

export const GOI_Y_NGOAI_KHOA = {
  theo_mach_noi_dung: {
    ban_than: {
      tro_choi: ["Ai là ai? (tìm hiểu bản thân)", "Vòng tròn tài năng", "Chiếc hộp bí mật", "Bingo cá tính"],
      hoat_dong: [
        "Workshop khám phá bản thân",
        "Talkshow: Câu chuyện của tôi",
        "Triển lãm: Tôi là ai?",
        "Cuộc thi: Tài năng lớp tôi",
      ],
    },
    gia_dinh: {
      tro_choi: ["Gia đình tôi", "Truyền thống gia đình", "Món ăn gia đình", "Kỷ niệm đẹp"],
      hoat_dong: ["Triển lãm ảnh gia đình", "Cuộc thi nấu ăn", "Viết thư cho người thân", "Ngày hội gia đình"],
    },
    cong_dong: {
      tro_choi: ["Xây dựng thành phố", "Giải cứu cộng đồng", "Công dân số", "Tình nguyện viên"],
      hoat_dong: [
        "Chiến dịch tình nguyện",
        "Quyên góp từ thiện",
        "Vệ sinh môi trường",
        "Thăm hỏi người có hoàn cảnh khó khăn",
      ],
    },
    tu_nhien: {
      tro_choi: ["Thám hiểm thiên nhiên", "Phân loại rác", "Bảo vệ động vật", "Xanh - Sạch - Đẹp"],
      hoat_dong: [
        "Trồng cây xanh",
        "Dọn rác bãi biển/công viên",
        "Triển lãm sản phẩm tái chế",
        "Chiến dịch bảo vệ môi trường",
      ],
    },
    huong_nghiep: {
      tro_choi: ["Nghề nghiệp tương lai", "Phỏng vấn tuyển dụng", "Khởi nghiệp", "Ngày hội việc làm"],
      hoat_dong: ["Tham quan doanh nghiệp", "Gặp gỡ người thành công", "Workshop kỹ năng nghề", "Hội chợ hướng nghiệp"],
    },
  },

  cau_truc_kich_ban_ngoai_khoa: {
    phan_mo_dau: {
      thoi_luong: "5-10 phút",
      noi_dung: ["Văn nghệ chào mừng", "Giới thiệu chương trình", "Khởi động sôi nổi"],
    },
    phan_noi_dung_chinh: {
      thoi_luong: "30-40 phút",
      noi_dung: ["Hoạt động theo chủ đề tháng", "Trò chơi/cuộc thi", "Talkshow/chia sẻ", "Hoạt động nhóm"],
    },
    phan_ket_thuc: {
      thoi_luong: "5-10 phút",
      noi_dung: ["Tổng kết, trao giải", "Thông điệp kết thúc", "Văn nghệ kết thúc"],
    },
  },
}

// ============================================
// 8. HÀM TRUY XUẤT HƯỚNG DẪN
// ============================================

/**
 * Lấy hướng dẫn tổ chức hoạt động theo loại hình
 */
export function getHuongDanLoaiHinh(loaiHinh: "SHDC" | "SHL" | "HDGD") {
  const loaiHinhMap = {
    SHDC: CAU_TRUC_THOI_LUONG.loai_hinh_hoat_dong.sinh_hoat_duoi_co,
    SHL: CAU_TRUC_THOI_LUONG.loai_hinh_hoat_dong.sinh_hoat_lop,
    HDGD: CAU_TRUC_THOI_LUONG.loai_hinh_hoat_dong.hoat_dong_giao_duc_theo_chu_de,
  }
  return loaiHinhMap[loaiHinh]
}

/**
 * Lấy cấu trúc bài học theo hoạt động
 */
export function getCauTrucHoatDong(tenHoatDong: "khoi_dong" | "kham_pha" | "luyen_tap" | "van_dung") {
  const hoatDongMap = {
    khoi_dong: CAU_TRUC_BAI_HOC.cac_hoat_dong.hoat_dong_khoi_dong,
    kham_pha: CAU_TRUC_BAI_HOC.cac_hoat_dong.hoat_dong_kham_pha,
    luyen_tap: CAU_TRUC_BAI_HOC.cac_hoat_dong.hoat_dong_luyen_tap,
    van_dung: CAU_TRUC_BAI_HOC.cac_hoat_dong.hoat_dong_van_dung,
  }
  return hoatDongMap[tenHoatDong]
}

/**
 * Lấy gợi ý ngoại khóa theo mạch nội dung
 */
export function getGoiYNgoaiKhoa(machNoiDung: "ban_than" | "gia_dinh" | "cong_dong" | "tu_nhien" | "huong_nghiep") {
  return GOI_Y_NGOAI_KHOA.theo_mach_noi_dung[machNoiDung]
}

/**
 * Lấy trọng tâm giáo dục theo khối
 */
export function getTrongTamTheoKhoi(khoi: 10 | 11 | 12) {
  const khoiKey = `khoi_${khoi}` as "khoi_10" | "khoi_11" | "khoi_12"
  return TRIET_LY_CHUONG_TRINH.trong_tam_theo_khoi[khoiKey]
}

/**
 * Tạo context hướng dẫn sư phạm cho AI
 */
export function taoContextSuPham(khoi: 10 | 11 | 12, loaiTaiLieu: "KHBD" | "NgoaiKhoa" | "BienBan") {
  const trongTam = getTrongTamTheoKhoi(khoi)

  let context = `
## HƯỚNG DẪN SƯ PHẠM CHO ${loaiTaiLieu}

### Trọng tâm giáo dục Khối ${khoi}:
- Chủ đề chính: ${trongTam.chu_de_chinh}
- Trọng tâm: ${trongTam.trong_tam}
- Từ khóa: ${trongTam.tu_khoa.join(", ")}

### Nguyên tắc tổ chức:
1. Lấy học sinh làm trung tâm - HS là chủ thể, GV là người hướng dẫn
2. Học qua trải nghiệm - Kiến thức hình thành từ trải nghiệm thực tế
3. Phân hóa cá nhân - Điều chỉnh phù hợp đặc điểm từng HS
`

  if (loaiTaiLieu === "KHBD") {
    context += `
### Cấu trúc bài học:
- Khởi động (10%): Tạo tâm thế, kết nối kiến thức cũ
- Khám phá (50%): HS tự khám phá, hình thành kiến thức
- Luyện tập (25%): Củng cố, áp dụng vào tình huống cụ thể
- Vận dụng (15%): Kết nối với cuộc sống thực

### Tổ chức thực hiện 4 bước:
1. Chuyển giao nhiệm vụ: GV nêu rõ yêu cầu, kiểm tra HS hiểu
2. Thực hiện nhiệm vụ: HS làm việc, GV quan sát hỗ trợ
3. Báo cáo, thảo luận: HS trình bày, thảo luận chung
4. Kết luận, nhận định: GV chốt kiến thức, rút bài học
`
  }

  if (loaiTaiLieu === "NgoaiKhoa") {
    context += `
### Cấu trúc ngoại khóa:
- Phần mở đầu (5-10 phút): Văn nghệ, giới thiệu, khởi động
- Phần nội dung chính (30-40 phút): Hoạt động chính, trò chơi, chia sẻ
- Phần kết thúc (5-10 phút): Tổng kết, trao giải, thông điệp

### Gợi ý hoạt động:
${JSON.stringify(GOI_Y_NGOAI_KHOA.theo_mach_noi_dung, null, 2)}
`
  }

  return context
}

// ============================================
// 9. PHÂN TÍCH DỌC THEO MÔ HÌNH XOẮN ỐC
// ============================================

export const PHAN_TICH_DOC_XOAN_OC = {
  mo_ta:
    "Các chủ đề cốt lõi được lặp lại ở cả 3 khối lớp nhưng với mức độ yêu cầu tăng tiến về chiều sâu và độ phức tạp",

  bang_phan_tich: {
    ban_than: {
      lop_10: {
        muc_do: "Thích ứng & Nhận diện",
        noi_dung: "Khám phá tính cách, sở thích, điểm mạnh/yếu. Làm quen với quản lý tài chính cơ bản.",
        bloom_level: "Nhận biết, Hiểu",
      },
      lop_11: {
        muc_do: "Phát triển & Phân tích",
        noi_dung: "Tự tin thể hiện bản sắc. Thích ứng với sự thay đổi. Quản lý cảm xúc trong các mối quan hệ phức tạp.",
        bloom_level: "Phân tích, Đánh giá",
      },
      lop_12: {
        muc_do: "Trưởng thành & Quyết định",
        noi_dung: "Khẳng định sự trưởng thành, tư duy độc lập. Tự chủ tài chính, lập kế hoạch tài chính dài hạn.",
        bloom_level: "Đánh giá, Sáng tạo",
      },
    },

    gia_dinh: {
      lop_10: {
        muc_do: "Thích ứng & Nhận diện",
        noi_dung: "Tham gia lao động, làm việc nhà. Hiểu sơ lược về kinh tế gia đình.",
        bloom_level: "Nhận biết, Hiểu",
      },
      lop_11: {
        muc_do: "Phát triển & Phân tích",
        noi_dung: "Hóa giải mâu thuẫn thế hệ. Chăm sóc người ốm. Lập kế hoạch chi tiêu gia đình.",
        bloom_level: "Áp dụng, Phân tích",
      },
      lop_12: {
        muc_do: "Trưởng thành & Quyết định",
        noi_dung:
          "Tổ chức cuộc sống gia đình. Phân tích sâu sắc tác động của tài chính và lối sống đến hạnh phúc gia đình.",
        bloom_level: "Đánh giá, Sáng tạo",
      },
    },

    cong_dong: {
      lop_10: {
        muc_do: "Thích ứng & Nhận diện",
        noi_dung: "Tham gia hoạt động xã hội tại địa phương.",
        bloom_level: "Nhận biết, Áp dụng",
      },
      lop_11: {
        muc_do: "Phát triển & Phân tích",
        noi_dung: "Xây dựng văn hóa mạng xã hội. Quản lý dự án cộng đồng. Ứng xử văn minh.",
        bloom_level: "Phân tích, Đánh giá",
      },
      lop_12: {
        muc_do: "Trưởng thành & Quyết định",
        noi_dung: "Hội nhập văn hóa quốc tế. Tôn trọng sự khác biệt. Thực hiện dự án nhân đạo quy mô.",
        bloom_level: "Đánh giá, Sáng tạo",
      },
    },

    moi_truong: {
      lop_10: {
        muc_do: "Thích ứng & Nhận diện",
        noi_dung: "Nhận diện thực trạng, tuyên truyền bảo vệ cảnh quan.",
        bloom_level: "Nhận biết, Hiểu",
      },
      lop_11: {
        muc_do: "Phát triển & Phân tích",
        noi_dung: "Phân tích tác động của kinh tế đến môi trường. Đề xuất kiến nghị chính sách.",
        bloom_level: "Phân tích, Đánh giá",
      },
      lop_12: {
        muc_do: "Trưởng thành & Quyết định",
        noi_dung: "Đề xuất giải pháp sáng tạo bảo tồn. Bảo vệ đa dạng sinh học và động vật hoang dã.",
        bloom_level: "Đánh giá, Sáng tạo",
      },
    },

    nghe_nghiep: {
      lop_10: {
        muc_do: "Thích ứng & Nhận diện",
        noi_dung: "Tìm hiểu nghề truyền thống địa phương. Trải nghiệm nghề nghiệp sơ khởi.",
        bloom_level: "Nhận biết, Hiểu",
      },
      lop_11: {
        muc_do: "Phát triển & Phân tích",
        noi_dung: "Phân tích thị trường lao động 4.0. Yêu cầu của nhà tuyển dụng. An toàn lao động.",
        bloom_level: "Phân tích, Đánh giá",
      },
      lop_12: {
        muc_do: "Trưởng thành & Quyết định",
        noi_dung: "Tính chuyên nghiệp. Khả năng chuyển đổi nghề nghiệp. Ra quyết định chọn trường/nghề cuối cùng.",
        bloom_level: "Đánh giá, Sáng tạo",
      },
    },
  },
}

// ============================================
// 10. CHỈ DẪN KỸ THUẬT CHO AI (GEMINI)
// ============================================

export const CHI_DAN_KY_THUAT_AI = {
  quy_tac_phan_tich_ngu_canh: {
    mo_ta:
      "Khi người dùng yêu cầu soạn giáo án, AI phải tham chiếu ngay vào Bảng phân tích dọc để xác định mức độ yêu cầu phù hợp",
    vi_du: [
      { khoi: 10, hoat_dong: "Tìm hiểu", bloom: "Nhận biết, Hiểu" },
      { khoi: 11, hoat_dong: "Phân tích/Đánh giá", bloom: "Phân tích, Đánh giá" },
      { khoi: 12, hoat_dong: "Quyết định/Giải quyết", bloom: "Đánh giá, Sáng tạo" },
    ],
    bien_dia_phuong:
      "Đối với các chủ đề về Môi trường và Nghề nghiệp, AI cần yêu cầu người dùng cung cấp tên tỉnh/thành để điền dữ liệu danh lam thắng cảnh hoặc làng nghề cụ thể",
  },

  cau_truc_giao_an_chuan_cv5512: {
    mo_ta: "Mọi kế hoạch bài dạy (Tiết 2 - Hoạt động giáo dục) do AI sinh ra bắt buộc phải tuân thủ khung này",
    cau_truc: {
      ten_bai_hoc: "Theo SGK Kết nối tri thức",
      muc_tieu: {
        kien_thuc: "Trích xuất từ phần Hoạt động cốt lõi",
        nang_luc: ["Tự chủ", "Giao tiếp", "Giải quyết vấn đề", "Định hướng nghề nghiệp"],
        pham_chat: ["Trách nhiệm", "Trung thực", "Nhân ái", "Chăm chỉ", "Yêu nước"],
      },
      thiet_bi_day_hoc: ["Máy chiếu", "Tranh ảnh", "Video", "Phiếu học tập", "Bảng nhóm"],
      tien_trinh_day_hoc: {
        hoat_dong_1_khoi_dong: {
          muc_dich: "Kích thích tò mò",
          hinh_thuc: "Trò chơi, video, câu hỏi gợi mở",
        },
        hoat_dong_2_kham_pha: {
          muc_dich: "Hình thành kiến thức mới",
          hinh_thuc: "Thảo luận nhóm, nghiên cứu tình huống (Case study), thuyết trình",
          luu_y: "Đây là trọng tâm của bài học",
        },
        hoat_dong_3_luyen_tap: {
          muc_dich: "Củng cố kiến thức kỹ năng",
          hinh_thuc: "Đóng vai (Role-play), xử lý tình huống giả định, bài tập thực hành",
        },
        hoat_dong_4_van_dung: {
          muc_dich: "Kết nối với cuộc sống thực",
          hinh_thuc: "Giao nhiệm vụ về nhà, dự án thực tế, cam kết hành động",
        },
      },
    },
  },

  xu_ly_sinh_hoat_duoi_co: {
    mo_ta: "Kịch bản cho tiết Sinh hoạt dưới cờ quy mô toàn trường",
    yeu_cau: [
      "Thiết kế kịch bản MC (người dẫn chương trình)",
      "Các câu hỏi tương tác cho toàn trường",
      "Các tiết mục văn nghệ minh họa chủ đề",
      "Phát động phong trào, tuyên dương khen thưởng",
    ],
    cau_truc_kich_ban: {
      phan_1_chao_co: "5 phút - Nghi lễ chào cờ, hát Quốc ca",
      phan_2_nhan_xet_tuan: "5-7 phút - Nhận xét tuần học, tuyên dương/nhắc nhở",
      phan_3_chuong_trinh_chu_de: "15-20 phút - Hoạt động theo chủ đề tháng",
      phan_4_phat_dong: "5 phút - Phát động hoạt động tuần/tháng tới",
    },
  },

  xu_ly_sinh_hoat_lop: {
    mo_ta: "Kịch bản cho tiết Sinh hoạt lớp do GVCN chủ trì",
    yeu_cau: [
      "Mẫu Phiếu sơ kết tuần",
      "Các câu hỏi thảo luận nhóm nhỏ để HS tự đánh giá",
      "Nội dung sinh hoạt chuyên đề ngắn gọn",
      "Xây dựng kế hoạch hành động cá nhân/nhóm",
    ],
    cau_truc_sinh_hoat: {
      phan_1_so_ket: "10 phút - Sơ kết hoạt động tuần, đánh giá thi đua",
      phan_2_phan_hoi: "15 phút - Thảo luận, phản hồi việc thực hiện cam kết",
      phan_3_chuyen_de: "15 phút - Sinh hoạt chuyên đề theo chủ đề tháng",
      phan_4_ke_hoach: "5 phút - Xây dựng kế hoạch tuần tới",
    },
  },
}

// ============================================
// 11. HÀM TRUY XUẤT CHỈ DẪN AI
// ============================================

/**
 * Lấy mức độ Bloom phù hợp theo khối
 */
export function getMucDoBloomTheoKhoi(khoi: 10 | 11 | 12) {
  return CHI_DAN_KY_THUAT_AI.quy_tac_phan_tich_ngu_canh.vi_du.find((v) => v.khoi === khoi)
}

/**
 * Lấy phân tích dọc theo mạch nội dung
 */
export function getPhanTichDocTheoMach(
  mach: "ban_than" | "gia_dinh" | "cong_dong" | "moi_truong" | "nghe_nghiep",
  khoi: 10 | 11 | 12,
) {
  const khoiKey = `lop_${khoi}` as "lop_10" | "lop_11" | "lop_12"
  return PHAN_TICH_DOC_XOAN_OC.bang_phan_tich[mach][khoiKey]
}

/**
 * Tạo context chi tiết cho AI thiết kế KHBD theo CV 5512
 */
export function taoContextKHBD_CV5512(khoi: 10 | 11 | 12, tenChuDe: string, machNoiDung: string) {
  const bloom = getMucDoBloomTheoKhoi(khoi)
  const trongTam = getTrongTamTheoKhoi(khoi)

  return `
## CHỈ DẪN THIẾT KẾ KẾ HOẠCH BÀI DẠY (THEO CV 5512)

### Thông tin cơ bản:
- Khối: ${khoi}
- Chủ đề: ${tenChuDe}
- Mạch nội dung: ${machNoiDung}

### Yêu cầu theo mô hình xoắn ốc:
- Mức độ: ${trongTam.chu_de_chinh}
- Trọng tâm: ${trongTam.trong_tam}
- Mức độ Bloom: ${bloom?.bloom}
- Động từ hành động: ${bloom?.hoat_dong}

### Cấu trúc bài học bắt buộc:
1. **Hoạt động 1 - Khởi động (10%)**: Trò chơi, video, câu hỏi gợi mở
2. **Hoạt động 2 - Khám phá (50%)**: Thảo luận nhóm, Case study, thuyết trình (TRỌNG TÂM)
3. **Hoạt động 3 - Luyện tập (25%)**: Đóng vai, xử lý tình huống, bài tập
4. **Hoạt động 4 - Vận dụng (15%)**: Nhiệm vụ về nhà, dự án, cam kết

### Mỗi hoạt động phải có 4 bước:
a) Mục tiêu: Hoạt động này nhằm đạt mục tiêu gì?
b) Nội dung: GV giao nhiệm vụ gì? HS thực hiện như thế nào? + Tích hợp NLS và Đạo đức
c) Sản phẩm: MÔ TẢ CỤ THỂ sản phẩm đầu ra của HS
d) Tổ chức thực hiện:
   - Bước 1: Chuyển giao nhiệm vụ
   - Bước 2: Thực hiện nhiệm vụ  
   - Bước 3: Báo cáo, thảo luận
   - Bước 4: Kết luận, nhận định
`
}

// Export tất cả
export const HDTN_PEDAGOGICAL_GUIDE = {
  TRIET_LY_CHUONG_TRINH,
  CAU_TRUC_THOI_LUONG,
  PHUONG_PHAP_SU_PHAM,
  CAU_TRUC_BAI_HOC,
  TICH_HOP_NANG_LUC_SO,
  DANH_GIA_KET_QUA,
  GOI_Y_NGOAI_KHOA,
}

// Export thêm các module mới
export const HDTN_PEDAGOGICAL_GUIDE_EXTENDED = {
  ...HDTN_PEDAGOGICAL_GUIDE,
  PHAN_TICH_DOC_XOAN_OC,
  CHI_DAN_KY_THUAT_AI,
}

export const HUONG_DAN_SU_PHAM = {
  triet_ly: TRIET_LY_CHUONG_TRINH,
  cau_truc_thoi_luong: CAU_TRUC_THOI_LUONG,
  phuong_phap: PHUONG_PHAP_SU_PHAM,
  cau_truc_bai_hoc: CAU_TRUC_BAI_HOC,
  tich_hop_nls: TICH_HOP_NANG_LUC_SO,
  danh_gia: DANH_GIA_KET_QUA,
  goi_y_ngoai_khoa: GOI_Y_NGOAI_KHOA,
}
