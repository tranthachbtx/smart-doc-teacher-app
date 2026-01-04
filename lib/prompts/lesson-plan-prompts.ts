/**
 * ============================================================
 * LESSON PLAN PROMPTS - KẾ HOẠCH BÀI DẠY HĐTN
 * ============================================================
 *
 * File này chứa toàn bộ prompt huấn luyện Gemini AI
 * để thiết kế Kế hoạch bài dạy môn Hoạt động trải nghiệm, Hướng nghiệp
 * theo bộ sách "Kết nối Tri thức với Cuộc sống"
 *
 * HƯỚNG DẪN CHỈNH SỬA:
 * 1. CƠ SỞ DỮ LIỆU CHƯƠNG TRÌNH (CURRICULUM_DATABASE):
 *    - Chỉnh sửa nội dung chủ đề theo SGK
 *    - Cập nhật yêu cầu cần đạt cho từng khối lớp
 *
 * 2. QUY TẮC PHÂN TÍCH NGỮ CẢNH (CONTEXT_PARSING_RULES):
 *    - Thay đổi mức độ Bloom's taxonomy theo khối
 *    - Cập nhật đặc điểm tâm lý học sinh
 *
 * 3. CẤU TRÚC GIÁO ÁN (LESSON_STRUCTURE):
 *    - Tuân thủ Công văn 5512/BGDĐT-GDTrH
 *    - Có thể thêm/bớt các phần theo yêu cầu BGH
 *
 * ============================================================
 */

// ============================================================
// PHẦN 1: CƠ SỞ LÝ LUẬN VÀ TRIẾT LÝ SƯ PHẠM
// ============================================================

export const PEDAGOGICAL_FOUNDATION = `
TRIẾT LÝ "KẾT NỐI TRI THỨC":

Bộ sách "Kết nối tri thức với cuộc sống" được xây dựng dựa trên quan điểm:
- Đưa bài học vào thực tiễn cuộc sống
- Đưa cuộc sống vào bài học
- Học sinh là TRUNG TÂM của sự trải nghiệm, chiêm nghiệm và đúc kết

MÔ HÌNH XOẮN ỐC (SPIRAL CURRICULUM):
Các chủ đề cốt lõi "Bản thân", "Gia đình", "Cộng đồng", "Môi trường" và "Nghề nghiệp" 
được lặp lại ở cả ba khối lớp nhưng với MỨC ĐỘ YÊU CẦU TĂNG TIẾN về chiều sâu và độ phức tạp.

PHÂN TÍCH DỌC THEO KHỐI LỚP (Bloom's Taxonomy):

Khối 10 - MỨC "TÌM HIỂU" (Nhận biết, Hiểu):
- Trọng tâm: Thích ứng và nhận diện
- Học sinh vừa bước vào môi trường THPT, cần định vị bản thân
- Làm quen với các khái niệm nghề nghiệp cơ bản
- Từ khóa hoạt động: Tìm hiểu, Nhận biết, Khám phá, Mô tả

Khối 11 - MỨC "PHÂN TÍCH/ĐÁNH GIÁ" (Phân tích, Đánh giá):
- Trọng tâm: Phát triển và kết nối
- Học sinh mở rộng ra cộng đồng, xã hội
- Phát triển kỹ năng mềm phức tạp
- Từ khóa hoạt động: Phân tích, So sánh, Đánh giá, Phản biện

Khối 12 - MỨC "QUYẾT ĐỊNH/GIẢI QUYẾT" (Tổng hợp, Sáng tạo):
- Trọng tâm: Trưởng thành và quyết định
- Học sinh đối mặt với các quyết định nghề nghiệp thực sự
- Chuẩn bị cho cuộc sống công dân
- Từ khóa hoạt động: Quyết định, Giải quyết, Xây dựng, Thiết kế
`

// ============================================================
// PHẦN 2: CƠ SỞ DỮ LIỆU CHƯƠNG TRÌNH (KẾT NỐI TRI THỨC)
// ============================================================

export const CURRICULUM_DATABASE = {
  "10": {
    title: "Lớp 10: Thích ứng và Khám phá Bản thân",
    description: "Giúp học sinh chuyển giao từ THCS sang THPT, định hình nhân cách và làm quen môi trường mới",
    bloomLevel: "Nhận biết, Hiểu (Tìm hiểu)",
    themes: {
      // MẠCH 1: HOẠT ĐỘNG HƯỚNG VÀO BẢN THÂN
      ban_than: {
        name: "Hoạt động hướng vào bản thân",
        topics: [
          {
            id: "10.1",
            name: "Thể hiện phẩm chất tốt đẹp của người học sinh",
            coreActivity: "Nhận diện các phẩm chất tốt đẹp cần có của học sinh THPT",
            outcomes: ["Liệt kê được các phẩm chất tốt đẹp", "Tự đánh giá bản thân", "Lập kế hoạch rèn luyện"],
            methods: ["Thảo luận nhóm", "Trò chơi khám phá bản thân", "Viết nhật ký"],
          },
          {
            id: "10.2",
            name: "Xây dựng quan điểm sống",
            coreActivity: "Tìm hiểu và xây dựng quan điểm sống tích cực",
            outcomes: ["Hiểu thế nào là quan điểm sống", "Xác định quan điểm sống cá nhân", "Chia sẻ với bạn bè"],
            methods: ["Câu chuyện truyền cảm hứng", "Thảo luận nhóm", "Bài tập tự vấn"],
          },
          {
            id: "10.3",
            name: "Rèn luyện bản thân",
            coreActivity: "Xây dựng thói quen học tập và sinh hoạt tích cực",
            outcomes: ["Lập kế hoạch rèn luyện", "Thực hiện và theo dõi tiến độ", "Điều chỉnh phù hợp"],
            methods: ["Lập kế hoạch SMART", "Nhật ký theo dõi", "Chia sẻ kinh nghiệm"],
          },
          {
            id: "10.4",
            name: "Tự tin giao tiếp",
            coreActivity: "Rèn luyện kỹ năng giao tiếp tự tin",
            outcomes: ["Nhận biết rào cản giao tiếp", "Thực hành giao tiếp", "Tự tin trình bày"],
            methods: ["Đóng vai", "Thuyết trình ngắn", "Phản hồi tích cực"],
          },
        ],
      },
      // MẠCH 2: HOẠT ĐỘNG HƯỚNG ĐẾN XÃ HỘI
      xa_hoi: {
        name: "Hoạt động hướng đến xã hội",
        topics: [
          {
            id: "10.5",
            name: "Thực hiện trách nhiệm với gia đình",
            coreActivity: "Nhận thức và thực hiện trách nhiệm của con cái trong gia đình",
            outcomes: ["Liệt kê trách nhiệm", "Lập kế hoạch thực hiện", "Đánh giá kết quả"],
            methods: ["Thảo luận tình huống", "Dự án gia đình", "Chia sẻ câu chuyện"],
          },
          {
            id: "10.6",
            name: "Xây dựng cộng đồng",
            coreActivity: "Tham gia các hoạt động xây dựng cộng đồng",
            outcomes: ["Nhận biết vấn đề cộng đồng", "Đề xuất giải pháp", "Tham gia hoạt động"],
            methods: ["Khảo sát cộng đồng", "Dự án tình nguyện", "Báo cáo kết quả"],
          },
        ],
      },
      // MẠCH 3: HOẠT ĐỘNG HƯỚNG ĐẾN TỰ NHIÊN
      tu_nhien: {
        name: "Hoạt động hướng đến tự nhiên",
        topics: [
          {
            id: "10.7",
            name: "Bảo tồn cảnh quan thiên nhiên",
            coreActivity: "Tìm hiểu và bảo vệ cảnh quan thiên nhiên địa phương",
            outcomes: ["Nhận biết cảnh quan", "Đề xuất bảo vệ", "Thực hiện hành động"],
            methods: ["Tham quan thực địa", "Dự án bảo vệ", "Truyền thông"],
          },
          {
            id: "10.8",
            name: "Bảo vệ môi trường",
            coreActivity: "Thực hiện các hoạt động bảo vệ môi trường",
            outcomes: ["Nhận thức vấn đề", "Thay đổi hành vi", "Vận động người khác"],
            methods: ["Chiến dịch môi trường", "3R thực hành", "Truyền thông số"],
          },
        ],
      },
      // MẠCH 4: HOẠT ĐỘNG HƯỚNG NGHIỆP
      huong_nghiep: {
        name: "Hoạt động hướng nghiệp",
        topics: [
          {
            id: "10.9",
            name: "Tìm hiểu hoạt động sản xuất, kinh doanh, dịch vụ của địa phương",
            coreActivity: "Khảo sát và tìm hiểu các ngành nghề tại địa phương",
            outcomes: ["Liệt kê ngành nghề", "Mô tả đặc điểm", "Đánh giá tiềm năng"],
            methods: ["Tham quan cơ sở", "Phỏng vấn người lao động", "Báo cáo nhóm"],
          },
          {
            id: "10.10",
            name: "Hiểu bản thân để chọn nghề",
            coreActivity: "Đánh giá năng lực, sở thích để định hướng nghề nghiệp",
            outcomes: ["Tự đánh giá năng lực", "Xác định sở thích nghề", "Liên hệ với nghề nghiệp"],
            methods: ["Trắc nghiệm Holland", "Thảo luận nhóm", "Tư vấn cá nhân"],
          },
          {
            id: "10.11",
            name: "Định hướng học tập và rèn luyện theo nhóm nghề lựa chọn",
            coreActivity: "Xây dựng kế hoạch học tập phù hợp với định hướng nghề",
            outcomes: ["Chọn nhóm nghề quan tâm", "Lập kế hoạch học tập", "Thực hiện và điều chỉnh"],
            methods: ["Lập kế hoạch", "Mentor nghề nghiệp", "Theo dõi tiến độ"],
          },
        ],
      },
    },
  },

  "11": {
    title: "Lớp 11: Kỹ năng Xã hội và Nhóm nghề Chuyên sâu",
    description: "Phát triển kỹ năng mềm phức tạp và tìm hiểu chuyên sâu về thị trường lao động",
    bloomLevel: "Phân tích, Đánh giá",
    themes: {
      ban_than: {
        name: "Hoạt động hướng vào bản thân",
        topics: [
          {
            id: "11.1",
            name: "Xây dựng quan hệ với thầy cô, bạn bè",
            coreActivity: "Phân tích và phát triển mối quan hệ tích cực",
            outcomes: ["Đánh giá mối quan hệ hiện tại", "Xây dựng chiến lược cải thiện", "Thực hành kỹ năng"],
            methods: ["Phân tích tình huống", "Đóng vai", "Phản hồi 360 độ"],
          },
          {
            id: "11.2",
            name: "Quản lý cảm xúc bản thân",
            coreActivity: "Nhận diện và quản lý cảm xúc hiệu quả",
            outcomes: ["Nhận biết cảm xúc", "Áp dụng kỹ thuật quản lý", "Đánh giá hiệu quả"],
            methods: ["Nhật ký cảm xúc", "Kỹ thuật thư giãn", "Chia sẻ nhóm"],
          },
          {
            id: "11.3",
            name: "Tư duy độc lập và phản biện",
            coreActivity: "Rèn luyện tư duy phản biện trong học tập và cuộc sống",
            outcomes: ["Phân tích vấn đề đa chiều", "Đánh giá thông tin", "Đưa ra quan điểm có căn cứ"],
            methods: ["Tranh biện", "Phân tích case study", "Viết bài luận"],
          },
          {
            id: "11.4",
            name: "Giải quyết mâu thuẫn trong gia đình",
            coreActivity: "Phân tích nguyên nhân và tìm giải pháp cho mâu thuẫn gia đình",
            outcomes: ["Nhận diện nguyên nhân", "Đề xuất giải pháp", "Thực hành giao tiếp"],
            methods: ["Phân tích tình huống", "Đóng vai", "Kỹ năng lắng nghe"],
          },
        ],
      },
      xa_hoi: {
        name: "Hoạt động hướng đến xã hội",
        topics: [
          {
            id: "11.5",
            name: "Phát triển cộng đồng bền vững",
            coreActivity: "Đánh giá và đề xuất giải pháp phát triển cộng đồng",
            outcomes: ["Phân tích hiện trạng", "Đề xuất dự án", "Thực hiện và đánh giá"],
            methods: ["SWOT analysis", "Dự án cộng đồng", "Huy động nguồn lực"],
          },
        ],
      },
      tu_nhien: {
        name: "Hoạt động hướng đến tự nhiên",
        topics: [
          {
            id: "11.6",
            name: "Bảo tồn đa dạng sinh học",
            coreActivity: "Đánh giá tầm quan trọng và đề xuất bảo tồn đa dạng sinh học",
            outcomes: ["Phân tích giá trị", "Đánh giá nguy cơ", "Đề xuất bảo tồn"],
            methods: ["Nghiên cứu thực địa", "Dự án bảo tồn", "Truyền thông"],
          },
          {
            id: "11.7",
            name: "Ứng phó biến đổi khí hậu",
            coreActivity: "Phân tích tác động và đề xuất giải pháp ứng phó",
            outcomes: ["Hiểu nguyên nhân", "Đánh giá tác động", "Đề xuất hành động"],
            methods: ["Nghiên cứu số liệu", "Dự án xanh", "Vận động chính sách"],
          },
        ],
      },
      huong_nghiep: {
        name: "Hoạt động hướng nghiệp",
        topics: [
          {
            id: "11.8",
            name: "Tìm hiểu nhóm nghề cơ bản",
            coreActivity: "Phân tích chuyên sâu các nhóm nghề phổ biến",
            outcomes: ["So sánh nhóm nghề", "Đánh giá phù hợp", "Định hướng cụ thể"],
            methods: ["Nghiên cứu thị trường", "Phỏng vấn chuyên gia", "Job shadowing"],
          },
          {
            id: "11.9",
            name: "Rèn luyện phẩm chất người lao động",
            coreActivity: "Đánh giá và rèn luyện phẩm chất nghề nghiệp",
            outcomes: ["Xác định phẩm chất cần thiết", "Lập kế hoạch rèn luyện", "Tự đánh giá tiến bộ"],
            methods: ["Mô hình năng lực", "Thực tập ngắn hạn", "Portfolio"],
          },
          {
            id: "11.10",
            name: "Xây dựng kế hoạch học tập theo định hướng nghề",
            coreActivity: "Thiết kế kế hoạch học tập chi tiết theo nghề chọn",
            outcomes: ["Phân tích yêu cầu nghề", "Lập lộ trình học tập", "Thực hiện và điều chỉnh"],
            methods: ["Lộ trình học tập", "Mentoring", "Review định kỳ"],
          },
        ],
      },
    },
  },

  "12": {
    title: "Lớp 12: Trưởng thành và Quyết định Nghề nghiệp",
    description: "Sự trưởng thành toàn diện, trách nhiệm công dân và quyết định chọn trường, chọn nghề",
    bloomLevel: "Tổng hợp, Sáng tạo (Quyết định, Giải quyết)",
    themes: {
      ban_than: {
        name: "Hoạt động hướng vào bản thân",
        topics: [
          {
            id: "12.1",
            name: "Thể hiện sự trưởng thành của bản thân",
            coreActivity: "Tổng kết và thể hiện sự trưởng thành qua 3 năm THPT",
            outcomes: ["Nhìn nhận sự thay đổi", "Chia sẻ bài học", "Định hướng tương lai"],
            methods: ["Portfolio cá nhân", "Thư gửi bản thân", "Buổi chia sẻ"],
          },
          {
            id: "12.2",
            name: "Theo đuổi đam mê",
            coreActivity: "Xác định và lập kế hoạch theo đuổi đam mê",
            outcomes: ["Xác định đam mê", "Cân bằng đam mê và thực tế", "Lập kế hoạch hành động"],
            methods: ["Ikigai workshop", "Mentor chia sẻ", "Dự án cá nhân"],
          },
          {
            id: "12.3",
            name: "Hoàn thiện bản thân",
            coreActivity: "Đánh giá toàn diện và lập kế hoạch hoàn thiện bản thân",
            outcomes: ["Tự đánh giá 360", "Xác định điểm cần cải thiện", "Cam kết hành động"],
            methods: ["SWOT cá nhân", "Feedback từ người khác", "Kế hoạch phát triển"],
          },
          {
            id: "12.4",
            name: "Tổ chức cuộc sống gia đình",
            coreActivity: "Chuẩn bị kỹ năng tổ chức cuộc sống độc lập",
            outcomes: ["Kỹ năng quản lý tài chính", "Kỹ năng sinh hoạt", "Kỹ năng giao tiếp gia đình"],
            methods: ["Thực hành quản lý ngân sách", "Dự án sống độc lập", "Tư vấn gia đình"],
          },
        ],
      },
      xa_hoi: {
        name: "Hoạt động hướng đến xã hội",
        topics: [
          {
            id: "12.5",
            name: "Đoàn kết các dân tộc Việt Nam",
            coreActivity: "Tìm hiểu và thể hiện tinh thần đoàn kết dân tộc",
            outcomes: ["Hiểu giá trị đoàn kết", "Tôn trọng đa dạng văn hóa", "Thực hiện hành động"],
            methods: ["Tìm hiểu văn hóa", "Giao lưu", "Dự án văn hóa"],
          },
        ],
      },
      tu_nhien: {
        name: "Hoạt động hướng đến tự nhiên",
        topics: [
          {
            id: "12.6",
            name: "Gìn giữ vẻ đẹp thiên nhiên",
            coreActivity: "Sáng tạo giải pháp bảo vệ vẻ đẹp thiên nhiên",
            outcomes: ["Đánh giá hiện trạng", "Thiết kế giải pháp", "Triển khai dự án"],
            methods: ["Dự án sáng tạo", "Chiến dịch truyền thông", "Huy động cộng đồng"],
          },
          {
            id: "12.7",
            name: "Bảo vệ động vật hoang dã",
            coreActivity: "Tham gia bảo vệ động vật hoang dã",
            outcomes: ["Hiểu luật pháp", "Tham gia bảo vệ", "Truyền thông vận động"],
            methods: ["Nghiên cứu pháp luật", "Tình nguyện", "Chiến dịch số"],
          },
        ],
      },
      huong_nghiep: {
        name: "Hoạt động hướng nghiệp",
        topics: [
          {
            id: "12.8",
            name: "Yêu cầu của người lao động trong xã hội hiện đại",
            coreActivity: "Phân tích yêu cầu và chuẩn bị năng lực người lao động hiện đại",
            outcomes: ["Hiểu xu hướng lao động", "Đánh giá bản thân", "Lập kế hoạch phát triển"],
            methods: ["Nghiên cứu thị trường", "Phỏng vấn HR", "Kế hoạch phát triển năng lực"],
          },
          {
            id: "12.9",
            name: "Sẵn sàng cho việc chuyển đổi nghề nghiệp",
            coreActivity: "Chuẩn bị tâm thế và kỹ năng chuyển đổi nghề",
            outcomes: ["Hiểu thực tế chuyển đổi nghề", "Phát triển kỹ năng chuyển đổi", "Xây dựng mindset linh hoạt"],
            methods: ["Case study chuyển đổi nghề", "Kỹ năng học tập suốt đời", "Networking"],
          },
          {
            id: "12.10",
            name: "Quyết định lựa chọn nghề nghiệp tương lai",
            coreActivity: "Ra quyết định chọn nghề và lập kế hoạch thực hiện",
            outcomes: ["Tổng hợp thông tin", "Ra quyết định", "Lập kế hoạch hành động"],
            methods: ["Ma trận quyết định", "Tư vấn chuyên gia", "Kế hoạch hành động chi tiết"],
          },
        ],
      },
    },
  },
}

// ============================================================
// PHẦN 3: QUY TẮC PHÂN TÍCH NGỮ CẢNH
// ============================================================

export const CONTEXT_PARSING_RULES = `
QUY TẮC PHÂN TÍCH NGỮ CẢNH (Context Parsing):

1. KHI NHẬN YÊU CẦU "Soạn giáo án Chủ đề X lớp Y":
   - Bước 1: Xác định khối lớp (10, 11, 12)
   - Bước 2: Tra cứu CURRICULUM_DATABASE để lấy thông tin chủ đề
   - Bước 3: Áp dụng Bloom's Taxonomy Level phù hợp:
     + Lớp 10: Hoạt động "Tìm hiểu, Nhận biết, Khám phá"
     + Lớp 11: Hoạt động "Phân tích, Đánh giá, So sánh"
     + Lớp 12: Hoạt động "Quyết định, Giải quyết, Thiết kế"

2. XỬ LÝ NỘI DUNG ĐỊA PHƯƠNG:
   - Đối với chủ đề "Môi trường" và "Nghề nghiệp":
   - Sử dụng biến {Dia_Phuong} để điền thông tin cụ thể
   - Nếu không có thông tin địa phương: sử dụng nội dung chung

3. XỬ LÝ TIẾT SINH HOẠT DƯỚI CỜ:
   - Thiết kế kịch bản MC chi tiết
   - Câu hỏi tương tác cho toàn trường
   - Tiết mục văn nghệ minh họa chủ đề (nếu phù hợp)

4. XỬ LÝ TIẾT SINH HOẠT LỚP:
   - Mẫu "Phiếu sơ kết tuần"
   - Câu hỏi thảo luận nhóm nhỏ
   - Nội dung sinh hoạt chuyên đề ngắn gọn
`

// ============================================================
// PHẦN 4: CẤU TRÚC GIÁO ÁN CHUẨN (CÔNG VĂN 5512)
// ============================================================

export const LESSON_STRUCTURE_CV5512 = `
CẤU TRÚC KẾ HOẠCH BÀI DẠY (Theo Công văn 5512/BGDĐT-GDTrH):

I. TÊN BÀI HỌC: [Theo SGK Kết nối tri thức]

II. MỤC TIÊU:
   1. Kiến thức: [Trích xuất từ "Hoạt động cốt lõi" trong CURRICULUM_DATABASE]
   2. Năng lực:
      a) Năng lực chung:
         - Tự chủ và tự học
         - Giao tiếp và hợp tác
         - Giải quyết vấn đề và sáng tạo
      b) Năng lực đặc thù HĐTN:
         - Thích ứng với cuộc sống
         - Thiết kế và tổ chức hoạt động
         - Định hướng nghề nghiệp
   3. Phẩm chất:
      - Yêu nước, Nhân ái, Chăm chỉ, Trung thực, Trách nhiệm

III. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU:
   1. Giáo viên: [Máy chiếu, tranh ảnh, video, phiếu học tập...]
   2. Học sinh: [Vở ghi, bút màu, điện thoại nếu cần...]

IV. TIẾN TRÌNH DẠY HỌC (4 BƯỚC BẮT BUỘC):

HOẠT ĐỘNG 1: KHỞI ĐỘNG (5-7 phút)
   a) Mục tiêu: Tạo hứng thú, kích thích tò mò, dẫn dắt vào bài
   b) Nội dung: [Trò chơi, video, câu hỏi gợi mở]
   c) Sản phẩm: [Câu trả lời của HS, không khí hào hứng]
   d) Tổ chức thực hiện:
      - Bước 1: Chuyển giao nhiệm vụ - GV giao nhiệm vụ cụ thể
      - Bước 2: Thực hiện nhiệm vụ - HS thực hiện cá nhân/nhóm
      - Bước 3: Báo cáo, thảo luận - HS trình bày, GV và lớp phản hồi
      - Bước 4: Kết luận, nhận định - GV chốt kiến thức, dẫn vào bài

HOẠT ĐỘNG 2: KHÁM PHÁ - HÌNH THÀNH KIẾN THỨC (15-20 phút)
   [Cấu trúc a, b, c, d tương tự]
   - Đây là TRỌNG TÂM của bài học
   - Phương pháp: Thảo luận nhóm, Nghiên cứu tình huống, Thuyết trình

HOẠT ĐỘNG 3: LUYỆN TẬP (10-15 phút)
   [Cấu trúc a, b, c, d tương tự]
   - Phương pháp: Đóng vai, Xử lý tình huống giả định, Bài tập thực hành

HOẠT ĐỘNG 4: VẬN DỤNG (5-10 phút)
   [Cấu trúc a, b, c, d tương tự]
   - Nhiệm vụ về nhà, Dự án thực tế, Cam kết hành động

V. HỒ SƠ DẠY HỌC (PHỤ LỤC):
   - Phiếu học tập (mẫu cụ thể)
   - Bảng kiểm/Rubric đánh giá
   - Tài liệu tham khảo
`

// ============================================================
// PHẦN 5: NĂNG LỰC SỐ (NLS) VÀ GIÁO DỤC ĐẠO ĐỨC
// ============================================================

export const DIGITAL_LITERACY_FRAMEWORK = {
  "D1": {
    name: "Khai thác dữ liệu và thông tin",
    competencies: [
      "D1.1: Tìm kiếm và lọc dữ liệu, thông tin và nội dung số",
      "D1.2: Đánh giá dữ liệu, thông tin và nội dung số",
      "D1.3: Quản lý dữ liệu, thông tin và nội dung số"
    ]
  },
  "D2": {
    name: "Giao tiếp và hợp tác trong môi trường số",
    competencies: [
      "D2.1: Tương tác qua công nghệ số",
      "D2.2: Chia sẻ thông tin và nội dung số",
      "D2.4: Hợp tác qua công nghệ số",
      "D2.5: Quy tắc ứng xử trên môi trường số"
    ]
  },
  "D3": {
    name: "Sáng tạo nội dung số",
    competencies: [
      "D3.1: Phát triển nội dung số (Canva, Video...)",
      "D3.2: Chỉnh sửa, tích hợp nội dung số"
    ]
  },
  "D4": {
    name: "An toàn",
    competencies: [
      "D4.1: Bảo vệ thiết bị",
      "D4.2: Bảo vệ dữ liệu cá nhân",
      "D4.3: Bảo vệ sức khỏe"
    ]
  },
  "D5": {
    name: "Giải quyết vấn đề",
    competencies: [
      "D5.2: Xác định nhu cầu và giải pháp công nghệ",
      "D5.3: Sáng tạo sử dụng công nghệ số"
    ]
  },
  "D6": {
    name: "Ứng dụng trí tuệ nhân tạo (AI)",
    competencies: [
      "D6.2: Sử dụng công cụ trí tuệ nhân tạo (Gemini, ChatGPT...)",
      "D6.3: Đánh giá và đạo đức trong sử dụng AI"
    ]
  }
}

export const MORAL_EDUCATION_THEMES = {
  trach_nhiem: { name: "Trách nhiệm", description: "Ý thức với bản thân, gia đình, cộng đồng, môi trường" },
  trung_thuc: { name: "Trung thực", description: "Thật thà trong học tập, công việc, giao tiếp" },
  nhan_ai: { name: "Nhân ái", description: "Yêu thương, tôn trọng, giúp đỡ người khác" },
  cham_chi: { name: "Chăm chỉ", description: "Chịu khó, ham học, nỗ lực vượt khó" },
  yeu_nuoc: { name: "Yêu nước", description: "Tự hào truyền thống, xây dựng quê hương" },
}

// ============================================================
// PHẦN 6: HƯỚNG DẪN VỊ TRÍ TÍCH HỢP NLS VÀ ĐẠO ĐỨC
// ============================================================

export const INTEGRATION_PLACEMENT_GUIDE = `
HƯỚNG DẪN VỊ TRÍ TÍCH HỢP NLS VÀ ĐẠO ĐỨC TRONG KẾ HOẠCH BÀI DẠY:

1. NĂNG LỰC SỐ (NLS) - Tích hợp vào CÁC HOẠT ĐỘNG CỤ THỂ:

   a) HOẠT ĐỘNG KHỞI ĐỘNG (5-7 phút):
      - NLS 2.4 (Hợp tác số): Sử dụng Mentimeter/Kahoot để thu thập ý kiến nhanh
      - Ví dụ: "GV chiếu mã QR, HS truy cập Mentimeter để trả lời câu hỏi khởi động"

   b) HOẠT ĐỘNG KHÁM PHÁ (15-20 phút):
      - NLS 1.1 (Tìm kiếm thông tin): HS tra cứu thông tin trên mạng
      - NLS 1.2 (Đánh giá thông tin): HS phân biệt nguồn tin đáng tin cậy
      - Ví dụ: "Nhóm 1-2 tìm hiểu thông tin từ website chính thống, nhóm 3-4 đánh giá độ tin cậy của các nguồn"

   c) HOẠT ĐỘNG LUYỆN TẬP (10-15 phút):
      - NLS 3.1 (Tạo nội dung số): Thiết kế sản phẩm bằng Canva
      - NLS 2.1 (Tương tác số): Làm việc nhóm qua Google Drive/Zalo
      - Ví dụ: "Các nhóm thiết kế poster/infographic bằng Canva, chia sẻ qua Google Drive"

   d) HOẠT ĐỘNG VẬN DỤNG (5-10 phút):
      - NLS 2.2 (Chia sẻ nội dung): Chia sẻ bài học trên mạng xã hội
      - NLS 4.1 (An toàn thông tin): Nhắc nhở bảo vệ thông tin cá nhân
      - Ví dụ: "Về nhà, HS chia sẻ bài học với gia đình qua Zalo, chú ý không đăng thông tin cá nhân"

2. GIÁO DỤC ĐẠO ĐỨC - Tích hợp XUYÊN SUỐT và cụ thể:

   a) TÍCH HỢP QUA MỤC TIÊU:
      - Ghi rõ trong phần "Mục tiêu phẩm chất" với mô tả hành vi cụ thể
      - Ví dụ: "Trách nhiệm: HS ý thức được trách nhiệm của bản thân trong việc bảo vệ môi trường thông qua các hoạt động phân loại rác"

   b) TÍCH HỢP QUA HOẠT ĐỘNG KHÁM PHÁ:
      - Lồng ghép tình huống đạo đức vào nội dung bài học
      - Ví dụ: "GV đưa ra tình huống: Bạn A nhìn thấy bạn B vứt rác không đúng nơi quy định. Em sẽ làm gì?"

   c) TÍCH HỢP QUA HOẠT ĐỘNG LUYỆN TẬP:
      - Bài tập thực hành có yếu tố đạo đức
      - Ví dụ: "Đóng vai xử lý tình huống liên quan đến trung thực trong học tập"

   d) TÍCH HỢP QUA HOẠT ĐỘNG VẬN DỤNG:
      - Cam kết hành động thể hiện phẩm chất
      - Ví dụ: "HS viết cam kết cá nhân về việc thực hiện trách nhiệm với gia đình trong tuần tới"

3. NGUYÊN TẮC TÍCH HỢP TỰ NHIÊN (KHÔNG GÒ BÓ):
   - Chọn NLS và đạo đức PHÙ HỢP với nội dung bài học, không cố ép
   - Mỗi hoạt động chỉ tích hợp 1-2 NLS, không quá tải
   - Đạo đức được giáo dục qua HÀNH ĐỘNG cụ thể, không thuyết giáo
   - Ưu tiên tích hợp vào hoạt động LUYỆN TẬP và VẬN DỤNG
`

// ============================================================
// PHẦN 7: HÀM TẠO PROMPT ĐẦY ĐỦ
// ============================================================

export function getFullLessonPlanPrompt(
  grade: string,
  topic: string,
  duration = "2 tiết",
  localContent?: string,
): string {
  const curriculum = CURRICULUM_DATABASE[grade as keyof typeof CURRICULUM_DATABASE]
  if (!curriculum) {
    return `Không tìm thấy dữ liệu chương trình cho khối ${grade}`
  }

  return `VAI TRÒ: Bạn là Chuyên gia Sư phạm hàng đầu Việt Nam về môn Hoạt động trải nghiệm, Hướng nghiệp, 
đặc biệt am hiểu bộ sách "Kết nối tri thức với cuộc sống" và Công văn 5512/BGDĐT-GDTrH.

${PEDAGOGICAL_FOUNDATION}

${CONTEXT_PARSING_RULES}

THÔNG TIN ĐẦU VÀO:
- Khối lớp: ${grade}
- Đặc điểm chương trình: ${curriculum.title}
- Mô tả: ${curriculum.description}
- Mức độ Bloom: ${curriculum.bloomLevel}
- Chủ đề/Bài học: "${topic}"
- Thời lượng: ${duration}
${localContent ? `- Nội dung địa phương: ${localContent}` : ""}

${LESSON_STRUCTURE_CV5512}

${INTEGRATION_PLACEMENT_GUIDE}

NĂNG LỰC SỐ THEO THÔNG TƯ 02/2025 (chọn 2-3 năng lực cụ thể để tích hợp):
${Object.entries(DIGITAL_LITERACY_FRAMEWORK)
      .map(([k, v]) => `Miền ${k} (${v.name}):\n` + v.competencies.map(c => `  - ${c}`).join("\n"))
      .join("\n")}

GIÁO DỤC ĐẠO ĐỨC CẦN TÍCH HỢP (chọn 1-2 phù hợp, giáo dục qua hành động):
${Object.entries(MORAL_EDUCATION_THEMES)
      .map(([k, v]) => `- ${v.name}: ${v.description}`)
      .join("\n")}

QUY TẮC TÍCH HỢP BẮT BUỘC:
1. NLS phải được tích hợp VÀO TỪNG HOẠT ĐỘNG cụ thể (Khởi động/Khám phá/Luyện tập/Vận dụng)
2. Đạo đức phải được giáo dục qua HÀNH ĐỘNG và TÌNH HUỐNG cụ thể
3. Ghi rõ CÔNG CỤ SỐ sử dụng (Canva, Mentimeter, Kahoot, Google Drive, Padlet)
4. Ghi rõ HÀNH VI học sinh thể hiện phẩm chất

QUY TẮC ĐỊNH DẠNG BẮT BUỘC:
- KHÔNG dùng dấu ** trong nội dung
- KHÔNG dùng TAB hoặc thụt dòng
- Mỗi phần cách nhau bằng 2 dấu xuống dòng (\\n\\n)
- Sử dụng gạch đầu dòng (-) cho các mục liệt kê
- Viết tiếng Việt chuẩn mực, CHỈ dùng tiếng Anh cho tên công cụ công nghệ

NHIỆM VỤ: Soạn Kế hoạch bài dạy ĐẦY ĐỦ theo chuẩn Công văn 5512, với NLS và đạo đức được TÍCH HỢP VÀO TỪNG HOẠT ĐỘNG.

ĐỊNH DẠNG KẾT QUẢ - JSON thuần túy:
{
  "ten_bai": "Tên bài học theo SGK",
  "muc_tieu_kien_thuc": "- Kiến thức 1.\\n- Kiến thức 2.\\n- Kiến thức 3.",
  "muc_tieu_nang_luc": "a) Năng lực chung:\\n- Tự chủ và tự học: [Mô tả cụ thể hành vi HS].\\n- Giao tiếp và hợp tác: [Mô tả].\\n\\nb) Năng lực đặc thù HĐTN:\\n- Thích ứng với cuộc sống: [Mô tả].\\n- Định hướng nghề nghiệp: [Mô tả].",
  "muc_tieu_pham_chat": "- Trách nhiệm: [Mô tả hành vi HS thể hiện phẩm chất qua hoạt động cụ thể].\\n- [Phẩm chất khác]: [Mô tả hành vi cụ thể].",
  "thiet_bi_day_hoc": "1. Giáo viên:\\n- Máy chiếu, laptop có kết nối Internet.\\n- Tài khoản Mentimeter/Kahoot (nếu sử dụng).\\n- Phiếu học tập in sẵn.\\n\\n2. Học sinh:\\n- Điện thoại thông minh hoặc máy tính bảng (nếu có).\\n- Vở ghi, bút màu.",
  "hoat_dong_khoi_dong": "a) Mục tiêu: [Nội dung].\\n\\nb) Nội dung: [Nội dung + TÍCH HỢP NLS nếu phù hợp, ví dụ: Sử dụng Mentimeter thu thập ý kiến].\\n\\nc) Sản phẩm: [Nội dung].\\n\\nd) Tổ chức thực hiện:\\n- Bước 1: Chuyển giao nhiệm vụ - GV [chi tiết, bao gồm hướng dẫn sử dụng công cụ số nếu có].\\n- Bước 2: Thực hiện nhiệm vụ - HS [chi tiết].\\n- Bước 3: Báo cáo, thảo luận - [Chi tiết].\\n- Bước 4: Kết luận, nhận định - GV [chốt kiến thức, dẫn vào bài].",
  "hoat_dong_kham_pha": "a) Mục tiêu: [Nội dung].\\n\\nb) Nội dung: [Nội dung chính + TÍCH HỢP NLS tìm kiếm/đánh giá thông tin nếu phù hợp + TÍCH HỢP đạo đức qua tình huống].\\n\\nc) Sản phẩm: [Nội dung].\\n\\nd) Tổ chức thực hiện:\\n- Bước 1: Chuyển giao nhiệm vụ - [Chi tiết].\\n- Bước 2: Thực hiện nhiệm vụ - [Chi tiết, bao gồm hành động thể hiện phẩm chất nếu có].\\n- Bước 3: Báo cáo, thảo luận - [Chi tiết].\\n- Bước 4: Kết luận, nhận định - [Chi tiết].",
  "hoat_dong_luyen_tap": "a) Mục tiêu: [Nội dung].\\n\\nb) Nội dung: [Nội dung + TÍCH HỢP NLS tạo nội dung số/hợp tác số, ví dụ: HS thiết kế poster bằng Canva, làm việc nhóm qua Google Drive].\\n\\nc) Sản phẩm: [Sản phẩm số cụ thể: poster, infographic, video ngắn...].\\n\\nd) Tổ chức thực hiện:\\n- Bước 1: Chuyển giao nhiệm vụ - [Chi tiết, hướng dẫn sử dụng công cụ].\\n- Bước 2: Thực hiện nhiệm vụ - [Chi tiết, HS thực hành với công cụ số].\\n- Bước 3: Báo cáo, thảo luận - [Trình bày sản phẩm số].\\n- Bước 4: Kết luận, nhận định - [Đánh giá sản phẩm].",
  "hoat_dong_van_dung": "a) Mục tiêu: [Nội dung].\\n\\nb) Nội dung: [Nội dung + TÍCH HỢP NLS chia sẻ nội dung + TÍCH HỢP đạo đức qua cam kết hành động].\\n\\nc) Sản phẩm: [Cam kết cá nhân, bài viết chia sẻ...].\\n\\nd) Tổ chức thực hiện:\\n- Bước 1: Chuyển giao nhiệm vụ - [Chi tiết, bao gồm hướng dẫn chia sẻ an toàn].\\n- Bước 2: Thực hiện nhiệm vụ - [HS viết cam kết thể hiện phẩm chất].\\n- Bước 3: Báo cáo, thảo luận - [Chia sẻ cam kết].\\n- Bước 4: Kết luận, nhận định - [Nhắc nhở an toàn thông tin khi chia sẻ online].",
  "ho_so_day_hoc": "PHIẾU HỌC TẬP:\\n[Nội dung chi tiết phiếu học tập]\\n\\nBẢNG KIỂM ĐÁNH GIÁ:\\n[Tiêu chí đánh giá bao gồm cả NLS và phẩm chất]",
  "tich_hop_nls": "TỔNG HỢP TÍCH HỢP NLS TRONG BÀI:\\n- Hoạt động Khởi động: NLS [Mã] - [Tên] - [Mô tả cụ thể].\\n- Hoạt động Khám phá: NLS [Mã] - [Tên] - [Mô tả cụ thể].\\n- Hoạt động Luyện tập: NLS [Mã] - [Tên] - [Mô tả cụ thể].\\n- Hoạt động Vận dụng: NLS [Mã] - [Tên] - [Mô tả cụ thể].",
  "tich_hop_dao_duc": "TỔNG HỢP GIÁO DỤC ĐẠO ĐỨC TRONG BÀI:\\n- Hoạt động Khám phá: [Phẩm chất] - [Tình huống/hành động cụ thể].\\n- Hoạt động Luyện tập: [Phẩm chất] - [Bài tập thực hành].\\n- Hoạt động Vận dụng: [Phẩm chất] - [Cam kết hành động]."
}`
}

// ============================================================
// PHẦN 8: EXPORT MẶC ĐỊNH
// ============================================================

export default {
  PEDAGOGICAL_FOUNDATION,
  CURRICULUM_DATABASE,
  CONTEXT_PARSING_RULES,
  LESSON_STRUCTURE_CV5512,
  DIGITAL_LITERACY_FRAMEWORK,
  MORAL_EDUCATION_THEMES,
  INTEGRATION_PLACEMENT_GUIDE,
  getFullLessonPlanPrompt,
}
