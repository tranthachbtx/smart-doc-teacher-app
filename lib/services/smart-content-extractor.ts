
import { RelevanceAnalyzer, RelevanceScore } from "./relevance-analyzer";
import { IntelligentMappingEngine } from "./intelligent-mapping-engine";

export interface MappedContent {
    [fieldId: string]: {
        content: string;
        relevance: RelevanceScore;
        confidence: number;
    };
}

export class SmartContentExtractor {
    private static instance: SmartContentExtractor;
    private analyzer: RelevanceAnalyzer;
    private engine: IntelligentMappingEngine;

    private constructor() {
        this.analyzer = RelevanceAnalyzer.getInstance();
        this.engine = IntelligentMappingEngine.getInstance();
    }

    public static getInstance(): SmartContentExtractor {
        if (!SmartContentExtractor.instance) {
            SmartContentExtractor.instance = new SmartContentExtractor();
        }
        return SmartContentExtractor.instance;
    }

    /**
     * Orchestrates high-precision content extraction and mapping
     */
    async extractAndMap(rawSections: any[]): Promise<MappedContent> {
        const result: MappedContent = {};

        for (const section of rawSections) {
            // 1. Calculate deep relevance
            const score = await this.analyzer.calculate({
                content: section.content,
                fieldType: section.type,
                context: section.title
            });

            // 2. Intelligent Content Optimization
            const optimizedContent = await this.engine.optimize(section.content, score);

            // 3. Map to final output
            result[section.id || section.title] = {
                content: optimizedContent,
                relevance: score,
                confidence: score.overall / 100
            };
        }

        return result;
    }
}
