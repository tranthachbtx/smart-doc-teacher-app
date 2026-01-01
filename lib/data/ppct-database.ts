// Database PPCT (Phân phối chương trình) cho HĐTN, HN - Sách KNTT
// Cấu trúc: 105 tiết/năm = 3 tiết/tuần x 35 tuần

export interface PPCTChuDe {
  chu_de_so: number
  ten: string
  tong_tiet: number
  shdc: number // Sinh hoạt dưới cờ
  hdgd: number // Hoạt động giáo dục theo chủ đề
  shl: number // Sinh hoạt lớp
  hoat_dong?: string[] // Danh sách các hoạt động chính trong chủ đề
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
// PPCT KHỐI 10 - THÍCH ỨNG VÀ KHÁM PHÁ
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
      hoat_dong: [
        "Tìm hiểu nội quy trường lớp và quy định cộng đồng",
        "Tìm hiểu truyền thống nhà trường",
        "Thực hiện nội quy và quy định cộng đồng",
        "Giáo dục truyền thống nhà trường",
        "Kế hoạch truyền thông 'Trường học hạnh phúc'",
        "Xây dựng và thực hiện kế hoạch tự rèn luyện"
      ],
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
      hoat_dong: [
        "Xác định tính cách bản thân",
        "Tìm hiểu về điều chỉnh tư duy theo hướng tích cực",
        "Tìm hiểu về quan điểm sống",
        "Lập và thực hiện kế hoạch rèn luyện phát huy điểm mạnh, hạn chế điểm yếu",
        "Điều chỉnh tư duy của bản thân theo hướng tích cực",
        "Rèn luyện tính cách và tư duy tích cực",
        "Thể hiện quan điểm sống của bản thân"
      ],
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
      hoat_dong: [
        "Tìm hiểu biểu hiện của người có trách nhiệm",
        "Tìm hiểu sự tự chủ, lòng tự trọng và ý chí vượt khó",
        "Tìm hiểu biểu hiện của người có tư duy phản biện",
        "Tìm hiểu về kế hoạch tài chính cá nhân",
        "Thực hành trách nhiệm, tự chủ, tự trọng, ý chí vượt khó",
        "Thực hành quy trình phản biện 4 bước có cấu trúc",
        "Xây dựng và thực hiện kế hoạch tài chính cá nhân",
        "Rèn luyện tính trách nhiệm trong thực hiện mục tiêu"
      ],
      tuan_bat_dau: 8,
      tuan_ket_thuc: 11,
    },
    {
      chu_de_so: 4,
      ten: "Chủ động, tự tin trong học tập và giao tiếp",
      tong_tiet: 15,
      shdc: 5,
      hdgd: 5,
      shl: 5,
      hoat_dong: [
        "Tìm hiểu biểu hiện của sự chủ động trong các môi trường",
        "Tìm hiểu sự tự tin và thân thiện trong giao tiếp",
        "Thể hiện sự chủ động trong học tập và giao tiếp",
        "Thực hành giao tiếp tự tin, thân thiện với bạn bè",
        "Thực hành giao tiếp, ứng xử với thầy, cô giáo",
        "Thực hành ứng xử phù hợp trong giao tiếp ở gia đình",
        "Rèn luyện tính chủ động, tự tin trong cuộc sống"
      ],
      tuan_bat_dau: 12,
      tuan_ket_thuc: 16,
    },
    {
      chu_de_so: 5,
      ten: "Trách nhiệm với gia đình",
      tong_tiet: 12,
      shdc: 4,
      hdgd: 4,
      shl: 4,
      hoat_dong: [
        "Tìm hiểu về trách nhiệm với gia đình",
        "Thể hiện trách nhiệm với gia đình",
        "Xây dựng kế hoạch thực hiện hoạt động lao động trong gia đình",
        "Đề xuất biện pháp phát triển kinh tế gia đình",
        "Thực hiện trách nhiệm với gia đình và đánh giá"
      ],
      tuan_bat_dau: 17,
      tuan_ket_thuc: 20,
    },
    {
      chu_de_so: 6,
      ten: "Tham gia xây dựng cộng đồng",
      tong_tiet: 9,
      shdc: 3,
      hdgd: 3,
      shl: 3,
      hoat_dong: [
        "Tìm hiểu biện pháp mở rộng quan hệ và thu hút cộng đồng",
        "Xác định nội dung tuyên truyền về văn hóa ứng xử nơi công cộng",
        "Thực hiện biện pháp mở rộng quan hệ và thu hút cộng đồng",
        "Lập kế hoạch tuyên truyền văn hóa ứng xử nơi công cộng",
        "Thực hiện kế hoạch tuyên truyền văn hóa ứng xử",
        "Tham gia kết nối cộng đồng và đánh giá"
      ],
      tuan_bat_dau: 21,
      tuan_ket_thuc: 23,
    },
    {
      chu_de_so: 7,
      ten: "Bảo tồn cảnh quan thiên nhiên",
      tong_tiet: 12,
      shdc: 4,
      hdgd: 4,
      shl: 4,
      hoat_dong: [
        "Tìm hiểu hành vi, việc làm bảo tồn cảnh quan thiên nhiên",
        "Tìm hiểu về hoạt động tuyên truyền bảo vệ cảnh quan thiên nhiên",
        "Nhận xét, đánh giá việc bảo tồn cảnh quan ở địa phương",
        "Xây dựng và thực hiện kế hoạch tuyên truyền bảo vệ cảnh quan",
        "Tuyên truyền bảo vệ cảnh quan thiên nhiên và đánh giá"
      ],
      tuan_bat_dau: 24,
      tuan_ket_thuc: 27,
    },
    {
      chu_de_so: 8,
      ten: "Bảo vệ môi trường tự nhiên",
      tong_tiet: 9,
      shdc: 3,
      hdgd: 3,
      shl: 3,
      hoat_dong: [
        "Phân tích, đánh giá thực trạng môi trường tự nhiên ở địa phương",
        "Thuyết trình về ý nghĩa của việc bảo vệ môi trường tự nhiên",
        "Thực hiện các giải pháp bảo vệ môi trường tự nhiên",
        "Thực hiện bảo vệ môi trường tự nhiên ở địa phương và đánh giá"
      ],
      tuan_bat_dau: 28,
      tuan_ket_thuc: 30,
    },
    {
      chu_de_so: 9,
      ten: "Tìm hiểu nghề nghiệp",
      tong_tiet: 3,
      shdc: 1,
      hdgd: 1,
      shl: 1,
      hoat_dong: [
        "Tìm hiểu hoạt động sản xuất, kinh doanh, dịch vụ ở địa phương",
        "Xác định, tìm hiểu các thông tin về nghề em quan tâm ở địa phương",
        "Lập kế hoạch và thực hiện trải nghiệm nghề",
        "Rèn luyện bản thân theo yêu cầu của nghề em quan tâm"
      ],
      tuan_bat_dau: 31,
      tuan_ket_thuc: 31,
    },
    {
      chu_de_so: 10,
      ten: "Hiểu bản thân để chọn nghề phù hợp",
      tong_tiet: 6,
      shdc: 2,
      hdgd: 2,
      shl: 2,
      hoat_dong: [
        "Tìm hiểu yêu cầu của việc chọn nghề phù hợp",
        "Lựa chọn nghề nghiệp phù hợp với bản thân",
        "Đánh giá sự phù hợp của bản thân với nghề định lựa chọn",
        "Xây dựng kế hoạch rèn luyện bản thân theo định hướng nghề nghiệp",
        "Rèn luyện năng lực, phẩm chất theo kế hoạch"
      ],
      tuan_bat_dau: 32,
      tuan_ket_thuc: 33,
    },
    {
      chu_de_so: 11,
      ten: "Lập kế hoạch học tập, rèn luyện theo định hướng nghề nghiệp",
      tong_tiet: 6,
      shdc: 2,
      hdgd: 2,
      shl: 2,
      hoat_dong: [
        "Tìm hiểu hệ thống trường đào tạo liên quan đến nghề định chọn",
        "Tìm hiểu về tham vấn chọn nghề và định hướng học tập",
        "Tìm hiểu cách lập kế hoạch học tập, rèn luyện theo định hướng nghề nghiệp",
        "Trình bày thông tin về hệ thống đào tạo nghề",
        "Thực hành tham vấn chọn nghề và định hướng học tập",
        "Xây dựng kế hoạch học tập, rèn luyện bản thân theo nghề",
        "Học tập, rèn luyện theo định hướng nghề nghiệp và đánh giá"
      ],
      tuan_bat_dau: 34,
      tuan_ket_thuc: 35,
    },
  ],
}

// ============================================
// PPCT KHỐI 11 - PHÁT TRIỂN VÀ BẢN SẮC
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
      hoat_dong: [
        "Tìm hiểu cách phát triển mối quan hệ tốt đẹp với thầy cô, bạn bè",
        "Tìm hiểu cách làm chủ và kiểm soát các mối quan hệ với bạn bè ở trường, qua mạng xã hội",
        "Xây dựng mối quan hệ tốt đẹp với thầy cô, bạn bè",
        "Rèn luyện kỹ năng làm chủ và kiểm soát các mối quan hệ với bạn bè ở trường, qua mạng xã hội",
        "Lập kế hoạch đánh giá hiệu quả hoạt động xây dựng truyền thống nhà trường",
        "Chủ động, tự tin làm quen và thiết lập mối quan hệ"
      ],
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
      hoat_dong: [
        "Khám phá đặc điểm riêng của bản thân",
        "Tìm hiểu về cách thể hiện sự tự tin đối với những đặc điểm riêng của bản thân",
        "Tìm hiểu cách điều chỉnh bản thân để thích ứng với sự thay đổi",
        "Thiết kế và trình bày sản phẩm giới thiệu đặc điểm riêng của bản thân",
        "Xây dựng kế hoạch phát triển sở trường liên quan đến định hướng nghề nghiệp",
        "Thể hiện sự tự tin về đặc điểm riêng trong các tình huống thực tiễn"
      ],
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
      hoat_dong: [
        "Tìm hiểu cách tuân thủ kỉ luật, quy định của nhóm, lớp, tập thể",
        "Tuân thủ những quy định chung của tổ, lớp, chi đoàn, trường, cộng đồng",
        "Rèn luyện và phát triển các kĩ năng còn thiếu sót của bản thân",
        "Khích lệ, động viên bạn bè phát huy khả năng, cố gắng",
        "Giúp bạn bè xác định mục tiêu, xây dựng kế hoạch tự hoàn thiện"
      ],
      tuan_bat_dau: 8,
      tuan_ket_thuc: 11,
    },
    {
      chu_de_so: 4,
      ten: "Trách nhiệm với gia đình",
      tong_tiet: 9,
      shdc: 3,
      hdgd: 3,
      shl: 3,
      hoat_dong: [
        "Tìm hiểu những việc cần làm thể hiện sự quan tâm, chăm sóc thường xuyên đến người thân",
        "Biện pháp xây dựng và phát triển mối quan hệ với mọi người trong gia đình",
        "Chia sẻ những việc làm đã thể hiện sự quan tâm, chăm sóc người thân",
        "Thực hiện mục tiêu tiết kiệm tài chính của gia đình"
      ],
      tuan_bat_dau: 12,
      tuan_ket_thuc: 14,
    },
    {
      chu_de_so: 5,
      ten: "Phát triển cộng đồng",
      tong_tiet: 12,
      shdc: 4,
      hdgd: 4,
      shl: 4,
      hoat_dong: [
        "Tìm hiểu biện pháp xây dựng và phát triển cộng đồng",
        "Xây dựng văn hóa mạng xã hội văn minh",
        "Lập kế hoạch dự án cộng đồng (Chuẩn 5W1H)",
        "Hoạt động: Thu gom pin cũ đổi cây xanh",
        "Tham gia các hoạt động tình nguyện tình nghĩa"
      ],
      tuan_bat_dau: 15,
      tuan_ket_thuc: 18,
      ghi_chu: "Kết thúc HKI",
    },
    {
      chu_de_so: 6,
      ten: "Bảo tồn cảnh quan thiên nhiên",
      tong_tiet: 6,
      shdc: 2,
      hdgd: 2,
      shl: 2,
      hoat_dong: [
        "Tuân thủ quy tắc giữ gìn và bảo vệ cảnh quan, di tích, danh lam thắng cảnh",
        "Lập kế hoạch đánh giá thực trạng bảo tồn danh lam thắng cảnh của cộng đồng địa phương",
        "Điều tra thực trạng theo kế hoạch và viết báo cáo",
        "Nhận thức tác động của phát triển kinh tế đến việc bảo tồn cảnh quan"
      ],
      tuan_bat_dau: 19,
      tuan_ket_thuc: 20,
    },
    {
      chu_de_so: 7,
      ten: "Bảo vệ môi trường",
      tong_tiet: 12,
      shdc: 4,
      hdgd: 4,
      shl: 4,
      hoat_dong: [
        "Tác động của sản xuất, kinh doanh đến môi trường địa phương",
        "Cải thiện quá trình sản xuất, kinh doanh theo hướng bền vững",
        "Đề xuất các giải pháp bảo vệ môi trường toàn diện"
      ],
      tuan_bat_dau: 21,
      tuan_ket_thuc: 24,
    },
    {
      chu_de_so: 8,
      ten: "Các nhóm nghề cơ bản và yêu cầu thị trường lao động",
      tong_tiet: 12,
      shdc: 4,
      hdgd: 4,
      shl: 4,
      hoat_dong: [
        "Phân loại các nhóm nghề cơ bản (Chuẩn ISCO Việt Nam)",
        "Tìm hiểu ý nghĩa của việc đảm bảo an toàn và sức khỏe nghề nghiệp",
        "Phân tích yêu cầu của nhà tuyển dụng/Xu hướng 4.0",
        "Dịch chuyển lao động trong kỷ nguyên số"
      ],
      tuan_bat_dau: 25,
      tuan_ket_thuc: 28,
    },
    {
      chu_de_so: 9,
      ten: "Rèn luyện phẩm chất, năng lực phù hợp với nhóm nghề lựa chọn",
      tong_tiet: 12,
      shdc: 4,
      hdgd: 4,
      shl: 4,
      hoat_dong: [
        "Phân tích điểm mạnh, điểm yếu của bản thân đối với từng nhóm nghề",
        "Xác định nhóm nghề/nghề lựa chọn dựa vào năng lực bản thân",
        "Đề xuất các giải pháp học tập, rèn luyện theo nghề lựa chọn",
        "Chia sẻ thuận lợi và khó khăn trong quá trình rèn luyện"
      ],
      tuan_bat_dau: 29,
      tuan_ket_thuc: 32,
    },
    {
      chu_de_so: 10,
      ten: "Xây dựng và thực hiện kế hoạch học tập theo định hướng nghề",
      tong_tiet: 9,
      shdc: 3,
      hdgd: 3,
      shl: 3,
      hoat_dong: [
        "Tìm hiểu hệ thống trường đào tạo liên quan đến nghề định chọn",
        "Tìm hiểu về tham vấn chọn nghề và định hướng học tập",
        "Tìm hiểu cách lập kế hoạch học tập, rèn luyện theo nghề lựa chọn",
        "Trình bày thông tin về hệ thống đào tạo nghề",
        "Thực hành tham vấn chọn nghề và định hướng học tập",
        "Xây dựng kế hoạch học tập, rèn luyện bản thân theo nghề",
        "Học tập, rèn luyện theo định hướng nghề nghiệp và đánh giá"
      ],
      tuan_bat_dau: 33,
      tuan_ket_thuc: 35,
    },
  ],
}

// ============================================
// PPCT KHỐI 12 - TRƯỞNG THÀNH VÀ CHUYỂN TIẾP
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
      hoat_dong: [
        "Tìm hiểu cách nuôi dưỡng, giữ gìn và mở rộng các mối quan hệ tốt đẹp với thầy cô và bạn bè",
        "Tìm hiểu về cách hợp tác với mọi người trong hoạt động chung",
        "Thể hiện cách nuôi dưỡng, giữ gìn và mở rộng mối quan hệ tốt đẹp với thầy cô",
        "Phân tích dư luận xã hội về quan hệ bạn bè trên mạng xã hội",
        "Thực hiện các hoạt động xây dựng truyền thống nhà trường"
      ],
      tuan_bat_dau: 1,
      tuan_ket_thuc: 4,
    },
    {
      chu_de_so: 2,
      ten: "Tôi trưởng thành",
      tong_tiet: 12,
      shdc: 4,
      hdgd: 4,
      shl: 4,
      hoat_dong: [
        "Xác định những biểu hiện trưởng thành của cá nhân",
        "Tìm hiểu biểu hiện của phẩm chất ý chí và sự đam mê",
        "Nhận diện đặc điểm của người có tư duy độc lập"
      ],
      tuan_bat_dau: 5,
      tuan_ket_thuc: 8,
    },
    {
      chu_de_so: 3,
      ten: "Hoàn thiện bản thân",
      tong_tiet: 15,
      shdc: 5,
      hdgd: 5,
      shl: 5,
      hoat_dong: [
        "Đánh giá các kỹ năng sinh tồn và tự phục vụ",
        "Rèn luyện phẩm chất và năng lực theo định hướng tương lai"
      ],
      tuan_bat_dau: 9,
      tuan_ket_thuc: 13,
    },
    {
      chu_de_so: 4,
      ten: "Trách nhiệm với gia đình",
      tong_tiet: 15,
      shdc: 5,
      hdgd: 5,
      shl: 5,
      hoat_dong: [
        "Thực hiện trách nhiệm của người trưởng thành trong gia đình",
        "Chuẩn bị tâm lý và kỹ năng khi sinh sống xa nhà"
      ],
      tuan_bat_dau: 14,
      tuan_ket_thuc: 18,
    },
    {
      chu_de_so: 5,
      ten: "Xây dựng cộng đồng",
      tong_tiet: 9,
      shdc: 3,
      hdgd: 3,
      shl: 3,
      hoat_dong: [
        "Tham gia các hoạt động cộng đồng và hội nhập quốc tế",
        "Đề xuất giải pháp cho các vấn đề xã hội phổ biến"
      ],
      tuan_bat_dau: 19,
      tuan_ket_thuc: 21,
    },
    {
      chu_de_so: 6,
      ten: "Chung tay gìn giữ, bảo tồn cảnh quan thiên nhiên",
      tong_tiet: 9,
      shdc: 3,
      hdgd: 3,
      shl: 3,
      hoat_dong: [
        "Tìm hiểu các giải pháp tích cực, sáng tạo trong việc bảo tồn cảnh quan thiên nhiên",
        "Tìm hiểu về hoạt động tuyên truyền trong cộng đồng",
        "Thực hiện giải pháp sáng tạo bảo tồn cảnh quan"
      ],
      tuan_bat_dau: 22,
      tuan_ket_thuc: 24,
    },
    {
      chu_de_so: 7,
      ten: "Bảo vệ thế giới tự nhiên",
      tong_tiet: 9,
      shdc: 3,
      hdgd: 3,
      shl: 3,
      hoat_dong: [
        "Ảnh hưởng của biến đổi khí hậu đến đời sống",
        "Tham gia bảo vệ đa dạng sinh học"
      ],
      tuan_bat_dau: 25,
      tuan_ket_thuc: 27,
    },
    {
      chu_de_so: 8,
      ten: "Nghề nghiệp và những yêu cầu với người lao động hiện đại",
      tong_tiet: 9,
      shdc: 3,
      hdgd: 3,
      shl: 3,
      hoat_dong: [
        "Tìm hiểu về xu hướng phát triển nghề nghiệp trong xã hội hiện đại",
        "Xác định phẩm chất, năng lực cần có của người lao động hiện đại",
        "Rèn luyện tính chuyên nghiệp trong công việc",
        "Biện pháp đảm bảo an toàn và sức khỏe nghề nghiệp"
      ],
      tuan_bat_dau: 28,
      tuan_ket_thuc: 30,
    },
    {
      chu_de_so: 9,
      ten: "Định hướng học tập và nghề nghiệp",
      tong_tiet: 9,
      shdc: 3,
      hdgd: 3,
      shl: 3,
      hoat_dong: [
        "Lựa chọn hướng đi và trường đào tạo phù hợp",
        "Tìm hiểu về tham vấn chọn nghề và định hướng học tập",
        "Hoàn thiện hồ sơ và thủ tục xét tuyển"
      ],
      tuan_bat_dau: 31,
      tuan_ket_thuc: 33,
    },
    {
      chu_de_so: 10,
      ten: "Chào đón tương lai (Bước vào thế giới nghề nghiệp)",
      tong_tiet: 3,
      shdc: 1,
      hdgd: 1,
      shl: 1,
      hoat_dong: [
        "Chuẩn bị hồ sơ ứng tuyển (Portfolio/CV)",
        "Thực hành phỏng vấn thử (Phương pháp STAR)",
        "Giải mã thông báo tuyển dụng và quy chế tuyển sinh"
      ],
      tuan_bat_dau: 34,
      tuan_ket_thuc: 34,
    },
    {
      chu_de_so: 11,
      ten: "Xây dựng giá trị gia đình",
      tong_tiet: 3,
      shdc: 1,
      hdgd: 1,
      shl: 1,
      hoat_dong: [
        "Xây dựng gia đình bền vững",
        "Tổ chức cuộc sống gia đình hạnh phúc"
      ],
      tuan_bat_dau: 35,
      tuan_ket_thuc: 35,
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

export function getChuDeListByKhoi(khoi: string): PPCTChuDe[] {
  const khoiNum = Number.parseInt(khoi);
  const ppct = getPPCTTheoKhoi(khoiNum);
  return ppct?.chu_de || [];
}
