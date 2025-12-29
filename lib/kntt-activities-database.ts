/**
 * DANH MỤC HOẠT ĐỘNG CHI TIẾT THEO SGK
 * BỘ SÁCH: KẾT NỐI TRI THỨC VỚI CUỘC SỐNG
 * MÔN: HOẠT ĐỘNG TRẢI NGHIỆM, HƯỚNG NGHIỆP
 *
 * Nguồn: Sách giáo khoa HĐTN, HN - Kết nối Tri thức
 * Mục đích: Gợi ý hoạt động cho KHBD, Ngoại khóa, Biên bản họp
 */

export interface HoatDong {
  stt: number
  ten: string
  mo_ta?: string // Mô tả chi tiết hoạt động
}

export interface ChuDeSGK {
  stt: number
  ten: string
  hoat_dong: HoatDong[]
}

export interface KhoiSGK {
  khoi: 10 | 11 | 12
  chu_de: ChuDeSGK[]
}

// ============================================================================
// KHỐI 10 - 11 CHỦ ĐỀ
// ============================================================================

export const KHOI_10_ACTIVITIES: KhoiSGK = {
  khoi: 10,
  chu_de: [
    {
      stt: 1,
      ten: "Phát huy truyền thống nhà trường",
      hoat_dong: [
        { stt: 1, ten: "Tìm hiểu nội quy của trường, lớp, quy định của cộng đồng và biện pháp thực hiện" },
        { stt: 2, ten: "Tìm hiểu truyền thống nhà trường" },
        { stt: 3, ten: "Thực hiện nội quy của trường, lớp và quy định của cộng đồng" },
        { stt: 4, ten: "Giáo dục truyền thống nhà trường" },
        { stt: 5, ten: "Thực hiện một số biện pháp thu hút các bạn vào hoạt động chung" },
        { stt: 6, ten: "Xây dựng và thực hiện kế hoạch tự rèn luyện bản thân để thực hiện tốt các quy định chung" },
      ],
    },
    {
      stt: 2,
      ten: "Khám phá bản thân",
      hoat_dong: [
        { stt: 1, ten: "Xác định tính cách của bản thân" },
        { stt: 2, ten: "Tìm hiểu về điều chỉnh tư duy theo hướng tích cực" },
        { stt: 3, ten: "Tìm hiểu về quan điểm sống" },
        { stt: 4, ten: "Lập và thực hiện kế hoạch rèn luyện phát huy điểm mạnh, hạn chế điểm yếu của bản thân" },
        { stt: 5, ten: "Điều chỉnh tư duy của bản thân theo hướng tích cực" },
        { stt: 6, ten: "Rèn luyện tính cách và tư duy tích cực của bản thân" },
        { stt: 7, ten: "Thể hiện quan điểm sống của bản thân" },
      ],
    },
    {
      stt: 3,
      ten: "Rèn luyện bản thân",
      hoat_dong: [
        { stt: 1, ten: "Tìm hiểu biểu hiện của người có trách nhiệm" },
        { stt: 2, ten: "Tìm hiểu những việc làm thể hiện sự tự chủ, lòng tự trọng, ý chí vượt khó" },
        { stt: 3, ten: "Tìm hiểu biểu hiện của người có tư duy phản biện" },
        { stt: 4, ten: "Thảo luận về kế hoạch tài chính cá nhân" },
        { stt: 5, ten: "Thực hành thể hiện tính trách nhiệm, sự tự chủ, lòng tự trọng, ý chí vượt khó" },
        { stt: 6, ten: "Rèn luyện tư duy phản biện" },
        { stt: 7, ten: "Xây dựng và thực hiện kế hoạch tài chính cá nhân của bản thân" },
        {
          stt: 8,
          ten: "Rèn luyện tính trách nhiệm, lòng tự trọng, sự tự chủ, ý chí vượt khó trong việc thực hiện mục tiêu của bản thân",
        },
      ],
    },
    {
      stt: 4,
      ten: "Chủ động, tự tin trong học tập và giao tiếp",
      hoat_dong: [
        { stt: 1, ten: "Tìm hiểu biểu hiện của sự chủ động trong các môi trường học tập, giao tiếp" },
        { stt: 2, ten: "Tìm hiểu biểu hiện của sự tự tin, thân thiện trong giao tiếp" },
        { stt: 3, ten: "Thể hiện sự chủ động học tập, giao tiếp trong các môi trường" },
        { stt: 4, ten: "Thực hành giao tiếp, ứng xử tự tin, thân thiện với bạn bè trong trường học" },
        { stt: 5, ten: "Thực hành giao tiếp, ứng xử với thầy, cô giáo" },
        { stt: 6, ten: "Thực hành ứng xử phù hợp trong giao tiếp ở gia đình" },
        { stt: 7, ten: "Rèn luyện tính chủ động, tự tin trong học tập và giao tiếp" },
      ],
    },
    {
      stt: 5,
      ten: "Trách nhiệm với gia đình",
      hoat_dong: [
        { stt: 1, ten: "Tìm hiểu về trách nhiệm với gia đình" },
        { stt: 2, ten: "Thể hiện trách nhiệm với gia đình" },
        { stt: 3, ten: "Xây dựng kế hoạch thực hiện hoạt động lao động trong gia đình" },
        { stt: 4, ten: "Đề xuất biện pháp phát triển kinh tế gia đình, lập kế hoạch và thực hiện" },
        { stt: 5, ten: "Thực hiện trách nhiệm với gia đình" },
      ],
    },
    {
      stt: 6,
      ten: "Tham gia xây dựng cộng đồng",
      hoat_dong: [
        { stt: 1, ten: "Tìm hiểu biện pháp mở rộng quan hệ và thu hút cộng đồng vào hoạt động xã hội" },
        { stt: 2, ten: "Xác định nội dung cần tuyên truyền trong cộng đồng về văn hóa ứng xử nơi công cộng" },
        { stt: 3, ten: "Thực hiện biện pháp mở rộng quan hệ và thu hút cộng đồng vào hoạt động xã hội" },
        { stt: 4, ten: "Lập kế hoạch tuyên truyền trong cộng đồng về văn hóa ứng xử nơi công cộng" },
        { stt: 5, ten: "Thực hiện kế hoạch tuyên truyền trong cộng đồng về văn hóa ứng xử nơi công cộng" },
        { stt: 6, ten: "Tham gia kết nối cộng đồng" },
        { stt: 7, ten: "Đánh giá kết quả hoạt động phát triển cộng đồng của bản thân" },
      ],
    },
    {
      stt: 7,
      ten: "Bảo tồn cảnh quan thiên nhiên",
      hoat_dong: [
        { stt: 1, ten: "Tìm hiểu về hành vi, việc làm bảo tồn cảnh quan thiên nhiên của tổ chức, cá nhân" },
        { stt: 2, ten: "Tìm hiểu về hoạt động tuyên truyền bảo vệ cảnh quan thiên nhiên" },
        {
          stt: 3,
          ten: "Nhận xét, đánh giá hành vi, việc làm của tổ chức, cá nhân trong việc bảo tồn cảnh quan thiên nhiên ở địa phương",
        },
        { stt: 4, ten: "Xây dựng và thực hiện kế hoạch tuyên truyền bảo vệ cảnh quan thiên nhiên ở địa phương" },
      ],
    },
    {
      stt: 8,
      ten: "Bảo vệ môi trường tự nhiên",
      hoat_dong: [
        { stt: 1, ten: "Phân tích, đánh giá thực trạng môi trường tự nhiên ở địa phương" },
        { stt: 2, ten: "Thuyết trình về ý nghĩa của việc bảo vệ môi trường tự nhiên" },
        { stt: 3, ten: "Thực hiện các giải pháp bảo vệ môi trường tự nhiên" },
        { stt: 4, ten: "Thực hiện bảo vệ môi trường tự nhiên ở địa phương" },
      ],
    },
    {
      stt: 9,
      ten: "Tìm hiểu nghề nghiệp",
      hoat_dong: [
        { stt: 1, ten: "Tìm hiểu hoạt động sản xuất, kinh doanh, dịch vụ ở địa phương" },
        { stt: 2, ten: "Xác định, tìm hiểu các thông tin về nghề/nhóm nghề em quan tâm ở địa phương" },
        { stt: 3, ten: "Lập kế hoạch và thực hiện trải nghiệm nghề" },
        { stt: 4, ten: "Rèn luyện bản thân theo yêu cầu của nghề em quan tâm" },
      ],
    },
    {
      stt: 10,
      ten: "Hiểu bản thân để chọn nghề phù hợp",
      hoat_dong: [
        { stt: 1, ten: "Tìm hiểu yêu cầu của việc chọn nghề phù hợp" },
        { stt: 2, ten: "Lựa chọn nghề nghiệp phù hợp với bản thân" },
        { stt: 3, ten: "Đánh giá sự phù hợp của bản thân với nghề/nhóm nghề định lựa chọn" },
        { stt: 4, ten: "Xây dựng kế hoạch rèn luyện bản thân theo định hướng nghề nghiệp" },
      ],
    },
    {
      stt: 11,
      ten: "Lập kế hoạch học tập, rèn luyện theo định hướng nghề nghiệp",
      hoat_dong: [
        { stt: 1, ten: "Tìm hiểu thông tin cơ bản về hệ thống trường đào tạo nghề liên quan đến nghề định lựa chọn" },
        { stt: 2, ten: "Tìm hiểu về tham vấn chọn nghề và định hướng học tập" },
        { stt: 3, ten: "Tìm hiểu cách lập kế hoạch học tập, rèn luyện theo nghề/nhóm nghề lựa chọn" },
        { stt: 4, ten: "Trình bày một số thông tin cơ bản về hệ thống trường đào tạo nghề em định chọn" },
        { stt: 5, ten: "Thực hành tham vấn chọn nghề và định hướng học tập" },
        { stt: 6, ten: "Xây dựng kế hoạch học tập, rèn luyện bản thân theo nghề/nhóm nghề lựa chọn" },
      ],
    },
  ],
}

// ============================================================================
// KHỐI 11 - 10 CHỦ ĐỀ
// ============================================================================

export const KHOI_11_ACTIVITIES: KhoiSGK = {
  khoi: 11,
  chu_de: [
    {
      stt: 1,
      ten: "Xây dựng và phát triển nhà trường",
      hoat_dong: [
        { stt: 1, ten: "Tìm hiểu cách phát triển mối quan hệ tốt đẹp với thầy cô, bạn bè" },
        { stt: 2, ten: "Tìm hiểu cách làm chủ và kiểm soát các mối quan hệ với bạn bè ở trường, qua mạng xã hội" },
        { stt: 3, ten: "Xây dựng mối quan hệ tốt đẹp với thầy cô, bạn bè" },
        { stt: 4, ten: "Rèn luyện kĩ năng làm chủ và kiểm soát các mối quan hệ với bạn bè ở trường, qua mạng xã hội" },
        { stt: 5, ten: "Hợp tác với bạn để cùng xây dựng và phát triển nhà trường" },
        { stt: 6, ten: "Đánh giá hiệu quả hoạt động phát huy truyền thống nhà trường" },
        { stt: 7, ten: "Vận dụng các kĩ năng đã được rèn luyện vào thực tiễn" },
      ],
    },
    {
      stt: 2,
      ten: "Khám phá bản thân",
      hoat_dong: [
        { stt: 1, ten: "Khám phá đặc điểm riêng của bản thân" },
        { stt: 2, ten: "Tìm hiểu về cách thể hiện sự tự tin đối với những đặc điểm riêng của bản thân" },
        { stt: 3, ten: "Tìm hiểu cách điều chỉnh bản thân để thích ứng với sự thay đổi" },
        { stt: 4, ten: "Thiết kế và trình bày sản phẩm giới thiệu đặc điểm riêng của bản thân" },
        { stt: 5, ten: "Xây dựng kế hoạch điều chỉnh bản thân" },
        {
          stt: 6,
          ten: "Xây dựng kế hoạch phát triển sở trường liên quan đến định hướng nghề nghiệp của bản thân trong tương lai",
        },
        { stt: 7, ten: "Thể hiện sự tự tin về những đặc điểm riêng của bản thân trong thực tiễn cuộc sống" },
        {
          stt: 8,
          ten: "Thực hiện kế hoạch điều chỉnh bản thân để thích ứng với sự thay đổi và kế hoạch phát triển sở trường hướng tới nghề nghiệp tương lai",
        },
      ],
    },
    {
      stt: 3,
      ten: "Rèn luyện bản thân",
      hoat_dong: [
        { stt: 1, ten: "Tìm hiểu cách tuân thủ kỉ luật, quy định của nhóm, lớp, tập thể trường, cộng đồng" },
        { stt: 2, ten: "Tìm hiểu biểu hiện của sự nỗ lực hoàn thiện bản thân" },
        { stt: 3, ten: "Tìm hiểu cách thu hút các bạn cùng phấn đấu hoàn thiện bản thân" },
        { stt: 4, ten: "Tìm hiểu cách quản lí cảm xúc và ứng xử hợp lí trong các tình huống giao tiếp khác nhau" },
        { stt: 5, ten: "Tìm hiểu về cách thực hiện kế hoạch tài chính cá nhân hợp lí" },
        { stt: 6, ten: "Rèn luyện tính kỉ luật" },
        { stt: 7, ten: "Xây dựng kế hoạch tự hoàn thiện bản thân" },
        { stt: 8, ten: "Thực hành một số biện pháp thu hút các bạn cùng phấn đấu hoàn thiện bản thân" },
        { stt: 9, ten: "Đề xuất cách quản lí cảm xúc và ứng xử hợp lí trong các tình huống giao tiếp khác nhau" },
        { stt: 10, ten: "Thực hiện kế hoạch tài chính cá nhân hợp lí" },
        { stt: 11, ten: "Vận dụng các biện pháp và kế hoạch đã xác định" },
      ],
    },
    {
      stt: 4,
      ten: "Trách nhiệm với gia đình",
      hoat_dong: [
        {
          stt: 1,
          ten: "Tìm hiểu những việc cần làm thể hiện sự quan tâm, chăm sóc thường xuyên đến người thân trong gia đình",
        },
        { stt: 2, ten: "Tìm hiểu cách hóa giải mâu thuẫn, xung đột trong gia đình" },
        {
          stt: 3,
          ten: "Tìm hiểu về sự tự tin tổ chức, sắp xếp hợp lí công việc và tự giác tham gia lao động trong gia đình",
        },
        { stt: 4, ten: "Tìm hiểu về kế hoạch chi tiêu phù hợp, thực hiện tiết kiệm tài chính" },
        {
          stt: 5,
          ten: "Rèn luyện kĩ năng hóa giải mâu thuẫn, xung đột và quan tâm, chăm sóc người thân trong gia đình",
        },
        { stt: 6, ten: "Tổ chức sắp xếp hợp lí công việc gia đình và tự giác thực hiện các trách nhiệm" },
        { stt: 7, ten: "Lập kế hoạch chi tiêu phù hợp với thu nhập gia đình" },
        { stt: 8, ten: "Thực hiện mục tiêu tiết kiệm tài chính trong gia đình" },
      ],
    },
    {
      stt: 5,
      ten: "Phát triển cộng đồng",
      hoat_dong: [
        {
          stt: 1,
          ten: "Tìm hiểu các hoạt động phát triển cộng đồng",
          mo_ta:
            "Khảo sát và liệt kê các hoạt động thiện nguyện, xây dựng nông thôn mới/đô thị văn minh tại địa phương.",
        },
        {
          stt: 2,
          ten: "Thiết kế dự án hoạt động thiện nguyện",
          mo_ta:
            "Lập kế hoạch chi tiết (mục tiêu, đối tượng, thời gian, kinh phí) cho một chương trình như 'Áo ấm cho em' hoặc 'Bát cháo tình thương'.",
        },
        {
          stt: 3,
          ten: "Thực hiện các hoạt động trong dự án cộng đồng",
          mo_ta: "Trực tiếp tham gia quyên góp, phân loại quà tặng hoặc hỗ trợ tại các mái ấm, nhà tình thương.",
        },
        {
          stt: 4,
          ten: "Tuyên truyền về nếp sống văn minh và các vấn đề xã hội",
          mo_ta:
            "Thiết kế poster, quay clip ngắn tuyên truyền về văn hóa ứng xử nơi công cộng hoặc phòng chống tệ nạn xã hội.",
        },
      ],
    },
    {
      stt: 6,
      ten: "Bảo tồn cảnh quan thiên nhiên",
      hoat_dong: [
        {
          stt: 1,
          ten: "Tìm hiểu về danh lam thắng cảnh và cảnh quan thiên nhiên",
          mo_ta:
            "Thu thập thông tin, hình ảnh về các di sản thiên nhiên tại địa phương và thực trạng bảo tồn hiện nay.",
        },
        {
          stt: 2,
          ten: "Lập kế hoạch bảo tồn cảnh quan thiên nhiên",
          mo_ta:
            "Đề xuất các biện pháp cụ thể như hạn chế rác thải nhựa tại điểm du lịch, cắm biển chỉ dẫn bảo vệ môi trường.",
        },
        {
          stt: 3,
          ten: "Thực hiện các hoạt động bảo tồn và quảng bá",
          mo_ta:
            "Tổ chức buổi dọn vệ sinh tại cảnh quan địa phương; viết bài giới thiệu vẻ đẹp thiên nhiên lên mạng xã hội.",
        },
      ],
    },
    {
      stt: 7,
      ten: "Bảo vệ môi trường",
      hoat_dong: [
        {
          stt: 1,
          ten: "Tìm hiểu thực trạng môi trường và tác động của con người",
          mo_ta: "Phân tích nguyên nhân gây ô nhiễm nguồn nước, không khí tại khu vực sinh sống.",
        },
        {
          stt: 2,
          ten: "Đề xuất và thực hiện các biện pháp bảo vệ môi trường",
          mo_ta: "Thực hiện phân loại rác tại nguồn; tự làm các sản phẩm tái chế từ nhựa hoặc giấy vụn.",
        },
        {
          stt: 3,
          ten: "Tuyên truyền, vận động mọi người bảo vệ tài nguyên",
          mo_ta: "Tổ chức hội thảo nhỏ hoặc 'Ngày hội xanh' tại trường để hướng dẫn mọi người tiết kiệm điện, nước.",
        },
      ],
    },
    {
      stt: 8,
      ten: "Các nhóm nghề cơ bản và yêu cầu của thị trường lao động",
      hoat_dong: [
        {
          stt: 1,
          ten: "Tìm hiểu về các nhóm nghề phổ biến",
          mo_ta:
            "Phân loại các nhóm nghề theo lĩnh vực (Kỹ thuật, Kinh tế, Giáo dục,...) và tìm hiểu đặc điểm chính của từng nhóm.",
        },
        {
          stt: 2,
          ten: "Phân tích yêu cầu của thị trường lao động",
          mo_ta:
            "Đọc các bản tin tuyển dụng để xác định yêu cầu về trình độ, kỹ năng mềm (ngoại ngữ, tin học) của các nghề hot.",
        },
        {
          stt: 3,
          ten: "Khám phá các xu hướng nghề nghiệp tương lai",
          mo_ta: "Thảo luận về các nghề nghiệp mới xuất hiện trong thời đại 4.0 như AI, Digital Marketing.",
        },
      ],
    },
    {
      stt: 9,
      ten: "Rèn luyện phẩm chất, năng lực phù hợp với nhóm nghề lựa chọn",
      hoat_dong: [
        {
          stt: 1,
          ten: "Xác định phẩm chất và năng lực cần thiết",
          mo_ta:
            "Đối chiếu yêu cầu của nghề mục tiêu với năng lực hiện tại của bản thân để tìm ra khoảng trống cần bù đắp.",
        },
        {
          stt: 2,
          ten: "Rèn luyện kĩ năng chuyên môn và thái độ làm việc",
          mo_ta: "Tham gia các câu lạc bộ kỹ năng, thực tập làm các dự án mô phỏng công việc thực tế.",
        },
        {
          stt: 3,
          ten: "Tự đánh giá khả năng đáp ứng yêu cầu nghề nghiệp",
          mo_ta: "Thực hiện bảng khảo sát tự đánh giá định kỳ về mức độ tiến bộ trong các kỹ năng nghề nghiệp.",
        },
      ],
    },
    {
      stt: 10,
      ten: "Xây dựng và thực hiện kế hoạch học tập theo hướng ngành, nghề lựa chọn",
      hoat_dong: [
        {
          stt: 1,
          ten: "Xác định mục tiêu học tập và phát triển nghề nghiệp",
          mo_ta: "Đặt mục tiêu điểm số cụ thể cho các môn thi đại học và chứng chỉ nghề nghiệp cần đạt được.",
        },
        {
          stt: 2,
          ten: "Lập kế hoạch học tập chi tiết",
          mo_ta:
            "Xây dựng thời khóa biểu học tập hàng tuần, ưu tiên các môn học thuộc tổ hợp xét tuyển ngành nghề đã chọn.",
        },
        {
          stt: 3,
          ten: "Thực hiện và điều chỉnh kế hoạch học tập",
          mo_ta:
            "Theo dõi kết quả học tập sau mỗi kỳ để điều chỉnh phương pháp học hoặc định hướng chọn trường phù hợp.",
        },
      ],
    },
  ],
}

// ============================================================================
// KHỐI 12 - 10 CHỦ ĐỀ
// ============================================================================

export const KHOI_12_ACTIVITIES: KhoiSGK = {
  khoi: 12,
  chu_de: [
    {
      stt: 1,
      ten: "Phát triển các mối quan hệ tốt đẹp với thầy cô và các bạn",
      hoat_dong: [
        { stt: 1, ten: "Tìm hiểu cách nuôi dưỡng, giữ gìn và mở rộng các mối quan hệ tốt đẹp với thầy cô và bạn bè" },
        { stt: 2, ten: "Tìm hiểu về cách hợp tác với mọi người trong hoạt động chung" },
        { stt: 3, ten: "Thể hiện cách nuôi dưỡng, giữ gìn và mở rộng mối quan hệ tốt đẹp với thầy cô" },
        {
          stt: 4,
          ten: "Thể hiện lập trường, quan điểm phù hợp khi phân tích dư luận xã hội về quan hệ bạn bè trên mạng xã hội",
        },
        {
          stt: 5,
          ten: "Lập và thực hiện kế hoạch hoạt động xây dựng truyền thống nhà trường và hoạt động theo chủ đề của Đoàn Thanh niên Cộng sản Hồ Chí Minh",
        },
        {
          stt: 6,
          ten: "Đánh giá ý nghĩa của hoạt động phát triển các mối quan hệ và xây dựng truyền thống nhà trường đối với cá nhân và tập thể",
        },
        {
          stt: 7,
          ten: "Thể hiện kĩ năng giải quyết mâu thuẫn và nuôi dưỡng, giữ gìn, mở rộng mối quan hệ tốt đẹp với bạn bè",
        },
        {
          stt: 8,
          ten: "Thực hiện các hoạt động phát triển các mối quan hệ tốt đẹp với thầy cô và các bạn trong nhà trường",
        },
      ],
    },
    {
      stt: 2,
      ten: "Tôi trưởng thành",
      hoat_dong: [
        { stt: 1, ten: "Xác định những biểu hiện trưởng thành của cá nhân" },
        { stt: 2, ten: "Tìm hiểu biểu hiện của phẩm chất ý chí và sự đam mê" },
        { stt: 3, ten: "Nhận diện đặc điểm của người có tư duy độc lập" },
        { stt: 4, ten: "Nhận diện khả năng thích ứng với sự thay đổi" },
        { stt: 5, ten: "Thể hiện sự trưởng thành của bản thân trong cuộc sống" },
        { stt: 6, ten: "Giới thiệu đam mê của bản thân" },
        { stt: 7, ten: "Rèn luyện ý chí của bản thân" },
        { stt: 8, ten: "Thể hiện khả năng tư duy độc lập" },
        { stt: 9, ten: "Thể hiện khả năng thích ứng trước sự thay đổi" },
        { stt: 10, ten: "Thể hiện khả năng thích ứng trước sự thay đổi" },
      ],
    },
    {
      stt: 3,
      ten: "Hoàn thiện bản thân",
      hoat_dong: [
        {
          stt: 1,
          ten: "Xác định những biểu hiện về tinh thần trách nhiệm, sự trung thực, tuân thủ nội quy, quy định của pháp luật trong đời sống",
        },
        {
          stt: 2,
          ten: "Tìm hiểu cách thực hiện công việc theo kế hoạch, tuân thủ thời gian và thực hiện cam kết đề ra",
        },
        { stt: 3, ten: "Xác định cách điều chỉnh cảm xúc và ứng xử hợp lí trong những tình huống giao tiếp khác nhau" },
        { stt: 4, ten: "Tìm hiểu về kế hoạch phát triển tài chính phù hợp cho bản thân" },
        { stt: 5, ten: "Thể hiện sự trung thực, tinh thần trách nhiệm trong đời sống" },
        { stt: 6, ten: "Rèn luyện thói quen tuân thủ nội quy, quy định của pháp luật trong đời sống" },
        { stt: 7, ten: "Thực hiện công việc theo kế hoạch, tuân thủ thời gian và cam kết đề ra" },
        { stt: 8, ten: "Thực hành điều chỉnh cảm xúc và ứng xử hợp lí trong các tình huống giao tiếp khác nhau" },
        { stt: 9, ten: "Lập và thực hiện kế hoạch phát triển tài chính của bản thân" },
        { stt: 10, ten: "Tự hoàn thiện bản thân" },
      ],
    },
    {
      stt: 4,
      ten: "Trách nhiệm với gia đình",
      hoat_dong: [
        {
          stt: 1,
          ten: "Tìm hiểu những việc làm thể hiện sự chủ động tham gia giải quyết những vấn đề nảy sinh trong gia đình",
        },
        {
          stt: 2,
          ten: "Tìm hiểu vai trò, trách nhiệm của bản thân trong việc tổ chức cuộc sống gia đình và thấy được giá trị gia đình đối với cá nhân và xã hội",
        },
        {
          stt: 3,
          ten: "Tìm hiểu ảnh hưởng của thu nhập thực tế, quyết định chi tiêu và lối sống đến chi phí sinh hoạt trong gia đình",
        },
        { stt: 4, ten: "Thể hiện sự chăm sóc chu đáo đến các thành viên trong gia đình" },
        { stt: 5, ten: "Thể hiện sự chủ động tham gia giải quyết những vấn đề nảy sinh trong gia đình" },
        { stt: 6, ten: "Thể hiện vai trò, trách nhiệm của bản thân trong việc tổ chức cuộc sống gia đình" },
        {
          stt: 7,
          ten: "Phân tích ảnh hưởng của thu nhập thực tế, quyết định chi tiêu và lối sống đến chi phí sinh hoạt trong gia đình em",
        },
        { stt: 8, ten: "Thể hiện trách nhiệm đối với gia đình" },
      ],
    },
    {
      stt: 5,
      ten: "Xây dựng cộng đồng",
      hoat_dong: [
        {
          stt: 1,
          ten: "Tìm hiểu biểu hiện của sự chủ động và tự tin thiết lập các mối quan hệ xã hội, sẵn sàng chia sẻ giúp đỡ cộng đồng",
        },
        { stt: 2, ten: "Tìm hiểu các hoạt động giáo dục tình đoàn kết dân tộc, hoà bình, hữu nghị" },
        { stt: 3, ten: "Tìm hiểu các hoạt động giáo dục tình đoàn kết dân tộc, hoà bình, hữu nghị" },
        {
          stt: 4,
          ten: "Thể hiện sự chủ động, tự tin trong thiết lập các mối quan hệ xã hội và sẵn sàng chia sẻ giúp đỡ cộng đồng",
        },
        { stt: 5, ten: "Thực hiện hoạt động khám phá các nền văn hoá khác nhau" },
        {
          stt: 6,
          ten: "Thể hiện sự hứng thú, ham hiểu biết khi khám phá các nền văn hoá khác nhau và thái độ tôn trọng sự khác biệt giữa các nền văn hoá",
        },
        { stt: 7, ten: "Thực hiện hoạt động giáo dục tình đoàn kết dân tộc, hoà bình, hữu nghị" },
        { stt: 8, ten: "Lập và thực hiện kế hoạch dự án hoạt động tình nguyện nhân đạo và biện pháp quản lí dự án" },
        { stt: 9, ten: "Đánh giá ý nghĩa của hoạt động xã hội" },
        { stt: 10, ten: "Tham gia các hoạt động xây dựng cộng đồng nơi em sinh sống" },
      ],
    },
    {
      stt: 6,
      ten: "Chung tay gìn giữ, bảo tồn cảnh quan thiên nhiên",
      hoat_dong: [
        { stt: 1, ten: "Tìm hiểu các giải pháp tích cực, sáng tạo trong việc bảo tồn cảnh quan thiên nhiên" },
        {
          stt: 2,
          ten: "Tìm hiểu về hoạt động tuyên truyền trong cộng đồng về ý nghĩa cảnh quan thiên nhiên và hành động chung tay giữ gìn cảnh quan thiên nhiên",
        },
        { stt: 3, ten: "Đánh giá thực trạng bảo tồn một số danh lam thắng cảnh ở địa phương" },
        {
          stt: 4,
          ten: "Đề xuất và thực hiện các giải pháp tích cực, sáng tạo trong việc bảo tồn cảnh quan thiên nhiên",
        },
        {
          stt: 5,
          ten: "Thực hiện tuyên truyền trong cộng đồng về ý nghĩa cảnh quan thiên nhiên và hành động chung tay giữ gìn cảnh quan thiên nhiên",
        },
        { stt: 6, ten: "Thực hiện các việc làm bảo tồn cảnh quan thiên nhiên ở địa phương" },
      ],
    },
    {
      stt: 7,
      ten: "Bảo vệ thế giới tự nhiên",
      hoat_dong: [
        { stt: 1, ten: "Nhận diện hành vi, việc làm bảo tồn thế giới tự nhiên và động vật hoang dã" },
        {
          stt: 2,
          ten: "Lập và thực hiện kế hoạch khảo sát thực trạng thế giới động, thực vật và bảo vệ thế giới động, thực vật ở địa phương",
        },
        {
          stt: 3,
          ten: "Nhận xét, đánh giá những hành vi, việc làm của tổ chức, cá nhân trong việc bảo tồn thế giới tự nhiên và động vật hoang dã",
        },
        {
          stt: 4,
          ten: "Nhận xét, đánh giá những hành vi, việc làm của tổ chức, cá nhân trong việc bảo tồn thế giới tự nhiên và động vật hoang dã",
        },
        { stt: 5, ten: "Tuyên truyền các biện pháp bảo vệ thế giới động, thực vật" },
        { stt: 6, ten: "Lập và thực hiện kế hoạch bảo vệ thế giới động, thực vật tại địa phương" },
      ],
    },
    {
      stt: 8,
      ten: "Nghề nghiệp và những yêu cầu với người lao động trong xã hội hiện đại",
      hoat_dong: [
        { stt: 1, ten: "Tìm hiểu về xu hướng phát triển nghề nghiệp trong xã hội hiện đại" },
        { stt: 2, ten: "Xác định những phẩm chất, năng lực cần có của người lao động trong xã hội hiện đại" },
        { stt: 3, ten: "Tìm hiểu biểu hiện của tính chuyên nghiệp trong công việc" },
        { stt: 4, ten: "Tìm hiểu yêu cầu về đảm bảo an toàn và sức khỏe nghề nghiệp" },
        { stt: 5, ten: "Rèn luyện tính chuyên nghiệp trong công việc" },
        { stt: 6, ten: "Đề xuất biện pháp đảm bảo yêu cầu về an toàn và sức khỏe nghề nghiệp" },
        { stt: 7, ten: "Phân tích những yêu cầu đối với nghề trong xã hội hiện đại mà em quan tâm" },
        {
          stt: 8,
          ten: "Thực hành phân tích thông tin cơ bản về thị trường lao động, nhu cầu sử dụng của thị trường lao động",
        },
        { stt: 9, ten: "Trải nghiệm thực tế nghề nghiệp" },
      ],
    },
    {
      stt: 9,
      ten: "Rèn luyện phẩm chất, năng lực phù hợp với định hướng nghề nghiệp",
      hoat_dong: [
        { stt: 1, ten: "Xác định những nhóm nghề/nghề phù hợp với khả năng, sở thích của bản thân" },
        { stt: 2, ten: "Tìm hiểu các yếu tố tác động đến việc chuyển đổi nghề" },
        {
          stt: 3,
          ten: "Tìm hiểu những phẩm chất, năng lực người lao động cần có để có thể chuyển đổi nghề khi cần thiết",
        },
        {
          stt: 4,
          ten: "Xác định những phẩm chất, năng lực, hứng thú, sở trường của bản thân phù hợp với nghề định lựa chọn",
        },
        {
          stt: 5,
          ten: "Đánh giá phẩm chất, năng lực của bản thân so với yêu cầu để có thể chuyển đổi nghề khi cần thiết",
        },
        {
          stt: 6,
          ten: "Rèn luyện phẩm chất, năng lực của bản thân phù hợp với nghề định lựa chọn và có thể chuyển đổi nghề khi cần thiết",
        },
        { stt: 7, ten: "Thể hiện sự tự tin về bản thân và tự tin với định hướng nghề nghiệp của mình" },
        {
          stt: 8,
          ten: "Rèn luyện phẩm chất, năng lực của bản thân trong học tập và cuộc sống để bước vào thế giới nghề nghiệp",
        },
      ],
    },
    {
      stt: 10,
      ten: "Quyết định lựa chọn nghề phù hợp và chuẩn bị tâm lý thích ứng với môi trường",
      hoat_dong: [
        { stt: 1, ten: "Tìm hiểu cách thức chuẩn bị tâm lí thích ứng với môi trường làm việc và học tập tương lai" },
        {
          stt: 2,
          ten: "Tìm hiểu về tâm thế sẵn sàng bước vào thế giới nghề nghiệp, tham gia và hòa nhập với lực lượng lao động xã hội",
        },
        { stt: 3, ten: "Tìm hiểu về bản lĩnh thực hiện đam mê theo đuổi nghề yêu thích" },
        {
          stt: 4,
          ten: "Phân tích và xử lí các thông tin nghề nghiệp, thông tin về các cơ sở giáo dục đại học và giáo dục nghề nghiệp",
        },
        {
          stt: 5,
          ten: "Thể hiện tâm thế sẵn sàng bước vào thế giới nghề nghiệp và hoà nhập với lực lượng lao động xã hội",
        },
        { stt: 6, ten: "Quyết định chọn nghề, chọn ngành học, chọn trường của bản thân" },
        { stt: 7, ten: "Thể hiện bản lĩnh, đam mê theo đuổi nghề yêu thích" },
        { stt: 8, ten: "Trải nghiệm thực tế và chuẩn bị tâm thế bước vào nghề nghiệp tương lai" },
      ],
    },
  ],
}

// ============================================================================
// HÀM TRUY XUẤT DỮ LIỆU
// ============================================================================

/**
 * Lấy danh sách hoạt động theo khối và chủ đề
 */
export function getHoatDongTheoChuDe(khoi: 10 | 11 | 12, sttChuDe: number): HoatDong[] {
  const khoiData = khoi === 10 ? KHOI_10_ACTIVITIES : khoi === 11 ? KHOI_11_ACTIVITIES : KHOI_12_ACTIVITIES
  const chuDe = khoiData.chu_de.find((cd) => cd.stt === sttChuDe)
  return chuDe?.hoat_dong || []
}

/**
 * Lấy chủ đề theo khối và số thứ tự
 */
export function getChuDeTheoSTT(khoi: 10 | 11 | 12, sttChuDe: number): ChuDeSGK | undefined {
  const khoiData = khoi === 10 ? KHOI_10_ACTIVITIES : khoi === 11 ? KHOI_11_ACTIVITIES : KHOI_12_ACTIVITIES
  return khoiData.chu_de.find((cd) => cd.stt === sttChuDe)
}

/**
 * Lấy tất cả chủ đề của một khối
 */
export function getAllChuDeByKhoi(khoi: 10 | 11 | 12): ChuDeSGK[] {
  const khoiData = khoi === 10 ? KHOI_10_ACTIVITIES : khoi === 11 ? KHOI_11_ACTIVITIES : KHOI_12_ACTIVITIES
  return khoiData.chu_de
}

/**
 * Tìm kiếm hoạt động theo từ khóa
 */
export function timKiemHoatDong(
  tuKhoa: string,
  khoi?: 10 | 11 | 12,
): Array<{ khoi: number; chuDe: string; hoatDong: HoatDong }> {
  const ketQua: Array<{ khoi: number; chuDe: string; hoatDong: HoatDong }> = []
  const tuKhoaLower = tuKhoa.toLowerCase()

  const khoiList = khoi ? [khoi] : ([10, 11, 12] as const)

  for (const k of khoiList) {
    const khoiData = k === 10 ? KHOI_10_ACTIVITIES : k === 11 ? KHOI_11_ACTIVITIES : KHOI_12_ACTIVITIES
    for (const chuDe of khoiData.chu_de) {
      for (const hoatDong of chuDe.hoat_dong) {
        if (hoatDong.ten.toLowerCase().includes(tuKhoaLower)) {
          ketQua.push({
            khoi: k,
            chuDe: chuDe.ten,
            hoatDong,
          })
        }
      }
    }
  }

  return ketQua
}

/**
 * Mapping tháng sang chủ đề (dựa trên PPCT chuẩn)
 */
export const THANG_CHU_DE_MAP: Record<number, Record<number, number[]>> = {
  10: {
    9: [1], // Tháng 9: Chủ đề 1
    10: [2], // Tháng 10: Chủ đề 2
    11: [3], // Tháng 11: Chủ đề 3
    12: [4], // Tháng 12: Chủ đề 4
    1: [5], // Tháng 1: Chủ đề 5
    2: [6], // Tháng 2: Chủ đề 6
    3: [7, 8], // Tháng 3: Chủ đề 7, 8
    4: [9, 10], // Tháng 4: Chủ đề 9, 10
    5: [11], // Tháng 5: Chủ đề 11
  },
  11: {
    9: [1],
    10: [2],
    11: [3],
    12: [4],
    1: [5],
    2: [6],
    3: [7],
    4: [8, 9],
    5: [10],
  },
  12: {
    9: [1],
    10: [2],
    11: [3],
    12: [4],
    1: [5],
    2: [6],
    3: [7],
    4: [8, 9],
    5: [10],
  },
}

/**
 * Lấy chủ đề theo tháng
 */
export function getChuDeTheoThangFromActivities(khoi: 10 | 11 | 12, thang: number): ChuDeSGK[] {
  const chuDeSTTs = THANG_CHU_DE_MAP[khoi]?.[thang] || []
  return chuDeSTTs.map((stt) => getChuDeTheoSTT(khoi, stt)).filter((cd): cd is ChuDeSGK => cd !== undefined)
}

/**
 * Lấy nhiệm vụ/hoạt động theo khối và tên chủ đề
 * Dùng cho template-engine để hiển thị gợi ý nhiệm vụ
 */
export function getCurriculumTasksByTopic(khoi: 10 | 11 | 12, tenChuDe: string): HoatDong[] {
  const khoiData = khoi === 10 ? KHOI_10_ACTIVITIES : khoi === 11 ? KHOI_11_ACTIVITIES : KHOI_12_ACTIVITIES

  // Tìm chủ đề theo tên (so sánh không phân biệt chữ hoa/thường)
  const tenChuDeLower = tenChuDe.toLowerCase().trim()
  const chuDe = khoiData.chu_de.find(
    (cd) =>
      cd.ten.toLowerCase().includes(tenChuDeLower) ||
      tenChuDeLower.includes(cd.ten.toLowerCase()) ||
      // So sánh theo số chủ đề nếu có format "Chủ đề X"
      tenChuDe.match(/chủ đề\s*(\d+)/i)?.[1] === String(cd.stt),
  )

  return chuDe?.hoat_dong || []
}

/**
 * Lấy thông tin chủ đề đầy đủ theo khối và tên
 */
export function getChuDeByName(khoi: 10 | 11 | 12, tenChuDe: string): ChuDeSGK | undefined {
  const khoiData = khoi === 10 ? KHOI_10_ACTIVITIES : khoi === 11 ? KHOI_11_ACTIVITIES : KHOI_12_ACTIVITIES

  const tenChuDeLower = tenChuDe.toLowerCase().trim()
  return khoiData.chu_de.find(
    (cd) =>
      cd.ten.toLowerCase().includes(tenChuDeLower) ||
      tenChuDeLower.includes(cd.ten.toLowerCase()) ||
      tenChuDe.match(/chủ đề\s*(\d+)/i)?.[1] === String(cd.stt),
  )
}

/**
 * Export tất cả
 */
export const KNTT_ACTIVITIES_DATABASE = {
  khoi10: KHOI_10_ACTIVITIES,
  khoi11: KHOI_11_ACTIVITIES,
  khoi12: KHOI_12_ACTIVITIES,
  getHoatDongTheoChuDe,
  getChuDeTheoSTT,
  getAllChuDeByKhoi,
  getCurriculumTasksByTopic,
  getChuDeByName,
  timKiemHoatDong,
  getChuDeTheoThangFromActivities,
}
