
import { AdvancedAIProcessor, StructuredLessonPlan } from "@/lib/advanced-ai-processor";
import { analyzedPDFExtractor } from "@/lib/enhanced-pdf-extractor";
import { SmartPromptData } from "./smart-prompt-service";
import { ProcessingModule } from "@/lib/store/use-lesson-store";

/**
 * 🧱 LEGACY RESILIENCE ADAPTER
 * Bridges Architecture 18.0 (Multi-step Reasoning) with Architecture 19.0+ workflows.
 */
export class LegacyResilienceAdapter {
    private static instance: LegacyResilienceAdapter;
    private aiProcessor = new AdvancedAIProcessor();

    public static getInstance(): LegacyResilienceAdapter {
        if (!LegacyResilienceAdapter.instance) {
            LegacyResilienceAdapter.instance = new LegacyResilienceAdapter();
        }
        return LegacyResilienceAdapter.instance;
    }

    /**
     * Converts Arch 18.0 StructuredLessonPlan to 19.0+ ProcessingModules
     */
    public async processDocumentRobustly(
        rawText: string,
        smartData: SmartPromptData,
        topic: string,
        grade: string
    ): Promise<{ modules: ProcessingModule[], fullPlan: StructuredLessonPlan }> {
        console.log("[LegacyAdapter] Starting robust multi-step processing...");

        // 1. Prepare 18.0 Context
        const mockPdfContent = {
            rawText,
            summary: rawText.substring(0, 2000),
            structure: {
                hasTableOfContents: false,
                hasSections: true,
                hasTables: false,
                hasImages: false,
                estimatedPages: 1,
                contentDensity: 'medium' as const,
                language: 'vi' as const
            },
            sections: [],
            metadata: { title: topic }
        };

        const lessonContext = {
            topic,
            grade,
            educationalContext: { trongTamPhatTrien: smartData.studentCharacteristics || "Phát triển toàn diện" },
            smartPrompts: smartData
        };

        // 2. Execute 18.0 multi-step AI reasoning
        const fullPlan = await this.aiProcessor.processLessonWithAI(mockPdfContent as any, lessonContext as any);

        // 3. Map to 19.0 Modules
        const modules: ProcessingModule[] = [
            {
                id: "mod_legacy_khoi_dong",
                title: "Hoạt động 1: Khởi động (Legacy Robust)",
                type: "khoi_dong",
                content: fullPlan.hoat_dong_khoi_dong,
                isCompleted: true,
                prompt: "Generated via Architecture 18.0 Multi-step Reasoning"
            },
            {
                id: "mod_legacy_kham_pha",
                title: "Hoạt động 2: Khám phá (Legacy Robust)",
                type: "kham_pha",
                content: fullPlan.hoat_dong_kham_pha,
                isCompleted: true,
                prompt: "Generated via Architecture 18.0 Multi-step Reasoning"
            },
            {
                id: "mod_legacy_luyen_tap",
                title: "Hoạt động 3: Luyện tập (Legacy Robust)",
                type: "luyen_tap",
                content: fullPlan.hoat_dong_luyen_tap,
                isCompleted: true,
                prompt: "Generated via Architecture 18.0 Multi-step Reasoning"
            },
            {
                id: "mod_legacy_van_dung",
                title: "Hoạt động 4: Vận dụng (Legacy Robust)",
                type: "van_dung",
                content: fullPlan.hoat_dong_van_dung,
                isCompleted: true,
                prompt: "Generated via Architecture 18.0 Multi-step Reasoning"
            }
        ];

        return { modules, fullPlan };
    }
}
