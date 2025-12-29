/**
 * CƠ SỞ DỮ LIỆU NĂNG LỰC SỐ (NLS)
 * Theo Thông tư 02/2025/TT-BGDĐT - Bộ Giáo dục và Đào tạo
 * Cập nhật: 2025
 */

// Interface định nghĩa cấu trúc năng lực số
export interface NangLucThanhPhan {
  ma: string // VD: "1.1", "2.3", "4.2"
  ten: string
  mo_ta: string
  chi_bao: string[] // Các chỉ báo cụ thể
  vi_du_tich_hop: string[] // Ví dụ cách tích hợp vào bài học
  chu_de_phu_hop: string[] // Các loại chủ đề phù hợp
}

export interface MienNangLuc {
  ma: string // VD: "I", "II"
  ten: string
  mo_ta: string
  nang_luc_thanh_phan: NangLucThanhPhan[]
}

// 6 MIỀN NĂNG LỰC SỐ THEO THÔNG TƯ 02/2025
export const KHUNG_NANG_LUC_SO: MienNangLuc[] = [
  {
    ma: "I",
    ten: "Khai thác dữ liệu và thông tin",
    mo_ta: "Xác định nhu cầu thông tin, truy xuất, đánh giá, lưu trữ và quản lý dữ liệu, thông tin số",
    nang_luc_thanh_phan: [
      {
        ma: "1.1",
        ten: "Duyệt, tìm kiếm và lọc dữ liệu, thông tin và nội dung số",
        mo_ta: "Xác định nhu cầu thông tin, tìm kiếm dữ liệu trong môi trường số, lọc và đánh giá kết quả tìm kiếm",
        chi_bao: [
          "Xác định được nhu cầu thông tin cần tìm kiếm",
          "Sử dụng từ khóa hiệu quả khi tìm kiếm",
          "Sử dụng các công cụ tìm kiếm phổ biến (Google, Bing)",
          "Lọc kết quả tìm kiếm theo tiêu chí phù hợp",
          "Sử dụng tìm kiếm nâng cao",
        ],
        vi_du_tich_hop: [
          "HS tìm kiếm thông tin về xu hướng nghề nghiệp trên Internet",
          "HS tra cứu thông tin về các trường đại học, cao đẳng",
          "HS tìm kiếm video hướng dẫn kỹ năng cần thiết",
        ],
        chu_de_phu_hop: ["Nghề nghiệp", "Hướng nghiệp", "Học tập"],
      },
      {
        ma: "1.2",
        ten: "Đánh giá dữ liệu, thông tin và nội dung số",
        mo_ta: "Phân tích, so sánh và đánh giá độ tin cậy của nguồn thông tin và nội dung số",
        chi_bao: [
          "Xác định được nguồn gốc thông tin",
          "Đánh giá độ tin cậy của nguồn thông tin",
          "Phân biệt thông tin chính thống và tin giả",
          "So sánh thông tin từ nhiều nguồn khác nhau",
          "Nhận biết thông tin sai lệch, thiên vị",
        ],
        vi_du_tich_hop: [
          "HS đánh giá độ tin cậy của thông tin về sản phẩm tài chính",
          "HS phân biệt tin tức thật/giả về sức khỏe",
          "HS kiểm chứng thông tin trước khi chia sẻ",
        ],
        chu_de_phu_hop: ["Tài chính", "Gia đình", "Cộng đồng", "An toàn"],
      },
      {
        ma: "1.3",
        ten: "Quản lý dữ liệu, thông tin và nội dung số",
        mo_ta: "Tổ chức, lưu trữ và truy xuất dữ liệu, thông tin trong môi trường số",
        chi_bao: [
          "Tổ chức file và thư mục khoa học",
          "Sử dụng lưu trữ đám mây (Google Drive, OneDrive)",
          "Sao lưu dữ liệu quan trọng",
          "Đặt tên file có hệ thống",
          "Chia sẻ dữ liệu an toàn",
        ],
        vi_du_tich_hop: [
          "HS tạo thư mục lưu trữ hồ sơ cá nhân trên Drive",
          "HS sao lưu bài tập, tài liệu học tập",
          "HS tổ chức portfolio kỹ năng số",
        ],
        chu_de_phu_hop: ["Bản thân", "Học tập", "Nghề nghiệp"],
      },
    ],
  },
  {
    ma: "II",
    ten: "Giao tiếp và hợp tác trong môi trường số",
    mo_ta: "Tương tác, giao tiếp, hợp tác qua công nghệ số, thực hiện quyền công dân và quản lý danh tính số",
    nang_luc_thanh_phan: [
      {
        ma: "2.1",
        ten: "Tương tác thông qua công nghệ số",
        mo_ta: "Sử dụng các công cụ giao tiếp số để tương tác với người khác",
        chi_bao: [
          "Sử dụng email, tin nhắn chuyên nghiệp",
          "Tham gia hội họp trực tuyến (Zoom, Meet)",
          "Giao tiếp qua mạng xã hội có văn hóa",
          "Chọn kênh giao tiếp phù hợp với mục đích",
        ],
        vi_du_tich_hop: [
          "HS viết email xin tư vấn nghề nghiệp",
          "HS tham gia họp nhóm trực tuyến làm dự án",
          "HS tham gia diễn đàn học tập online",
        ],
        chu_de_phu_hop: ["Giao tiếp", "Bạn bè", "Thầy cô", "Nghề nghiệp"],
      },
      {
        ma: "2.2",
        ten: "Chia sẻ thông tin và nội dung thông qua công nghệ số",
        mo_ta: "Chia sẻ dữ liệu, thông tin và nội dung số với người khác",
        chi_bao: [
          "Chia sẻ tài liệu qua Google Drive, OneDrive",
          "Đăng bài có trách nhiệm trên mạng xã hội",
          "Sử dụng công cụ trình chiếu để chia sẻ kiến thức",
          "Trích dẫn nguồn khi chia sẻ thông tin",
        ],
        vi_du_tich_hop: [
          "HS chia sẻ kết quả nghiên cứu về môi trường lên nhóm lớp",
          "HS tạo bài đăng tuyên truyền bảo vệ động vật",
          "HS chia sẻ kinh nghiệm học tập với bạn bè",
        ],
        chu_de_phu_hop: ["Cộng đồng", "Môi trường", "Học tập"],
      },
      {
        ma: "2.3",
        ten: "Sử dụng công nghệ số để thực hiện trách nhiệm công dân",
        mo_ta: "Tham gia các hoạt động xã hội và thực hiện quyền công dân qua công nghệ số",
        chi_bao: [
          "Sử dụng dịch vụ công trực tuyến",
          "Tham gia hoạt động tình nguyện online",
          "Phản ánh vấn đề xã hội qua kênh chính thống",
          "Tham gia các chiến dịch cộng đồng trực tuyến",
        ],
        vi_du_tich_hop: [
          "HS tìm hiểu và sử dụng cổng dịch vụ công quốc gia",
          "HS tham gia chiến dịch môi trường online",
          "HS đóng góp ý kiến cho địa phương qua app",
        ],
        chu_de_phu_hop: ["Cộng đồng", "Xã hội", "Công dân"],
      },
      {
        ma: "2.4",
        ten: "Hợp tác thông qua công nghệ số",
        mo_ta: "Sử dụng công nghệ số để làm việc nhóm và cộng tác",
        chi_bao: [
          "Sử dụng Google Docs để soạn thảo nhóm",
          "Quản lý dự án nhóm bằng Trello, Notion",
          "Phân công và theo dõi tiến độ công việc online",
          "Đóng góp ý kiến và phản hồi trong nhóm",
        ],
        vi_du_tich_hop: [
          "HS làm dự án nhóm trên Google Docs",
          "HS tổ chức hoạt động ngoại khóa bằng Trello",
          "HS cùng xây dựng sản phẩm số về chủ đề gia đình",
        ],
        chu_de_phu_hop: ["Hợp tác", "Dự án", "Làm việc nhóm"],
      },
      {
        ma: "2.5",
        ten: "Thực hiện quy tắc ứng xử trên mạng",
        mo_ta: "Nhận thức và tuân thủ các chuẩn mực đạo đức khi giao tiếp trên môi trường số",
        chi_bao: [
          "Giao tiếp lịch sự, tôn trọng trên mạng",
          "Không bắt nạt, xúc phạm người khác online",
          "Tôn trọng quyền riêng tư của người khác",
          "Phản ứng đúng mực với hành vi tiêu cực trên mạng",
        ],
        vi_du_tich_hop: [
          "HS thảo luận về văn hóa ứng xử trên mạng xã hội",
          "HS xử lý tình huống bị bắt nạt online",
          "HS cam kết ứng xử có văn hóa trên mạng",
        ],
        chu_de_phu_hop: ["Bản thân", "Giao tiếp", "An toàn", "Đạo đức"],
      },
      {
        ma: "2.6",
        ten: "Quản lý danh tính số",
        mo_ta: "Tạo lập và quản lý danh tính số, bảo vệ danh tiếng trên môi trường số",
        chi_bao: [
          "Tạo profile chuyên nghiệp trên các nền tảng",
          "Quản lý thông tin cá nhân công khai",
          "Xây dựng hình ảnh tích cực trên mạng",
          "Kiểm soát dấu chân số của bản thân",
        ],
        vi_du_tich_hop: [
          "HS tạo CV online, LinkedIn cá nhân",
          "HS rà soát và cập nhật thông tin mạng xã hội",
          "HS xây dựng thương hiệu cá nhân online",
        ],
        chu_de_phu_hop: ["Bản thân", "Nghề nghiệp", "Trưởng thành"],
      },
    ],
  },
  {
    ma: "III",
    ten: "Sáng tạo nội dung số",
    mo_ta: "Tạo lập, biên tập, tích hợp nội dung số và hiểu về bản quyền, giấy phép",
    nang_luc_thanh_phan: [
      {
        ma: "3.1",
        ten: "Phát triển nội dung số",
        mo_ta: "Tạo lập và biên tập nội dung số ở các định dạng khác nhau",
        chi_bao: [
          "Tạo văn bản, bài trình chiếu",
          "Thiết kế poster, infographic bằng Canva",
          "Quay và chỉnh sửa video đơn giản",
          "Tạo bài đăng mạng xã hội hấp dẫn",
        ],
        vi_du_tich_hop: [
          "HS thiết kế poster tuyên truyền bảo vệ môi trường",
          "HS tạo video giới thiệu nghề nghiệp",
          "HS làm infographic về kế hoạch tài chính",
        ],
        chu_de_phu_hop: ["Môi trường", "Cộng đồng", "Nghề nghiệp", "Tuyên truyền"],
      },
      {
        ma: "3.2",
        ten: "Tích hợp và tạo lập lại nội dung số",
        mo_ta: "Chỉnh sửa, kết hợp các nội dung số có sẵn để tạo nội dung mới",
        chi_bao: [
          "Chỉnh sửa hình ảnh cơ bản",
          "Kết hợp nhiều nguồn để tạo sản phẩm mới",
          "Remix nội dung có trách nhiệm",
          "Tạo sản phẩm có tính sáng tạo",
        ],
        vi_du_tich_hop: [
          "HS ghép ảnh, video để làm clip về gia đình",
          "HS tổng hợp thông tin thành bài thuyết trình",
          "HS tạo album ảnh kỷ niệm số",
        ],
        chu_de_phu_hop: ["Gia đình", "Cộng đồng", "Sáng tạo"],
      },
      {
        ma: "3.3",
        ten: "Thực thi bản quyền và giấy phép",
        mo_ta: "Hiểu và tuân thủ quy định về bản quyền khi sử dụng nội dung số",
        chi_bao: [
          "Hiểu khái niệm bản quyền nội dung số",
          "Sử dụng tài nguyên có giấy phép phù hợp",
          "Trích dẫn nguồn đúng cách",
          "Tôn trọng quyền sở hữu trí tuệ",
        ],
        vi_du_tich_hop: [
          "HS sử dụng hình ảnh miễn phí bản quyền",
          "HS trích dẫn nguồn khi làm bài thuyết trình",
          "HS tìm hiểu về Creative Commons",
        ],
        chu_de_phu_hop: ["Học tập", "Sáng tạo", "Đạo đức"],
      },
      {
        ma: "3.4",
        ten: "Lập trình",
        mo_ta: "Hiểu và áp dụng tư duy lập trình để giải quyết vấn đề",
        chi_bao: [
          "Hiểu tư duy thuật toán cơ bản",
          "Sử dụng công cụ lập trình kéo thả (Scratch)",
          "Viết code đơn giản",
          "Tự động hóa các tác vụ lặp lại",
        ],
        vi_du_tich_hop: [
          "HS tạo game giáo dục về môi trường bằng Scratch",
          "HS tự động hóa báo cáo bằng Google Sheets",
          "HS xây dựng chatbot hỏi đáp đơn giản",
        ],
        chu_de_phu_hop: ["Nghề nghiệp", "Giải quyết vấn đề", "Sáng tạo"],
      },
    ],
  },
  {
    ma: "IV",
    ten: "An toàn",
    mo_ta: "Bảo vệ thiết bị, nội dung số, dữ liệu cá nhân, sức khỏe và môi trường",
    nang_luc_thanh_phan: [
      {
        ma: "4.1",
        ten: "Bảo vệ thiết bị",
        mo_ta: "Bảo vệ thiết bị và nội dung số khỏi các nguy cơ",
        chi_bao: [
          "Cài đặt và cập nhật phần mềm diệt virus",
          "Nhận biết và tránh phần mềm độc hại",
          "Sử dụng mật khẩu mạnh",
          "Cập nhật hệ điều hành thường xuyên",
        ],
        vi_du_tich_hop: [
          "HS thực hành bảo vệ điện thoại, máy tính",
          "HS tạo mật khẩu mạnh cho tài khoản",
          "HS nhận biết email lừa đảo",
        ],
        chu_de_phu_hop: ["An toàn", "Bản thân", "Công nghệ"],
      },
      {
        ma: "4.2",
        ten: "Bảo vệ dữ liệu cá nhân và quyền riêng tư",
        mo_ta: "Hiểu và bảo vệ thông tin cá nhân trong môi trường số",
        chi_bao: [
          "Không chia sẻ thông tin nhạy cảm online",
          "Kiểm soát cài đặt quyền riêng tư",
          "Nhận biết các hình thức thu thập dữ liệu",
          "Sử dụng xác thực 2 yếu tố",
        ],
        vi_du_tich_hop: [
          "HS kiểm tra và điều chỉnh cài đặt riêng tư Facebook",
          "HS tìm hiểu về cookie và theo dõi online",
          "HS bảo vệ thông tin tài chính gia đình",
        ],
        chu_de_phu_hop: ["An toàn", "Tài chính", "Gia đình", "Bản thân"],
      },
      {
        ma: "4.3",
        ten: "Bảo vệ sức khỏe và tinh thần",
        mo_ta: "Nhận biết và giảm thiểu rủi ro sức khỏe khi sử dụng công nghệ số",
        chi_bao: [
          "Quản lý thời gian sử dụng thiết bị",
          "Tư thế ngồi đúng khi sử dụng máy tính",
          "Nhận biết dấu hiệu nghiện công nghệ",
          "Cân bằng giữa online và offline",
        ],
        vi_du_tich_hop: [
          "HS lập kế hoạch sử dụng điện thoại hợp lý",
          "HS thảo luận về cân bằng cuộc sống số",
          "HS cam kết giảm thời gian màn hình",
        ],
        chu_de_phu_hop: ["Bản thân", "Sức khỏe", "Rèn luyện"],
      },
      {
        ma: "4.4",
        ten: "Bảo vệ môi trường",
        mo_ta: "Nhận biết tác động của công nghệ số đến môi trường và hành động bảo vệ",
        chi_bao: [
          "Tiết kiệm năng lượng khi sử dụng thiết bị",
          "Xử lý rác thải điện tử đúng cách",
          "Sử dụng công nghệ xanh",
          "Giảm thiểu dấu chân carbon số",
        ],
        vi_du_tich_hop: [
          "HS tìm hiểu về rác thải điện tử",
          "HS thực hành tiết kiệm năng lượng",
          "HS tuyên truyền về công nghệ xanh",
        ],
        chu_de_phu_hop: ["Môi trường", "Thiên nhiên", "Cộng đồng"],
      },
    ],
  },
  {
    ma: "V",
    ten: "Giải quyết vấn đề",
    mo_ta: "Xác định nhu cầu và vấn đề công nghệ, sử dụng công cụ số để giải quyết",
    nang_luc_thanh_phan: [
      {
        ma: "5.1",
        ten: "Giải quyết vấn đề kĩ thuật",
        mo_ta: "Xác định và giải quyết các vấn đề kỹ thuật khi sử dụng thiết bị số",
        chi_bao: [
          "Xác định được vấn đề kỹ thuật cơ bản",
          "Tìm giải pháp qua tìm kiếm online",
          "Thực hiện các bước khắc phục sự cố",
          "Biết khi nào cần nhờ hỗ trợ",
        ],
        vi_du_tich_hop: [
          "HS tự khắc phục lỗi phần mềm đơn giản",
          "HS tìm hướng dẫn trên YouTube để sửa lỗi",
          "HS hỗ trợ bạn bè xử lý vấn đề công nghệ",
        ],
        chu_de_phu_hop: ["Giải quyết vấn đề", "Tự chủ", "Học tập"],
      },
      {
        ma: "5.2",
        ten: "Xác định nhu cầu và giải pháp công nghệ",
        mo_ta: "Đánh giá nhu cầu và lựa chọn công cụ số phù hợp",
        chi_bao: [
          "Xác định nhu cầu cần giải quyết",
          "Tìm kiếm công cụ số phù hợp",
          "So sánh các giải pháp công nghệ",
          "Lựa chọn công cụ tối ưu",
        ],
        vi_du_tich_hop: [
          "HS chọn app quản lý tài chính cá nhân",
          "HS tìm công cụ học ngoại ngữ phù hợp",
          "HS chọn nền tảng làm việc nhóm hiệu quả",
        ],
        chu_de_phu_hop: ["Tài chính", "Học tập", "Nghề nghiệp"],
      },
      {
        ma: "5.3",
        ten: "Sử dụng công nghệ một cách sáng tạo",
        mo_ta: "Sử dụng công nghệ số để tạo ra giải pháp và sản phẩm mới",
        chi_bao: [
          "Áp dụng công nghệ theo cách mới",
          "Kết hợp nhiều công cụ để giải quyết vấn đề",
          "Tạo ra sản phẩm số sáng tạo",
          "Chia sẻ giải pháp với cộng đồng",
        ],
        vi_du_tich_hop: [
          "HS tạo app đơn giản hỗ trợ học tập",
          "HS thiết kế website giới thiệu địa phương",
          "HS tạo podcast về chủ đề quan tâm",
        ],
        chu_de_phu_hop: ["Sáng tạo", "Cộng đồng", "Nghề nghiệp"],
      },
      {
        ma: "5.4",
        ten: "Xác định khoảng trống năng lực số",
        mo_ta: "Đánh giá và phát triển năng lực số của bản thân",
        chi_bao: [
          "Tự đánh giá năng lực số hiện có",
          "Xác định điểm mạnh/yếu",
          "Lập kế hoạch học tập cải thiện",
          "Cập nhật kiến thức công nghệ thường xuyên",
        ],
        vi_du_tich_hop: [
          "HS tự đánh giá năng lực số qua bảng kiểm",
          "HS lập kế hoạch học kỹ năng số mới",
          "HS theo dõi tiến bộ năng lực số",
        ],
        chu_de_phu_hop: ["Bản thân", "Rèn luyện", "Phát triển"],
      },
    ],
  },
  {
    ma: "VI",
    ten: "Ứng dụng AI",
    mo_ta: "Hiểu và sử dụng trí tuệ nhân tạo có trách nhiệm",
    nang_luc_thanh_phan: [
      {
        ma: "6.1",
        ten: "Nhận biết AI",
        mo_ta: "Hiểu khái niệm cơ bản và nhận biết ứng dụng AI trong cuộc sống",
        chi_bao: [
          "Hiểu AI là gì và hoạt động như thế nào",
          "Nhận biết AI trong các ứng dụng hàng ngày",
          "Phân biệt được AI với phần mềm thông thường",
          "Hiểu khả năng và giới hạn của AI",
        ],
        vi_du_tich_hop: [
          "HS tìm hiểu AI trong trợ lý ảo (Siri, Google Assistant)",
          "HS nhận biết AI trong gợi ý YouTube, TikTok",
          "HS thảo luận về AI trong tương lai nghề nghiệp",
        ],
        chu_de_phu_hop: ["Nghề nghiệp", "Công nghệ", "Tương lai"],
      },
      {
        ma: "6.2",
        ten: "Sử dụng AI",
        mo_ta: "Sử dụng các công cụ AI để hỗ trợ học tập và công việc",
        chi_bao: [
          "Sử dụng ChatGPT, Gemini hỗ trợ học tập",
          "Dùng AI tạo hình ảnh, thiết kế",
          "Sử dụng AI dịch thuật, tóm tắt văn bản",
          "Áp dụng AI trong các tác vụ hàng ngày",
        ],
        vi_du_tich_hop: [
          "HS sử dụng AI để tìm hiểu chủ đề học tập",
          "HS dùng AI hỗ trợ thiết kế poster",
          "HS sử dụng AI để luyện ngoại ngữ",
        ],
        chu_de_phu_hop: ["Học tập", "Sáng tạo", "Nghề nghiệp"],
      },
      {
        ma: "6.3",
        ten: "Sử dụng AI có trách nhiệm",
        mo_ta: "Hiểu và thực hành sử dụng AI một cách có đạo đức và trách nhiệm",
        chi_bao: [
          "Không lệ thuộc hoàn toàn vào AI",
          "Kiểm chứng thông tin từ AI",
          "Hiểu vấn đề đạo đức khi sử dụng AI",
          "Sử dụng AI không vi phạm bản quyền",
        ],
        vi_du_tich_hop: [
          "HS thảo luận về việc dùng AI làm bài tập",
          "HS kiểm tra lại kết quả AI đưa ra",
          "HS sử dụng AI như công cụ hỗ trợ, không thay thế",
        ],
        chu_de_phu_hop: ["Đạo đức", "Học tập", "Trách nhiệm"],
      },
    ],
  },
]

// HƯỚNG DẪN TÍCH HỢP NLS - MỖI CHỦ ĐỀ CHỈ CHỌN 1 NLS
export const HUONG_DAN_TICH_HOP_NLS = {
  quy_tac_chinh: "MỖI CHỦ ĐỀ CHỈ CẦN TÍCH HỢP 1 NỘI DUNG NLS PHÙ HỢP",

  nguyen_tac_chon_nls: [
    "Chọn NLS có liên quan trực tiếp đến nội dung chủ đề",
    "Ưu tiên NLS mà học sinh sẽ THỰC HÀNH được trong bài",
    "Không ép tích hợp NLS nếu không tự nhiên",
    "Tích hợp vào 1-2 hoạt động trong bài, không cần tất cả",
  ],

  goi_y_theo_loai_chu_de: {
    "Ban than - Truong thanh": {
      nls_phu_hop: ["2.6", "4.3", "5.4"],
      ly_do: "Chủ đề bản thân phù hợp với quản lý danh tính số, bảo vệ sức khỏe, tự đánh giá năng lực",
    },
    "Gia dinh - Tai chinh": {
      nls_phu_hop: ["1.2", "4.2", "5.2"],
      ly_do: "Chủ đề gia đình/tài chính phù hợp với đánh giá thông tin, bảo vệ dữ liệu, chọn công cụ quản lý tài chính",
    },
    "Thay co - Ban be": {
      nls_phu_hop: ["2.1", "2.4", "2.5"],
      ly_do: "Chủ đề quan hệ xã hội phù hợp với giao tiếp số, hợp tác, quy tắc ứng xử mạng",
    },
    "Cong dong - Xa hoi": {
      nls_phu_hop: ["2.3", "3.1", "2.2"],
      ly_do: "Chủ đề cộng đồng phù hợp với trách nhiệm công dân số, sáng tạo nội dung tuyên truyền",
    },
    "Moi truong - Thien nhien": {
      nls_phu_hop: ["3.1", "4.4", "2.2"],
      ly_do: "Chủ đề môi trường phù hợp với tạo nội dung tuyên truyền, bảo vệ môi trường số, chia sẻ thông tin",
    },
    "Nghe nghiep - Huong nghiep": {
      nls_phu_hop: ["1.1", "6.1", "6.2", "2.6"],
      ly_do: "Chủ đề nghề nghiệp phù hợp với tìm kiếm thông tin, nhận biết/sử dụng AI, xây dựng profile số",
    },
  },

  cach_tich_hop: {
    hoat_dong_khoi_dong: "Có thể sử dụng công cụ số để khởi động (quiz online, video, game số)",
    hoat_dong_kham_pha: "HS tìm kiếm thông tin bằng công nghệ số, đánh giá nguồn tin",
    hoat_dong_luyen_tap: "HS tạo sản phẩm số (poster, video, bài trình bày)",
    hoat_dong_van_dung: "HS chia sẻ, hợp tác qua nền tảng số, sử dụng AI hỗ trợ",
  },
}

// MỨC ĐỘ NĂNG LỰC SỐ THEO KHỐI LỚP
export const MUC_DO_NLS_THEO_KHOI = {
  CB1: {
    khoi: "Lớp 1, 2, 3",
    ma: "CB1",
    ten: "Cơ bản 1",
    tinh_huong: "Nhiệm vụ đơn giản",
    muc_do_tu_chu: "Với sự hướng dẫn",
    vi_du:
      "Tìm kiếm hình ảnh con vật yêu thích trên Internet - Cần sự hướng dẫn của người lớn để nhập từ khóa, nhấp chuột",
  },
  CB2: {
    khoi: "Lớp 4, 5",
    ma: "CB2",
    ten: "Cơ bản 2",
    tinh_huong: "Nhiệm vụ quen thuộc",
    muc_do_tu_chu: "Tự chủ một phần và có hướng dẫn khi cần thiết",
    vi_du: "Tìm kiếm hình ảnh con vật yêu thích - Tự nhập từ khóa nhưng có thể cần giúp đỡ để lọc kết quả",
  },
  TC1: {
    khoi: "Lớp 6, 7",
    ma: "TC1",
    ten: "Trung cấp 1",
    tinh_huong: "Nhiệm vụ được xác định rõ ràng và quen thuộc, các vấn đề đơn giản",
    muc_do_tu_chu: "Tự chủ",
    vi_du:
      "Tìm kiếm thông tin về 'lịch sử ra đời của Internet' - Học sinh tự mình tìm kiếm và so sánh các thông tin sơ bộ từ các nguồn khác nhau",
  },
  TC2: {
    khoi: "Lớp 8, 9",
    ma: "TC2",
    ten: "Trung cấp 2",
    tinh_huong: "Nhiệm vụ được xác định rõ ràng và không quen thuộc",
    muc_do_tu_chu: "Độc lập theo nhu cầu cá nhân",
    vi_du:
      "Tìm kiếm các nguồn tài liệu ban đầu về ARPANET - Học sinh tự xây dựng kế hoạch tìm kiếm, tổ chức các nguồn tài liệu theo trình tự thời gian",
  },
  NC1: {
    khoi: "Lớp 10, 11, 12",
    ma: "NC1",
    ten: "Nâng cao 1",
    tinh_huong: "Các nhiệm vụ phức tạp, vấn đề mới",
    muc_do_tu_chu: "Tự chủ hoàn toàn, hướng dẫn người khác",
    vi_du:
      "Nghiên cứu và tìm kiếm thông tin về 'Giải pháp ứng dụng AI trong học tập' cho dự án khoa học - Học sinh tự mình lên kế hoạch chi tiết, tự đề xuất các chiến lược tìm kiếm phức tạp và độc đáo, đồng thời có thể hướng dẫn các bạn khác cách tìm kiếm và trích dẫn tài liệu chuẩn xác",
  },
}

// CHI TIẾT CHỈ BÁO THEO MỨC ĐỘ CHO TỪNG NĂNG LỰC THÀNH PHẦN
export const CHI_BAO_THEO_MUC_DO: Record<string, Record<string, string[]>> = {
  "1.1": {
    // Duyệt, tìm kiếm và lọc dữ liệu
    TC1: [
      "a- Giải thích được nhu cầu thông tin",
      "b- Thực hiện được rõ ràng và theo quy trình các tìm kiếm để tìm dữ liệu, thông tin và nội dung trong môi trường số",
      "c- Giải thích được cách truy cập và điều hướng các kết quả tìm kiếm",
      "d- Giải thích được rõ ràng và theo quy trình chiến lược tìm kiếm",
    ],
    TC2: [
      "a- Minh họa được nhu cầu thông tin",
      "b- Tổ chức được tìm kiếm dữ liệu, thông tin và nội dung trong môi trường số",
      "c- Mô tả được cách truy cập những dữ liệu, thông tin và nội dung này cũng như điều hướng giữa chúng",
      "d- Tổ chức được các chiến lược tìm kiếm",
    ],
    NC1: [
      "a- Đánh giá được nhu cầu thông tin",
      "b- Điều chỉnh được các tìm kiếm để tìm dữ liệu, thông tin và nội dung trong môi trường số",
      "c- Giải thích được cách truy cập và điều hướng những dữ liệu, thông tin và nội dung này",
      "d- Tổ chức được các chiến lược tìm kiếm cá nhân",
    ],
  },
  "1.2": {
    // Đánh giá dữ liệu
    TC1: [
      "a- Thực hiện phân tích, so sánh, đánh giá được độ tin cậy và độ chính xác của các nguồn dữ liệu, thông tin và nội dung số đã được tổ chức rõ ràng",
      "b- Thực hiện phân tích, diễn giải và đánh giá được dữ liệu, thông tin và nội dung số được xác định rõ ràng",
    ],
    TC2: [
      "a- Thực hiện phân tích, so sánh, đánh giá được độ tin cậy và độ chính xác của nhiều nguồn dữ liệu, thông tin và nội dung số",
      "b- Thực hiện phân tích, diễn giải và đánh giá được dữ liệu, thông tin và nội dung số từ nhiều nguồn",
    ],
    NC1: [
      "a- Đánh giá đa chiều được độ tin cậy và độ chính xác của nhiều nguồn dữ liệu, thông tin và nội dung số phức tạp",
      "b- Đánh giá đa chiều được dữ liệu, thông tin và nội dung số phức tạp, đưa ra nhận định và kết luận",
    ],
  },
  "1.3": {
    // Quản lý dữ liệu
    TC1: [
      "a- Lựa chọn được dữ liệu, thông tin và nội dung để tổ chức, lưu trữ và truy xuất chúng một cách thường xuyên trong môi trường số",
      "b- Sắp xếp chúng một cách trật tự trong một môi trường có cấu trúc",
    ],
    TC2: [
      "a- Thao tác được dữ liệu, thông tin và nội dung để cải tiến cách tổ chức, lưu trữ",
      "b- Tổ chức được việc truy xuất chúng trong môi trường có cấu trúc",
    ],
    NC1: [
      "a- Thao tác được thông tin, dữ liệu và nội dung để tổ chức, lưu trữ và truy xuất dễ dàng hơn",
      "b- Triển khai được việc tổ chức và sắp xếp dữ liệu, thông tin và nội dung trong môi trường có cấu trúc",
    ],
  },
}

// QUY TRÌNH TÍCH HỢP NLS VÀO KẾ HOẠCH GIÁO DỤC NHÀ TRƯỜNG
export const QUY_TRINH_TICH_HOP_NLS = {
  buoc_1: {
    ten: "Đánh giá thực trạng, đặt mục tiêu và điều chỉnh",
    noi_dung: [
      "Nghiên cứu Thông tư 02/2025/TT-BGDĐT và các văn bản liên quan",
      "Rà soát, đánh giá sơ bộ (ở chu kì đầu tiên hoặc đánh giá tác động ở các chu kì tiếp theo)",
      "Xác định mục tiêu cụ thể cho trường",
      "Chọn mức độ năng lực thành phần trong Khung NLS đảm bảo phù hợp với đối tượng học sinh và bối cảnh/điều kiện thực tế",
    ],
  },
  buoc_2: {
    ten: "Triển khai NLS vào Kế hoạch giáo dục của nhà trường",
    noi_dung: [
      "Kế hoạch giáo dục của nhà trường (1)",
      "Kế hoạch dạy học môn học/HĐGD và tổ chức các hoạt động giáo dục khác (2)",
      "Kế hoạch giáo dục của giáo viên (3)",
    ],
  },
  buoc_3: {
    ten: "Tích hợp năng lực số vào kế hoạch bài dạy và tổ chức các hoạt động giáo dục",
    noi_dung: [
      "Cụ thể hóa từ (1) đối với những nội dung được nhà trường/tổ chuyên môn phân công (Phụ lục 3, CV 5512)",
      "Mô tả biểu hiện cụ thể tương ứng với nội dung của bài học trên cơ sở tham khảo gợi ý ghi trong CV3456",
      "Đối với mỗi bài học mà giáo viên lựa chọn tích hợp năng lực số, cần thể hiện rõ vào mục tiêu bài học và tiến trình dạy học",
    ],
  },
  buoc_4: {
    ten: "Tổ chức dạy học tăng cường/câu lạc bộ để bổ sung các NLS",
    noi_dung: [
      "Tổ chức dạy học tăng cường những tiêu chí chưa được triển khai giảng dạy trong chương trình GDPT",
      "Đảm bảo tất cả các tiêu chí về NLS được thực hiện",
    ],
  },
}

// HƯỚNG DẪN XÂY DỰNG KẾ HOẠCH BÀI DẠY PHÁT TRIỂN NLS
export const HUONG_DAN_KHBD_PHAT_TRIEN_NLS = {
  phan_muc_tieu: {
    huong_dan:
      "Bên cạnh mục tiêu theo Quy định, giáo viên cần xác định rõ ràng các mục tiêu về Năng lực số mà bài học hướng tới",
    yeu_cau: [
      "Các mục tiêu cần được mô tả bằng các động từ hành động cụ thể",
      "Ghi mã năng lực thành phần tương ứng trong Khung NLS (VD: 1.1.NC1a, 3.1.NC1b)",
      "Mỗi bài học chỉ nên tích hợp 1-2 năng lực thành phần phù hợp",
    ],
    vi_du: "Sử dụng AI để hỗ trợ tìm hiểu thông tin nghề nghiệp (6.2.NC1a)",
  },
  phan_thiet_bi: {
    huong_dan: "Liệt kê cụ thể các thiết bị số và phần mềm sẽ được sử dụng trong bài dạy",
    vi_du: [
      "Thiết bị số: máy tính, máy chiếu, điện thoại thông minh",
      "Phần mềm/Ứng dụng: Canva, Google Forms, PHET, Kahoot, ChatGPT",
      "Nền tảng: Google Drive, Padlet, YouTube",
    ],
  },
  phan_tien_trinh: {
    huong_dan:
      "Trong mỗi hoạt động (Mở đầu, Khám phá, Luyện tập, Vận dụng), giáo viên cần mô tả rõ cách thức tổ chức cho học sinh tương tác và làm việc với công nghệ số",
    chi_tiet: {
      noi_dung: "Nhiệm vụ giao phải gắn liền với việc sử dụng một công cụ số cụ thể",
      san_pham:
        "Sản phẩm học tập thường là một sản phẩm số (file word, bài trình chiếu, bình luận trên Padlet, kết quả trả lời trên Kahoot...)",
      to_chuc:
        "Mô tả cách giáo viên hướng dẫn học sinh sử dụng công cụ, cách các em hợp tác (nếu làm việc nhóm trên môi trường số) và cách trình bày, báo cáo sản phẩm",
    },
  },
}

// GỢI Ý PHƯƠNG PHÁP DẠY HỌC VÀ KIỂM TRA ĐÁNH GIÁ PHÁT TRIỂN NLS
export const PHUONG_PHAP_DAY_HOC_NLS = {
  phuong_phap_day_hoc: [
    {
      ten: "Dạy học theo dự án",
      mo_ta:
        "Học sinh phải được vận dụng hầu hết các năng lực số, từ tìm kiếm thông tin, hợp tác trực tuyến, sáng tạo, trình bày và chia sẻ kết quả",
      nls_phat_trien: ["1.1", "1.2", "2.4", "3.1", "3.2"],
    },
    {
      ten: "Lớp học đảo ngược (Flipped Classroom)",
      mo_ta:
        "Giao cho học sinh tự nghiên cứu học liệu số (video, bài đọc) ở nhà, thời gian trên lớp sẽ dành cho việc thảo luận sâu, giải quyết vấn đề và thực hành dưới sự hướng dẫn của giáo viên",
      nls_phat_trien: ["1.1", "1.3", "5.2"],
    },
    {
      ten: "Dạy học giải quyết vấn đề",
      mo_ta:
        "Đặt ra các tình huống, bài toán thực tế đòi hỏi học sinh phải sử dụng các công cụ số để thu thập, phân tích dữ liệu và tìm ra giải pháp",
      nls_phat_trien: ["1.1", "1.2", "5.1", "5.2", "5.3"],
    },
  ],
  kiem_tra_danh_gia: [
    {
      hinh_thuc: "Đánh giá qua sản phẩm số",
      mo_ta:
        "Đánh giá các sản phẩm số mà học sinh tạo ra (bài trình chiếu, video, blog, infographic...) dựa trên các tiêu chí rõ ràng",
      cong_cu: ["Rubric đánh giá sản phẩm số", "Bảng kiểm năng lực số"],
    },
    {
      hinh_thuc: "Đánh giá qua quá trình",
      mo_ta: "Theo dõi và đánh giá cách học sinh sử dụng công nghệ số trong quá trình học tập",
      cong_cu: ["Nhật ký học tập số", "Phiếu quan sát"],
    },
    {
      hinh_thuc: "Tự đánh giá và đánh giá đồng đẳng",
      mo_ta: "Học sinh tự đánh giá năng lực số của bản thân và đánh giá lẫn nhau",
      cong_cu: ["Google Forms tự đánh giá", "Peer review trên Padlet"],
    },
  ],
}

// HÌNH THỨC TỔ CHỨC TRIỂN KHAI NLS
export const HINH_THUC_TRIEN_KHAI_NLS = {
  hinh_thuc_1: {
    ten: "Dạy học môn Tin học theo CT2018",
    vai_tro: "Môn Tin học cung cấp kiến thức kỹ năng số cốt lõi cho học sinh",
    luu_y:
      "Giáo viên Tin học có vai trò tư vấn, hỗ trợ giáo viên các môn học khác trong việc khai thác, ứng dụng các công cụ số",
  },
  hinh_thuc_2: {
    ten: "Tích hợp năng lực số trong các môn học",
    vai_tro: "Các môn học là môi trường để học sinh vận dụng kỹ năng số vào thực tiễn",
    luu_y: [
      "Tham chiếu YCCĐ môn học với Khung NLS để xác định rõ các nội dung, hình thức và 'địa chỉ' tích hợp NLS trong từng bài học",
      "Việc phát triển NLS thông qua dạy học tích hợp cần được chú trọng ở cả hai hình thức: tích hợp nội môn và tích hợp liên môn, giáo dục STEM",
    ],
  },
  hinh_thuc_3: {
    ten: "Dạy học tăng cường, câu lạc bộ",
    vai_tro: "Đáp ứng nhu cầu, nguyện vọng và bổ sung các NLS chưa được triển khai trong chương trình",
    luu_y: [
      "Các cơ sở giáo dục xây dựng kế hoạch tăng cường với nội dung và thời lượng phù hợp",
      "Lựa chọn nội dung và hình thức tổ chức các câu lạc bộ phù hợp",
      "Thực hiện hiệu quả chủ trương xã hội hóa giáo dục, phối hợp với các cơ sở giáo dục đại học, cơ sở nghiên cứu",
    ],
  },
}

// Hàm lấy NLS phù hợp theo loại chủ đề
export function goiYNLSTheoChuDe(loaiChuDe: string): NangLucThanhPhan[] {
  const goi_y = Object.entries(HUONG_DAN_TICH_HOP_NLS.goi_y_theo_loai_chu_de).find(([key]) =>
    loaiChuDe.toLowerCase().includes(key.toLowerCase().replace(/ - /g, "|").split("|")[0]),
  )

  if (!goi_y) return []

  const maNLS = goi_y[1].nls_phu_hop
  const ketQua: NangLucThanhPhan[] = []

  for (const ma of maNLS) {
    for (const mien of KHUNG_NANG_LUC_SO) {
      const nltp = mien.nang_luc_thanh_phan.find((nl) => nl.ma === ma)
      if (nltp) ketQua.push(nltp)
    }
  }

  return ketQua
}

// Hàm lấy thông tin NLS theo mã
export function getNLSTheoMa(ma: string): NangLucThanhPhan | null {
  for (const mien of KHUNG_NANG_LUC_SO) {
    const nltp = mien.nang_luc_thanh_phan.find((nl) => nl.ma === ma)
    if (nltp) return nltp
  }
  return null
}

// Hàm tạo context NLS cho prompt AI
export function taoContextNLS(loaiChuDe: string, maNLSDaChon?: string): string {
  let context = `
=== HƯỚNG DẪN TÍCH HỢP NĂNG LỰC SỐ (NLS) ===
QUY TẮC QUAN TRỌNG: MỖI CHỦ ĐỀ CHỈ TÍCH HỢP 1 NỘI DUNG NLS PHÙ HỢP

Nguyên tắc:
${HUONG_DAN_TICH_HOP_NLS.nguyen_tac_chon_nls.map((n) => `- ${n}`).join("\n")}
`

  if (maNLSDaChon) {
    const nlsDaChon = getNLSTheoMa(maNLSDaChon)
    if (nlsDaChon) {
      context += `
NLS ĐƯỢC CHỌN CHO CHỦ ĐỀ NÀY:
- Mã: ${nlsDaChon.ma}
- Tên: ${nlsDaChon.ten}
- Mô tả: ${nlsDaChon.mo_ta}
- Chỉ báo: ${nlsDaChon.chi_bao.slice(0, 3).join("; ")}
- Ví dụ tích hợp: ${nlsDaChon.vi_du_tich_hop[0]}
`
    }
  } else {
    const goiY = goiYNLSTheoChuDe(loaiChuDe)
    if (goiY.length > 0) {
      context += `
GỢI Ý NLS PHÙ HỢP VỚI LOẠI CHỦ ĐỀ "${loaiChuDe}" (CHỌN 1):
${goiY.map((nls) => `- ${nls.ma}: ${nls.ten} - ${nls.mo_ta}`).join("\n")}
`
    }
  }

  context += `
CÁCH TÍCH HỢP VÀO HOẠT ĐỘNG:
- Khởi động: ${HUONG_DAN_TICH_HOP_NLS.cach_tich_hop.hoat_dong_khoi_dong}
- Khám phá: ${HUONG_DAN_TICH_HOP_NLS.cach_tich_hop.hoat_dong_kham_pha}
- Luyện tập: ${HUONG_DAN_TICH_HOP_NLS.cach_tich_hop.hoat_dong_luyen_tap}
- Vận dụng: ${HUONG_DAN_TICH_HOP_NLS.cach_tich_hop.hoat_dong_van_dung}
`

  return context
}

// Hàm tạo context NLS chi tiết cho prompt AI
export function taoContextNLSChiTiet(khoi: number, loaiChuDe: string): string {
  // Xác định mức độ NLS theo khối
  let mucDo = "NC1"
  if (khoi >= 10 && khoi <= 12) mucDo = "NC1"
  else if (khoi >= 8 && khoi <= 9) mucDo = "TC2"
  else if (khoi >= 6 && khoi <= 7) mucDo = "TC1"

  const thongTinMucDo = MUC_DO_NLS_THEO_KHOI[mucDo as keyof typeof MUC_DO_NLS_THEO_KHOI]

  // Lấy NLS phù hợp với loại chủ đề
  const nlsPhuHop = goiYNLSTheoChuDe(loaiChuDe)

  let context = `
=== HƯỚNG DẪN TÍCH HỢP NĂNG LỰC SỐ ===

**QUY TẮC QUAN TRỌNG**: ${HUONG_DAN_TICH_HOP_NLS.quy_tac_chinh}

**MỨC ĐỘ NLS CHO KHỐI ${khoi}**:
- Mã: ${thongTinMucDo.ma} (${thongTinMucDo.ten})
- Tình huống: ${thongTinMucDo.tinh_huong}
- Mức độ tự chủ: ${thongTinMucDo.muc_do_tu_chu}

**GỢI Ý NLS PHÙ HỢP VỚI CHỦ ĐỀ "${loaiChuDe}"**:
`

  if (nlsPhuHop.length > 0) {
    nlsPhuHop.forEach((nls, index) => {
      context += `
${index + 1}. [${nls.ma}] ${nls.ten}
   - Mô tả: ${nls.mo_ta}
   - Ví dụ tích hợp: ${nls.vi_du_tich_hop[0] || ""}
`
    })
  }

  context += `
**CÁCH TÍCH HỢP VÀO BÀI HỌC**:
- Hoạt động khởi động: ${HUONG_DAN_TICH_HOP_NLS.cach_tich_hop.hoat_dong_khoi_dong}
- Hoạt động khám phá: ${HUONG_DAN_TICH_HOP_NLS.cach_tich_hop.hoat_dong_kham_pha}
- Hoạt động luyện tập: ${HUONG_DAN_TICH_HOP_NLS.cach_tich_hop.hoat_dong_luyen_tap}
- Hoạt động vận dụng: ${HUONG_DAN_TICH_HOP_NLS.cach_tich_hop.hoat_dong_van_dung}

**LƯU Ý KHI VIẾT MỤC TIÊU NLS**:
${HUONG_DAN_KHBD_PHAT_TRIEN_NLS.phan_muc_tieu.yeu_cau.map((y) => `- ${y}`).join("\n")}
`

  return context
}

// Hàm lấy chi tiết chỉ báo theo mức độ
export function getChiTietChiTheoMucDo(maNLS: string, mucDo: string): string[] {
  const chiTiet = CHI_BAO_THEO_MUC_DO[maNLS]
  if (!chiTiet) return []
  return chiTiet[mucDo] || []
}

// Export default
export default {
  KHUNG_NANG_LUC_SO,
  HUONG_DAN_TICH_HOP_NLS,
  MUC_DO_NLS_THEO_KHOI,
  CHI_BAO_THEO_MUC_DO,
  QUY_TRINH_TICH_HOP_NLS,
  HUONG_DAN_KHBD_PHAT_TRIEN_NLS,
  PHUONG_PHAP_DAY_HOC_NLS,
  HINH_THUC_TRIEN_KHAI_NLS,
  goiYNLSTheoChuDe,
  getNLSTheoMa,
  taoContextNLS,
  taoContextNLSChiTiet,
  getChiTietChiTheoMucDo,
}
