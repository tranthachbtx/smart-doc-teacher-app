
export interface ProcessedContent {
    content: string;
    normalizedContent: string;
    relevance: any;
    quality: number;
    source: string;
    metadata: {
        originalSections: any[];
        mergeReason?: string;
        processingTime: number;
    };
}

export class SmartContentDeduplicator {
    private static instance: SmartContentDeduplicator;
    private similarityThreshold = 0.85;

    public static getInstance(): SmartContentDeduplicator {
        if (!SmartContentDeduplicator.instance) {
            SmartContentDeduplicator.instance = new SmartContentDeduplicator();
        }
        return SmartContentDeduplicator.instance;
    }

    async deduplicateAndProcess(sections: any[]): Promise<ProcessedContent[]> {
        const uniqueContents: ProcessedContent[] = [];
        const processedHashes = new Set<string>();
        const contentHashes = new Map<string, ProcessedContent>();

        for (const section of sections) {
            const normalized = this.normalizeContent(section.content);
            const contentHash = this.hashString(normalized);

            if (processedHashes.has(contentHash)) continue;

            // Check for similarity with already processed unique contents
            let foundSimilar = false;
            for (let i = 0; i < uniqueContents.length; i++) {
                const similarity = this.calculateSimilarity(normalized, uniqueContents[i].normalizedContent);
                if (similarity > this.similarityThreshold) {
                    uniqueContents[i] = await this.mergeContent(section, uniqueContents[i]);
                    foundSimilar = true;
                    break;
                }
            }

            if (!foundSimilar) {
                const processed = {
                    content: section.content,
                    normalizedContent: normalized,
                    relevance: section.relevance,
                    quality: this.assessInitialQuality(section.content),
                    source: 'original',
                    metadata: {
                        originalSections: [section],
                        processingTime: Date.now()
                    }
                };
                uniqueContents.push(processed);
                processedHashes.add(contentHash);
            }
        }

        return uniqueContents;
    }

    private normalizeContent(content: string): string {
        return content
            .toLowerCase()
            .replace(/\s+/g, ' ')
            .replace(/[^\w\s\u00C0-\u1EF9]/g, '') // Keep Vietnamese characters
            .trim();
    }

    private hashString(str: string): string {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash |= 0;
        }
        return hash.toString();
    }

    private calculateSimilarity(s1: string, s2: string): number {
        const words1 = new Set(s1.split(' '));
        const words2 = new Set(s2.split(' '));
        const intersection = new Set([...words1].filter(x => words2.has(x)));
        const union = new Set([...words1, ...words2]);
        return intersection.size / union.size;
    }

    private async mergeContent(newSec: any, existing: ProcessedContent): Promise<ProcessedContent> {
        const newQuality = this.assessInitialQuality(newSec.content);
        const betterContent = newQuality > existing.quality ? newSec.content : existing.content;

        return {
            ...existing,
            content: betterContent,
            quality: Math.max(newQuality, existing.quality),
            metadata: {
                ...existing.metadata,
                originalSections: [...existing.metadata.originalSections, newSec],
                mergeReason: 'similarity_detected'
            }
        };
    }

    private assessInitialQuality(content: string): number {
        return content.length > 100 ? 80 : 40;
    }
}
