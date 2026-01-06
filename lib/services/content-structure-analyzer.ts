import { LessonPlanAnalyzer } from "./lesson-plan-analyzer";
import { HybridCacheManager } from "./hybrid-cache-manager";
import { MultiModalAIManager } from "./multi-modal-ai-manager";
import { AdvancedAIManager } from "./advanced-ai-manager";
import { SmartExtractionPipeline } from "./smart-extraction-pipeline";

export interface ContentSection {
    id: string;
    title: string;
    type: 'objective' | 'activity' | 'knowledge' | 'assessment' | 'resource';
    content: string;
    subsections?: ContentSection[];
    relevance: {
        khoi_dong: number; // 0-100
        kham_pha: number;
        luyen_tap: number;
        van_dung: number;
    };
    metadata: {
        pageNumbers: number[];
        wordCount: number;
        complexity: 'low' | 'medium' | 'high';
        qualityScore?: number;
    };
}

export interface StructuredContent {
    title: string;
    grade: string;
    subject: string;
    sections: ContentSection[];
    metadata: {
        totalWordCount: number;
        sectionCount: number;
        processedAt: string;
    };
    reasoning?: any; // Architecture 7.1: Pedagogical Advisor Insights
}

export interface AnalysisOptions {
    forceAI?: boolean;
    timeout?: number;
    signal?: AbortSignal;
}

export class ContentStructureAnalyzer {
    private static instance: ContentStructureAnalyzer;
    private abortController: AbortController | null = null;

    public static getInstance(): ContentStructureAnalyzer {
        if (!ContentStructureAnalyzer.instance) {
            ContentStructureAnalyzer.instance = new ContentStructureAnalyzer();
        }
        return ContentStructureAnalyzer.instance;
    }

    /**
     * Phân tích cấu trúc PDF với cơ chế tối ưu:
     * 1. Chống trùng lặp (Deduplication)
     * 2. Hủy yêu cầu cũ (Cancellation)
     * 3. Phân tích nhanh (Quick Bypass)
     * 4. Kiểm soát thời gian AI (Timeout)
     */
    async analyzePDFContent(rawText: string, options?: AnalysisOptions): Promise<StructuredContent> {
        // 1. Generate unique cache key (Architecture 7.0)
        const cacheKey = `arch7_struct_${rawText.substring(0, 50)}_${rawText.length}`;

        // 2. Hybrid Multi-Tier Cache Check (L1 -> L2 -> L3)
        const cacheManager = HybridCacheManager.getInstance();
        const cached = await cacheManager.get<StructuredContent>(cacheKey);

        if (cached) {
            console.log('[ContentStructureAnalyzer] 🚀 Instant-On: Found in Hybrid Cache (Arch 7.0)!');
            return cached;
        }

        // 4. Hủy yêu cầu cũ nếu có (Tránh Fast Refresh loop)
        if (this.abortController) {
            this.abortController.abort();
            console.log('[ContentStructureAnalyzer] Đã hủy yêu cầu cũ để tránh xung đột.');
        }
        this.abortController = new AbortController();

        const result = await this.performAnalysisWorkflow(rawText, options, this.abortController.signal, cacheKey);
        return result;
    }

    private async performAnalysisWorkflow(
        rawText: string,
        options?: AnalysisOptions,
        signal?: AbortSignal,
        cacheKey?: string // Architecture 7.0: Use cacheKey for saving
    ): Promise<StructuredContent> {
        const startTime = Date.now();
        const cacheManager = HybridCacheManager.getInstance();

        try {
            // 1. Quick Analysis Bypass
            const hasExistingStructure = /^#{1,3}\s+/m.test(rawText) || /^[0-9]\.\s+/m.test(rawText);
            if (hasExistingStructure && options?.forceAI === false) {
                console.log('[ContentStructureAnalyzer] Force AI is off and structure detected, skipping to Regex.');
                return this.getFallbackStructure(rawText);
            }

            // 2. Multi-Modal AI Orchestration (Architecture 7.0)
            const mmAIManager = MultiModalAIManager.getInstance();
            const structurePrompt = this.generateEnhancedStructurePrompt(rawText);

            const mmResult = await mmAIManager.processContent(
                { text: rawText },
                structurePrompt
            );

            const aiResult = await this.parseAndProcessAIResult(mmResult.content, rawText);

            // ARCH 7.1: Attach reasoning from MultiModal session
            aiResult.reasoning = mmResult.insights.reasoning;

            console.log(`[ContentStructureAnalyzer] Architecture 7.1 Analysis hoàn tất trong ${Date.now() - startTime}ms`);

            // Save to Hybrid Cache
            if (cacheKey) {
                await cacheManager.set(cacheKey, aiResult);
            }

            return aiResult;

        } catch (error: any) {
            if (error.name === 'AbortError' || signal?.aborted) {
                console.log('[ContentStructureAnalyzer] Phân tích bị hủy.');
                throw error;
            }

            console.warn(`[ContentStructureAnalyzer] Lỗi AI (Fallback to Regex):`, error.message);
            const fallbackResult = this.getFallbackStructure(rawText);

            // Even fallback should be cached briefly
            if (cacheKey) {
                await cacheManager.set(cacheKey, fallbackResult);
            }

            return fallbackResult;
        }
    }

    private generateEnhancedStructurePrompt(rawText: string): string {
        return `
Bạn là "Kiến trúc sư Giáo án số" hàng đầu, chuyên gia bóc tách tinh hoa từ văn bản giáo dục.

NHIỆM VỤ: Biến raw text từ PDF thành cấu trúc giáo án "SIÊU SẠCH" theo chuẩn MoET 5512.

CHIẾN LƯỢC TRÍCH XUẤT "PHẪU THUẬT":
1. CHỈ TRÍCH XUẤT TRỌNG TÂM: Loại bỏ hoàn toàn các câu chào hỏi ("Chào các em"), các chỉ dẫn lặp lại ("Các em mở sách trang..."), lời dẫn dắt thừa.
2. CÔ ĐẶC NỘI DUNG: Tập trung vào:
   - Mục tiêu: Năng lực, phẩm chất cần đạt (Dạng gạch đầu dòng).
   - Kiến thức cốt lõi: Các định nghĩa, công thức, quy tắc chính.
   - Hoạt động: Nhiệm vụ - Sản phẩm - Kết luận (Bỏ qua lời dẫn thoại dài dòng).
3. LOẠI BỎ RÁC PDF: Xóa số trang, header/footer, ký tên, thông tin phòng GD&ĐT, trường học.
4. PHÂN LOẠI CHÍNH XÁC: 
   - objective: Mục tiêu bài học.
   - activity: Các bước dạy học chính.
   - knowledge: Kiến thức trọng tâm.
   - resource: Thiết bị, học liệu.

ĐỊNH DẠNG JSON BẮT BUỘC:
{
  "title": "Tiêu đề bài học (Làm sạch các tiền tố Bài, Chủ đề...)",
  "subject": "Môn học",
  "grade": "Khối lớp",
  "sections": [
    {
      "title": "Tiêu đề ngắn gọn (VD: 'Mục tiêu', 'Hoạt động 1: Khởi động')",
      "type": "objective|activity|knowledge|resource",
      "content": "Nội dung đã được tinh lọc, cô đọng nhất (Sử dụng markdown gạch đầu dòng)",
      "relevance": {
        "khoi_dong": 0-100,
        "kham_pha": 0-100,
        "luyen_tap": 0-100,
        "van_dung": 0-100
      },
      "metadata": { "complexity": "low|medium|high" }
    }
  ]
}

NỘI DUNG PDF CẦN "PHẪU THUẬT":
${rawText.substring(0, 9000)}
`.trim();
    }

    private async parseAndProcessAIResult(content: string, rawText: string): Promise<StructuredContent> {
        const parsed = this.parseAIResponse(content);

        const sections = (parsed.sections || []).map((s: any, index: number) => ({
            ...s,
            id: s.id || `sec_${Date.now()}_${index}`,
            metadata: {
                ...s.metadata,
                pageNumbers: s.pageNumbers || [],
                wordCount: (s.content || "").split(/\s+/).length,
                complexity: s.metadata?.complexity || 'medium'
            }
        }));

        // Architecture 7.2.1: Advanced Unified Extraction Pipeline
        const pipeline = SmartExtractionPipeline.getInstance();
        const pipelineResult = await pipeline.process(sections);

        return {
            title: parsed.title || "Tài liệu chưa đặt tên",
            grade: parsed.grade || "Chưa rõ",
            subject: parsed.subject || "Chưa rõ",
            sections: pipelineResult,
            metadata: {
                totalWordCount: rawText.split(/\s+/).length,
                sectionCount: pipelineResult.length,
                processedAt: new Date().toISOString()
            }
        };
    }

    private generateStructurePrompt(rawText: string): string {
        return `Bạn là chuyên gia phân tích dữ liệu giáo dục. Hãy phân tích nội dung giáo án sau và bóc tách thành các phần nhỏ có ý nghĩa sư phạm.
        
        YÊU CẦU NGHIÊM NGẶT:
        1. Trả về DUY NHẤT định dạng JSON hợp lệ. KHÔNG thêm bất kỳ văn bản giải thích nào khác.
        2. Phân loại từng phần: objective (mục tiêu), activity (hoạt động), knowledge (kiến thức), assessment (đánh giá), resource (thiết bị/tài liệu).
        3. Đánh giá mức độ liên quan (0-100) cho: Khởi động (khoi_dong), Khám phá (kham_pha), Luyện tập (luyen_tap), Vận dụng (van_dung).

        ĐỊNH DẠNG JSON BẮT BUỘC:
        {
            "title": "Tiêu đề bài học",
            "grade": "Khối lớp",
            "subject": "Môn học",
            "sections": [
                {
                    "title": "Tiêu đề mục",
                    "type": "objective|activity|knowledge|assessment|resource",
                    "content": "Nội dung chi tiết",
                    "pageNumbers": [1],
                    "relevance": {
                        "khoi_dong": 80,
                        "kham_pha": 90,
                        "luyen_tap": 70,
                        "van_dung": 60
                    },
                    "metadata": { "complexity": "low|medium|high" }
                }
            ]
        }
        
        NỘI DUNG CẦN PHÂN TÍCH:
        ${rawText.substring(0, 6000)}
        
        JSON Response:`;
    }

    private parseAIResponse(aiResponse: string): any {
        try {
            // 1. Try direct JSON parse
            return JSON.parse(aiResponse);
        } catch (error) {
            console.warn('[ContentStructureAnalyzer] Direct JSON parse failed, attempting regex extraction...');

            try {
                // 2. Extract JSON from text response using refined regex
                const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    return JSON.parse(jsonMatch[0]);
                }

                // 3. Try markdown code block extraction
                const codeBlockMatch = aiResponse.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
                if (codeBlockMatch) {
                    return JSON.parse(codeBlockMatch[1]);
                }
            } catch (innerError) {
                console.error('[ContentStructureAnalyzer] All parsing attempts failed:', innerError);
            }

            // 4. Return dummy structure that will trigger fallback in caller if necessary
            throw new Error("PARSING_FAILED");
        }
    }

    private getFallbackStructure(rawText: string): StructuredContent {
        const analyzed = LessonPlanAnalyzer.analyze(rawText);
        const sections: ContentSection[] = [];

        // 1. Add Objectives - Giới hạn nội dung trích xuất
        if (analyzed.objectives) {
            sections.push({
                id: `fallback_obj_${Date.now()}`,
                title: "Mục tiêu bài học (Bản rút gọn)",
                type: "objective",
                content: analyzed.objectives.substring(0, 500) + (analyzed.objectives.length > 500 ? "..." : ""),
                relevance: { khoi_dong: 90, kham_pha: 10, luyen_tap: 10, van_dung: 10 },
                metadata: { pageNumbers: [], wordCount: Math.min(analyzed.objectives.split(/\s+/).length, 100), complexity: 'medium' }
            });
        }

        // 2. Add Preparations
        if (analyzed.preparations) {
            sections.push({
                id: `fallback_prep_${Date.now()}`,
                title: "Chuẩn bị của GV & HS",
                type: "resource",
                content: analyzed.preparations.substring(0, 500) + (analyzed.preparations.length > 500 ? "..." : ""),
                relevance: { khoi_dong: 50, kham_pha: 50, luyen_tap: 20, van_dung: 20 },
                metadata: { pageNumbers: [], wordCount: Math.min(analyzed.preparations.split(/\s+/).length, 100), complexity: 'low' }
            });
        }

        // 3. Add Activities
        analyzed.activities.forEach((act, index) => {
            sections.push({
                id: `fallback_act_${Date.now()}_${index}`,
                title: act.title,
                type: "activity",
                content: act.content,
                relevance: {
                    khoi_dong: index === 0 ? 80 : 20,
                    kham_pha: 70,
                    luyen_tap: index > 1 ? 80 : 30,
                    van_dung: 40
                },
                metadata: { pageNumbers: [], wordCount: act.content.split(/\s+/).length, complexity: 'medium' }
            });
        });

        // 4. Default knowledge section if everything else is empty
        if (sections.length === 0) {
            sections.push({
                id: "fallback_raw",
                title: "Nội dung trích xuất thô",
                type: "knowledge",
                content: rawText.substring(0, 5000),
                relevance: { khoi_dong: 50, kham_pha: 50, luyen_tap: 50, van_dung: 50 },
                metadata: { pageNumbers: [], wordCount: rawText.length / 5, complexity: 'medium' }
            });
        }

        return {
            title: analyzed.topic || "Tài liệu trích xuất (Regex Mode)",
            grade: "Chưa rõ",
            subject: "Chưa rõ",
            sections: sections,
            metadata: {
                totalWordCount: rawText.split(/\s+/).length,
                sectionCount: sections.length,
                processedAt: new Date().toISOString()
            }
        };
    }
}
