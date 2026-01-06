
export interface ActivityScore {
    activityType: string;
    score: number;
    factors: any[];
    reasoning: string;
}

export interface RelevanceResult {
    activities: ActivityScore[];
    confidence: number;
    reasoning: string;
    suggestions: string[];
}

export class PedagogicalRelevanceEngine {
    private static instance: PedagogicalRelevanceEngine;
    private patterns = new Map<string, any>();

    private constructor() {
        this.initializePatterns();
    }

    public static getInstance(): PedagogicalRelevanceEngine {
        if (!PedagogicalRelevanceEngine.instance) {
            PedagogicalRelevanceEngine.instance = new PedagogicalRelevanceEngine();
        }
        return PedagogicalRelevanceEngine.instance;
    }

    private initializePatterns() {
        this.patterns.set('khoi_dong', {
            keywords: ['trò chơi', 'khởi động', 'giới thiệu', 'tình huống', 'gợi mở', 'rung chuông', 'đoán', 'kết nối'],
            indicators: ['tạo hứng thú', 'vấn đề', 'nhận biết'],
            weight: 0.3
        });
        this.patterns.set('kham_pha', {
            keywords: ['khám phá', 'hình thành kiến thức', 'quan sát', 'thảo luận', 'nghiên cứu', 'phân tích'],
            indicators: ['kiến thức mới', 'tìm hiểu'],
            weight: 0.35
        });
        this.patterns.set('luyen_tap', {
            keywords: ['luyện tập', 'củng cố', 'bài tập', 'thực hành', 'luyện kỹ năng', 'trả lời'],
            indicators: ['vận dụng trực tiếp', 'làm bài'],
            weight: 0.25
        });
        this.patterns.set('van_dung', {
            keywords: ['vận dụng', 'sáng tạo', 'liên hệ', 'thực tế', 'dự án', 'mở rộng'],
            indicators: ['giải quyết vấn đề', 'đời sống'],
            weight: 0.1
        });
    }

    async calculateRelevanceScore(content: string): Promise<RelevanceResult> {
        const scores: ActivityScore[] = [];
        const contentLower = content.toLowerCase();

        for (const [type, pattern] of this.patterns) {
            let score = 0;
            const factors = [];

            // Keyword matching
            const matchedKeywords = pattern.keywords.filter((k: string) => contentLower.includes(k));
            const keywordScore = (matchedKeywords.length / pattern.keywords.length) * 100;
            score += keywordScore * 0.6;
            factors.push({ type: 'keyword', value: keywordScore });

            // Indicators
            const matchedIndicators = pattern.indicators.filter((i: string) => contentLower.includes(i));
            const indicatorScore = (matchedIndicators.length / pattern.indicators.length) * 100;
            score += indicatorScore * 0.4;
            factors.push({ type: 'indicator', value: indicatorScore });

            scores.push({
                activityType: type,
                score: Math.min(100, score),
                factors,
                reasoning: `Dựa trên ${matchedKeywords.length} từ khóa và ${matchedIndicators.length} chỉ báo.`
            });
        }

        // Normalize
        const totalRaw = scores.reduce((sum, s) => sum + s.score, 0);
        const normalized = scores.map(s => ({
            ...s,
            score: totalRaw > 0 ? (s.score / totalRaw) * 100 : 25 // Default equal if zero
        }));

        return {
            activities: normalized,
            confidence: totalRaw > 0 ? 85 : 50,
            reasoning: "Phân tích tự động dựa trên mẫu 5512",
            suggestions: []
        };
    }
}
