
import { ProcessingModule } from "@/lib/store/use-app-store";
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
            ? `\n[CONTEXT_UPDATE]: Hoạt động trước đó đã hoàn thành. Hãy tiếp nối mạch bài học này để tạo sự logic.\nBối cảnh cũ: ${context.previousContext}\n`
            : "";

        let smartDataSection = "";
        if (context.smartData) {
            const sd = context.smartData;
            // ... (Smart Data Filtering Logic remains same)

            // SMART FILTERING ENGINE: Sử dụng dữ liệu đã được gán nhãn cho từng hoạt động
            const mission = sd.coreMissions[module.type === 'khoi_dong' ? 'khoiDong' :
                module.type === 'kham_pha' ? 'khamPha' :
                    module.type === 'luyen_tap' ? 'luyenTap' : 'vanDung'];

            const specificAdvice = `
## 🛡️ EXCLUSIVE DIRECTIVE (QUAN TRỌNG):
- CHỈ tập trung vào giai đoạn: ${module.title.toUpperCase()}.
- TUYỆT ĐỐI không lặp lại nội dung đã thuộc về các giai đoạn khác.
- DỰA TRÊN NGHIỆM VỤ CỐT LÕI SAU:
${mission}
`;

            smartDataSection = `
## 💡 CHỈ DẪN THÔNG MINH TỪ DATABASE (Cụ thể cho hoạt động này):
${specificAdvice}
----------------------------------
`;
        }

        // Prepare Semantic Context (Step 2 Implementation)
        const semanticContext = context.optimizedFileSummary && typeof context.optimizedFileSummary === 'object'
            ? {
                instructions: (context.optimizedFileSummary as any).semanticTags?.instructions,
                tasks: (context.optimizedFileSummary as any).semanticTags?.studentTasks,
                knowledge: (context.optimizedFileSummary as any).semanticTags?.knowledgeCores
            }
            : null;

        // Use ProfessionalContentProcessor for optimized prompt generation
        return (await ProfessionalContentProcessor.generateOptimizedPrompt(
            module.type,
            typeof optimizedContent === 'string' ? optimizedContent : JSON.stringify(optimizedContent),
            context.smartData,
            null,
            true, // skipNeural: TRUE for manual prompt generation
            semanticContext
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
            context.previousContext ? { summary: context.previousContext } : null,
            true // skipNeural: TRUE
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
