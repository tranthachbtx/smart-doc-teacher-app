// HDTN (Hoạt động trải nghiệm, Hướng nghiệp) Curriculum Database
// Source: SGK "Chân trời sáng tạo - Bản 1" for Grades 10, 11, 12

export const HDTN_CURRICULUM: Record<string, Record<string, string>> = {
  "10": {
    // Grade 10 - Chân trời sáng tạo (Bản 1)
    "9": "Chủ đề 1: Thể hiện phẩm chất tốt đẹp của người học sinh",
    "10": "Chủ đề 2: Xây dựng quan điểm sống",
    "11": "Chủ đề 3: Giữ gìn truyền thống nhà trường",
    "12": "Chủ đề 4: Thực hiện trách nhiệm với gia đình",
    "1": "Chủ đề 5: Xây dựng kế hoạch tài chính cá nhân",
    "2": "Chủ đề 6: Vận động cộng đồng tham gia hoạt động xã hội",
    "3": "Chủ đề 7: Tìm hiểu hoạt động SXKD, dịch vụ địa phương",
    "4": "Chủ đề 8: Định hướng học tập rèn luyện theo nhóm nghề",
    "5": "Chủ đề 9: Bảo vệ cảnh quan thiên nhiên và môi trường",
  },
  "11": {
    // Grade 11 - Chân trời sáng tạo (Bản 1)
    "9": "Chủ đề 1: Phấn đấu hoàn thiện bản thân",
    "10": "Chủ đề 2: Tự tin và thích ứng với sự thay đổi",
    "11": "Chủ đề 3: Góp phần xây dựng và phát triển nhà trường",
    "12": "Chủ đề 4: Tham gia tổ chức cuộc sống gia đình",
    "1": "Chủ đề 5: Xây dựng và thực hiện kế hoạch chi tiêu phù hợp",
    "2": "Chủ đề 6: Thực hiện trách nhiệm với cộng đồng",
    "3": "Chủ đề 7: Thông tin về các nhóm nghề cơ bản",
    "4": "Chủ đề 8: Học tập rèn luyện theo định hướng nghề nghiệp",
    "5": "Chủ đề 9: Bảo vệ môi trường và tài nguyên địa phương",
  },
  "12": {
    // Grade 12 - Chân trời sáng tạo (Bản 1)
    "9": "Chủ đề 1: Thể hiện sự trưởng thành của bản thân",
    "10": "Chủ đề 2: Thể hiện bản lĩnh và đam mê",
    "11": "Chủ đề 3: Xây dựng và phát triển quan hệ thầy cô, trường lớp",
    "12": "Chủ đề 4: Xây dựng gia đình hạnh phúc",
    "1": "Chủ đề 5: Lập kế hoạch chi tiêu và quản lý tài chính",
    "2": "Chủ đề 6: Bảo tồn cảnh quan thiên nhiên và môi trường",
    "3": "Chủ đề 7: Thế giới nghề nghiệp và lựa chọn nghề nghiệp",
    "4": "Chủ đề 8: Rèn luyện phẩm chất nghề nghiệp",
    "5": "Chủ đề 9: Chào mừng ngày thành lập Đoàn & Tổng kết",
  },
}

export const HDTN_CURRICULUM_DETAILS: Record<
  string,
  Record<
    string,
    {
      theme: string
      objectives: string[]
      activities: string[]
      skills: string[]
    }
  >
> = {
  "10": {
    "9": {
      theme: "Thể hiện phẩm chất tốt đẹp của người học sinh",
      objectives: [
        "Nhận diện và phát huy phẩm chất tốt đẹp của người học sinh THPT",
        "Rèn luyện tính trung thực, trách nhiệm, kỷ luật",
        "Xây dựng hình ảnh học sinh gương mẫu",
      ],
      activities: [
        "Thảo luận nhóm về chuẩn mực đạo đức học sinh",
        "Đóng vai xử lý tình huống đạo đức",
        "Viết cam kết rèn luyện phẩm chất",
      ],
      skills: ["Tự nhận thức", "Ra quyết định", "Giao tiếp"],
    },
    "10": {
      theme: "Xây dựng quan điểm sống",
      objectives: [
        "Xác định giá trị sống cá nhân",
        "Phân biệt quan điểm sống tích cực và tiêu cực",
        "Xây dựng quan điểm sống phù hợp với chuẩn mực xã hội",
      ],
      activities: [
        "Khảo sát giá trị sống qua Mentimeter",
        "Tranh biện về các quan điểm sống",
        "Lập kế hoạch phát triển bản thân",
      ],
      skills: ["Tư duy phản biện", "Tự định hướng", "Lập kế hoạch"],
    },
    "11": {
      theme: "Giữ gìn truyền thống nhà trường",
      objectives: [
        "Tìm hiểu lịch sử, truyền thống nhà trường",
        "Tự hào và có trách nhiệm giữ gìn truyền thống",
        "Đề xuất hoạt động phát huy truyền thống",
      ],
      activities: [
        "Tham quan phòng truyền thống",
        "Giao lưu với cựu học sinh thành đạt",
        "Thiết kế poster/video về truyền thống trường",
      ],
      skills: ["Nghiên cứu", "Sáng tạo", "Làm việc nhóm"],
    },
    "12": {
      theme: "Thực hiện trách nhiệm với gia đình",
      objectives: [
        "Nhận thức vai trò, trách nhiệm với gia đình",
        "Thể hiện sự quan tâm, chia sẻ với người thân",
        "Tham gia công việc gia đình phù hợp",
      ],
      activities: ["Chia sẻ câu chuyện gia đình", "Lập kế hoạch giúp đỡ gia đình", "Viết thư cảm ơn cha mẹ"],
      skills: ["Đồng cảm", "Trách nhiệm", "Quản lý thời gian"],
    },
    "1": {
      theme: "Xây dựng kế hoạch tài chính cá nhân",
      objectives: [
        "Hiểu tầm quan trọng của quản lý tài chính cá nhân",
        "Biết cách lập kế hoạch thu chi đơn giản",
        "Hình thành thói quen tiết kiệm",
      ],
      activities: [
        "Lập sổ thu chi cá nhân trên Excel/App",
        "Thảo luận về chi tiêu thông minh",
        "Thử thách tiết kiệm 21 ngày",
      ],
      skills: ["Quản lý tài chính", "Kỷ luật bản thân", "Sử dụng công nghệ"],
    },
    "2": {
      theme: "Vận động cộng đồng tham gia hoạt động xã hội",
      objectives: [
        "Nhận thức vai trò của hoạt động xã hội",
        "Rèn kỹ năng vận động, thuyết phục",
        "Thực hiện hoạt động tình nguyện",
      ],
      activities: ["Thiết kế chiến dịch truyền thông xã hội", "Tổ chức hoạt động tình nguyện", "Gây quỹ từ thiện"],
      skills: ["Thuyết phục", "Tổ chức sự kiện", "Truyền thông"],
    },
    "3": {
      theme: "Tìm hiểu hoạt động SXKD, dịch vụ địa phương",
      objectives: [
        "Tìm hiểu các ngành nghề tại địa phương",
        "Phân tích cơ hội nghề nghiệp",
        "Kết nối kiến thức với thực tiễn",
      ],
      activities: [
        "Tham quan doanh nghiệp địa phương",
        "Phỏng vấn người lao động",
        "Báo cáo nghiên cứu thị trường lao động",
      ],
      skills: ["Khảo sát", "Phân tích", "Thuyết trình"],
    },
    "4": {
      theme: "Định hướng học tập rèn luyện theo nhóm nghề",
      objectives: [
        "Khám phá sở thích, năng lực bản thân",
        "Tìm hiểu các nhóm nghề phù hợp",
        "Lập kế hoạch học tập theo định hướng nghề",
      ],
      activities: [
        "Làm trắc nghiệm hướng nghiệp online",
        "Talkshow với chuyên gia các ngành",
        "Lập bản đồ nghề nghiệp cá nhân",
      ],
      skills: ["Tự đánh giá", "Lập kế hoạch", "Ra quyết định"],
    },
    "5": {
      theme: "Bảo vệ cảnh quan thiên nhiên và môi trường",
      objectives: [
        "Nhận thức tầm quan trọng của môi trường",
        "Thực hiện hành động bảo vệ môi trường",
        "Tuyên truyền ý thức môi trường",
      ],
      activities: ["Chiến dịch Xanh - Sạch - Đẹp", "Dự án tái chế sáng tạo", "Cuộc thi clip TikTok về môi trường"],
      skills: ["Ý thức môi trường", "Sáng tạo", "Truyền thông"],
    },
  },
  "11": {
    "9": {
      theme: "Phấn đấu hoàn thiện bản thân",
      objectives: ["Đánh giá điểm mạnh, điểm yếu bản thân", "Xác định mục tiêu phát triển", "Lập kế hoạch rèn luyện"],
      activities: ["SWOT cá nhân trên Canva", "Đặt mục tiêu SMART", "Mentorship với học sinh khóa trên"],
      skills: ["Tự nhận thức", "Lập mục tiêu", "Kiên trì"],
    },
    "10": {
      theme: "Tự tin và thích ứng với sự thay đổi",
      objectives: ["Xây dựng sự tự tin bản thân", "Phát triển khả năng thích ứng", "Quản lý stress hiệu quả"],
      activities: ["Workshop kỹ năng thuyết trình", "Thử thách vùng an toàn", "Chia sẻ câu chuyện vượt khó"],
      skills: ["Tự tin", "Thích ứng", "Quản lý cảm xúc"],
    },
    "11": {
      theme: "Góp phần xây dựng và phát triển nhà trường",
      objectives: [
        "Đề xuất ý tưởng phát triển trường",
        "Tham gia các hoạt động xây dựng trường",
        "Thể hiện tinh thần chủ nhân",
      ],
      activities: ["Hackathon ý tưởng cải tiến trường học", "Dự án cải tạo không gian xanh", "Cuộc thi sáng kiến hay"],
      skills: ["Sáng tạo", "Làm việc nhóm", "Lãnh đạo"],
    },
    "12": {
      theme: "Tham gia tổ chức cuộc sống gia đình",
      objectives: ["Hiểu cách tổ chức cuộc sống gia đình", "Rèn kỹ năng sống tự lập", "Cân bằng học tập và gia đình"],
      activities: ["Lập kế hoạch chi tiêu gia đình", "Thực hành nấu ăn, dọn dẹp", "Chia sẻ bí quyết cân bằng"],
      skills: ["Tự lập", "Quản lý", "Trách nhiệm"],
    },
    "1": {
      theme: "Xây dựng và thực hiện kế hoạch chi tiêu phù hợp",
      objectives: ["Lập ngân sách chi tiêu hợp lý", "Phân biệt nhu cầu và mong muốn", "Thực hành tiết kiệm thông minh"],
      activities: [
        "Gameshow Ai là triệu phú tài chính",
        "Lập bảng chi tiêu trên Google Sheets",
        "Thử thách No Spend Week",
      ],
      skills: ["Quản lý tài chính", "Kỷ luật", "Ra quyết định"],
    },
    "2": {
      theme: "Thực hiện trách nhiệm với cộng đồng",
      objectives: [
        "Nhận thức trách nhiệm công dân",
        "Tham gia hoạt động vì cộng đồng",
        "Lan tỏa tinh thần tình nguyện",
      ],
      activities: ["Dự án phục vụ cộng đồng", "Chiến dịch tình nguyện", "Gây quỹ và hỗ trợ người khó khăn"],
      skills: ["Trách nhiệm xã hội", "Tổ chức", "Đồng cảm"],
    },
    "3": {
      theme: "Thông tin về các nhóm nghề cơ bản",
      objectives: ["Phân loại các nhóm nghề chính", "Tìm hiểu yêu cầu từng nhóm nghề", "Định hướng nhóm nghề phù hợp"],
      activities: ["Hội chợ hướng nghiệp", "Talkshow với đại diện các ngành", "Trải nghiệm một ngày làm việc"],
      skills: ["Nghiên cứu", "Phân tích", "Lựa chọn"],
    },
    "4": {
      theme: "Học tập rèn luyện theo định hướng nghề nghiệp",
      objectives: ["Xác định nghề nghiệp mục tiêu", "Lập kế hoạch học tập phù hợp", "Rèn luyện kỹ năng nghề nghiệp"],
      activities: ["Lập roadmap nghề nghiệp", "Thực tập mini tại doanh nghiệp", "Portfolio cá nhân"],
      skills: ["Lập kế hoạch", "Thực hành", "Kiên trì"],
    },
    "5": {
      theme: "Bảo vệ môi trường và tài nguyên địa phương",
      objectives: ["Tìm hiểu tài nguyên địa phương", "Đề xuất giải pháp bảo vệ", "Thực hiện dự án môi trường"],
      activities: ["Khảo sát thực trạng môi trường", "Dự án khởi nghiệp xanh", "Chiến dịch truyền thông môi trường"],
      skills: ["Nghiên cứu", "Khởi nghiệp", "Truyền thông"],
    },
  },
  "12": {
    "9": {
      theme: "Thể hiện sự trưởng thành của bản thân",
      objectives: [
        "Nhìn nhận sự trưởng thành qua 3 năm THPT",
        "Thể hiện phẩm chất người trưởng thành",
        "Chuẩn bị tâm thế cho giai đoạn mới",
      ],
      activities: ["Viết thư cho bản thân tương lai", "Chia sẻ hành trình trưởng thành", "Lễ trưởng thành 18 tuổi"],
      skills: ["Tự nhận thức", "Trưởng thành", "Trách nhiệm"],
    },
    "10": {
      theme: "Thể hiện bản lĩnh và đam mê",
      objectives: ["Khám phá và theo đuổi đam mê", "Rèn luyện bản lĩnh đối mặt thử thách", "Kiên trì với mục tiêu"],
      activities: ["TEDx học sinh về đam mê", "Thử thách 30 ngày theo đuổi đam mê", "Showcase tài năng"],
      skills: ["Đam mê", "Bản lĩnh", "Kiên trì"],
    },
    "11": {
      theme: "Xây dựng và phát triển quan hệ thầy cô, trường lớp",
      objectives: ["Tri ân thầy cô, nhà trường", "Củng cố tình bạn, tình thầy trò", "Xây dựng kỷ niệm đẹp"],
      activities: ["Ngày hội tri ân 20/11", "Time capsule cho lớp", "Video kỷ yếu lớp"],
      skills: ["Biết ơn", "Gắn kết", "Sáng tạo"],
    },
    "12": {
      theme: "Xây dựng gia đình hạnh phúc",
      objectives: ["Hiểu giá trị gia đình", "Chuẩn bị kiến thức về hôn nhân gia đình", "Rèn kỹ năng xây dựng quan hệ"],
      activities: ["Talkshow về gia đình hạnh phúc", "Phân tích tình huống gia đình", "Dự án Gia đình tôi"],
      skills: ["Giao tiếp", "Đồng cảm", "Trách nhiệm"],
    },
    "1": {
      theme: "Lập kế hoạch chi tiêu và quản lý tài chính",
      objectives: ["Lập kế hoạch tài chính dài hạn", "Tìm hiểu các hình thức đầu tư", "Chuẩn bị tài chính cho đại học"],
      activities: ["Simulation quản lý tài chính", "Workshop đầu tư cho người mới", "Lập kế hoạch tài chính 5 năm"],
      skills: ["Quản lý tài chính", "Đầu tư", "Lập kế hoạch"],
    },
    "2": {
      theme: "Bảo tồn cảnh quan thiên nhiên và môi trường",
      objectives: ["Nhận thức vai trò bảo tồn", "Thực hiện hành động bảo vệ", "Lan tỏa ý thức cộng đồng"],
      activities: ["Chiến dịch bảo vệ môi trường", "Dự án xanh hóa trường học", "Cuộc thi sáng kiến môi trường"],
      skills: ["Ý thức môi trường", "Hành động", "Truyền thông"],
    },
    "3": {
      theme: "Thế giới nghề nghiệp và lựa chọn nghề nghiệp",
      objectives: [
        "Tổng hợp thông tin thị trường lao động",
        "Phân tích xu hướng nghề nghiệp",
        "Đưa ra quyết định nghề nghiệp",
      ],
      activities: [
        "Hội thảo hướng nghiệp với doanh nghiệp",
        "Phân tích nghề nghiệp hot 2025-2030",
        "Hoàn thiện hồ sơ xin việc/học bổng",
      ],
      skills: ["Phân tích", "Ra quyết định", "Chuẩn bị hồ sơ"],
    },
    "4": {
      theme: "Rèn luyện phẩm chất nghề nghiệp",
      objectives: [
        "Hiểu phẩm chất nghề nghiệp cần có",
        "Rèn luyện đạo đức nghề nghiệp",
        "Chuẩn bị sẵn sàng cho thị trường lao động",
      ],
      activities: ["Workshop kỹ năng mềm nghề nghiệp", "Mô phỏng phỏng vấn xin việc", "Xây dựng thương hiệu cá nhân"],
      skills: ["Chuyên nghiệp", "Đạo đức nghề nghiệp", "Thương hiệu cá nhân"],
    },
    "5": {
      theme: "Chào mừng ngày thành lập Đoàn & Tổng kết",
      objectives: ["Kỷ niệm ngày thành lập Đoàn 26/3", "Tổng kết hoạt động HĐTN năm học", "Chia tay và tri ân"],
      activities: ["Lễ kỷ niệm thành lập Đoàn", "Gala tổng kết HĐTN", "Lễ tri ân và trưởng thành"],
      skills: ["Tri ân", "Tổng kết", "Chia tay"],
    },
  },
}

// Helper function to get theme by grade and month
export function getThemeByGradeAndMonth(grade: string, month: string): string | null {
  return HDTN_CURRICULUM[grade]?.[month] || null
}

export const getThemeForMonth = getThemeByGradeAndMonth

export function getThemeDetails(grade: string, month: string) {
  return HDTN_CURRICULUM_DETAILS[grade]?.[month] || null
}

// Helper function to get all themes for a specific grade
export function getThemesByGrade(grade: string): Record<string, string> | null {
  return HDTN_CURRICULUM[grade] || null
}

// Academic year months in order (September to May)
export const ACADEMIC_MONTHS = [
  { value: "9", label: "Tháng 9" },
  { value: "10", label: "Tháng 10" },
  { value: "11", label: "Tháng 11" },
  { value: "12", label: "Tháng 12" },
  { value: "1", label: "Tháng 1" },
  { value: "2", label: "Tháng 2" },
  { value: "3", label: "Tháng 3" },
  { value: "4", label: "Tháng 4" },
  { value: "5", label: "Tháng 5" },
]
