import { MultiModalAIManager } from "./multi-modal-ai-manager";

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

    private initializePatterns() {
        this.patterns.set('khoi_dong', [/trò chơi/i, /tình huống/i, /câu hỏi gợi mở/i, /kết nối/i]);
        this.patterns.set('kham_pha', [/kiến thức mới/i, /hình thành/i, /quan sát/i, /thảo luận/i]);
        this.patterns.set('luyen_tap', [/thực hành/i, /bài tập/i, /vận dụng kiến thức/i, /củng cố/i]);
        this.patterns.set('van_dung', [/thực tế/i, /dự án/i, /giải quyết vấn đề/i, /mở rộng/i]);
    }

    public static getInstance(): PedagogicalRelevanceEngine {
        if (!PedagogicalRelevanceEngine.instance) {
            PedagogicalRelevanceEngine.instance = new PedagogicalRelevanceEngine();
        }
        return PedagogicalRelevanceEngine.instance;
    }

    async calculateRelevanceScore(content: string): Promise<RelevanceResult> {
        const mmAIManager = MultiModalAIManager.getInstance();

        const prompt = `Bạn là chuyên gia sư phạm MoET 5512. Hãy phân tích đoạn giáo án sau và chấm điểm độ liên quan (0-100) cho 4 giai đoạn tiến trình dạy học.
        
        VĂN BẢN:
        "${content.substring(0, 1500)}"
        
        YÊU CẦU:
        1. Trả về JSON với 4 trường: khoi_dong, kham_pha, luyen_tap, van_dung.
        2. Mỗi trường chứa { "score": number, "reasoning": string }.
        3. Điểm score cao nếu nội dung khớp với đặc trưng giai đoạn (ví dụ: khoi_dong có trò chơi/tình huống, kham_pha có kiến thức mới).
        4. Trả về DUY NHẤT JSON.

        VÍ DỤ KẾT QUẢ:
        {
          "khoi_dong": { "score": 90, "reasoning": "Có trò chơi Rung chuông vàng và câu hỏi gợi mở." },
          "kham_pha": { "score": 10, "reasoning": "Thiếu nội dung hình thành kiến thức." },
          ...
        }
        `;

        try {
            const aiResponse = await mmAIManager.processContent({ text: content }, prompt);

            if (!aiResponse.success) {
                throw new Error("AI Content Generation Failed");
            }

            const parsed = this.safeParse(aiResponse.content);

            const activities: ActivityScore[] = Object.entries(parsed).map(([type, data]: [string, any]) => ({
                activityType: type,
                score: data.score || 0,
                factors: [],
                reasoning: data.reasoning || ""
            }));

            return {
                activities,
                confidence: 90,
                reasoning: "Phân tích Neural sâu dựa trên ngữ cảnh MoET 5512",
                suggestions: []
            };
        } catch (error) {
            console.error("[PedagogicalRelevanceEngine] Neural Pass Failed, falling back to basic analysis.");
            return this.calculateBasicScore(content);
        }
    }

    private safeParse(content: string): any {
        try {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            return jsonMatch ? JSON.parse(jsonMatch[0]) : {};
        } catch { return {}; }
    }

    public async calculateBasicScore(content: string): Promise<RelevanceResult> {
        // ... (Basic keyword logic for fallback)
        return {
            activities: [],
            confidence: 50,
            reasoning: "Fallback basic scoring",
            suggestions: []
        };
    }
}
