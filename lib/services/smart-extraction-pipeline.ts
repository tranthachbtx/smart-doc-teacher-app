
import { SmartContentDeduplicator } from "./smart-content-deduplicator";
import { PedagogicalRelevanceEngine } from "./pedagogical-relevance-engine";
import { IntelligentContentCleaner } from "./intelligent-content-cleaner";

export class SmartExtractionPipeline {
    private static instance: SmartExtractionPipeline;

    private deduplicator = SmartContentDeduplicator.getInstance();
    private relevanceEngine = PedagogicalRelevanceEngine.getInstance();
    private cleaner = IntelligentContentCleaner.getInstance();

    public static getInstance(): SmartExtractionPipeline {
        if (!SmartExtractionPipeline.instance) {
            SmartExtractionPipeline.instance = new SmartExtractionPipeline();
        }
        return SmartExtractionPipeline.instance;
    }

    async process(rawSections: any[]): Promise<any[]> {
        // Step 1: Deduplication (Merge similar contents)
        const uniqueItems = await this.deduplicator.deduplicateAndProcess(rawSections);

        const results = [];
        for (const item of uniqueItems) {
            // Step 2: Advanced Scoring
            const relevance = await this.relevanceEngine.calculateRelevanceScore(item.content);

            // Step 3: Deep Cleaning
            const cleanedContent = await this.cleaner.clean(item.content);

            // Step 4: Map to highest score factor
            const bestActivity = relevance.activities.reduce((prev, current) =>
                (prev.score > current.score) ? prev : current
            );

            results.push({
                id: item.metadata.originalSections[0].id,
                title: item.metadata.originalSections[0].title,
                type: item.metadata.originalSections[0].type,
                content: cleanedContent,
                relevance: {
                    khoi_dong: this.getScore(relevance.activities, 'khoi_dong'),
                    kham_pha: this.getScore(relevance.activities, 'kham_pha'),
                    luyen_tap: this.getScore(relevance.activities, 'luyen_tap'),
                    van_dung: this.getScore(relevance.activities, 'van_dung')
                },
                metadata: {
                    ...item.metadata.originalSections[0].metadata,
                    qualityScore: item.quality,
                    wordCount: cleanedContent.split(/\s+/).length
                }
            });
        }

        return results;
    }

    private getScore(activities: any[], type: string): number {
        return Math.round(activities.find(a => a.activityType === type)?.score || 0);
    }
}
