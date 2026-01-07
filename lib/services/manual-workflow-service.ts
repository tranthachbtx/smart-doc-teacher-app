
import { ProcessingModule } from "@/lib/store/use-lesson-store";
import { SmartPromptData } from "./smart-prompt-service";
import { LessonPlanAnalyzer } from "./lesson-plan-analyzer";
import { ProfessionalContentProcessor } from "./professional-content-processor";
import { LegacyResilienceAdapter } from "./legacy-resilience-adapter";

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
    async generatePromptForModule(module: ProcessingModule, context: PromptContext): Promise<string> {
        // Use optimized summary if available, otherwise fallback to validated base summary
        const baseContent = context.optimizedFileSummary || ManualWorkflowService.validateAndCleanFileSummary(context.fileSummary);

        // Process content with ProfessionalContentProcessor
        const processedContent = ProfessionalContentProcessor.extractActivityContent(baseContent);
        const optimizedContent = ProfessionalContentProcessor.optimizeForActivity(module.type, processedContent);

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

        // Use ProfessionalContentProcessor for optimized prompt generation
        return (await ProfessionalContentProcessor.generateOptimizedPrompt(
            module.type,
            optimizedContent,
            context.smartData
        )) + contextInjection + smartDataSection;
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
            context.previousContext ? { summary: context.previousContext } : null
        );
    },

    /**
     * RESTORED ARCHITECTURE 18.0 ROBUST MODE
     * Uses multi-step reasoning to generate high-quality initial draft.
     */
    async generateRobustModules(text: string, context: PromptContext): Promise<ProcessingModule[]> {
        const adapter = LegacyResilienceAdapter.getInstance();
        const result = await adapter.processDocumentRobustly(
            text,
            context.smartData!,
            context.topic,
            context.grade
        );
        return result.modules;
    }
};
