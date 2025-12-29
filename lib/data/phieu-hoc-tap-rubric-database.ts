/**
 * CƠ SỞ DỮ LIỆU PHIẾU HỌC TẬP VÀ RUBRIC ĐÁNH GIÁ
 * Dùng cho môn Hoạt động Trải nghiệm, Hướng nghiệp - THPT
 * Bộ sách: Kết nối Tri thức với Cuộc sống
 */

// ==================== INTERFACES ====================

export interface PhieuHocTap {
  ma: string
  ten: string
  loai: "reflection" | "action" | "research" | "planning"
  mo_ta: string
  danh_cho_hoat_dong: string[]
  cau_truc: {
    phan: string
    huong_dan: string
    cau_hoi_mau: string[]
  }[]
  luu_y_su_dung: string[]
}

export interface TieuChiRubric {
  ten: string
  muc_4_xuat_sac: string
  muc_3_tot: string
  muc_2_dat: string
  muc_1_chua_dat: string
}

export interface RubricDanhGia {
  ma: string
  ten: string
  loai: "nang_luc" | "san_pham" | "qua_trinh"
  mo_ta: string
  ap_dung_cho: string[]
  tieu_chi: TieuChiRubric[]
  cach_tinh_diem: string
  luu_y: string[]
}

// ==================== MẪU PHIẾU HỌC TẬP ====================

export const MAU_PHIEU_HOC_TAP: PhieuHocTap[] = [
  // Mẫu 1: Phiếu Reflection (Khám phá nội tâm)
  {
    ma: "PHT-01",
    ten: "Phiếu Hồ Sơ Thấu Hiểu & Định Hướng",
    loai: "reflection",
    mo_ta: "Dạng phiếu phản tư, giúp học sinh khám phá bản thân, tìm hiểu nghề nghiệp và ra quyết định",
    danh_cho_hoat_dong: [
      "Khám phá bản thân",
      "Tìm hiểu nghề nghiệp",
      "Ra quyết định nghề nghiệp",
      "Nhận diện điểm mạnh/yếu",
      "Xác định mục tiêu",
    ],
    cau_truc: [
      {
        phan: "1. KẾT NỐI (Trước hoạt động)",
        huong_dan: "Kích hoạt kiến thức/suy nghĩ có sẵn của học sinh",
        cau_hoi_mau: [
          "Trước khi bắt đầu, em đang nghĩ gì về vấn đề này?",
          "Em nghĩ mình thuộc kiểu tính cách nào?",
          "Em hình dung nghề [X] làm gì?",
          "Điều gì khiến em quan tâm đến chủ đề này?",
        ],
      },
      {
        phan: "2. TRẢI NGHIỆM & DỮ LIỆU (Trong hoạt động)",
        huong_dan: "Ghi lại kết quả trắc nghiệm, thông tin tra cứu, từ khóa quan trọng",
        cau_hoi_mau: [
          "Kết quả trắc nghiệm cho thấy điều gì? (Từ khóa 1, 2, 3)",
          "So sánh năng lực hiện tại với yêu cầu của mục tiêu",
          "Điểm em đã có là gì?",
          "Điểm em còn thiếu là gì?",
        ],
      },
      {
        phan: "3. PHẢN TƯ & KẾ HOẠCH (Sau hoạt động)",
        huong_dan: "Điều chỉnh nhận thức và lập kế hoạch hành động",
        cau_hoi_mau: [
          "Điều gì khiến em bất ngờ nhất hôm nay?",
          "Một hành động cụ thể em sẽ làm trong tuần này là gì?",
          "Em sẽ nhờ ai hỗ trợ để thực hiện kế hoạch?",
          "Làm sao em biết mình đã thành công?",
        ],
      },
    ],
    luu_y_su_dung: [
      "Phát trước 5 phút để HS đọc và suy nghĩ phần 1",
      "Cho HS tự điền trong suốt hoạt động",
      "Không chấm đúng/sai - đây là công cụ phát triển cá nhân",
      "Khuyến khích HS giữ lại để theo dõi tiến bộ",
    ],
  },

  // Mẫu 2: Phiếu Action (Thực hành xã hội)
  {
    ma: "PHT-02",
    ten: "Phiếu Hành Động & Đánh Giá Nhóm",
    loai: "action",
    mo_ta: "Dạng phiếu thực hành nhóm, giúp học sinh lập kế hoạch, phân công và đánh giá hoạt động tập thể",
    danh_cho_hoat_dong: [
      "Tổ chức sự kiện",
      "Hoạt động cộng đồng",
      "Dự án nhóm",
      "Xây dựng kế hoạch",
      "Giải quyết vấn đề xã hội",
    ],
    cau_truc: [
      {
        phan: "1. PHÂN TÍCH TÌNH HUỐNG",
        huong_dan: "Xác định vấn đề và các bên liên quan",
        cau_hoi_mau: [
          "Vấn đề/Nhiệm vụ chính là gì?",
          "Ai là những người liên quan?",
          "Nguồn lực hiện có là gì?",
          "Khó khăn có thể gặp phải?",
        ],
      },
      {
        phan: "2. KẾ HOẠCH HÀNH ĐỘNG",
        huong_dan: "Lập kế hoạch chi tiết với phân công rõ ràng",
        cau_hoi_mau: [
          "Mục tiêu cụ thể của nhóm là gì?",
          "Các bước thực hiện (theo thứ tự)?",
          "Ai làm gì? Deadline?",
          "Cần chuẩn bị những gì?",
        ],
      },
      {
        phan: "3. THỰC HIỆN & GHI NHẬN",
        huong_dan: "Theo dõi quá trình và ghi lại kết quả",
        cau_hoi_mau: [
          "Nhóm đã làm được những gì?",
          "Có thay đổi gì so với kế hoạch ban đầu?",
          "Điều gì hoạt động tốt nhất?",
          "Khó khăn phát sinh và cách giải quyết?",
        ],
      },
      {
        phan: "4. ĐÁNH GIÁ & RÚT KINH NGHIỆM",
        huong_dan: "Tự đánh giá và rút ra bài học",
        cau_hoi_mau: [
          "Đánh giá mức độ hoàn thành mục tiêu (1-5 sao)?",
          "Đánh giá sự hợp tác trong nhóm?",
          "Nếu làm lại, nhóm sẽ thay đổi điều gì?",
          "Bài học lớn nhất rút ra là gì?",
        ],
      },
    ],
    luu_y_su_dung: [
      "Mỗi nhóm 1 phiếu, cử 1 người ghi chép chính",
      "Phần 1-2 hoàn thành trước khi bắt đầu hoạt động",
      "Phần 3 cập nhật liên tục trong quá trình",
      "Phần 4 hoàn thành sau khi kết thúc để trình bày",
    ],
  },

  // Mẫu 3: Phiếu Research (Nghiên cứu tìm hiểu)
  {
    ma: "PHT-03",
    ten: "Phiếu Nghiên Cứu & Tổng Hợp Thông Tin",
    loai: "research",
    mo_ta: "Dạng phiếu thu thập và phân tích thông tin, giúp học sinh nghiên cứu chủ đề một cách có hệ thống",
    danh_cho_hoat_dong: [
      "Tìm hiểu nghề nghiệp",
      "Nghiên cứu thị trường lao động",
      "Tìm hiểu về môi trường",
      "Khảo sát cộng đồng",
      "Thu thập dữ liệu",
    ],
    cau_truc: [
      {
        phan: "1. CÂU HỎI NGHIÊN CỨU",
        huong_dan: "Xác định rõ điều cần tìm hiểu",
        cau_hoi_mau: [
          "Em muốn tìm hiểu điều gì?",
          "Tại sao điều này quan trọng?",
          "Em đã biết gì về chủ đề này?",
          "Em cần tìm thêm thông tin gì?",
        ],
      },
      {
        phan: "2. NGUỒN THÔNG TIN",
        huong_dan: "Liệt kê và đánh giá nguồn tin",
        cau_hoi_mau: [
          "Em tìm thông tin từ đâu? (Sách, web, phỏng vấn...)",
          "Nguồn nào đáng tin cậy nhất? Tại sao?",
          "Có thông tin nào mâu thuẫn nhau không?",
          "Cần kiểm chứng thêm điều gì?",
        ],
      },
      {
        phan: "3. TỔNG HỢP DỮ LIỆU",
        huong_dan: "Sắp xếp và phân tích thông tin thu được",
        cau_hoi_mau: [
          "Những thông tin quan trọng nhất là gì?",
          "Có quy luật/xu hướng nào nổi bật?",
          "Điều gì bất ngờ hoặc khác với dự đoán?",
          "Thông tin này trả lời được câu hỏi nghiên cứu không?",
        ],
      },
      {
        phan: "4. KẾT LUẬN & ÁP DỤNG",
        huong_dan: "Rút ra kết luận và đề xuất ứng dụng",
        cau_hoi_mau: [
          "Kết luận chính từ nghiên cứu là gì?",
          "Thông tin này giúp ích gì cho bản thân em?",
          "Em có thể chia sẻ với ai? Bằng cách nào?",
          "Cần nghiên cứu thêm điều gì trong tương lai?",
        ],
      },
    ],
    luu_y_su_dung: [
      "Hướng dẫn HS sử dụng nhiều nguồn thông tin",
      "Nhấn mạnh việc kiểm chứng độ tin cậy",
      "Khuyến khích trích dẫn nguồn",
      "Có thể kết hợp với bài thuyết trình",
    ],
  },

  // Mẫu 4: Phiếu Planning (Lập kế hoạch cá nhân)
  {
    ma: "PHT-04",
    ten: "Phiếu Lập Kế Hoạch Cá Nhân SMART",
    loai: "planning",
    mo_ta: "Dạng phiếu lập kế hoạch theo mô hình SMART, giúp học sinh xây dựng mục tiêu và kế hoạch hành động cụ thể",
    danh_cho_hoat_dong: [
      "Lập kế hoạch học tập",
      "Lập kế hoạch tài chính",
      "Lập kế hoạch nghề nghiệp",
      "Đặt mục tiêu cá nhân",
      "Quản lý thời gian",
    ],
    cau_truc: [
      {
        phan: "1. XÁC ĐỊNH MỤC TIÊU (SMART)",
        huong_dan: "Viết mục tiêu theo nguyên tắc SMART",
        cau_hoi_mau: [
          "S - Specific: Mục tiêu cụ thể là gì?",
          "M - Measurable: Đo lường thành công bằng cách nào?",
          "A - Achievable: Có khả thi với điều kiện hiện tại không?",
          "R - Relevant: Tại sao mục tiêu này quan trọng với em?",
          "T - Time-bound: Thời hạn hoàn thành là khi nào?",
        ],
      },
      {
        phan: "2. PHÂN TÍCH SWOT CÁ NHÂN",
        huong_dan: "Đánh giá điểm mạnh, yếu, cơ hội, thách thức",
        cau_hoi_mau: [
          "Điểm mạnh của em giúp đạt mục tiêu?",
          "Điểm yếu cần khắc phục?",
          "Cơ hội từ bên ngoài có thể tận dụng?",
          "Thách thức/rào cản có thể gặp phải?",
        ],
      },
      {
        phan: "3. KẾ HOẠCH HÀNH ĐỘNG",
        huong_dan: "Liệt kê các bước cụ thể với thời gian",
        cau_hoi_mau: [
          "Bước 1 là gì? Khi nào hoàn thành?",
          "Bước 2 là gì? Khi nào hoàn thành?",
          "Cần nguồn lực/hỗ trợ gì?",
          "Làm sao để theo dõi tiến độ?",
        ],
      },
      {
        phan: "4. CAM KẾT & THEO DÕI",
        huong_dan: "Xác nhận cam kết và cách theo dõi",
        cau_hoi_mau: [
          "Em cam kết thực hiện điều gì từ hôm nay?",
          "Ai sẽ là người hỗ trợ/nhắc nhở em?",
          "Khi nào em sẽ review lại kế hoạch?",
          "Phần thưởng khi hoàn thành mục tiêu?",
        ],
      },
    ],
    luu_y_su_dung: [
      "Giải thích kỹ mô hình SMART trước khi phát phiếu",
      "Cho HS thời gian suy nghĩ kỹ (15-20 phút)",
      "Khuyến khích HS chia sẻ với bạn bè để cam kết",
      "Nhắc HS giữ phiếu để review sau 1 tháng",
    ],
  },
]

// ==================== MẪU RUBRIC ĐÁNH GIÁ ====================

export const MAU_RUBRIC: RubricDanhGia[] = [
  // Rubric 1: Đánh giá năng lực tự chủ và tự học
  {
    ma: "RB-01",
    ten: "Rubric Đánh Giá Năng Lực Tự Chủ & Tự Học",
    loai: "nang_luc",
    mo_ta: "Đánh giá khả năng tự nhận thức, tự điều chỉnh và tự học của học sinh",
    ap_dung_cho: ["Khám phá bản thân", "Rèn luyện bản thân", "Lập kế hoạch cá nhân", "Quản lý cảm xúc"],
    tieu_chi: [
      {
        ten: "Tự nhận thức",
        muc_4_xuat_sac: "Phân tích chính xác điểm mạnh/yếu, liên hệ với mục tiêu rõ ràng, có minh chứng cụ thể",
        muc_3_tot: "Nhận diện được hầu hết điểm mạnh/yếu, có liên hệ với mục tiêu",
        muc_2_dat: "Liệt kê được một số điểm mạnh/yếu nhưng chưa phân tích sâu",
        muc_1_chua_dat: "Chưa nhận diện được điểm mạnh/yếu hoặc mô tả chung chung",
      },
      {
        ten: "Đặt mục tiêu",
        muc_4_xuat_sac: "Mục tiêu SMART đầy đủ, có kế hoạch hành động chi tiết và khả thi",
        muc_3_tot: "Mục tiêu rõ ràng, có kế hoạch nhưng chưa đầy đủ các yếu tố SMART",
        muc_2_dat: "Có mục tiêu nhưng còn chung chung, kế hoạch sơ sài",
        muc_1_chua_dat: "Chưa đặt được mục tiêu cụ thể hoặc mục tiêu không khả thi",
      },
      {
        ten: "Tự điều chỉnh",
        muc_4_xuat_sac: "Chủ động điều chỉnh khi gặp khó khăn, đề xuất giải pháp sáng tạo",
        muc_3_tot: "Có điều chỉnh khi được gợi ý, áp dụng giải pháp phù hợp",
        muc_2_dat: "Nhận ra cần điều chỉnh nhưng chưa biết cách thực hiện",
        muc_1_chua_dat: "Không điều chỉnh, bỏ cuộc khi gặp khó khăn",
      },
      {
        ten: "Phản tư học tập",
        muc_4_xuat_sac: "Rút ra bài học sâu sắc, liên hệ với nhiều tình huống, đề xuất cải tiến",
        muc_3_tot: "Rút ra bài học có ý nghĩa, có liên hệ thực tế",
        muc_2_dat: "Có phản tư nhưng còn hời hợt, ít liên hệ thực tế",
        muc_1_chua_dat: "Không có phản tư hoặc chỉ mô tả lại hoạt động",
      },
    ],
    cach_tinh_diem:
      "Tổng điểm = (TC1 + TC2 + TC3 + TC4) / 4. Mức Xuất sắc: 3.5-4, Tốt: 2.5-3.4, Đạt: 1.5-2.4, Chưa đạt: <1.5",
    luu_y: [
      "Có thể điều chỉnh trọng số nếu cần nhấn mạnh tiêu chí nào",
      "Nên kết hợp với tự đánh giá của học sinh",
      "Cho học sinh xem rubric trước để định hướng",
    ],
  },

  // Rubric 2: Đánh giá năng lực giao tiếp và hợp tác
  {
    ma: "RB-02",
    ten: "Rubric Đánh Giá Năng Lực Giao Tiếp & Hợp Tác",
    loai: "nang_luc",
    mo_ta: "Đánh giá khả năng làm việc nhóm, giao tiếp và giải quyết xung đột",
    ap_dung_cho: ["Hoạt động nhóm", "Dự án cộng đồng", "Thảo luận/tranh biện", "Tổ chức sự kiện"],
    tieu_chi: [
      {
        ten: "Lắng nghe tích cực",
        muc_4_xuat_sac: "Luôn chú ý lắng nghe, đặt câu hỏi làm rõ, tóm tắt ý kiến người khác chính xác",
        muc_3_tot: "Lắng nghe và phản hồi phù hợp, đôi khi đặt câu hỏi",
        muc_2_dat: "Có lắng nghe nhưng hay bị phân tâm, ít phản hồi",
        muc_1_chua_dat: "Không lắng nghe, ngắt lời người khác, làm việc riêng",
      },
      {
        ten: "Trình bày ý kiến",
        muc_4_xuat_sac: "Trình bày rõ ràng, logic, có dẫn chứng, thu hút người nghe",
        muc_3_tot: "Trình bày được ý kiến rõ ràng, có cấu trúc",
        muc_2_dat: "Có trình bày nhưng còn lộn xộn, thiếu dẫn chứng",
        muc_1_chua_dat: "Không trình bày được hoặc nói lan man, khó hiểu",
      },
      {
        ten: "Hợp tác nhóm",
        muc_4_xuat_sac: "Chủ động nhận việc, hỗ trợ thành viên khác, đóng góp vượt mong đợi",
        muc_3_tot: "Hoàn thành tốt phần việc được giao, có hỗ trợ khi cần",
        muc_2_dat: "Hoàn thành phần việc nhưng cần nhắc nhở, ít hỗ trợ",
        muc_1_chua_dat: "Không hoàn thành việc, ỷ lại vào người khác",
      },
      {
        ten: "Giải quyết xung đột",
        muc_4_xuat_sac: "Chủ động hòa giải, đề xuất giải pháp win-win, giữ thái độ tôn trọng",
        muc_3_tot: "Tham gia giải quyết xung đột một cách xây dựng",
        muc_2_dat: "Né tránh xung đột hoặc chỉ đồng ý theo số đông",
        muc_1_chua_dat: "Gây ra hoặc làm trầm trọng xung đột, không hợp tác",
      },
    ],
    cach_tinh_diem:
      "Tổng điểm = (TC1 + TC2 + TC3 + TC4) / 4. Mức Xuất sắc: 3.5-4, Tốt: 2.5-3.4, Đạt: 1.5-2.4, Chưa đạt: <1.5",
    luu_y: [
      "Nên có đánh giá đồng đẳng (peer review)",
      "Quan sát trong suốt quá trình, không chỉ kết quả cuối",
      "Ghi chú cụ thể hành vi để phản hồi cho học sinh",
    ],
  },

  // Rubric 3: Đánh giá sản phẩm dự án
  {
    ma: "RB-03",
    ten: "Rubric Đánh Giá Sản Phẩm Dự Án",
    loai: "san_pham",
    mo_ta: "Đánh giá chất lượng sản phẩm đầu ra của học sinh (poster, video, bài thuyết trình, kế hoạch...)",
    ap_dung_cho: ["Bài thuyết trình", "Poster/Infographic", "Video", "Kế hoạch/Đề án", "Sản phẩm sáng tạo"],
    tieu_chi: [
      {
        ten: "Nội dung",
        muc_4_xuat_sac: "Đầy đủ, chính xác, sâu sắc, có góc nhìn sáng tạo riêng",
        muc_3_tot: "Đầy đủ, chính xác, có phân tích",
        muc_2_dat: "Có nội dung cơ bản nhưng còn thiếu hoặc sơ sài",
        muc_1_chua_dat: "Thiếu nội dung quan trọng hoặc có sai sót lớn",
      },
      {
        ten: "Cấu trúc/Trình bày",
        muc_4_xuat_sac: "Logic chặt chẽ, bố cục sáng tạo, dễ theo dõi, thẩm mỹ cao",
        muc_3_tot: "Cấu trúc rõ ràng, trình bày gọn gàng",
        muc_2_dat: "Có cấu trúc nhưng chưa logic, trình bày còn lộn xộn",
        muc_1_chua_dat: "Không có cấu trúc rõ ràng, khó theo dõi",
      },
      {
        ten: "Tính ứng dụng",
        muc_4_xuat_sac: "Có thể áp dụng ngay vào thực tế, đề xuất cải tiến khả thi",
        muc_3_tot: "Có khả năng ứng dụng tốt",
        muc_2_dat: "Có ý tưởng ứng dụng nhưng chưa rõ ràng",
        muc_1_chua_dat: "Không có tính ứng dụng hoặc xa rời thực tế",
      },
      {
        ten: "Sáng tạo",
        muc_4_xuat_sac: "Ý tưởng độc đáo, cách tiếp cận mới mẻ, gây ấn tượng mạnh",
        muc_3_tot: "Có yếu tố sáng tạo, không sao chép",
        muc_2_dat: "Dựa nhiều vào mẫu có sẵn, ít sáng tạo",
        muc_1_chua_dat: "Sao chép hoặc hoàn toàn theo mẫu, không có ý tưởng riêng",
      },
    ],
    cach_tinh_diem: "Tổng điểm = (Nội dung x 2 + Cấu trúc + Ứng dụng + Sáng tạo) / 5. Nội dung được tính hệ số 2.",
    luu_y: [
      "Điều chỉnh tiêu chí theo loại sản phẩm cụ thể",
      "Có thể thêm tiêu chí đặc thù (VD: kỹ thuật video)",
      "Cho học sinh tự đánh giá trước khi nộp",
    ],
  },

  // Rubric 4: Đánh giá quá trình tham gia
  {
    ma: "RB-04",
    ten: "Rubric Đánh Giá Quá Trình Tham Gia",
    loai: "qua_trinh",
    mo_ta: "Đánh giá thái độ và mức độ tham gia của học sinh trong suốt hoạt động",
    ap_dung_cho: ["Tất cả các hoạt động", "Sinh hoạt dưới cờ", "Sinh hoạt lớp", "Hoạt động ngoại khóa"],
    tieu_chi: [
      {
        ten: "Chủ động tham gia",
        muc_4_xuat_sac: "Luôn xung phong, đề xuất ý tưởng, dẫn dắt hoạt động",
        muc_3_tot: "Tham gia tích cực, có đóng góp ý kiến",
        muc_2_dat: "Tham gia khi được yêu cầu, ít chủ động",
        muc_1_chua_dat: "Không tham gia, thụ động, làm việc riêng",
      },
      {
        ten: "Thái độ tích cực",
        muc_4_xuat_sac: "Nhiệt tình, truyền cảm hứng cho người khác, luôn lạc quan",
        muc_3_tot: "Thái độ tốt, hợp tác vui vẻ",
        muc_2_dat: "Thái độ bình thường, không gây ảnh hưởng tiêu cực",
        muc_1_chua_dat: "Thái độ tiêu cực, than phiền, gây ảnh hưởng xấu",
      },
      {
        ten: "Tuân thủ quy định",
        muc_4_xuat_sac: "Tuân thủ và nhắc nhở người khác, đề xuất cải thiện quy định",
        muc_3_tot: "Tuân thủ đầy đủ các quy định",
        muc_2_dat: "Tuân thủ phần lớn nhưng đôi khi vi phạm nhỏ",
        muc_1_chua_dat: "Vi phạm nhiều lần, không tuân thủ",
      },
      {
        ten: "Kiên trì hoàn thành",
        muc_4_xuat_sac: "Hoàn thành vượt mong đợi, giúp người khác hoàn thành",
        muc_3_tot: "Hoàn thành đúng hạn và đạt yêu cầu",
        muc_2_dat: "Hoàn thành nhưng trễ hạn hoặc chưa đạt yêu cầu",
        muc_1_chua_dat: "Không hoàn thành hoặc bỏ dở giữa chừng",
      },
    ],
    cach_tinh_diem:
      "Tổng điểm = (TC1 + TC2 + TC3 + TC4) / 4. Mức Xuất sắc: 3.5-4, Tốt: 2.5-3.4, Đạt: 1.5-2.4, Chưa đạt: <1.5",
    luu_y: [
      "Quan sát thường xuyên, ghi chép nhanh",
      "Tránh đánh giá dựa trên ấn tượng chung",
      "Có thể dùng checklist để theo dõi hàng tuần",
    ],
  },
]

// ==================== HÀM TRUY XUẤT ====================

/**
 * Lấy phiếu học tập phù hợp với loại hoạt động
 */
export function getPhieuHocTapTheoLoai(loai: PhieuHocTap["loai"]): PhieuHocTap | undefined {
  return MAU_PHIEU_HOC_TAP.find((p) => p.loai === loai)
}

/**
 * Lấy phiếu học tập phù hợp với tên hoạt động
 */
export function getPhieuHocTapTheoHoatDong(tenHoatDong: string): PhieuHocTap[] {
  const tenLower = tenHoatDong.toLowerCase()
  return MAU_PHIEU_HOC_TAP.filter((p) =>
    p.danh_cho_hoat_dong.some((hd) => hd.toLowerCase().includes(tenLower) || tenLower.includes(hd.toLowerCase())),
  )
}

/**
 * Lấy rubric phù hợp với loại đánh giá
 */
export function getRubricTheoLoai(loai: RubricDanhGia["loai"]): RubricDanhGia[] {
  return MAU_RUBRIC.filter((r) => r.loai === loai)
}

/**
 * Lấy rubric phù hợp với hoạt động
 */
export function getRubricTheoHoatDong(tenHoatDong: string): RubricDanhGia[] {
  const tenLower = tenHoatDong.toLowerCase()
  return MAU_RUBRIC.filter((r) =>
    r.ap_dung_cho.some((hd) => hd.toLowerCase().includes(tenLower) || tenLower.includes(hd.toLowerCase())),
  )
}

/**
 * Tạo context phiếu học tập cho AI
 */
export function taoContextPhieuHocTap(tenChuDe: string, loaiHoatDong: string): string {
  const phieuPhuHop = getPhieuHocTapTheoHoatDong(loaiHoatDong)

  if (phieuPhuHop.length === 0) {
    return ""
  }

  let context = `\n=== PHIẾU HỌC TẬP GỢI Ý ===\n`
  context += `Chủ đề: ${tenChuDe}\n`
  context += `Loại hoạt động: ${loaiHoatDong}\n\n`

  phieuPhuHop.forEach((phieu) => {
    context += `📋 ${phieu.ten} (${phieu.ma})\n`
    context += `Mô tả: ${phieu.mo_ta}\n`
    context += `Cấu trúc phiếu:\n`
    phieu.cau_truc.forEach((phan) => {
      context += `  - ${phan.phan}: ${phan.huong_dan}\n`
      context += `    Câu hỏi mẫu: ${phan.cau_hoi_mau.slice(0, 2).join("; ")}...\n`
    })
    context += `Lưu ý: ${phieu.luu_y_su_dung[0]}\n\n`
  })

  return context
}

/**
 * Tạo context rubric đánh giá cho AI
 */
export function taoContextRubric(tenHoatDong: string, loaiDanhGia?: RubricDanhGia["loai"]): string {
  let rubricPhuHop = getRubricTheoHoatDong(tenHoatDong)

  if (loaiDanhGia) {
    rubricPhuHop = rubricPhuHop.filter((r) => r.loai === loaiDanhGia)
  }

  if (rubricPhuHop.length === 0) {
    rubricPhuHop = MAU_RUBRIC.slice(0, 2) // Lấy 2 rubric mặc định
  }

  let context = `\n=== RUBRIC ĐÁNH GIÁ GỢI Ý ===\n`

  rubricPhuHop.forEach((rubric) => {
    context += `📊 ${rubric.ten} (${rubric.ma})\n`
    context += `Loại: ${rubric.loai} | Áp dụng cho: ${rubric.ap_dung_cho.slice(0, 3).join(", ")}\n`
    context += `Tiêu chí đánh giá:\n`
    rubric.tieu_chi.forEach((tc) => {
      context += `  • ${tc.ten}:\n`
      context += `    - Mức 4 (Xuất sắc): ${tc.muc_4_xuat_sac.substring(0, 50)}...\n`
      context += `    - Mức 1 (Chưa đạt): ${tc.muc_1_chua_dat.substring(0, 50)}...\n`
    })
    context += `Cách tính điểm: ${rubric.cach_tinh_diem}\n\n`
  })

  return context
}

/**
 * Tạo context đầy đủ cho KHBD (phiếu + rubric)
 */
export function taoContextDanhGiaKHBD(tenChuDe: string, cacHoatDong: string[]): string {
  let context = `\n========== HỖ TRỢ ĐÁNH GIÁ ==========\n`

  // Gợi ý phiếu học tập
  const phieuDaGoi: Set<string> = new Set()
  cacHoatDong.forEach((hd) => {
    const phieuList = getPhieuHocTapTheoHoatDong(hd)
    phieuList.forEach((p) => {
      if (!phieuDaGoi.has(p.ma)) {
        phieuDaGoi.add(p.ma)
        context += `📋 Phiếu phù hợp cho "${hd}": ${p.ten}\n`
        context += `   Cấu trúc: ${p.cau_truc.map((c) => c.phan).join(" → ")}\n`
      }
    })
  })

  // Gợi ý rubric
  context += `\n📊 RUBRIC ĐỀ XUẤT:\n`
  context += `1. ${MAU_RUBRIC[0].ten} - cho đánh giá năng lực tự chủ\n`
  context += `2. ${MAU_RUBRIC[1].ten} - cho đánh giá hoạt động nhóm\n`
  context += `3. ${MAU_RUBRIC[3].ten} - cho đánh giá quá trình tham gia\n`

  return context
}

// Export tất cả
export const PHIEU_HOC_TAP_RUBRIC_DATABASE = {
  phieu_hoc_tap: MAU_PHIEU_HOC_TAP,
  rubric: MAU_RUBRIC,
  huong_dan_su_dung: {
    phieu_reflection: "Dùng cho hoạt động khám phá bản thân, nghề nghiệp, ra quyết định",
    phieu_action: "Dùng cho hoạt động nhóm, dự án, tổ chức sự kiện",
    phieu_research: "Dùng cho hoạt động tìm hiểu, nghiên cứu, thu thập thông tin",
    phieu_planning: "Dùng cho hoạt động lập kế hoạch cá nhân, đặt mục tiêu",
    rubric_nang_luc: "Đánh giá năng lực chung (tự chủ, giao tiếp, hợp tác)",
    rubric_san_pham: "Đánh giá sản phẩm đầu ra (poster, video, bài thuyết trình)",
    rubric_qua_trinh: "Đánh giá thái độ và quá trình tham gia",
  },
}
