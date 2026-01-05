
import { ProcessingModule } from "@/lib/store/use-lesson-store";

export const ManualWorkflowService = {
    /**
     * Phân tích cấu trúc bài học từ file PDF đã upload (thông qua Summary từ Architect Phase)
     * Trả về danh sách các Module cần xử lý.
     */
    analyzeStructure(fileSummary: string, duration: string): ProcessingModule[] {
        // Logic cứng (Hardcoded Logic) hoặc AI nhẹ để chia module
        // Với KHBD 5512, cấu trúc luôn là:
        // 1. Khởi động (Mở đầu)
        // 2. Hình thành kiến thức (Có thể chia nhỏ thành HĐ 2.1, 2.2 nếu bài dài)
        // 3. Luyện tập
        // 4. Vận dụng

        // Để đơn giản và hiệu quả, ta tạo cấu trúc chuẩn 4 bước. 
        // Nếu số tiết > 2, có thể chia nhỏ phần Khám phá.

        const modules: ProcessingModule[] = [
            {
                id: "mod_khoi_dong",
                title: "Hoạt động 1: Khởi động (Mở đầu)",
                type: "khoi_dong",
                prompt: "",
                content: "",
                isCompleted: false
            },
            {
                id: "mod_kham_pha",
                title: "Hoạt động 2: Hình thành kiến thức mới (Khám phá)",
                type: "kham_pha",
                prompt: "",
                content: "",
                isCompleted: false
            },
            {
                id: "mod_luyen_tap",
                title: "Hoạt động 3: Luyện tập",
                type: "luyen_tap",
                prompt: "",
                content: "",
                isCompleted: false
            },
            {
                id: "mod_van_dung",
                title: "Hoạt động 4: Vận dụng",
                type: "van_dung",
                prompt: "",
                content: "",
                isCompleted: false
            }
        ];

        return modules;
    },

    /**
     * Tạo Prompt "xịn" cho từng module để user copy sang Gemini Pro Web/ChatGPT
     */
    generatePromptForModule(
        module: ProcessingModule,
        context: { topic: string, grade: string, fileSummary: string, previousContext?: string }
    ): string {
        const contextInjection = context.previousContext
            ? `\n[CONTEXT_UPDATE]: Hoạt động trước đó đã hoàn thành. Hãy tiếp nối mạch bài học này để tạo sự logic.\nBối cảnh cũ: ${context.previousContext}\n`
            : "";

        const basePrompt = `Bạn là một Giáo viên xuất sắc, chuyên gia sư phạm hiện đại. Dựa trên thông tin sau:
- Môn học/Chủ đề: ${context.topic}
- Lớp: ${context.grade}
- Tài liệu gốc (Tham khảo ý tưởng):
"""
${context.fileSummary.substring(0, 1000)}... (trích dẫn)
"""
${contextInjection}

Hãy viết chi tiết nội dung cho **${module.title}** theo công văn 5512.
Yêu cầu đặc biệt:
1. Phong cách GEN Z: Ngôn ngữ gần gũi, ví dụ thực tế, bắt trend nhưng vẫn chuẩn mực sư phạm.
2. Phương pháp dạy học tích cực: Sử dụng các kỹ thuật như "Mảnh ghép", "Khăn trải bàn", "Phòng tranh", hoặc Gamification.
3. Tích hợp AI (Miền 6): Đề xuất cách học sinh dùng AI để giải quyết nhiệm vụ (nếu phù hợp).

⚠️ QUAN TRỌNG: ĐỊNH DẠNG ĐẦU RA (Standardized Output Protocol)
Tuyệt đối KHÔNG trả về text tự do. Hãy trả về duy nhất một chuỗi JSON hợp lệ theo format sau:
{
  "module_title": "Tên chi tiết hoạt động",
  "duration": "15 phút",
  "summary_for_next_step": "Tóm tắt ngắn gọn (2-3 câu) nội dung hoạt động này để làm ngữ cảnh cho bước sau.",
  "steps": [
    {
      "step_type": "transfer" | "perform" | "report" | "conclude", 
      "teacher_action": "Nội dung cột GV (Markdown). Chú ý Escape dấu ngoặc kép: \\\"Lời thoại\\\"",
      "student_action": "Nội dung cột HS"
    }
  ]
}

🚫 LƯU Ý KỸ THUẬT (Technical Constraints):
1. **Valid JSON**: Không được thiếu dấu phẩy, không thừa dấu phẩy cuối mảng.
2. **Escape Characters**:
   - Dấu ngoặc kép (") trong văn bản phải viết là \\" (Ví dụ: GV nói: \\"Chào các em\\").
   - Dấu gạch chéo (\\) trong LaTeX ($...$) phải viết là \\\\ (Ví dụ: $\\\\frac{1}{2}$).
3. **Markdown**: Có thể dùng in đậm (**text**), xuống dòng (\\n).`;

        let specificPrompt = "";
        switch (module.type) {
            case 'khoi_dong':
                specificPrompt = `\n\nĐặc thù Hoạt động Khởi động: \n- Mục tiêu: Tạo tâm thế, kích thích tò mò.\n - Gợi ý: Dùng trò chơi, video ngắn, tình huống gây cấn.`;
                break;
            case 'kham_pha':
                specificPrompt = `\n\nĐặc thù Hoạt động Hình thành kiến thức: \n - Mục tiêu: Giúp HS chiếm lĩnh kiến thức mới.\n - Gợi ý: Chia nhỏ thành các bước chuyển giao nhiệm vụ rõ ràng.Dùng sơ đồ tư duy.`;
                break;
            case 'luyen_tap':
                specificPrompt = `\n\nĐặc thù Hoạt động Luyện tập: \n - Mục tiêu: Củng cố kiến thức.\n - Gợi ý: Hệ thống câu hỏi trắc nghiệm, bài tập thực tế.`;
                break;
            case 'van_dung':
                specificPrompt = `\n\nĐặc thù Hoạt động Vận dụng: \n - Mục tiêu: Giải quyết vấn đề thực tiễn.\n - Gợi ý: Dự án nhỏ(Project based), liên hệ thực tế.`;
                break;
            default:
                specificPrompt = "";
        }

        return basePrompt + specificPrompt;
    }
};
