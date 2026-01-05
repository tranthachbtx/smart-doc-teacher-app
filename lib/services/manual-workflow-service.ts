
import { ProcessingModule } from "@/lib/store/use-lesson-store";
import { SmartPromptData } from "./smart-prompt-service";
import { LessonPlanAnalyzer } from "./lesson-plan-analyzer";

export interface PromptContext {
    topic: string;
    grade: string;
    fileSummary: string;
    optimizedFileSummary?: string;
    previousContext?: string;
    smartData?: SmartPromptData;
}

export const ManualWorkflowService = {
    /**
     * Phân tích cấu trúc bài học từ nội dung văn bản.
     */
    analyzeStructure(text: string, duration: string): ProcessingModule[] {
        const analyzed = LessonPlanAnalyzer.analyze(text);

        // Nếu có các hoạt động được trích xuất, ta có thể tạo các module tương ứng
        // Tuy nhiên, để linh hoạt theo chuẩn 5512 (4 bước), ta vẫn giữ 4 module chính,
        // nhưng có thể bổ sung thông tin từ file vào tiêu đề hoặc nội dung.

        const modules: ProcessingModule[] = [
            { id: "mod_khoi_dong", title: "Hoạt động 1: Khởi động (Mở đầu)", type: "khoi_dong", prompt: "", content: "", isCompleted: false },
            { id: "mod_kham_pha", title: "Hoạt động 2: Hình thành kiến thức mới (Khám phá)", type: "kham_pha", prompt: "", content: "", isCompleted: false },
            { id: "mod_luyen_tap", title: "Hoạt động 3: Luyện tập", type: "luyen_tap", prompt: "", content: "", isCompleted: false },
            { id: "mod_van_dung", title: "Hoạt động 4: Vận dụng", type: "van_dung", prompt: "", content: "", isCompleted: false }
        ];
        return modules;
    },

    /**
     * Helper to validate and clean file summary
     */
    validateAndCleanFileSummary(fileSummary: string): string {
        if (!fileSummary || fileSummary.trim().length === 0 || fileSummary === "Nội dung sách giáo khoa...") {
            return "Không có nội dung gốc được cung cấp. Hãy dựa vào kiến thức chuyên môn và chủ đề để thiết kế hoạt động.";
        }
        return fileSummary;
    },

    /**
     * Tạo Prompt "xịn" cho từng module để user copy sang Gemini Pro Web/ChatGPT
     */
    generatePromptForModule(module: ProcessingModule, context: PromptContext): string {
        // Use optimized summary if available, otherwise fallback to validated base summary
        const baseContent = context.optimizedFileSummary || ManualWorkflowService.validateAndCleanFileSummary(context.fileSummary);
        const finalFileSummary = context.optimizedFileSummary
            ? `## 🎯 DỮ LIỆU ĐÃ TỐI ƯU CHO ${module.title.toUpperCase()}\n${context.optimizedFileSummary}`
            : `## 📚 TÀI LIỆU GỐC (TRÍCH DẪN)\n${baseContent.substring(0, 3000)}...`;

        const contextInjection = context.previousContext
            ? `\n[CONTEXT_UPDATE]: Hoạt động trước đó đã hoàn thành. Hãy tiếp nối mạch bài học này để tạo sự logic.\nBối cảnh cũ: ${context.previousContext}\n`
            : "";

        let smartDataSection = "";
        if (context.smartData) {
            const sd = context.smartData;
            // ... (Smart Data Filtering Logic remains same)

            // SMART FILTERING ENGINE: Chỉ đưa dữ liệu CẦN THIẾT cho từng loại hoạt động
            let specificAdvice = "";

            if (module.type === 'khoi_dong') {
                specificAdvice = `
- **Tâm lý lứa tuổi**: ${sd.studentCharacteristics}
- **Chiến lược**: Hãy dùng đặc điểm tâm lý trên để thiết kế một trò chơi/tình huống mở đầu cực cuốn hút.`;
            } else if (module.type === 'kham_pha') {
                specificAdvice = `
- **Nhiệm vụ TRỌNG TÂM (SGK)**: 
${sd.coreTasks}
- **Công cụ số (NLS)**: 
${sd.digitalCompetency}
- **Chiến lược**: Hãy chuyển hóa các nhiệm vụ trọng tâm trên thành chuỗi hoạt động khám phá cụ thể. KHÔNG sáng tạo xa rời nhiệm vụ này.`;
            } else if (module.type === 'luyen_tap') {
                specificAdvice = `
- **Mục tiêu cần đạt**: ${sd.objectives}
- **Công cụ đánh giá**: ${sd.assessmentTools}
- **Chiến lược**: Thiết kế hệ thống bài tập để củng cố các mục tiêu trên.`;
            } else if (module.type === 'van_dung') {
                specificAdvice = `
- **Lưu ý thực tiễn**: ${sd.pedagogicalNotes}
- **Chiến lược**: Đưa ra bài toán thực tế/Dự án nhỏ kết nối với lưu ý trên.`;
            }

            smartDataSection = `
## 💡 CHỈ DẪN THÔNG MINH TỪ DATABASE (Cụ thể cho hoạt động này):
${specificAdvice}
----------------------------------
`;
        }

        const basePrompt = `Bạn là một Giáo viên xuất sắc, chuyên gia sư phạm hiện đại. Dựa trên thông tin sau:
- Môn học/Chủ đề: ${context.topic}
- Lớp: ${context.grade}
- Tài liệu nghiên cứu:
"""
${finalFileSummary}
"""
${smartDataSection}
${contextInjection}

Hãy viết chi tiết nội dung cho **${module.title}** theo chuẩn giáo án Công văn 5512.

🎯 PHẠM VI TẬP TRUNG (FOCUS SCOPE):
Nhiệm vụ của bạn CHỈ LÀ thiết kế nội dung cho: "**${module.title}**".
- Hãy LỌC ra những thông tin liên quan đến hoạt động này từ "Tài liệu gốc" ở trên.
- TUYỆT ĐỐI KHÔNG viết nội dung của các hoạt động khác vào đây.
- Nếu Dữ liệu nghiên cứu nhắc đến hoạt động sau, hãy để dành nó, ĐỪNG VIẾT VÀO BÂY GIỜ.
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
