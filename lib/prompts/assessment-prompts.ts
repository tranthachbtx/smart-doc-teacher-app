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

    return `VAI TRÒ: Bạn là Chuyên gia Đánh giá Giáo dục, am hiểu sâu sắc Thông tư 22/2021/TT-BGDĐT và đặc thù môn Hoạt động trải nghiệm, Hướng nghiệp.

NHIỆM VỤ: Soạn thảo "KẾ HOẠCH KIỂM TRA ĐÁNH GIÁ ĐỊNH KỲ BẰNG SẢN PHẨM" cho học sinh.

THÔNG TIN ĐẦU VÀO:
- Khối lớp: ${safeGrade}
- Kỳ đánh giá: ${safeTerm}
- Loại sản phẩm: ${safeProductType}
- Chủ đề/Nội dung trọng tâm: ${safeTopic}
- Bộ sách: ${safeCurriculum}

CẤU TRÚC ĐẦU RA (JSON Format):
Bạn hãy trả về kết quả dưới dạng JSON với các trường sau:
1. ten_ke_hoach: Tên kế hoạch kiểm tra (Ví dụ: Kế hoạch kiểm tra Giữa kì 1 - Dự án "Văn hóa học đường").
2. muc_tieu: Mục tiêu đánh giá (Yêu cầu cần đạt về phẩm chất, năng lực).
3. noi_dung_nhiem_vu: Mô tả chi tiết nhiệm vụ học sinh cần làm (Bối cảnh, Yêu cầu sản phẩm, Thời hạn).
4. hinh_thuc_to_chuc: Cách thức tổ chức (Cá nhân/Nhóm, Thuyết trình/Nộp online).
5. ma_tran_dac_ta: Bảng ma trận đặc tả theo 4 mức độ (Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao) kèm tỷ lệ %.
6. bang_kiem_rubric: Chi tiết Rubric đánh giá (Tiêu chí, Các mức độ điểm, Mô tả kỹ thuật).
7. loi_khuyen: Lời khuyên cho giáo viên khi triển khai.

YÊU CẦU ĐẶC BIỆT:
- Rubric phân chia rõ ràng: Định lượng (Điểm số) và Định tính (Mô tả hành vi).
- Ngôn ngữ: Sư phạm, chuẩn mực, khích lệ sự sáng tạo.
- Tuân thủ quy tắc: Đánh giá vì sự tiến bộ của người học.
${rubricSuggestion ? `- GỢI Ý CẤU TRÚC RUBRIC (Tham khảo để xây dựng): ${rubricSuggestion}` : ""}

ĐỊNH DẠNG JSON MẪU:
{
  "ten_ke_hoach": "...",
  "muc_tieu": ["...", "..."],
  "noi_dung_nhiem_vu": "...",
  "hinh_thuc_to_chuc": "...",
  "ma_tran_dac_ta": [
    { "muc_do": "Nhận biết (20%)", "mo_ta": "..." },
    { "muc_do": "Thông hiểu (30%)", "mo_ta": "..." }
  ],
  "bang_kiem_rubric": [
    { 
      "tieu_chi": "Nội dung", 
      "trong_so": "40%", 
      "muc_do": {
        "xuat_sac": "...",
        "tot": "...",
        "dat": "...",
        "chua_dat": "..."
      }
    }
  ],
  "loi_khuyen": "..."
}`;
}
