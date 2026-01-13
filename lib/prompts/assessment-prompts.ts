export const ASSESSMENT_PRODUCT_TYPES = {
    MEDIA: {
        label: "Sản phẩm Truyền thông Đa phương tiện",
        types: [
            "Video Clip / Vlog / Phim ngắn",
            "Infographic / Poster số",
            "Tập san điện tử / Newsletter / Website"
        ]
    },
    PLAN_REPORT: {
        label: "Sản phẩm Kế hoạch & Báo cáo",
        types: [
            "Bản kế hoạch hoạt động (Action Plan)",
            "Hồ sơ năng lực / Portfolio",
            "Báo cáo thu hoạch (Reflection Paper)"
        ]
    },
    PERFORMANCE: {
        label: "Sản phẩm Biểu diễn & Thực hành",
        types: [
            "Thuyết trình / Hùng biện",
            "Tiểu phẩm đóng vai",
            "Tổ chức sự kiện"
        ]
    },
    MAKING: {
        label: "Sản phẩm Chế tạo & STEM",
        types: [
            "Mô hình vật lý",
            "Sản phẩm tái chế",
            "Sản phẩm thủ công"
        ]
    }
};

export const RUBRIC_TEMPLATES: Record<string, any[]> = {
    MEDIA: [
        { name: "Nội dung & Thông điệp", weight: 40, criteria: ["Thông điệp ý nghĩa, nhân văn", "Kiến thức chính xác, khoa học", "Kịch bản/Cấu trúc lôi cuốn"] },
        { name: "Kỹ thuật & Thẩm mỹ", weight: 30, criteria: ["Hình ảnh/Video sắc nét, đẹp mắt", "Âm thanh rõ ràng/Màu sắc hài hòa", "Kỹ thuật dựng/Thiết kế chuyên nghiệp"] },
        { name: "Sáng tạo", weight: 15, criteria: ["Ý tưởng độc đáo, mới lạ", "Cách thể hiện ấn tượng", "Mang đậm dấu ấn cá nhân/nhóm"] },
        { name: "Hợp tác & Quy trình", weight: 15, criteria: ["Làm việc nhóm hiệu quả", "Đúng hạn", "Có minh chứng hậu trường"] }
    ],
    PLAN_REPORT: [
        { name: "Tính Khả thi & Thực tế", weight: 30, criteria: ["Mục tiêu SMART", "Nguồn lực được xác định rõ", "Lộ trình/Timeline hợp lý"] },
        { name: "Cấu trúc & Hình thức", weight: 20, criteria: ["Đầy đủ các mục theo quy định", "Trình bày văn bản chuyên nghiệp", "Ngôn ngữ trong sáng, mạch lạc"] },
        { name: "Phân tích & Tư duy", weight: 30, criteria: ["Phân tích bối cảnh sâu sắc", "Nhận diện rủi ro tốt", "Giải pháp/Đề xuất sáng tạo"] },
        { name: "Tổng kết & Phản hồi", weight: 20, criteria: ["Bài học kinh nghiệm rút ra", "Đánh giá trung thực kết quả", "Kế hoạch cải thiện"] }
    ],
    PERFORMANCE: [
        { name: "Nội dung & Kịch bản", weight: 35, criteria: ["Đúng chủ đề quy định", "Kịch bản chặt chẽ, ý nghĩa", "Thông điệp rõ ràng"] },
        { name: "Kỹ năng Biểu diễn", weight: 35, criteria: ["Giọng nói/Ngôn ngữ cơ thể tự tin", "Phối hợp nhóm nhịp nhàng", "Xử lý tình huống tốt"] },
        { name: "Sáng tạo & Dàn dựng", weight: 20, criteria: ["Đạo cụ/Trang phục phù hợp, sáng tạo", "Âm nhạc/Ánh sáng hỗ trợ hiệu quả", "Cách dàn dựng mới mẻ"] },
        { name: "Cảm xúc & Tác động", weight: 10, criteria: ["Gây xúc động/hứng thú cho khán giả", "Truyền cảm hứng tích cực"] }
    ],
    MAKING: [
        { name: "Tính Khoa học & Kỹ thuật", weight: 30, criteria: ["Nguyên lý hoạt động chính xác", "Cấu trúc vững chắc, an toàn", "Vật liệu phù hợp"] },
        { name: "Tính Thẩm mỹ & Hoàn thiện", weight: 25, criteria: ["Hình thức đẹp, cân đối", "Độ hoàn thiện chi tiết cao", "Trang trí ấn tượng"] },
        { name: "Tính Ứng dụng & Hữu ích", weight: 25, criteria: ["Giải quyết được vấn đề thực tế", "Có khả năng sử dụng/tái sử dụng", "Thân thiện môi trường"] },
        { name: "Thuyết trình sản phẩm", weight: 20, criteria: ["Giới thiệu rõ ràng quy trình làm", "Giải thích tốt nguyên lý", "Trả lời phản biện thuyết phục"] }
    ]
};


export function getAssessmentPrompt(
    grade: string,
    term: string, // "Giữa kì 1", "Cuối kì 1", ...
    productType: string,
    topic: string,
    curriculum: string = "Kết nối tri thức" // Default book
): string {
    // Defensive: ensure all inputs are strings
    const safeGrade = grade || "10";
    const safeTerm = term || "Giữa kì 1";
    const safeProductType = productType || "";
    const safeTopic = topic || "";
    const safeCurriculum = curriculum || "Kết nối tri thức";

    // Determine Rubric Suggestion based on Product Type
    let rubricSuggestion = "";
    // Simple matching (can be improved)
    if (safeProductType.includes("Video") || safeProductType.includes("Tranh") || safeProductType.includes("Poster") || safeProductType.includes("Truyền thông")) {
        rubricSuggestion = JSON.stringify(RUBRIC_TEMPLATES.MEDIA);
    } else if (safeProductType.includes("Kế hoạch") || safeProductType.includes("Báo cáo") || safeProductType.includes("Hồ sơ")) {
        rubricSuggestion = JSON.stringify(RUBRIC_TEMPLATES.PLAN_REPORT);
    } else if (safeProductType.includes("Thuyết trình") || safeProductType.includes("Tiểu phẩm") || safeProductType.includes("Sự kiện")) {
        rubricSuggestion = JSON.stringify(RUBRIC_TEMPLATES.PERFORMANCE);
    } else if (safeProductType.includes("Mô hình") || safeProductType.includes("Chế tạo") || safeProductType.includes("Thủ công")) {
        rubricSuggestion = JSON.stringify(RUBRIC_TEMPLATES.MAKING);
    }

    return `
# VAI TRÒ: CHUYÊN GIA KIỂM TRA ĐÁNH GIÁ & KIẾN TRÚC SƯ KẾ HOẠCH (Master Assessment Architect v3.0)
Hệ thống: Antigravity Deep-Dive.
Am hiểu: Thông tư 22/2021/TT-BGDĐT, chuẩn Năng lực số Thông tư 02/2025.

# 1. BỐI CẢNH ĐÁNH GIÁ:
- Khối: ${safeGrade}
- Kỳ: ${safeTerm}
- Loại sản phẩm: ${safeProductType}
- Chủ đề trọng tâm: ${safeTopic}
- Bộ sách: ${safeCurriculum}
- Địa phương: THPT Bùi Thị Xuân - Mũi Né (Ưu tiên các chủ đề: rác thải biển, du lịch bền vững, văn hóa địa phương).

# 2. CHỈ ĐẠO CHIẾN LƯỢC (ANTI-VAGUE):

## A. NHIỆM VỤ ĐÁNH GIÁ "THỰC":
- NHIỆM VỤ PHẢI CỤ THỂ: Thay vì "Tìm hiểu về biến đổi khí hậu", hãy viết "Thiết kế 01 bộ Infographic phân tích 3 nguyên nhân gây xâm thực bờ biển tại Mũi Né và đề xuất giải pháp cho người dân địa phương".
- PHẢI CÓ SẢN PHẨM SỐ: Tích hợp ít nhất 01 công cụ số (Canva, AI, CapCut) vào quy trình thực hiện.

## B. RUBRIC CĂNG - MINH CHỨNG SỐ:
- TIÊU CHÍ PHẢI CÓ HÀNH VI: Không dùng "Làm tốt", "Sáng tạo".
- PHẢI DÙNG: "Thông điệp rõ ràng, sử dụng ít nhất 3 hình ảnh minh họa thực tế", "Kỹ thuật biên tập video mượt mà, có phụ đề đúng ngữ pháp".
- MAPPING: Mỗi tiêu chí phải chứng minh được học sinh đang hình thành Năng lực/Phẩm chất nào.

# 3. ĐỊNH DẠNG ĐẦU RA (SURGICAL JSON):
[MỌI NỘI DUNG PHẢI VIẾT BẰNG TIẾNG VIỆT, VĂN PHONG SƯ PHẠM BẢN ĐỊA]

{
  "ten_ke_hoach": "[Tên kế hoạch viết hoa, chuyên nghiệp]",
  "muc_tieu": ["Mục tiêu hành vi 1 (Chuẩn 5512)", "Mục tiêu hành vi 2...", "Năng lực số hình thành tại bước nào?"],
  "noi_dung_nhiem_vu": "Mô tả cực kỳ chi tiết quy trình (Bối cảnh -> Nhiệm vụ -> Sản phẩm cuối -> Thời hạn). Có 'mùi vị' đặc trưng của Mũi Né/Lâm Đồng.",
  "hinh_thuc_to_chuc": "Cách thức nộp bài, thuyết trình hoặc triển lãm ảo (virtual exhibition).",
  "ma_tran_dac_ta": [
    { "muc_do": "Nhận biết", "mo_ta": "Minh chứng HS nhận diện được vấn đề thông qua..." },
    { "muc_do": "Thông hiểu", "mo_ta": "Minh chứng HS giải thích được các mối liên hệ..." },
    { "muc_do": "Vận dụng", "mo_ta": "Minh chứng HS tạo ra sản phẩm hoàn chỉnh..." },
    { "muc_do": "Vận dụng cao", "mo_ta": "Minh chứng HS có giải pháp sáng tạo, giải quyết vấn đề cộng đồng..." }
  ],
  "bang_kiem_rubric": [
    { 
      "tieu_chi": "Nội dung & Kiến thức", 
      "trong_so": "40%", 
      "muc_do": {
        "xuat_sac": "Mô tả hành vi cụ thể đạt mức xuất sắc",
        "tot": "...",
        "dat": "...",
        "chua_dat": "..."
      }
    }
  ],
  "loi_khuyen": "Lời khuyên thực tế cho GV để tránh HS copy-paste hoặc dùng AI không trung thực."
}

${rubricSuggestion ? `- THIẾT KẾ DỰA TRÊN KHUNG CHUẨN: ${rubricSuggestion}` : ""}
`;
}
