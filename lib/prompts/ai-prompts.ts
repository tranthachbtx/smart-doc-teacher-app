import { getAllMembers } from "@/lib/config/department";

export const GRADE_PSYCHOLOGY = {
  "10": "Học sinh lớp 10 đang trong giai đoạn chuyển cấp, cần sự định hướng về môi trường mới và các giá trị nền tảng. DNA: Thích ứng & Khám phá.",
  "11": "Học sinh lớp 11 cần sự tập trung vào các kỹ năng sống, năng lực số và định hướng nghề nghiệp sớm. DNA: Phát triển & Bản sắc.",
  "12": "Học sinh lớp 12 đang chịu áp lực thi cử, cần sự tiếp sức, giải tỏa tâm lý và tư duy chiến thắng. DNA: Trưởng thành & Chuyển tiếp.",
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

export const EVENT_SMART_ADAPTER = `
QUY TẮC ƯU TIÊN VÀ XỬ LÝ THÔNG MINH (SMART ADAPTER):

1. NGUYÊN TẮC "LỒNG GHÉP":
   - Nếu User yêu cầu hoạt động giải trí (VD: Lô tô, Đập heo, Ca hát, Thời trang...), bạn KHÔNG ĐƯỢC tạo ra kịch bản giải trí thuần túy.
   - Bạn PHẢI biến tấu nội dung bên trong để phục vụ Mục tiêu bài học (SGK).
   - Công thức: [Hoạt động của User] + [Nội dung Chủ đề] = [Hoạt động Thông minh].

2. HƯỚNG DẪN CỤ THỂ CHO CÁC TRƯỜNG HỢP:
   - CASE 1: User đòi "Lô tô" + Chủ đề "Cộng đồng":
     -> Output: "Lô Tô Kiến Thức": Thay vì rao số ngẫu nhiên, MC rao câu đố về địa phương/tình huống ứng xử. Đáp án là con số để dò.
   - CASE 2: User đòi "Thời trang" + Chủ đề "Môi trường":
     -> Output: "Fashion Show Tái Chế": Trang phục làm từ rác thải nhựa.
   - CASE 3: User đòi "Đập heo đất" + Chủ đề "Tài chính/Tiết kiệm":
     -> Output: "Heo Đất Thông Thái": Trong heo có câu hỏi về quản lý tiền bạc, trả lời đúng mới được nhận phần thưởng.

3. YÊU CẦU VỚI LỜI DẪN MC (GEN Z CONNECT):
   - MC phải là người giải thích sự kết hợp này.
   - Ví dụ: "Hôm nay chúng ta chơi Lô tô, nhưng không phải để cầu may, mà để xem ai là trùm kiến thức xã hội!"
`;

export function getEventPrompt(
  grade: string,
  theme: string,
  month?: number,
  instructions?: string,
  budget?: string,
  checklist?: string,
  duration: string = "45",
  curriculumContext?: string
): string {
  const dna = GRADE_PSYCHOLOGY[grade as keyof typeof GRADE_PSYCHOLOGY] || "";

  return `
    BẠN LÀ: Tổng đạo diễn Sự kiện & Chuyên gia HĐTN (Master Prompt v76.0 - ADMINISTRATIVE EDITION).
    BỐI CẢNH: Soạn Kế hoạch Ngoại khóa chuẩn Nghị định 30/2020/NĐ-CP cho trường THPT Bùi Thị Xuân - Mũi Né.

    [1. NHIỆM VỤ CHÍNH]
    Tạo một bản kế hoạch ngoại khóa chuyên nghiệp, chi tiết dựa trên:
    - Chủ đề SGK: "${theme}" (Khối ${grade})
    - Yêu cầu hoạt động từ User: "${instructions || "AI tự đề xuất hoạt động phù hợp"}"
    - DNA Khối lớp: ${dna}

    ${EVENT_SMART_ADAPTER}

    [2. DỮ LIỆU CHUYÊN MÔN TỪ SGK]
    ${curriculumContext || "AI tự suy luận dựa trên chủ đề."}

    [3. CHỈ DẪN NỘI DUNG & PHÂN CÔNG]
    - TUYỆT ĐỐI KHÔNG dùng dấu "..." hay "Tự soạn", KHÔNG dùng biểu tượng (emoji).
    - MC Script: Phải có ít nhất 10 câu dẫn chuyên nghiệp, giải thích được sự kết nối giữa "Hoạt động vui chơi" và "Mục tiêu giáo dục".
    - PHÂN CÔNG TỔ GIÁO VIÊN: Trong phần "chuan_bi", bạn PHẢI phân công cụ thể các nhiệm vụ:
      + Thầy Bùi Quang Mẫn: Trang thiết bị, âm thanh.
      + Thầy Nguyễn Văn Linh: Hậu cần, quà tặng.
      + Thầy Mai Văn Phước: Thư ký, kịch bản.
      + Thầy Trần Hoàng Thạch (TTCM): Chỉ đạo chung, giám sát.
      + Thầy Trần Văn Tạ: Quản lý học sinh, an ninh.
    - Đồ dùng/Checklist: ${checklist || "Vật dụng thực tế phù hợp với hoạt động."}
    - Ngân sách: Khoảng ${budget || "Tối ưu nhất"} VNĐ.

    [4. ĐỊNH DẠNG TRẢ VỀ - JSON BẮT BUỘC]
    Trả về DUY NHẤT một khối JSON, trình bày theo chuẩn Nghị định 30.

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
