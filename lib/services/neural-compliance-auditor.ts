
import { MultiModalAIManager } from "./multi-modal-ai-manager";

export interface ComplianceReport {
    score: number;
    details: {
        pedagogicalSoundness: number;
        standardsCompliance: number;
        innovation: number;
    };
    reasoning: string;
    suggestedImprovements: string[];
}

export class NeuralComplianceAuditor {
    private static instance: NeuralComplianceAuditor;
    private aiManager: MultiModalAIManager;

    private constructor() {
        this.aiManager = MultiModalAIManager.getInstance();
    }

    public static getInstance(): NeuralComplianceAuditor {
        if (!NeuralComplianceAuditor.instance) {
            NeuralComplianceAuditor.instance = new NeuralComplianceAuditor();
        }
        return NeuralComplianceAuditor.instance;
    }

    /**
     * Architecture 10.0: Deep Pedagogical Audit using AI Reasoning
     */
    async deepAudit(lessonPlan: any): Promise<ComplianceReport> {
        const prompt = `
        BẠN LÀ KIỂM TOÁN VIÊN SƯ PHẠM CAO CẤP (NEURAL COMPLIANCE AUDITOR).
        
        NHIỆM VỤ:
        Phân tích chuyên sâu Kế hoạch bài dạy (KHBD) theo chuẩn MoET 5512 và các xu hướng giáo dục hiện đại (Chuyển đổi số, NL số, Kỹ năng 21).
        
        NỘI DUNG KHBD:
        ${JSON.stringify(lessonPlan, null, 2)}
        
        TIÊU CHÍ ĐÁNH GIÁ (0-100):
        1. Tính đúng đắn sư phạm (Pedagogical Soundness): Cấu trúc 5512, sự mạch lạc giữa mục tiêu và hoạt động.
        2. Tuân thủ tiêu chuẩn (Standards Compliance): Đáp ứng các yêu cầu của chương trình GDPT 2018.
        3. Tính đổi mới sáng tạo (Innovation): Tích hợp CNTT, phương pháp dạy học tích cực.
        
        YÊU CẦU TRẢ VỀ JSON:
        {
          "score": number (trung bình),
          "details": {
            "pedagogicalSoundness": number,
            "standardsCompliance": number,
            "innovation": number
          },
          "reasoning": "Chuỗi lập luận chuyên sâu (Chain-of-Thought)",
          "suggestedImprovements": ["gợi ý 1", "gợi ý 2"]
        }
        `;

        try {
            const result = await this.aiManager.processContent({ text: "Deep Audit Request" }, prompt);
            const report = this.extractJSON(result.content);

            return report || this.getFallbackReport();
        } catch (error) {
            console.error("[NeuralComplianceAuditor] Audit Failed:", error);
            return this.getFallbackReport();
        }
    }

    private extractJSON(text: string): any {
        try {
            const jsonPart = text.match(/\{[\s\S]*\}/);
            return jsonPart ? JSON.parse(jsonPart[0]) : null;
        } catch {
            return null;
        }
    }

    private getFallbackReport(): ComplianceReport {
        return {
            score: 0,
            details: { pedagogicalSoundness: 0, standardsCompliance: 0, innovation: 0 },
            reasoning: "Không thể thực hiện kiểm toán.",
            suggestedImprovements: []
        };
    }
}
