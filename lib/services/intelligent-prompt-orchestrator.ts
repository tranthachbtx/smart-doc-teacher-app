import { ProcessingModule } from "../store/use-lesson-store";
import { ManualWorkflowService, PromptContext } from "./manual-workflow-service";
import { generateAIContent } from "../actions/gemini";
import { SmartPromptService } from "./smart-prompt-service";
import { UnifiedContentAggregator } from "./unified-content-aggregator";
import { ActivityType } from "./intelligent-context-engine";

export interface OrchestrationResult {
    success: boolean;
    modules: ProcessingModule[];
    totalTokens: number;
    error?: string;
}

/**
 * Architecture 6.0: Intelligent Prompt Orchestrator
 * Tự động hóa quy trình 4-Prompt để tạo giáo án 30-50 trang không cần user can thiệp thủ công từng bước.
 */
export class IntelligentPromptOrchestrator {
    private static instance: IntelligentPromptOrchestrator;

    private constructor() { }

    static getInstance(): IntelligentPromptOrchestrator {
        if (!this.instance) {
            this.instance = new IntelligentPromptOrchestrator();
        }
        return this.instance;
    }

    /**
     * Chạy quy trình tự động xâu chuỗi 4 bước
     */
    async generateFullLesson(
        topic: string,
        grade: string,
        fileSummary: string,
        onProgress?: (status: string, progress: number) => void
    ): Promise<OrchestrationResult> {
        const modules = ManualWorkflowService.analyzeStructure(fileSummary, "2 tiết");
        const results: ProcessingModule[] = [...modules];
        let totalTokens = 0;
        let previousSummary = "";

        // Tra cứu dữ liệu chuyên môn một lần để dùng chung
        onProgress?.("Đang tra cứu cơ sở dữ liệu giáo dục...", 10);
        const smartData = await SmartPromptService.lookupSmartData(grade, topic);
        const aggregator = UnifiedContentAggregator.getInstance();

        for (let i = 0; i < results.length; i++) {
            const module = results[i];
            const stepProgress = 10 + (i * 20);
            onProgress?.(`Đang tạo nội dung: ${module.title}...`, stepProgress);

            // 1. Chuẩn bị ngữ cảnh (Context Chaining)
            const aggregatedData = aggregator.aggregate(
                { title: topic, grade, subject: "", sections: [], metadata: { totalWordCount: 0, sectionCount: 0, processedAt: "" } },
                smartData,
                module.type as ActivityType,
                45 // Target 45 pages
            );

            const context: PromptContext = {
                topic,
                grade,
                fileSummary,
                previousSummary,
                smartData,
                aggregatedData
            };

            const prompt = ManualWorkflowService.generatePromptForModule(module, context);

            // 2. Gọi AI thực thi
            try {
                // Sử dụng model mạnh nhất cho việc viết dài
                const response = await generateAIContent(prompt, "gemini-1.5-pro");

                if (response.success && response.content) {
                    results[i].content = response.content;
                    results[i].isCompleted = true;

                    // 3. Trích xuất ngữ cảnh cho bước sau (Chaining)
                    previousSummary = ManualWorkflowService.extractSummaryFromContent(response.content);
                } else {
                    throw new Error(response.error || `Lỗi tại bước ${module.title}`);
                }
            } catch (error: any) {
                console.error(`Orchestration failed at ${module.title}:`, error);
                return { success: false, modules: results, totalTokens, error: error.message };
            }
        }

        onProgress?.("Hoàn tất quy trình 4 bước!", 100);
        return { success: true, modules: results, totalTokens };
    }
}
