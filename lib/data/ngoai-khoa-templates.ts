/**
 * DATABASE MẪU KỊCH BẢN NGOẠI KHÓA
 * Trường THPT Bùi Thị Xuân - Mũi Né
 * Phong cách: Văn hóa sân khấu kịch giữa sân trường
 */

// Interface cho cấu trúc kịch bản
export interface KichBan {
  ten: string
  chu_de: string
  khoi: number
  boi_canh: string
  nhan_vat: string[]
  phan_canh: PhanCanh[]
  thong_diep: string
}

export interface PhanCanh {
  ten: string
  noi_dung: string
  hanh_dong: string[]
  loi_thoai_mau?: string[]
}

export interface TroChoi {
  ten: string
  muc_dich: string
  cach_choi: string
  thoi_gian: string
  vat_dung?: string[]
}

export interface CauHoiTuongTac {
  cau_hoi: string
  dap_an?: string
  muc_do: "de" | "trung_binh" | "kho" | "mo"
  goi_y?: string
}

export interface MauNgoaiKhoa {
  ma: string
  ten_chu_de: string
  khoi: number
  thoi_luong: string
  muc_tieu: {
    yeu_cau_can_dat: string[]
    nang_luc: string[]
    pham_chat: string[]
  }
  cau_truc: {
    khoi_dong: {
      thoi_gian: string
      hoat_dong: TroChoi
      loi_dan_dat_mc: string
    }
    phan_chinh: {
      thoi_gian: string
      loai: "kich" | "cuoc_thi" | "talkshow" | "tro_choi_lon"
      kich_ban?: KichBan
      cuoc_thi?: any
    }
    ket_thuc: {
      thoi_gian: string
      cau_hoi_tuong_tac: CauHoiTuongTac[]
      thong_diep_ket_thuc: string
    }
  }
  kinh_phi_du_kien: {
    bang_ngoai_khoa: number
    dao_cu_phan_thuong: number
    tong: number
  }
}

// ==========================================
// MẪU KỊCH BẢN ĐÃ THỰC HIỆN THÀNH CÔNG
// ==========================================

export const MAU_NGOAI_KHOA_THANH_CONG: MauNgoaiKhoa[] = [
  // Chủ đề 1 - Khối 12: Khi tôi trưởng thành
  {
    ma: "NK-12-CD1",
    ten_chu_de: "Khi tôi trưởng thành",
    khoi: 12,
    thoi_luong: "45 phút (6h45-7h30)",
    muc_tieu: {
      yeu_cau_can_dat: [
        "Nhận diện được sự trưởng thành của bản thân",
        "Nhận diện được khả năng tư duy độc lập và khả năng thích ứng với sự thay đổi",
        "Điều chỉnh được cảm xúc và ứng xử hợp lí trong các tình huống giao tiếp",
        "Hình thành giá trị đạo đức, lối sống tích cực, tôn trọng lẫn nhau",
      ],
      nang_luc: ["Giao tiếp và hợp tác", "Giải quyết vấn đề và sáng tạo", "Thích ứng với cuộc sống"],
      pham_chat: [
        "Trách nhiệm: Ý thức giữ gìn và phát huy văn hóa học đường",
        "Tôn trọng: Biết tôn trọng bản thân, người khác và nội quy nhà trường",
        "Yêu thương: Quan tâm, giúp đỡ bạn bè và xây dựng môi trường học tập thân thiện",
      ],
    },
    cau_truc: {
      khoi_dong: {
        thoi_gian: "5-7 phút",
        hoat_dong: {
          ten: "Ước mơ tương lai",
          muc_dich: "Tạo không khí, dẫn dắt chủ đề",
          cach_choi:
            "MC đặt câu hỏi: 'Bạn ước mơ mình sẽ là ai/khi trưởng thành sẽ làm gì?'. Mỗi bạn trả lời trong 1 câu ngắn (5s), chuyền micro nhanh. Xen nhạc nền vui tươi.",
          thoi_gian: "5 phút",
        },
        loi_dan_dat_mc: "Trưởng thành không chỉ là nghề nghiệp, mà còn là thái độ sống, trách nhiệm, tình yêu thương.",
      },
      phan_chinh: {
        thoi_gian: "20 phút",
        loai: "kich",
        kich_ban: {
          ten: "Khi tôi trưởng thành",
          chu_de: "Học sinh đối mặt với biến cố gia đình và hành trình trưởng thành",
          khoi: 12,
          boi_canh:
            "Gia đình của M bề ngoài hạnh phúc nhưng thực chất ba mẹ đang mâu thuẫn. Một ngày M phát hiện sự thật, bị sốc tâm lý ảnh hưởng đến học tập.",
          nhan_vat: ["M (nam sinh chính)", "Ba", "Mẹ", "GVCN", "Thầy Hiệu trưởng", "Lớp trưởng", "Bạn học"],
          phan_canh: [
            {
              ten: "Mở đầu - Phát hiện sự thật",
              noi_dung: "M chứng kiến ba mẹ cãi nhau, phát hiện họ sắp ly hôn",
              hanh_dong: [
                "Cảnh ba mẹ cãi nhau (diễn không thoại, lồng tiếng)",
                "M đứng ngoài cửa, nghe thấy tất cả",
                "M sốc, đập đồ, ném sách vở thể hiện tâm trạng",
              ],
            },
            {
              ten: "Buổi học cảnh 1 - Sa sút",
              noi_dung: "M sa sút học tập, gian lận trong kiểm tra, bị bắt chơi game",
              hanh_dong: [
                "Tiết kiểm tra: M dùng điện thoại tra tài liệu, bị phát hiện, hủy bài",
                "GVCN khiển trách trước lớp về thái độ học tập",
                "M rủ bạn chơi game, thầy Hiệu trưởng bắt gặp, tịch thu điện thoại",
                "GVCN gọi báo cáo phụ huynh",
              ],
            },
            {
              ten: "Khi về nhà - Suy ngẫm",
              noi_dung: "M lo lắng, mẹ khuyên nhủ, M nhìn lại bằng khen cũ và quyết tâm thay đổi",
              hanh_dong: [
                "Mẹ đang lau bằng khen của M",
                "M ngỏ lời về việc GVCN sẽ báo cáo",
                "Mẹ thất vọng, buồn và khuyên nhủ M",
                "M ở lại một mình, nhìn bằng khen, quyết tâm thay đổi",
              ],
            },
            {
              ten: "Buổi học cảnh 2 - Thích ứng",
              noi_dung: "Trường cấm điện thoại, lớp hoang mang nhưng dần thích nghi",
              hanh_dong: [
                "GVCN thông báo cấm điện thoại",
                "Cả lớp tranh luận, lớp trưởng giải thích và khuyên chấp nhận",
                "Ra chơi: Tổ chức trò chơi dân gian (đông tây nam bắc, nhảy dây)",
                "Học sinh nhảy một đoạn nhạc vui vẻ",
              ],
            },
            {
              ten: "Buổi học cảnh 3 - Trưởng thành",
              noi_dung: "Sau một thời gian, M cải thiện học tập, lớp gắn kết hơn",
              hanh_dong: [
                "M quyết tâm học tập, đạt thành tích cao được khen",
                "Lớp được cải thiện thành tích, gắn kết với nhau",
                "M biết ơn nhà trường và GVCN",
                "Học sinh ghi mong ước vào giấy, gấp máy bay",
                "Chụp ảnh kỷ niệm, phóng máy bay ước mơ",
              ],
            },
          ],
          thong_diep:
            "Trưởng thành là khi chúng ta biết đối mặt với khó khăn, chấp nhận quy định và thay đổi bản thân theo hướng tích cực.",
        },
      },
      ket_thuc: {
        thoi_gian: "15-18 phút",
        cau_hoi_tuong_tac: [
          {
            cau_hoi: "Trưởng thành với bạn là gì?",
            muc_do: "mo",
            goi_y: "Mời học sinh chia sẻ ngắn, nhạc nền nhẹ nhàng",
          },
        ],
        thong_diep_ket_thuc: "Trưởng thành là khi chúng ta dám ước mơ và dám bước đi để biến ước mơ thành hiện thực.",
      },
    },
    kinh_phi_du_kien: {
      bang_ngoai_khoa: 250000,
      dao_cu_phan_thuong: 300000,
      tong: 550000,
    },
  },

  // Chủ đề 2 - Khối 12: Tự tin thay đổi bản thân
  {
    ma: "NK-12-CD2",
    ten_chu_de: "Tự tin thay đổi bản thân",
    khoi: 12,
    thoi_luong: "45 phút (7h-7h45)",
    muc_tieu: {
      yeu_cau_can_dat: [
        "Nhận biết tầm quan trọng của đam mê trong cuộc sống và học tập",
        "Biết cách tự khám phá, xác định đam mê và sở trường của bản thân",
        "Có ý thức xây dựng kế hoạch, kiên trì thực hiện đam mê bất chấp khó khăn",
        "Thể hiện thái độ tích cực, biết vượt qua sự tự ti, nỗi sợ",
      ],
      nang_luc: ["Giao tiếp và hợp tác", "Giải quyết vấn đề và sáng tạo", "Tự chủ và tự học"],
      pham_chat: [
        "Kiên trì: Không dễ nản lòng trước khó khăn",
        "Tự tin: Tin tưởng vào khả năng và quyết định của bản thân",
        "Trách nhiệm: Chịu trách nhiệm với kế hoạch và hành động",
        "Cầu tiến: Luôn học hỏi, sẵn sàng đón nhận góp ý",
        "Sáng tạo: Dám nghĩ, dám làm để phát triển đam mê",
      ],
    },
    cau_truc: {
      khoi_dong: {
        thoi_gian: "5-7 phút",
        hoat_dong: {
          ten: "Chia sẻ nỗi sợ - Khám phá sự tự tin",
          muc_dich: "Khơi dậy không khí tham gia, dẫn dắt chủ đề về tự tin",
          cach_choi: "Học sinh chia sẻ ngắn về một nỗi sợ của mình và cách đã vượt qua hoặc muốn vượt qua.",
          thoi_gian: "5 phút",
        },
        loi_dan_dat_mc: "Mỗi người đều có nỗi sợ riêng, điều quan trọng là cách chúng ta đối mặt và vượt qua.",
      },
      phan_chinh: {
        thoi_gian: "20 phút",
        loai: "kich",
        kich_ban: {
          ten: "Tự tin thay đổi bản thân",
          chu_de: "Học sinh tự ti vượt qua nỗi sợ để theo đuổi đam mê ca hát",
          khoi: 12,
          boi_canh:
            "Vi là học sinh có giọng hát hay nhưng thiếu tự tin, sợ đám đông. Được bạn bè động viên, Vi dũng cảm tham gia cuộc thi tài năng.",
          nhan_vat: ["Vi (nữ sinh chính)", "Sang", "Khôi", "Trinh", "Huy", "Bình", "Giáo viên", "Phụng (dẫn truyện)"],
          phan_canh: [
            {
              ten: "Phân cảnh 1: Bối cảnh học đường",
              noi_dung: "Giới thiệu về nỗi sợ hãi, sự ngại ngùng trong học sinh",
              hanh_dong: [
                "Phụng mở lời về nỗi sợ hãi, sự ngại ngùng",
                "Tiếng chuông vào lớp, GV giảng bài",
                "Các học sinh trao đổi nhiệt tình",
                "Vi e dè không dám giơ tay, thể hiện sự thiếu tự tin",
              ],
            },
            {
              ten: "Phân cảnh 2: Khuyến khích tham gia cuộc thi",
              noi_dung: "Bạn bè động viên Vi đăng ký thi tài năng",
              hanh_dong: [
                "Khôi động viên Vi đăng ký thi tài năng vì đam mê hát",
                "Vi ngần ngại vì sợ đám đông, thiếu tự tin về giọng hát",
                "Sang thuyết phục nhẹ nhàng",
                "Vi cuối cùng đồng ý thử sức",
              ],
            },
            {
              ten: "Phân cảnh 3: Chuẩn bị và sự ủng hộ",
              noi_dung: "Lớp học với bảng thông báo cuộc thi, bạn bè động viên",
              hanh_dong: [
                "Trinh, Huy trêu chọc nhưng sau thừa nhận sự dũng cảm của Vi",
                "Sang và Khôi động viên, hát lấy cảm hứng cho Vi",
                "Vi tự nói với mình qua gương, nhấn mạnh sự cố gắng",
              ],
            },
            {
              ten: "Phân cảnh 4: Lo lắng trước sân khấu",
              noi_dung: "Vi ở hậu trường, lo lắng, được bạn bè động viên",
              hanh_dong: [
                "Vi ở hậu trường, run sợ",
                "Sang, Khôi động viên, hỗ trợ tinh thần",
                "Vi hít sâu, lấy lại sự tự tin bước lên sân khấu",
              ],
            },
            {
              ten: "Phân cảnh 5: Trình diễn trên sân khấu",
              noi_dung: "Vi trình bày bài hát với sự tự tin",
              hanh_dong: [
                "Vi trình bày bài hát 'Người gieo mầm xanh' tự tin",
                "Khán giả cổ vũ nhiệt tình",
                "Bạn bè chúc mừng, tạo không khí ấm áp",
              ],
            },
            {
              ten: "Phân cảnh 6: Kết thúc và thông điệp",
              noi_dung: "Kết luận vở kịch với thông điệp về sự tự tin",
              hanh_dong: [
                "Phụng kết luận: Dù ai cũng có lúc thiếu tự tin, điều quan trọng là dám đứng lên và thay đổi",
                "Mời khán giả vào phần giao lưu hỏi đáp",
              ],
            },
          ],
          thong_diep:
            "Dù ai cũng có lúc thiếu tự tin, điều quan trọng là dám đứng lên và thay đổi. Tự tin được xây dựng bằng sự dũng cảm đối diện thử thách và có sự hỗ trợ tích cực của bạn bè.",
        },
      },
      ket_thuc: {
        thoi_gian: "15-18 phút",
        cau_hoi_tuong_tac: [
          {
            cau_hoi: "Điều gì đã khiến Vi lưỡng lự khi được khuyến khích tham gia cuộc thi tài năng?",
            dap_an: "C. Nỗi sợ bị người khác cười chê, thiếu tự tin về giọng hát",
            muc_do: "de",
          },
          {
            cau_hoi: "'Tự tin' có nghĩa là gì?",
            dap_an:
              "B. Dám thể hiện bản thân dù có thể sai - Tự tin không phải hoàn hảo, mà là dám làm, dám sai và học hỏi.",
            muc_do: "trung_binh",
          },
          {
            cau_hoi: "Thông điệp quan trọng qua hành trình thay đổi bản thân trong vở kịch là gì?",
            dap_an: "B. Sự tự tin được xây dựng bằng dũng cảm đối diện thử thách và có sự hỗ trợ tích cực của bạn bè",
            muc_do: "trung_binh",
          },
          {
            cau_hoi: "Để thay đổi bản thân, điều quan trọng nhất là gì?",
            dap_an: "B. Biết rõ điểm mạnh và điểm yếu của mình",
            muc_do: "trung_binh",
          },
          {
            cau_hoi: "Cách rèn luyện sự tự tin hiệu quả nhất là gì?",
            dap_an: "D. Chuẩn bị kỹ và luyện tập thường xuyên",
            muc_do: "de",
          },
          {
            cau_hoi:
              "Theo bạn, thay đổi bản thân có phải là phủ nhận con người hiện tại không, hay là một cách yêu bản thân hơn?",
            muc_do: "mo",
            goi_y: "Câu hỏi mở để học sinh thảo luận, chia sẻ ý kiến",
          },
        ],
        thong_diep_ket_thuc:
          "Hãy tin vào bản thân và dũng cảm theo đuổi đam mê. Tự tin được xây dựng mỗi ngày bằng những bước đi nhỏ.",
      },
    },
    kinh_phi_du_kien: {
      bang_ngoai_khoa: 250000,
      dao_cu_phan_thuong: 300000,
      tong: 550000,
    },
  },

  // Chủ đề 3 - Khối 11: Bùi Thị Xuân – Hành trình vượt thời gian
  {
    ma: "NK-11-CD3",
    ten_chu_de: "Bùi Thị Xuân – Hành trình vượt thời gian",
    khoi: 11,
    thoi_luong: "45 phút (7h-7h45)",
    muc_tieu: {
      yeu_cau_can_dat: [
        "Tìm hiểu về nữ tướng Bùi Thị Xuân – người con ưu tú của quê hương Bình Định",
        "Tăng cường kiến thức, phát huy về truyền thống nhà trường",
        "Hợp tác với bạn để cùng xây dựng và thực hiện các hoạt động phát triển nhà trường",
        "Biết cách phát triển mối quan hệ tốt đẹp với thầy cô, bạn bè",
      ],
      nang_luc: [
        "Giao tiếp và hợp tác: sử dụng ngôn ngữ kết hợp với hình ảnh để trình bày",
        "Giải quyết vấn đề và sáng tạo: phối hợp làm việc nhóm",
        "Làm chủ và kiểm soát các mối quan hệ",
        "Đánh giá hiệu quả hoạt động phát huy truyền thống",
      ],
      pham_chat: ["Tự giác, trách nhiệm, chăm chỉ", "Yêu nước, tự hào về truyền thống dân tộc"],
    },
    cau_truc: {
      khoi_dong: {
        thoi_gian: "5 phút",
        hoat_dong: {
          ten: "Ra mắt đội chơi – Chúng tôi là ai?",
          muc_dich: "Tạo không khí hào hứng, giới thiệu các đội thi",
          cach_choi:
            "Mỗi đội tự đặt tên, slogan, giới thiệu thành viên trong 30 giây/đội. Tiêu chí: Sáng tạo – Ấn tượng – Tự tin.",
          thoi_gian: "5 phút",
        },
        loi_dan_dat_mc:
          "Hôm nay chúng ta sẽ cùng nhau tìm hiểu về nữ tướng Bùi Thị Xuân - người phụ nữ thép và truyền thống trường ta.",
      },
      phan_chinh: {
        thoi_gian: "30 phút",
        loai: "cuoc_thi",
        cuoc_thi: {
          ten: "Cuộc thi kiến thức về Bùi Thị Xuân và truyền thống nhà trường",
          hinh_thuc: "Chia 4 đội (mỗi lớp cử 1 đại diện), thi 2 vòng",
          vong_1: {
            ten: "Tìm hiểu nữ tướng Bùi Thị Xuân – Người phụ nữ thép",
            so_cau: 10,
            hinh_thuc: "Trắc nghiệm, ném bóng vào rổ dành quyền trả lời",
            diem: "Đúng +10, Sai -5, Không trả lời 0",
          },
          vong_2: {
            ten: "Tìm hiểu về trường – Tôi yêu ngôi trường này",
            so_cau: 10,
            hinh_thuc: "Giơ bảng đáp án",
            diem: "Đúng +10, Sai -5",
          },
        },
      },
      ket_thuc: {
        thoi_gian: "10 phút",
        cau_hoi_tuong_tac: [],
        thong_diep_ket_thuc:
          "Hãy tự hào về truyền thống nhà trường mang tên nữ tướng Bùi Thị Xuân và tiếp tục phát huy tinh thần kiên cường, bất khuất của bà.",
      },
    },
    kinh_phi_du_kien: {
      bang_ngoai_khoa: 230000,
      dao_cu_phan_thuong: 300000,
      tong: 530000,
    },
  },

  // Chủ đề 4 - Khối 12: Trách nhiệm với gia đình
  {
    ma: "NK-12-CD4",
    ten_chu_de: "Trách nhiệm với gia đình - Gắn kết yêu thương",
    khoi: 12,
    thoi_luong: "45 phút (7h-7h45)",
    muc_tieu: {
      yeu_cau_can_dat: [
        "Nhận thức vai trò, trách nhiệm của bản thân trong việc xây dựng hạnh phúc gia đình",
        "Nhận diện những biểu hiện của sự vô tâm và biết cách điều chỉnh hành vi",
        "Biết cách hóa giải mâu thuẫn, xung đột trong gia đình qua tình huống giả định",
        "Xác định các giá trị gia đình cần xây dựng (yêu thương, trách nhiệm, tôn trọng)",
      ],
      nang_luc: [
        "Giao tiếp và hợp tác: Phối hợp làm việc nhóm để diễn xuất, xử lý tình huống",
        "Giải quyết vấn đề và sáng tạo: Xử lý tình huống mâu thuẫn gia đình khéo léo",
        "Thích ứng với cuộc sống: Chủ động tham gia tổ chức cuộc sống gia đình",
      ],
      pham_chat: [
        "Trách nhiệm: Có ý thức tự giác, chăm chỉ",
        "Nhân ái: Yêu thương, tôn trọng và quan tâm đến ông bà, cha mẹ, anh chị em",
      ],
    },
    cau_truc: {
      khoi_dong: {
        thoi_gian: "5 phút",
        hoat_dong: {
          ten: "Giai điệu yêu thương",
          muc_dich: "Tạo không khí hào hứng và dẫn dắt vào chủ đề gia đình",
          cach_choi:
            "MC phát đoạn nhạc ngắn các bài hát về gia đình (Nhà là nơi, Ba kể con nghe, Mẹ yêu...), học sinh giơ tay đoán tên bài hát.",
          thoi_gian: "5 phút",
          vat_dung: ["Loa", "File nhạc các bài hát về gia đình"],
        },
        loi_dan_dat_mc:
          "Chúng ta vừa nghe những giai điệu rất ấm áp. Nhưng thực tế, không phải lúc nào gia đình cũng êm ấm. Đôi khi sự vô tâm của chúng ta lại làm tổn thương những người thân yêu nhất. Để hiểu rõ hơn, xin mời thầy cô và các bạn đến với phiên tòa đặc biệt ngày hôm nay: Phiên Tòa Yêu Thương.",
      },
      phan_chinh: {
        thoi_gian: "22-25 phút",
        loai: "kich",
        kich_ban: {
          ten: "Phiên Tòa Yêu Thương",
          chu_de: "Xét xử bị cáo Hưng về tội 'Vô tâm' với gia đình",
          khoi: 12,
          boi_canh:
            "Tòa án gia đình xét xử bị cáo Hưng về tội 'Vô tâm'. Các thành viên gia đình đứng ra làm nhân chứng tố cáo những hành vi vô tâm của Hưng.",
          nhan_vat: [
            "Thẩm phán (Bố)",
            "Luật sư bào chữa (Bạn)",
            "Bị cáo (Hưng)",
            "Nhân chứng 1 (Mẹ)",
            "Nhân chứng 2 (Em gái)",
            "Nhân chứng 3 (Ông nội)",
            "Nhân chứng 4 (Chị gái)",
            "Nhân chứng 5 (Hàng xóm)",
          ],
          phan_canh: [
            {
              ten: "Mẹ tố cáo",
              noi_dung: "Mẹ tố Hưng hứa học chăm nhưng đi chơi, mẹ ốm thì chỉ nói suông rồi chơi game",
              hanh_dong: [
                "Mẹ đứng lên trình bày",
                "Flashback cảnh Hưng hứa học nhưng đi chơi",
                "Mẹ ốm nằm trên giường, Hưng chỉ hỏi qua loa rồi chơi game",
              ],
              loi_thoai_mau: [
                "Mẹ: 'Thưa tòa, con trai tôi hứa sẽ học chăm nhưng lại đi chơi. Khi tôi ốm, con chỉ hỏi 'Mẹ ơi mẹ uống thuốc chưa?' rồi tiếp tục chơi game...'",
              ],
            },
            {
              ten: "Em gái tố cáo",
              noi_dung: "Em gái tố Hưng thất hứa đi xem phim, chê bai em điểm kém, thờ ơ khi em buồn",
              hanh_dong: [
                "Em gái khóc kể về việc anh thất hứa",
                "Flashback cảnh Hưng chê em điểm kém",
                "Em buồn nhưng Hưng không quan tâm",
              ],
            },
            {
              ten: "Ông nội tố cáo",
              noi_dung: "Ông nội tố Hưng không trả lời tin nhắn, vô tâm khác hẳn hồi bé",
              hanh_dong: [
                "Ông nội run run đứng lên",
                "Cho xem điện thoại với nhiều tin nhắn chưa đọc",
                "So sánh với hình ảnh Hưng ngày nhỏ hay quấn ông",
              ],
            },
            {
              ten: "Chị gái tố cáo",
              noi_dung: "Chị gái tố Hưng làm vỡ bình hoa rồi đổ lỗi, vay tiền không trả",
              hanh_dong: [
                "Chị gái đưa bằng chứng",
                "Flashback cảnh Hưng đổ lỗi cho em",
                "Hưng vay tiền rồi 'quên' trả",
              ],
            },
            {
              ten: "Luật sư bào chữa",
              noi_dung: "Luật sư cố gắng bào chữa nhưng bị các nhân chứng phản bác",
              hanh_dong: [
                "Luật sư đưa ra lý do biện hộ",
                "Các nhân chứng phản bác bằng lý lẽ sắc bén",
                "Luật sư hết cách bào chữa",
              ],
            },
            {
              ten: "Hưng nhận lỗi và kết án",
              noi_dung: "Hưng nhận lỗi, hứa thay đổi. Thẩm phán tuyên án đặc biệt.",
              hanh_dong: [
                "Hưng đứng dậy, xúc động nhận lỗi",
                "Hưng tặng quà và xin lỗi từng người",
                "Thẩm phán Bố tuyên án: 'Hưng có tội yêu thương chưa đủ - Hình phạt là phải dành thời gian chất lượng cho gia đình'",
              ],
              loi_thoai_mau: [
                "Hưng: 'Con xin lỗi. Con đã quá vô tâm mà không nhận ra. Con hứa sẽ thay đổi.'",
                "Thẩm phán Bố: 'Tòa tuyên bố: Bị cáo Hưng có tội yêu thương chưa đủ. Hình phạt: Dành thời gian chất lượng cho gia đình mỗi ngày!'",
              ],
            },
          ],
          thong_diep:
            "Gia đình là nơi bao dung nhưng đừng lợi dụng sự bao dung đó để vô tâm. Hãy yêu thương khi còn có thể.",
        },
      },
      ket_thuc: {
        thoi_gian: "10-12 phút",
        cau_hoi_tuong_tac: [
          {
            cau_hoi: "Trong vở kịch, bị cáo Hưng bị 'Tòa án gia đình' kiện vì tội danh gì?",
            dap_an: "Tội vô tâm, thờ ơ với người thân",
            muc_do: "de",
          },
          {
            cau_hoi: "Chi tiết nào trong vở kịch khiến bạn ấn tượng nhất về sự 'lệch pha' giữa Hưng và gia đình?",
            muc_do: "trung_binh",
            goi_y:
              "Lúc ga-lăng với bạn gái nhưng phóng xe bỏ mặc mẹ; lúc rep tin nhắn bạn gái nhanh nhưng bơ tin nhắn ông nội",
          },
          {
            cau_hoi:
              "Trong kịch bản, khi làm vỡ bình hoa, Hưng đã đổ lỗi cho em. Theo nội dung bài học về 'Trách nhiệm', nếu là Hưng, em nên xử lý tình huống đó như thế nào?",
            dap_an:
              "Dũng cảm nhận lỗi, xin lỗi mẹ và tìm cách khắc phục (mua mới hoặc dán lại), không đổ lỗi cho người khác",
            muc_do: "kho",
          },
        ],
        thong_diep_ket_thuc:
          "Đừng để sự bận rộn hay những niềm vui bên ngoài làm bạn quên mất đường về nhà. Hãy yêu thương khi còn có thể.",
      },
    },
    kinh_phi_du_kien: {
      bang_ngoai_khoa: 250000,
      dao_cu_phan_thuong: 300000,
      tong: 550000,
    },
  },
]

// ==========================================
// HƯỚNG DẪN TẠO KỊCH BẢN NGOẠI KHÓA
// ==========================================

export const HUONG_DAN_TAO_KICH_BAN = {
  nguyen_tac_chung: [
    "Kịch bản phải gắn với chủ đề bài học, có tính giáo dục cao",
    "Nội dung gần gũi với đời sống học sinh, dễ đồng cảm",
    "Có tình huống mâu thuẫn, cao trào và giải quyết hợp lý",
    "Lồng ghép thông điệp giáo dục tự nhiên, không khô khan",
    "Tạo cơ hội cho học sinh thể hiện tài năng diễn xuất",
  ],
  cau_truc_tieu_chuan: {
    tong_thoi_gian: "45 phút",
    khoi_dong: {
      thoi_gian: "5-7 phút",
      muc_dich: "Tạo không khí, dẫn dắt chủ đề",
      goi_y: ["Trò chơi âm nhạc", "Chia sẻ nhanh", "Đố vui", "Khởi động nhẹ nhàng"],
    },
    phan_chinh: {
      thoi_gian: "20-25 phút",
      loai_hinh: ["Tiểu phẩm kịch", "Cuộc thi kiến thức", "Talkshow", "Trò chơi lớn"],
      luu_y: "Nếu là kịch, chia thành 4-6 phân cảnh rõ ràng",
    },
    ket_thuc: {
      thoi_gian: "10-15 phút",
      noi_dung: ["Câu hỏi tương tác (3-6 câu)", "Thông điệp kết thúc", "Cảm ơn đội ngũ thực hiện"],
    },
  },
  loai_kich_ban_hieu_qua: [
    {
      ten: "Phiên tòa gia đình",
      mo_ta: "Xét xử một 'tội danh' liên quan đến chủ đề (vô tâm, ích kỷ, thiếu trách nhiệm...)",
      phu_hop_voi: ["Trách nhiệm với gia đình", "Đạo đức học đường", "Kỷ luật bản thân"],
    },
    {
      ten: "Hành trình thay đổi",
      mo_ta: "Nhân vật chính gặp khó khăn, được động viên, vượt qua và thành công",
      phu_hop_voi: ["Tự tin", "Kiên trì", "Đam mê", "Vượt qua thử thách"],
    },
    {
      ten: "Biến cố và trưởng thành",
      mo_ta: "Nhân vật đối mặt với biến cố lớn (gia đình, học tập), dần trưởng thành",
      phu_hop_voi: ["Trưởng thành", "Thích ứng", "Giải quyết vấn đề"],
    },
    {
      ten: "Cuộc thi kiến thức",
      mo_ta: "Chia đội, thi đấu qua các vòng với câu hỏi về chủ đề",
      phu_hop_voi: ["Tìm hiểu truyền thống", "Kiến thức lịch sử", "Nghề nghiệp"],
    },
  ],
  ky_thuat_kich_san_khau: {
    am_thanh: [
      "Nhạc nền phù hợp từng phân cảnh",
      "Hiệu ứng âm thanh (chuông trường, tiếng cửa...)",
      "Micro không dây cho diễn viên",
    ],
    san_khau: ["Bảng tên chương trình (hamlet)", "Đạo cụ đơn giản, dễ di chuyển", "Vùng diễn rõ ràng dưới sân cờ"],
    dien_vien: ["Chọn học sinh có năng khiếu diễn xuất", "Tập dượt ít nhất 2-3 lần", "Có người nhắc thoại dự phòng"],
  },
}

// ==========================================
// CẤU TRÚC VĂN BẢN HÀNH CHÍNH CHUẨN
// ==========================================

export const CAU_TRUC_VAN_BAN_HANH_CHINH = {
  tieu_de: {
    don_vi_cap_tren: "SỞ GD&ĐT {TEN_TINH}",
    don_vi: "TRƯỜNG THPT {TEN_TRUONG}",
    to_chuyen_mon: "TỔ HĐTN-HN&GDĐP",
    so_ke_hoach: "Số: {SO}/KHNK-HĐTN-HN",
  },
  quoc_hieu: {
    dong_1: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM",
    dong_2: "Độc lập – Tự do – Hạnh phúc",
  },
  dia_danh_ngay_thang: "{DIA_DANH}, ngày {NGAY} tháng {THANG} năm {NAM}",
  tieu_de_ke_hoach: "KẾ HOẠCH\nTổ chức hoạt động ngoại khóa {TEN_CHU_DE}",
  cac_muc: [
    { so: "I", ten: "MỤC TIÊU", bat_buoc: true },
    { so: "II", ten: "NỘI DUNG VÀ HÌNH THỨC TỔ CHỨC", bat_buoc: true },
    { so: "III", ten: "KINH PHÍ THỰC HIỆN", bat_buoc: false },
    { so: "IV", ten: "TỔ CHỨC THỰC HIỆN", bat_buoc: true },
  ],
  noi_nhan: {
    tieu_de: "Nơi nhận:",
    danh_sach: ["- BGH (để b/c);", "- Tổ HĐTN-HN (để p/h t/h);", "- Lớp {LOP} (để t/h);", "- Lưu: VT."],
  },
  chu_ky: {
    chuc_danh: "TỔ TRƯỞNG",
    ghi_chu: "(Ký và ghi rõ họ tên)",
  },
}

// ==========================================
// MẪU KINH PHÍ THỰC HIỆN
// ==========================================

export const MAU_KINH_PHI = {
  cac_muc_chi: [
    {
      ten: "In bảng ngoại khóa (hamlet)",
      mo_ta: "Banner, backdrop, bảng tên chương trình",
      kinh_phi_du_kien: "200.000 - 300.000đ",
    },
    {
      ten: "Bồi dưỡng/Quà học sinh tham gia",
      mo_ta: "Phần thưởng cho diễn viên, đội thắng cuộc",
      kinh_phi_du_kien: "200.000 - 400.000đ",
    },
    {
      ten: "Đạo cụ, trang phục",
      mo_ta: "Trang phục nhân vật, đạo cụ sân khấu",
      kinh_phi_du_kien: "100.000 - 200.000đ",
    },
    {
      ten: "Âm thanh, ánh sáng",
      mo_ta: "Thuê thêm thiết bị nếu cần",
      kinh_phi_du_kien: "0 - 200.000đ",
    },
  ],
  tong_du_kien: "500.000 - 1.100.000đ",
  ghi_chu: "Kinh phí trích từ nguồn hoạt động của Tổ/Trường",
}

// ==========================================
// BỘ CÂU HỎI TƯƠNG TÁC SAU KỊCH
// ==========================================

export const CAU_HOI_TUONG_TAC_SAU_KICH: Record<
  string,
  {
    chu_de: string
    cau_hoi: Array<{
      loai: "trac_nghiem" | "tu_luan" | "thao_luan"
      noi_dung: string
      dap_an?: string
      giai_thich?: string
    }>
  }
> = {
  truong_thanh: {
    chu_de: "Khi tôi trưởng thành",
    cau_hoi: [
      {
        loai: "trac_nghiem",
        noi_dung: "Theo em, đâu là biểu hiện quan trọng nhất của sự trưởng thành?",
        dap_an: "Biết chịu trách nhiệm cho hành động của mình",
        giai_thich: "Trưởng thành không chỉ về tuổi tác mà còn là khả năng nhận trách nhiệm",
      },
      {
        loai: "trac_nghiem",
        noi_dung: "Trong tiểu phẩm, nhân vật chính đã mắc sai lầm gì?",
        dap_an: "Không lắng nghe lời khuyên của cha mẹ, vi phạm kỷ luật",
      },
      {
        loai: "tu_luan",
        noi_dung: "Em học được bài học gì từ tiểu phẩm vừa xem?",
      },
      {
        loai: "tu_luan",
        noi_dung: "Nếu là nhân vật chính, em sẽ xử lý tình huống như thế nào?",
      },
      {
        loai: "thao_luan",
        noi_dung: "Làm thế nào để cân bằng giữa ước mơ cá nhân và kỳ vọng của gia đình?",
      },
      {
        loai: "thao_luan",
        noi_dung: "Theo em, trưởng thành có nghĩa là không còn mắc sai lầm không? Vì sao?",
      },
    ],
  },
  tu_tin: {
    chu_de: "Tự tin thay đổi bản thân",
    cau_hoi: [
      {
        loai: "trac_nghiem",
        noi_dung: "Nguyên nhân khiến nhân vật Minh trở nên tự ti là gì?",
        dap_an: "Áp lực từ việc so sánh với người khác và thất bại liên tiếp",
      },
      {
        loai: "trac_nghiem",
        noi_dung: "Ai là người đã giúp Minh thay đổi và lấy lại tự tin?",
        dap_an: "Cô giáo và nhóm bạn thân",
      },
      {
        loai: "tu_luan",
        noi_dung: "Em có từng trải qua giai đoạn mất tự tin không? Em đã vượt qua như thế nào?",
      },
      {
        loai: "tu_luan",
        noi_dung: "Điều gì giúp em tự tin nhất khi đứng trước đám đông?",
      },
      {
        loai: "thao_luan",
        noi_dung: "Tự tin và tự cao khác nhau như thế nào?",
      },
      {
        loai: "thao_luan",
        noi_dung: "'Dám sai và học hỏi' - Em hiểu câu này như thế nào?",
      },
    ],
  },
  truyen_thong: {
    chu_de: "Truyền thống nhà trường (Bùi Thị Xuân)",
    cau_hoi: [
      {
        loai: "trac_nghiem",
        noi_dung: "Nữ tướng Bùi Thị Xuân sinh vào năm nào?",
        dap_an: "1752",
      },
      {
        loai: "trac_nghiem",
        noi_dung: "Bùi Thị Xuân nổi tiếng với võ công gì?",
        dap_an: "Song kiếm và thuần phục voi chiến",
      },
      {
        loai: "trac_nghiem",
        noi_dung: "Trường THPT Bùi Thị Xuân được thành lập năm nào?",
        dap_an: "(Tùy theo trường)",
      },
      {
        loai: "tu_luan",
        noi_dung: "Em tự hào điều gì nhất về truyền thống của trường ta?",
      },
      {
        loai: "thao_luan",
        noi_dung: "Làm thế nào để học sinh ngày nay có thể phát huy tinh thần của nữ tướng Bùi Thị Xuân?",
      },
    ],
  },
  trach_nhiem_gia_dinh: {
    chu_de: "Trách nhiệm với gia đình - Phiên Tòa Yêu Thương",
    cau_hoi: [
      {
        loai: "trac_nghiem",
        noi_dung: "'Tội danh' mà bị cáo trong phiên tòa bị buộc là gì?",
        dap_an: "Vô tâm với gia đình",
      },
      {
        loai: "trac_nghiem",
        noi_dung: "Theo phiên tòa, ai chịu trách nhiệm chính cho sự vô tâm của con cái?",
        dap_an: "Cả cha mẹ lẫn con cái đều có phần trách nhiệm",
      },
      {
        loai: "tu_luan",
        noi_dung: "Lần cuối em nói 'Con yêu bố mẹ' là khi nào?",
      },
      {
        loai: "tu_luan",
        noi_dung: "Điều gì khiến em cảm thấy có lỗi với gia đình nhất?",
      },
      {
        loai: "thao_luan",
        noi_dung: "'Đừng để bận rộn làm quên đường về nhà' - Câu này có ý nghĩa gì với em?",
      },
      {
        loai: "thao_luan",
        noi_dung: "Trách nhiệm với gia đình có mâu thuẫn với việc theo đuổi ước mơ cá nhân không?",
      },
    ],
  },
}

// ==========================================
// MẪU THÔNG ĐIỆP KẾT THÚC
// ==========================================

export const THONG_DIEP_KET_THUC: Record<string, string[]> = {
  truong_thanh: [
    "Trưởng thành là dám ước mơ và có đủ can đảm bước đi trên con đường mình chọn.",
    "Hãy sống có trách nhiệm, biết lắng nghe và không ngừng hoàn thiện bản thân.",
    "Mỗi sai lầm là một bài học, mỗi thử thách là cơ hội để trưởng thành.",
  ],
  tu_tin: [
    "Tự tin là dám làm, dám sai và dám học hỏi từ những thất bại.",
    "Bạn không cần phải hoàn hảo, chỉ cần là phiên bản tốt nhất của chính mình.",
    "Hãy tin vào bản thân, vì nếu bạn không tin, ai sẽ tin bạn?",
  ],
  truyen_thong: [
    "Tự hào truyền thống, kiến tạo tương lai - Đó là sứ mệnh của mỗi học sinh.",
    "Tôi yêu ngôi trường này - nơi tôi được học, được lớn và được là chính mình.",
    "Hãy là những người kế thừa xứng đáng của tinh thần Bùi Thị Xuân.",
  ],
  trach_nhiem_gia_dinh: [
    "Đừng để bận rộn làm quên đường về nhà, đừng để thành công làm phai nhạt tình thân.",
    "Gia đình là nơi yêu thương bắt đầu và không bao giờ kết thúc.",
    "Hãy nói 'Con yêu bố mẹ' khi còn có thể, đừng để thành nỗi hối tiếc.",
  ],
  cong_dong: [
    "Một người cho cộng đồng, cộng đồng vì mọi người.",
    "Hãy là ngọn lửa nhỏ thắp sáng cộng đồng, không phải kẻ than phiền trong bóng tối.",
  ],
  moi_truong: [
    "Trái Đất không phải di sản từ cha ông, mà là vay mượn từ con cháu.",
    "Mỗi hành động nhỏ hôm nay, tạo nên thay đổi lớn ngày mai.",
  ],
  nghe_nghiep: [
    "Chọn nghề phù hợp với mình, không phải nghề người khác muốn bạn chọn.",
    "Thành công không phải đích đến, mà là hành trình theo đuổi đam mê.",
  ],
}

// ==========================================
// HÀM TRUY XUẤT VÀ GỢI Ý
// ==========================================

/**
 * Lấy mẫu ngoại khóa theo khối và chủ đề
 */
export function getMauNgoaiKhoa(khoi: number, chuDe?: string): MauNgoaiKhoa | undefined {
  return MAU_NGOAI_KHOA_THANH_CONG.find(
    (m) => m.khoi === khoi && (!chuDe || m.ten_chu_de.toLowerCase().includes(chuDe.toLowerCase())),
  )
}

/**
 * Lấy tất cả mẫu ngoại khóa theo khối
 */
export function getMauNgoaiKhoaTheoKhoi(khoi: number): MauNgoaiKhoa[] {
  return MAU_NGOAI_KHOA_THANH_CONG.filter((m) => m.khoi === khoi)
}

/**
 * Gợi ý loại kịch bản phù hợp theo chủ đề
 */
export function goiYLoaiKichBan(chuDe: string): (typeof HUONG_DAN_TAO_KICH_BAN.loai_kich_ban_hieu_qua)[0][] {
  const tuKhoa = chuDe.toLowerCase()
  return HUONG_DAN_TAO_KICH_BAN.loai_kich_ban_hieu_qua.filter((loai) =>
    loai.phu_hop_voi.some((topic) => tuKhoa.includes(topic.toLowerCase()) || topic.toLowerCase().includes(tuKhoa)),
  )
}

/**
 * Tạo context cho AI khi sinh kế hoạch ngoại khóa
 */
export function taoContextNgoaiKhoaChiTiet(khoi: number, tenChuDe: string): string {
  const mauThamKhao = getMauNgoaiKhoaTheoKhoi(khoi)
  const goiY = goiYLoaiKichBan(tenChuDe)

  let context = `
## MẪU KỊCH BẢN NGOẠI KHÓA ĐÃ THỰC HIỆN THÀNH CÔNG (Phong cách: Văn hóa sân khấu kịch giữa sân trường)

### CẤU TRÚC TIÊU CHUẨN:
- Tổng thời gian: 45 phút
- Khởi động: 5-7 phút (trò chơi dẫn dắt)
- Phần chính: 20-25 phút (tiểu phẩm kịch hoặc cuộc thi)
- Kết thúc: 10-15 phút (câu hỏi tương tác + thông điệp)

### NGUYÊN TẮC TẠO KỊCH BẢN:
${HUONG_DAN_TAO_KICH_BAN.nguyen_tac_chung.map((n, i) => `${i + 1}. ${n}`).join("\n")}

### MẪU THAM KHẢO KHỐI ${khoi}:
`

  mauThamKhao.forEach((mau) => {
    context += `
**${mau.ten_chu_de}**
- Loại hình: ${mau.cau_truc.phan_chinh.loai === "kich" ? "Tiểu phẩm kịch" : "Cuộc thi"}
- Khởi động: ${mau.cau_truc.khoi_dong.hoat_dong.ten}
- Thông điệp: ${mau.cau_truc.ket_thuc.thong_diep_ket_thuc}
`
    if (mau.cau_truc.phan_chinh.kich_ban) {
      context += `- Kịch bản: ${mau.cau_truc.phan_chinh.kich_ban.ten} - ${mau.cau_truc.phan_chinh.kich_ban.chu_de}\n`
    }
  })

  if (goiY.length > 0) {
    context += `
### GỢI Ý LOẠI KỊCH BẢN PHÙ HỢP VỚI CHỦ ĐỀ "${tenChuDe}":
`
    goiY.forEach((g) => {
      context += `- **${g.ten}**: ${g.mo_ta}\n`
    })
  }

  return context
}

/**
 * Tạo context văn bản hành chính
 */
export function taoContextVanBanHanhChinh(thongTin: {
  ten_tinh?: string
  ten_truong?: string
  so_ke_hoach?: number
  dia_danh?: string
  ngay?: number
  thang?: number
  nam?: number
  ten_chu_de?: string
  lop?: string
}): string {
  return `
=== CẤU TRÚC VĂN BẢN HÀNH CHÍNH ===
Kế hoạch ngoại khóa phải tuân theo cấu trúc văn bản hành chính chuẩn:

1. TIÊU ĐỀ:
   - Đơn vị cấp trên: SỞ GD&ĐT ${thongTin.ten_tinh || "{TÊN TỈNH}"}
   - Đơn vị: TRƯỜNG THPT ${thongTin.ten_truong || "{TÊN TRƯỜNG}"}
   - Tổ chuyên môn: TỔ HĐTN-HN&GDĐP
   - Số kế hoạch: Số: ${thongTin.so_ke_hoach || "XX"}/KHNK-HĐTN-HN

2. QUỐC HIỆU:
   CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
   Độc lập – Tự do – Hạnh phúc

3. ĐỊA DANH, NGÀY THÁNG:
   ${thongTin.dia_danh || "{Địa danh}"}, ngày ${thongTin.ngay || "XX"} tháng ${thongTin.thang || "XX"} năm ${thongTin.nam || "XXXX"}

4. CÁC MỤC BẮT BUỘC:
   I. MỤC TIÊU (Yêu cầu cần đạt, Năng lực, Phẩm chất)
   II. NỘI DUNG VÀ HÌNH THỨC TỔ CHỨC
   III. KINH PHÍ THỰC HIỆN (nếu có)
   IV. TỔ CHỨC THỰC HIỆN

5. NƠI NHẬN:
   - BGH (để b/c);
   - Tổ HĐTN-HN (để p/h t/h);
   - Lớp ${thongTin.lop || "{LỚP}"} (để t/h);
   - Lưu: VT.

6. CHỮ KÝ:
   TỔ TRƯỞNG
   (Ký và ghi rõ họ tên)
`
}

/**
 * Lấy câu hỏi tương tác theo loại chủ đề
 */
export function getCauHoiTuongTac(loai_chu_de: string): (typeof CAU_HOI_TUONG_TAC_SAU_KICH)[string] | null {
  return CAU_HOI_TUONG_TAC_SAU_KICH[loai_chu_de] || null
}

/**
 * Lấy thông điệp kết thúc theo loại chủ đề
 */
export function getThongDiepKetThuc(loai_chu_de: string): string[] {
  return (
    THONG_DIEP_KET_THUC[loai_chu_de] || [
      "Hãy sống có ý nghĩa và lan tỏa năng lượng tích cực.",
      "Mỗi ngày là cơ hội mới để trở thành phiên bản tốt hơn của chính mình.",
    ]
  )
}

/**
 * Tạo context câu hỏi tương tác sau kịch
 */
export function taoContextCauHoiTuongTac(loai_chu_de: string): string {
  const cauHoi = getCauHoiTuongTac(loai_chu_de)
  if (!cauHoi) return ""

  let result = `\n=== CÂU HỎI TƯƠNG TÁC SAU KỊCH ===\nChủ đề: ${cauHoi.chu_de}\n\n`

  cauHoi.cau_hoi.forEach((ch, idx) => {
    result += `${idx + 1}. [${ch.loai.toUpperCase()}] ${ch.noi_dung}\n`
    if (ch.dap_an) result += `   Đáp án: ${ch.dap_an}\n`
    if (ch.giai_thich) result += `   Giải thích: ${ch.giai_thich}\n`
    result += "\n"
  })

  return result
}

/**
 * Tạo context kinh phí thực hiện
 */
export function taoContextKinhPhi(): string {
  let result = `\n=== KINH PHÍ THỰC HIỆN (THAM KHẢO) ===\n`
  MAU_KINH_PHI.cac_muc_chi.forEach((muc, idx) => {
    result += `${idx + 1}. ${muc.ten}: ${muc.kinh_phi_du_kien}\n   (${muc.mo_ta})\n`
  })
  result += `\nTỔNG DỰ KIẾN: ${MAU_KINH_PHI.tong_du_kien}\nGhi chú: ${MAU_KINH_PHI.ghi_chu}\n`
  return result
}

export default {
  MAU_NGOAI_KHOA_THANH_CONG,
  HUONG_DAN_TAO_KICH_BAN,
  CAU_TRUC_VAN_BAN_HANH_CHINH,
  MAU_KINH_PHI,
  CAU_HOI_TUONG_TAC_SAU_KICH,
  THONG_DIEP_KET_THUC,
  getMauNgoaiKhoa,
  getMauNgoaiKhoaTheoKhoi,
  goiYLoaiKichBan,
  taoContextNgoaiKhoaChiTiet,
  taoContextVanBanHanhChinh,
  getCauHoiTuongTac,
  getThongDiepKetThuc,
  taoContextCauHoiTuongTac,
  taoContextKinhPhi,
}
