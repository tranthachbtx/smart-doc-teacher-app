
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
            ? `\n[CONTEXT_UPDATE]: Hoạt động trước đó đã hoàn thành. Hãy tiếp nối mạch bài học này để tạo sự logic.\nBối cảnh cũ: ${context.previousContext}\n`
            : "";

        let smartDataSection = "";
        if (context.smartData) {
            const sd = context.smartData;

            // SMART FILTERING ENGINE: Sử dụng dữ liệu đã được gán nhãn cho từng hoạt động
            let mission = "";
            switch (module.type) {
                case 'khoi_dong': mission = sd.coreMissions.khoiDong; break;
                case 'kham_pha': mission = sd.coreMissions.khamPha; break;
                case 'luyen_tap': mission = sd.coreMissions.luyenTap; break;
                case 'van_dung': mission = sd.coreMissions.vanDung; break;
                default: mission = "Nhiệm vụ chung từ chuyên gia.";
            }

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
                knowledge: (context.optimizedFileSummary as any).semanticTags?.knowledgeCores,
                products: (context.optimizedFileSummary as any).semanticTags?.products,
                assessment: (context.optimizedFileSummary as any).semanticTags?.assessment
            }
            : null;

        // Use ProfessionalContentProcessor for optimized prompt generation
        const prompt = await ProfessionalContentProcessor.generateOptimizedPrompt(
            module.type,
            typeof optimizedContent === 'string' ? optimizedContent : JSON.stringify(optimizedContent),
            context.smartData,
            null,
            true, // skipNeural: TRUE for manual prompt generation
            semanticContext
        );

        return prompt + contextInjection + smartDataSection;
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
