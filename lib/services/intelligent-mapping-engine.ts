
import { RelevanceScore } from "./relevance-analyzer";

export interface MappedField {
    content: string;
    confidence: number;
    quality: number;
    suggestions: string[];
    metadata: {
        source?: string;
        relevanceScore: number;
        optimizations: string[];
    };
}

export class IntelligentMappingEngine {
    private static instance: IntelligentMappingEngine;

    public static getInstance(): IntelligentMappingEngine {
        if (!IntelligentMappingEngine.instance) {
            IntelligentMappingEngine.instance = new IntelligentMappingEngine();
        }
        return IntelligentMappingEngine.instance;
    }

    async optimize(content: string, score: RelevanceScore): Promise<string> {
        let optimized = content;

        // 1. Remove redundancy (Duplicate lines)
        optimized = this.removeDuplicateLines(optimized);

        // 2. Clear OCR artifacts
        optimized = this.clearOCRNoise(optimized);

        // 3. Structural cleanup
        optimized = this.fixFormatting(optimized);

        return optimized.trim();
    }

    private removeDuplicateLines(content: string): string {
        const lines = content.split('\n');
        const seen = new Set<string>();
        return lines.filter(line => {
            const trimmed = line.trim();
            if (trimmed.length < 3) return true; // Keep short lines like bullet markers
            if (seen.has(trimmed)) return false;
            seen.add(trimmed);
            return true;
        }).join('\n');
    }

    private clearOCRNoise(content: string): string {
        return content
            .replace(/--- Page \d+ ---/gi, '')
            .replace(/\[\d+\]/g, '') // Remove citation-like markers [1]
            .replace(/[┬┤┐┼]/g, '') // Remove box-drawing characters often seen in bad OCR
            .replace(/\s\s+/g, ' '); // Collapse multiple spaces
    }

    private fixFormatting(content: string): string {
        // Ensure bold markers have space
        return content
            .replace(/\*\*(.*?)\*\*/g, ' **$1** ')
            .replace(/\s+/g, ' ')
            .trim();
    }
}
