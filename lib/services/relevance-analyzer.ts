
export interface RelevanceScore {
    overall: number;
    content: number;
    pedagogical: number;
    contextual: number;
    semantic: number;
    quality: number;
    coherence: number;
    suggestions: string[];
}

export interface RelevanceCalculationParams {
    content: string;
    fieldType: string;
    context?: any;
    priority?: number;
    constraints?: any;
}

export class RelevanceAnalyzer {
    private static instance: RelevanceAnalyzer;

    public static getInstance(): RelevanceAnalyzer {
        if (!RelevanceAnalyzer.instance) {
            RelevanceAnalyzer.instance = new RelevanceAnalyzer();
        }
        return RelevanceAnalyzer.instance;
    }

    async calculate(params: RelevanceCalculationParams): Promise<RelevanceScore> {
        // 1. Content-based relevance
        const contentRelevance = this.calculateContentRelevance(params);

        // 2. Pedagogical relevance (Heuristic-based)
        const pedagogicalRelevance = this.calculatePedagogicalHeuristic(params);

        // 3. Contextual relevance
        const contextualRelevance = 85; // Baseline

        // 4. Semantic relevance
        const semanticRelevance = 80; // Baseline

        // 5. Weighted scoring
        const weights = this.getWeights(params.fieldType);
        const overall = (
            contentRelevance * weights.content +
            pedagogicalRelevance * weights.pedagogical +
            contextualRelevance * weights.contextual +
            semanticRelevance * weights.semantic
        ) / 100;

        return {
            overall,
            content: contentRelevance,
            pedagogical: pedagogicalRelevance,
            contextual: contextualRelevance,
            semantic: semanticRelevance,
            quality: this.assessQuality(params.content),
            coherence: this.assessCoherence(params.content),
            suggestions: this.generateSuggestions(params, overall)
        };
    }

    private calculateContentRelevance(params: RelevanceCalculationParams): number {
        const content = params.content.toLowerCase();
        const fieldType = params.fieldType;

        const keywords = this.getKeywordsForFieldType(fieldType);
        let matchCount = 0;
        keywords.forEach(kw => {
            if (content.includes(kw.toLowerCase())) matchCount++;
        });

        const keywordScore = Math.min(100, (matchCount / Math.max(1, keywords.length / 2)) * 100);

        // Pattern matching
        const patterns = this.getPatternsForFieldType(fieldType);
        let patternScore = 0;
        patterns.forEach(p => {
            if (p.test(content)) patternScore += (100 / patterns.length);
        });

        return (keywordScore * 0.6) + (patternScore * 0.4);
    }

    private calculatePedagogicalHeuristic(params: RelevanceCalculationParams): number {
        const content = params.content;
        // Check for active verbs (pedagogical signifier)
        const activeVerbs = ['phân tích', 'trình bày', 'vận dụng', 'tổng hợp', 'đánh giá', 'nhận diện'];
        let verbScore = 0;
        activeVerbs.forEach(v => {
            if (content.includes(v)) verbScore += 15;
        });

        // Check for structure (bullet points)
        const structureScore = content.includes('-') || content.includes('*') ? 20 : 0;

        return Math.min(100, verbScore + structureScore + 50);
    }

    private assessQuality(content: string): number {
        if (!content) return 0;
        const length = content.length;
        if (length < 50) return 40;
        if (length > 2000) return 70; // Too long might be noisy
        return 90;
    }

    private assessCoherence(content: string): number {
        // Basic check for sentence end markers
        const sentenceCount = (content.match(/[.!?]/g) || []).length;
        if (sentenceCount === 0 && content.length > 50) return 50;
        return 85;
    }

    private generateSuggestions(params: RelevanceCalculationParams, score: number): string[] {
        const suggestions: string[] = [];
        if (score < 60) {
            suggestions.push(`Nội dung cho "${params.fieldType}" có vẻ chưa đúng trọng tâm.`);
        }
        if (params.content.length < 50) {
            suggestions.push("Nội dung quá ngắn, cần bổ sung thêm chi tiết từ văn bản gốc.");
        }
        return suggestions;
    }

    private getWeights(fieldType: string) {
        return { content: 40, pedagogical: 30, contextual: 15, semantic: 15 };
    }

    private getKeywordsForFieldType(fieldType: string): string[] {
        const keywordMap: Record<string, string[]> = {
            'objective': ['mục tiêu', 'cần đạt', 'phẩm chất', 'năng lực', 'kiến thức'],
            'knowledge': ['nội dung', 'kiến thức', 'định nghĩa', 'khái niệm', 'lý thuyết'],
            'activity': ['hoạt động', 'tiến trình', 'bước', 'gv', 'hs', 'nhiệm vụ'],
            'resource': ['chuẩn bị', 'thiết bị', 'đồ dùng', 'học liệu', 'phiếu học tập']
        };
        return keywordMap[fieldType] || [];
    }

    private getPatternsForFieldType(fieldType: string): RegExp[] {
        const patterns: Record<string, RegExp[]> = {
            'objective': [/năng lực/i, /phẩm chất/i, /trình bày/i, /nhận biết/i],
            'activity': [/hoạt động \d/i, /chuyển giao nhiệm vụ/i, /thực hiện nhiệm vụ/i],
            'resource': [/giáo viên/i, /học sinh/i, /máy chiếu/i, /phiếu/i]
        };
        return patterns[fieldType] || [];
    }
}
