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
    BẠN LÀ: Tổng đạo diễn Sự kiện & Chuyên gia HĐTN (Master Prompt v76.0 - ADMINISTRATIVE EDITION).
    BỐI CẢNH: Soạn Kế hoạch Ngoại khóa chuẩn Nghị định 30/2020/NĐ-CP cho trường THPT Bùi Thị Xuân - Mũi Né.

    [1. NHIỆM VỤ CHÍNH]
    Tạo một bản kế hoạch ngoại khóa chuyên nghiệp, chi tiết cho chủ đề: "${theme}" (Khối ${grade}).
    
    [2. CHỈ DẪN NỘI DUNG & PHÂN CÔNG]
    - TUYỆT ĐỐI KHÔNG dùng dấu "..." hay "Tự soạn", KHÔNG dùng biểu tượng (emoji).
    - MC Script: Phải có ít nhất 10 câu dẫn chuyên nghiệp, lôi cuốn, phù hợp môi trường sư phạm (KHÔNG dùng từ lóng Gen Z).
    - PHÂN CÔNG TỔ GIÁO VIÊN: Trong phần "chuan_bi", bạn PHẢI phân công cụ thể các nhiệm vụ chuẩn bị cho các thành viên:
      + Thầy Bùi Quang Mẫn: Phụ trách trang thiết bị, âm thanh.
      + Thầy Nguyễn Văn Linh: Phụ trách hậu cần, quà tặng.
      + Thầy Mai Văn Phước: Thư ký, phụ trách kịch bản.
      + Thầy Trần Hoàng Thạch (TTCM): Chỉ đạo chung, giám sát việc thực hiện.
      + Thầy Trần Văn Tạ: Phụ trách quản lý học sinh và an ninh.
    - Yêu cầu đặc biệt: ${instructions || "Chi tiết và khoa học."}
    - Đồ dùng/Checklist: ${checklist || "Vật dụng thực tế, loa đài, thiết bị trình chiếu..."}
    - Ngân sách: Khoảng ${budget || "Tối ưu nhất"} VNĐ.

    [3. ĐỊNH DẠNG TRẢ VỀ - JSON BẮT BUỘC]
    Trả về DUY NHẤT một khối JSON sau, không kèm lời dẫn.
    TUYỆT ĐỐI KHÔNG dùng các icon hay emoji. Chỉ dùng duy nhất dấu gạch đầu dòng '-' cho các danh sách.
    Trình bày theo quy chuẩn Nghị định 30 (Font Times New Roman, canh lề đều).

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
      "chuan_bi": "- Đối với giáo viên: [Ghi rõ phân công cụ thể cho từng thầy đã nêu ở trên]\\n- Đối với học sinh: ...",
      "budget_details": [
        {"item": "Trang thiết bị âm thanh", "cost": "500000"},
        {"item": "Quà tặng phong trào", "cost": "300000"},
        {"item": "In ấn tài liệu, biểu ngữ", "cost": "200000"}
      ],
      "total_budget": "Tổng số tiền cụ thể",
      "timeline": [
        {
          "activity_name": "TÊN HOẠT ĐỘNG",
          "time": "5-10 phút",
          "description": "Mô tả chi tiết các bước. Dùng dấu '-' cho các ý con.",
          "mc_script": "Lời dẫn MC chuyên nghiệp, lịch sự.",
          "logistics": "Chuẩn bị thiết bị, dụng cụ (Dùng dấu '-')"
        }
      ],
      "thong_diep_ket_thuc": "Lời chúc và thông điệp kết thúc buổi ngoại khóa"
    }

    CHÚ Ý: Nội dung phải chuẩn mực hành chính, không có icon trang trí.
  `;
}

export const SURGICAL_UPGRADE_PROMPT = (fileSummary: string, topic: string) => `
BẠN LÀ: Chuyên gia Khai phá Dữ liệu Giáo dục. 
${fileSummary}
Chủ đề: ${topic}
`;
