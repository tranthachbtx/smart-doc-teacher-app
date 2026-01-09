
import { ProcessingModule } from "@/lib/store/use-app-store";
import { SmartPromptData } from "./smart-prompt-service";
import { ProfessionalContentProcessor } from "./professional-content-processor";

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
        // V7: Comprehensive structure for manual workflow (MoET 5512)
        const modules: ProcessingModule[] = [
            { id: "mod_setup", title: "Bước 1: Mục tiêu & Thiết bị (Phần I, II, III)", type: "setup", prompt: "", content: "", isCompleted: false },
            { id: "mod_shdc", title: "Bước 2: Sinh hoạt Dưới cờ", type: "shdc", prompt: "", content: "", isCompleted: false },
            { id: "mod_khoi_dong", title: "Bước 3: Hoạt động 1 - Khởi động", type: "khoi_dong", prompt: "", content: "", isCompleted: false },
            { id: "mod_kham_pha", title: "Bước 4: Hoạt động 2 - Khám phá", type: "kham_pha", prompt: "", content: "", isCompleted: false },
            { id: "mod_luyen_tap", title: "Bước 5: Hoạt động 3 - Luyện tập", type: "luyen_tap", prompt: "", content: "", isCompleted: false },
            { id: "mod_van_dung", title: "Bước 6: Hoạt động 4 - Vận dụng", type: "van_dung", prompt: "", content: "", isCompleted: false },
            { id: "mod_shl", title: "Bước 7: Sinh hoạt Lớp", type: "shl", prompt: "", content: "", isCompleted: false },
            { id: "mod_appendix", title: "Bước 8: Phụ lục & Dặn dò (Phần V, VI)", type: "appendix", prompt: "", content: "", isCompleted: false }
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
    async generatePromptForModule(module: ProcessingModule, context: PromptContext): Promise<string> {
        // High-Precision Logic: Use pre-optimized content if available, otherwise process the raw summary
        let optimizedContent = "";

        if (context.optimizedFileSummary) {
            optimizedContent = context.optimizedFileSummary;
        } else {
            const baseContent = ManualWorkflowService.validateAndCleanFileSummary(context.fileSummary);
            const processedContent = ProfessionalContentProcessor.extractActivityContent(baseContent);
            optimizedContent = ProfessionalContentProcessor.optimizeForActivity(module.type, processedContent);
        }

        const contextInjection = context.previousContext
            ? `\\n[CONTEXT_UPDATE]: Hoạt động trước đó đã hoàn thành. Hãy tiếp nối mạch bài học này để tạo sự logic.\\nBối cảnh cũ: ${context.previousContext}\\n`
            : "";

        // --- CONSTRUCT MASTER PROMPT BLUEPRINT (FORCED EXPANSION) ---

        // PART 1: SYSTEM INSTRUCTION
        const systemInstruction = `
PHÁN 1: THIẾT LẬP HỆ ĐIỀU HÀNH (SYSTEM INSTRUCTION)
Bạn là KIẾN TRÚC SƯ SƯ PHẠM CAO CẤP (Pedagogical Architect), chuyên gia về chương trình "Hoạt động Trải nghiệm, Hướng nghiệp 12".
Tư duy cốt lõi: "GIÁO ÁN LÀ KỊCH BẢN ĐẠO DIỄN" (Director's Script).
Nhiệm vụ: Chuyển hóa các đầu mục khô khan thành một kịch bản hành động chi tiết từng giây, tập trung vào cảm xúc, tâm lý hành vi và xử lý tình huống thực tế.
Mục tiêu độ dài: Tạo ra nội dung sâu và dày nhất có thể (Max Tokens), tuyệt đối không tóm tắt.
`;

        // PART 2: DATA INPUT
        const dataInput = `
PHÁN 2: DỮ LIỆU ĐẦU VÀO (CONTEXT INJECTION)
## 📂 DỮ LIỆU HOẠT ĐỘNG:
- **Tên hoạt động:** ${module.title}
- **Thời lượng:** 10-15 phút (Điều chỉnh linh hoạt)
- **Mục tiêu cốt lõi:** ${module.type === 'khoi_dong' ? 'Kích thích hứng thú, kết nối kiến thức cũ' :
                module.type === 'kham_pha' ? 'Hình thành kiến thức mới, phát triển năng lực' :
                    module.type === 'luyen_tap' ? 'Củng cố kiến thức, rèn luyện kỹ năng' :
                        module.type === 'van_dung' ? 'Vận dụng thực tiễn, mở rộng vấn đề' : 'Theo định hướng bài dạy'}
- **Nội dung thô (từ PDF/SGK):**
  ${typeof optimizedContent === 'string' ? optimizedContent : JSON.stringify(optimizedContent)}
- **Bối cảnh địa phương:** ${context.topic} - Khối ${context.grade}.
- **Ngữ cảnh trước đó:** ${contextInjection}
`;

        // PART 3: DEEP DIVE INSTRUCTIONS
        const executionCommand = `
PHÁN 3: LỆNH THỰC THI "DEEP DIVE" (QUAN TRỌNG NHẤT)
## ⚡ CHỈ THỊ THỰC HIỆN "DEEP DIVE" (SIÊU CHI TIẾT):
Hãy thiết kế hoạt động này theo chuẩn Công văn 5512, nhưng ở chế độ "Full Capacity". Với mỗi bước (Transfer, Perform, Report, Conclude), bạn PHẢI triển khai đủ 4 lớp thông tin sau đây:

### 1. ĐỐI VỚI CỘT GIÁO VIÊN (teacher_action):
*Yêu cầu: Không viết văn xuôi, dùng Markdown gạch đầu dòng rõ ràng.*
- **(A) Kỹ thuật Setup:** Mô tả vị trí đứng (bục giảng/giữa lớp), ánh sáng, âm thanh, công cụ trực quan cần dùng.
- **(B) Lời thoại kịch bản (Verbatim Script):** Viết nguyên văn câu nói/câu hỏi của GV. Bắt đầu bằng: *"> GV nói:..."*. Ngôn từ phải truyền cảm hứng, gây tò mò, "đắt giá".
- **(C) Kịch bản phân luồng (Scenario Branching):**
  + *Nếu lớp trầm:* GV dùng câu hỏi mồi gì?
  + *Nếu lớp ồn/tranh luận lạc đề:* GV điều phối thế nào?
- **(D) Quan sát sư phạm:** Hướng dẫn GV cần nhìn vào đâu, chú ý biểu hiện gì của HS (ánh mắt, body language).

### 2. ĐỐI VỚI CỘT HỌC SINH (student_action):
- **(A) Trạng thái tâm lý (Psych State):** Mô tả cảm xúc của HS (hào hứng, e ngại, bất ngờ) ngay lúc nhận nhiệm vụ.
- **(B) Quy trình tư duy (Cognitive Process):** Mô tả diễn biến trong đầu HS. Họ đang nhớ lại điều gì? Đang phân tích cái gì?
- **(C) Hành động cụ thể:** Viết, vẽ, thảo luận, di chuyển.
- **(D) Tương tác xã hội (Social):** Mô tả cách HS tương tác với bạn bên cạnh (tranh luận, đồng tình, chia sẻ).

### 3. ĐỊNH DẠNG ĐẦU RA (JSON ONLY):
Trả về kết quả dưới dạng JSON hợp lệ, không kèm lời dẫn.
{
  "module_title": "${module.title}",
  "summary_for_next_step": "Tóm tắt ngắn gọn",
  "steps": [
    {
      "step_type": "transfer", 
      "teacher_action": "Markdown text...",
      "student_action": "Markdown text..."
    },
    {
      "step_type": "perform", 
      "teacher_action": "Markdown text...",
      "student_action": "Markdown text..."
    },
    {
      "step_type": "report", 
      "teacher_action": "Markdown text...",
      "student_action": "Markdown text..."
    },
    {
      "step_type": "conclude", 
      "teacher_action": "Markdown text...",
      "student_action": "Markdown text..."
    }
  ]
}
`;
        return `${systemInstruction}\n${dataInput}\n${executionCommand}`;
    },

    /**
     * Generate optimized prompt using ProfessionalContentProcessor
     */
    async generateOptimizedPromptForModule(module: ProcessingModule, context: PromptContext): Promise<string> {
        // Process content with ProfessionalContentProcessor
        const processedContent = ProfessionalContentProcessor.extractActivityContent(context.fileSummary);
        const optimizedContent = ProfessionalContentProcessor.optimizeForActivity(module.type, processedContent);

        // Generate optimized prompt (Now Async)
        return await ProfessionalContentProcessor.generateOptimizedPrompt(
            module.type,
            optimizedContent,
            context.smartData,
            context.previousContext ? { summary: context.previousContext } : null,
            true // skipNeural: TRUE
        );
    },

    /**
     * V7 Note: Robust generation is now handled directly by PedagogicalOrchestrator
     * in the automatic workflow. Manual workflow uses generatePromptForModule.
     */
};
