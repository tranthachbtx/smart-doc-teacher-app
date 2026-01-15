import { getAllMembers } from "@/lib/config/department";

const GRADE_PSYCHOLOGY = {
  "10": "Học sinh lớp 10 đang trong giai đoạn chuyển cấp, cần sự định hướng về môi trường mới và các giá trị nền tảng.",
  "11": "Học sinh lớp 11 cần sự tập trung vào các kỹ năng sống, năng lực số và định hướng nghề nghiệp sớm.",
  "12": "Học sinh lớp 12 đang chịu áp lực thi cử, cần sự tiếp sức, giải tỏa tâm lý và tư duy chiến thắng.",
};

const CURRICULUM_DATABASE = {
  "10": ["Xây dựng nhà trường", "Phát triển bản thân", "Quản lý tài chính"],
  "11": ["Tự chủ và tự tin", "Giao tiếp công việc", "Năng lực số"],
  "12": ["Thích ứng với sự thay đổi", "Năng lực lãnh đạo", "Kỹ năng phỏng vấn"],
};

export function getKHDHIntegrationPrompt(
  grade: string,
  lessonTopic: string,
  templateContent: string
): string {
  return `VAI TRÒ: Chuyên gia Khai phá & Tích hợp Giáo dục.
NHIỆM VỤ: Dựa trên giáo án cũ [OLD_PLAN] và Chủ đề [TOPIC], hãy viết phần Tích hợp Năng lực số và Đạo đức.
---
OLD_PLAN:
${templateContent}
---
TOPIC: ${lessonTopic}
KHỐI: ${grade}
---
YÊU CẦU: Trả về JSON sạch, không có Markdown.`;
}

export function getMeetingPrompt(
  month: string,
  session: string,
  keyContent: string,
  conclusion: string
): string {
  return `VAI TRÒ: Thư ký cuộc họp.
Nhiệm vụ: Viết biên bản sinh hoạt tổ chuyên môn tháng ${month}, lần ${session}.
Nội dung: ${keyContent}
Kết luận: ${conclusion}
---
Trả về JSON chuẩn.`;
}

export function getLessonPrompt(
  type: "shdc" | "hdgd" | "shl",
  grade: string,
  theme: string,
  duration?: string,
  context?: string,
  customInstructions?: string,
  tasks?: string[],
  chuDeSo?: string,
  suggestions?: any,
  stepInstruction?: string
): string {
  return `VAI TRÒ: Chuyên gia soạn giáo án 5512.
Nội dung: ${theme} - Khối ${grade} - Loại: ${type}.
Yêu cầu: ${customInstructions || "Viết chi tiết."}
---
Trả về JSON.`;
}

// ============================================================
// PHẦN 5: PROMPT KẾ HOẠCH NGOẠI KHÓA - MASTER v75.10 (BẢN CHUẨN)
// ============================================================

export function getEventPrompt(
  grade: string,
  theme: string,
  month?: number,
  instructions?: string,
  budget?: string,
  checklist?: string,
  duration: string = "45"
): string {
  const members = getAllMembers();

  return `
    BẠN LÀ: Tổng đạo diễn Sự kiện & Chuyên gia HĐTN (Master Prompt v75.10 - BUI THI XUAN SPECIAL EDITION).
    BỐI CẢNH: Soạn Kế hoạch Ngoại khóa cho trường THPT Bùi Thị Xuân - Mũi Né.

    [1. NHIỆM VỤ CHÍNH]
    Tạo một bản kế hoạch ngoại khóa BÙNG NỔ, CHI TIẾT ĐẾN TỪNG CÂU CHỮ cho chủ đề: "${theme}" (Khối ${grade}).
    
    [2. CHỈ DẪN NỘI DUNG & PHÂN CÔNG]
    - TUYỆT ĐỐI KHÔNG dùng dấu "..." hay "Tự soạn". 
    - MC Script: Phải có ít nhất 10 câu dẫn sôi nổi, chuyên nghiệp.
    - PHÂN CÔNG TỔ GIÁO VIÊN: Trong phần "chuan_bi", bạn PHẢI phân công cụ thể các nhiệm vụ chuẩn bị (Âm thanh, Băng rôn, Quản lý HS, Quà tặng, Kịch bản...) cho danh sách sau:
      + Thầy Bùi Quang Mẫn
      + Thầy Nguyễn Văn Linh
      + Thầy Mai Văn Phước
      + Thầy Trần Hoàng Thạch (Tổ trưởng - Chỉ đạo, Giám sát chung)
      + Thầy Trần Văn Tạ
    - Yêu cầu đặc biệt: ${instructions || "Sáng tạo tự do bùng nổ."}
    - Đồ dùng/Checklist: ${checklist || "Vật dụng thực tế, vé loto, loa đài..."}
    - Ngân sách: Khoảng ${budget || "Tối ưu nhất"} VNĐ.

    [3. ĐỊNH DẠNG TRẢ VỀ - JSON BẮT BUỘC]
    Trả về DUY NHẤT một khối JSON sau, không kèm lời dẫn.
    TUYỆT ĐỐI KHÔNG dùng các icon. Chỉ dùng duy nhất dấu gạch đầu dòng '-' cho toàn bộ các danh sách.
    Trình bày theo Thông tư 30 (Canh lề trái 1.27cm).

    {
      "so_ke_hoach": "${grade}/KHNK-HĐTN-HN",
      "topic_id": "${month}",
      "chu_de": "Chủ đề ${month}",
      "ten_chu_de": "${theme.toUpperCase()}",
      "muc_dich_yeu_cau": "Nêu 4-5 yêu cầu cần đạt chi tiết. Mỗi ý bắt đầu bằng dấu gạch đầu dòng '-'.",
      "nang_luc": "Năng lực tự chủ, năng lực số... (Dùng dấu '-' gạch đầu dòng)",
      "pham_chat": "Phẩm chất trách nhiệm... (Dùng dấu '-' gạch đầu dòng)",
      "thoi_gian": "${duration} phút - Tháng ${month || 'hiện tại'}",
      "dia_diem": "Sân trường THPT Bùi Thị Xuân - Mũi Né",
      "chuan_bi": "- Đối với GV: ...\\n- Đối với HS: ...",
      "budget_details": [
        {"item": "Thuê loa đài, âm thanh", "cost": "500000"},
        {"item": "Quà tặng trò chơi (10 phần)", "cost": "300000"},
        {"item": "In ấn băng rôn, vé loto", "cost": "200000"}
      ],
      "total_budget": "Tổng số tiền cụ thể",
      "timeline": [
        {
          "activity_name": "TÊN HOẠT ĐỘNG",
          "time": "5-10 phút",
          "description": "Mô tả chi tiết. Dùng dấu '-' cho các ý con nếu có.",
          "mc_script": "Lời dẫn MC sôi nổi, dùng dấu '-' nếu có liệt kê.",
          "logistics": "Cần chuẩn bị những gì (Dùng dấu '-')"
        }
      ],
      "thong_diep_ket_thuc": "Lời chúc kết thúc"
    }

    CHÚ Ý ĐẶC BIỆT: 
    - Tuyệt đối KHÔNG dùng các icon như ❖, 🎤, 📦, ✅. 
    - Chỉ dùng duy nhất dấu gạch đầu dòng '-' cho toàn bộ các danh sách.
    - Trình bày mạch lạc, canh lề trái thụt đầu dòng 1.27cm theo Thông tư 30/2020/TT-BGDĐT.

    CHÚ Ý: Nội dung trong JSON phải là tiếng Việt, viết chuẩn mực hành chính nhưng phần MC Script phải sôi nổi.
  `;
}

export const SURGICAL_UPGRADE_PROMPT = (fileSummary: string, topic: string) => `
BẠN LÀ: Chuyên gia Khai phá Dữ liệu Giáo dục. 
${fileSummary}
Chủ đề: ${topic}
`;
