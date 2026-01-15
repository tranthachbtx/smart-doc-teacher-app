/**
 * CƠ SỞ DỮ LIỆU  + PHAN_BIEN, TU_DUY, DA_CHIEU, PHAN_TICH: Dùng cho Hoạt động Khám phávụ trong chương trình HĐTN, HN
 * Bộ sách: Kết nối Tri thức với Cuộc sống
 */

// Interface cho câu hỏi gợi mở
export interface CauHoiGoiMo {
  loai:
  | "quan_sat"
  | "ket_noi"
  | "van_dung"
  | "phan_bien"
  | "trach_nhiem"
  | "doi_chieu"
  | "phat_trien"
  | "da_chieu"
  | "tu_duy"
  | "thuc_te"
  | "kha_thi"
  | "tac_dong"
  | "cam_xuc"
  | "gia_tri"
  | "hanh_dong"
  | "phan_tich"
  | "chien_luoc"
  | "thuc_hanh"
  | "he_thong"
  | "tong_hop"
  cau_hoi: string
  muc_dich?: string
}

export interface NhiemVuVaCauHoi {
  ten_nhiem_vu: string
  cau_hoi: CauHoiGoiMo[]
}

export interface ChuDeVaCauHoi {
  nhom_chu_de: string
  chu_de_lien_quan: string[]
  nhiem_vu: NhiemVuVaCauHoi[]
}

export interface KhoiCauHoi {
  khoi: number
  trong_tam: string
  muc_tieu_cau_hoi: string
  chu_de: ChuDeVaCauHoi[]
}

// ==================== KHỐI 10 ====================
export const CAU_HOI_KHOI_10: KhoiCauHoi = {
  khoi: 10,
  trong_tam: "KHÁM PHÁ & THÍCH ỨNG",
  muc_tieu_cau_hoi: "Khơi gợi sự tự nhận thức (Self-awareness) và kết nối cảm xúc cá nhân với môi trường mới",
  chu_de: [
    {
      nhom_chu_de: "Thích ứng & Truyền thống",
      chu_de_lien_quan: ["CĐ1: Phát huy truyền thống nhà trường"],
      nhiem_vu: [
        {
          ten_nhiem_vu: "Khảo sát, tìm hiểu phòng truyền thống",
          cau_hoi: [
            {
              loai: "quan_sat",
              cau_hoi: "Hiện vật hoặc hình ảnh nào trong phòng truyền thống gây ấn tượng mạnh nhất với em? Tại sao?",
            },
            {
              loai: "ket_noi",
              cau_hoi:
                "Nếu được chọn một giá trị cốt lõi của nhà trường để đại diện cho bản thân, em sẽ chọn giá trị nào?",
            },
            { loai: "van_dung", cau_hoi: "Em nghĩ thế hệ học sinh 10 năm sau sẽ nhớ gì về khóa học của các em?" },
          ],
        },
        {
          ten_nhiem_vu: "Xây dựng cam kết thực hiện nội quy",
          cau_hoi: [
            {
              loai: "phan_bien",
              cau_hoi:
                "Theo em, quy định nào trong nội quy nhà trường là 'khó tuân thủ' nhất? Tại sao nhà trường lại đưa ra quy định đó?",
            },
            {
              loai: "trach_nhiem",
              cau_hoi: "Việc em tuân thủ nội quy mang lại lợi ích gì cho chính em, thay vì chỉ là để không bị phạt?",
            },
          ],
        },
      ],
    },
    {
      nhom_chu_de: "Phát triển Cá nhân",
      chu_de_lien_quan: ["CĐ2: Khám phá bản thân", "CĐ3: Rèn luyện bản thân"],
      nhiem_vu: [
        {
          ten_nhiem_vu: "Thực hiện trắc nghiệm tính cách (MBTI/Holland)",
          cau_hoi: [
            {
              loai: "doi_chieu",
              cau_hoi: "Kết quả trắc nghiệm có điểm nào khác với những gì em vẫn nghĩ về bản thân không?",
            },
            {
              loai: "phat_trien",
              cau_hoi:
                "Em có thể tận dụng 'điểm mạnh' nào từ kết quả này để giải quyết một khó khăn hiện tại trong học tập?",
            },
          ],
        },
        {
          ten_nhiem_vu: "Tranh biện về quan điểm sống",
          cau_hoi: [
            {
              loai: "da_chieu",
              cau_hoi: "Nếu em buộc phải bảo vệ quan điểm đối lập với suy nghĩ của mình, em sẽ đưa ra luận điểm nào?",
            },
            { loai: "tu_duy", cau_hoi: "Đâu là ranh giới giữa việc 'bảo vệ quan điểm cá nhân' và 'bảo thủ'?" },
          ],
        },
        {
          ten_nhiem_vu: "Lập kế hoạch rèn luyện bản thân",
          cau_hoi: [
            {
              loai: "thuc_te",
              cau_hoi: "Điều gì đã cản trở em thực hiện các kế hoạch trước đây? Em sẽ làm gì khác lần này?",
            },
            { loai: "hanh_dong", cau_hoi: "Hành động nhỏ nhất em có thể làm NGAY BÂY GIỜ để bắt đầu kế hoạch là gì?" },
          ],
        },
      ],
    },
    {
      nhom_chu_de: "Trách nhiệm Xã hội",
      chu_de_lien_quan: ["CĐ7: Bảo tồn cảnh quan thiên nhiên", "CĐ8: Bảo vệ môi trường"],
      nhiem_vu: [
        {
          ten_nhiem_vu: "Thuyết trình giải pháp bảo vệ cảnh quan",
          cau_hoi: [
            { loai: "thuc_te", cau_hoi: "Tại sao các giải pháp cũ (nếu có) lại chưa hiệu quả?" },
            { loai: "kha_thi", cau_hoi: "Nếu chỉ có 0 đồng kinh phí, nhóm em sẽ thực hiện giải pháp này như thế nào?" },
            {
              loai: "tac_dong",
              cau_hoi: "Hành động nhỏ nhất mà em có thể làm ngay hôm nay để thay đổi thực trạng là gì?",
            },
          ],
        },
      ],
    },
    {
      nhom_chu_de: "Gia đình",
      chu_de_lien_quan: ["CĐ5: Trách nhiệm với gia đình"],
      nhiem_vu: [
        {
          ten_nhiem_vu: "Chia sẻ về trách nhiệm gia đình",
          cau_hoi: [
            { loai: "cam_xuc", cau_hoi: "Khoảnh khắc nào em cảm thấy tự hào nhất khi giúp đỡ gia đình?" },
            { loai: "ket_noi", cau_hoi: "Nếu có thể nói một câu với bố/mẹ mà không ngại ngùng, em sẽ nói gì?" },
          ],
        },
      ],
    },
    {
      nhom_chu_de: "Hướng nghiệp",
      chu_de_lien_quan: [
        "CĐ9: Tìm hiểu nghề nghiệp",
        "CĐ10: Hiểu bản thân để chọn nghề",
        "CĐ11: Lập kế hoạch học tập theo định hướng nghề",
      ],
      nhiem_vu: [
        {
          ten_nhiem_vu: "Tìm hiểu các nhóm nghề",
          cau_hoi: [
            { loai: "quan_sat", cau_hoi: "Nghề nghiệp nào em thấy hấp dẫn nhất khi tìm hiểu? Điều gì thu hút em?" },
            { loai: "doi_chieu", cau_hoi: "Nghề em yêu thích có phù hợp với tính cách của em không? Tại sao?" },
          ],
        },
        {
          ten_nhiem_vu: "Phỏng vấn người thân về nghề nghiệp",
          cau_hoi: [
            { loai: "ket_noi", cau_hoi: "Điều gì khiến em bất ngờ nhất khi nghe người thân kể về công việc của họ?" },
            {
              loai: "phat_trien",
              cau_hoi:
                "Nếu áp dụng bài học từ trải nghiệm nghề nghiệp của người thân, em sẽ chuẩn bị gì cho tương lai?",
            },
          ],
        },
      ],
    },
  ],
}

// ==================== KHỐI 11 ====================
export const CAU_HOI_KHOI_11: KhoiCauHoi = {
  khoi: 11,
  trong_tam: "PHÁT TRIỂN & BẢN SẮC",
  muc_tieu_cau_hoi: "Thúc đẩy tư duy hệ thống (Systems thinking) và năng lực giải quyết vấn đề trong bối cảnh xã hội",
  chu_de: [
    {
      nhom_chu_de: "Phát triển nhà trường",
      chu_de_lien_quan: ["CĐ1: Xây dựng và phát triển nhà trường"],
      nhiem_vu: [
        {
          ten_nhiem_vu: "Đề xuất sáng kiến phát triển nhà trường",
          cau_hoi: [
            {
              loai: "he_thong",
              cau_hoi:
                "Sáng kiến của nhóm em sẽ ảnh hưởng đến những đối tượng nào trong trường? (HS, GV, Phụ huynh, Cộng đồng...)",
            },
            {
              loai: "phan_bien",
              cau_hoi:
                "Nếu bạn là Hiệu trưởng và phải từ chối một sáng kiến vì hạn chế ngân sách, bạn sẽ đưa ra tiêu chí ưu tiên nào?",
            },
          ],
        },
      ],
    },
    {
      nhom_chu_de: "Bản sắc & Năng lực cá nhân",
      chu_de_lien_quan: ["CĐ2: Khám phá bản thân", "CĐ3: Rèn luyện bản thân"],
      nhiem_vu: [
        {
          ten_nhiem_vu: "Phân tích SWOT bản thân",
          cau_hoi: [
            { loai: "chien_luoc", cau_hoi: "Em sẽ dùng Điểm mạnh (S) nào để tận dụng Cơ hội (O) hiện tại?" },
            {
              loai: "tu_duy",
              cau_hoi: "Điểm yếu (W) nào của em có thể biến thành điểm mạnh nếu được rèn luyện đúng cách?",
            },
          ],
        },
        {
          ten_nhiem_vu: "Lập kế hoạch quản lý thời gian/tài chính",
          cau_hoi: [
            { loai: "thuc_hanh", cau_hoi: "Em đã thử phương pháp quản lý thời gian nào chưa? Kết quả ra sao?" },
            { loai: "phan_tich", cau_hoi: "Đâu là 'kẻ đánh cắp thời gian' lớn nhất của em hiện nay?" },
            { loai: "hanh_dong", cau_hoi: "Nếu mỗi ngày tiết kiệm được 30 phút, em sẽ dùng nó để làm gì có ý nghĩa?" },
          ],
        },
        {
          ten_nhiem_vu: "Thực hành kỹ năng giao tiếp mạng xã hội",
          cau_hoi: [
            {
              loai: "phan_bien",
              cau_hoi: "Ranh giới nào giữa 'tự do ngôn luận' và 'phát ngôn gây hại' trên mạng xã hội?",
            },
            {
              loai: "trach_nhiem",
              cau_hoi: "Nếu một bình luận của em vô tình gây tổn thương người khác, em sẽ xử lý như thế nào?",
            },
          ],
        },
      ],
    },
    {
      nhom_chu_de: "Gia đình & Xã hội",
      chu_de_lien_quan: ["CĐ4: Trách nhiệm với gia đình", "CĐ5: Phát triển cộng đồng"],
      nhiem_vu: [
        {
          ten_nhiem_vu: "Giải quyết mâu thuẫn gia đình (đóng vai)",
          cau_hoi: [
            {
              loai: "da_chieu",
              cau_hoi: "Nếu em đặt mình vào vị trí của bố/mẹ trong tình huống này, em sẽ cảm thấy thế nào?",
            },
            {
              loai: "chien_luoc",
              cau_hoi: "Đâu là điểm chung mà cả hai bên (cha mẹ - con cái) đều đồng ý, có thể dùng làm 'cầu nối'?",
            },
          ],
        },
        {
          ten_nhiem_vu: "Thiết kế dự án cộng đồng",
          cau_hoi: [
            {
              loai: "he_thong",
              cau_hoi: "Dự án này giải quyết 'nguyên nhân gốc rễ' hay chỉ 'triệu chứng' của vấn đề xã hội?",
            },
            {
              loai: "kha_thi",
              cau_hoi: "Sau khi dự án kết thúc, cộng đồng có thể tự duy trì kết quả không? Bằng cách nào?",
            },
          ],
        },
      ],
    },
    {
      nhom_chu_de: "Môi trường",
      chu_de_lien_quan: ["CĐ6: Bảo tồn cảnh quan thiên nhiên", "CĐ7: Bảo vệ môi trường"],
      nhiem_vu: [
        {
          ten_nhiem_vu: "Phân tích tác động môi trường",
          cau_hoi: [
            {
              loai: "he_thong",
              cau_hoi: "Hành động nhỏ của mỗi cá nhân tích lũy lại sẽ tạo ra tác động gì ở cấp độ cộng đồng/quốc gia?",
            },
            {
              loai: "phan_bien",
              cau_hoi: "Tại sao nhiều người biết vấn đề môi trường nghiêm trọng nhưng vẫn không thay đổi hành vi?",
            },
          ],
        },
      ],
    },
    {
      nhom_chu_de: "Hướng nghiệp chuyên sâu",
      chu_de_lien_quan: [
        "CĐ8: Các nhóm nghề cơ bản",
        "CĐ9: Rèn luyện phẩm chất nghề",
        "CĐ10: Kế hoạch học tập theo nghề",
      ],
      nhiem_vu: [
        {
          ten_nhiem_vu: "Phân tích xu hướng nghề nghiệp",
          cau_hoi: [
            { loai: "chien_luoc", cau_hoi: "Nghề em quan tâm sẽ thay đổi như thế nào trong 10 năm tới do công nghệ?" },
            { loai: "tu_duy", cau_hoi: "Kỹ năng nào em cần học NGAY BÂY GIỜ để không bị lạc hậu trong tương lai?" },
          ],
        },
        {
          ten_nhiem_vu: "Trải nghiệm thực tế nghề nghiệp",
          cau_hoi: [
            { loai: "doi_chieu", cau_hoi: "Thực tế công việc có khác gì so với tưởng tượng ban đầu của em?" },
            { loai: "phat_trien", cau_hoi: "Nếu được làm lại, em sẽ chuẩn bị gì trước khi đi trải nghiệm?" },
          ],
        },
      ],
    },
  ],
}

// ==================== KHỐI 12 ====================
export const CAU_HOI_KHOI_12: KhoiCauHoi = {
  khoi: 12,
  trong_tam: "TRƯỞNG THÀNH & CHUYỂN TIẾP",
  muc_tieu_cau_hoi: "Hỗ trợ quá trình ra quyết định (Decision-making) và xây dựng tầm nhìn cuộc đời (Life vision)",
  chu_de: [
    {
      nhom_chu_de: "Trưởng thành & Hoàn thiện",
      chu_de_lien_quan: ["CĐ1: Xây dựng và phát triển nhà trường", "CĐ2: Tôi trưởng thành", "CĐ3: Hoàn thiện bản thân"],
      nhiem_vu: [
        {
          ten_nhiem_vu: "Viết thư gửi chính mình 10 năm sau",
          cau_hoi: [
            { loai: "tong_hop", cau_hoi: "Em muốn 'phiên bản 10 năm sau' của mình nhớ gì về giai đoạn hiện tại?" },
            { loai: "gia_tri", cau_hoi: "Điều gì em KHÔNG muốn thay đổi dù 10 năm trôi qua?" },
          ],
        },
        {
          ten_nhiem_vu: "Đánh giá hành trình trưởng thành THPT",
          cau_hoi: [
            { loai: "phan_tich", cau_hoi: "Sai lầm nào trong 3 năm THPT đã dạy em bài học giá trị nhất?" },
            { loai: "cam_xuc", cau_hoi: "Nếu được quay lại ngày đầu tiên vào lớp 10, em sẽ nói gì với chính mình?" },
          ],
        },
        {
          ten_nhiem_vu: "Quản lý căng thẳng mùa thi",
          cau_hoi: [
            { loai: "thuc_hanh", cau_hoi: "Phương pháp giảm stress nào em đã thử và thấy hiệu quả nhất?" },
            {
              loai: "he_thong",
              cau_hoi: "Áp lực thi cử đến từ đâu nhiều nhất: bản thân, gia đình, xã hội, hay bạn bè?",
            },
          ],
        },
      ],
    },
    {
      nhom_chu_de: "Gia đình & Cộng đồng",
      chu_de_lien_quan: ["CĐ4: Trách nhiệm với gia đình", "CĐ5: Xây dựng cộng đồng"],
      nhiem_vu: [
        {
          ten_nhiem_vu: "Xây dựng kế hoạch tài chính gia đình",
          cau_hoi: [
            { loai: "trach_nhiem", cau_hoi: "Khi nào em sẽ bắt đầu đóng góp tài chính cho gia đình? Bằng cách nào?" },
            {
              loai: "chien_luoc",
              cau_hoi: "Nếu phải tự lập hoàn toàn sau khi tốt nghiệp, em cần bao nhiêu tiền/tháng để sống?",
            },
          ],
        },
        {
          ten_nhiem_vu: "Thực hiện dự án phục vụ cộng đồng",
          cau_hoi: [
            { loai: "tong_hop", cau_hoi: "Dự án này đã thay đổi cách em nhìn nhận về 'thành công' như thế nào?" },
            { loai: "gia_tri", cau_hoi: "Em muốn được nhớ đến với đóng góp gì cho cộng đồng?" },
          ],
        },
      ],
    },
    {
      nhom_chu_de: "Môi trường & Công dân",
      chu_de_lien_quan: ["CĐ6: Chung tay gìn giữ cảnh quan", "CĐ7: Bảo vệ thế giới tự nhiên"],
      nhiem_vu: [
        {
          ten_nhiem_vu: "Vận động cộng đồng bảo vệ môi trường",
          cau_hoi: [
            {
              loai: "chien_luoc",
              cau_hoi: "Làm thế nào để thuyết phục người lớn tuổi thay đổi thói quen có hại cho môi trường?",
            },
            {
              loai: "he_thong",
              cau_hoi: "Nếu mọi người đều nghĩ 'một mình tôi không thay đổi được gì', điều gì sẽ xảy ra?",
            },
          ],
        },
      ],
    },
    {
      nhom_chu_de: "Quyết định Nghề nghiệp",
      chu_de_lien_quan: [
        "CĐ8: Nghề nghiệp và yêu cầu với người lao động",
        "CĐ9: Rèn luyện phẩm chất phù hợp với định hướng nghề",
        "CĐ10: Quyết định lựa chọn nghề phù hợp",
      ],
      nhiem_vu: [
        {
          ten_nhiem_vu: "Phân tích ma trận quyết định nghề nghiệp",
          cau_hoi: [
            {
              loai: "chien_luoc",
              cau_hoi:
                "Nếu phải chọn giữa 'nghề yêu thích nhưng thu nhập thấp' và 'nghề không thích nhưng lương cao', em sẽ cân nhắc yếu tố nào?",
            },
            {
              loai: "tu_duy",
              cau_hoi: "Định nghĩa 'thành công trong nghề nghiệp' của em khác gì với định nghĩa của bố mẹ?",
            },
          ],
        },
        {
          ten_nhiem_vu: "Xây dựng lộ trình nghề nghiệp 5 năm",
          cau_hoi: [
            { loai: "tong_hop", cau_hoi: "Nếu kế hoạch A thất bại, kế hoạch B của em là gì?" },
            { loai: "thuc_hanh", cau_hoi: "Bước đầu tiên em sẽ thực hiện NGAY SAU KHI TỐT NGHIỆP là gì?" },
            {
              loai: "gia_tri",
              cau_hoi:
                "Trong 5 năm tới, em muốn trở thành người như thế nào - không chỉ về nghề nghiệp mà còn về con người?",
            },
          ],
        },
        {
          ten_nhiem_vu: "Chuẩn bị hồ sơ xin việc/xét tuyển ĐH",
          cau_hoi: [
            { loai: "doi_chieu", cau_hoi: "Điểm nào trong hồ sơ của em nổi bật hơn so với hàng nghìn ứng viên khác?" },
            {
              loai: "phat_trien",
              cau_hoi: "Nếu được phỏng vấn và hỏi 'Tại sao chúng tôi nên chọn bạn?', em sẽ trả lời thế nào?",
            },
          ],
        },
      ],
    },
  ],
}

// ==================== HÀM TRUY XUẤT ====================

/**
 * Lấy câu hỏi gợi mở theo khối
 */
export function getCauHoiTheoKhoi(khoi: number): KhoiCauHoi | null {
  switch (khoi) {
    case 10:
      return CAU_HOI_KHOI_10
    case 11:
      return CAU_HOI_KHOI_11
    case 12:
      return CAU_HOI_KHOI_12
    default:
      return null
  }
}

/**
 * Tìm câu hỏi theo tên nhiệm vụ
 */
export function timCauHoiTheoNhiemVu(khoi: number, tenNhiemVu: string): CauHoiGoiMo[] {
  const khoiData = getCauHoiTheoKhoi(khoi)
  if (!khoiData) return []

  const tenNhiemVuLower = tenNhiemVu.toLowerCase()

  for (const chuDe of khoiData.chu_de) {
    for (const nhiemVu of chuDe.nhiem_vu) {
      if (
        nhiemVu.ten_nhiem_vu.toLowerCase().includes(tenNhiemVuLower) ||
        tenNhiemVuLower.includes(nhiemVu.ten_nhiem_vu.toLowerCase())
      ) {
        return nhiemVu.cau_hoi
      }
    }
  }

  return []
}

/**
 * Tìm câu hỏi theo chủ đề
 */
export function timCauHoiTheoChuDe(khoi: number, tenChuDe: string): NhiemVuVaCauHoi[] {
  const khoiData = getCauHoiTheoKhoi(khoi)
  if (!khoiData) return []

  const tenChuDeLower = tenChuDe.toLowerCase()

  for (const chuDe of khoiData.chu_de) {
    // Kiểm tra trong danh sách chủ đề liên quan
    for (const cdLienQuan of chuDe.chu_de_lien_quan) {
      if (cdLienQuan.toLowerCase().includes(tenChuDeLower) || tenChuDeLower.includes(cdLienQuan.toLowerCase())) {
        return chuDe.nhiem_vu
      }
    }
    // Kiểm tra nhóm chủ đề
    if (chuDe.nhom_chu_de.toLowerCase().includes(tenChuDeLower)) {
      return chuDe.nhiem_vu
    }
  }

  return []
}

/**
 * Tạo context câu hỏi gợi mở cho AI
 */
export function taoContextCauHoiGoiMo(khoi: number, tenChuDe?: string, tenNhiemVu?: string): string {
  const khoiData = getCauHoiTheoKhoi(khoi)
  if (!khoiData) return ""

  let context = `## CÂU HỎI GỢI MỞ - KHỐI ${khoi}\n`
  context += `**Trọng tâm**: ${khoiData.trong_tam}\n`
  context += `**Mục tiêu câu hỏi**: ${khoiData.muc_tieu_cau_hoi}\n\n`

  if (tenNhiemVu) {
    const cauHoi = timCauHoiTheoNhiemVu(khoi, tenNhiemVu)
    if (cauHoi.length > 0) {
      context += `### Câu hỏi cho nhiệm vụ "${tenNhiemVu}":\n`
      cauHoi.forEach((ch, idx) => {
        context += `${idx + 1}. [${ch.loai.toUpperCase()}] ${ch.cau_hoi}\n`
      })
      return context
    }
  }

  if (tenChuDe) {
    const nhiemVuList = timCauHoiTheoChuDe(khoi, tenChuDe)
    if (nhiemVuList.length > 0) {
      context += `### Câu hỏi cho chủ đề "${tenChuDe}":\n\n`
      nhiemVuList.forEach((nv) => {
        context += `**${nv.ten_nhiem_vu}**:\n`
        nv.cau_hoi.forEach((ch, idx) => {
          context += `  ${idx + 1}. [${ch.loai.toUpperCase()}] ${ch.cau_hoi}\n`
        })
        context += "\n"
      })
      return context
    }
  }

  // NGỪNG DUMP TOÀN BỘ DATABASE ĐỂ TRÁNH LỖI TIMEOUT
  return `### LƯU Ý: Chưa tìm thấy ngân hàng câu hỏi riêng cho chủ đề này. AI hãy tự sáng tạo các câu hỏi tương tác dựa trên tâm lý học sinh khối lớp đã cho.`;
}

/**
 * Lấy danh sách loại câu hỏi và mô tả
 */
export const LOAI_CAU_HOI = {
  quan_sat: "Câu hỏi quan sát - Giúp HS chú ý đến chi tiết",
  ket_noi: "Câu hỏi kết nối - Liên hệ với bản thân và trải nghiệm",
  van_dung: "Câu hỏi vận dụng - Áp dụng vào tình huống mới",
  phan_bien: "Câu hỏi phản biện - Phát triển tư duy phê phán",
  trach_nhiem: "Câu hỏi trách nhiệm - Nhận thức vai trò cá nhân",
  doi_chieu: "Câu hỏi đối chiếu - So sánh với nhận thức ban đầu",
  phat_trien: "Câu hỏi phát triển - Định hướng cải thiện",
  da_chieu: "Câu hỏi đa chiều - Nhìn vấn đề từ nhiều góc độ",
  tu_duy: "Câu hỏi tư duy - Phát triển tư duy sâu",
  thuc_te: "Câu hỏi thực tế - Đánh giá tính khả thi",
  kha_thi: "Câu hỏi khả thi - Tìm giải pháp với nguồn lực hạn chế",
  tac_dong: "Câu hỏi tác động - Nhận thức hậu quả hành động",
  cam_xuc: "Câu hỏi cảm xúc - Kết nối với trải nghiệm cảm xúc",
  gia_tri: "Câu hỏi giá trị - Xác định giá trị cốt lõi",
  hanh_dong: "Câu hỏi hành động - Thúc đẩy hành động cụ thể",
  phan_tich: "Câu hỏi phân tích - Phân tích nguyên nhân",
  chien_luoc: "Câu hỏi chiến lược - Xây dựng kế hoạch",
  thuc_hanh: "Câu hỏi thực hành - Rút kinh nghiệm từ thực tế",
  he_thong: "Câu hỏi hệ thống - Nhìn nhận vấn đề ở cấp độ rộng",
  tong_hop: "Câu hỏi tổng hợp - Kết nối nhiều khía cạnh",
}

// Export tất cả
export const CAU_HOI_GOI_MO_DATABASE = {
  KHOI_10: CAU_HOI_KHOI_10,
  KHOI_11: CAU_HOI_KHOI_11,
  KHOI_12: CAU_HOI_KHOI_12,
  LOAI_CAU_HOI,
}
